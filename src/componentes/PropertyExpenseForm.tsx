import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
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
  ],
  "Porto Trapiche": [
    { key: "condominio", label: "Condomínio" },
    { key: "luz", label: "Luz" },
    { key: "internet", label: "Internet" },
  ],
  "D'Azul": [
    { key: "condominio", label: "Condomínio" },
    { key: "luz", label: "Luz" },
    { key: "gas", label: "Gás" },
    { key: "iptu", label: "IPTU" },
  ],
  "Praia do Forte": [
    { key: "condominio", label: "Condomínio" },
    { key: "luz", label: "Luz" },
  ],
  "Hangar": [
    { key: "condominio", label: "Condomínio" },
    { key: "luz", label: "Luz" },
    { key: "internet", label: "Internet" },
  ],
  "Andre Contador": [
    { key: "condominio", label: "Condomínio" },
    { key: "luz", label: "Luz" },
    { key: "internet", label: "Internet" },
  ],
  "Automoveis": [
    { key: "carro1", label: "Carro 1" },
    { key: "carro2", label: "Carro 2" },
    { key: "carro3", label: "Carro 3" },
  ],
  "Despesas Cauã": [
    { key: "condominio", label: "Condomínio" },
    { key: "faculdade", label: "Faculdade" },
    { key: "aluguel", label: "Aluguel" },
    { key: "fiancaMensal", label: "Fiança Mensal" },
  ],
  "Seguro de Vida Familia Moura": [
    { key: "josue", label: "Josué" },
    { key: "mariana", label: "Mariana" },
    { key: "bia", label: "Bia" },
    { key: "caua", label: "Cauã" },
  ],
  "Seguro Patrimonial": [
    { key: "colinaB1", label: "Colina B1" },
    { key: "portoTrapiche", label: "Porto Trapiche" },
    { key: "dAzul", label: "D'Azul" },
    { key: "praiaDoForte", label: "Praia do Forte" },
    { key: "rcMouraFacility", label: "RC Moura Facility" },
    { key: "lanchaRole", label: "Lancha Rolé" },
    { key: "lanchaCaua", label: "Lancha Cauã" },
  ],
  "Outros": [
    { key: "baiaMarina", label: "Baia Marina" },
  ],
};

export function PropertyExpenseForm({ propertyName, onBack }: PropertyExpenseFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← Voltar
        </button>
        <h1 className="text-3xl font-bold text-gray-900">{propertyName}</h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Adicionar Despesas</h2>
        <p className="text-gray-600 text-sm mb-6">
          Preencha apenas os campos das despesas que deseja registrar. A data é obrigatória.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Data */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Data *
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStatus("pago")}
                className={`flex-1 py-3 px-4 rounded-lg border font-medium transition-colors ${
                  status === "pago"
                    ? "bg-green-50 border-green-500 text-green-700"
                    : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                ✅ Pago
              </button>
              <button
                type="button"
                onClick={() => setStatus("a_pagar")}
                className={`flex-1 py-3 px-4 rounded-lg border font-medium transition-colors ${
                  status === "a_pagar"
                    ? "bg-red-50 border-red-500 text-red-700"
                    : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                ❌ À Pagar
              </button>
            </div>
          </div>

          {/* Campos dinâmicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map((field) => (
              <div key={field.key}>
                <label htmlFor={field.key} className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label} (R$)
                </label>
                <input
                  type="number"
                  id={field.key}
                  value={fieldValues[field.key] || ""}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="0,00"
                  step="0.01"
                  min="0"
                />
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Adicionar Despesas
          </button>
        </form>
      </div>

      {/* Historical Data */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Histórico de Despesas</h3>
        </div>
        <div className="p-6">
          {expenses.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Nenhuma despesa registrada ainda.
            </p>
          ) : (
            <div className="space-y-4">
              {expenses.map((expense) => {
                const expenseFields = getExpenseFields(expense);
                const total = getTotal(expense);
                
                return (
                  <div key={expense._id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <p className="font-medium text-gray-900">
                          {new Date(expense.date).toLocaleDateString('pt-BR')}
                        </p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStatusChange(expense._id, "pago")}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              (expense.status || "a_pagar") === "pago"
                                ? "bg-green-100 text-green-700 border border-green-300"
                                : "bg-gray-100 text-gray-600 hover:bg-green-50"
                            }`}
                          >
                            ✅ Pago
                          </button>
                          <button
                            onClick={() => handleStatusChange(expense._id, "a_pagar")}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              (expense.status || "a_pagar") === "a_pagar"
                                ? "bg-red-100 text-red-700 border border-red-300"
                                : "bg-gray-100 text-gray-600 hover:bg-red-50"
                            }`}
                          >
                            ❌ À Pagar
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="font-bold text-lg text-gray-900">
                          Total: {formatCurrency(total)}
                        </p>
                        <button
                          onClick={() => handleDelete(expense._id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Excluir registro"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    {expenseFields.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm text-gray-600">
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
    </div>
  );
}
