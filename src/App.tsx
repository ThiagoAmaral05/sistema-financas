import { useState, useEffect } from "react";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { WelcomeScreen } from "./WelcomeScreen";
import { Toaster } from "sonner";
import { PropertyExpenseForm } from "./componentes/PropertyExpenseForm";
import { Dashboard } from "./Dashboard";

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const settings = useQuery(api.settings.getUserSettings);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  useEffect(() => {
    if (settings?.darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [settings?.darkMode]);

  if (loggedInUser === undefined) {
    return <div>Carregando...</div>;
  }

  if (showWelcome) {
    return <WelcomeScreen onContinue={() => setShowWelcome(false)} />;
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Authenticated>
        <Dashboard onPropertySelect={setSelectedProperty} />
      </Authenticated>

      <Unauthenticated>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
              <SignInForm />
            </div>
        </div>
      </Unauthenticated>

      <Toaster />
    </div>
  );
}
