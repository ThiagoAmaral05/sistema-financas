import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

export const addExpense = mutation({
  args: {
    buildingId: v.number(),
    date: v.string(),
    // P1 - Condomínio, Luz, Água
    condominium: v.optional(v.number()),
    electricity: v.optional(v.number()),
    water: v.optional(v.number()),
    // P2, P5 - Internet
    internet: v.optional(v.number()),
    // P3 - IPTU, Gás
    iptu: v.optional(v.number()),
    gas: v.optional(v.number()),
    // P6 - Patrimonial, Facility, MJD
    patrimonial: v.optional(v.number()),
    facility: v.optional(v.number()),
    mjd: v.optional(v.number()),
    // P7 (Despesas) - Consominio, Faculdade, Aluguel, Fiança Mensal
    consominio: v.optional(v.number()),
    faculdade: v.optional(v.number()),
    aluguel: v.optional(v.number()),
    fiancaMensal: v.optional(v.number()),
    // P8 (Outros) - Baia Marina, Seguro de Vida
    baiaMarina: v.optional(v.number()),
    seguroVida: v.optional(v.number()),
    // Status único para todo o registro
    status: v.union(v.literal("pago"), v.literal("à pagar")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    // Verificar se a sessão ainda é válida
    await ctx.runMutation(api.sessions.checkSession, {});

    // Verificar se pelo menos um campo foi preenchido
    const expenseFields = Object.entries(args).filter(([key, value]) => 
      key !== 'buildingId' && key !== 'date' && key !== 'status' && 
      value !== undefined && typeof value === 'number' && value > 0
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
      mjd: args.mjd,
      consominio: args.consominio,
      faculdade: args.faculdade,
      aluguel: args.aluguel,
      fiancaMensal: args.fiancaMensal,
      baiaMarina: args.baiaMarina,
      seguroVida: args.seguroVida,
      status: args.status,
      userId,
      createdAt: Date.now(),
    });
  },
});

// Cada usuário vê apenas suas próprias despesas
export const getExpensesByBuilding = query({
  args: { buildingId: v.number() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    // Verificar se a sessão ainda é válida
    await ctx.runQuery(api.sessions.checkSessionQuery, {});

    // Retornar apenas as despesas do usuário atual para o prédio específico
    return await ctx.db
      .query("expenses")
      .withIndex("by_user_and_building", (q) => q.eq("userId", userId).eq("buildingId", args.buildingId))
      .order("desc")
      .collect();
  },
});

export const getExpensesByPeriod = query({
  args: {
    buildingId: v.optional(v.number()),
    startDate: v.string(),
    endDate: v.string(),
    status: v.optional(v.union(v.literal("pago"), v.literal("à pagar"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    // Verificar se a sessão ainda é válida
    await ctx.runQuery(api.sessions.checkSessionQuery, {});

    // Buscar apenas as despesas do usuário atual
    let expenses = await ctx.db
      .query("expenses")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Filtrar por prédio se especificado
    if (args.buildingId !== undefined) {
      expenses = expenses.filter((expense) => expense.buildingId === args.buildingId);
    }

    // Filtrar por período
    expenses = expenses.filter((expense) => {
      return expense.date >= args.startDate && expense.date <= args.endDate;
    });

    // Filtrar por status se especificado
    if (args.status) {
      expenses = expenses.filter((expense) => expense.status === args.status);
    }

    return expenses.sort((a, b) => b.date.localeCompare(a.date));
  },
});

export const updateExpenseStatus = mutation({
  args: { 
    id: v.id("expenses"),
    status: v.union(v.literal("pago"), v.literal("à pagar"))
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    // Verificar se a sessão ainda é válida
    await ctx.runMutation(api.sessions.checkSession, {});

    const expense = await ctx.db.get(args.id);
    if (!expense) {
      throw new Error("Despesa não encontrada");
    }

    // Verificar se a despesa pertence ao usuário atual
    if (expense.userId !== userId) {
      throw new Error("Você não tem permissão para alterar esta despesa");
    }
    
    await ctx.db.patch(args.id, {
      status: args.status,
    });
  },
});

export const deleteExpense = mutation({
  args: { id: v.id("expenses") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    // Verificar se a sessão ainda é válida
    await ctx.runMutation(api.sessions.checkSession, {});

    const expense = await ctx.db.get(args.id);
    if (!expense) {
      throw new Error("Despesa não encontrada");
    }

    // Verificar se a despesa pertence ao usuário atual
    if (expense.userId !== userId) {
      throw new Error("Você não tem permissão para excluir esta despesa");
    }

    await ctx.db.delete(args.id);
  },
});
