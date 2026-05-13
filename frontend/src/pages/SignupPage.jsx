import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

function PasswordStrength({ password }) {
  const score = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', '#f87171', '#fb923c', '#facc15', '#34d399'];

  if (!password) return null;
  return (
    <div className="lf-strength">
      <div className="lf-strength-bars">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="lf-strength-bar"
            style={{ background: i <= score ? colors[score] : 'rgba(255,255,255,0.08)' }} />
        ))}
      </div>
      <span className="lf-strength-lbl" style={{ color: colors[score] }}>{labels[score]}</span>
    </div>
  );
}

const perks = [
  'Free forever for small teams',
  'Unlimited lead tracking',
  'Real-time analytics dashboard',
];

export default function SignupPage({ onSwitch }) {
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
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
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      toast.success('Account created! Welcome to LeadFlow 🎉');
    } catch (err) {
      const msg = err.response?.data?.error || 'Signup failed. Please try again.';
      toast.error(msg);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lf-auth-root">
      <div className="lf-orb lf-orb-1" />
      <div className="lf-orb lf-orb-2" />
      <div className="lf-orb lf-orb-3" />

      <div className="lf-auth-grid">
        {/* ── LEFT PANEL ── */}
        <div className="lf-left-panel">
          <div className="lf-brand">
            <div className="lf-brand-icon"><TrendingUp size={22} /></div>
            <div>
              <div className="lf-brand-name">LeadFlow</div>
              <div className="lf-brand-sub">CRM Platform</div>
            </div>
          </div>

          <div className="lf-hero-text">
            <div className="lf-badge">✦ No credit card required</div>
            <h1 className="lf-hero-h1">
              Start closing<br />
              <span className="lf-gradient-text">deals faster.</span>
            </h1>
            <p className="lf-hero-p">
              Join thousands of sales teams who manage leads smarter with LeadFlow.
            </p>
          </div>

          {/* Perks list */}
          <div className="lf-perks">
            {perks.map(p => (
              <div key={p} className="lf-perk-row">
                <CheckCircle2 size={16} className="lf-perk-icon" />
                <span>{p}</span>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="lf-stats-row">
            {[
              { val: '2,400+', lbl: 'Teams' },
              { val: '1.2M', lbl: 'Leads Tracked' },
              { val: '99.9%', lbl: 'Uptime' },
            ].map(s => (
              <div key={s.lbl} className="lf-stat-item">
                <div className="lf-stat-val">{s.val}</div>
                <div className="lf-stat-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>

          <div className="lf-left-bottom-line" />
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="lf-right-panel">
          <div className={`lf-form-card ${shake ? 'lf-shake' : ''}`}>
            <div className="lf-form-header">
              <h2 className="lf-form-title">Create your account</h2>
              <p className="lf-form-sub">Free to start, upgrade anytime</p>
            </div>

            <form onSubmit={handleSubmit} className="lf-form-body" noValidate>
              {/* Name */}
              <div className="lf-field">
                <label className="lf-label">Full name</label>
                <div className={`lf-input-wrap ${errors.name ? 'lf-input-err' : ''}`}>
                  <User size={15} className="lf-input-icon" />
                  <input type="text" name="name" value={form.name} onChange={handleChange}
                    placeholder="Your full name" className="lf-input" autoComplete="name" />
                </div>
                {errors.name && <span className="lf-err-msg">{errors.name}</span>}
              </div>

              {/* Email */}
              <div className="lf-field">
                <label className="lf-label">Email address</label>
                <div className={`lf-input-wrap ${errors.email ? 'lf-input-err' : ''}`}>
                  <Mail size={15} className="lf-input-icon" />
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="you@company.com" className="lf-input" autoComplete="email" />
                </div>
                {errors.email && <span className="lf-err-msg">{errors.email}</span>}
              </div>

              {/* Password */}
              <div className="lf-field">
                <label className="lf-label">Password</label>
                <div className={`lf-input-wrap ${errors.password ? 'lf-input-err' : ''}`}>
                  <Lock size={15} className="lf-input-icon" />
                  <input type={showPass ? 'text' : 'password'} name="password"
                    value={form.password} onChange={handleChange}
                    placeholder="Min. 6 characters" className="lf-input" autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPass(v => !v)} className="lf-eye-btn">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && <span className="lf-err-msg">{errors.password}</span>}
                <PasswordStrength password={form.password} />
              </div>

              {/* Confirm */}
              <div className="lf-field">
                <label className="lf-label">Confirm password</label>
                <div className={`lf-input-wrap ${errors.confirm ? 'lf-input-err' : ''}`}>
                  <Lock size={15} className="lf-input-icon" />
                  <input type={showPass ? 'text' : 'password'} name="confirm"
                    value={form.confirm} onChange={handleChange}
                    placeholder="Repeat your password" className="lf-input" autoComplete="new-password" />
                </div>
                {errors.confirm && <span className="lf-err-msg">{errors.confirm}</span>}
              </div>

              <button type="submit" disabled={loading} className="lf-submit-btn">
                {loading ? <span className="lf-spinner" /> : <>Create account <ArrowRight size={16} /></>}
              </button>
            </form>

            <div className="lf-switch-row">
              Already have an account?{' '}
              <button onClick={onSwitch} className="lf-switch-btn">Sign in</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
