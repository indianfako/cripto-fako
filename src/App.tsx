import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Navigation, ActiveTab } from './components/Navigation';
import { CodePackageViewer } from './components/CodePackageViewer';
import { NodeMonitor } from './components/NodeMonitor';
import { TokenStakingPlayground } from './components/TokenStakingPlayground';
import { ComplianceViewer } from './components/ComplianceViewer';
import { GitDeploymentModal } from './components/GitDeploymentModal';
import { BlockData, SystemTransaction, ValidatorInfo } from './types';
import { generateRepositoryZip } from './data/packageFiles';
import { CheckCircle2, Terminal, Shield, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('repo');
  const [isGitModalOpen, setIsGitModalOpen] = useState<boolean>(false);
  const [githubUsername, setGithubUsername] = useState<string>('YOUR_USERNAME');

  // Blockchain state (Genesis: Chain 5150, IBFT 2.0)
  const [blockHeight, setBlockHeight] = useState<number>(14290);
  const [isAutoMining, setIsAutoMining] = useState<boolean>(true);

  // TV5 Token & Staking state (CoreToken.sol: MAX_SUPPLY = 1,000,000,000; Initial 100M)
  const maxSupply = 1_000_000_000;
  const [totalTv5Supply, setTotalTv5Supply] = useState<number>(100_000_000);
  const [userBalance, setUserBalance] = useState<number>(100_000_000); // 0x33B2E3C9FD0803CE8000000
  const [stakedBalance, setStakedBalance] = useState<number>(0);

  // Genesis Validators
  const [validators, setValidators] = useState<ValidatorInfo[]>([
    {
      address: '0x0000000000000000000000000000000000000001',
      name: 'Validátor Alfa (Genesis #1)',
      status: 'ACTIVE',
      proposals: 7145,
      uptime: '99.99%'
    },
    {
      address: '0x0000000000000000000000000000000000000002',
      name: 'Validátor Beta (Genesis #2)',
      status: 'ACTIVE',
      proposals: 7145,
      uptime: '99.98%'
    }
  ]);

  // Initial Blocks
  const [blocks, setBlocks] = useState<BlockData[]>([
    {
      number: 14290,
      hash: '0x8f3c7b2a9e1d4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f90',
      parentHash: '0x7e2b6a1f8d0c3e4b5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f',
      timestamp: Date.now() - 2000,
      validator: '0x0000000000000000000000000000000000000002',
      txCount: 1,
      gasUsed: '42,000 (0.00%)',
      gasLimit: '0x1fffffffffffff',
      round: 0
    },
    {
      number: 14289,
      hash: '0x7e2b6a1f8d0c3e4b5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f',
      parentHash: '0x6d1a5f0e7c9b2d3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a',
      timestamp: Date.now() - 4000,
      validator: '0x0000000000000000000000000000000000000001',
      txCount: 0,
      gasUsed: '21,000 (0.00%)',
      gasLimit: '0x1fffffffffffff',
      round: 0
    },
    {
      number: 14288,
      hash: '0x6d1a5f0e7c9b2d3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a',
      parentHash: '0x5c0f4e9d6b8a1c2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
      timestamp: Date.now() - 6000,
      validator: '0x0000000000000000000000000000000000000002',
      txCount: 2,
      gasUsed: '84,000 (0.00%)',
      gasLimit: '0x1fffffffffffff',
      round: 0
    }
  ]);

  // Initial Transactions
  const [transactions, setTransactions] = useState<SystemTransaction[]>([
    {
      id: 'tx-init-genesis',
      hash: '0x4a7e9f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f',
      blockNumber: 14285,
      timestamp: Date.now() - 10000,
      type: 'MINT',
      from: '0x0000000000000000000000000000000000000000',
      to: '0xREDACTED_OPERATOR_GENESIS_ADDRESS',
      amount: 100_000_000,
      status: 'confirmed'
    }
  ]);

  // Block generation helper (2-second IBFT 2.0 block timer)
  const mineNewBlock = useCallback((txsToAdd: number = 0) => {
    setBlockHeight((prevHeight) => {
      const nextHeight = prevHeight + 1;
      const isEven = nextHeight % 2 === 0;
      const validator = isEven
        ? '0x0000000000000000000000000000000000000002'
        : '0x0000000000000000000000000000000000000001';

      const randomHashPart = Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      const newHash = `0x${randomHashPart}`;

      const newBlock: BlockData = {
        number: nextHeight,
        hash: newHash,
        parentHash: blocks[0]?.hash || '0x0000000000000000000000000000000000000000',
        timestamp: Date.now(),
        validator,
        txCount: txsToAdd,
        gasUsed: txsToAdd > 0 ? `${(txsToAdd * 48000).toLocaleString()} gas` : '21,000 (0.00%)',
        gasLimit: '0x1fffffffffffff',
        round: 0
      };

      setBlocks((prev) => [newBlock, ...prev.slice(0, 19)]);

      // Update validator proposal count
      setValidators((prevVals) =>
        prevVals.map((v) =>
          v.address === validator ? { ...v, proposals: v.proposals + 1 } : v
        )
      );

      return nextHeight;
    });
  }, [blocks]);

  // IBFT 2.0 Block Timer (blockperiodseconds = 2)
  useEffect(() => {
    if (!isAutoMining) return;
    const interval = setInterval(() => {
      mineNewBlock(0);
    }, 2000);
    return () => clearInterval(interval);
  }, [isAutoMining, mineNewBlock]);

  // Smart Contract Method: mint()
  const handleMint = (amount: number) => {
    if (totalTv5Supply + amount > maxSupply) {
      return {
        success: false,
        message: `Chyba EVM: CoreToken: Max supply exceeded. Zostáva: ${(maxSupply - totalTv5Supply).toLocaleString()} TV5.`
      };
    }

    const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const newTx: SystemTransaction = {
      id: `tx-${Date.now()}`,
      hash: txHash,
      blockNumber: blockHeight + 1,
      timestamp: Date.now(),
      type: 'MINT',
      from: '0x0000000000000000000000000000000000000000',
      to: '0xREDACTED_OPERATOR_GENESIS_ADDRESS',
      amount,
      status: 'confirmed'
    };

    setTotalTv5Supply((prev) => prev + amount);
    setUserBalance((prev) => prev + amount);
    setTransactions((prev) => [newTx, ...prev]);
    mineNewBlock(1);

    return {
      success: true,
      message: `Úspech: Vyrazených ${amount.toLocaleString()} TV5 tokenov do peňaženky operátora (Tx: ${txHash.slice(0, 10)}...).`
    };
  };

  // Smart Contract Method: burn()
  const handleBurn = (amount: number) => {
    if (userBalance < amount) {
      return {
        success: false,
        message: `Chyba EVM: ERC20: burn amount exceeds balance. Máte: ${userBalance.toLocaleString()} TV5.`
      };
    }

    const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const newTx: SystemTransaction = {
      id: `tx-${Date.now()}`,
      hash: txHash,
      blockNumber: blockHeight + 1,
      timestamp: Date.now(),
      type: 'BURN',
      from: '0xREDACTED_OPERATOR_GENESIS_ADDRESS',
      to: '0x0000000000000000000000000000000000000000',
      amount,
      status: 'confirmed'
    };

    setUserBalance((prev) => prev - amount);
    setTotalTv5Supply((prev) => prev - amount);
    setTransactions((prev) => [newTx, ...prev]);
    mineNewBlock(1);

    return {
      success: true,
      message: `Úspech: Úspešne spálených ${amount.toLocaleString()} TV5. Celková ponuka sa znížila.`
    };
  };

  // Smart Contract Method: transfer()
  const handleTransfer = (to: string, amount: number) => {
    if (userBalance < amount) {
      return {
        success: false,
        message: `Chyba EVM: ERC20: transfer amount exceeds balance.`
      };
    }

    const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const newTx: SystemTransaction = {
      id: `tx-${Date.now()}`,
      hash: txHash,
      blockNumber: blockHeight + 1,
      timestamp: Date.now(),
      type: 'TRANSFER',
      from: '0xREDACTED_OPERATOR_GENESIS_ADDRESS',
      to: to || '0xRecipient',
      amount,
      status: 'confirmed'
    };

    setUserBalance((prev) => prev - amount);
    setTransactions((prev) => [newTx, ...prev]);
    mineNewBlock(1);

    return {
      success: true,
      message: `Prevod: Odoslaných ${amount.toLocaleString()} TV5 na adresu ${to.slice(0, 10)}...`
    };
  };

  // Staking Method: stake()
  const handleStake = (amount: number) => {
    if (userBalance < amount) {
      return {
        success: false,
        message: `Chyba Stakingu: Nedostatočný zostatok pre vklad. Máte: ${userBalance.toLocaleString()} TV5.`
      };
    }

    const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const newTx: SystemTransaction = {
      id: `tx-${Date.now()}`,
      hash: txHash,
      blockNumber: blockHeight + 1,
      timestamp: Date.now(),
      type: 'STAKE',
      from: '0xREDACTED_OPERATOR_GENESIS_ADDRESS',
      to: 'CoreStaking Contract (0xStaking)',
      amount,
      status: 'confirmed'
    };

    setUserBalance((prev) => prev - amount);
    setStakedBalance((prev) => prev + amount);
    setTransactions((prev) => [newTx, ...prev]);
    mineNewBlock(1);

    return {
      success: true,
      message: `Stake potvrdený: Vložených ${amount.toLocaleString()} TV5 do protokolu CoreStaking.`
    };
  };

  // Staking Method: withdraw()
  const handleWithdraw = (amount: number) => {
    if (stakedBalance < amount) {
      return {
        success: false,
        message: `Chyba Stakingu: Insufficient stake. Vložené máte iba: ${stakedBalance.toLocaleString()} TV5.`
      };
    }

    const txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const newTx: SystemTransaction = {
      id: `tx-${Date.now()}`,
      hash: txHash,
      blockNumber: blockHeight + 1,
      timestamp: Date.now(),
      type: 'WITHDRAW',
      from: 'CoreStaking Contract',
      to: '0xREDACTED_OPERATOR_GENESIS_ADDRESS',
      amount,
      status: 'confirmed'
    };

    setStakedBalance((prev) => prev - amount);
    setUserBalance((prev) => prev + amount);
    setTransactions((prev) => [newTx, ...prev]);
    mineNewBlock(1);

    return {
      success: true,
      message: `Výber úspešný: Vybratých ${amount.toLocaleString()} TV5 zo staking kontraktu.`
    };
  };

  // Quick ZIP Download
  const handleDownloadFullZip = async () => {
    try {
      const zipBlob = await generateRepositoryZip(githubUsername);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'crypto-core-v5.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Chyba pri sťahovaní ZIP', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-300">
      
      {/* Top Header with live network status */}
      <Header
        blockHeight={blockHeight}
        isAutoMining={isAutoMining}
        onToggleAutoMining={() => setIsAutoMining((prev) => !prev)}
        onOpenGitModal={() => setIsGitModalOpen(true)}
        onDownloadZip={handleDownloadFullZip}
        activeValidators={validators.length}
        totalTv5Supply={totalTv5Supply}
      />

      {/* Primary Navigation Tabs */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'deployment') {
            setIsGitModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {activeTab === 'repo' && (
          <CodePackageViewer />
        )}

        {activeTab === 'node' && (
          <NodeMonitor
            blockHeight={blockHeight}
            blocks={blocks}
            isAutoMining={isAutoMining}
            onToggleAutoMining={() => setIsAutoMining((prev) => !prev)}
            onMineBlock={() => mineNewBlock(1)}
            validators={validators}
          />
        )}

        {activeTab === 'contracts' && (
          <TokenStakingPlayground
            totalTv5Supply={totalTv5Supply}
            maxSupply={maxSupply}
            userBalance={userBalance}
            stakedBalance={stakedBalance}
            onMint={handleMint}
            onBurn={handleBurn}
            onTransfer={handleTransfer}
            onStake={handleStake}
            onWithdraw={handleWithdraw}
            transactions={transactions}
          />
        )}

        {activeTab === 'compliance' && (
          <ComplianceViewer />
        )}

      </main>

      {/* Quick Action Footer Banner */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-slate-400">
              CORE-SYSTEM BÁZA A (EVM / POS) • PROTOKOL GDPR TIER 5
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsGitModalOpen(true)}
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition"
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>Git Export: crypto-core-v5</span>
            </button>
            <span>•</span>
            <span className="text-slate-500">
              Transformer V5 Architecture
            </span>
          </div>
        </div>
      </footer>

      {/* Git Deployment Modal */}
      <GitDeploymentModal
        isOpen={isGitModalOpen}
        onClose={() => setIsGitModalOpen(false)}
        username={githubUsername}
        onChangeUsername={setGithubUsername}
      />

    </div>
  );
}
