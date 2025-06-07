import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const addExpense = mutation({
  args: {
    buildingId: v.number(),
    date: v.string(),
    water: v.optional(v.number()),
    electricity: v.optional(v.number()),
    condominium: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    // Verificar se pelo menos um campo foi preenchido
    if (!args.water && !args.electricity && !args.condominium) {
      throw new Error("Pelo menos um tipo de despesa deve ser informado");
    }

    return await ctx.db.insert("expenses", {
      buildingId: args.buildingId,
      date: args.date,
      water: args.water,
      electricity: args.electricity,
      condominium: args.condominium,
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
