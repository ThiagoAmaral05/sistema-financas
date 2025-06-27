import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { PasswordChange } from "./PasswordChange";
import { WelcomeScreen } from "./WelcomeScreen";
import { Toaster } from "sonner";
import { ControlPanel } from "./componentes/ControlPanel";
import { ReportPanel } from "./componentes/ReportPanel";
import { PropertyExpenseForm } from "./componentes/PropertyExpenseForm";
import { useState, useEffect } from "react";

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  // Reset to welcome screen whenever the component mounts (page refresh/new visit)
  useEffect(() => {
    setShowWelcome(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
        <h2 className="text-xl font-semibold text-green-600">💰 Sistema Financeiro</h2>
        <SignOutButton />
      </header>
      <main className="flex-1 p-4">
        <Content />
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const [activeTab, setActiveTab] = useState<"controle" | "relatorio">("controle");
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (selectedProperty) {
    return (
      <PropertyExpenseForm 
        propertyName={selectedProperty} 
        onBack={() => setSelectedProperty(null)} 
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Authenticated>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-Vindo, {loggedInUser?.name || loggedInUser?.email || "Usuário"}!
          </h1>
          <p className="text-lg font-semibold text-gray-800 mb-6">Gerencie suas despesas de forma simples e eficiente. Registre suas movimentações!  </p>
        </div>

        <nav className="flex space-x-1 mb-6 bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setActiveTab("controle")}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === "controle"
                ? "bg-green-600 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Controle
          </button>
          <button
            onClick={() => setActiveTab("relatorio")}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === "relatorio"
                ? "bg-green-600 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Relatório
          </button>
        </nav>

        {activeTab === "controle" && (
          <ControlPanel onPropertySelect={setSelectedProperty} />
        )}
        {activeTab === "relatorio" && <ReportPanel />}
      </Authenticated>
      
      <Unauthenticated>
        <div className="max-w-md mx-auto mt-20">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Sistema Financeiro</h1>
            <p className="text-xl text-gray-600">Faça login para gerenciar suas finanças</p>
          </div>
          <SignInForm />
          
          {/* Botão de Alteração de Senha na tela de login */}
          <div className="mt-6 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-blue-800">
                    Precisa alterar sua senha?
                  </h3>
                  <p className="text-xs text-blue-600 mt-1">
                    Clique aqui para alterar sua senha de acesso
                  </p>
                </div>
                <PasswordChange />
              </div>
            </div>
          </div>
        </div>
      </Unauthenticated>
    </div>
  );
}
