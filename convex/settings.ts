import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUserSettings = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return {
        currency: "BRL",
        darkMode: false,
        notifications: true,
        language: "pt-BR",
      };
    }

    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!settings) {
      return {
        currency: "BRL",
        darkMode: false,
        notifications: true,
        language: "pt-BR",
      };
    }

    return settings;
  },
});

export const initializeUserSettings = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existingSettings = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!existingSettings) {
      await ctx.db.insert("userSettings", {
        userId,
        currency: "BRL",
        darkMode: false,
        notifications: true,
        language: "pt-BR",
      });
    }
  },
});

export const updateSettings = mutation({
  args: {
    currency: v.optional(v.string()),
    darkMode: v.optional(v.boolean()),
    notifications: v.optional(v.boolean()),
    language: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const settings = await ctx.db
      .query("userSettings")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (!settings) {
      return await ctx.db.insert("userSettings", {
        userId,
        currency: args.currency || "BRL",
        darkMode: args.darkMode || false,
        notifications: args.notifications || true,
        language: args.language || "pt-BR",
      });
    }

    return await ctx.db.patch(settings._id, args);
  },
});
