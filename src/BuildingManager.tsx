import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";

interface BuildingManagerProps {
  buildingId: number;
}

export function BuildingManager({ buildingId }: BuildingManagerProps) {
  const [date, setDate] = useState("");
  const [water, setWater] = useState("");
  const [electricity, setElectricity] = useState("");
  const [condominium, setCondominium] = useState("");

  const expenses = useQuery(api.expenses.getExpensesByBuilding, { buildingId });
  const addExpense = useMutation(api.expenses.addExpense);
  const deleteExpense = useMutation(api.expenses.deleteExpense);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast.error("A data é obrigatória");
      return;
    }

    // Verificar se pelo menos um campo foi preenchido
    if (!water && !electricity && !condominium) {
      toast.error("Pelo menos um tipo de despesa deve ser informado");
      return;
    }

    try {
      await addExpense({
        buildingId,
        date,
        water: water ? parseFloat(water) : undefined,
        electricity: electricity ? parseFloat(electricity) : undefined,
        condominium: condominium ? parseFloat(condominium) : undefined,
      });

      setDate("");
      setWater("");
      setElectricity("");
      setCondominium("");
      
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
    const water = expense.water || 0;
    const electricity = expense.electricity || 0;
    const condominium = expense.condominium || 0;
    return water + electricity + condominium;
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Prédio {buildingId}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Água (R$) - Opcional
            </label>
            <input
              type="number"
              step="0.01"
              value={water}
              onChange={(e) => setWater(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="0,00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Luz (R$) - Opcional
            </label>
            <input
              type="number"
              step="0.01"
              value={electricity}
              onChange={(e) => setElectricity(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="0,00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condomínio (R$) - Opcional
            </label>
            <input
              type="number"
              step="0.01"
              value={condominium}
              onChange={(e) => setCondominium(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="0,00"
            />
          </div>

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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Água
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Luz
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Condomínio
                  </th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(expense.water)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(expense.electricity)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(expense.condominium)}
                    </td>
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
