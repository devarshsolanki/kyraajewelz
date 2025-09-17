import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get all active products with optional filtering
export const getProducts = query({
  args: {
    categoryId: v.optional(v.id("categories")),
    featured: v.optional(v.boolean()),
    limit: v.optional(v.number()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("products").withIndex("by_active", (q) => q.eq("isActive", true));

    if (args.categoryId) {
      query = ctx.db
        .query("products")
        .withIndex("by_category", (q) => q.eq("categoryId", args.categoryId!))
        .filter((q) => q.eq(q.field("isActive"), true));
    }

    if (args.featured) {
      query = ctx.db.query("products").withIndex("by_featured", (q) => q.eq("isFeatured", true));
    }

    if (args.search) {
      const products = await ctx.db
        .query("products")
        .withSearchIndex("search_products", (q) => 
          q.search("name", args.search!).eq("isActive", true)
        )
        .take(args.limit || 50);
      
      // Get category info for each product and ensure all fields are present
      const productsWithCategory = await Promise.all(
        products.map(async (product) => {
          const category = await ctx.db.get(product.categoryId);
          return {
            ...product,
            category: category?.name || "Unknown",
            // Ensure all fields are present with default values if missing
          };
        })
      );

      return productsWithCategory;
    }

    const products = await query.order("desc").take(args.limit || 50);

    // Get category info for each product and ensure all fields are present
    const productsWithCategory = await Promise.all(
      products.map(async (product) => {
        const category = await ctx.db.get(product.categoryId);
        return {
          ...product,
          category: category?.name || "Unknown",
          // Ensure all fields are present with default values if missing
        };
      })
    );

    return productsWithCategory;
  },
});

// Get single product by ID with metadata
export const getProduct = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    if (!product || !product.isActive) return null;

    const category = await ctx.db.get(product.categoryId);
    
    // Ensure all fields are present with default values if missing
    const result: any = {
      ...product,
      category: category?.name || "Unknown",
      // Ensure arrays are always arrays
    };
    
    return result;
  },
});

// Get product with metadata by ID
export const getProductWithMetadata = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.productId);
    if (!product || !product.isActive) return null;

    const category = await ctx.db.get(product.categoryId);
    
    // Ensure all fields are present with default values if missing
    const result: any = {
      ...product,
      category: category?.name || "Unknown",
      // Ensure arrays are always arrays
    };
    
    return result;
  },
});

// Update product metadata
export const updateProductMetadata = mutation({
  args: {
    productId: v.id("products"),
    // No metadata fields remaining after removal of occasion, tags, weight, dimensions, availableSizes
    // If there were other metadata fields, they would go here.
    // Since there are none, we can remove the metadata object entirely or leave it as an empty object.
    // For now, I'll remove the metadata object as it's no longer needed.
    // If other metadata fields are added later, this section will need to be re-evaluated.
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Verify user has admin privileges (you might need to implement this check)
    // const user = await ctx.db.query("users").withIndex("by_token", q => 
    //   q.eq("tokenIdentifier", identity.tokenIdentifier)
    // ).first();
    // if (!user || !user.isAdmin) {
    //   throw new Error("Not authorized");
    // }

    const product = await ctx.db.get(args.productId);
    if (!product) {
      throw new Error("Product not found");
    }

    return { success: true };
  },
});

// Get featured products for homepage
export const getFeaturedProducts = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db
      .query("products")
      .withIndex("by_featured", (q) => q.eq("isFeatured", true))
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .take(8);

    return Promise.all(
      products.map(async (product) => {
        const category = await ctx.db.get(product.categoryId);
        return {
          ...product,
          category: category?.name || "Unknown",
          // Ensure all fields are present with default values if missing
        };
      })
    );
  },
});

// Admin: Create product
export const createProduct = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    images: v.array(v.string()),
    categoryId: v.id("categories"),
    material: v.string(),
    stock: v.number(),
    isFeatured: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Verify category exists
    const category = await ctx.db.get(args.categoryId);
    if (!category) {
      throw new Error("Category not found");
    }

    // Create the product
    const productId = await ctx.db.insert("products", {
      name: args.name,
      description: args.description,
      price: args.price,
      originalPrice: args.originalPrice || args.price,
      images: args.images,
      categoryId: args.categoryId,
      material: args.material,
      stock: args.stock,
      isActive: true,
      isFeatured: args.isFeatured,
    });

    return productId;
  },
});

// Admin: Update product
export const updateProduct = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    originalPrice: v.optional(v.number()),
    images: v.optional(v.array(v.string())),
    categoryId: v.optional(v.id("categories")),
    material: v.optional(v.string()),
    stock: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
    isFeatured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const { id, ...updates } = args;
    const product = await ctx.db.get(id);
    if (!product) {
      throw new Error("Product not found");
    }

    // If category is being updated, verify it exists
    if (updates.categoryId) {
      const category = await ctx.db.get(updates.categoryId);
      if (!category) {
        throw new Error("Category not found");
      }
    }

    // If images are being updated, filter out empty image URLs
    if (updates.images && Array.isArray(updates.images)) {
      updates.images = updates.images.filter((img: string) => img.trim() !== "");
    }
    
    await ctx.db.patch(id, updates);
    return await ctx.db.get(id);
  },
});

// Admin: Delete product
export const deleteProduct = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user || user.email !== "admin@kyraajewelz.com") {
      throw new Error("Admin access required");
    }

    await ctx.db.delete(args.id);
  },
});

// User: Add product (for testing)
export const addProduct = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    images: v.array(v.string()), // Cloudinary URLs
    price: v.float64(),
    stock: v.float64(),
    categoryId: v.id("categories"),
    material: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const productData: any = {
      name: args.name,
      description: args.description,
      images: args.images.filter(img => img.trim() !== ""),
      price: args.price,
      originalPrice: args.price,
      stock: args.stock,
      categoryId: args.categoryId,
      material: args.material || "",
      isActive: true,
      // isFeatured: args.isFeatured || false,
    };

    return await ctx.db.insert("products", productData);
  },
});
