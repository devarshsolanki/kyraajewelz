import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get all active categories
export const getCategories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("categories")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("asc")
      .collect();
  },
});

// Get category by ID
export const getCategory = query({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    const category = await ctx.db.get(args.id);
    return category?.isActive ? category : null;
  },
});

// Admin: Create category
export const createCategory = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user || user.email !== "admin@kyraajewelz.com") {
      throw new Error("Admin access required");
    }

    return await ctx.db.insert("categories", {
      ...args,
      isActive: true,
    });
  },
});

// Admin: Update category
export const updateCategory = mutation({
  args: {
    id: v.id("categories"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user || user.email !== "admin@kyraajewelz.com") {
      throw new Error("Admin access required");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

// Admin: Delete category
export const deleteCategory = mutation({
  args: { id: v.id("categories") },
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

// Seed sample data
export const seedSampleData = mutation({
  args: {},
  handler: async (ctx) => {
    const existingCategories = await ctx.db.query("categories").collect();
    if (existingCategories.length > 0) {
      return "Data already seeded";
    }

    await ctx.db.insert("categories", {
      name: "Rings",
      description: "Beautiful rings for every occasion",
      isActive: true,
    });

    await ctx.db.insert("categories", {
      name: "Necklaces", 
      description: "Elegant necklaces to complement your style",
      isActive: true,
    });

    await ctx.db.insert("categories", {
      name: "Earrings",
      description: "Stunning earrings for a perfect look", 
      isActive: true,
    });

    await ctx.db.insert("categories", {
      name: "Bracelets",
      description: "Charming bracelets for your wrist",
      isActive: true,
    });

    return "Sample categories created!";
  },
});
