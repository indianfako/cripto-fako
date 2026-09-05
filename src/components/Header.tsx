import React from 'react';
import { ShieldCheck, Cpu, Database, Activity, Download, GitBranch } from 'lucide-react';

interface HeaderProps {
  blockHeight: number;
  isAutoMining: boolean;
  onToggleAutoMining: () => void;
  onOpenGitModal: () => void;
  onDownloadZip: () => void;
  activeValidators: number;
  totalTv5Supply: number;
}

export const Header: React.FC<HeaderProps> = ({
  blockHeight,
  isAutoMining,
  onToggleAutoMining,
  onOpenGitModal,
  onDownloadZip,
  activeValidators,
  totalTv5Supply
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-4">
          
          {/* Brand & System Status */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-inner">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  TRANSFORMER V5
                  <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-md bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                    BÁZA A
                  </span>
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  EVM / PoS Online
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                <span>CHAIN ID: <strong className="text-slate-200">5150</strong></span>
                <span>•</span>
                <span>IBFT 2.0 (2s)</span>
                <span>•</span>
                <span className="text-cyan-400 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> GDPR TIER 5
                </span>
              </p>
            </div>
          </div>

          {/* Real-time metrics bar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-mono">
            {/* Block height ticker */}
            <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-cyan-400" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Blok</span>
                <span className="font-semibold text-slate-100">#{blockHeight.toLocaleString()}</span>
              </div>
            </div>

            {/* Validators */}
            <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center gap-2">
              <Database className="h-3.5 w-3.5 text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Validátori</span>
                <span className="font-semibold text-emerald-300">{activeValidators} / 2 PoS</span>
              </div>
            </div>

            {/* TV5 Supply */}
            <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Zásoba TV5</span>
                <span className="font-semibold text-slate-200">
                  {(totalTv5Supply / 1_000_000).toFixed(1)}M / 1 000M
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 ml-auto sm:ml-0">
              <button
                id="header-btn-git-deploy"
                onClick={onOpenGitModal}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-sans font-medium text-xs border border-slate-700 hover:border-slate-600 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Git príkazy pre GitHub repozitár"
              >
                <GitBranch className="h-3.5 w-3.5 text-cyan-400" />
                <span>Git Nasadenie</span>
              </button>

              <button
                id="header-btn-download-zip"
                onClick={onDownloadZip}
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-sans font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm shadow-cyan-950/50"
                title="Stiahnuť celý kódový balík ako ZIP"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Stiahnuť ZIP</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
