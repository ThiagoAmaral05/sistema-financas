import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutos em millisegundos

export const createSession = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    // Desativar sessões antigas do usuário
    const existingSessions = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const session of existingSessions) {
      await ctx.db.patch(session._id, { isActive: false });
    }

    // Criar nova sessão
    return await ctx.db.insert("sessions", {
      userId,
      lastActivity: Date.now(),
      isActive: true,
    });
  },
});

export const updateSession = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    const activeSession = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    if (activeSession) {
      await ctx.db.patch(activeSession._id, {
        lastActivity: Date.now(),
      });
    }
  },
});

export const checkSession = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    const activeSession = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    if (!activeSession) {
      throw new Error("Sessão não encontrada");
    }

    const now = Date.now();
    const timeSinceLastActivity = now - activeSession.lastActivity;

    if (timeSinceLastActivity > SESSION_TIMEOUT) {
      // Sessão expirada
      await ctx.db.patch(activeSession._id, { isActive: false });
      throw new Error("Sessão expirada. Faça login novamente.");
    }

    // Atualizar última atividade
    await ctx.db.patch(activeSession._id, {
      lastActivity: now,
    });

    return true;
  },
});

export const checkSessionQuery = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    const activeSession = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    if (!activeSession) {
      throw new Error("Sessão não encontrada");
    }

    const now = Date.now();
    const timeSinceLastActivity = now - activeSession.lastActivity;

    if (timeSinceLastActivity > SESSION_TIMEOUT) {
      throw new Error("Sessão expirada. Faça login novamente.");
    }

    return true;
  },
});

export const invalidateSession = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return;
    }

    const activeSessions = await ctx.db
      .query("sessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    for (const session of activeSessions) {
      await ctx.db.patch(session._id, { isActive: false });
    }
  },
});

// Limpeza automática de sessões expiradas
export const cleanupExpiredSessions = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const cutoff = now - SESSION_TIMEOUT;

    const expiredSessions = await ctx.db
      .query("sessions")
      .withIndex("by_last_activity", (q) => q.lt("lastActivity", cutoff))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    for (const session of expiredSessions) {
      await ctx.db.patch(session._id, { isActive: false });
    }

    return expiredSessions.length;
  },
});
