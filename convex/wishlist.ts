import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get user's wishlist items
export const getWishlistItems = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const wishlistItems = await ctx.db
      .query("wishlist")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Get product details for each wishlist item
    const wishlistWithProducts = await Promise.all(
      wishlistItems.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        if (!product || !product.isActive) return null;

        const category = await ctx.db.get(product.categoryId);
        
        return {
          ...item,
          product: {
            ...product,
            category: category?.name || "Unknown",
          },
        };
      })
    );

    return wishlistWithProducts.filter((item): item is NonNullable<typeof item> => item !== null);
  },
});

// Add item to wishlist
export const addToWishlist = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if product exists and is active
    const product = await ctx.db.get(args.productId);
    if (!product || !product.isActive) {
      throw new Error("Product not found");
    }

    // Check if item already exists in wishlist
    const existingItem = await ctx.db
      .query("wishlist")
      .withIndex("by_user_product", (q) => 
        q.eq("userId", userId).eq("productId", args.productId)
      )
      .unique();

    if (!existingItem) {
      await ctx.db.insert("wishlist", {
        userId,
        productId: args.productId,
      });
    }
  },
});

// Remove item from wishlist
export const removeFromWishlist = mutation({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const item = await ctx.db
      .query("wishlist")
      .withIndex("by_user_product", (q) => 
        q.eq("userId", userId).eq("productId", args.productId)
      )
      .unique();

    if (item) {
      await ctx.db.delete(item._id);
    }
  },
});

// Check if product is in wishlist
export const isInWishlist = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    const item = await ctx.db
      .query("wishlist")
      .withIndex("by_user_product", (q) => 
        q.eq("userId", userId).eq("productId", args.productId)
      )
      .unique();

    return !!item;
  },
});

// Get wishlist count
export const getWishlistCount = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return 0;

    const wishlistItems = await ctx.db
      .query("wishlist")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return wishlistItems.length;
  },
});
