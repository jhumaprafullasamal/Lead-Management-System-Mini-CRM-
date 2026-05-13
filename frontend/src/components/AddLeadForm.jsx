import React, { useState } from 'react';
import { UserPlus, X } from 'lucide-react';

const SOURCES = ['Call', 'WhatsApp', 'Field'];

const initialForm = { name: '', phone: '', source: '', notes: '' };
const initialErrors = {};

export function AddLeadForm({ onAdd, onClose }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState(initialErrors);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    else if (form.name.trim().length > 100) e.name = 'Max 100 characters';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    else if (!/^[\d\s\+\-\(\)]{7,20}$/.test(form.phone.trim())) e.phone = 'Enter a valid phone number';
    if (!form.source) e.source = 'Please select a source';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(e => ({ ...e, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    const ok = await onAdd(form);
    setSubmitting(false);
    if (ok) { setForm(initialForm); setErrors({}); onClose?.(); }
  };

  return (
    <div className="bg-white/[0.04] border border-white/[0.1] rounded-2xl overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-xl">
            <UserPlus size={16} className="text-indigo-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white font-display">Add New Lead</h2>
            <p className="text-xs text-slate-500">Fill in the details below</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <X size={16} className="text-slate-400" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Name & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name <span className="text-rose-400">*</span></label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Ravi Sharma"
              className={`w-full bg-white/[0.05] border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 transition-all
                ${errors.name ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20' : 'border-white/[0.08] focus:border-indigo-500/50 focus:ring-indigo-500/20'}`}
            />
            {errors.name && <p className="text-xs text-rose-400 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Phone Number <span className="text-rose-400">*</span></label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="e.g. +91 98765 43210"
              className={`w-full bg-white/[0.05] border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 transition-all
                ${errors.phone ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20' : 'border-white/[0.08] focus:border-indigo-500/50 focus:ring-indigo-500/20'}`}
            />
            {errors.phone && <p className="text-xs text-rose-400 mt-1">{errors.phone}</p>}
          </div>
        </div>

        {/* Source */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Lead Source <span className="text-rose-400">*</span></label>
          <div className="flex gap-2">
            {SOURCES.map(s => {
              const icons = { Call: '📞', WhatsApp: '💬', Field: '🏃' };
              const active = form.source === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => { setForm(f => ({ ...f, source: s })); if (errors.source) setErrors(e => ({ ...e, source: '' })); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200
                    ${active
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                      : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:border-white/20 hover:text-white'
                    }`}
                >
                  <span>{icons[s]}</span> {s}
                </button>
              );
            })}
          </div>
          {errors.source && <p className="text-xs text-rose-400 mt-1">{errors.source}</p>}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Notes <span className="text-slate-600">(optional)</span></label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Any additional notes..."
            rows={2}
            className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-400 disabled:bg-indigo-500/40 text-white font-semibold rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
        >
          {submitting ? (
            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Adding...</>
          ) : (
            <><UserPlus size={16} /> Add Lead</>
          )}
        </button>
      </form>
    </div>
  );
}
