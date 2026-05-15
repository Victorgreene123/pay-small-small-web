'use client';

import { SplitParticipant } from '@/types/split';

interface ParticipantListProps {
  participants: SplitParticipant[];
  isCreator?: boolean;
}

export const ParticipantList = ({ participants, isCreator }: ParticipantListProps) => {
  return (
    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-[#E5E7EB] overflow-hidden">
      <div className="p-6 sm:p-8 border-b border-[#F4F8FF] bg-white flex justify-between items-center">
        <h3 className="font-black text-[#0D1B2A] text-lg uppercase tracking-tight">Tribe Members</h3>
        <span className="bg-[#22C55E]/10 text-[#22C55E] text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest">
          {participants.length} Total
        </span>
      </div>
      <div className="divide-y divide-[#F4F8FF]">
        {participants.map((participant, index) => (
          <div key={participant.id || `participant-${index}`} className="p-6 sm:p-8 flex items-center justify-between hover:bg-[#F4F8FF]/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F4F8FF] flex items-center justify-center text-[#22C55E] font-black text-lg border border-[#22C55E]/10 shadow-sm">
                {participant.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-[#0D1B2A] text-base">{participant.name}</p>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter bg-slate-100 px-1.5 py-0.5 rounded-md">
                    {participant.role}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">{participant.contact}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              {participant.amountPaid > 0 ? (
                <div className="flex flex-col items-end gap-1">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#22C55E]/10 text-[#22C55E] mb-1">
                    ✓ {participant.amountToPay && participant.amountPaid >= participant.amountToPay ? 'Settled' : 'Contributed'}
                  </span>
                  <p className="text-xs font-black text-[#0D1B2A]">₦{participant.amountPaid.toLocaleString()}</p>
                </div>
              ) : (
                <div className="flex flex-col items-end gap-1">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-400 border border-slate-100 italic">
                    Pending
                  </span>
                  {participant.amountToPay && (
                    <p className="text-[10px] font-bold text-slate-400">Target: ₦{participant.amountToPay.toLocaleString()}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {participants.length === 0 && (
          <div className="p-16 text-center">
            <div className="w-16 h-16 bg-[#F4F8FF] rounded-3xl flex items-center justify-center mx-auto mb-4 opacity-50">
              <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="text-slate-400 font-medium">No members in this tribe yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};
