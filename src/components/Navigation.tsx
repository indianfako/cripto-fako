import React from 'react';
import { FolderGit2, Network, Coins, FileCheck2, TerminalSquare } from 'lucide-react';

export type ActiveTab = 'repo' | 'node' | 'contracts' | 'compliance' | 'deployment';

interface NavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  pendingTxCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  pendingTxCount = 0
}) => {
  const tabs = [
    {
      id: 'repo' as ActiveTab,
      label: 'Kódový Balík & Súbory',
      shortLabel: 'Súbory',
      icon: FolderGit2,
      badge: '5 Súborov'
    },
    {
      id: 'node' as ActiveTab,
      label: 'EVM Node & IBFT 2.0',
      shortLabel: 'EVM Sieť',
      icon: Network,
      badge: 'Chain 5150'
    },
    {
      id: 'contracts' as ActiveTab,
      label: 'TV5 Token & Staking',
      shortLabel: 'Token & Staking',
      icon: Coins,
      badge: pendingTxCount > 0 ? `${pendingTxCount} Tx` : 'EIP-20'
    },
    {
      id: 'compliance' as ActiveTab,
      label: 'MiCA & GDPR Rámec',
      shortLabel: 'MiCA & GDPR',
      icon: FileCheck2,
      badge: 'EÚ 2023/1114'
    },
    {
      id: 'deployment' as ActiveTab,
      label: 'GitHub Inštrukcie',
      shortLabel: 'GitHub',
      icon: TerminalSquare,
      badge: 'Git Bash'
    },
  ];

  return (
    <div className="border-b border-slate-800 bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 no-scrollbar" aria-label="Hlavné menu">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                    isActive
                      ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/50'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
