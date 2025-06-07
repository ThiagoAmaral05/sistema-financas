import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";

const buildingConfig = {
  1: { name: "Colina B1", fields: ["condominium", "electricity", "water"] },
  2: { name: "Porto Trapiche", fields: ["condominium", "electricity", "internet"] },
  3: { name: "D'Azul", fields: ["condominium", "electricity", "iptu", "gas"] },
  4: { name: "Praia do Forte", fields: ["condominium", "electricity"] },
  5: { name: "Hangar", fields: ["condominium", "electricity", "internet"] },
  6: { name: "Andre Contador", fields: ["patrimonial", "facility", "mjb"] },
  7: { name: "Despesas Cauã", fields: ["condominio", "faculdade", "aluguel", "fiancaMensal"] },
  8: { name: "Outros", fields: ["baiaMarina", "seguroVida"] }
};

const fieldLabels: Record<string, string> = {
  condominium: "Condomínio",
  electricity: "Luz",
  water: "Água",
  internet: "Internet",
  iptu: "IPTU",
  gas: "Gás",
  patrimonial: "Patrimonial",
  facility: "Moura Facility",
  mjb: "MJB",
  condominio: "Condomínio",
  faculdade: "Faculdade",
  aluguel: "Aluguel",
  fiancaMensal: "Fiança Mensal",
  baiaMarina: "Baia Marina",
  seguroVida: "Seguro de Vida Família Moura"
};

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
      toast.error("Por favor, selecione as datas de início e fim");
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      toast.error("A data inicial deve ser anterior à data final");
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

    // Determinar quais campos incluir no CSV
    let fieldsToInclude: string[] = [];
    if (selectedBuilding) {
      const config = buildingConfig[selectedBuilding as keyof typeof buildingConfig];
      fieldsToInclude = config.fields;
    } else {
      // Se todos os prédios, incluir todos os campos
      fieldsToInclude = Object.keys(fieldLabels);
    }

    const headers = ['Data', 'Categoria', ...fieldsToInclude.map(field => fieldLabels[field]), 'Total'];
    const csvContent = [
      headers.join(','),
      ...expenses.map(expense => {
        const buildingName = buildingConfig[expense.buildingId as keyof typeof buildingConfig]?.name || `P${expense.buildingId}`;
        const values = fieldsToInclude.map(field => (expense as any)[field]?.toFixed(2) || '0.00');
        const total = fieldsToInclude.reduce((sum, field) => sum + ((expense as any)[field] || 0), 0);
        
        return [
          expense.date,
          buildingName,
          ...values,
          total.toFixed(2)
        ].join(',');
      })
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
    if (!expenses) return {};
    
    const totals: Record<string, number> = {};
    let grandTotal = 0;

    expenses.forEach(expense => {
      const config = buildingConfig[expense.buildingId as keyof typeof buildingConfig];
      if (config) {
        config.fields.forEach(field => {
          const value = (expense as any)[field] || 0;
          totals[field] = (totals[field] || 0) + value;
          grandTotal += value;
        });
      }
    });

    return { ...totals, grandTotal };
  };

  const calculateTotal = (expense: any) => {
    const config = buildingConfig[expense.buildingId as keyof typeof buildingConfig];
    if (!config) return 0;
    
    return config.fields.reduce((total, field) => total + (expense[field] || 0), 0);
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
              Categoria (Opcional)
            </label>
            <select
              value={selectedBuilding || ""}
              onChange={(e) => setSelectedBuilding(e.target.value ? parseInt(e.target.value) : undefined)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Todas as categorias</option>
              {Object.entries(buildingConfig).map(([id, config]) => (
                <option key={id} value={id}>{config.name}</option>
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
              {selectedBuilding && ` - ${buildingConfig[selectedBuilding as keyof typeof buildingConfig]?.name}`}
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
                        Categoria
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descrição
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {expenses.map((expense) => {
                      const config = buildingConfig[expense.buildingId as keyof typeof buildingConfig];
                      const filledFields = config?.fields.filter(field => (expense as any)[field]) || [];
                      const description = filledFields.map(field => 
                        `${fieldLabels[field]}: ${formatCurrency((expense as any)[field])}`
                      ).join(', ');

                      return (
                        <tr key={expense._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(expense.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {config?.name || `P${expense.buildingId}`}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {description || "Nenhum valor informado"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                            {formatCurrency(calculateTotal(expense))}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-green-50">
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-sm font-bold text-gray-900">
                        TOTAL GERAL:
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-green-700">
                        {formatCurrency((totals as any).grandTotal || 0)}
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
