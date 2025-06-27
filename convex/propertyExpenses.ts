import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const create = mutation({
  args: {
    propertyName: v.string(),
    date: v.string(),
    status: v.optional(v.union(v.literal("pago"), v.literal("a_pagar"))),
    // Campos opcionais para diferentes propriedades
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
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    const { propertyName, date, status, ...fields } = args;

    // Remove campos undefined
    const cleanFields = Object.fromEntries(
      Object.entries(fields).filter(([_, value]) => value !== undefined)
    );

    return await ctx.db.insert("propertyExpenses", {
      userId,
      propertyName,
      date,
      status: status || "a_pagar",
      ...cleanFields,
    });
  },
});

export const updateStatus = mutation({
  args: { 
    id: v.id("propertyExpenses"),
    status: v.union(v.literal("pago"), v.literal("a_pagar"))
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    const expense = await ctx.db.get(args.id);
    if (!expense || expense.userId !== userId) {
      throw new Error("Despesa não encontrada");
    }

    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const list = query({
  args: {
    propertyName: v.optional(v.string()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    let query = ctx.db
      .query("propertyExpenses")
      .withIndex("by_user", (q) => q.eq("userId", userId));

    if (args.propertyName) {
      query = ctx.db
        .query("propertyExpenses")
        .withIndex("by_user_and_property", (q) => 
          q.eq("userId", userId).eq("propertyName", args.propertyName!)
        );
    }

    const expenses = await query.order("desc").collect();

    // Filter by date range if provided
    if (args.startDate || args.endDate) {
      return expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        const start = args.startDate ? new Date(args.startDate) : new Date(0);
        const end = args.endDate ? new Date(args.endDate) : new Date();
        return expenseDate >= start && expenseDate <= end;
      });
    }

    return expenses;
  },
});

export const getByProperty = query({
  args: { propertyName: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    return await ctx.db
      .query("propertyExpenses")
      .withIndex("by_user_and_property", (q) => 
        q.eq("userId", userId).eq("propertyName", args.propertyName)
      )
      .order("desc")
      .collect();
  },
});

export const remove = mutation({
  args: { id: v.id("propertyExpenses") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    const expense = await ctx.db.get(args.id);
    if (!expense || expense.userId !== userId) {
      throw new Error("Despesa não encontrada");
    }

    await ctx.db.delete(args.id);
  },
});
