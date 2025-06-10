import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";

export function SessionManager() {
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutos em segundos
  const createSession = useMutation(api.sessions.createSession);
  const invalidateSession = useMutation(api.sessions.invalidateSession);

  useEffect(() => {
    // Criar sessão ao montar o componente
    createSession().catch(() => {
      // Ignorar erros
    });

    // Timer para mostrar tempo restante
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          toast.error("Sua sessão expirou. Você será redirecionado para o login.");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Resetar timer em atividade do usuário
    const resetTimer = () => {
      setTimeLeft(10 * 60);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });

    return () => {
      clearInterval(timer);
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
    };
  }, [createSession]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft < 2 * 60) return "text-red-600"; // Últimos 2 minutos
    if (timeLeft < 5 * 60) return "text-yellow-600"; // Últimos 5 minutos
    return "text-green-600";
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-600">Sessão:</span>
      <span className={`font-mono font-semibold ${getTimeColor()}`}>
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}
