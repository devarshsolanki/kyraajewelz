import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Create order
export const createOrder = mutation({
  args: {
    items: v.array(v.object({
      productId: v.id("products"),
      quantity: v.number(),
    })),
    shippingAddress: v.object({
      fullName: v.string(),
      address: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      phone: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Generate order number
    const orderNumber = `KJ${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Get product details and calculate total
    let totalAmount = 0;
    const orderItems = await Promise.all(
      args.items.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        if (!product || !product.isActive) {
          throw new Error(`Product ${item.productId} not found`);
        }

        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        return {
          productId: item.productId,
          productName: product.name,
          productImage: product.images[0] || "",
          quantity: item.quantity,
          price: product.price,
        };
      })
    );

    // Create order
    const orderId = await ctx.db.insert("orders", {
      userId,
      orderNumber,
      items: orderItems,
      totalAmount,
      status: "pending",
      shippingAddress: args.shippingAddress,
      paymentStatus: "pending",
    });

    // Clear cart after order creation
    const cartItems = await ctx.db
      .query("cart")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    await Promise.all(
      cartItems.map((item) => ctx.db.delete(item._id))
    );

    return { orderId, orderNumber };
  },
});

// Get user's orders
export const getUserOrders = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    return await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

// Get order by ID
export const getOrder = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const order = await ctx.db.get(args.orderId);
    if (!order || order.userId !== userId) {
      throw new Error("Order not found");
    }

    return order;
  },
});

// Admin: Get all orders
export const getAllOrders = query({
  args: {
    status: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user || user.email !== "admin@kyraajewelz.com") {
      throw new Error("Admin access required");
    }

    if (args.status) {
      return await ctx.db
        .query("orders")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .take(args.limit || 50);
    }

    const query = ctx.db.query("orders");

    return await query.order("desc").take(args.limit || 50);
  },
});

// Admin: Update order status
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.string(),
    trackingNumber: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db.get(userId);
    if (!user || user.email !== "admin@kyraajewelz.com") {
      throw new Error("Admin access required");
    }

    const { orderId, ...updates } = args;
    await ctx.db.patch(orderId, updates);
  },
});

// Update payment status
export const updatePaymentStatus = mutation({
  args: {
    orderId: v.id("orders"),
    paymentStatus: v.string(),
    paymentId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { orderId, ...updates } = args;
    await ctx.db.patch(orderId, updates);
  },
});

// Cancel order
export const cancelOrder = mutation({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");
    if (order.userId !== userId) throw new Error("Unauthorized");

    // Only allow cancellation if not already cancelled or delivered
    if (order.status === "cancelled" || order.status === "delivered") {
      throw new Error("Order cannot be cancelled");
    }

    await ctx.db.patch(args.orderId, { status: "cancelled" });
    return "Order cancelled";
  },
});
