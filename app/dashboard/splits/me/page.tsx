'use client';

import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api-client';
import { Split } from '@/types/auth';
import Link from 'next/link';
import { useAlert } from '@/hooks/useAlert';
import { Plus } from 'lucide-react';

export default function MySplitsPage() {
  const [splits, setSplits] = useState<Split[]>([]);
  const [loading, setLoading] = useState(true);
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchMySplits = async () => {
      try {
        const data = await apiFetch<Split[]>('/splits/me');
        setSplits(data);
      } catch (error: any) {
        showAlert('error', error.message || 'Failed to fetch your splits');
      } finally {
        setLoading(false);
      }
    };

    fetchMySplits();
  }, [showAlert]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-[#F4F8FF] border-t-[#22C55E] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-[#0D1B2A] rounded-full animate-pulse" />
          </div>
        </div>
        <p className="mt-6 text-[#0D1B2A] font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Fetching Your Tribe</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-[#0D1B2A] leading-tight">My Splits</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage your active groups and collection progress.</p>
        </div>
        <Link 
          href="/dashboard/splits/create"
          className="bg-[#0D1B2A] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#1a2f44] transition-all shadow-xl shadow-slate-200 flex items-center gap-3"
        >
          <Plus className="w-5 h-5 text-[#22C55E]" />
          Create New
        </Link>
      </div>

      {splits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {splits.map((split) => {
            const collected = split.wallet?.balance || 0;
            const goal = split.totalAmount;
            const percentage = goal && goal > 0 ? Math.min(Math.round((collected / goal) * 100), 100) : null;
            
            return (
              <Link 
                key={split.id} 
                href={`/dashboard/splits/${split.shareCode}`}
                className="bg-white border border-[#E5E7EB] rounded-[2rem] p-6 sm:p-8 hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1 pr-2">
                    <h3 className="font-black text-xl text-[#0D1B2A] group-hover:text-[#22C55E] transition-colors leading-tight mb-1">{split.title}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{split.splitType.replace('_', ' ')}</p>
                  </div>
                  <span className={`text-[9px] uppercase font-black tracking-[0.2em] px-3 py-1 rounded-full whitespace-nowrap ${
                    split.status === 'ACTIVE' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 
                    split.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 
                    'bg-slate-50 text-slate-500'
                  }`}>
                    {split.status}
                  </span>
                </div>
                
                <div className="space-y-5 mt-auto">
                  {percentage !== null ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-[#0D1B2A]">{percentage}%</span>
                      </div>
                      <div className="w-full bg-[#F4F8FF] h-2.5 rounded-full overflow-hidden border border-[#E5E7EB]/50">
                        <div 
                          className="bg-[#22C55E] h-full rounded-full transition-all duration-1000" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="py-2 px-4 bg-[#F4F8FF] rounded-xl border border-dashed border-[#E5E7EB]">
                       <p className="text-[10px] font-black text-[#22C55E] uppercase tracking-widest text-center">Open Contribution</p>
                    </div>
                  )}

                  <div className="flex justify-between items-end pt-4 border-t border-[#F4F8FF]">
                    <div>
                      <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">
                        {split.splitType === 'SLOT_BASED' ? 'Slots Filled' : 'Members'}
                      </p>
                      <p className="font-black text-lg text-[#0D1B2A]">
                        {split._count?.participants || 0}
                        {split.numberOfSlots ? <span className="text-slate-300 text-xs ml-1">/ {split.numberOfSlots}</span> : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">
                        {split.totalAmount ? 'Target' : 'Min. Entry'}
                      </p>
                      <p className="font-black text-base text-slate-400">
                        ₦{(split.totalAmount || split.minimumAmount || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Subtle Hover Effect Decoration */}
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#22C55E]/5 rounded-full blur-2xl group-hover:bg-[#22C55E]/10 transition-colors" />
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border-2 border-dashed border-[#E5E7EB] rounded-[3rem] p-12 sm:p-20 text-center">
          <div className="w-20 h-20 bg-[#F4F8FF] rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
            <svg className="w-10 h-10 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-2xl font-black text-[#0D1B2A] mb-3">No active splits</h3>
          <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium">Create your first split group to start collecting payments for trips, gifts, or bills with your tribe.</p>
          <Link 
            href="/dashboard/splits/create"
            className="inline-block bg-[#22C55E] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#16A34A] transition-all shadow-xl shadow-green-100 hover:scale-[1.02] active:scale-95"
          >
            Start a Split
          </Link>
        </div>
      )}
    </div>
  );
}
