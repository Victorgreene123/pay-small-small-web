'use client';

import { FormResult } from '@/types/split';
import { Mail, Calendar, User, FileText } from 'lucide-react';

interface FormResponsesListProps {
  responses: FormResult[];
  participants: any[];
  fields: any[];
}

export const FormResponsesList = ({ responses, participants, fields }: FormResponsesListProps) => {
  return (
    <div className="bg-white rounded-[2rem] border border-[#E5E7EB] overflow-hidden shadow-sm shadow-slate-200/50">
      {responses.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F4F8FF] border-b border-[#E5E7EB]">
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Participant</th>
                {fields.map(field => (
                  <th key={field.id} className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    {field.label}
                  </th>
                ))}
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {responses.map((response: any) => {
                const participant = participants.find(p => p.id === response.participantId);
                const displayName = response.participantName || participant?.name || 'Unknown';
                const displayContact = response.participantContact || participant?.contact || '';
                
                return (
                  <tr key={response.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center text-[#22C55E] text-xs font-black group-hover:border-[#22C55E]/30 transition-colors">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-[#0D1B2A] text-sm">{displayName}</span>
                          {displayContact && (
                            <span className="text-[10px] text-slate-400 font-medium">{displayContact}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    {fields.map(field => (
                      <td key={field.id} className="px-6 py-5">
                        <span className="text-sm text-slate-600 font-medium">
                          {String(response.data[field.id] || '-')}
                        </span>
                      </td>
                    ))}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Calendar className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">
                          {new Date(response.createdAt || response.submittedAt).toLocaleDateString('en-NG', { 
                            day: 'numeric', 
                            month: 'short' 
                          })}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-16 text-center bg-white">
          <div className="w-20 h-20 bg-[#F4F8FF] rounded-3xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-black text-[#0D1B2A] mb-2">No Responses Yet</h3>
          <p className="text-slate-500 font-medium max-w-xs mx-auto text-sm">When participants join and fill your custom form, their details will appear here.</p>
        </div>
      )}
    </div>
  );
};
