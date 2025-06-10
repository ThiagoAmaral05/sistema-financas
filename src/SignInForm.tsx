"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="w-full">
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
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          type="email"
          name="email"
          placeholder="Email do Administrador"
          required
        />
        <input
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          type="password"
          name="password"
          placeholder="Senha"
          required
        />
        <button className="auth-button" type="submit" disabled={submitting}>
          {flow === "signIn" ? "Sign in" : "Sign up"}
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
            {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
          </button>
        </div>
        <button className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed" type="submit" disabled={submitting}>
          {submitting ? "Entrando..." : "Entrar"}
        </button>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
          <div className="flex items-center">
            <div className="text-yellow-600 mr-3">⚠️</div>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                Acesso Restrito
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                Este sistema é de uso exclusivo do administrador.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
