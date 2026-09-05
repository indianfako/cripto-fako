import React, { useState } from 'react';
import { REPOSITORY_FILES, downloadFileDirect } from '../data/packageFiles';
import { CodeFile } from '../types';
import { Copy, Check, Download, FileCode, Folder, Info, Terminal, CheckCircle2 } from 'lucide-react';

export const CodePackageViewer: React.FC = () => {
  const [selectedFileId, setSelectedFileId] = useState<string>(REPOSITORY_FILES[0].id);
  const [copied, setCopied] = useState<boolean>(false);

  const selectedFile: CodeFile =
    REPOSITORY_FILES.find((f) => f.id === selectedFileId) || REPOSITORY_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const mimeTypes: Record<string, string> = {
      json: 'application/json',
      solidity: 'text/plain',
      typescript: 'application/typescript',
      markdown: 'text/markdown'
    };
    downloadFileDirect(
      selectedFile.filename,
      selectedFile.content,
      mimeTypes[selectedFile.language] || 'text/plain'
    );
  };

  // Group files by directory for the tree view
  const directories = Array.from(new Set(REPOSITORY_FILES.map((f) => f.directory)));

  return (
    <div className="space-y-6">
      {/* Intro banner */}
      <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
            <h2 className="text-base font-semibold text-slate-100">
              Produkčný kódový balík Transformer V5 (Báza A)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Všetkých 5 kľúčových komponentov architektúry je pripravených na nasadenie: sieťový Genesis súbor, inteligentné zmluvy EIP-20 a Staking, Wagmi Web3 konfigurácia a MiCA/GDPR dokumentácia.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
          <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700">
            5 Súborov
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700">
            Chain ID: 5150
          </span>
          <span className="px-2.5 py-1 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800/50">
            GDPR Tier 5 OK
          </span>
        </div>
      </div>

      {/* Main Grid: File Tree + Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Directory Explorer */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Folder className="h-3.5 w-3.5 text-cyan-400" />
                Štruktúra repozitára
              </span>
              <span className="text-[10px] font-mono text-cyan-400">crypto-core-v5</span>
            </div>

            <div className="space-y-3">
              {directories.map((dir) => {
                const filesInDir = REPOSITORY_FILES.filter((f) => f.directory === dir);
                return (
                  <div key={dir} className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 px-2 py-1">
                      <Folder className="h-3 w-3 text-amber-400" />
                      <span>/{dir}</span>
                    </div>
                    <div className="pl-4 space-y-1">
                      {filesInDir.map((file) => {
                        const isSelected = selectedFileId === file.id;
                        return (
                          <button
                            key={file.id}
                            id={`file-btn-${file.id}`}
                            onClick={() => setSelectedFileId(file.id)}
                            className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-mono transition flex items-center justify-between group cursor-pointer ${
                              isSelected
                                ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-800/70 font-semibold'
                                : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent'
                            }`}
                          >
                            <span className="flex items-center gap-2 truncate">
                              <FileCode
                                className={`h-3.5 w-3.5 shrink-0 ${
                                  isSelected ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                                }`}
                              />
                              <span className="truncate">{file.filename}</span>
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded uppercase ${
                                isSelected
                                  ? 'bg-cyan-900/60 text-cyan-200'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {file.language}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Context box about selected file */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Info className="h-3.5 w-3.5 text-cyan-400" />
              <span>Architektonický popis</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {selectedFile.description}
            </p>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Cesta:</span>
              <span className="text-cyan-300">{selectedFile.path}</span>
            </div>
          </div>
        </div>

        {/* Right column: Code Viewer & Actions */}
        <div className="lg:col-span-8 rounded-xl bg-slate-900/90 border border-slate-800 shadow-sm overflow-hidden flex flex-col">
          
          {/* Top Bar of the Code Viewer */}
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="text-xs font-mono font-medium text-slate-200 truncate ml-2">
                {selectedFile.path}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {selectedFile.badge}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-copy-code"
                onClick={handleCopy}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
                title="Kopírovať obsah do schránky"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Skopírované!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-slate-400" />
                    <span>Kopírovať</span>
                  </>
                )}
              </button>

              <button
                id="btn-download-file"
                onClick={handleDownload}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
                title="Stiahnuť tento súbor"
              >
                <Download className="h-3.5 w-3.5 text-slate-400" />
                <span>Stiahnuť</span>
              </button>
            </div>
          </div>

          {/* Actual Code View with Line Numbers */}
          <div className="p-4 bg-slate-950 font-mono text-xs overflow-x-auto max-h-[640px] text-slate-300 leading-relaxed">
            <pre className="flex">
              <span className="select-none text-slate-600 text-right pr-4 border-r border-slate-800 mr-4 shrink-0 font-mono">
                {selectedFile.content.split('\n').map((_, index) => (
                  <span key={index} className="block leading-6">
                    {index + 1}
                  </span>
                ))}
              </span>
              <code className="text-slate-200 block overflow-x-auto w-full leading-6">
                {selectedFile.content.split('\n').map((line, idx) => {
                  // Subtle syntax styling
                  let lineClass = "text-slate-200";
                  if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
                    lineClass = "text-slate-500 italic";
                  } else if (line.includes('contract ') || line.includes('function ') || line.includes('import ') || line.includes('export ')) {
                    lineClass = "text-cyan-300 font-medium";
                  } else if (line.includes('require(') || line.includes('emit ') || line.includes('return')) {
                    lineClass = "text-amber-300";
                  } else if (line.includes('"chainId"') || line.includes('"ibft2"') || line.includes('MAX_SUPPLY')) {
                    lineClass = "text-emerald-300";
                  }

                  return (
                    <span key={idx} className={`block whitespace-pre ${lineClass}`}>
                      {line || ' '}
                    </span>
                  );
                })}
              </code>
            </pre>
          </div>

          {/* Quick verification badge */}
          <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Kód overený • Pripravený na GitHub commit</span>
            </div>
            <span>{selectedFile.content.split('\n').length} riadkov</span>
          </div>

        </div>

      </div>
    </div>
  );
};
