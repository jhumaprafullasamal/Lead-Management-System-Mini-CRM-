import React from 'react';
import { Users, TrendingUp, ThumbsDown, Sparkles, Phone, MessageCircle, MapPin, Calendar } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="relative group bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] rounded-2xl p-5 transition-all duration-300 overflow-hidden">
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${color.glow}`} />
    <div className="relative">
      <div className={`inline-flex p-2.5 rounded-xl ${color.icon} mb-3`}>
        <Icon size={18} className={color.text} />
      </div>
      <div className={`text-3xl font-display font-bold ${color.value} mb-1`}>{value}</div>
      <div className="text-sm text-slate-400 font-medium">{label}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  </div>
);

export function Dashboard({ stats }) {
  if (!stats) return null;

  const total = parseInt(stats.total) || 0;
  const converted = parseInt(stats.converted) || 0;
  const convRate = total > 0 ? ((converted / total) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-4">
      {/* Main stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={Users}
          label="Total Leads"
          value={total}
          sub={`${stats.this_week} this week`}
          color={{
            icon: 'bg-[#6366f1]/10',
            text: 'text-[#818cf8]',
            value: 'text-white',
            glow: 'bg-gradient-to-br from-[#6366f1]/5 to-transparent',
          }}
        />
        <StatCard
          icon={Sparkles}
          label="Interested"
          value={stats.interested}
          color={{
            icon: 'bg-[#10b981]/10',
            text: 'text-[#34d399]',
            value: 'text-[#34d399]',
            glow: 'bg-gradient-to-br from-[#10b981]/5 to-transparent',
          }}
        />
        <StatCard
          icon={TrendingUp}
          label="Converted"
          value={converted}
          sub={`${convRate}% rate`}
          color={{
            icon: 'bg-[#8b5cf6]/10',
            text: 'text-[#a78bfa]',
            value: 'text-[#a78bfa]',
            glow: 'bg-gradient-to-br from-[#8b5cf6]/5 to-transparent',
          }}
        />
        <StatCard
          icon={ThumbsDown}
          label="Not Interested"
          value={stats.not_interested}
          color={{
            icon: 'bg-[#f43f5e]/10',
            text: 'text-[#fb7185]',
            value: 'text-[#fb7185]',
            glow: 'bg-gradient-to-br from-[#f43f5e]/5 to-transparent',
          }}
        />
      </div>

      {/* Source breakdown */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Lead Sources</p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Phone, label: 'Call', val: stats.from_call, color: 'text-amber-400', bar: 'bg-amber-400' },
            { icon: MessageCircle, label: 'WhatsApp', val: stats.from_whatsapp, color: 'text-green-400', bar: 'bg-green-400' },
            { icon: MapPin, label: 'Field', val: stats.from_field, color: 'text-cyan-400', bar: 'bg-cyan-400' },
          ].map(({ icon: Icon, label, val, color, bar }) => {
            const pct = total > 0 ? (parseInt(val) / total) * 100 : 0;
            return (
              <div key={label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon size={14} className={color} />
                    <span className="text-xs text-slate-400">{label}</span>
                  </div>
                  <span className={`text-sm font-bold ${color}`}>{val}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${bar} transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
