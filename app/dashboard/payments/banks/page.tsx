'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Trash2, 
  Pencil, 
  CheckCircle2, 
  AlertCircle,
  X,
  CreditCard,
  Building,
  MoreVertical,
  ChevronDown,
  Search
} from 'lucide-react';
import { apiFetch } from '../../../../lib/api-client';
import { useAlert } from '../../../../hooks/useAlert';
import { BankAccount } from '../../../../types/bank';

interface BankInfo {
  id: number;
  name: string;
  code: string;
  slug: string;
  country: string;
  currency: string;
  type: string;
}

export default function BanksPage() {
  const [banks, setBanks] = useState<BankAccount[]>([]);
  const [availableBanks, setAvailableBanks] = useState<BankInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBank, setEditingBank] = useState<BankAccount | null>(null);
  const [bankSearch, setBankSearch] = useState('');
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const { showAlert } = useAlert();

  // Form State
  const [formData, setFormData] = useState({
    bankName: '',
    accountNumber: '',
    accountName: '',
    code: '',
    isDefault: false
  });

  useEffect(() => {
    fetchBanks();
    fetchAvailableBanks();
  }, []);

  const fetchBanks = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<BankAccount[]>('/banks');
      setBanks(data || []);
    } catch (error: any) {
      showAlert('error', error.message || 'Failed to load bank accounts');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableBanks = async () => {
    try {
      console.log('Fetching banks from /payments/banks...');
      // Ensure we use the correct absolute or relative path that maps to BASE_URL + endpoint
      // apiFetch prepends BASE_URL (https://pay-small-small.onrender.com/api)
      const res = await apiFetch<any>('/payments/banks');
      console.log('Bank API Response:', res);
      
      // Based on your example structure: { success: true, data: [...] }
      if (res && res.data && Array.isArray(res.data)) {
        setAvailableBanks(res.data);
      } else if (Array.isArray(res)) {
        // Fallback if the API returns the array directly
        setAvailableBanks(res);
      } else {
        console.error('API responded but data is missing or not an array:', res);
      }
    } catch (error: any) {
      console.error('Failed to fetch bank list:', error);
    }
  };

  const handleOpenModal = (bank?: BankAccount) => {
    if (bank) {
      setEditingBank(bank);
      setFormData({
        bankName: bank.bankName,
        accountNumber: bank.accountNumber,
        accountName: bank.accountName,
        code: bank.bankCode || '',
        isDefault: bank.isDefault
      });
      setBankSearch(bank.bankName);
    } else {
      setEditingBank(null);
      setFormData({
        bankName: '',
        accountNumber: '',
        accountName: '',
        code: '',
        isDefault: false
      });
      setBankSearch('');
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBank) {
        await apiFetch(`/banks/${editingBank.id}`, {
          method: 'PATCH',
          body: JSON.stringify(formData)
        });
        showAlert('success', 'Bank account updated successfully');
      } else {
        await apiFetch('/banks', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        showAlert('success', 'Bank account added successfully');
      }
      setShowModal(false);
      fetchBanks();
    } catch (error: any) {
      showAlert('error', error.message || 'Failed to save bank account');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bank account?')) return;
    try {
      await apiFetch(`/banks/${id}`, { method: 'DELETE' });
      showAlert('success', 'Bank account deleted');
      fetchBanks();
    } catch (error: any) {
      showAlert('error', error.message || 'Failed to delete bank account');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-black text-[#0D1B2A] tracking-tight mb-2">My Banks</h1>
          <p className="text-slate-500 font-medium">Manage where you receive your split payouts.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#0D1B2A] text-[#22C55E] px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:shadow-xl hover:shadow-[#0D1B2A]/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add New Bank
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 rounded-[2rem] bg-slate-50 animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : banks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {banks.map((bank) => (
            <div key={bank.id} className="group bg-white rounded-[2rem] border border-[#E5E7EB] p-8 relative overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl ${bank.isDefault ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#F4F8FF] text-[#0D1B2A]'}`}>
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenModal(bank)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-[#0D1B2A]">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(bank.id)} className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-black text-[#0D1B2A] mb-1">{bank.bankName}</h3>
                <p className="text-2xl font-black text-[#22C55E] tracking-widest mb-4">
                  •••• {bank.accountNumber.slice(-4)}
                </p>
                
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account Name</p>
                    <p className="font-bold text-[#0D1B2A] text-sm uppercase">{bank.accountName}</p>
                  </div>
                  {bank.isDefault && (
                    <span className="bg-[#22C55E] text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg shadow-[#22C55E]/30">
                      Default
                    </span>
                  )}
                </div>
              </div>

              {/* Decorative card stripes */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#F4F8FF] rounded-bl-full -mr-16 -mt-16 z-0 opacity-50" />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-[#E5E7EB]">
          <div className="w-24 h-24 bg-[#F4F8FF] rounded-[2rem] flex items-center justify-center mx-auto mb-6">
            <CreditCard className="w-12 h-12 text-slate-300" />
          </div>
          <h2 className="text-2xl font-black text-[#0D1B2A] mb-3">No Saved Banks</h2>
          <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto">Add your bank details to start receiving payments once your splits are completed.</p>
          <button 
            onClick={() => handleOpenModal()}
            className="text-[#22C55E] font-black uppercase tracking-widest text-[11px] underline underline-offset-8"
          >
            + Add your first bank account
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-[#0D1B2A]/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 sm:p-10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-[#0D1B2A]">
                  {editingBank ? 'Edit Bank Account' : 'Add Bank Account'}
                </h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                  <X className="w-6 h-6 text-[#0D1B2A]" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Select Bank</label>
                  <div className="relative">
                    <Building className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      required
                      type="text"
                      placeholder="Search bank..."
                      className="w-full pl-14 pr-12 py-4 bg-[#F4F8FF] border-2 border-transparent focus:border-[#22C55E] focus:bg-white rounded-2xl outline-none transition-all font-bold text-[#0D1B2A]"
                      value={bankSearch}
                      onChange={(e) => {
                        setBankSearch(e.target.value);
                        setShowBankDropdown(true);
                      }}
                      onFocus={() => setShowBankDropdown(true)}
                    />
                    <ChevronDown className={`absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-transform ${showBankDropdown ? 'rotate-180' : ''}`} />
                    
                    {showBankDropdown && (
                      <div className="absolute z-20 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl max-h-60 overflow-y-auto p-2">
                        {availableBanks.length > 0 ? (
                          availableBanks
                            .filter(b => b.name.toLowerCase().includes(bankSearch.toLowerCase()))
                            .map((bank) => (
                              <button
                                key={bank.code}
                                type="button"
                                className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#F4F8FF] transition-colors flex items-center justify-between group"
                                onClick={() => {
                                  setFormData({ ...formData, bankName: bank.name, code: bank.code });
                                  setBankSearch(bank.name);
                                  setShowBankDropdown(false);
                                }}
                              >
                                <span className="font-bold text-[#0D1B2A]">{bank.name}</span>
                                <span className="text-[10px] font-black text-slate-300 group-hover:text-[#22C55E]">{bank.code}</span>
                              </button>
                            ))
                        ) : (
                          <div className="p-4 text-center text-slate-400 text-sm italic">Loading banks...</div>
                        )}
                        {availableBanks.length > 0 && availableBanks.filter(b => b.name.toLowerCase().includes(bankSearch.toLowerCase())).length === 0 && (
                          <div className="p-4 text-center text-slate-400 text-sm italic">No banks found matching "{bankSearch}"</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Account Number</label>
                    <input 
                      required
                      type="text"
                      maxLength={10}
                      placeholder="0000000000"
                      className="w-full px-6 py-4 bg-[#F4F8FF] border-2 border-transparent focus:border-[#22C55E] focus:bg-white rounded-2xl outline-none transition-all font-bold text-[#0D1B2A] tracking-[0.2em]"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Account Name</label>
                    <input 
                      required
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-6 py-4 bg-[#F4F8FF] border-2 border-transparent focus:border-[#22C55E] focus:bg-white rounded-2xl outline-none transition-all font-bold text-[#0D1B2A] uppercase"
                      value={formData.accountName}
                      onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <input 
                    type="checkbox"
                    className="w-5 h-5 rounded-lg border-2 border-slate-300 text-[#22C55E] focus:ring-[#22C55E] transition-all cursor-pointer"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                  />
                  <div>
                    <span className="font-black text-[#0D1B2A] text-xs uppercase tracking-widest">Set as default</span>
                    <p className="text-[10px] text-slate-400 font-medium">Use this account for all future split payouts.</p>
                  </div>
                </label>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full bg-[#0D1B2A] text-[#22C55E] py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:shadow-2xl hover:shadow-[#0D1B2A]/30 transition-all active:scale-95"
                  >
                    {editingBank ? 'Save Changes' : 'Add Bank Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
