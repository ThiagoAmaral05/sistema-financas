import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

interface WelcomeScreenProps {
  onContinue: () => void;
}

export function WelcomeScreen({ onContinue }: WelcomeScreenProps) {
  const logoUrl = "/LogoMoura.jpg";

  return (
    <div className="min-h-screen flex items-center justify-center p-8 relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0E3B25] via-[#196B45] to-[#8DCB9A]">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="aboslute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-indigo-300/15 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
      </div>

       {/* Conteúdo */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Logo fixa no código */}
        <div className="mb-12 animate-fade-in">
          <img
            src="/LogoMoura.jpg"
            alt="Logo da Empresa"
            className="h-32 w-32 mx-auto rounded-full object-cover border-4 border-white/30 shadow-2xl backdrop-blur-sm"
          />
        </div>

        {/* Welcome Message */}
        <div className="text-white space-y-6 animate-slide-up">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Sistema Financeiro
          </h1>
          
          <div className="space-y-4">
            <p className="text-xl md:text-2xl font-light text-blue-100">
              Bem-vindo a sua gestão financeira
            </p>
            <p className="text-lg text-blue-200/80 max-w-lg mx-auto leading-relaxed">
              Uma plataforma completa e moderna para controle e gerenciamento de todos as suas dispesas
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-sm">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl mb-2">🔒</div>
              <div className="font-semibold text-white">Seguro</div>
              <div className="text-blue-200/70">Dados protegidos</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-semibold text-white">Rápido</div>
              <div className="text-blue-200/70">Performance otimizada</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-semibold text-white">Inteligente</div>
              <div className="text-blue-200/70">Análises em tempo real</div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="mt-12">
            <button
              onClick={onContinue}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-4 px-8 rounded-full border border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              Continuar para Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
