'use client';

import { useAuth } from '@/hooks/useAuth';
import { apiFetch } from '@/lib/api-client';
import { Split } from '@/types/auth';
import { useEffect, useState } from 'react';
import { Plus, Users, Wallet, ExternalLink, LogOut } from 'lucide-react';
import Link from 'next/link';

const DashboardPage = () => {
    const { user } = useAuth();
    const [splits, setSplits] = useState<Split[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSplits = async () => {
            try {
                const data = await apiFetch<Split[]>('/splits/me');
                setSplits(data);
            } catch (error) {
                console.error('Failed to fetch splits', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchSplits();
        }
    }, [user]);

    return (
        <div className="bg-[#F4F8FF] min-h-screen">
            {/* Welcome & Stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#0D1B2A]">Hello, {user?.name?.split(' ')[0]} 👋</h1>
                    <p className="text-slate-500">Track and manage your payment splits.</p>
                </div>
                <Link 
                    href="/dashboard/splits/create"
                    className="flex items-center justify-center gap-x-2 bg-[#22C55E] hover:bg-[#16A34A] text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-green-500/20 active:scale-95 disabled:bg-[#86EFAC]"
                >
                    <Plus className="w-5 h-5" />
                    New Payment Split
                </Link>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Splits List */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-lg font-bold text-[#0D1B2A] flex items-center gap-x-2">
                        Recent Splits
                        <span className="bg-[#22C55E]/10 text-[#22C55E] text-[10px] px-2.5 py-1 rounded-full font-black">
                            {splits.length}
                        </span>
                    </h2>

                    {isLoading ? (
                        <div className="grid grid-cols-1 gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white h-24 rounded-2xl animate-pulse border border-[#E5E7EB]" />
                            ))}
                        </div>
                    ) : splits.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {splits.map((split) => (
                                <div key={split.id} className="bg-white p-5 rounded-2xl border border-[#E5E7EB] hover:border-blue-400 transition-all group shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-[#0D1B2A]">{split.title}</h3>
                                            {split.description && (
                                                <p className="text-sm text-slate-500 mt-1 line-clamp-1">{split.description}</p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-[#22C55E]">₦{(split.wallet?.balance || 0).toLocaleString()}</p>
                                            <p className="text-xs text-slate-400">of ₦{(split.totalAmount || 0).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                                        <div className="flex items-center gap-x-4">
                                            <div className="flex items-center gap-x-1.5 text-slate-500">
                                                <Users className="w-4 h-4" />
                                                <span className="text-xs">{(split.participants || []).filter((p: any) => p.hasPaid).length}/{(split.participants || []).length} paid</span>
                                            </div>
                                            <div className="flex items-center gap-x-1.5">
                                                <div className={`w-1.5 h-1.5 rounded-full ${
                                                    split.status === 'ACTIVE' ? 'bg-[#22C55E]' : 
                                                    split.status === 'PENDING' ? 'bg-amber-400' : 'bg-slate-300'
                                                }`} />
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{split.status}</span>
                                            </div>
                                        </div>
                                        <Link 
                                            href={`/dashboard/splits/${split.shareCode}`}
                                            className="text-xs font-bold text-[#22C55E] flex items-center gap-x-1 hover:text-[#16A34A] transition-colors"
                                        >
                                            View Details
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-12 rounded-3xl border border-dashed border-[#E5E7EB] text-center">
                            <Plus className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-[#0D1B2A]">No splits found</h3>
                            <p className="text-slate-500 mb-6">Create your first payment split to get started.</p>
                            <Link 
                                href="/dashboard/splits/create"
                                className="inline-flex items-center gap-x-2 bg-[#22C55E] hover:bg-[#16A34A] text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-green-100"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>

                {/* Sidebar/Activity */}
                <div className="space-y-6">
                    <div className="bg-[#0D1B2A] rounded-3xl p-6 text-white shadow-xl shadow-slate-900/20">
                        <p className="text-slate-400 text-sm font-medium">Quick Stats</p>
                        <h3 className="text-3xl font-bold mt-1 text-white">
                            ₦{splits.reduce((acc, s) => acc + (s.wallet?.balance || 0), 0).toLocaleString()}
                        </h3>
                        <p className="text-xs text-slate-500 mt-2">Total contributions collected across all splits</p>
                        <div className="mt-6 flex gap-x-3">
                            <button className="flex-1 bg-[#22C55E] hover:bg-[#16A34A] py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:shadow-lg hover:shadow-green-500/20 active:scale-95">
                                Withdraw
                            </button>
                            <button className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all">
                                History
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-sm">
                        <h3 className="font-bold text-[#0D1B2A] mb-4">Notifications</h3>
                        <div className="space-y-4">
                            <p className="text-sm text-slate-500 italic">No new activity to show.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;