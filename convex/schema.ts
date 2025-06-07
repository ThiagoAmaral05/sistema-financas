import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  expenses: defineTable({
    buildingId: v.number(), // 1-8 para os prédios
    date: v.string(),
    water: v.optional(v.number()),
    electricity: v.optional(v.number()),
    condominium: v.optional(v.number()),
    userId: v.id("users"),
  }).index("by_building", ["buildingId"])
    .index("by_user", ["userId"])
    .index("by_building_and_date", ["buildingId", "date"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
