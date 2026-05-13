import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Mail, Lock, Eye, EyeOff, ArrowRight, Zap, Users, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';

const FloatingCard = ({ icon: Icon, label, value, color, style }) => (
  <div style={style} className="lf-float-card">
    <div className={`lf-float-icon ${color}`}><Icon size={14} /></div>
    <div>
      <div className="lf-float-val">{value}</div>
      <div className="lf-float-lbl">{label}</div>
    </div>
  </div>
);

export default function LoginPage({ onSwitch }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(er => ({ ...er, [e.target.name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 👋');
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Please try again.';
      toast.error(msg);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lf-auth-root">
      {/* Ambient orbs */}
      <div className="lf-orb lf-orb-1" />
      <div className="lf-orb lf-orb-2" />
      <div className="lf-orb lf-orb-3" />

      <div className="lf-auth-grid">
        {/* ── LEFT PANEL ── */}
        <div className="lf-left-panel">
          {/* Brand */}
          <div className="lf-brand">
            <div className="lf-brand-icon">
              <TrendingUp size={22} />
            </div>
            <div>
              <div className="lf-brand-name">LeadFlow</div>
              <div className="lf-brand-sub">CRM Platform</div>
            </div>
          </div>

          {/* Hero text */}
          <div className="lf-hero-text">
            <div className="lf-badge">✦ Trusted by 2,400+ sales teams</div>
            <h1 className="lf-hero-h1">
              Turn leads into<br />
              <span className="lf-gradient-text">loyal clients.</span>
            </h1>
            <p className="lf-hero-p">
              The minimal CRM that keeps your pipeline clean and your team focused.
            </p>
          </div>

          {/* Floating preview cards */}
          <div className="lf-preview-area">
            <FloatingCard icon={Users} label="Active Leads" value="1,284" color="lf-ic-blue"
              style={{ top: '10%', left: '5%', animationDelay: '0s' }} />
            <FloatingCard icon={Zap} label="Converted" value="318" color="lf-ic-violet"
              style={{ top: '28%', right: '8%', animationDelay: '0.6s' }} />
            <FloatingCard icon={BarChart3} label="Win Rate" value="74.2%" color="lf-ic-emerald"
              style={{ bottom: '22%', left: '10%', animationDelay: '1.2s' }} />

            {/* Center glass card */}
            <div className="lf-center-card">
              <div className="lf-center-card-header">
                <div className="lf-mini-avatar lf-av-1">RS</div>
                <div className="lf-mini-avatar lf-av-2">PK</div>
                <div className="lf-mini-avatar lf-av-3">AM</div>
                <span className="lf-center-card-lbl">Recent Leads</span>
              </div>
              {[
                { name: 'Ravi Sharma', status: 'Converted', color: '#34d399' },
                { name: 'Priya Kapoor', status: 'Interested', color: '#818cf8' },
                { name: 'Amit Mehta', status: 'New', color: '#fb923c' },
              ].map((l) => (
                <div key={l.name} className="lf-mini-row">
                  <span className="lf-mini-name">{l.name}</span>
                  <span className="lf-mini-status" style={{ color: l.color }}>● {l.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom gradient line */}
          <div className="lf-left-bottom-line" />
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="lf-right-panel">
          <div className={`lf-form-card ${shake ? 'lf-shake' : ''}`}>
            <div className="lf-form-header">
              <h2 className="lf-form-title">Welcome back</h2>
              <p className="lf-form-sub">Sign in to your workspace</p>
            </div>

            <form onSubmit={handleSubmit} className="lf-form-body" noValidate>
              {/* Email */}
              <div className="lf-field">
                <label className="lf-label">Email address</label>
                <div className={`lf-input-wrap ${errors.email ? 'lf-input-err' : ''}`}>
                  <Mail size={15} className="lf-input-icon" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    className="lf-input"
                    autoComplete="email"
                  />
                </div>
                {errors.email && <span className="lf-err-msg">{errors.email}</span>}
              </div>

              {/* Password */}
              <div className="lf-field">
                <div className="lf-label-row">
                  <label className="lf-label">Password</label>
                  <button type="button" className="lf-forgot">Forgot password?</button>
                </div>
                <div className={`lf-input-wrap ${errors.password ? 'lf-input-err' : ''}`}>
                  <Lock size={15} className="lf-input-icon" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="lf-input"
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)} className="lf-eye-btn">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <span className="lf-err-msg">{errors.password}</span>}
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} className="lf-submit-btn">
                {loading ? (
                  <span className="lf-spinner" />
                ) : (
                  <>Sign in <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            <div className="lf-switch-row">
              Don't have an account?{' '}
              <button onClick={onSwitch} className="lf-switch-btn">Create one free</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
