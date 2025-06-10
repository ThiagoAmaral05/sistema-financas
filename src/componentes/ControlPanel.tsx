interface ControlPanelProps {
  onPropertySelect: (property: string) => void;
}

export function ControlPanel({ onPropertySelect }: ControlPanelProps) {
  const properties = [
    // Grupo 1 - Imóveis
    { name: "Colina B1", category: "Imóveis", color: "bg-green-500" },
    { name: "Porto Trapiche", category: "Imóveis", color: "bg-green-600" },
    { name: "D'Azul", category: "Imóveis", color: "bg-green-700" },
    { name: "Praia do Forte", category: "Imóveis", color: "bg-green-800" },
    { name: "Hangar", category: "Imóveis", color: "bg-green-900" },
    
    // Grupo 2 - Pessoal
    { name: "Andre Contador", category: "Pessoal", color: "bg-green-500" },
    { name: "Automoveis", category: "Pessoal", color: "bg-green-600" },
    { name: "Despesas Cauã", category: "Pessoal", color: "bg-green-700" },
    
    // Grupo 3 - Seguros
    { name: "Seguro de Vida Familia Moura", category: "Seguros", color: "bg-green-500" },
    { name: "Seguro Patrimonial", category: "Seguros", color: "bg-green-600" },
    
    // Grupo 4 - Outros
    { name: "Outros", category: "Outros", color: "bg-gray-500" },
  ];

  const groupedProperties = properties.reduce((acc, property) => {
    if (!acc[property.category]) {
      acc[property.category] = [];
    }
    acc[property.category].push(property);
    return acc;
  }, {} as Record<string, typeof properties>);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Painel de Controle</h2>
        <p className="text-gray-600 mb-8">
          Selecione uma categoria para gerenciar as despesas específicas de cada propriedade.
        </p>

        {Object.entries(groupedProperties).map(([category, items]) => (
          <div key={category} className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{category}</h3>
            <div className="bg-white border-2 border-green-600 text-green-700 p-6 rounded-xl hover:bg-green-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
              {items.map((property) => (
                <button
                  key={property.name}
                  onClick={() => onPropertySelect(property.name)}
                  className={`${property.color} text-white p-6 rounded-lg hover:opacity-90 transition-opacity shadow-sm hover:shadow-md`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🏢</div>
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
