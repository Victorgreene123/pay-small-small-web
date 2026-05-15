'use client';

import { Transaction } from '@/types/split';
import { ArrowDownLeft, ArrowUpRight, DollarSign, Calendar } from 'lucide-react';

interface WalletOverviewProps {
  balance: number;
  transactions: Transaction[];
  onWithdraw: () => void;
}

export const WalletOverview = ({ balance, transactions, onWithdraw }: WalletOverviewProps) => {
  return (
    <div className="space-y-8">
      {/* Balance Card */}
      <div className="bg-[#0D1B2A] rounded-[2.5rem] p-8 sm:p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] mb-2">Available Balance</p>
            <h2 className="text-5xl font-black text-white">₦{balance.toLocaleString()}</h2>
          </div>
          <button
            onClick={onWithdraw}
            disabled={balance <= 0}
            className="bg-[#22C55E] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#16A34A] transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-green-900/20 disabled:bg-slate-700 disabled:opacity-50 disabled:scale-100"
          >
            Withdraw Funds
          </button>
        </div>
        
        {/* Decorative Circle */}
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-[#22C55E]/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <DollarSign className="w-24 h-24" />
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-[#E5E7EB] overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-[#F4F8FF] flex justify-between items-center">
          <h3 className="font-black text-[#0D1B2A] text-lg uppercase tracking-tight">Transaction History</h3>
        </div>
        
        <div className="divide-y divide-[#F4F8FF]">
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <div key={tx.id} className="p-6 sm:p-8 flex items-center justify-between hover:bg-[#F4F8FF]/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-sm ${
                    tx.type === 'CREDIT' 
                      ? 'bg-green-50 border-green-100 text-[#22C55E]' 
                      : 'bg-red-50 border-red-100 text-red-500'
                  }`}>
                    {tx.type === 'CREDIT' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="font-bold text-[#0D1B2A] text-base">{tx.description || (tx.type === 'CREDIT' ? 'Payment Received' : 'Withdrawal')}</p>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar className="w-3 h-3" />
                      <p className="text-[10px] font-medium uppercase tracking-wider">
                        {new Date(tx.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-black text-lg ${tx.type === 'CREDIT' ? 'text-[#22C55E]' : 'text-[#0D1B2A]'}`}>
                    {tx.type === 'CREDIT' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                  </p>
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">{tx.status || 'COMPLETED'}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-[#F4F8FF] rounded-3xl flex items-center justify-center mx-auto mb-4 opacity-50">
                <DollarSign className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-400 font-medium">No transactions yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
