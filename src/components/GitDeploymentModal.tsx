import React, { useState } from 'react';
import { Terminal, Copy, Check, Download, ExternalLink, GitBranch, FolderCheck, CheckCircle2 } from 'lucide-react';
import { generateRepositoryZip } from '../data/packageFiles';

interface GitDeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  onChangeUsername: (name: string) => void;
}

export const GitDeploymentModal: React.FC<GitDeploymentModalProps> = ({
  isOpen,
  onClose,
  username,
  onChangeUsername
}) => {
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  if (!isOpen) return null;

  const repoName = 'crypto-core-v5';
  const effectiveUsername = username.trim() || 'YOUR_USERNAME';
  const remoteUrl = `https://github.com/${effectiveUsername}/${repoName}.git`;

  const bashScript = `# 1. Vytvorenie a prechod do adresára
mkdir ${repoName} && cd ${repoName}

# 2. Inicializácia Git repozitára
git init

# 3. Pridanie všetkých súborov a commit
git add .
git commit -m "feat: Initializing Transformer V5 core system framework"

# 4. Premenovanie vetvy na main a odoslanie na GitHub
git branch -M main
git remote add origin ${remoteUrl}
git push -u origin main`;

  const handleCopyAll = () => {
    navigator.clipboard.writeText(bashScript);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopyStep = (stepNumber: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepNumber);
    setTimeout(() => setCopiedStep(null), 1800);
  };

  const handleDownloadFullZip = async () => {
    try {
      setIsZipping(true);
      const zipBlob = await generateRepositoryZip(effectiveUsername);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${repoName}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to create ZIP', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/60">
              <Terminal className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Inštrukcie na prevzatie do GitHub
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Repozitár: {repoName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer text-sm"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5">
          
          {/* GitHub Username Input */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <label htmlFor="input-github-user" className="text-xs font-semibold text-slate-200 flex items-center justify-between">
              <span>Váš GitHub Username:</span>
              <span className="text-[11px] font-mono text-cyan-400">Automaticky aktualizuje príkazy</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-500">https://github.com/</span>
              <input
                id="input-github-user"
                type="text"
                value={username}
                onChange={(e) => onChangeUsername(e.target.value)}
                placeholder="YOUR_USERNAME"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
              <span className="text-xs font-mono text-slate-500">/{repoName}.git</span>
            </div>
          </div>

          {/* Quick ZIP Download Action */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <FolderCheck className="h-4 w-4" />
                Predpripravený archív celého repozitára
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Obsahuje všetkých 5 súborov, README.md, .gitignore a presnú priečinkovú štruktúru.
              </p>
            </div>
            <button
              onClick={handleDownloadFullZip}
              disabled={isZipping}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition cursor-pointer shadow-md whitespace-nowrap shrink-0"
            >
              <Download className="h-4 w-4" />
              <span>{isZipping ? 'Balím archív...' : 'Stiahnuť .ZIP'}</span>
            </button>
          </div>

          {/* Step by step terminal commands */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <GitBranch className="h-3.5 w-3.5 text-cyan-400" />
                Kroky pre terminál (Bash / Zsh)
              </span>
              <button
                onClick={handleCopyAll}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition cursor-pointer"
              >
                {copiedAll ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Všetko skopírované!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Kopírovať celý skript</span>
                  </>
                )}
              </button>
            </div>

            {/* Terminal Box */}
            <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-slate-300 space-y-4">
              
              {/* Step 1 */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>1. Vytvorenie a prechod do adresára:</span>
                  <button
                    onClick={() => handleCopyStep(1, `mkdir ${repoName} && cd ${repoName}`)}
                    className="hover:text-slate-300 cursor-pointer"
                  >
                    {copiedStep === 1 ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
                <div className="text-cyan-300 select-all">
                  mkdir {repoName} &amp;&amp; cd {repoName}
                </div>
              </div>

              {/* Step 2 */}
              <div className="space-y-1 border-t border-slate-900 pt-2">
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>2. Inicializácia Git:</span>
                  <button
                    onClick={() => handleCopyStep(2, 'git init')}
                    className="hover:text-slate-300 cursor-pointer"
                  >
                    {copiedStep === 2 ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
                <div className="text-cyan-300 select-all">
                  git init
                </div>
              </div>

              {/* Step 3 */}
              <div className="space-y-1 border-t border-slate-900 pt-2">
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>3. Rozbaľte stiahnuté súbory a pripravte commit:</span>
                  <button
                    onClick={() => handleCopyStep(3, 'git add .\ngit commit -m "feat: Initializing Transformer V5 core system framework"')}
                    className="hover:text-slate-300 cursor-pointer"
                  >
                    {copiedStep === 3 ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
                <div className="text-slate-200 select-all">
                  git add .<br />
                  git commit -m &quot;feat: Initializing Transformer V5 core system framework&quot;
                </div>
              </div>

              {/* Step 4 */}
              <div className="space-y-1 border-t border-slate-900 pt-2">
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span>4. Odoslanie do vzdialeného repozitára:</span>
                  <button
                    onClick={() => handleCopyStep(4, `git branch -M main\ngit remote add origin ${remoteUrl}\ngit push -u origin main`)}
                    className="hover:text-slate-300 cursor-pointer"
                  >
                    {copiedStep === 4 ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
                <div className="text-emerald-400 select-all leading-relaxed">
                  git branch -M main<br />
                  git remote add origin {remoteUrl}<br />
                  git push -u origin main
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>SYSTÉM PRIRODZENÉHO SPRACOVANIA PREDANÝ OPERÁTOROVI</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition"
          >
            Zatvoriť
          </button>
        </div>

      </div>
    </div>
  );
};
