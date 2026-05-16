'use client';

import { Split } from '@/types/auth';
import { ShieldCheck, ShieldAlert, Info } from 'lucide-react';

interface SplitOverviewProps {
  split: Split;
  isCreator?: boolean;
}

export const SplitOverview = ({ split, isCreator }: SplitOverviewProps) => {
  const collected = split.wallet?.balance || 0;
  const goal = split.totalAmount || 0;
  const percentage = goal > 0 ? Math.min(Math.round((collected / goal) * 100), 100) : 0;
  
  const trustScore = split.trustScore ?? 0;
  const riskFlag = split.riskFlag ?? false;

  const getTrustLabel = () => {
    if (riskFlag) return { text: "Security Review Required", color: "text-red-500", bg: "bg-red-50", icon: <ShieldAlert className="w-4 h-4" />, note: "This split has been flagged for manual verification. Proceed with caution." };
    if (trustScore >= 80) return { text: "High Reliability Tribe", color: "text-emerald-600", bg: "bg-emerald-50", icon: <ShieldCheck className="w-4 h-4" />, note: "This tribe has a high reliability rating based on past successful splits." };
    if (trustScore >= 40) return { text: "Standard Reliability", color: "text-blue-600", bg: "bg-blue-50", icon: <ShieldCheck className="w-4 h-4" />, note: "This is a standard tribe with moderate history." };
    return { text: "New Tribe", color: "text-slate-500", bg: "bg-slate-50", icon: <Info className="w-4 h-4" />, note: "This is a new tribe or has limited transaction history. Standard caution advised." };
  };

  const trustStatus = getTrustLabel();

  return (
    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-[#E5E7EB] p-8 sm:p-10 relative overflow-hidden">
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <h1 className="text-3xl sm:text-4xl font-black text-[#0D1B2A] leading-tight">{split.title}</h1>
             <div className={`px-3 py-1 rounded-full flex items-center gap-1.5 ${trustStatus.bg} ${trustStatus.color} border border-current/10 shadow-sm`}>
                {trustStatus.icon}
                <span className="text-[10px] font-black uppercase tracking-wider">{trustStatus.text}</span>
             </div>
          </div>
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="p-6 bg-[#F4F8FF] rounded-2xl border border-[#22C55E]/5 shadow-sm">
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-2">Contribution Goal</p>
            <p className="text-2xl font-black text-[#0D1B2A]">₦{goal.toLocaleString()}</p>
          </div>
          <div className="p-6 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
            <p className="text-[10px] text-[#22C55E] uppercase font-black tracking-widest mb-2">Total Collected</p>
            <p className="text-2xl font-black text-[#0D1B2A]">₦{collected.toLocaleString()}</p>
          </div>
          <div className={`p-6 ${trustStatus.bg} border border-[#E5E7EB]/50 rounded-2xl shadow-sm relative overflow-hidden group`}>
             <p className={`text-[10px] ${trustStatus.color} uppercase font-black tracking-widest mb-2`}>Reliability Score</p>
             <div className="flex items-baseline gap-1">
                <p className={`text-2xl font-black ${trustStatus.color}`}>{trustScore}%</p>
                <span className="text-[10px] font-medium text-slate-400">TrustLedger™</span>
             </div>
             
             {/* Note popup on hover or just small text below */}
             <div className="mt-3 pt-3 border-t border-current/5">
                <p className="text-[9px] text-slate-500 font-medium leading-relaxed italic">
                  "{trustStatus.note}"
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* Decorative Accents */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#22C55E]/5 rounded-full -mr-16 -mt-16 blur-2xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#DBEAFE]/30 rounded-full -ml-16 -mb-16 blur-2xl" />
    </div>
  );
};
