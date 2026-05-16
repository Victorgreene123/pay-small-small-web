'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Building2,
  Plus,
  Trash2,
  Pencil,
  X,
  CreditCard,
  Building,
  ChevronDown,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { apiFetch } from '../../../../lib/api-client';
import { useAlert } from '../../../../hooks/useAlert';
import { BankAccount } from '../../../../types/bank';
import { SUPPORTED_BANKS, BankEntry } from '../../../../lib/bank-list';

interface BankInfo {
  id: number;
  name: string;
  code: string;
  slug: string;
  country: string;
  currency: string;
  type: string;
}

// Shape of what we POST/PATCH to the API
interface BankFormData {
  bankName: string;
  accountNumber: string;
  accountName: string;
  code: string;
  isDefault: boolean;
}

// Expected shape of the /payments/banks response
interface BanksApiResponse {
  success: boolean;
  data: BankInfo[];
}

export default function BanksPage() {
  const [banks, setBanks] = useState<BankAccount[]>([]);
  const [availableBanks] = useState<BankEntry[]>(SUPPORTED_BANKS);
  const [loading, setLoading] = useState(true);
  const [isResolving, setIsResolving] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBank, setEditingBank] = useState<BankAccount | null>(null);
  const [bankSearch, setBankSearch] = useState('');
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const { showAlert } = useAlert();

  // Ref for closing bank dropdown on outside click
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<BankFormData>({
    bankName: '',
    accountNumber: '',
    accountName: '',
    code: '',
    isDefault: false,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowBankDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchBanks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetch<BankAccount[]>('/banks');
      setBanks(data ?? []);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to load bank accounts';
      showAlert('error', message);
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchBanks();
  }, [fetchBanks]);

  const resolveAccount = async (bankCode: string, accountNumber: string) => {
    if (accountNumber.length !== 10 || !bankCode) return;

    try {
      setIsResolving(true);
      setIsVerified(false);
      const res = await apiFetch<{ account_name: string , account_number: string}>('/banks/resolve', {
        method: 'POST',
        body: JSON.stringify({ bankCode, accountNumber }),
      });

      console.log(res)

      if ( res?.account_name) {
        setFormData((prev) => ({ ...prev, accountName: res.account_name }));
        setIsVerified(true);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Could not verify account details';
      showAlert('error', message);
      setFormData((prev) => ({ ...prev, accountName: '' }));
      setIsVerified(false);
    } finally {
      setIsResolving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      bankName: '',
      accountNumber: '',
      accountName: '',
      code: '',
      isDefault: false,
    });
    setBankSearch('');
    setShowBankDropdown(false);
    setIsVerified(false);
    setIsResolving(false);
  };

  const handleOpenModal = (bank?: BankAccount) => {
    if (bank) {
      setEditingBank(bank);
      setIsVerified(true); // Pre-existing banks are considered verified
      setFormData({
        bankName: bank.bankName,
        accountNumber: bank.accountNumber,
        accountName: bank.accountName,
        // bankCode may be undefined on BankAccount — fall back to empty string
        code: bank.bankCode ?? '',
        isDefault: bank.isDefault,
      });
      setBankSearch(bank.bankName);
    } else {
      setEditingBank(null);
      setIsVerified(false);
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBank(null);
    setIsVerified(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (editingBank) {
        await apiFetch(`/banks/${editingBank.id}`, {
          method: 'PATCH',
          body: JSON.stringify(formData),
        });
        showAlert('success', 'Bank account updated successfully');
      } else {
        await apiFetch('/banks', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        showAlert('success', 'Bank account added successfully');
      }
      handleCloseModal();
      fetchBanks();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save bank account';
      showAlert('error', message);
    }
  };

  // id is typed as whatever BankAccount defines — convert to string for the URL
  const handleDelete = async (id: BankAccount['id']) => {
    if (!confirm('Are you sure you want to delete this bank account?')) return;
    try {
      await apiFetch(`/banks/${id}`, { method: 'DELETE' });
      showAlert('success', 'Bank account deleted');
      fetchBanks();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete bank account';
      showAlert('error', message);
    }
  };

  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits
    const value = e.target.value.replace(/\D/g, '');
    setFormData((prev) => ({ ...prev, accountNumber: value }));

    if (value.length === 10 && formData.code) {
      resolveAccount(formData.code, value);
    } else {
      setIsVerified(false);
    }
  };

  const filteredBanks = availableBanks.filter((b) =>
    b.name.toLowerCase().includes(bankSearch.toLowerCase())
  );

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
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-[2rem] bg-slate-50 animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : banks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {banks.map((bank) => (
            <div
              key={bank.id}
              className="group bg-white rounded-[2rem] border border-[#E5E7EB] p-8 relative overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div
                    className={`p-4 rounded-2xl ${
                      bank.isDefault ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#F4F8FF] text-[#0D1B2A]'
                    }`}
                  >
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenModal(bank)}
                      className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-[#0D1B2A]"
                      aria-label="Edit bank account"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(bank.id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500"
                      aria-label="Delete bank account"
                    >
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
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      Account Name
                    </p>
                    <p className="font-bold text-[#0D1B2A] text-sm uppercase">{bank.accountName}</p>
                  </div>
                  {bank.isDefault && (
                    <span className="bg-[#22C55E] text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg shadow-[#22C55E]/30">
                      Default
                    </span>
                  )}
                </div>
              </div>

              {/* Decorative card stripe */}
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
          <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto">
            Add your bank details to start receiving payments once your splits are completed.
          </p>
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
          <div
            className="absolute inset-0 bg-[#0D1B2A]/60 backdrop-blur-sm"
            onClick={handleCloseModal}
          />
          <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 sm:p-10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-[#0D1B2A]">
                  {editingBank ? 'Edit Bank Account' : 'Add Bank Account'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6 text-[#0D1B2A]" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Bank selector */}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                    Select Bank
                  </label>
                  <div className="relative" ref={dropdownRef}>
                    <Building className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <input
                      required
                      type="text"
                      placeholder="Search bank..."
                      className="w-full pl-14 pr-12 py-4 bg-[#F4F8FF] border-2 border-transparent focus:border-[#22C55E] focus:bg-white rounded-2xl outline-none transition-all font-bold text-[#0D1B2A]"
                      value={bankSearch}
                      onChange={(e) => {
                        setBankSearch(e.target.value);
                        // Clear the selected bank code if the user is typing a new search
                        setFormData((prev) => ({ ...prev, bankName: '', code: '' }));
                        setShowBankDropdown(true);
                      }}
                      onFocus={() => setShowBankDropdown(true)}
                      autoComplete="off"
                    />
                    <ChevronDown
                      className={`absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none transition-transform ${
                        showBankDropdown ? 'rotate-180' : ''
                      }`}
                    />

                    {showBankDropdown && (
                      <div className="absolute z-20 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl max-h-60 overflow-y-auto p-2">
                        {availableBanks.length === 0 ? (
                          <div className="p-4 text-center text-slate-400 text-sm italic">
                            Loading banks…
                          </div>
                        ) : filteredBanks.length === 0 ? (
                          <div className="p-4 text-center text-slate-400 text-sm italic">
                            No banks found matching &ldquo;{bankSearch}&rdquo;
                          </div>
                        ) : (
                          filteredBanks.map((b,i) => (
                            <button
                              key={i} 
                              type="button"
                              className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#F4F8FF] transition-colors flex items-center justify-between group"
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  bankName: b.name,
                                  code: b.code,
                                }));
                                setBankSearch(b.name);
                                setShowBankDropdown(false);
                                if (formData.accountNumber.length === 10) {
                                  resolveAccount(b.code, formData.accountNumber);
                                }
                              }}
                            >
                              <span className="font-bold text-[#0D1B2A]">{b.name}</span>
                              <span className="text-[10px] font-black text-slate-300 group-hover:text-[#22C55E]">
                                {b.code}
                              </span>
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                      Account Number
                    </label>
                    <div className="relative">
                      <input
                        required
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        placeholder="0000000000"
                        className="w-full px-6 py-4 bg-[#F4F8FF] border-2 border-transparent focus:border-[#22C55E] focus:bg-white rounded-2xl outline-none transition-all font-bold text-[#0D1B2A] tracking-[0.2em]"
                        value={formData.accountNumber}
                        onChange={handleAccountNumberChange}
                      />
                      {isResolving && (
                        <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#22C55E] animate-spin" />
                      )}
                      {isVerified && !isResolving && (
                        <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#22C55E]" />
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                      Account Name
                    </label>
                    <input
                      required
                      readOnly={isVerified || isResolving}
                      type="text"
                      placeholder="John Doe"
                      className={`w-full px-6 py-4 border-2 border-transparent rounded-2xl outline-none transition-all font-bold text-[#0D1B2A] uppercase ${
                        isVerified || isResolving 
                          ? 'bg-[#22C55E]/5 border-[#22C55E]/20 text-[#22C55E]' 
                          : 'bg-[#F4F8FF] focus:border-[#22C55E] focus:bg-white'
                      }`}
                      value={formData.accountName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev) => ({ ...prev, accountName: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded-lg border-2 border-slate-300 text-[#22C55E] focus:ring-[#22C55E] transition-all cursor-pointer"
                    checked={formData.isDefault}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData((prev) => ({ ...prev, isDefault: e.target.checked }))
                    }
                  />
                  <div>
                    <span className="font-black text-[#0D1B2A] text-xs uppercase tracking-widest">
                      Set as default
                    </span>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Use this account for all future split payouts.
                    </p>
                  </div>
                </label>

                <div className="pt-4">
                  <button
                    disabled={!isVerified || isResolving}
                    type="submit"
                    className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs transition-all active:scale-95 ${
                      !isVerified || isResolving
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-[#0D1B2A] text-[#22C55E] hover:shadow-2xl hover:shadow-[#0D1B2A]/30'
                    }`}
                  >
                    {isResolving ? 'Verifying...' : editingBank ? 'Save Changes' : 'Add Bank Account'}
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