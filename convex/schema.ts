import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  systemSettings: defineTable({
    key: v.string(),
    value: v.string(),
  }).index("by_key", ["key"]),
  
  transactions: defineTable({
    userId: v.id("users"),
    description: v.string(),
    amount: v.number(),
    type: v.union(v.literal("income"), v.literal("expense")),
    category: v.string(),
    date: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_type", ["userId", "type"])
    .index("by_user_and_date", ["userId", "date"]),

  categories: defineTable({
    userId: v.id("users"),
    name: v.string(),
    type: v.union(v.literal("income"), v.literal("expense")),
    color: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_type", ["userId", "type"]),

  propertyExpenses: defineTable({
    userId: v.id("users"),
    propertyName: v.string(),
    date: v.string(),
    status: v.optional(v.union(v.literal("pago"), v.literal("a_pagar"))),
    // Campos dinâmicos baseados na propriedade
    condominio: v.optional(v.number()),
    luz: v.optional(v.number()),
    agua: v.optional(v.number()),
    internet: v.optional(v.number()),
    gas: v.optional(v.number()),
    iptu: v.optional(v.number()),
    patrimonial: v.optional(v.number()),
    mouraFacility: v.optional(v.number()),
    mjb: v.optional(v.number()),
    rangerSport: v.optional(v.number()),
    bmwX3: v.optional(v.number()),
    bmwX1: v.optional(v.number()),
    nivus: v.optional(v.number()),
    tCross: v.optional(v.number()),
    rangerEvoque: v.optional(v.number()),
    faculdade: v.optional(v.number()),
    aluguel: v.optional(v.number()),
    fiancaMensal: v.optional(v.number()),
    josue: v.optional(v.number()),
    mariana: v.optional(v.number()),
    bia: v.optional(v.number()),
    caua: v.optional(v.number()),
    colinaB1: v.optional(v.number()),
    portoTrapiche: v.optional(v.number()),
    dAzul: v.optional(v.number()),
    praiaDoForte: v.optional(v.number()),
    rcMouraFacility: v.optional(v.number()),
    lanchaRole: v.optional(v.number()),
    lanchaCaua: v.optional(v.number()),
    baiaMarina: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_property", ["userId", "propertyName"])
    .index("by_user_and_date", ["userId", "date"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
