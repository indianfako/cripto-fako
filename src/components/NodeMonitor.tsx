import React, { useState } from 'react';
import { BlockData, ValidatorInfo } from '../types';
import {
  Play,
  Pause,
  PlusCircle,
  Network,
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  Clock,
  Flame,
  CheckCircle,
  Copy,
  Check
} from 'lucide-react';

interface NodeMonitorProps {
  blockHeight: number;
  blocks: BlockData[];
  isAutoMining: boolean;
  onToggleAutoMining: () => void;
  onMineBlock: () => void;
  validators: ValidatorInfo[];
}

export const NodeMonitor: React.FC<NodeMonitorProps> = ({
  blockHeight,
  blocks,
  isAutoMining,
  onToggleAutoMining,
  onMineBlock,
  validators
}) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 1800);
  };

  const currentEpoch = Math.floor(blockHeight / 30000) + 1;
  const blocksInEpoch = blockHeight % 30000;
  const epochProgress = ((blocksInEpoch / 30000) * 100).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Node Control Bar */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
            <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              EVM IBFT 2.0 Konsenzus Monitor
              <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                Chain ID 5150
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Aktívny uzol simulujúci produkčnú konfiguráciu siete <code className="text-slate-200">genesis.json</code> s 2-sekundovým blokovým intervalom, IBFT 2.0 deterministickou finalitou a dvoma PoS validátormi.
          </p>
        </div>

        {/* Mining Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            id="btn-toggle-automine"
            onClick={onToggleAutoMining}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-mono flex items-center gap-2 transition cursor-pointer ${
              isAutoMining
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
            }`}
          >
            {isAutoMining ? (
              <>
                <Pause className="h-3.5 w-3.5" />
                <span>Auto-Ťažba (2s): ZAPNUTÉ</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" />
                <span>Auto-Ťažba: POZASTAVENÉ</span>
              </>
            )}
          </button>

          <button
            id="btn-mine-manual-block"
            onClick={onMineBlock}
            className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Vygenerovať Blok</span>
          </button>
        </div>
      </div>

      {/* Network Specs Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Chain ID & Epoch */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-cyan-400" /> Epocha
            </span>
            <span className="text-cyan-400 font-semibold">{epochProgress}%</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-100">
            #{currentEpoch} <span className="text-xs font-normal text-slate-400">({blocksInEpoch} / 30 000)</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-cyan-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${epochProgress}%` }}
            />
          </div>
        </div>

        {/* Card 2: Block Period */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-amber-400" /> Block Period
            </span>
            <span className="text-emerald-400">Pravidelný</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-100">
            2.0 sekundy
          </div>
          <p className="text-[11px] text-slate-400 font-mono truncate">
            Timeout: 4s • London/Berlin: Aktívne
          </p>
        </div>

        {/* Card 3: Gas Limit */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-red-400" /> Gas Limit
            </span>
            <span className="text-xs text-slate-500">Genesis</span>
          </div>
          <div className="text-sm font-bold font-mono text-slate-200 truncate" title="0x1fffffffffffff">
            0x1fffffffffffff
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Kapacita: ~9.00 Petagas
          </p>
        </div>

        {/* Card 4: PoS Finality */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Konsenzus
            </span>
            <span className="text-emerald-400">IBFT 2.0</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-100">
            Okamžitá Finalita
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            Žiadne reorgs • 2/3 BFT kvórum
          </p>
        </div>
      </div>

      {/* Validators & IBFT 2.0 Voting State */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Validators Table */}
        <div className="lg:col-span-7 rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-100">
                Genesis Validátori (IBFT 2.0 PoS)
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
              100% Konsenzus Kvórum
            </span>
          </div>

          <div className="space-y-3">
            {validators.map((val, idx) => (
              <div
                key={val.address}
                className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-semibold text-slate-200">{val.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      ID #{idx + 1}
                    </span>
                  </div>
                  <div className="text-slate-400 flex items-center gap-2 text-[11px]">
                    <span className="truncate">{val.address}</span>
                    <button
                      onClick={() => copyToClipboard(val.address)}
                      className="text-slate-500 hover:text-slate-300 transition"
                      title="Kopírovať adresu"
                    >
                      {copiedHash === val.address ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-[11px] text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Navrhnuté bloky</span>
                    <span className="font-bold text-cyan-400">{val.proposals}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Uptime</span>
                    <span className="font-bold text-emerald-400">{val.uptime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* IBFT 2.0 Consensus explanation */}
          <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/60 text-xs text-slate-400 space-y-1.5">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              Proces IBFT 2.0 rotácie:
            </span>
            <p className="text-[11px] leading-relaxed">
              V sieti Transformer V5 sa validátori striedajú v navrhovaní blokov v každom 2-sekundovom kole. Každý blok obsahuje kryptografické podpisy validátorov v poli <code className="text-slate-300">extraData</code> z <code className="text-slate-300">genesis.json</code>.
            </p>
          </div>
        </div>

        {/* Genesis Parameters Panel */}
        <div className="lg:col-span-5 rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-100">
                Genesis Alokácia & Parametre
              </h3>
            </div>
            <span className="text-xs font-mono text-cyan-400">v5-core</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
              <div className="flex justify-between text-slate-400 text-[11px]">
                <span>Operátorská Genesis Adresa (GDPR Anonymized):</span>
                <span className="text-emerald-400 font-semibold">Tier 5</span>
              </div>
              <div className="text-slate-200 truncate text-[11px]">
                0xREDACTED_OPERATOR_GENESIS_ADDRESS
              </div>
              <div className="text-[11px] text-amber-300 font-semibold pt-1">
                Počiatočný zostatok: 100 000 000 TV5 (10% Likvidita)
              </div>
              <div className="text-[10px] text-slate-500">
                Hex hodnota: 0x33B2E3C9FD0803CE8000000
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="text-slate-500 block">Difficulty:</span>
                <span className="text-slate-200 font-semibold">0x1 (PoS constant)</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="text-slate-500 block">Nonce:</span>
                <span className="text-slate-200 font-semibold">0x0</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="text-slate-500 block">Request Timeout:</span>
                <span className="text-slate-200 font-semibold">4 sekundy</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="text-slate-500 block">EVM Hardforks:</span>
                <span className="text-slate-200 font-semibold">London / Berlin</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] space-y-1">
              <span className="text-slate-500 block">MixHash identifikátor:</span>
              <span className="text-slate-300 text-[10px] break-all">
                0x6374696361206279746573206f66206974616c69616e2070726f6f66206f6620
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Live Recent Blocks Stream */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">
              Živý reťazec blokov (Najnovšie bloky siete)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Celkovo blokov: #{blockHeight}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-2.5 px-3">Blok #</th>
                <th className="py-2.5 px-3">Hash</th>
                <th className="py-2.5 px-3">Navrhovateľ</th>
                <th className="py-2.5 px-3">Transakcie</th>
                <th className="py-2.5 px-3">Gas Used</th>
                <th className="py-2.5 px-3">Čas</th>
                <th className="py-2.5 px-3 text-right">Stav</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {blocks.map((b) => (
                <tr key={b.number} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3 font-semibold text-cyan-400">
                    #{b.number}
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <span>{b.hash.slice(0, 10)}...{b.hash.slice(-6)}</span>
                      <button
                        onClick={() => copyToClipboard(b.hash)}
                        className="text-slate-500 hover:text-slate-300"
                        title="Kopírovať hash"
                      >
                        {copiedHash === b.hash ? (
                          <Check className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-[10px]">
                      {b.validator === '0x0000000000000000000000000000000000000001'
                        ? 'Validátor #1'
                        : 'Validátor #2'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-semibold">
                    {b.txCount} txs
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    {b.gasUsed}
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">
                    {new Date(b.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                      <CheckCircle className="h-2.5 w-2.5" />
                      IBFT Finalized
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
