interface GroupTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isAdmin: boolean;
}

export const GroupTabs = ({ activeTab, onTabChange, isAdmin }: GroupTabsProps) => {
  const tabs = [
    { id: 'discussions', label: 'Discussões' },
    { id: 'announcements', label: 'Anúncios' },
    { id: 'members', label: 'Membros' },
    { id: 'events', label: 'Eventos' },
    { id: 'about', label: 'Sobre' },
    { id: 'marketplace', label: 'Marketplace' },
  ];

  return (
    <div className="border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-500'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};
