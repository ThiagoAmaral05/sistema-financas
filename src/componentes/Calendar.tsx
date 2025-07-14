import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [upcomingPeriod, setUpcomingPeriod] = useState(7);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const expenses = useQuery(api.propertyExpenses.list, {});

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const getExpenseTotal = (expense: any) => {
    if (typeof expense.valorTotal === "number") return expense.valorTotal;

    const validKeys = ["condominio", "luz", "agua", "internet", "gas", "iptu", "sky", "patrimonial", "mouraFacility", "mjb", "familiaMoura", 
                      "faculdade", "aluguel", "fiancaMensal", "ipva", "seguro", "licenciamento", "financiamento", "josue", "mariana", "bia", 
                      "caua", "colinaB1", "portoTrapiche", "dAzur", "praiaDoForte", "rcMouraFacility", "lanchaRole", "boteCaua", "salario", "fgts", 
                      "alimentacao", "transporte", "ferias", "vagaLanchaRole", "vagaBoteCaua"]; // ajuste conforme seu schema
    return validKeys.reduce((sum, key) => sum + (expense[key] || 0), 0);
  };

  const expensesByDate = useMemo(() => {
    if (!expenses) return {};

    return expenses.reduce((acc, expense) => {
      const date = new Date(`${expense.date}T03:00:00`);
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();

      if (
        month === currentDate.getMonth() &&
        year === currentDate.getFullYear() &&
        expense.status === "a_pagar"
      ) {
        if (!acc[day]) acc[day] = [];
        acc[day].push(expense);
      }

      return acc;
    }, {} as Record<number, typeof expenses>);
  }, [expenses, currentDate]);

  const getDaySummary = (day: number) => {
    const dayExpenses = expensesByDate[day] || [];
    const total = dayExpenses.reduce((sum, exp) => sum + getExpenseTotal(exp), 0);
    return { total, count: dayExpenses.length };
  };

  const getUpcomingExpenses = () => {
    if (!expenses) return [];

    const today = new Date();
    const futureDate = new Date(today.getTime() + upcomingPeriod * 24 * 60 * 60 * 1000);

    return expenses
      .filter((exp) => {
        const expDate = new Date(`${exp.date}T00:00:00`);
        return expDate >= today && expDate <= futureDate && exp.status === "a_pagar";
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1));
      setSelectedDay(null); // limpa seleção ao mudar mês
      return newDate;
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Calendário Financeiro
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visão do calendário */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigateMonth("prev")}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => navigateMonth("next")}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                  >
                    →
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-gray-600 dark:text-gray-400"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {/* Espaço vazio antes do 1º dia */}
                {Array.from({ length: firstDayOfMonth }, (_, i) => (
                  <div key={`empty-${i}`} className="h-16 md:h-20"></div>
                ))}

                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1;
                  const summary = getDaySummary(day);
                  const isToday =
                    new Date().toDateString() ===
                    new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

                  return (
                    <div
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`p-2 text-center h-20 rounded border-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors
                        ${isToday ? "border-green-500 bg-green-50 dark:bg-green-900/20" : "border-transparent"}
                        ${selectedDay === day ? "ring-2 ring-blue-400" : ""}
                      `}
                    >
                      <span className="block font-medium text-gray-900 dark:text-white">{day}</span>
                      {summary.count > 0 && (
                        <>
                          <div className="text-xs text-red-600 dark:text-red-300">
                            {formatCurrency(summary.total)}
                          </div>
                          <div className="text-[10px] text-gray-400">{summary.count} itens</div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Exibe detalhes do dia selecionado */}
              {selectedDay && (
                <div className="mt-6 bg-white dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-md font-semibold mb-2 text-gray-900 dark:text-white">
                    Despesas de {selectedDay} de {monthNames[currentDate.getMonth()]}
                  </h4>
                  {expensesByDate[selectedDay]?.length ? (
                    expensesByDate[selectedDay].map((expense) => (
                      <div
                        key={expense._id}
                        className="mb-2 p-2 bg-gray-100 dark:bg-gray-800 rounded"
                      >
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {expense.propertyName}
                        </p>
                        <p className="text-xs text-gray-700 dark:text-gray-300">
                          Valor: {formatCurrency(getExpenseTotal(expense))}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sem despesas nesse dia.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Próximas despesas */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Próximas Despesas
            </h3>

            <select
              value={upcomingPeriod}
              onChange={(e) => setUpcomingPeriod(Number(e.target.value))}
              className="mb-4 p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white w-full"
            >
              <option value={7}>7 dias</option>
              <option value={30}>30 dias</option>
              <option value={60}>60 dias</option>
              <option value={90}>90 dias</option>
            </select>

            <div className="space-y-3">
              {getUpcomingExpenses().length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Nenhuma despesa nos próximos {upcomingPeriod} dias
                </p>
              ) : (
                getUpcomingExpenses().map((expense) => (
                  <div
                    key={expense._id}
                    className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20"
                  >
                    <p className="font-medium text-red-900 dark:text-red-300">
                      {expense.propertyName}
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {new Date(expense.date + "T03:00:00").toLocaleDateString("pt-BR")} —{" "}
                      {formatCurrency(getExpenseTotal(expense))}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{expense.status}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}