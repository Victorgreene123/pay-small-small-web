'use client';

import { FormField } from '@/types/split';

interface DynamicFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void;
  isLoading?: boolean;
}

export const DynamicForm = ({ fields, onSubmit, isLoading }: DynamicFormProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {};
    
    fields.forEach(field => {
      data[field.id] = formData.get(field.id);
    });
    
    onSubmit(data);
  };

  if (fields.length === 0) return null;

  return (
    <form id="dynamic-split-form" onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.id} className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
            {field.label} {field.required && <span className="text-[#22C55E]">*</span>}
          </label>
          
          {field.type === 'SELECT' ? (
            <select
              name={field.id}
              required={field.required}
              className="w-full px-6 py-4 bg-[#F4F8FF] border-0 rounded-2xl focus:ring-2 focus:ring-[#22C55E] outline-none text-[#0D1B2A] font-bold appearance-none cursor-pointer"
            >
              <option value="" className="text-slate-500">Select {field.label}</option>
              {field.options?.map(opt => (
                <option key={opt} value={opt} className="text-[#0D1B2A]">
                  {opt}
                </option>
              ))}
            </select>
          ) : field.type === 'CHECKBOX' ? (
            <div className="flex items-center gap-3 p-4 bg-[#F4F8FF] rounded-2xl border-0">
              <input
                type="checkbox"
                name={field.id}
                required={field.required}
                className="w-5 h-5 accent-[#22C55E] rounded-lg cursor-pointer"
              />
              <span className="text-xs font-bold text-[#0D1B2A]">Please confirm {field.label}</span>
            </div>
          ) : (
            <input
              type={field.type.toLowerCase()}
              name={field.id}
              required={field.required}
              placeholder={`Enter ${field.label}`}
              className="w-full px-6 py-4 bg-[#F4F8FF] border-0 rounded-2xl focus:ring-2 focus:ring-[#22C55E] outline-none text-[#0D1B2A] font-bold placeholder:text-slate-400 placeholder:font-medium"
            />
          )}
        </div>
      ))}
    </form>
  );
};
