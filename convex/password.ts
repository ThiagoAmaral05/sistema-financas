import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const requestPasswordChange = mutation({
  args: {
    username: v.string(),
    currentPassword: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    // In a real implementation, you would verify the current password
    // For now, we'll create a password change request
    await ctx.db.insert("passwordChangeRequests", {
      userId,
      username: args.username,
      currentPasswordHash: args.currentPassword, // In production, hash this
      newPasswordHash: args.newPassword, // In production, hash this
      status: "pending",
    });

    return { success: true, message: "Solicitação de alteração de senha enviada" };
  },
});
