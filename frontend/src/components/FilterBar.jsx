import React from 'react';
import { Search, X } from 'lucide-react';

const STATUSES = ['', 'New', 'Interested', 'Not Interested', 'Converted'];
const SOURCES  = ['', 'Call', 'WhatsApp', 'Field'];

export function FilterBar({ filters, setFilters, total }) {
  const hasFilters = filters.search || filters.status || filters.source;

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={filters.search}
          onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
          placeholder="Search by name or phone..."
          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all"
        />
        {filters.search && (
          <button onClick={() => setFilters(f => ({ ...f, search: '' }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdowns + count */}
      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={filters.status}
          onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/40 cursor-pointer appearance-none"
        >
          {STATUSES.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
        </select>

        <select
          value={filters.source}
          onChange={e => setFilters(f => ({ ...f, source: e.target.value }))}
          className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/40 cursor-pointer appearance-none"
        >
          {SOURCES.map(s => <option key={s} value={s}>{s || 'All Sources'}</option>)}
        </select>

        {hasFilters && (
          <button
            onClick={() => setFilters({ search: '', status: '', source: '' })}
            className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition-colors px-2 py-2"
          >
            <X size={12} /> Clear
          </button>
        )}

        <span className="ml-auto text-xs text-slate-600">{total} lead{total !== 1 ? 's' : ''}</span>
      </div>
    </div>
  );
}
