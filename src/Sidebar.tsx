import { ActivePage } from "./Dashboard";

interface SidebarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ activePage, setActivePage, isOpen, setIsOpen }: SidebarProps) {
  const menuItems = [
    {
      id: "controlPanel" as ActivePage,
      name: "Painel de Controle",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
        </svg>
      ),
    },
    {
      id: "reportPanel" as ActivePage,
      name: "Relatórios",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: "calendar" as ActivePage,
      name: "Calendário",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 bg-white dark:bg-gray-800 shadow-lg transform transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64' : 'w-16'}
        border-r border-gray-200 dark:border-gray-700
        lg:static lg:inset-0
      `}>
        {/* Topo da Sidebar */}
        <div className="flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          {isOpen && (
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Menu
            </h2>
          )}

          {/* Botão sempre dentro da sidebar */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded transition-colors hover:bg-green-700 dark:hover:bg-green-800 text-black dark:text-white"
          >
            {isOpen ? (
              // ← Seta para fechar
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 12H5m6 7l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              // → Seta para abrir
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>

        {/* Menu de Navegação */}
        <nav className="mt-8">
          <div className="px-2 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  setIsOpen(false);
                }}
                className={`group w-full flex items-center px-2 py-3 rounded-lg transition-colors duration-200
                  ${activePage === item.id
                    ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-r-4 border-green-500'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
                title={!isOpen ? item.name : undefined}
              >
                <div className="flex justify-center items-center w-10">
                  {item.icon}
                </div>
                <div
                  className={`
                    overflow-hidden whitespace-nowrap transition-all duration-300
                    ${isOpen ? 'max-w-[200px] ml-2 opacity-100' : 'max-w-0 opacity-0'}
                  `}
                >
                  {item.name}
                </div>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}