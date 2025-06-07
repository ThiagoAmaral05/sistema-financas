import { mutation } from "./_generated/server";
import { v } from "convex/values";

// ATENÇÃO: Execute esta função apenas UMA VEZ para criar o usuário administrativo
// Depois de criar o usuário, você pode deletar este arquivo por segurança
export const createAdminUser = mutation({
  args: {},
  handler: async (ctx) => {
    // Esta função deve ser executada manualmente no Convex Dashboard
    // Para criar usuários, use o sistema de autenticação do Convex Auth
    // através do formulário de sign up na aplicação
    
    console.log("Para criar o usuário administrativo:");
    console.log("1. Use o formulário de Sign Up na aplicação");
    console.log("2. Email: admin@financas.com");
    console.log("3. Senha: suasenhasegura123");
    console.log("4. Altere a senha após o primeiro login");
    
    return "Instruções exibidas no console. Use o formulário de Sign Up na aplicação.";
  },
});
