import React, { useState } from 'react';
import { Trash2, ChevronDown, Phone, Clock } from 'lucide-react';
import { StatusBadge, SourceBadge } from './Badges';

const STATUSES = ['New', 'Interested', 'Not Interested', 'Converted'];

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function LeadCard({ lead, onUpdateStatus, onDelete }) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleDelete = () => {
    if (confirming) { onDelete(lead.id); setConfirming(false); }
    else { setConfirming(true); setTimeout(() => setConfirming(false), 3000); }
  };

  const initials = lead.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const avatarColors = [
    'from-indigo-500 to-blue-600',
    'from-violet-500 to-purple-600',
    'from-emerald-500 to-teal-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-cyan-500 to-sky-600',
  ];
  const avatarColor = avatarColors[lead.id % avatarColors.length];

  return (
    <div className="group bg-white/[0.03] hover:bg-white/[0.055] border border-white/[0.07] hover:border-white/[0.12] rounded-2xl p-4 transition-all duration-300 animate-fade-in">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white text-sm font-bold font-display shadow-lg`}>
          {initials}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-white truncate">{lead.name}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Phone size={11} className="text-slate-500 flex-shrink-0" />
                <span className="text-xs text-slate-400 font-mono">{lead.phone}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={handleDelete}
                className={`p-1.5 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100
                  ${confirming ? 'bg-rose-500/20 text-rose-400' : 'hover:bg-white/10 text-slate-500 hover:text-rose-400'}`}
                title={confirming ? 'Click again to confirm' : 'Delete lead'}
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <StatusBadge status={lead.status} />
            <SourceBadge source={lead.source} />
          </div>

          {/* Notes */}
          {lead.notes && (
            <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{lead.notes}</p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.05]">
            <div className="flex items-center gap-1 text-slate-600">
              <Clock size={10} />
              <span className="text-xs">{timeAgo(lead.created_at)}</span>
            </div>

            {/* Status selector */}
            <div className="relative">
              <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 transition-all"
              >
                Change status <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
              </button>
              {open && (
                <div className="absolute right-0 bottom-full mb-1 z-20 w-44 bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-scale-in">
                  {STATUSES.map(s => (
                    <button
                      key={s}
                      onClick={() => { onUpdateStatus(lead.id, s); setOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-xs transition-colors hover:bg-white/10
                        ${lead.status === s ? 'text-[#818cf8] bg-[#6366f1]/10' : 'text-slate-300'}`}
                    >
                      {lead.status === s && <span className="mr-1">✓</span>}
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
