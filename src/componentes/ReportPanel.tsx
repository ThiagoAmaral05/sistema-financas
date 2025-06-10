import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

// Configuração dos campos para cada propriedade
const propertyFields = {
  "Colina B1": ["condominio", "luz", "agua"],
  "Porto Trapiche": ["condominio", "luz", "internet"],
  "D'Azul": ["condominio", "luz", "gas", "iptu"],
  "Praia do Forte": ["condominio", "luz"],
  "Hangar": ["condominio", "luz", "internet"],
  "Andre Contador": ["condominio", "luz", "internet"],
  "Automoveis": ["carro1", "carro2", "carro3"],
  "Despesas Cauã": ["condominio", "faculdade", "aluguel", "fiancaMensal"],
  "Seguro de Vida Familia Moura": ["josue", "mariana", "bia", "caua"],
  "Seguro Patrimonial": ["colinaB1", "portoTrapiche", "dAzul", "praiaDoForte", "rcMouraFacility", "lanchaRole", "lanchaCaua"],
  "Outros": ["baiaMarina"],
};

const fieldLabels = {
  condominio: "Condomínio",
  luz: "Luz",
  agua: "Água",
  internet: "Internet",
  gas: "Gás",
  iptu: "IPTU",
  carro1: "Carro 1",
  carro2: "Carro 2",
  carro3: "Carro 3",
  faculdade: "Faculdade",
  aluguel: "Aluguel",
  fiancaMensal: "Fiança Mensal",
  josue: "Josué",
  mariana: "Mariana",
  bia: "Bia",
  caua: "Cauã",
  colinaB1: "Colina B1",
  portoTrapiche: "Porto Trapiche",
  dAzul: "D'Azul",
  praiaDoForte: "Praia do Forte",
  rcMouraFacility: "RC Moura Facility",
  lanchaRole: "Lancha Rolé",
  lanchaCaua: "Lancha Cauã",
  baiaMarina: "Baia Marina",
};

