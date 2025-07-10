import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  systemSettings: defineTable({
    key: v.string(),
    value: v.string(),
  }).index("by_key", ["key"]),

   passwordChangeRequests: defineTable({
    userId: v.id("users"),
    username: v.string(),
    currentPasswordHash: v.string(),
    newPasswordHash: v.string(),
    status: v.union(v.literal("pending"), v.literal("completed"), v.literal("rejected")),
  }).index("by_user", ["userId"]),

  userSettings: defineTable({
    userId: v.id("users"),
    currency: v.string(),
    darkMode: v.boolean(),
    notifications: v.boolean(),
    language: v.string(),
  }).index("by_user", ["userId"]),

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
    sky: v.optional(v.number()),
    patrimonial: v.optional(v.number()),
    mouraFacility: v.optional(v.number()),
    mjb: v.optional(v.number()),
    familiaMoura: v.optional(v.number()),
    faculdade: v.optional(v.number()),
    aluguel: v.optional(v.number()),
    fiancaMensal: v.optional(v.number()),
    ipva: v.optional(v.number()),
    seguro: v.optional(v.number()),
    licenciamento: v.optional(v.number()),
    financiamento: v.optional(v.number()),
    josue: v.optional(v.number()),
    mariana: v.optional(v.number()),
    bia: v.optional(v.number()),
    caua: v.optional(v.number()),
    colinaB1: v.optional(v.number()),
    portoTrapiche: v.optional(v.number()),
    dAzur: v.optional(v.number()),
    praiaDoForte: v.optional(v.number()),
    rcMouraFacility: v.optional(v.number()),
    lanchaRole: v.optional(v.number()),
    boteCaua: v.optional(v.number()),
    salario: v.optional(v.number()),
    fgts: v.optional(v.number()),
    alimentacao: v.optional(v.number()),
    transporte: v.optional(v.number()),
    ferias: v.optional(v.number()),
    vagaLanchaRole: v.optional(v.number()),
    vagaBoteCaua: v.optional(v.number()),
    bahiaMarina: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_property", ["userId", "propertyName"])
    .index("by_user_and_date", ["userId", "date"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
