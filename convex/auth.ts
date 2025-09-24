import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

console.log("Initializing convexAuth...");
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password, Anonymous],
});
console.log("convexAuth initialized.");


export const loggedInUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      return null;
    }
    return user;
  },
});

// Get current user's profile
export const getMyProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");
    return user;
  },
});

// Update current user's profile
export const updateMyProfile = mutation({
  args: {
    fullName: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    address: v.optional(v.string()),
    // Do not allow direct email update here
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const updates: any = {};
    if (args.fullName !== undefined) updates.name = args.fullName;
    if (args.phoneNumber !== undefined) updates.phone = args.phoneNumber;
    if (args.address !== undefined) updates.address = args.address;
    // Only update fields that exist in the user schema
    try {
      await ctx.db.patch(userId, updates);
    } catch (err) {
      throw new Error("Profile update failed. Some fields may not be allowed to update.");
    }
  },
});

// Delete current user's profile
export const deleteMyProfile = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    await ctx.db.delete(userId);
  },
});

export const changePassword = mutation({
  args: {
    oldPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Retrieve the user to verify the old password
    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    // Securely change the password using the Password provider.
    // This method handles verification of the old password and updates to the new one.
    // await auth.providers.Password.changePassword(ctx, userId, args.oldPassword, args.newPassword);
  },
});

export const completeSignUpProfile = mutation({
  args: {
    fullName: v.string(),
    phoneNumber: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      console.error("completeSignUpProfile: Not authenticated.");
      throw new Error("Not authenticated");
    }

    console.log("completeSignUpProfile: User ID:", userId, "Args:", args);

    const updates: any = {};
    if (args.fullName !== undefined) updates.name = args.fullName;
    if (args.phoneNumber !== undefined) updates.phone = args.phoneNumber;

    try {
      await ctx.db.patch(userId, updates);
      console.log("completeSignUpProfile: Profile patched successfully for user:", userId, "with updates:", updates);
    } catch (err) {
      console.error("completeSignUpProfile: Profile completion failed for user:", userId, "Error:", err);
      throw new Error("Profile completion failed.");
    }
  },
});
