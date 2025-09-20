import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { Header } from "../Header";
import { ActivePage } from "../Dashboard";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";

interface PropertyExpenseFormProps {
  propertyName: string;
  onBack: () => void;
}

// Configuração dos campos para cada propriedade
const propertyFields = {
  "Colina B1": [
    { key: "condominio", label: "Condomínio" },
    { key: "luz", label: "Luz" },
    { key: "agua", label: "Água" },
    { key: "iptu", label: "IPTU" },
  ],
  "Porto Trapiche": [
    { key: "condominio", label: "Condomínio" },
    { key: "luz", label: "Luz" },
    { key: "internet", label: "Internet" },
    { key: "iptu", label: "IPTU" },
  ],
  "D'Azur": [
    { key: "condominio", label: "Condomínio" },
    { key: "luz", label: "Luz" },
    { key: "gas", label: "Gás" },
    { key: "internet", label: "Internet" },
    { key: "sky", label: "SKY" },
    { key: "iptu", label: "IPTU" },
  ],
  "Praia do Forte": [
    { key: "condominio", label: "Condomínio" },
    { key: "luz", label: "Luz" },
    { key: "iptu", label: "IPTU" },
  ],
  "Hangar": [
    { key: "condominio", label: "Condomínio" },
    { key: "luz", label: "Luz" },
    { key: "internet", label: "Internet" },
    { key: "iptu", label: "IPTU" },
  ],
  "Apartamento 1201": [
    { key: "amortizacao", label: "Amortização" },
    { key: "parcelaMensal", label: "Parcela Mensal" },
  ],
  "Apartamento 1401": [
    { key: "amortizacao", label: "Amortização" },
    { key: "parcelaMensal", label: "Parcela Mensal" },
  ],
  "Apartamento 1402": [
    { key: "amortizacao", label: "Amortização" },
    { key: "parcelaMensal", label: "Parcela Mensal" },
  ],
  "Apartamento 1906": [
    { key: "amortizacao", label: "Amortização" },
    { key: "parcelaMensal", label: "Parcela Mensal" },
  ],
  "Apartamento 913": [
    { key: "parcelaMensal", label: "Parcela Mensal" },
  ],
  "Apartamento 1507": [
    { key: "parcelaMensal", label: "Parcela Mensal" },
  ],
  "Apartamento 1508": [
    { key: "parcelaMensal", label: "Parcela Mensal" },
  ],
  "Apartamento 1802": [
    { key: "parcelaMensal", label: "Parcela Mensal" },
  ],
  "FIP Número 140": [
    { key: "parcelaMensal", label: "Parcela Mensal" },
  ],
  "Andre Contador": [
    { key: "patrimonial", label: "Patrimonial" },
    { key: "mouraFacility", label: "Moura Facility" },
    { key: "mjb", label: "MJB" },
  ],
  "Plano de Saúde": [
    { key: "familiaMoura", label: "Família Moura" },
  ],
  "Despesas Cauã": [
    { key: "condominio", label: "Condomínio" },
    { key: "faculdade", label: "Faculdade" },
    { key: "luz", label: "Luz" },
    { key: "internet", label: "Internet" },
    { key: "aluguel", label: "Aluguel" },
    { key: "caucao", label: "Caução" },
  ],
  "RANGER SPORT": [
    { key: "ipva", label: "IPVA" },
    { key: "seguro", label: "Seguro" },
    { key: "licenciamento", label: "Licenciamento" },
  ],
  "BMW X3": [
    { key: "ipva", label: "IPVA" },
    { key: "seguro", label: "Seguro" },
    { key: "licenciamento", label: "Licenciamento" },
  ],
  "BMW X1": [
    { key: "ipva", label: "IPVA" },
    { key: "seguro", label: "Seguro" },
    { key: "licenciamento", label: "Licenciamento" },
    { key: "financiamento", label: "Financiamento" },
  ],
  "NIVUS": [
    { key: "ipva", label: "IPVA" },
    { key: "seguro", label: "Seguro" },
    { key: "licenciamento", label: "Licenciamento" },
  ],
  "T-CROSS": [
    { key: "ipva", label: "IPVA" },
    { key: "seguro", label: "Seguro" },
    { key: "licenciamento", label: "Licenciamento" },
  ],
  "RANGER EVOQUE": [
    { key: "ipva", label: "IPVA" },
    { key: "seguro", label: "Seguro" },
    { key: "licenciamento", label: "Licenciamento" },
  ],
  "Seguro de Vida Família Moura": [
    { key: "josue", label: "Josué" },
    { key: "mariana", label: "Mariana" },
    { key: "beatriz", label: "Beatriz" },
    { key: "caua", label: "Cauã" },
  ],
  "Seguro Patrimonial": [
    { key: "colinaB1", label: "Colina B1" },
    { key: "portoTrapiche", label: "Porto Trapiche" },
    { key: "dAzur", label: "D'Azur" },
    { key: "praiaDoForte", label: "Praia do Forte" },
    { key: "rcMouraFacility", label: "RC Moura Facility" },
    { key: "lanchaRole", label: "Lancha Rolé" },
    { key: "boteCaua", label: "Bote Cauã" },
  ],
  "Jairo Santana": [
    { key: "salario", label: "Salário" },
    { key: "fgts", label: "FGTS" },
    { key: "alimentacao", label: "Alimentação" },
    { key: "transporte", label: "Transporte" },
    { key: "ferias", label: "Férias" },
  ],
  "Aluguel Bahia Marina": [
    { key: "vagaLanchaRole", label: "Vaga S/058- Lancha Rolê" },
    { key: "vagaBoteCaua", label: "Vaga S/097- Bote Cauã" },
  ],
};

