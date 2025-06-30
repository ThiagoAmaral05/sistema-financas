import { useState, useEffect } from "react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { WelcomeScreen } from "./WelcomeScreen";
import { Toaster } from "sonner";
import { ControlPanel } from "./componentes/ControlPanel";
import { ReportPanel } from "./componentes/ReportPanel";
import { PropertyExpenseForm } from "./componentes/PropertyExpenseForm";

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  // Sempre mostrar tela inicial ao carregar a página
  useEffect(() => {
    setShowWelcome(true);
  }, []);

  // Mostra WelcomeScreen antes de qualquer outra coisa
  if (showWelcome) {
    return <WelcomeScreen onContinue={() => setShowWelcome(false)} />;
  }

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
    <>
      <Authenticated>
        <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-Vindo, {loggedInUser?.name || loggedInUser?.email || "Usuário"}!
          </h1>
          <p className="text-lg text-gray-800 mb-6">Gerencie suas despesas de forma simples e eficiente. Registre suas movimentações!</p>
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
        </div>
      </Authenticated>
      
      <Unauthenticated>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
              <SignInForm />
            </div>
        </div>
      </Unauthenticated>
    </>
  );
}
