import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  expenses: defineTable({
    buildingId: v.number(), 
    date: v.string(),
    condominium: v.optional(v.number()),
    electricity: v.optional(v.number()),
    water: v.optional(v.number()),
    internet: v.optional(v.number()),
    iptu: v.optional(v.number()),
    gas: v.optional(v.number()),
    patrimonial: v.optional(v.number()),
    facility: v.optional(v.number()),
    mjb: v.optional(v.number()),
    condominio: v.optional(v.number()),
    faculdade: v.optional(v.number()),
    aluguel: v.optional(v.number()),
    fiancaMensal: v.optional(v.number()),
    baiaMarina: v.optional(v.number()),
    seguroVida: v.optional(v.number()),
    userId: v.id("users"),
  }).index("by_building", ["buildingId"])
    .index("by_user", ["userId"])
    .index("by_building_and_date", ["buildingId", "date"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
