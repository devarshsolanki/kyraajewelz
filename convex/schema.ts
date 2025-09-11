import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// Define users table with extra fields
const users = defineTable({
  name: v.optional(v.string()),
  email: v.optional(v.string()),
  phone: v.optional(v.string()),
  address: v.optional(v.string()),
  image: v.optional(v.string()),
  emailVerificationTime: v.optional(v.number()),
  phoneVerificationTime: v.optional(v.number()),
  isAnonymous: v.optional(v.boolean()),
})
  .index("by_email", ["email"]); // <-- Add this line

const applicationTables = {
  categories: defineTable({
    name: v.string(),
    description: v.string(),
    image: v.optional(v.string()),
    isActive: v.boolean(),
  }),

  products: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(),
    originalPrice: v.optional(v.number()),
    images: v.array(v.string()),
    categoryId: v.id("categories"),
    material: v.string(),
    stock: v.number(),
    isActive: v.boolean(),
    isFeatured: v.boolean(),
    // Product metadata fields
    occasion: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    weight: v.optional(v.string()),
    dimensions: v.optional(v.string()),
  })
    .index("by_category", ["categoryId"])
    .index("by_featured", ["isFeatured"])
    .index("by_active", ["isActive"])
    .searchIndex("search_products", {
      searchField: "name",
      filterFields: ["categoryId", "isActive"],
    }),

  cart: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    quantity: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_product", ["userId", "productId"]),

  wishlist: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
  })
    .index("by_user", ["userId"])
    .index("by_user_product", ["userId", "productId"]),

  orders: defineTable({
    userId: v.id("users"),
    orderNumber: v.string(),
    items: v.array(v.object({
      productId: v.id("products"),
      productName: v.string(),
      productImage: v.string(),
      quantity: v.number(),
      price: v.number(),
    })),
    totalAmount: v.number(),
    status: v.string(), // pending, confirmed, shipped, delivered, cancelled
    shippingAddress: v.object({
      fullName: v.string(),
      address: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      phone: v.string(),
    }),
    paymentStatus: v.string(), // pending, paid, failed, refunded
    paymentId: v.optional(v.string()),
    trackingNumber: v.optional(v.string()),
    notes: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_order_number", ["orderNumber"]),

  reviews: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    rating: v.number(),
    comment: v.string(),
    isVerified: v.boolean(),
  })
    .index("by_product", ["productId"])
    .index("by_user", ["userId"]),

  settings: defineTable({
    key: v.string(),
    value: v.string(),
  })
    .index("by_key", ["key"]),
};

export default defineSchema({
  ...authTables,
  users,
  ...applicationTables,
});
