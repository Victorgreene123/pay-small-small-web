'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Landmark,
  ShieldCheck,
  RefreshCw,
  Building2
} from 'lucide-react';
import { apiFetch } from '@/lib/api-client';
import { useAlert } from '@/hooks/useAlert';
import { Transaction, Wallet as WalletType } from '@/types/split';
import { BankAccount } from '@/types/bank';

interface WalletPageProps {
  params: Promise<{ id: string }>
}

export default function SplitWalletPage({ params }: WalletPageProps) {
  const { id: shareCode } = use(params);
  const router = useRouter();
  const { showAlert } = useAlert();
  
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);
  const [split, setSplit] = useState<any>(null);
  const [wallet, setWallet] = useState<WalletType | null>(null);
  const [banks, setBanks] = useState<BankAccount[]>([]);
  const [selectedBankId, setSelectedBankId] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [withdrawDescription, setWithdrawDescription] = useState<string>('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  useEffect(() => {
    fetchWalletData();
    fetchBanks();
  }, [shareCode]);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      // 1. Get split info first to get the actual split.id from the shareCode
      const splitData = await apiFetch<any>(`/splits/link/${shareCode}`);
      setSplit(splitData);
      
      // 2. Get wallet info
      const walletData = await apiFetch<WalletType>(`/wallets/${splitData.id}`);
      setWallet(walletData);
    } catch (error: any) {
      showAlert('error', error.message || 'Failed to fetch wallet details');
    } finally {
      setLoading(false);
    }
  };

  const fetchBanks = async () => {
    try {
      const data = await apiFetch<BankAccount[]>('/banks');
      setBanks(data || []);
      if (data && data.length > 0) {
        const defaultBank = data.find(b => b.isDefault) || data[0];
        setSelectedBankId(defaultBank.id);
      }
    } catch (error: any) {
      console.error('Failed to load banks', error);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet || !withdrawAmount || !selectedBankId) return;
    
    const amount = parseFloat(withdrawAmount);
    if (amount <= 0 || amount > wallet.balance) {
      showAlert('error', 'Invalid withdrawal amount');
      return;
    }

    try {
      setWithdrawing(true);
      await apiFetch(`/wallets/${split.id}/spend`, {
        method: 'POST',
        body: JSON.stringify({
          amount,
          bankId: selectedBankId,
          description: withdrawDescription || `Withdrawal from ${split.title}`
        })
      });
      
      showAlert('success', 'Withdrawal request submitted successfully');
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      setWithdrawDescription('');
      fetchWalletData(); // Refresh wallet tools
    } catch (error: any) {
      showAlert('error', error.message || 'Withdrawal failed');
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-16 h-16 border-4 border-[#F4F8FF] border-t-[#22C55E] rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Wallet Access...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
        <div>
          <button 
            onClick={() => router.push(`/dashboard/splits/${shareCode}`)}
            className="flex items-center gap-2 text-slate-400 hover:text-[#0D1B2A] font-bold text-sm mb-4 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Split Details
          </button>
          <h1 className="text-4xl font-black text-[#0D1B2A] tracking-tight">Split Wallet</h1>
          <p className="text-slate-500 font-medium">Manage funds for <span className="text-[#22C55E] font-bold">{split?.title}</span></p>
        </div>

        <button 
          onClick={() => setShowWithdrawModal(true)}
          disabled={!wallet || wallet.balance <= 0}
          className="bg-[#0D1B2A] text-[#22C55E] px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:shadow-2xl hover:shadow-[#0D1B2A]/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowUpRight className="w-5 h-5" /> Withdraw Funds
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Balance Card */}
        <div className="lg:col-span-1 bg-[#0D1B2A] rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-[#0D1B2A]/20">
          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8">
              <Wallet className="w-8 h-8 text-[#22C55E]" />
            </div>
            <p className="text-white/60 font-black uppercase tracking-[0.2em] text-[10px] mb-2">Available Balance</p>
            <h2 className="text-5xl font-black mb-10 tracking-tighter">
              <span className="text-[#22C55E] text-2xl align-top mr-1">₦</span>
              {wallet?.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
            
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
              <ShieldCheck className="w-5 h-5 text-[#22C55E]" />
              <p className="text-[10px] font-bold text-white/70 leading-relaxed">
                Funds are secured and can only be withdrawn to your verified bank accounts.
              </p>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#22C55E]/20 rounded-full blur-[60px]" />
          <div className="absolute top-10 right-10 w-20 h-20 bg-blue-500/10 rounded-full blur-[40px]" />
        </div>

        {/* Stats & Info */}

      </div>

      {/* Transactions List */}
      <div>
        <div className="flex items-center justify-between mb-8 px-2">
          <h3 className="text-2xl font-black text-[#0D1B2A]">Recent Transactions</h3>
          <button 
            onClick={fetchWalletData}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-[#0D1B2A] transition-all"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {wallet?.transactions && wallet.transactions.length > 0 ? (
          <div className="space-y-4">
            {wallet.transactions.map((tx) => (
              <div 
                key={tx.id} 
                className="bg-white rounded-3xl border border-slate-100 p-6 flex items-center justify-between group hover:border-[#22C55E]/30 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                    tx.type === 'CREDIT' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-red-50 text-red-500'
                  }`}>
                    {tx.type === 'CREDIT' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-black text-[#0D1B2A] group-hover:text-[#22C55E] transition-colors">{tx.description}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-black text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                        <Clock className="w-3 h-3" />
                        {new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                        tx.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 
                        tx.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-black ${tx.type === 'CREDIT' ? 'text-[#22C55E]' : 'text-[#0D1B2A]'}`}>
                    {tx.type === 'CREDIT' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-100 py-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <RefreshCw className="w-10 h-10 text-slate-200" />
            </div>
            <h4 className="text-xl font-black text-[#0D1B2A] mb-2">No Transactions Yet</h4>
            <p className="text-slate-400 font-medium max-w-xs mx-auto">When people pay into this split, contributions will appear here.</p>
          </div>
        )}
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-[#0D1B2A]/60 backdrop-blur-sm" onClick={() => !withdrawing && setShowWithdrawModal(false)} />
          <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 sm:p-10">
              <h3 className="text-3xl font-black text-[#0D1B2A] mb-2">Withdraw Funds</h3>
              <p className="text-slate-500 font-medium mb-8">Ready to payout? Choose where you want the money sent.</p>

              <form onSubmit={handleWithdraw} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Choose Bank Account</label>
                  {banks.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {banks.map((bank) => (
                        <button
                          key={bank.id}
                          type="button"
                          onClick={() => setSelectedBankId(bank.id)}
                          className={`flex items-center justify-between p-5 rounded-3xl border-2 transition-all text-left ${
                            selectedBankId === bank.id 
                              ? 'border-[#22C55E] bg-[#22C55E]/5' 
                              : 'border-slate-100 hover:border-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${selectedBankId === bank.id ? 'bg-[#22C55E] text-white' : 'bg-slate-100 text-slate-400'}`}>
                              <Building2 className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="font-black text-[#0D1B2A] text-sm">{bank.bankName}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">**** {bank.accountNumber.slice(-4)}</p>
                            </div>
                          </div>
                          {selectedBankId === bank.id && <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 bg-red-50 rounded-3xl border border-red-100 flex flex-col items-center text-center">
                      <AlertCircle className="w-8 h-8 text-red-500 mb-3" />
                      <p className="text-red-700 font-black text-xs uppercase tracking-widest mb-3">No Banks Found</p>
                      <button 
                        type="button"
                        onClick={() => router.push('/dashboard/payments/banks')}
                        className="text-red-500 font-bold text-xs underline underline-offset-4"
                      >
                        Add a bank account first
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Withdrawal Amount</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-[#22C55E] text-xl">₦</span>
                    <input 
                      required
                      type="number"
                      placeholder="0.00"
                      max={wallet?.balance}
                      className="w-full pl-12 pr-6 py-5 bg-[#F4F8FF] border-2 border-transparent focus:border-[#22C55E] focus:bg-white rounded-2xl outline-none transition-all font-black text-[#0D1B2A] text-xl"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-between mt-2 px-1">
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${
                      parseFloat(withdrawAmount) > (wallet?.balance || 0) ? 'text-red-500' : 'text-slate-400'
                    }`}>
                      {parseFloat(withdrawAmount) > (wallet?.balance || 0) 
                        ? 'Insufficient balance' 
                        : `Max: ₦${wallet?.balance.toLocaleString()}`}
                    </p>
                    <button 
                      type="button"
                      onClick={() => setWithdrawAmount(wallet?.balance.toString() || '0')}
                      className="text-[10px] text-[#22C55E] font-black uppercase tracking-widest hover:underline"
                    >
                      Max Out
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Description (Optional)</label>
                  <input 
                    type="text"
                    placeholder="What is this withdrawal for?"
                    className="w-full px-6 py-4 bg-[#F4F8FF] border-2 border-transparent focus:border-[#22C55E] focus:bg-white rounded-2xl outline-none transition-all font-bold text-[#0D1B2A] text-sm"
                    value={withdrawDescription}
                    onChange={(e) => setWithdrawDescription(e.target.value)}
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setShowWithdrawModal(false)}
                    disabled={withdrawing}
                    className="flex-1 px-4 py-5 rounded-3xl font-black uppercase tracking-widest text-[10px] text-[#0D1B2A] hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={withdrawing || !selectedBankId || !withdrawAmount}
                    className="flex-[2] bg-[#0D1B2A] text-[#22C55E] py-5 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:shadow-2xl hover:shadow-[#0D1B2A]/30 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {withdrawing ? 'Processing...' : 'Confirm Withdrawal'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
