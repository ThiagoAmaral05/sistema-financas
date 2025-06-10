import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export function PasswordViewer() {
  const [isOpen, setIsOpen] = useState(false);
  const passwords = useQuery(api.passwords.getAllPasswords);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('pt-BR');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
      >
        Ver Senhas do Sistema
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Senhas do Sistema
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <div className="text-red-600 mr-3">⚠️</div>
            <div>
              <h4 className="text-sm font-medium text-red-800">
                Informação Sensível
              </h4>
              <p className="text-sm text-red-700 mt-1">
                As senhas são armazenadas em texto plano conforme solicitado.
              </p>
            </div>
          </div>
        </div>

        {passwords && passwords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Senha</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Criado em</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Atualizado em</th>
                </tr>
              </thead>
              <tbody>
                {passwords.map((passwordRecord) => (
                  <tr key={passwordRecord._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">{passwordRecord.email}</td>
                    <td className="border border-gray-300 px-4 py-2 font-mono bg-yellow-50">
                      {passwordRecord.password}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                      {formatDate(passwordRecord.createdAt)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                      {formatDate(passwordRecord.updatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            Nenhuma senha registrada ainda.
          </div>
        )}
        
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsOpen(false)}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
