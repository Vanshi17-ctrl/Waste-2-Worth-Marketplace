import { useState } from 'react';
import { Recycle, Mail, Lock, User as UserIcon, Phone, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';
import { useStore } from '@/store';
import { useRouter } from '@/router';
import { Field } from '@/components/Field';
import { toast } from '@/components/Toast';

export function LoginPage() {
  const { register, login, loginDemo } = useStore();
  const { navigate } = useRouter();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // login state
  const [lEmail, setLEmail] = useState('');
  const [lPass, setLPass] = useState('');
  const [lErr, setLErr] = useState<{ email?: string; pass?: string; form?: string }>({});

  // register state
  const [rName, setRName] = useState('');
  const [rEmail, setREmail] = useState('');
  const [rPhone, setRPhone] = useState('');
  const [rPass, setRPass] = useState('');
  const [rErr, setRErr] = useState<{ name?: string; email?: string; phone?: string; pass?: string }>({});

  const doLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const err: typeof lErr = {};
    if (!lEmail.trim()) err.email = 'Enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lEmail)) err.email = 'Enter a valid email.';
    if (!lPass) err.pass = 'Enter your password.';
    setLErr(err);
    if (Object.keys(err).length) return;
    const res = login(lEmail, lPass);
    if (res.ok) { toast('success', 'Welcome back!'); navigate({ name: 'dashboard' }); }
    else { setLErr({ form: res.error }); toast('error', res.error ?? 'Login failed'); }
  };

  const doRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const err: typeof rErr = {};
    if (!rName.trim()) err.name = 'Full name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rEmail)) err.email = 'Enter a valid email.';
    if (!/^\d{10}$/.test(rPhone.replace(/\D/g, ''))) err.phone = 'Enter a valid 10-digit phone number.';
    if (rPass.length < 6) err.pass = 'Password must be at least 6 characters.';
    setRErr(err);
    if (Object.keys(err).length) return;
    const res = register({ fullName: rName.trim(), email: rEmail.trim(), phone: rPhone.trim(), password: rPass });
    if (res.ok) { toast('success', 'Account created!'); navigate({ name: 'dashboard' }); }
    else { setRErr({ email: res.error }); toast('error', res.error ?? 'Registration failed'); }
  };

  const demo = () => { loginDemo(); toast('info', 'Logged in as demo user.'); navigate({ name: 'dashboard' }); };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand side */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-brand p-12 text-white lg:flex">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-brand-900">
            <Recycle className="h-7 w-7" />
          </div>
          <div>
            <p className="font-display text-2xl font-bold">Waste 2 Worth</p>
            <p className="text-sm text-brand-200">Your Unwanted. Someone's Wanted.</p>
          </div>
        </div>
        <div className="relative z-10 space-y-6">
          <h1 className="font-display text-4xl font-bold leading-tight">
            Give pre-loved things<br />a second life.
          </h1>
          <p className="max-w-md text-brand-100">
            Buy used products, sell unwanted items, or give them away for free. Across clothes, books, electronics, toys, furniture and more.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[['Buy','Pre-loved bargains'],['Sell','Turn clutter to cash'],['Give Free','Help a neighbour'],['Track','Simulated orders']].map(([t,d]) => (
              <div key={t} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="font-semibold text-accent">{t}</p>
                <p className="text-xs text-brand-200">{d}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-xs text-brand-300">Demo mode — no real payments, no real courier. Built for showcasing the flow.</p>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center bg-brand-50 p-6">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-brand-900">
              <Recycle className="h-7 w-7" />
            </div>
            <div>
              <p className="font-display text-xl font-bold text-brand-900">Waste 2 Worth</p>
              <p className="text-xs text-brand-500">Your Unwanted. Someone's Wanted.</p>
            </div>
          </div>

          <div className="card p-6 animate-fadeIn sm:p-8">
            <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-brand-50 p-1">
              {(['login','register'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`rounded-lg py-2 text-sm font-semibold capitalize transition ${tab === t ? 'bg-white text-brand-900 shadow-sm' : 'text-brand-500'}`}
                >
                  {t === 'login' ? 'Login' : 'Register'}
                </button>
              ))}
            </div>

            {tab === 'login' ? (
              <form onSubmit={doLogin} className="space-y-4">
                <Field id="lemail" label="Email" type="email" value={lEmail} onChange={(v) => { setLEmail(v); setLErr((e) => ({ ...e, email: undefined, form: undefined })); }} placeholder="you@example.com" error={lErr.email} required autoComplete="email" />
                <Field id="lpass" label="Password" type="password" value={lPass} onChange={(v) => { setLPass(v); setLErr((e) => ({ ...e, pass: undefined, form: undefined })); }} placeholder="••••••••" error={lErr.pass} required autoComplete="current-password" />
                {lErr.form && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{lErr.form}</p>}
                <button type="submit" className="btn-brand w-full">Login</button>
                <button type="button" onClick={demo} className="btn-outline w-full">
                  <Sparkles className="h-4 w-4 text-accent" /> Continue with Demo Login
                </button>
              </form>
            ) : (
              <form onSubmit={doRegister} className="space-y-4">
                <Field id="rname" label="Full name" value={rName} onChange={(v) => { setRName(v); setRErr((e) => ({ ...e, name: undefined })); }} placeholder="Your full name" error={rErr.name} required autoComplete="name" />
                <Field id="remail" label="Email" type="email" value={rEmail} onChange={(v) => { setREmail(v); setRErr((e) => ({ ...e, email: undefined })); }} placeholder="you@example.com" error={rErr.email} required autoComplete="email" />
                <Field id="rphone" label="Phone number" type="tel" value={rPhone} onChange={(v) => { setRPhone(v); setRErr((e) => ({ ...e, phone: undefined })); }} placeholder="10-digit mobile number" error={rErr.phone} required autoComplete="tel" maxLength={10} />
                <Field id="rpass" label="Password" type="password" value={rPass} onChange={(v) => { setRPass(v); setRErr((e) => ({ ...e, pass: undefined })); }} placeholder="At least 6 characters" error={rErr.pass} required autoComplete="new-password" hint="Use 6+ characters. Demo only — do not reuse real passwords." />
                <button type="submit" className="btn-brand w-full">Create Account</button>
              </form>
            )}
          </div>

          <div className="demo-notice mt-4 flex items-start gap-2">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
            <p><strong>Demo authentication.</strong> Accounts are stored locally in your browser only. This is not production-grade security — do not use real credentials.</p>
          </div>

          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-brand-400">
            <Mail className="h-3.5 w-3.5" /> demo@w2w.in <span className="text-brand-300">•</span> <Lock className="h-3.5 w-3.5" /> demo123
          </p>
        </div>
      </div>
    </div>
  );
}
