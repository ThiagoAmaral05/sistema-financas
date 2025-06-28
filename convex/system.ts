import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getSystemLogo = query({
  args: {},
  handler: async (ctx) => {
    const logoSetting = await ctx.db
      .query("systemSettings")
      .withIndex("by_key", (q) => q.eq("key", "company_logo"))
      .first();
    
    if (logoSetting && logoSetting.value) {
      // Get the signed URL for the logo
      return await ctx.storage.getUrl(logoSetting.value as any);
    }
    
    return null;
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const updateSystemLogo = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    // Check if logo setting exists
    const existingLogo = await ctx.db
      .query("systemSettings")
      .withIndex("by_key", (q) => q.eq("key", "company_logo"))
      .first();
    
    if (existingLogo) {
      await ctx.db.patch(existingLogo._id, {
        value: args.storageId,
      });
    } else {
      await ctx.db.insert("systemSettings", {
        key: "company_logo",
        value: args.storageId,
      });
    }
  },
});
