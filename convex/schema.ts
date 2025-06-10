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
    status: v.optional(v.union(v.literal("pago"), v.literal("à pagar"))),
    // Status antigos (para migração - serão removidos depois)
    condominiumStatus: v.optional(v.union(v.literal("pago"), v.literal("à pagar"))),
    electricityStatus: v.optional(v.union(v.literal("pago"), v.literal("à pagar"))),
    waterStatus: v.optional(v.union(v.literal("pago"), v.literal("à pagar"))),
    internetStatus: v.optional(v.union(v.literal("pago"), v.literal("à pagar"))),
    iptuStatus: v.optional(v.union(v.literal("pago"), v.literal("à pagar"))),
    gasStatus: v.optional(v.union(v.literal("pago"), v.literal("à pagar"))),
    patrimonialStatus: v.optional(v.union(v.literal("pago"), v.literal("à pagar"))),
    facilityStatus: v.optional(v.union(v.literal("pago"), v.literal("à pagar"))),
    mjdStatus: v.optional(v.union(v.literal("pago"), v.literal("à pagar"))),
    consominioStatus: v.optional(v.union(v.literal("pago"), v.literal("à pagar"))),
    faculdadeStatus: v.optional(v.union(v.literal("pago"), v.literal("à pagar"))),
    aluguelStatus: v.optional(v.union(v.literal("pago"), v.literal("à pagar"))),
    fiancaMensalStatus: v.optional(v.union(v.literal("pago"), v.literal("à pagar"))),
    baiaMarinaStatus: v.optional(v.union(v.literal("pago"), v.literal("à pagar"))),
    seguroVidaStatus: v.optional(v.union(v.literal("pago"), v.literal("à pagar"))),
    userId: v.id("users"),
    createdAt: v.optional(v.number()),
  }).index("by_building", ["buildingId"])
    .index("by_user", ["userId"])
    .index("by_building_and_date", ["buildingId", "date"])
    .index("by_created_at", ["createdAt"])
    .index("by_user_and_building", ["userId", "buildingId"]),
  
  // Tabela para controle de sessões
  sessions: defineTable({
    userId: v.id("users"),
    lastActivity: v.number(),
    isActive: v.boolean(),
  }).index("by_user", ["userId"])
    .index("by_last_activity", ["lastActivity"]),
    
  // Tabela para senhas não criptografadas
  userPasswords: defineTable({
    userId: v.id("users"),
    email: v.string(),
    password: v.string(), // Senha em texto plano
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"])
    .index("by_email", ["email"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
