'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api-client';
import { FormField, FieldType } from '@/types/split';
import { useAlert } from '@/hooks/useAlert';
import Link from 'next/link';

export default function ManageFieldsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { showAlert } = useAlert();
  const [fields, setFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // New field state
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldType, setNewFieldType] = useState<FieldType>('TEXT');
  const [newFieldRequired, setNewFieldRequired] = useState(false);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const data = await apiFetch<FormField[]>(`/forms/${id}/fields`);
        setFields(data);
      } catch (error: any) {
        console.error('Failed to fetch fields', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFields();
  }, [id]);

  const addField = () => {
    if (!newFieldLabel) return;
    const tempId = Date.now().toString();
    setFields([...fields, { 
      id: tempId, 
      label: newFieldLabel, 
      type: newFieldType, 
      required: newFieldRequired 
    }]);
    setNewFieldLabel('');
    setNewFieldType('TEXT');
    setNewFieldRequired(false);
  };

  const removeField = async (fieldId: string) => {
    // If it's a real field (not temp), we should technically delete it via API
    // but for the management UI, we can just filter it out and save the whole list
    setFields(fields.filter(f => f.id !== fieldId));
    
    // If it's already on the server, we might want to call the delete endpoint
    if (!fieldId.startsWith('17')) { // Simple check for temp vs real ID
        try {
            await apiFetch(`/forms/fields/${fieldId}`, { method: 'DELETE' });
        } catch (e) {
            console.error('Delete failed', e);
        }
    }
  };

  const saveFields = async () => {
    setIsSaving(true);
    try {
      await apiFetch(`/forms/${id}/fields`, {
        method: 'POST',
        body: JSON.stringify({ fields }),
      });
      showAlert('success', 'Form fields updated successfully!');
      router.push(`/dashboard/splits/${id}`);
    } catch (error: any) {
      showAlert('error', error.message || 'Failed to save fields');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Custom Form Fields</h1>
          <p className="text-slate-500">Collect more than just a name and email from your payers.</p>
        </div>
        <Link href={`/dashboard/splits/${id}`} className="text-slate-500 hover:text-slate-700 font-medium">
          Cancel
        </Link>
      </div>

      <div className="space-y-6">
        {/* Field List */}
        <div className="bg-white rounded-xl shadow-sm border divide-y">
          <div className="p-4 bg-slate-50 font-semibold text-slate-900 border-b">
            Active Fields
          </div>
          {fields.map((field) => (
            <div key={field.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900">{field.label}</p>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                  {field.type} {field.required && '• Required'}
                </p>
              </div>
              <button 
                onClick={() => removeField(field.id)}
                className="text-red-500 hover:text-red-600 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          ))}
          {fields.length === 0 && (
            <div className="p-8 text-center text-slate-400 italic">
              No custom fields added yet.
            </div>
          )}
        </div>

        {/* Add New Field form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
          <h3 className="font-bold text-slate-900">Add a Field</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Label</label>
              <input 
                type="text" 
                placeholder="e.g. T-Shirt Size"
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={newFieldLabel}
                onChange={(e) => setNewFieldLabel(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Type</label>
              <select 
                className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value as FieldType)}
              >
                <option value="TEXT">Text</option>
                <option value="NUMBER">Number</option>
                <option value="EMAIL">Email</option>
                <option value="SELECT">Select</option>
                <option value="CHECKBOX">Checkbox</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-4 h-4 text-blue-600"
                checked={newFieldRequired}
                onChange={(e) => setNewFieldRequired(e.target.checked)}
              />
              <span className="text-sm font-medium text-slate-700">Make this field required</span>
            </label>
            <button 
              type="button"
              onClick={addField}
              className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors"
            >
              Add Field
            </button>
          </div>
        </div>

        <button 
          onClick={saveFields}
          disabled={isSaving}
          className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50"
        >
          {isSaving ? 'Saving Changes...' : 'Save Form Structure'}
        </button>
      </div>
    </div>
  );
}
