import React, { useState, useEffect } from 'react';
import { SystemTransaction } from '../types';
import {
  Coins,
  Flame,
  PlusCircle,
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  History,
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle2,
  Wallet
} from 'lucide-react';

interface TokenStakingPlaygroundProps {
  totalTv5Supply: number;
  maxSupply: number;
  userBalance: number;
  stakedBalance: number;
  onMint: (amount: number) => { success: boolean; message: string };
  onBurn: (amount: number) => { success: boolean; message: string };
  onTransfer: (to: string, amount: number) => { success: boolean; message: string };
  onStake: (amount: number) => { success: boolean; message: string };
  onWithdraw: (amount: number) => { success: boolean; message: string };
  transactions: SystemTransaction[];
}

export const TokenStakingPlayground: React.FC<TokenStakingPlaygroundProps> = ({
  totalTv5Supply,
  maxSupply,
  userBalance,
  stakedBalance,
  onMint,
  onBurn,
  onTransfer,
  onStake,
  onWithdraw,
  transactions
}) => {
  // Inputs state
  const [mintAmount, setMintAmount] = useState<string>('5000000');
  const [burnAmount, setBurnAmount] = useState<string>('100000');
  const [transferRecipient, setTransferRecipient] = useState<string>('0x71C...ValidatorPool');
  const [transferAmount, setTransferAmount] = useState<string>('250000');
  const [stakeAmount, setStakeAmount] = useState<string>('1000000');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('500000');

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Live reward counter (based on rewardRate = 100 in Staking.sol)
  const [accruedRewards, setAccruedRewards] = useState<number>(0);

  useEffect(() => {
    if (stakedBalance <= 0) {
      setAccruedRewards(0);
      return;
    }
    // Simulate ~10% APY ticking in real-time
    const interval = setInterval(() => {
      setAccruedRewards((prev) => prev + (stakedBalance * 0.1) / (365 * 24 * 60));
    }, 1000);
    return () => clearInterval(interval);
  }, [stakedBalance]);

  const showFeedback = (res: { success: boolean; message: string }) => {
    setNotification({
      type: res.success ? 'success' : 'error',
      text: res.message
    });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleMintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(mintAmount);
    if (isNaN(val) || val <= 0) return;
    const res = onMint(val);
    showFeedback(res);
  };

  const handleBurnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(burnAmount);
    if (isNaN(val) || val <= 0) return;
    const res = onBurn(val);
    showFeedback(res);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(transferAmount);
    if (isNaN(val) || val <= 0) return;
    const res = onTransfer(transferRecipient, val);
    showFeedback(res);
  };

  const handleStakeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(stakeAmount);
    if (isNaN(val) || val <= 0) return;
    const res = onStake(val);
    showFeedback(res);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(withdrawAmount);
    if (isNaN(val) || val <= 0) return;
    const res = onWithdraw(val);
    showFeedback(res);
  };

  const supplyPercentage = ((totalTv5Supply / maxSupply) * 100).toFixed(2);

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-mono flex items-center justify-between transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
              : 'bg-red-950/80 text-red-300 border-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-400" />
            )}
            <span>{notification.text}</span>
          </div>
        </div>
      )}

      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: Token Total Supply */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Coins className="h-3.5 w-3.5 text-cyan-400" /> TV5 Celková Zásoba
            </span>
            <span className="text-cyan-400 font-semibold">{supplyPercentage}%</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-100">
            {totalTv5Supply.toLocaleString()} <span className="text-xs text-slate-400 font-normal">TV5</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${supplyPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>Minted: {(totalTv5Supply / 1e6).toFixed(1)}M</span>
            <span>Hard Cap: {(maxSupply / 1e6).toFixed(0)}M TV5</span>
          </div>
        </div>

        {/* Card 2: User Wallet Balance */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Wallet className="h-3.5 w-3.5 text-amber-400" /> Vlastný Zostatok
            </span>
            <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
              0xREDACTED...
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-amber-300">
            {userBalance.toLocaleString()} <span className="text-xs text-slate-400 font-normal">TV5</span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono">
            10% Genesis likvidity alokovanej v <code className="text-slate-200">genesis.json</code>
          </p>
        </div>

        {/* Card 3: Staked & Rewards */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-emerald-400" /> Vložené do Stakingu
            </span>
            <span className="text-emerald-400 font-semibold">rewardRate: 100</span>
          </div>
          <div className="text-xl font-bold font-mono text-emerald-300">
            {stakedBalance.toLocaleString()} <span className="text-xs text-slate-400 font-normal">TV5</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-0.5">
            <span>Živé APY odmeny:</span>
            <span className="text-emerald-400 font-bold">+{accruedRewards.toFixed(4)} TV5</span>
          </div>
        </div>

      </div>

      {/* Contract Interaction Tabs: CoreToken vs CoreStaking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CONTRACT 1: CoreToken.sol */}
        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-100">
                CoreToken.sol (EIP-20 / Burnable)
              </h3>
            </div>
            <span className="text-xs font-mono text-cyan-400">Ownable</span>
          </div>

          {/* Action 1: mint() */}
          <form onSubmit={handleMintSubmit} className="space-y-2 p-3.5 rounded-lg bg-slate-950 border border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-slate-200 flex items-center gap-1.5">
                <PlusCircle className="h-3.5 w-3.5 text-cyan-400" />
                mint(address to, uint256 amount)
              </span>
              <span className="text-[10px] font-mono text-slate-500">onlyOwner</span>
            </div>
            <div className="flex gap-2">
              <input
                id="input-mint-amount"
                type="number"
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
                placeholder="Množstvo na razbu"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                id="btn-submit-mint"
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold text-xs whitespace-nowrap cursor-pointer transition"
              >
                Vyraziť TV5
              </button>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              Overuje: totalSupply() + amount &le; MAX_SUPPLY (1 000 000 000)
            </p>
          </form>

          {/* Action 2: burn() */}
          <form onSubmit={handleBurnSubmit} className="space-y-2 p-3.5 rounded-lg bg-slate-950 border border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-slate-200 flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-amber-400" />
                burn(uint256 amount)
              </span>
              <span className="text-[10px] font-mono text-slate-500">ERC20Burnable</span>
            </div>
            <div className="flex gap-2">
              <input
                id="input-burn-amount"
                type="number"
                value={burnAmount}
                onChange={(e) => setBurnAmount(e.target.value)}
                placeholder="Množstvo na spálenie"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                id="btn-submit-burn"
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs whitespace-nowrap cursor-pointer transition"
              >
                Spáliť (Burn)
              </button>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              Trvalo znižuje celkovú ponuku a zostatok odosielateľa
            </p>
          </form>

          {/* Action 3: transfer() */}
          <form onSubmit={handleTransferSubmit} className="space-y-2 p-3.5 rounded-lg bg-slate-950 border border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-slate-200 flex items-center gap-1.5">
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
                transfer(address to, uint256 amount)
              </span>
              <span className="text-[10px] font-mono text-slate-500">EIP-20 Standard</span>
            </div>
            <div className="space-y-2">
              <input
                id="input-transfer-recipient"
                type="text"
                value={transferRecipient}
                onChange={(e) => setTransferRecipient(e.target.value)}
                placeholder="Príjemca (0x...)"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <div className="flex gap-2">
                <input
                  id="input-transfer-amount"
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="Množstvo TV5"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  id="btn-submit-transfer"
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs whitespace-nowrap cursor-pointer transition"
                >
                  Odoslať
                </button>
              </div>
            </div>
          </form>

        </div>

        {/* CONTRACT 2: Staking.sol */}
        <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-100">
                CoreStaking.sol (PoS Staking)
              </h3>
            </div>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> ReentrancyGuard
            </span>
          </div>

          {/* Action 1: stake() */}
          <form onSubmit={handleStakeSubmit} className="space-y-2 p-3.5 rounded-lg bg-slate-950 border border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-slate-200 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-emerald-400" />
                stake(uint256 _amount)
              </span>
              <span className="text-[10px] font-mono text-emerald-400">nonReentrant</span>
            </div>
            <div className="flex gap-2">
              <input
                id="input-stake-amount"
                type="number"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                placeholder="Množstvo do stakingu"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                id="btn-submit-stake"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs whitespace-nowrap cursor-pointer transition"
              >
                Vložiť Stake
              </button>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              Volá <code className="text-slate-400">token.transferFrom()</code> a aktualizuje <code className="text-slate-400">lastUpdate</code>
            </p>
          </form>

          {/* Action 2: withdraw() */}
          <form onSubmit={handleWithdrawSubmit} className="space-y-2 p-3.5 rounded-lg bg-slate-950 border border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold text-slate-200 flex items-center gap-1.5">
                <Unlock className="h-3.5 w-3.5 text-cyan-400" />
                withdraw(uint256 _amount)
              </span>
              <span className="text-[10px] font-mono text-emerald-400">nonReentrant</span>
            </div>
            <div className="flex gap-2">
              <input
                id="input-withdraw-amount"
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Množstvo na výber"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                id="btn-submit-withdraw"
                className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold text-xs whitespace-nowrap cursor-pointer transition"
              >
                Vybrať Stake
              </button>
            </div>
            <p className="text-[10px] text-slate-500 font-mono">
              Overuje: <code className="text-slate-400">stakedBalance[msg.sender] &ge; _amount</code>
            </p>
          </form>

          {/* Staking Specs Info Box */}
          <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/60 text-xs text-slate-400 space-y-2 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-500">rewardRate parameter:</span>
              <span className="text-slate-200 font-bold">100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Ochrana pred znovuvstúpením:</span>
              <span className="text-emerald-400 font-bold">OpenZeppelin ReentrancyGuard</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Token rozhranie:</span>
              <span className="text-cyan-300 font-bold">IERC20 (TV5 Coin)</span>
            </div>
          </div>

        </div>

      </div>

      {/* Transaction History Ledger */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">
              EVM Záznam Transakcií (On-Chain Ledger)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {transactions.length} Záznamov
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-2.5 px-3">Typ</th>
                <th className="py-2.5 px-3">Tx Hash</th>
                <th className="py-2.5 px-3">Blok #</th>
                <th className="py-2.5 px-3">Odosielateľ / Cieľ</th>
                <th className="py-2.5 px-3">Suma</th>
                <th className="py-2.5 px-3 text-right">Stav</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.type === 'MINT'
                          ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/60'
                          : tx.type === 'BURN'
                          ? 'bg-red-950 text-red-400 border border-red-800/60'
                          : tx.type === 'STAKE'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                          : tx.type === 'WITHDRAW'
                          ? 'bg-blue-950 text-blue-400 border border-blue-800/60'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 font-mono">
                    {tx.hash.slice(0, 10)}...{tx.hash.slice(-6)}
                  </td>
                  <td className="py-2.5 px-3 text-cyan-400">
                    #{tx.blockNumber}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px] truncate max-w-[200px]">
                    {tx.from.slice(0, 8)}... &rarr; {tx.to.slice(0, 8)}...
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-200">
                    {tx.amount.toLocaleString()} TV5
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="text-emerald-400 text-[10px] inline-flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Potvrdené
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
