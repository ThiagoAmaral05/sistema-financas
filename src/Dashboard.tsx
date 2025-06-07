import { useState } from "react";
import { BuildingManager } from "./BuildingManager";
import { ReportGenerator } from "./ReportGenerator";

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
          Selecione um prédio para gerenciar as contas ou gere relatórios
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((buildingNumber) => (
          <button
            key={buildingNumber}
            onClick={() => setSelectedBuilding(buildingNumber)}
            className="bg-white border-2 border-green-600 text-green-700 p-6 rounded-xl hover:bg-green-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <div className="text-center">
              <div className="text-3xl mb-2">🏢</div>
              <div className="font-bold text-lg">Prédio {buildingNumber}</div>
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
