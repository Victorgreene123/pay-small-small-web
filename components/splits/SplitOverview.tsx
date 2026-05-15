'use client';

import { Split } from '@/types/auth';

interface SplitOverviewProps {
  split: Split;
  isCreator?: boolean;
}

export const SplitOverview = ({ split, isCreator }: SplitOverviewProps) => {
  const collected = split.wallet?.balance || 0;
  const goal = split.totalAmount || 0;
  const percentage = goal > 0 ? Math.min(Math.round((collected / goal) * 100), 100) : 0;

  return (
    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-[#E5E7EB] p-8 sm:p-10 relative overflow-hidden">
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0D1B2A] leading-tight mb-2">{split.title}</h1>
          <p className="text-slate-500 font-medium max-w-xl">{split.description || "Secure payment collection portal"}</p>
        </div>
        {isCreator && (
          <span className="px-4 py-1.5 bg-[#22C55E]/10 text-[#22C55E] text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
            Tribe Creator
          </span>
        )}
      </div>

      <div className="space-y-6 relative z-10">
        <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] text-[#0D1B2A]/40 mb-2">
          <span>Collection Progress</span>
          <span className="text-[#0D1B2A]">
            ₦{collected.toLocaleString()} <span className="text-slate-300">/</span> ₦{goal.toLocaleString()}
          </span>
        </div>
        
        <div className="w-full bg-[#F4F8FF] rounded-full h-4 overflow-hidden border border-[#E5E7EB]/50">
          <div 
            className="bg-[#22C55E] h-full transition-all duration-1000 ease-out flex items-center justify-end px-2"
            style={{ width: `${percentage}%` }}
          >
            {percentage > 15 && <span className="text-[9px] font-black text-white">{percentage}%</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div className="p-6 bg-[#F4F8FF] rounded-2xl border border-[#22C55E]/5">
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-2">Total Contribution Goal</p>
            <p className="text-2xl font-black text-[#0D1B2A]">₦{goal.toLocaleString()}</p>
          </div>
          <div className="p-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
            <p className="text-[10px] text-[#22C55E] uppercase font-black tracking-widest mb-2">Total Amount Collected</p>
            <p className="text-2xl font-black text-[#0D1B2A]">₦{collected.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Decorative Accents */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#22C55E]/5 rounded-full -mr-16 -mt-16 blur-2xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#DBEAFE]/30 rounded-full -ml-16 -mb-16 blur-2xl" />
    </div>
  );
};
