import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { PasswordChange } from "./PasswordChange";
import { PasswordViewer } from "./PasswordViewer";
import { Toaster } from "sonner";
import { Dashboard } from "./Dashboard";
import { SessionManager } from "./SessionManager";
import { useEffect } from "react";
import { useMutation } from "convex/react";

export default function App() {
  const updateSession = useMutation(api.sessions.updateSession);

  // Atualizar sessão a cada 2 minutos
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await updateSession();
      } catch (error) {
        // Ignorar erros silenciosamente
      }
    }, 2 * 60 * 1000); // 2 minutos

    return () => clearInterval(interval);
  }, [updateSession]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="sticky top-0 z-10 bg-white shadow-md h-16 flex justify-between items-center px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">💰</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Controle de Finanças</h2>
        </div>
        <Authenticated>
          <div className="flex items-center gap-4">
            <SessionManager />
            <PasswordViewer />
            <SignOutButton />
          </div>
        </Authenticated>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-6xl mx-auto">
          <Content />
        </div>
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <Authenticated>
        <Dashboard />
      </Authenticated>
      
      <Unauthenticated>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Sistema de Controle Financeiro
            </h1>
            <p className="text-lg text-gray-600">
              Acesso restrito - Faça login para continuar
            </p>
            <p className="text-sm text-blue-600 mt-2">
              ⏰ Sessão expira em 10 minutos de inatividade
            </p>
            <p className="text-sm text-red-600 mt-1">
              🔓 Senhas armazenadas em texto plano
            </p>
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
