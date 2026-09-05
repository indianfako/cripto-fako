import React, { useState } from 'react';
import { ShieldCheck, FileCheck, CheckCircle2, Lock, EyeOff, Scale, AlertTriangle, Download, Copy, Check } from 'lucide-react';
import { REPOSITORY_FILES, downloadFileDirect } from '../data/packageFiles';

export const ComplianceViewer: React.FC = () => {
  const [operatorEntity, setOperatorEntity] = useState<string>('V5 PROTOCOL LABS S.R.O. (EU REGISTERED)');
  const [copied, setCopied] = useState<boolean>(false);

  const micaFile = REPOSITORY_FILES.find((f) => f.id === 'mica-compliance') || REPOSITORY_FILES[4];

  const handleCopyManifest = () => {
    navigator.clipboard.writeText(micaFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadManifest = () => {
    downloadFileDirect('MICA_COMPLIANCE.md', micaFile.content, 'text/markdown');
  };

  const complianceAudits = [
    {
      title: 'MiCA Token Classification',
      regulation: 'Nariadenie EÚ 2023/1114, Článok 4-15',
      status: 'VYHOVUJE',
      type: 'Non-ART (Utility Token / Payment Token)',
      desc: 'Token TV5 nie je naviazaný na hodnotu fiat mien ani košov aktív (nie je EMT ani ART). Pôsobí ako úžitkový token pre staking a sieťový plyn.'
    },
    {
      title: 'GDPR Tier 5 On-Chain Anonymization',
      regulation: 'Nariadenie GDPR (EÚ) 2016/679',
      status: 'VYHOVUJE',
      type: 'Zero-PII On-Chain Policy',
      desc: 'Všetky záznamy v blokoch (transakcie, staking, validátori) využívajú výhradne kryptografické 160-bitové adresy (keccak256 hash). Žiadne osobné údaje nie sú uložené v smart kontraktoch.'
    },
    {
      title: 'Zero RPC Telemetry Policy',
      regulation: 'EÚ Data Act & ePrivacy Directive',
      status: 'VYHOVUJE',
      type: 'Kryptografické súkromie',
      desc: 'RPC endpoints definované v web3Config.ts vynucujú prísnu politiku bez uchovávania logov IP adries a bez telemetrického sledovania dopytov používateľov.'
    },
    {
      title: 'Transparentný strop zásob (1B TV5)',
      regulation: 'MiCA Článok 6 (Kryptografický audit ponuky)',
      status: 'VYHOVUJE',
      type: 'Smart Contract Invariant',
      desc: 'Zmluva CoreToken.sol garantuje pevný strop MAX_SUPPLY = 1 000 000 000 TV5 s funkciou require() pred akoukoľvek razbou.'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <h2 className="text-base font-bold text-white tracking-wide">
              EÚ MiCA & GDPR Tier 5 Právny a Bezpečnostný Rámec
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Overenie súladu architektúry siete Transformer V5 s Nariadením Európskeho parlamentu a Rady (EÚ) 2023/1114 (MiCA) a štandardmi ochrany súkromia GDPR.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyManifest}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Skopírované!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-400" />
                <span>Kopírovať Manifest</span>
              </>
            )}
          </button>
          <button
            onClick={handleDownloadManifest}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Stiahnuť .MD</span>
          </button>
        </div>
      </div>

      {/* Compliance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {complianceAudits.map((item, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Scale className="h-3.5 w-3.5 text-cyan-400" />
                {item.title}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                {item.status}
              </span>
            </div>
            <div className="text-[11px] font-mono text-cyan-400">
              {item.regulation} • {item.type}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Manifest Markdown Document Preview */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">
              /legal-docs/MICA_COMPLIANCE.md (Dokument zmluvy a compliance)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Markdown formát
          </span>
        </div>

        {/* Entity Editor */}
        <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-2">
          <label htmlFor="input-operator-entity" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-amber-400" />
            Právna entita operátora (Issuer Entity):
          </label>
          <div className="flex gap-2">
            <input
              id="input-operator-entity"
              type="text"
              value={operatorEntity}
              onChange={(e) => setOperatorEntity(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              placeholder="Zadajte názov licencovanej entity"
            />
          </div>
          <p className="text-[10px] text-slate-500 font-mono">
            Tento parameter nahrádza placeholder <code className="text-slate-400">[PRÁVNA ENTITA OPERÁTORA]</code> v sekcii 1.1 MiCA Manifestu pred zverejnením.
          </p>
        </div>

        {/* Raw Manifest Box */}
        <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-3 leading-relaxed">
          <div className="text-cyan-400 font-bold">
            # EU MiCA & GDPR Compliance Manifest
          </div>
          
          <div className="space-y-1">
            <div className="text-slate-200 font-semibold">## 1. Governance & Entity</div>
            <div>- Issuer: <span className="text-amber-300 font-bold">{operatorEntity}</span></div>
            <div>- Regulatory Framework: EU Regulation 2023/1114 (MiCA)</div>
          </div>

          <div className="space-y-1">
            <div className="text-slate-200 font-semibold">## 2. Token Classification</div>
            <div>- Token Type: Utility Token / Payment Token</div>
            <div>- Classification: Non-Asset Referenced Token (Non-ART)</div>
          </div>

          <div className="space-y-1">
            <div className="text-slate-200 font-semibold">## 3. GDPR Protocols</div>
            <div>- On-Chain Anonymization: No PII (Personally Identifiable Information) stored on-chain.</div>
            <div>- Off-Chain Nodes: Zero telemetry collection policy enforced on node RPC endpoints.</div>
          </div>
        </div>

      </div>

    </div>
  );
};
