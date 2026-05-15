"use client"

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  Settings, 
  Share2, 
  Copy, 
  CheckCircle2, 
  Clock, 
  ArrowLeft,
  ExternalLink,
  ChevronRight,
  Plus,
  ClipboardList,
  Wallet
} from 'lucide-react'
import { apiFetch } from '@/lib/api-client'
import { useAlert } from '@/hooks/useAlert'
import { SplitOverview } from '@/components/splits/SplitOverview'
import { ParticipantList } from '@/components/splits/ParticipantList'
import { WalletOverview } from '@/components/dashboard/WalletOverview'
import { FormResponsesList } from '@/components/splits/FormResponsesList'
import { FormField, FormResult } from '@/types/split'

interface SplitDetailProps {
  params: Promise<{ id: string }>
}

const SplitDetails = ({ params }: SplitDetailProps) => {
  const { id: shareCode } = use(params)
  const router = useRouter()
  const { showAlert } = useAlert()
  const [split, setSplit] = useState<any>(null)
  const [wallet, setWallet] = useState<any>(null)
  const [formFields, setFormFields] = useState<FormField[]>([])
  const [formResponses, setFormResponses] = useState<FormResult[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'participants' | 'wallet' | 'forms'>('participants')

  useEffect(() => {
    fetchData()
  }, [shareCode])

  const fetchData = async () => {
    setLoading(true)
    try {
      // 1. Fetch Split (includes form responses in newer API version)
      const splitData = await apiFetch<any>(`/splits/link/${shareCode}`)
      setSplit(splitData)
      
      // Extract form fields if available
      if (splitData.formFields) {
        setFormFields(splitData.formFields)
      }

      // Extract form responses from participants if available
      if (splitData.participants) {
        const responses = splitData.participants
          .filter((p: any) => p.formResponse)
          .map((p: any) => ({
            ...p.formResponse,
            participantName: p.name,
            participantContact: p.contact
          }))
        setFormResponses(responses)
      } else if (splitData.formResponses) {
        setFormResponses(splitData.formResponses)
      }

      // 2. Fetch Wallet
      try {
        const walletData = await apiFetch<any>(`/wallets/${splitData.id}`)
        setWallet(walletData)
      } catch (e) {
        console.error('Wallet fetch failed', e)
      }
    } catch (error: any) {
      showAlert('error', error.message || 'Failed to fetch split details')
    } finally {
      setLoading(false)
    }
  }

  const copyLink = () => {
    const shareUrl = `${window.location.origin}/share/${split.shareCode}`
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    showAlert('success', 'Share link copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="relative w-20 h-20">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-[#F4F8FF] border-t-[#22C55E] rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-[#0D1B2A] rounded-full animate-pulse" />
        </div>
      </div>
      <p className="mt-6 text-[#0D1B2A] font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Loading Tribe Data</p>
    </div>
  )

  if (!split) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-slate-800">Split not found</h2>
      <button 
        onClick={() => router.push('/dashboard/splits/me')}
        className="mt-4 text-blue-600 font-bold flex items-center gap-2 mx-auto"
      >
        <ArrowLeft className="w-5 h-5" /> Back to My Splits
      </button>
    </div>
  )

  const shareUrl = `${window.location.origin}/share/${split.shareCode}`

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs / Back */}
      <button 
        onClick={() => router.push('/dashboard/splits/me')}
        className="group flex items-center gap-x-2 text-slate-500 hover:text-blue-600 font-bold transition-colors mb-8"
      >
        <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-100 transition-all">
          <ArrowLeft className="w-4 h-4" />
        </div>
        Back to Dashboard
      </button>

      {/* Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[2.5rem] border border-[#E5E7EB] shadow-xl shadow-slate-200/50 p-8 sm:p-10 relative overflow-hidden">
            {/* Top Badge */}
            <div className="flex items-center gap-x-3 mb-6">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${
                split.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 
                split.status === 'ACTIVE' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 
                'bg-slate-100 text-slate-600'
              }`}>
                ● {split.status}
              </span>
              <span className="px-4 py-1.5 rounded-full bg-[#F4F8FF] text-[#22C55E] text-[10px] font-black uppercase tracking-[0.2em]">
                {split.splitType?.replace('_', ' ')} Split
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black text-[#0D1B2A] leading-[1.1] mb-4">
              {split.title}
            </h1>
            
            <p className="text-slate-500 text-lg max-w-2xl mb-8 font-medium">
              Manage your payment collection, track participants, and share the link with your tribe.
            </p>

            <div className="flex flex-wrap gap-4">
              <button 
                onClick={copyLink}
                className="flex items-center gap-x-3 bg-[#0D1B2A] text-white px-8 py-4 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-[#0D1B2A]/20"
              >
                {copied ? <CheckCircle2 className="w-5 h-5 text-[#22C55E]" /> : <Copy className="w-5 h-5" />}
                {copied ? 'Link Copied!' : 'Copy Share Link'}
              </button>
              
              <a 
                href={shareUrl} 
                target="_blank"
                className="flex items-center gap-x-3 bg-white border border-[#E5E7EB] text-[#0D1B2A] px-8 py-4 rounded-2xl font-bold transition-all hover:bg-[#F4F8FF] hover:border-[#22C55E]/30 shadow-sm"
              >
                <ExternalLink className="w-5 h-5 text-[#22C55E]" />
                Live Preview
              </a>
            </div>

            {/* Background Accent */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#22C55E]/5 rounded-full blur-3xl -z-10" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#DBEAFE]/30 rounded-full blur-3xl -z-10" />
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-[#E5E7EB] shadow-xl shadow-slate-200/50 p-10 flex flex-col justify-center relative overflow-hidden">
          <div className="text-center relative z-10">
            <p className="text-[#0D1B2A]/40 font-black uppercase tracking-[0.2em] text-[10px] mb-2 text-center">Collection Progress</p>
            <div className="relative w-44 h-44 mx-auto my-6">
               {/* Simplified SVG Progress Circle */}
               <svg className="w-full h-full transform -rotate-90">
                 <circle cx="88" cy="88" r="78" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-50" />
                 <circle 
                   cx="88" cy="88" r="78" 
                   stroke="currentColor" strokeWidth="12" fill="transparent" 
                   strokeDasharray={490}
                   strokeDashoffset={490 - (490 * (split.wallet?.balance / (split.totalAmount || 1)))}
                   strokeLinecap="round" 
                   className="text-[#22C55E] transition-all duration-1000" 
                 />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-5xl font-black text-[#0D1B2A]">
                   {split.totalAmount ? Math.round((split.wallet?.balance / split.totalAmount) * 100) : '0'}%
                 </span>
               </div>
            </div>
            <p className="text-[#0D1B2A] font-bold text-lg mb-1">
              ₦{(split.wallet?.balance || 0).toLocaleString()} <span className="text-slate-300 font-medium">/</span> ₦{(split.totalAmount || 0).toLocaleString()}
            </p>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Collected</p>
          </div>
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Users className="w-24 h-24 text-[#0D1B2A]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Tabs Navigation */}
          <div className="flex p-1.5 bg-white border border-[#E5E7EB] rounded-2xl w-fit shadow-sm">
            {(['participants', 'wallet', 'forms'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab 
                    ? 'bg-[#0D1B2A] text-[#22C55E] shadow-lg' 
                    : 'text-slate-400 hover:text-[#0D1B2A]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'participants' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => router.push(`/dashboard/splits/${shareCode}/wallet`)}
                    className="p-6 bg-white border border-[#E5E7EB] rounded-[2rem] hover:shadow-xl hover:border-[#22C55E]/30 transition-all text-left flex items-center justify-between group shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#0D1B2A] rounded-xl flex items-center justify-center group-hover:bg-[#22C55E] transition-colors">
                        <Wallet className="w-6 h-6 text-[#22C55E] group-hover:text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dedicated Wallet</p>
                        <p className="font-bold text-[#0D1B2A]">Withdraw & History</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  </button>

                  <button 
                    onClick={() => router.push(`/dashboard/splits/${shareCode}/responses`)}
                    className="p-6 bg-white border border-[#E5E7EB] rounded-[2rem] hover:shadow-xl hover:border-blue-200 transition-all text-left flex items-center justify-between group shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                        <ClipboardList className="w-6 h-6 text-blue-500 group-hover:text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Full Responses</p>
                        <p className="font-bold text-[#0D1B2A]">Table View & Export</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  </button>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-[#E5E7EB] p-8 sm:p-10 shadow-xl shadow-slate-200/50">
                  <h3 className="text-2xl font-black text-[#0D1B2A] mb-8 flex items-center gap-4">
                    <div className="p-3 bg-[#F4F8FF] rounded-2xl">
                      <Users className="w-6 h-6 text-[#22C55E]" />
                    </div>
                    Participant Tracking
                  </h3>
                  <ParticipantList 
                    participants={split.participants || []} 
                    isCreator={true}
                  />
                </div>
              </div>
            )}

            {activeTab === 'wallet' && (
              <div className="bg-white rounded-[2.5rem] border border-[#E5E7EB] p-8 sm:p-10 shadow-xl shadow-slate-200/50">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-[#0D1B2A]">Wallet Quick View</h3>
                  <button 
                    onClick={() => router.push(`/dashboard/splits/${shareCode}/wallet`)}
                    className="text-[#22C55E] font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:underline"
                  >
                    Manage Full Wallet <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <WalletOverview 
                  balance={wallet?.balance || 0} 
                  transactions={wallet?.transactions || []}
                  onWithdraw={() => router.push(`/dashboard/splits/${shareCode}/wallet`)}
                />
              </div>
            )}

            {activeTab === 'forms' && (
              <div className="bg-white rounded-[2.5rem] border border-[#E5E7EB] p-8 sm:p-10 shadow-xl shadow-slate-200/50">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-[#0D1B2A]">Form Submissions</h3>
                  <button 
                    onClick={() => router.push(`/dashboard/splits/${shareCode}/responses`)}
                    className="text-blue-500 font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:underline"
                  >
                    View All Data <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <FormResponsesList 
                  responses={formResponses} 
                  participants={split.participants || []}
                  fields={formFields} 
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          {/* Quick Stats Sidebar */}
          <div className="bg-white rounded-[2.5rem] border border-[#E5E7EB] p-8 sm:p-10 shadow-xl shadow-slate-200/50">
             <h3 className="text-xl font-black text-[#0D1B2A] mb-6 flex items-center gap-3">
              <Settings className="w-5 h-5 text-[#22C55E]" />
              Split Settings
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-5 bg-[#F4F8FF] rounded-[1.5rem] border border-[#22C55E]/5">
                <div>
                  <p className="text-[10px] font-black text-slate-400 font-bold uppercase tracking-[0.2em] mb-1">Min. Entry</p>
                  <p className="font-black text-lg text-[#0D1B2A]">₦{split.splitType === "SLOT_BASED" ? split.amountPerSlot.toLocaleString() :  split.minimumAmount?.toLocaleString() || '0'}</p>
                </div>
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-[#E5E7EB] shadow-sm">
                  <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse" />
                </div>
              </div>

              {split.splitType === 'SLOT_BASED' && (
                <div className="flex items-center justify-between p-5 bg-[#F4F8FF] rounded-[1.5rem] border border-[#22C55E]/5">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 font-bold uppercase tracking-[0.2em] mb-1">Slots Available</p>
                    <p className="font-black text-lg text-[#0D1B2A]">{split.numberOfSlots || 'Unlimited'}</p>
                  </div>
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-[#E5E7EB] shadow-sm">
                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                  </div>
                </div>
              )}
            </div>

            <button className="w-full mt-8 flex items-center justify-center gap-2 text-slate-400 font-bold hover:text-red-500 transition-colors py-2 text-sm uppercase tracking-widest">
              <Plus className="w-4 h-4 rotate-45" /> Cancel Collection
            </button>
          </div>

          <div className="bg-gradient-to-br from-[#0D1B2A] to-[#1a2f44] rounded-[2.5rem] p-10 text-white shadow-2xl shadow-slate-300 relative overflow-hidden group">
             <Share2 className="w-10 h-10 mb-6 text-[#22C55E] opacity-50 group-hover:scale-110 transition-transform" />
             <h4 className="text-2xl font-black mb-3">Reach your tribe.</h4>
             <p className="text-slate-400 font-medium mb-8 leading-relaxed">
               Share this link on Twitter, WhatsApp or Instagram to collect payments faster.
             </p>
             <button 
               onClick={copyLink}
               className="w-full bg-[#22C55E] text-white font-black py-5 rounded-2xl hover:bg-[#16A34A] transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-green-900/20"
             >
               Copy Shareable URL
             </button>
             
             {/* Decorative pattern */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SplitDetails


