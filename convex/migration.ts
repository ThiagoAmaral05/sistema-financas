import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Função para migrar dados antigos para o novo formato
export const migrateExpenseStatus = mutation({
  args: {},
  handler: async (ctx) => {
    // Buscar todas as despesas que não têm status definido
    const expenses = await ctx.db.query("expenses").collect();
    
    let migratedCount = 0;
    
    for (const expense of expenses) {
      // Se já tem status, pular
      if (expense.status) {
        continue;
      }
      
      // Determinar status baseado nos status antigos
      // Se qualquer campo tem status "pago", considerar como "pago"
      // Senão, considerar como "à pagar"
      const statusFields = [
        expense.condominiumStatus,
        expense.electricityStatus,
        expense.waterStatus,
        expense.internetStatus,
        expense.iptuStatus,
        expense.gasStatus,
        expense.patrimonialStatus,
        expense.facilityStatus,
        expense.mjdStatus,
        expense.consominioStatus,
        expense.faculdadeStatus,
        expense.aluguelStatus,
        expense.fiancaMensalStatus,
        expense.baiaMarinaStatus,
        expense.seguroVidaStatus,
      ];
      
      const hasPaidStatus = statusFields.some(status => status === "pago");
      const newStatus = hasPaidStatus ? "pago" : "à pagar";
      
      // Atualizar o registro
      await ctx.db.patch(expense._id, {
        status: newStatus,
      });
      
      migratedCount++;
    }
    
    return {
      success: true,
      migratedCount,
      message: `Migrados ${migratedCount} registros para o novo formato de status`
    };
  },
});

// Função para limpar campos antigos após migração
export const cleanupOldStatusFields = mutation({
  args: {},
  handler: async (ctx) => {
    const expenses = await ctx.db.query("expenses").collect();
    
    let cleanedCount = 0;
    
    for (const expense of expenses) {
      // Remover campos de status antigos
      const updates: any = {};
      
      if (expense.condominiumStatus !== undefined) updates.condominiumStatus = undefined;
      if (expense.electricityStatus !== undefined) updates.electricityStatus = undefined;
      if (expense.waterStatus !== undefined) updates.waterStatus = undefined;
      if (expense.internetStatus !== undefined) updates.internetStatus = undefined;
      if (expense.iptuStatus !== undefined) updates.iptuStatus = undefined;
      if (expense.gasStatus !== undefined) updates.gasStatus = undefined;
      if (expense.patrimonialStatus !== undefined) updates.patrimonialStatus = undefined;
      if (expense.facilityStatus !== undefined) updates.facilityStatus = undefined;
      if (expense.mjdStatus !== undefined) updates.mjdStatus = undefined;
      if (expense.consominioStatus !== undefined) updates.consominioStatus = undefined;
      if (expense.faculdadeStatus !== undefined) updates.faculdadeStatus = undefined;
      if (expense.aluguelStatus !== undefined) updates.aluguelStatus = undefined;
      if (expense.fiancaMensalStatus !== undefined) updates.fiancaMensalStatus = undefined;
      if (expense.baiaMarinaStatus !== undefined) updates.baiaMarinaStatus = undefined;
      if (expense.seguroVidaStatus !== undefined) updates.seguroVidaStatus = undefined;
      
      if (Object.keys(updates).length > 0) {
        await ctx.db.patch(expense._id, updates);
        cleanedCount++;
      }
    }
    
    return {
      success: true,
      cleanedCount,
      message: `Limpeza realizada em ${cleanedCount} registros`
    };
  },
});
