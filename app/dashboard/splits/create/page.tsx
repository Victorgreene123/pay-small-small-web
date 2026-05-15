"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, ChevronRight, ChevronLeft, Layout, Users, Settings, FormInput } from 'lucide-react'
import { FieldType, SplitType, CreateSplitInput, FormFieldInput } from '@/types/split'
import { apiFetch } from '@/lib/api-client'
import { useAlert } from '@/hooks/useAlert'

const STEPS = [
  { id: 'basics', title: 'Basics', icon: Layout },
  { id: 'configuration', title: 'Setup', icon: Settings },
  { id: 'form', title: 'Data Collection', icon: FormInput },
]

const CreateSplit = () => {
  const router = useRouter()
  const { showAlert } = useAlert()
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState<CreateSplitInput>({
    title: '',
    splitType: 'FIXED',
    formData: [],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNext = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const handleBack = () => setStep((s) => Math.max(s - 1, 0))

  const addField = () => {
    const newField: FormFieldInput = { label: '', type: 'TEXT', required: false }
    setFormData({ ...formData, formData: [...(formData.formData || []), newField] })
  }

  const removeField = (index: number) => {
    const newFields = [...(formData.formData || [])]
    newFields.splice(index, 1)
    setFormData({ ...formData, formData: newFields })
  }

  const updateField = (index: number, updates: Partial<FormFieldInput>) => {
    const newFields = [...(formData.formData || [])]
    newFields[index] = { ...newFields[index], ...updates }
    setFormData({ ...formData, formData: newFields })
  }

  const addOption = (fieldIndex: number) => {
    const newFields = [...(formData.formData || [])]
    const currentOptions = newFields[fieldIndex].options || []
    newFields[fieldIndex] = { ...newFields[fieldIndex], options: [...currentOptions, ''] }
    setFormData({ ...formData, formData: newFields })
  }

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const newFields = [...(formData.formData || [])]
    const currentOptions = [...(newFields[fieldIndex].options || [])]
    currentOptions.splice(optionIndex, 1)
    newFields[fieldIndex] = { ...newFields[fieldIndex], options: currentOptions }
    setFormData({ ...formData, formData: newFields })
  }

  const updateOption = (fieldIndex: number, optionIndex: number, value: string) => {
    const newFields = [...(formData.formData || [])]
    const currentOptions = [...(newFields[fieldIndex].options || [])]
    currentOptions[optionIndex] = value
    newFields[fieldIndex] = { ...newFields[fieldIndex], options: currentOptions }
    setFormData({ ...formData, formData: newFields })
  }

  const handleSubmit = async () => {
    if (!formData.title) {
      showAlert('error', 'Please enter a title')
      return
    }

    setIsSubmitting(true)
    try {
      // API expects 'amount' instead of 'totalAmount' or 'minimumAmount' in basic split creation
      const payload = {
        ...formData,
        amount: formData.totalAmount || formData.minimumAmount || 0,
        participants: [] // API might require participants array, even if empty for joinable splits
      };

      const response = await apiFetch<any>('/splits', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      // After split is created, if there are custom fields, attach them
      if (formData.formData && formData.formData.length > 0) {
        await apiFetch(`/forms/${response.id}/fields`, {
          method: 'POST',
          body: JSON.stringify({ fields: formData.formData }),
        })
      }

      showAlert('success', 'Payment split created successfully!')
      router.push(`/dashboard/splits/${response.shareCode}`)
    } catch (error: any) {
      showAlert('error', error.message || 'Failed to create split')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-[#0D1B2A] tracking-tight">Create Payment Split</h1>
        <p className="mt-2 text-slate-500">Set up how you want to collect payments from your group.</p>
      </div>

      {/* Stepper */}
      <div className="flex justify-between items-center mb-12 relative px-2">
        <div className="absolute top-6 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 -z-10" />
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex flex-col items-center">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm border ${
              step >= i ? 'bg-[#22C55E] border-[#22C55E] text-white translate-y-[-4px] shadow-green-100' : 'bg-white border-slate-200 text-slate-400'
            }`}>
              <s.icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className={`mt-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider ${step >= i ? 'text-[#22C55E]' : 'text-slate-400'}`}>
              {s.title}
            </span>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-[#E5E7EB] shadow-xl shadow-slate-200/50 p-5 sm:p-8 min-h-[400px]">
        {step === 0 && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#0D1B2A] uppercase tracking-wider mb-3">Project Title</label>
              <input
                type="text"
                placeholder="e.g. Wedding Contribution"
                className="w-full px-5 py-3.5 sm:px-6 sm:py-4 bg-[#F4F8FF] border-0 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#22C55E] text-base sm:text-lg font-medium transition-all outline-none"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {(['FIXED', 'SLOT_BASED', 'OPEN'] as SplitType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setFormData({ ...formData, splitType: type })}
                  className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 text-left transition-all ${
                    formData.splitType === type ? 'border-[#22C55E] bg-[#F4F8FF]' : 'border-[#E5E7EB] hover:border-[#DBEAFE]'
                  }`}
                >
                  <p className={`font-bold capitalize text-sm sm:text-base mb-1 ${formData.splitType === type ? 'text-[#22C55E]' : 'text-[#0D1B2A]'}`}>
                    {type.replace('_', ' ')}
                  </p>
                  <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed">
                    {type === 'FIXED' && 'Set specific amounts for known participants.'}
                    {type === 'SLOT_BASED' && 'Total amount shared equally across slots.'}
                    {type === 'OPEN' && 'Dynamic payments with a set minimum goal.'}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {(formData.splitType === 'SLOT_BASED' || formData.splitType === 'OPEN') && (
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#0D1B2A] uppercase tracking-wider mb-3">Total Goal (₦)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full px-5 py-3.5 sm:px-6 sm:py-4 bg-[#F4F8FF] border-0 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#22C55E] text-base sm:text-lg font-medium outline-none"
                    value={formData.totalAmount || ''}
                    onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
                  />
                </div>
              )}

              {formData.splitType === 'SLOT_BASED' && (
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#0D1B2A] uppercase tracking-wider mb-3">Number of Slots</label>
                  <input
                    type="number"
                    placeholder="e.g. 10"
                    className="w-full px-5 py-3.5 sm:px-6 sm:py-4 bg-[#F4F8FF] border-0 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#22C55E] text-base sm:text-lg font-medium outline-none"
                    value={formData.numberOfSlots || ''}
                    onChange={(e) => setFormData({ ...formData, numberOfSlots: Number(e.target.value) })}
                  />
                  <p className="mt-2 text-[10px] sm:text-xs text-[#22C55E] font-medium italic">
                    Each slot will cost {(formData.totalAmount && formData.numberOfSlots) ? `₦${(formData.totalAmount / formData.numberOfSlots).toLocaleString()}` : '...'}
                  </p>
                </div>
              )}

              {formData.splitType === 'FIXED' && (
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#0D1B2A] uppercase tracking-wider mb-3">Amount per Person (₦)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full px-5 py-3.5 sm:px-6 sm:py-4 bg-[#F4F8FF] border-0 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#22C55E] text-base sm:text-lg font-medium outline-none"
                    value={formData.minimumAmount || ''}
                    onChange={(e) => setFormData({ ...formData, minimumAmount: Number(e.target.value) })}
                  />
                </div>
              )}

              {formData.splitType === 'OPEN' && (
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#0D1B2A] uppercase tracking-wider mb-3">Minimum Entry (₦)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full px-5 py-3.5 sm:px-6 sm:py-4 bg-[#F4F8FF] border-0 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-[#22C55E] text-base sm:text-lg font-medium outline-none"
                    value={formData.minimumAmount || ''}
                    onChange={(e) => setFormData({ ...formData, minimumAmount: Number(e.target.value) })}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base sm:text-lg font-bold text-[#0D1B2A]">Field Builder</h3>
              <button
                onClick={addField}
                className="flex items-center gap-x-1.5 text-[#22C55E] font-bold hover:text-[#16A34A] text-xs sm:text-sm"
              >
                <Plus className="w-4 h-4" /> Add Field
              </button>
            </div>

            <div className="space-y-6">
              {formData.formData?.map((field, index) => (
                <div key={index} className="space-y-3">
                  <div className="p-4 sm:p-6 bg-[#F4F8FF] rounded-xl sm:rounded-2xl border border-[#E5E7EB] flex flex-col gap-4">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Label</label>
                        <input
                          type="text"
                          placeholder="e.g. Full Name"
                          className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-white border border-[#E5E7EB] rounded-lg sm:rounded-xl outline-none focus:ring-2 focus:ring-[#22C55E] text-sm sm:text-base font-medium"
                          value={field.label}
                          onChange={(e) => updateField(index, { label: e.target.value })}
                        />
                      </div>
                      <button
                        onClick={() => removeField(index)}
                        className="mt-6 p-2 text-slate-300 hover:text-red-500 transition-colors bg-white rounded-lg border border-[#E5E7EB] shadow-sm"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 items-end">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Input Type</label>
                        <select
                          className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-[#E5E7EB] rounded-lg sm:rounded-xl bg-white outline-none text-xs sm:text-sm font-bold text-[#0D1B2A]"
                          value={field.type}
                          onChange={(e) => updateField(index, { type: e.target.value as FieldType, options: (e.target.value === 'SELECT' || e.target.value === 'CHECKBOX') ? [] : undefined })}
                        >
                          <option value="TEXT">Text</option>
                          <option value="NUMBER">Number</option>
                          <option value="EMAIL">Email</option>
                          <option value="SELECT">Select</option>
                          <option value="CHECKBOX">Checkbox</option>
                        </select>
                      </div>
                      <div className="flex items-center h-[38px] sm:h-[42px] gap-x-2 bg-white border border-[#E5E7EB] rounded-lg sm:rounded-xl px-3 cursor-pointer select-none"
                           onClick={() => updateField(index, { required: !field.required })}>
                        <input
                          type="checkbox"
                          className="w-3.5 h-3.5 text-[#22C55E] rounded border-[#E5E7EB]"
                          checked={field.required}
                          onChange={(e) => updateField(index, { required: e.target.checked })}
                        />
                        <span className="text-[10px] font-bold text-[#0D1B2A] uppercase tracking-tighter">Required</span>
                      </div>
                    </div>
                  </div>
                  
                  {(field.type === 'SELECT' || field.type === 'CHECKBOX') && (
                    <div className="ml-4 sm:ml-8 p-4 sm:p-5 bg-[#DBEAFE]/30 rounded-xl sm:rounded-2xl border-l-4 border-[#22C55E] animate-in fade-in slide-in-from-left-2">
                      <div className="flex justify-between items-center mb-4">
                        <label className="block text-xs font-bold text-[#0D1B2A] uppercase tracking-widest">
                          {field.type === 'SELECT' ? 'Dropdown Options' : 'Checkbox Choices'}
                        </label>
                        <button
                          onClick={() => addOption(index)}
                          className="text-xs font-bold text-[#22C55E] hover:text-[#16A34A] flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Option
                        </button>
                      </div>
                      <div className="space-y-3">
                        {field.options?.map((option, optIndex) => (
                          <div key={optIndex} className="flex gap-2">
                            <input
                              type="text"
                              placeholder={`Option ${optIndex + 1}`}
                              className="flex-1 px-4 py-2 bg-white border border-[#E5E7EB] rounded-xl outline-none focus:ring-2 focus:ring-[#22C55E] text-sm"
                              value={option}
                              onChange={(e) => updateOption(index, optIndex, e.target.value)}
                            />
                            <button
                              onClick={() => removeOption(index, optIndex)}
                              className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        {(!field.options || field.options.length === 0) && (
                          <p className="text-center text-xs text-slate-400 py-2">No options added. Click "Add Option" to start.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {(!formData.formData || formData.formData.length === 0) && (
                <div className="text-center py-12 border-2 border-dashed border-[#E5E7EB] rounded-[2rem]">
                   <FormInput className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                   <p className="text-slate-400 font-medium">Add custom fields to collect info from payers</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="mt-8 sm:mt-10 flex justify-between items-center px-2">
        {step > 0 ? (
          <button
            onClick={handleBack}
            className="flex items-center gap-x-1 sm:gap-x-2 font-bold text-slate-500 hover:text-[#0D1B2A] px-4 py-3 transition-colors text-sm sm:text-base"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" /> Back
          </button>
        ) : <div />}

        <button
          onClick={step === STEPS.length - 1 ? handleSubmit : handleNext}
          disabled={isSubmitting}
          className="bg-[#22C55E] hover:bg-[#16A34A] text-white px-6 sm:px-10 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold flex items-center gap-x-2 shadow-xl shadow-green-100 transition-all hover:scale-[1.02] active:scale-95 text-sm sm:text-base disabled:bg-[#86EFAC]"
        >
          {isSubmitting ? 'Processing...' : (
            <>
              {step === STEPS.length - 1 ? 'Launch Split' : 'Continue'}
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default CreateSplit
