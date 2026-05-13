import React from 'react';

const STATUS_CONFIG = {
  New:            { bg: 'bg-blue-500/10',   text: 'text-blue-400',   border: 'border-blue-500/20',   dot: 'bg-blue-400' },
  Interested:     { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
  'Not Interested': { bg: 'bg-rose-500/10', text: 'text-rose-400',   border: 'border-rose-500/20',   dot: 'bg-rose-400' },
  Converted:      { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20', dot: 'bg-violet-400' },
};

const SOURCE_CONFIG = {
  Call:      { bg: 'bg-amber-500/10',  text: 'text-amber-400',  border: 'border-amber-500/20'  },
  WhatsApp:  { bg: 'bg-green-500/10',  text: 'text-green-400',  border: 'border-green-500/20'  },
  Field:     { bg: 'bg-cyan-500/10',   text: 'text-cyan-400',   border: 'border-cyan-500/20'   },
};

export function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.New;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

export function SourceBadge({ source }) {
  const cfg = SOURCE_CONFIG[source] || SOURCE_CONFIG.Field;
  const icons = { Call: '📞', WhatsApp: '💬', Field: '🏃' };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <span>{icons[source]}</span>
      {source}
    </span>
  );
}

export { STATUS_CONFIG, SOURCE_CONFIG };
