import { MdLocationCity } from "react-icons/md"; // ícone de prédio
import { BsCalculator } from "react-icons/bs"; // ícone de calculadora
import { FaCar, FaCoins, FaUsers, FaShieldAlt, FaPuzzlePiece } from "react-icons/fa"; // restante dos ícones

interface ControlPanelProps {
  onPropertySelect: (property: string) => void;
}

export function ControlPanel({ onPropertySelect }: ControlPanelProps) {
  const properties = [
    // Grupo 1 - Imóveis
    { name: "Colina B1", category: "Imóveis" },
    { name: "Porto Trapiche", category: "Imóveis" },
    { name: "D'Azul", category: "Imóveis" },
    { name: "Praia do Forte", category: "Imóveis" },
    { name: "Hangar", category: "Imóveis" },

    // Grupo 2 - Pessoal
    { name: "Andre Contador", category: "Pessoal" },
    { name: "Automoveis", category: "Pessoal" },
    { name: "Despesas Cauã", category: "Pessoal" },

    // Grupo 3 - Seguros
    { name: "Seguro de Vida Familia Moura", category: "Seguros" },
    { name: "Seguro Patrimonial", category: "Seguros" },

    // Grupo 4 - Outros
    { name: "Outros", category: "Outros" },
  ];

  const getIconForProperty = (name: string) => {
    switch (name) {
      case "Colina B1":
      case "Porto Trapiche":
      case "D'Azul":
      case "Praia do Forte":
      case "Hangar":
        return <MdLocationCity className="text-3xl text-green-700 mb-2 mx-auto" />;
      case "Andre Contador":
        return <BsCalculator className="text-3xl text-green-700 mb-2 mx-auto" />;
      case "Automoveis":
        return <FaCar className="text-3xl text-green-700 mb-2 mx-auto" />;
      case "Despesas Cauã":
        return <FaCoins className="text-3xl text-green-700 mb-2 mx-auto" />;
      case "Seguro de Vida Familia Moura":
        return <FaUsers className="text-3xl text-green-700 mb-2 mx-auto" />;
      case "Seguro Patrimonial":
        return <FaShieldAlt className="text-3xl text-green-700 mb-2 mx-auto" />;
      case "Outros":
        return <FaPuzzlePiece className="text-3xl text-green-700 mb-2 mx-auto" />;
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
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <h2 className="text-2xl font-bold text-gray-900">Painel de Controle</h2>
        <p className="text-gray-600 mb-8">
          Selecione uma categoria para gerenciar as despesas específicas de cada propriedade.
        </p>

        {Object.entries(groupedProperties).map(([category, items]) => (
          <div key={category} className="mb-12 bg-gray-50 p-6 rounded-md shadow-inner">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((property) => (
                <button
                  key={property.name}
                  onClick={() => onPropertySelect(property.name)}
                  className="bg-white border border-green-700 text-green-800 p-6 rounded-xl hover:bg-green-50 hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                >
                  <div className="text-center">
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

