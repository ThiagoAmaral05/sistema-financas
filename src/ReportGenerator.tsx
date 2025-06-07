import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export function ReportGenerator() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedBuilding, setSelectedBuilding] = useState<number | undefined>(undefined);
  const [showReport, setShowReport] = useState(false);

  const expenses = useQuery(
    api.expenses.getExpensesByPeriod,
    showReport && startDate && endDate
      ? { startDate, endDate, buildingId: selectedBuilding }
      : "skip"
  );

  const handleGenerateReport = () => {
    if (!startDate || !endDate) {
      alert("Por favor, selecione as datas de início e fim");
      return;
    }
    setShowReport(true);
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

  const exportToCSV = () => {
    if (!expenses || expenses.length === 0) return;

    const headers = ['Data', 'Prédio', 'Água', 'Luz', 'Condomínio', 'Total'];
    const csvContent = [
      headers.join(','),
      ...expenses.map(expense => [
        expense.date,
        `Prédio ${expense.buildingId}`,
        expense.water?.toFixed(2) || '0.00',
        expense.electricity?.toFixed(2) || '0.00',
        expense.condominium?.toFixed(2) || '0.00',
        ((expense.water || 0) + (expense.electricity || 0) + (expense.condominium || 0)).toFixed(2)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_${startDate}_${endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTotals = () => {
    if (!expenses) return { water: 0, electricity: 0, condominium: 0, total: 0 };
    
    return expenses.reduce((acc, expense) => ({
      water: acc.water + (expense.water || 0),
      electricity: acc.electricity + (expense.electricity || 0),
      condominium: acc.condominium + (expense.condominium || 0),
      total: acc.total + (expense.water || 0) + (expense.electricity || 0) + (expense.condominium || 0)
    }), { water: 0, electricity: 0, condominium: 0, total: 0 });
  };

  const calculateTotal = (expense: any) => {
    const water = expense.water || 0;
    const electricity = expense.electricity || 0;
    const condominium = expense.condominium || 0;
    return water + electricity + condominium;
  };

  const totals = getTotals();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Gerador de Relatórios
        </h2>
        <p className="text-gray-600">
          Gere planilhas com as despesas por período
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Filtros do Relatório
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Inicial
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Final
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prédio (Opcional)
            </label>
            <select
              value={selectedBuilding || ""}
              onChange={(e) => setSelectedBuilding(e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Todos os prédios</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>Prédio {num}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={handleGenerateReport}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Gerar Relatório
          </button>
          
          {showReport && expenses && expenses.length > 0 && (
            <button
              onClick={exportToCSV}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Exportar CSV
            </button>
          )}
        </div>
      </div>

      {/* Relatório */}
      {showReport && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Relatório de {formatDate(startDate)} até {formatDate(endDate)}
              {selectedBuilding && ` - Prédio ${selectedBuilding}`}
            </h3>
          </div>
          
          {expenses && expenses.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prédio
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
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {expenses.map((expense) => (
                      <tr key={expense._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(expense.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Prédio {expense.buildingId}
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
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-green-50">
                    <tr>
                      <td colSpan={2} className="px-6 py-4 text-sm font-bold text-gray-900">
                        TOTAIS:
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-green-700">
                        {formatCurrency(totals.water)}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-green-700">
                        {formatCurrency(totals.electricity)}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-green-700">
                        {formatCurrency(totals.condominium)}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-green-700">
                        {formatCurrency(totals.total)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-500">
              Nenhuma despesa encontrada no período selecionado.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
