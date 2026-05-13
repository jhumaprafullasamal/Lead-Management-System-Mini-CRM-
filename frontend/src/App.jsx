import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { LayoutDashboard, Users, Plus, X, TrendingUp, LogOut } from 'lucide-react';
import { useLeads } from './hooks/useLeads';
import { useAuth } from './context/AuthContext';
import { Dashboard } from './components/Dashboard';
import { AddLeadForm } from './components/AddLeadForm';
import { LeadCard } from './components/LeadCard';
import { FilterBar } from './components/FilterBar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'leads', label: 'Leads', icon: Users },
];

function SkeletonCard() {
  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 space-y-3">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/[0.06] animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-white/[0.06] rounded-lg w-1/2 animate-pulse" />
          <div className="h-3 bg-white/[0.04] rounded-lg w-1/3 animate-pulse" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-6 bg-white/[0.06] rounded-full w-20 animate-pulse" />
        <div className="h-6 bg-white/[0.04] rounded-full w-16 animate-pulse" />
      </div>
    </div>
  );
}

export default function App() {
  const { isAuthed, user, logout } = useAuth();
  const [authPage, setAuthPage] = useState('login');
  
  // These hooks only fetch data if isAuthed is true (handled inside useLeads)
  const { leads, stats, loading, filters, setFilters, addLead, updateStatus, deleteLead } = useLeads();
  const [tab, setTab] = useState('dashboard');
  const [showForm, setShowForm] = useState(false);

  // ─── AUTHENTICATION GUARD ──────────────────────────────────────────────────
  if (!isAuthed) {
    return (
      <>
        {authPage === 'login' 
          ? <LoginPage onSwitch={() => setAuthPage('signup')} /> 
          : <SignupPage onSwitch={() => setAuthPage('login')} />
        }
        <Toaster position="bottom-right" />
      </>
    );
  }

  // ─── MAIN CRM APP ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#080c14] text-white">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-80 h-80 bg-violet-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-600/6 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 pb-12">
        {/* Header */}
        <header className="lf-app-header">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/15 rounded-xl border border-indigo-500/20">
              <TrendingUp size={20} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-display text-white tracking-tight">LeadFlow</h1>
              <p className="text-xs text-slate-500">Mini CRM System</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="lf-user-chip hidden sm:flex">
              <div className="lf-user-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-white">{user?.name}</div>
                <div className="text-[10px] text-slate-500">{user?.email}</div>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="lf-logout-btn"
              title="Logout"
            >
              <LogOut size={14} />
              <span className="hidden xs:inline">Logout</span>
            </button>

            <button
              onClick={() => setShowForm(v => !v)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg
                ${showForm
                  ? 'bg-white/10 text-slate-300 shadow-none'
                  : 'bg-indigo-500 hover:bg-indigo-400 text-white shadow-indigo-500/25'
                }`}
            >
              {showForm ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Add Lead</>}
            </button>
          </div>
        </header>

        {/* Add Lead Form */}
        {showForm && (
          <div className="mb-6">
            <AddLeadForm onAdd={addLead} onClose={() => setShowForm(false)} />
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/[0.04] border border-white/[0.07] rounded-xl mb-6 w-fit">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${tab === id
                  ? 'bg-white/[0.1] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-300'
                }`}
            >
              <Icon size={15} />
              <span>{label}</span>
              {id === 'leads' && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === id ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-slate-600'}`}>
                  {leads.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {tab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            <Dashboard stats={stats} />

            {/* Recent leads preview */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Recent Leads</p>
                <button onClick={() => setTab('leads')} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  View all →
                </button>
              </div>
              <div className="space-y-2">
                {loading
                  ? [1, 2, 3].map(i => <SkeletonCard key={i} />)
                  : leads.slice(0, 5).map(lead => (
                      <LeadCard key={lead.id} lead={lead} onUpdateStatus={updateStatus} onDelete={deleteLead} />
                    ))
                }
                {!loading && leads.length === 0 && (
                  <div className="text-center py-12 text-slate-600">
                    <Users size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No leads yet. Add your first one!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Leads Tab */}
        {tab === 'leads' && (
          <div className="space-y-4 animate-fade-in">
            <FilterBar filters={filters} setFilters={setFilters} total={leads.length} />

            <div className="space-y-2">
              {loading
                ? [1, 2, 3, 4, 5].map(i => <SkeletonCard key={i} />)
                : leads.map(lead => (
                    <LeadCard key={lead.id} lead={lead} onUpdateStatus={updateStatus} onDelete={deleteLead} />
                  ))
              }
              {!loading && leads.length === 0 && (
                <div className="text-center py-16 text-slate-600">
                  <Users size={36} className="mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium text-slate-500 mb-1">No leads found</p>
                  <p className="text-xs">Try adjusting your filters or add a new lead</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1e2433',
            color: '#e2e8f0',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontSize: '13px',
          },
          success: { iconTheme: { primary: '#34d399', secondary: '#1e2433' } },
          error: { iconTheme: { primary: '#f87171', secondary: '#1e2433' } },
        }}
      />
    </div>
  );
}
