import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";

export function TempSignUp() {
  const { signIn } = useAuthActions();
  const [email, setEmail] = useState("admin@financas.com");
  const [password, setPassword] = useState("suasenhasegura123");
  const [submitting, setSubmitting] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.set("email", email);
      formData.set("password", password);
      formData.set("flow", "signUp");

      await signIn("password", formData);
      setAccountCreated(true);
      toast.success("Conta admin criada com sucesso! Agora você pode fazer login.");
    } catch (error: any) {
      if (error.message.includes("already exists")) {
        toast.error("Esta conta já existe. Use o formulário de login.");
      } else {
        toast.error("Erro ao criar conta: " + error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (accountCreated) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <div className="flex items-center">
          <div className="text-green-600 mr-3">✅</div>
          <div>
            <h3 className="text-sm font-medium text-green-800">
              Conta Criada com Sucesso!
            </h3>
            <p className="text-sm text-green-700 mt-1">
              Agora você pode fazer login com as credenciais criadas.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h3 className="text-sm font-medium text-blue-800 mb-3">
        🔧 Criar Conta Administrativa (Temporário)
      </h3>
      
      <form onSubmit={handleCreateAccount} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-blue-700 mb-1">
            Email do Admin
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={submitting}
          />
        </div>
        
        <div>
          <label className="block text-xs font-medium text-blue-700 mb-1">
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={submitting}
            minLength={6}
          />
        </div>
        
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Criando..." : "Criar Conta Admin"}
        </button>
      </form>
      
      <p className="text-xs text-blue-600 mt-2">
        ⚠️ Esta opção será removida após a criação da conta.
      </p>
    </div>
  );
}
