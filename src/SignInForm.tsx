"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);
  const logoUrl = useQuery(api.system.getSystemLogo);
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto">
      {/* Logo Section */}
      <div className="text-center mb-8">
        <div className="mb-4">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt="Logo da Empresa" 
              className="h-20 w-20 mx-auto rounded-full object-cover border-4 border-blue-100"
            />
          ) : (
            <div className="h-20 w-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">SF</span>
            </div>
          )}
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Sistema Financeiro</h1>
          <p className="text-gray-600">Faça login para acessar o sistema</p>
        </div>
      </div>

      <form
        className="flex flex-col gap-form-field"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitting(true);
          const formData = new FormData(e.target as HTMLFormElement);
          formData.set("flow", flow);
          void signIn("password", formData).catch((error) => {
            let toastTitle = "";
            if (error.message.includes("Invalid password")) {
              toastTitle = "Senha inválida. Tente novamente.";
            } else {
              toastTitle =
                flow === "signIn"
                  ? "Não foi possível fazer login, gostaria de se registrar?"
                  : "Não foi possível registrar-se, gostaria de fazer login?";
            }
            toast.error(toastTitle);
            setSubmitting(false);
          });
        }}
      >
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Usuário
        </label>
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          type="email"
          name="email"
          placeholder="Digite seu usuário"
          required
        />

        <label className="block text-sm font-medium text-gray-700 mb-2">
          Senha
        </label>
        <div className="relative">
         <input
            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Digite sua senha"
            required
        />

          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </div>
        
        <button className="auth-button" type="submit" disabled={submitting}>
          {flow === "signIn" ? "Entrar" : "Registrar"}
        </button>
        <div className="text-center text-sm text-secondary">
          <span>
            {flow === "signIn"
              ? "Não tem conta? "
              : "Já tem uma conta? "}
          </span>
          <button
            type="button"
            className="text-primary hover:text-primary-hover hover:underline font-medium cursor-pointer"
            onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
          >
            {flow === "signIn" ? "Registrar" : "Entrar"}
          </button>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
          <div className="flex items-center">
            <div className="text-yellow-600 mr-3">⚠️</div>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                Acesso Restrito
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                Este sistema é de uso exclusivo.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
