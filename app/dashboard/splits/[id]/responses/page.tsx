'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  ClipboardList, 
  Search, 
  Download, 
  Filter,
  User,
  Calendar,
  ChevronRight,
  MessageSquare,
  Clock
} from 'lucide-react';
import { apiFetch } from '@/lib/api-client';
import { useAlert } from '@/hooks/useAlert';
import { FormResult, FormField } from '@/types/split';

interface ResponsesPageProps {
  params: Promise<{ id: string }>
}

export default function SplitResponsesPage({ params }: ResponsesPageProps) {
  const { id: shareCode } = use(params);
  const router = useRouter();
  const { showAlert } = useAlert();
  
  const [loading, setLoading] = useState(true);
  const [split, setSplit] = useState<any>(null);
  const [responses, setResponses] = useState<FormResult[]>([]);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchResponses();
  }, [shareCode]);

  const fetchResponses = async () => {
    try {
      setLoading(true);
      const splitData = await apiFetch<any>(`/splits/link/${shareCode}`);
      setSplit(splitData);
      setFormFields(splitData.formFields || []);

      // Support both structured responses and legacy participant-embedded responses
      if (splitData.participants) {
        const extracted = splitData.participants
          .filter((p: any) => p.formResponse)
          .map((p: any) => ({
            ...p.formResponse,
            participantName: p.name,
            participantEmail: p.contact
          }));
        setResponses(extracted);
      } else if (splitData.formResponses) {
        setResponses(splitData.formResponses);
      }
    } catch (error: any) {
      showAlert('error', error.message || 'Failed to fetch form responses');
    } finally {
      setLoading(false);
    }
  };

  const filteredResponses = responses.filter(resp => 
    (resp as any).participantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (resp as any).participantEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadCSV = () => {
    if (responses.length === 0) return;
    
    // Headers
    const headers = ['Name', 'Email', 'Date', ...formFields.map(f => f.label)];
    
    // Rows
    const rows = responses.map(resp => [
        (resp as any).participantName,
        (resp as any).participantEmail,
        new Date(resp.submittedAt || resp.createdAt || '').toLocaleDateString(),
        ...formFields.map(f => resp.data[f.label] || resp.data[f.id] || '')
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${split?.title || 'split'}_responses.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-[#F4F8FF] border-t-[#22C55E] rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[10px]">Processing data tables...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <button 
            onClick={() => router.push(`/dashboard/splits/${shareCode}`)}
            className="flex items-center gap-2 text-slate-400 hover:text-[#0D1B2A] font-bold text-xs mb-4 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Overview
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#F4F8FF] rounded-[1.25rem] flex items-center justify-center">
              <ClipboardList className="w-7 h-7 text-[#22C55E]" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-[#0D1B2A] tracking-tight">Form Responses</h1>
              <p className="text-slate-500 font-medium">All data collected for <span className="text-[#22C55E] font-bold">{split?.title}</span></p>
            </div>
          </div>
        </div>

        <button 
          onClick={downloadCSV}
          className="bg-white border-2 border-[#E5E7EB] text-[#0D1B2A] px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:border-[#22C55E] hover:text-[#22C55E] transition-all"
        >
          <Download className="w-4 h-4" /> Export to CSV
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input 
              type="text" 
              placeholder="Search by name or email..."
              className="w-full pl-11 pr-5 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#22C55E] transition-all font-medium text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="px-5 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 hover:border-[#22C55E] hover:text-[#22C55E] transition-all">
              <Filter className="w-3 h-3" /> Filter
            </button>
          </div>
        </div>

        {/* Responses Table */}
        <div className="overflow-x-auto">
          {filteredResponses.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Participant</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Submission Info</th>
                  {formFields.map(field => (
                    <th key={field.id} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 whitespace-nowrap">
                      {field.label}
                    </th>
                  ))}
                  <th className="px-8 py-5 border-b border-slate-50"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredResponses.map((resp, i) => (
                  <tr key={resp.id} className="hover:bg-slate-50/40 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#F4F8FF] rounded-xl flex items-center justify-center text-[#22C55E] font-black text-xs">
                          {(resp as any).participantName?.charAt(0) || 'P'}
                        </div>
                        <div>
                          <p className="font-bold text-[#0D1B2A]">{(resp as any).participantName}</p>
                          <p className="text-[10px] text-slate-400">{(resp as any).participantEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                          <Calendar className="w-3 h-3" />
                          {new Date(resp.createdAt || resp.submittedAt || '').toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                          <Clock className="w-3 h-3" />
                          {new Date(resp.createdAt || resp.submittedAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </td>
                    {formFields.map(field => (
                      <td key={field.id} className="px-8 py-6">
                        <span className="text-sm font-medium text-slate-600">
                          {resp.data[field.label] || resp.data[field.id] || '-'}
                        </span>
                      </td>
                    ))}
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 text-slate-300 hover:text-[#0D1B2A] transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-32 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-xl font-black text-[#0D1B2A] mb-2">No Responses Found</h3>
              <p className="text-slate-400 font-medium max-w-xs mx-auto">
                {searchTerm ? `Nothing matches "${searchTerm}"` : 'Share your split link to start collecting data from participants.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
