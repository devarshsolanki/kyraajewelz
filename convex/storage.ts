import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Generate a URL for uploading a file
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

// Save storage ID to a product
export const saveStorageId = mutation({
  args: {
    storageId: v.string(),
    productId: v.id("products"),
    index: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const product = await ctx.db.get(args.productId);
    if (!product) {
      throw new Error("Product not found");
    }

    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) {
      throw new Error("Failed to get storage URL");
    }

    // If index is provided, update the specific image in the array
    if (typeof args.index === 'number') {
      const updatedImages = [...product.images];
      updatedImages[args.index] = url;
      await ctx.db.patch(args.productId, { images: updatedImages });
    } else {
      // Otherwise, append the new image
      await ctx.db.patch(args.productId, {
        images: [...product.images, url],
      });
    }

    return url;
  },
});
