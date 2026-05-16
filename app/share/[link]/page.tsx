'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api-client';
import { FormField } from '@/types/split';
import { Split } from '@/types/auth';
import { SplitOverview } from '@/components/splits/SplitOverview';
import { ParticipantList } from '@/components/splits/ParticipantList';
import { DynamicForm } from '@/components/splits/DynamicForm';
import { useAlert } from '@/hooks/useAlert';
import { ShieldCheck, ShieldAlert, Lock } from 'lucide-react';

export default function PublicSharePage() {
  const { link } = useParams();
  const [split, setSplit] = useState<Split | null>(null);
  const [fields, setFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(true);
  const [userMetadata, setUserMetadata] = useState({ name: '', contact: '', role: 'CONTRIBUTOR' as 'OBLIGATED' | 'CONTRIBUTOR' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showAlert } = useAlert();

  useEffect(() => {
    const fetchSplitAndFields = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://pay-small-small.onrender.com/api';
        
        // 1. Fetch Split
        const splitRes = await fetch(`${apiUrl}/splits/link/${link}`);
        const splitResult = await splitRes.json();
        
        if (splitResult.success) {
          setSplit(splitResult.data);
          
          // 2. Fetch Form Fields for this split
          const fieldRes = await fetch(`${apiUrl}/forms/${splitResult.data.id}/fields`);
          const fieldResult = await fieldRes.json();
          if (fieldResult.success) {
            setFields(fieldResult.data);
          }
        } else {
          throw new Error(splitResult.message);
        }
      } catch (error: any) {
        showAlert('error', error.message || 'Failed to fetch split details');
      } finally {
        setLoading(false);
      }
    };

    if (link) fetchSplitAndFields();
  }, [link, showAlert]);

  const handleJoinAndPay = async (formData: Record<string, any> = {}) => {
    if (!userMetadata.name || !userMetadata.contact) {
      showAlert('error', 'Please provide your name and contact');
      return;
    }

    setIsSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://pay-small-small.onrender.com/api';

      // 1. Join split and initialize payment as per documentation
      const joinRes = await fetch(`${apiUrl}/splits/${split?.id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userMetadata.name,
          contact: userMetadata.contact,
          role: split?.splitType === 'OPEN' ? userMetadata.role : 'CONTRIBUTOR',
          formResponse: JSON.stringify(formData),
        }),
      });

      const joinResult = await joinRes.json();

      if (joinResult.success && joinResult.data.paymentUrl) {
        showAlert('success', 'Redirecting to secure payment...');
        window.location.href = joinResult.data.paymentUrl;
      } else {
        throw new Error(joinResult.message || 'Failed to initialize payment');
      }
      
    } catch (error: any) {
      showAlert('error', error.message || 'Failed to process submission');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F4F8FF]">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-white border-t-[#22C55E] rounded-full animate-spin shadow-xl"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-[#0D1B2A] rounded-full animate-pulse" />
          </div>
        </div>
        <p className="mt-8 text-[#0D1B2A] font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Launching Portal</p>
      </div>
    );
  }

  if (!split) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F8FF] px-4">
      <div className="text-center p-12 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-[#E5E7EB] max-w-md w-full">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-3xl font-black text-[#0D1B2A] mb-3">Portal Inaccessible</h1>
        <p className="text-slate-500 font-medium">The link you followed may be invalid, expired, or the split was cancelled by the creator.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F8FF] py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center">
           <img
                    src="/logo.png"
                    alt="Pay Small Small"
                    className="w-[300px] h-auto object-contain mx-auto"
                />
          <p className="text-[#22C55E] font-black uppercase tracking-[0.3em] text-[10px]">Secure Contribution Portal</p>
        </div>

        <SplitOverview split={split} isCreator={false} />

        {/* Security & Trust Notice */}
        <div className={`p-6 rounded-[2rem] border shadow-sm flex items-start gap-4 transition-all ${
          split.riskFlag 
            ? 'bg-red-50 border-red-100 text-red-900' 
            : 'bg-emerald-50 border-emerald-100 text-emerald-900'
        }`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
            split.riskFlag ? 'bg-red-500 text-white' : 'bg-[#22C55E] text-white'
          }`}>
            {split.riskFlag ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
          </div>
          <div>
            <h4 className="font-black text-xs uppercase tracking-widest mb-1 flex items-center gap-2">
              {split.riskFlag ? 'Security Notice' : 'TrustLedger™ Verified'}
              {!split.riskFlag && split.trustScore && split.trustScore >= 80 && (
                <span className="bg-[#22C55E]/20 text-[#22C55E] px-2 py-0.5 rounded text-[8px] border border-[#22C55E]/10">High Reliability</span>
              )}
            </h4>
            <p className="text-sm font-medium opacity-80 leading-relaxed">
              {split.riskFlag 
                ? "This transaction has been flagged for manual verification. Please ensure you are familiar with the organizer before proceeding."
                : split.trustScore && split.trustScore >= 80
                  ? "This tribe has a high reliability rating. Your contribution is protected by our automated secure collection protocol."
                  : "Standard security protocols active. All payments are escrowed and handled according to the tribe's rules."
              }
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
             <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-[#E5E7EB]">
               <h3 className="text-xl font-black text-[#0D1B2A] mb-6 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-xl bg-[#F4F8FF] flex items-center justify-center text-[#22C55E]">
                   <span className="font-bold">1.</span>
                 </div>
                 Identify Yourself
               </h3>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                   <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full px-6 py-4 bg-[#F4F8FF] border-0 rounded-2xl focus:ring-2 focus:ring-[#22C55E] outline-none text-[#0D1B2A] font-bold"
                    value={userMetadata.name}
                    onChange={(e) => setUserMetadata({...userMetadata, name: e.target.value})}
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Info</label>
                   <input 
                    type="text" 
                    placeholder="Email Address only"
                    className="w-full px-6 py-4 bg-[#F4F8FF] border-0 rounded-2xl focus:ring-2 focus:ring-[#22C55E] outline-none text-[#0D1B2A] font-bold"
                    value={userMetadata.contact}
                    onChange={(e) => setUserMetadata({...userMetadata, contact: e.target.value})}
                   />
                 </div>
               </div>

               {split.splitType === 'OPEN' && (
                 <div className="mt-6 p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Choose Your Role</label>
                   <div className="flex gap-4">
                      {(['CONTRIBUTOR', 'OBLIGATED'] as const).map(role => (
                        <button
                          key={role}
                          onClick={() => setUserMetadata({...userMetadata, role})}
                          className={`flex-1 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                            userMetadata.role === role 
                            ? 'bg-[#0D1B2A] text-[#22C55E] shadow-lg' 
                            : 'bg-white text-slate-400 border border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {role}
                        </button>
                      ))}
                   </div>
                   <p className="mt-3 text-[10px] text-slate-400 font-medium leading-relaxed italic">
                     {userMetadata.role === 'OBLIGATED' 
                      ? "I am committing to a specific amount set by the organizer." 
                      : "I want to contribute a flexible amount towards the goal."}
                   </p>
                 </div>
               )}
             </div>
             <ParticipantList participants={split.participants} isCreator={false} />
          </div>

          <div className="space-y-6">
            <div className="bg-[#0D1B2A] p-8 rounded-[2.5rem] shadow-2xl shadow-slate-900/40 text-white relative overflow-hidden group">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#22C55E]">
                   <span className="font-bold">2.</span>
                 </div>
                 Join & Pay
              </h3>
              
              <div className="mb-8 relative z-10">
                <p className="text-slate-400 font-medium text-sm leading-relaxed mb-6">
                  You are contributing to <span className="text-[#22C55E] font-black">{split.title}</span>. 
                  {fields.length > 0 && " Please fill in the required details below to proceed."}
                </p>

                {fields.length > 0 && (
                  <div className="pt-6 border-t border-white/10 mt-6">
                    <DynamicForm 
                      fields={fields} 
                      onSubmit={handleJoinAndPay} 
                      isLoading={isSubmitting} 
                    />
                  </div>
                )}
              </div>
              
              <button 
                type="submit"
                form={fields.length > 0 ? "dynamic-split-form" : undefined}
                onClick={fields.length === 0 ? () => handleJoinAndPay() : undefined}
                disabled={isSubmitting || !userMetadata.name || !userMetadata.contact}
                className="w-full py-5 bg-[#22C55E] text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-[#16A34A] transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-green-900/20 disabled:bg-slate-700 disabled:shadow-none disabled:scale-100 disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Settle Payment Now'}
              </button>
              
              <div className="mt-8 pt-8 border-t border-white/10 flex flex-col items-center justify-center gap-3 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Secured with Paystack Interface</span>
                <div className="flex gap-4">
                   <div className="w-8 h-4 bg-white/20 rounded" />
                   <div className="w-8 h-4 bg-white/20 rounded" />
                </div>
              </div>

              {/* Decorative Circle */}
              <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-[#22C55E]/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
