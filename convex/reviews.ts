import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Create a new review
export const createReview = mutation({
  args: {
    productId: v.id("products"),
    rating: v.number(),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Fetch delivered orders for the user and check items in JS
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "delivered"))
      .collect();

    const hasPurchasedAndDelivered = orders.some((order: any) =>
      Array.isArray(order.items) &&
      order.items.some((item: any) => String(item.productId) === String(args.productId))
    );

    if (!hasPurchasedAndDelivered) {
      throw new Error("You can only review products you have purchased and received.");
    }

    // Check if the user has already reviewed this product
    const existingReview = await ctx.db
      .query("reviews")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("productId"), args.productId))
      .first();

    if (existingReview) {
      throw new Error("You have already reviewed this product.");
    }

    // Validate rating
    if (args.rating < 1 || args.rating > 5) {
      throw new Error("Rating must be between 1 and 5.");
    }

    await ctx.db.insert("reviews", {
      userId,
      productId: args.productId,
      rating: args.rating,
      comment: args.comment,
      isVerified: true,
    });
  },
});

// Get all reviews for a specific product
export const getReviewsForProduct = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .order("desc")
      .collect();

    const reviewsWithUsers = await Promise.all(
      reviews.map(async (review) => {
        const user = await ctx.db.get(review.userId);
        return {
          ...review,
          userName: user?.name || "Anonymous",
        };
      })
    );

    return reviewsWithUsers;
  },
});

// Get average rating for a product
export const getAverageRating = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const reviews = await ctx.db
      .query("reviews")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .collect();

    if (reviews.length === 0) {
      return { averageRating: 0, reviewCount: 0 };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    return { averageRating, reviewCount: reviews.length };
  },
});

// Check if the current user can review a specific product
export const canUserReviewProduct = query({
  args: { productId: v.id("products") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return false;

    // Fetch delivered orders for the user and check items in JS
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "delivered"))
      .collect();

    const hasPurchasedAndDelivered = orders.some((order: any) =>
      Array.isArray(order.items) &&
      order.items.some((item: any) => String(item.productId) === String(args.productId))
    );

    if (!hasPurchasedAndDelivered) {
      return false;
    }

    const existingReview = await ctx.db
      .query("reviews")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("productId"), args.productId))
      .first();

    return !existingReview;
  },
});

// Get pending review items for the logged in user (delivered orders with items not yet reviewed)
export const getPendingReviewItems = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "delivered"))
      .collect();

    const pending: any[] = [];

    for (const order of orders) {
      if (!Array.isArray(order.items)) continue;
      for (const item of order.items) {
        // Check if a review exists for this product by this user
        const existingReview = await ctx.db
          .query("reviews")
          .withIndex("by_user", (q) => q.eq("userId", userId))
          .filter((q) => q.eq(q.field("productId"), item.productId))
          .first();

        if (!existingReview) {
          // Include product snapshot to show in UI
          const product = await ctx.db.get(item.productId);
          pending.push({
            orderId: order._id,
            productId: item.productId,
            product,
            quantity: item.quantity ?? 1,
          });
        }
      }
    }

    return pending;
  },
});