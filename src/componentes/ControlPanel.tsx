import { GiSailboat } from "react-icons/gi"; // ícone de prédio
import { BsCalculator } from "react-icons/bs"; // ícone de calculadora
import { FaCar, FaCoins, FaUsers, FaShieldAlt, FaHeartbeat, FaUserTie, FaEllipsisH, FaHome, FaBuilding} from "react-icons/fa"; // restante dos ícones
import {useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface ControlPanelProps {
  onPropertySelect: (property: string) => void;
}

export function ControlPanel({ onPropertySelect }: ControlPanelProps) {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const properties = [
    // Grupo 1 - Imóveis 
    { name: "Colina B1", category: "Imóveis" },
    { name: "Porto Trapiche", category: "Imóveis" },
    { name: "D'Azur", category: "Imóveis" },
    { name: "Praia do Forte", category: "Imóveis" },
    { name: "Hangar", category: "Imóveis" },

    // Grupo 2 - Beach Class Jaguaribe
    { name: "Apartamento 1201", category: "Beach Class Jaguaribe" },
    { name: "Apartamento 1401", category: "Beach Class Jaguaribe" },
    { name: "Apartamento 1402", category: "Beach Class Jaguaribe" },
    { name: "Apartamento 1906", category: "Beach Class Jaguaribe" },

    // Grupo 3 - Infinity Salvador
    { name: "Apartamento 913", category: "Infinity Salvador" },
    { name: "Apartamento 1507", category: "Infinity Salvador" },
    { name: "Apartamento 1508", category: "Infinity Salvador" },

    // Grupo 4 - Patrimar BH
    { name: "Apartamento 1802", category: "Patrimar- BH" },

    // Grupo 5 - Reserva Apoema
    { name: "F.I.P Número 140", category: "Reserva Apoema" },

    // Grupo 6 - Pessoal
    { name: "Andre Contador", category: "Pessoal" },
    { name: "Plano de Saúde", category: "Pessoal" },
    { name: "Despesas Cauã", category: "Pessoal" },

    // Grupo 7 - Automóveis
    { name: "RANGER SPORT", category: "Automóveis" },
    { name: "BMW X3", category: "Automóveis" },
    { name: "BMW X1", category: "Automóveis" },
    { name: "NIVUS", category: "Automóveis" },
    { name: "T-CROSS", category: "Automóveis" },
    { name: "RANGER EVOQUE", category: "Automóveis" },

    // Grupo 8 - Seguros
    { name: "Seguro de Vida Família Moura", category: "Seguros" },
    { name: "Seguro Patrimonial", category: "Seguros" },
    
    // Grupo 9 - Funcionários 
    { name: "Jairo Santana", category: "Funcionáros" },

    // Grupo 10 - Outros
    { name: "Aluguel Bahia Marina", category: "Outros" },
  ];

  const getIconForProperty = (name: string) => {
    switch (name) {
      case "Colina B1":
      case "Porto Trapiche":
      case "D'Azur":
      case "Praia do Forte":
      case "Hangar":
        return <FaHome className="text-3xl text-green-700 mb-2 mx-auto" />;
      case "Apartamento 1201":
      case "Apartamento 1401":
      case "Apartamento 1402":
      case "Apartamento 1906":
      case "Apartamento 913":
      case "Apartamento 1507":
      case "Apartamento 1508":
      case "Apartamento 1802":
      case "F.I.P Número 140":
        return <FaBuilding className="text-3xl text-green-700 mb-2 mx-auto" />;
      case "Andre Contador":
        return <BsCalculator className="text-3xl text-green-700 mb-2 mx-auto" />;
      case "Plano de Saúde":
        return <FaHeartbeat className="text-3xl text-green-700 mb-2 mx-auto" />;
      case "Despesas Cauã":
        return <FaCoins className="text-3xl text-green-700 mb-2 mx-auto" />;
      case "RANGER SPORT":
      case "BMW X3":
      case "BMW X1":
      case "NIVUS":
      case "T-CROSS":
      case "RANGER EVOQUE":
        return <FaCar className="text-3xl text-green-700 mb-2 mx-auto" />;
      case "Seguro de Vida Família Moura":
        return <FaUsers className="text-3xl text-green-700 mb-2 mx-auto" />;
      case "Seguro Patrimonial":
        return <FaShieldAlt className="text-3xl text-green-700 mb-2 mx-auto" />;
      case "Jairo Santana":
        return <FaUserTie className="text-3xl text-green-700 mb-2 mx-auto" />;
      case "Aluguel Bahia Marina":
        return <GiSailboat className="text-3xl text-green-700 mb-2 mx-auto" />;
      default:
        return null;
    }
  };

  const groupedProperties = properties.reduce((acc, property) => {
    if (!acc[property.category]) {
      acc[property.category] = [];
    }
    acc[property.category].push(property);
    return acc;
  }, {} as Record<string, typeof properties>);

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Bem-Vindo, {loggedInUser?.name || loggedInUser?.email || "Usuário"}!
        </h1>
        <p className="text-green-100">
          Gerencie suas despesas de forma simples e eficiente. Registre suas movimentações!
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Painel de Controle</h2>
        <p className="text-m text-gray-800 dark:text-white mb-4">Selecione uma categoria para gerenciar as despesas específicas de cada propriedade.</p>

        {Object.entries(groupedProperties).map(([category, items]) => (
          <div key={category} className="mb-8 bg-gray-100 dark:bg-gray-700 p-6 rounded-md shadow-inner">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((property) => (
                <button
                  key={property.name}
                  onClick={() => onPropertySelect(property.name)}
                  className="bg-white dark:bg-gray-800 border border-green-600 text-green-700 dark:text-white p-4 rounded-lg transition-colors duration-200 text-center hover:bg-green-50 dark:hover:bg-green-100 shadow-md"
                >
                  <div className="text-2xl mb-2">
                    {getIconForProperty(property.name)}
                    <h4 className="font-medium text-sm">{property.name}</h4>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

