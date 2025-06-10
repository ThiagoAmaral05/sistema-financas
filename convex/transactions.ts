import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {
    type: v.optional(v.union(v.literal("income"), v.literal("expense"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    let query = ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", userId));

    if (args.type) {
      query = ctx.db
        .query("transactions")
        .withIndex("by_user_and_type", (q) => 
          q.eq("userId", userId).eq("type", args.type!)
        );
    }

    const transactions = await query
      .order("desc")
      .take(args.limit || 50);

    return transactions;
  },
});

export const create = mutation({
  args: {
    description: v.string(),
    amount: v.number(),
    type: v.union(v.literal("income"), v.literal("expense")),
    category: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    return await ctx.db.insert("transactions", {
      userId,
      description: args.description,
      amount: args.amount,
      type: args.type,
      category: args.category,
      date: args.date,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("transactions") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    const transaction = await ctx.db.get(args.id);
    if (!transaction || transaction.userId !== userId) {
      throw new Error("Transação não encontrada");
    }

    await ctx.db.delete(args.id);
  },
});

export const getSummary = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const income = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expenses,
      balance: income - expenses,
      totalTransactions: transactions.length,
    };
  },
});
