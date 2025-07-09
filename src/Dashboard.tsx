import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ControlPanel } from "./componentes/ControlPanel";
import { ReportPanel } from "./componentes/ReportPanel";
import { Calendar } from "./componentes/Calendar";

export type ActivePage = "controlPanel" | "reportPanel" | "calendar";

interface DashboardProps {
  onPropertySelect: (propertyName: string) => void;
}

export function Dashboard({ onPropertySelect }: DashboardProps) {
  const [activePage, setActivePage] = useState<ActivePage>("controlPanel");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activePage) {
      case "controlPanel":
        return <ControlPanel onPropertySelect={onPropertySelect} />;
      case "reportPanel":
        return <ReportPanel />;
      case "calendar":
        return <Calendar />;
      default:
        return <ControlPanel onPropertySelect={onPropertySelect} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          activePage={activePage}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
