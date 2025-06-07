import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";

interface BuildingManagerProps {
  buildingId: number;
}

const buildingConfig = {
  1: { 
    name: "Colina B1", 
    fields: [
      { key: "condominium", label: "Condomínio (R$)" },
      { key: "electricity", label: "Luz (R$)" },
      { key: "water", label: "Água (R$)" }
    ]
  },
  2: { 
    name: "Porto Trapiche", 
    fields: [
      { key: "condominium", label: "Condomínio (R$)" },
      { key: "electricity", label: "Luz (R$)" },
      { key: "internet", label: "Internet (R$)" }
    ]
  },
  3: { 
    name: "D'Azul", 
    fields: [
      { key: "condominium", label: "Condomínio (R$)" },
      { key: "electricity", label: "Luz (R$)" },
      { key: "iptu", label: "IPTU (R$)" },
      { key: "gas", label: "Gás (R$)" }
    ]
  },
  4: { 
    name: "Praia do Forte", 
    fields: [
      { key: "condominium", label: "Condomínio (R$)" },
      { key: "electricity", label: "Luz (R$)" }
    ]
  },
  5: { 
    name: "Hangar", 
    fields: [
      { key: "condominium", label: "Condomínio (R$)" },
      { key: "electricity", label: "Luz (R$)" },
      { key: "internet", label: "Internet (R$)" }
    ]
  },
  6: { 
    name: "Andre Contador", 
    fields: [
      { key: "patrimonial", label: "Patrimonial (R$)" },
      { key: "facility", label: "Moura Facility (R$)" },
      { key: "mjd", label: "MJD (R$)" }
    ]
  },
  7: { 
    name: "Despesas Cauã", 
    fields: [
      { key: "condominio", label: "Condomínio (R$)" },
      { key: "faculdade", label: "Faculdade (R$)" },
      { key: "aluguel", label: "Aluguel (R$)" },
      { key: "fiancaMensal", label: "Fiança Mensal (R$)" }
    ]
  },
  8: { 
    name: "Outros", 
    fields: [
      { key: "baiaMarina", label: "Baia Marina (R$)" },
      { key: "seguroVida", label: "Seguro de Vida Família Moura (R$)" }
    ]
  }
};

export function BuildingManager({ buildingId }: BuildingManagerProps) {
  const [date, setDate] = useState("");
  const [formData, setFormData] = useState<Record<string, string>>({});

  const config = buildingConfig[buildingId as keyof typeof buildingConfig];
  const expenses = useQuery(api.expenses.getExpensesByBuilding, { buildingId });
  const addExpense = useMutation(api.expenses.addExpense);
  const deleteExpense = useMutation(api.expenses.deleteExpense);

  const handleFieldChange = (fieldKey: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldKey]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast.error("A data é obrigatória");
      return;
    }

    // Verificar se pelo menos um campo foi preenchido
    const hasAnyField = Object.values(formData).some(value => value && value.trim() !== "");
    if (!hasAnyField) {
      toast.error("Pelo menos um tipo de despesa deve ser informado");
      return;
    }

    try {
      const expenseData: any = {
        buildingId,
        date,
      };

      // Adicionar apenas os campos preenchidos
      config.fields.forEach(field => {
        const value = formData[field.key];
        if (value && value.trim() !== "") {
          expenseData[field.key] = parseFloat(value);
        }
      });

      await addExpense(expenseData);

      setDate("");
      setFormData({});
      
      toast.success("Despesa adicionada com sucesso!");
    } catch (error) {
      toast.error("Erro ao adicionar despesa");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta despesa?")) {
      try {
        await deleteExpense({ id: id as any });
        toast.success("Despesa excluída com sucesso!");
      } catch (error) {
        toast.error("Erro ao excluir despesa");
      }
    }
  };

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || value === null) return "-";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateTotal = (expense: any) => {
    let total = 0;
    config.fields.forEach(field => {
      total += expense[field.key] || 0;
    });
    return total;
  };

  const getFieldValue = (expense: any, fieldKey: string) => {
    return expense[fieldKey];
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {config.name}
        </h2>
        <p className="text-gray-600">Gerenciar contas e despesas</p>
      </div>

      {/* Formulário */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Adicionar Nova Despesa
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Preencha apenas os campos das despesas que deseja registrar. A data é obrigatória.
        </p>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          {config.fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label} - Opcional
              </label>
              <input
                type="number"
                step="0.01"
                value={formData[field.key] || ""}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="0,00"
              />
            </div>
          ))}

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Adicionar Despesa
            </button>
          </div>
        </form>
      </div>

      {/* Lista de despesas */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Histórico de Despesas
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          {expenses && expenses.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  {config.fields.map((field) => (
                    <th key={field.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {field.label.replace(" (R$)", "")}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {expenses.map((expense) => (
                  <tr key={expense._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(expense.date)}
                    </td>
                    {config.fields.map((field) => (
                      <td key={field.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(getFieldValue(expense, field.key))}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatCurrency(calculateTotal(expense))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleDelete(expense._id)}
                        className="text-red-600 hover:text-red-900 font-medium"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-500">
              Nenhuma despesa cadastrada ainda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