export function ReportPanel() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const expenses = useQuery(api.propertyExpenses.list, {
    propertyName: selectedProperty || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  const properties = [
    "Colina B1", "Porto Trapiche", "D'Azul", "Praia do Forte",
    "Hangar", "Andre Contador", "Automoveis", "Despesas Cauã",
    "Seguro de Vida Familia Moura", "Seguro Patrimonial", "Outros"
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const getTotal = (expense: any) => {
    const fields = propertyFields[expense.propertyName as keyof typeof propertyFields] || [];
    return fields.reduce((total, field) => {
      const value = (expense as any)[field];
      return total + (value || 0);
    }, 0);
  };

  const getExpenseFields = (expense: any) => {
    const fields = propertyFields[expense.propertyName as keyof typeof propertyFields] || [];
    return fields.filter(field => (expense as any)[field] !== undefined && (expense as any)[field] !== null);
  };

  // Filtrar por status se selecionado
  const filteredExpenses = expenses?.filter(expense => {
    if (!selectedStatus) return true;
    return (expense.status || "a_pagar") === selectedStatus;
  }) || [];

  const generateCSV = () => {
    if (!filteredExpenses || filteredExpenses.length === 0) {
      toast.error("Nenhum dado encontrado para gerar relatório");
      return;
    }

    // Cabeçalhos dinâmicos baseados nos dados
    const allFields = new Set<string>();
    filteredExpenses.forEach(expense => {
      const fields = getExpenseFields(expense);
      fields.forEach(field => allFields.add(field));
    });

    const headers = ["Data", "Categoria", "Status", ...Array.from(allFields).map(field => fieldLabels[field as keyof typeof fieldLabels]), "Total"];
    
    // Criar conteúdo CSV com formatação adequada para Excel
    const csvRows = [
      headers.join(";"), // Usar ponto e vírgula como separador para Excel brasileiro
      ...filteredExpenses.map(expense => {
        const row = [
          new Date(expense.date).toLocaleDateString('pt-BR'),
          `"${expense.propertyName}"`, // Aspas para nomes com espaços
          (expense.status || "a_pagar") === "pago" ? "Pago" : "À Pagar",
        ];
        
        // Adicionar valores dos campos
        Array.from(allFields).forEach(field => {
          const value = (expense as any)[field];
          // Formatar números com vírgula decimal para Excel brasileiro
          row.push(value ? value.toFixed(2).replace('.', ',') : "0,00");
        });
        
        row.push(getTotal(expense).toFixed(2).replace('.', ','));
        return row.join(";");
      })
    ];

    // Adicionar linha de totais
    const columnTotals = getColumnTotals();
    const totalRow = [
      "TOTAL GERAL",
      "",
      "",
      ...Array.from(allFields).map(field => columnTotals[field].toFixed(2).replace('.', ',')),
      getTotalsByStatus().total.toFixed(2).replace('.', ',')
    ];
    csvRows.push(totalRow.join(";"));

    const csvContent = csvRows.join("\n");

    // Adicionar BOM para UTF-8 para garantir acentos corretos no Excel
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio_despesas_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Relatório gerado com sucesso!");
  };

  const getTotalsByStatus = () => {
    if (!filteredExpenses) return { pago: 0, aPagar: 0, total: 0, pagoCount: 0, aPagarCount: 0 };
    
    return filteredExpenses.reduce((acc, expense) => {
      const total = getTotal(expense);
      const isPago = (expense.status || "a_pagar") === "pago";
      return {
        pago: acc.pago + (isPago ? total : 0),
        aPagar: acc.aPagar + (!isPago ? total : 0),
        total: acc.total + total,
        pagoCount: acc.pagoCount + (isPago ? 1 : 0),
        aPagarCount: acc.aPagarCount + (!isPago ? 1 : 0)
      };
    }, { pago: 0, aPagar: 0, total: 0, pagoCount: 0, aPagarCount: 0 });
  };

  const getColumnTotals = () => {
    if (!filteredExpenses) return {};
    
    const allFields = new Set<string>();
    filteredExpenses.forEach(expense => {
      const fields = getExpenseFields(expense);
      fields.forEach(field => allFields.add(field));
    });

    const columnTotals: Record<string, number> = {};
    Array.from(allFields).forEach(field => {
      columnTotals[field] = filteredExpenses.reduce((total, expense) => {
        const value = (expense as any)[field];
        return total + (value || 0);
      }, 0);
    });

    return columnTotals;
  };

  const totals = getTotalsByStatus();
  const columnTotals = getColumnTotals();

  const formatDateRange = () => {
    if (!startDate && !endDate) return "";
    if (startDate && endDate) {
      return `de ${new Date(startDate).toLocaleDateString('pt-BR')} até ${new Date(endDate).toLocaleDateString('pt-BR')}`;
    }
    if (startDate) {
      return `a partir de ${new Date(startDate).toLocaleDateString('pt-BR')}`;
    }
    if (endDate) {
      return `até ${new Date(endDate).toLocaleDateString('pt-BR')}`;
    }
    return "";
  };

  // Só mostrar dados se AMBAS as datas estiverem preenchidas
  const shouldShowData = startDate && endDate;

  if (expenses === undefined) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Relatórios</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div>
            <label htmlFor="property" className="block text-sm font-medium text-gray-700 mb-2">
              Categoria
            </label>
            <select
              id="property"
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Todas as categorias</option>
              {properties.map((property) => (
                <option key={property} value={property}>
                  {property}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Todos os status</option>
              <option value="pago">Pago</option>
              <option value="a_pagar">À Pagar</option>
            </select>
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
              Data Inicial *
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
              Data Final *
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={generateCSV}
              disabled={!shouldShowData}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              📊 Gerar Planilha
            </button>
          </div>
        </div>

        {shouldShowData && (
          <>
            {/* Título do Relatório */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Relatório {formatDateRange()}
              </h3>
            </div>

            {/* Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Total Pago</p>
                    <p className="text-2xl font-bold text-green-700">{formatCurrency(totals.pago)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-green-600">{totals.pagoCount}</p>
                    <p className="text-xs text-green-500">registros</p>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">Total À Pagar</p>
                    <p className="text-2xl font-bold text-red-700">{formatCurrency(totals.aPagar)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-red-600">{totals.aPagarCount}</p>
                    <p className="text-xs text-red-500">registros</p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Geral</p>
                    <p className="text-2xl font-bold text-blue-700">{formatCurrency(totals.total)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-blue-600">{totals.pagoCount + totals.aPagarCount}</p>
                    <p className="text-xs text-blue-500">registros</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Dados */}
      {shouldShowData && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              Dados Encontrados ({filteredExpenses.length} registros)
            </h3>
          </div>
          <div className="p-6">
            {filteredExpenses.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Nenhum registro encontrado para os filtros selecionados.
              </p>
            ) : (
              <>
                {/* Tabela Completa */}
                <div className="overflow-x-auto mb-6">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Data</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Categoria</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-900">Status</th>
                        {Object.keys(columnTotals).map(field => (
                          <th key={field} className="text-right py-3 px-4 font-semibold text-gray-900">
                            {fieldLabels[field as keyof typeof fieldLabels]}
                          </th>
                        ))}
                        <th className="text-right py-3 px-4 font-semibold text-gray-900">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExpenses.map((expense) => {
                        const expenseFields = getExpenseFields(expense);
                        const total = getTotal(expense);
                        
                        return (
                          <tr key={expense._id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              {new Date(expense.date).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="py-3 px-4 font-medium">{expense.propertyName}</td>
                            <td className="py-3 px-4 text-center">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                (expense.status || "a_pagar") === "pago"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}>
                                {(expense.status || "a_pagar") === "pago" ? "✅ Pago" : "❌ À Pagar"}
                              </span>
                            </td>
                            {Object.keys(columnTotals).map(field => (
                              <td key={field} className="py-3 px-4 text-right">
                                {(expense as any)[field] ? formatCurrency((expense as any)[field]) : "-"}
                              </td>
                            ))}
                            <td className="py-3 px-4 text-right font-semibold">
                              {formatCurrency(total)}
                            </td>
                          </tr>
                        );
                      })}
                      {/* Linha de Totais */}
                      <tr className="border-t-2 border-gray-300 bg-gray-50 font-semibold">
                        <td className="py-3 px-4 font-bold">TOTAL GERAL</td>
                        <td className="py-3 px-4"></td>
                        <td className="py-3 px-4"></td>
                        {Object.keys(columnTotals).map(field => (
                          <td key={field} className="py-3 px-4 text-right font-bold text-blue-700">
                            {formatCurrency(columnTotals[field])}
                          </td>
                        ))}
                        <td className="py-3 px-4 text-right font-bold text-blue-700 text-lg">
                          {formatCurrency(totals.total)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {!shouldShowData && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Selecione as datas para visualizar o relatório
            </h3>
            <p className="text-gray-500">
              Preencha tanto a data inicial quanto a data final para gerar o relatório de despesas.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
