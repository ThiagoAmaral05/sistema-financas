import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const addExpense = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

     // Verificar se pelo menos um campo foi preenchido
    const expenseFields = Object.entries(args).filter(([key, value]) => 
      key !== 'buildingId' && key !== 'date' && value !== undefined && typeof value === 'number' && value > 0
    );
    
    if (expenseFields.length === 0) {
      throw new Error("Pelo menos um tipo de despesa deve ser informado");
    }

    return await ctx.db.insert("expenses", {
      buildingId: args.buildingId,
      date: args.date,
      condominium: args.condominium,
      electricity: args.electricity,
      water: args.water,
      internet: args.internet,
      iptu: args.iptu,
      gas: args.gas,
      patrimonial: args.patrimonial,
      facility: args.facility,
      mjb: args.mjb,
      condominio: args.condominio,
      faculdade: args.faculdade,
      aluguel: args.aluguel,
      fiancaMensal: args.fiancaMensal,
      baiaMarina: args.baiaMarina,
      seguroVida: args.seguroVida,
      userId,
    });
  },
});

export const getExpensesByBuilding = query({
  args: { buildingId: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db
      .query("expenses")
      .withIndex("by_building", (q) => q.eq("buildingId", args.buildingId))
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc")
      .collect();
  },
});

export const getExpensesByPeriod = query({
  args: {
    buildingId: v.optional(v.number()),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    let expenses = await ctx.db
      .query("expenses")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();

    // Filtrar por prédio se especificado
    if (args.buildingId !== undefined) {
      expenses = expenses.filter((expense) => expense.buildingId === args.buildingId);
    }

    // Filtrar por período
    expenses = expenses.filter((expense) => {
      return expense.date >= args.startDate && expense.date <= args.endDate;
    });

    return expenses.sort((a, b) => b.date.localeCompare(a.date));
  },
});

export const deleteExpense = mutation({
  args: { id: v.id("expenses") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    const expense = await ctx.db.get(args.id);
    if (!expense || expense.userId !== userId) {
      throw new Error("Despesa não encontrada ou sem permissão");
    }

    await ctx.db.delete(args.id);
  },
});
