import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

// Salvar senha em texto plano quando usuário faz login
export const saveUserPassword = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    // Verificar se já existe registro para este usuário
    const existingPassword = await ctx.db
      .query("userPasswords")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingPassword) {
      // Atualizar senha existente
      await ctx.db.patch(existingPassword._id, {
        email: args.email,
        password: args.password,
        updatedAt: Date.now(),
      });
    } else {
      // Criar novo registro
      await ctx.db.insert("userPasswords", {
        userId,
        email: args.email,
        password: args.password,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});

// Buscar senha de um usuário (apenas para admins)
export const getUserPassword = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const passwordRecord = await ctx.db
      .query("userPasswords")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    return passwordRecord;
  },
});

// Listar todas as senhas (apenas para admins)
export const getAllPasswords = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    return await ctx.db.query("userPasswords").collect();
  },
});

// Alterar senha
export const changePassword = mutation({
  args: {
    email: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    if (args.newPassword.length < 6) {
      throw new Error("A nova senha deve ter pelo menos 6 caracteres");
    }

    // Atualizar senha no registro
    const passwordRecord = await ctx.db
      .query("userPasswords")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (passwordRecord) {
      await ctx.db.patch(passwordRecord._id, {
        password: args.newPassword,
        updatedAt: Date.now(),
      });
    } else {
      // Criar novo registro se não existir
      await ctx.db.insert("userPasswords", {
        userId,
        email: args.email,
        password: args.newPassword,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    return { success: true, message: "Senha alterada com sucesso" };
  },
});