export function PropertyExpenseForm({ propertyName, onBack }: PropertyExpenseFormProps) {
  const today = new Date();
  const [date, setDate] = useState(() =>
  today.toLocaleDateString('fr-CA') // 'YYYY-MM-DD' formato compatível com input[type="date"]
  );
  const [status, setStatus] = useState<"pago" | "a_pagar">("a_pagar");
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  const createExpense = useMutation(api.propertyExpenses.create);
  const removeExpense = useMutation(api.propertyExpenses.remove);
  const updateStatus = useMutation(api.propertyExpenses.updateStatus);
  const expenses = useQuery(api.propertyExpenses.getByProperty, { propertyName });

  const fields = propertyFields[propertyName as keyof typeof propertyFields] || [];

  const handleFieldChange = (key: string, value: string) => {
    setFieldValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar se pelo menos um campo foi preenchido
    const hasAnyValue = Object.values(fieldValues).some(value => value && value.trim() !== "");
    
    if (!hasAnyValue) {
      toast.error("Preencha pelo menos um campo de despesa");
      return;
    }

    try {
      // Converter valores para números, mantendo apenas os preenchidos
      const numericValues: Record<string, number> = {};
      Object.entries(fieldValues).forEach(([key, value]) => {
        if (value && value.trim() !== "") {
          numericValues[key] = parseFloat(value);
        }
      });

      await createExpense({
        propertyName,
        date,
        status,
        ...numericValues,
      });

      toast.success("Despesas adicionadas com sucesso!");
      setFieldValues({});
    } catch (error) {
      toast.error("Erro ao adicionar despesas");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este registro?")) {
      try {
        await removeExpense({ id: id as any });
        toast.success("Registro excluído com sucesso!");
      } catch (error) {
        toast.error("Erro ao excluir registro");
      }
    }
  };

  const handleStatusChange = async (id: string, newStatus: "pago" | "a_pagar") => {
    try {
      await updateStatus({ id: id as any, status: newStatus });
      toast.success("Status atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar status");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const getTotal = (expense: any) => {
    return fields.reduce((total, field) => {
      const value = (expense as any)[field.key];
      return total + (value || 0);
    }, 0);
  };

  const getExpenseFields = (expense: any) => {
    return fields.filter(field => (expense as any)[field.key] !== undefined && (expense as any)[field.key] !== null);
  };

  if (expenses === undefined) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header activePage="controlPanel" toggleSidebar={() => {}} />

      <main className="max-w-4xl mx-auto space-y-6">
      {/* Serviço */}
      <div className="flex items-center justify-between mb-6 mt-8">
        <h1 className="text-2xl font-bold text-black dark:text-white">{propertyName}</h1>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded bg-white text-secondary border border-gray-200 font-semibold hover:bg-gray-50 hover:text-secondary-hover transition-colors shadow-sm hover:shadow"
        >
          ← Voltar
        </button>
      </div>

      {/* Formulário */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Adicionar Despesas</h2>
        <p className="text-m text-gray-800 dark:text-white mb-4">
          Preencha apenas os campos das despesas que deseja registrar. A data é obrigatória.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
              Data *
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
              Status
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStatus("pago")}
                className={`flex-1 py-3 px-4 rounded-lg border font-medium transition-colors ${
                  status === "pago"
                    ? "bg-green-50 dark:bg-green-950 border-green-500 dark:border-green-500 text-green-700 dark:text-green-300"
                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-100"
                }`}
              >
                Pago
              </button>
              <button
                type="button"
                onClick={() => setStatus("a_pagar")}
                className={`flex-1 py-3 px-4 rounded-lg border font-medium transition-colors ${
                  status === "a_pagar"
                    ? "bg-red-50 dark:bg-red-950 border-red-500 dark:border-red-500 text-red-700 dark:text-red-300"
                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-100"
                }`}
              >
                À Pagar
              </button>
            </div>
          </div>

          {/* Campos dinâmicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map((field) => (
              <div key={field.key}>
                <label htmlFor={field.key} className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                  {field.label} (R$)
                </label>
                <input
                  type="number"
                  id={field.key}
                  value={fieldValues[field.key] || ""}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                />
              </div>
            ))}
          </div>

          {/* Botão de envio */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Adicionar Despesas
          </button>
        </form>
      </div>

      {/* Dados históricos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark: border border-gray-400">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Histórico de Despesas</h3>
        </div>
        <div className="p-6">
          {expenses.length === 0 ? (
            <p className="text-gray-500 dark:text-white text-center py-8">
              Nenhuma despesa registrada ainda.
            </p>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense) => {
                const expenseFields = getExpenseFields(expense);
                const total = getTotal(expense);
                
                return (
                  <div key={expense._id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(expense.date + 'T03:00:00').toLocaleDateString('pt-BR')}
                        </p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStatusChange(expense._id, "pago")}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              (expense.status || "a_pagar") === "pago"
                                ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700"
                                : "bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-100"
                            }`}
                          >
                            Pago
                          </button>
                          <button
                            onClick={() => handleStatusChange(expense._id, "a_pagar")}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              (expense.status || "a_pagar") === "a_pagar"
                                ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700"
                                : "bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-100"
                            }`}
                          >
                            À Pagar
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                          Usuário: {expense.userName}
                        </p>
                        <p className="font-bold text-lg text-gray-900 dark:text-white">
                          Total: {formatCurrency(total)}
                        </p>
                        <div className="relative group inline-block">
                          <button
                            onClick={() => handleDelete(expense._id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            ❌
                          </button>
                          <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-200 text-black text-sm rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-sm z-10">
                            Excluir registro
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {expenseFields.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-white">
                        {expenseFields.map((field) => (
                          <div key={field.key}>
                            <span className="font-medium">{field.label}:</span> {formatCurrency((expense as any)[field.key])}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      </main>
    </div>
  );
}
