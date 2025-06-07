import { useState } from "react";
import { BuildingManager } from "./BuildingManager";
import { ReportGenerator } from "./ReportGenerator";

const buildingConfig = [
  { id: 1, name: "Colina B1", icon: "🏢" },
  { id: 2, name: "Porto Trapiche", icon: "🏢" },
  { id: 3, name: "D'Azul", icon: "🏢" },
  { id: 4, name: "Praia do Forte", icon: "🏢" },
  { id: 5, name: "Hangar", icon: "🏢" },
  { id: 6, name: "Andre Contador", icon: "🏢" },
  { id: 7, name: "Despesas Cauã", icon: "💰" },
  { id: 8, name: "Outros", icon: "📋" },
];

export function Dashboard() {
  const [selectedBuilding, setSelectedBuilding] = useState<number | null>(null);
  const [showReports, setShowReports] = useState(false);

  if (showReports) {
    return (
      <div>
        <button
          onClick={() => setShowReports(false)}
          className="mb-6 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          ← Voltar ao Dashboard
        </button>
        <ReportGenerator />
      </div>
    );
  }

  if (selectedBuilding) {
    return (
      <div>
        <button
          onClick={() => setSelectedBuilding(null)}
          className="mb-6 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          ← Voltar ao Dashboard
        </button>
        <BuildingManager buildingId={selectedBuilding} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Controle de Finanças
        </h1>
        <p className="text-gray-600">
          Selecione uma categoria para gerenciar as contas ou gere relatórios
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {buildingConfig.map((building) => (
          <button
            key={building.id}
            onClick={() => setSelectedBuilding(building.id)}
            className="bg-white border-2 border-green-600 text-green-700 p-6 rounded-xl hover:bg-green-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <div className="text-center">
              <div className="text-3xl mb-2">{building.icon}</div>
              <div className="font-bold text-lg">{building.name}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={() => setShowReports(true)}
          className="bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl font-semibold text-lg"
        >
          📊 Gerar Relatórios
        </button>
      </div>
    </div>
  );
}
