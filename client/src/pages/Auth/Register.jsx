import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket, User, Mail, Lock, Building, ArrowRight, AlertCircle, CheckCircle2, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Register() {
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [isExistingAccount, setIsExistingAccount] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState('');
  const [resendErr, setResendErr] = useState('');

  const { register, loginWithGoogle, resendVerificationEmail, isConfigured } = useAuth();
  const navigate = useNavigate();

  const handleResend = async () => {
    setResendErr('');
    setResendMsg('');
    setResendLoading(true);
    try {
      const res = await resendVerificationEmail(email);
      setResendMsg(res.message || 'Verification email resent successfully.');
    } catch (err) {
      setResendErr(err.message || 'Failed to resend email. Please check your Supabase rate limit (max 3/hour on default tier).');
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!displayName || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please provide a valid email address (e.g. explorer@example.com).');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password confirmation.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const result = await register({
        email,
        password,
        displayName,
        username,
        affiliation,
      });

      if (result.needsEmailVerification) {
        setIsExistingAccount(Boolean(result.isExistingUser));
        setEmailVerificationSent(true);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      let rawMsg = typeof err === 'string' ? err : err?.message || 'Registration failed. Please try again.';
      if (rawMsg.includes('[object Object]')) {
        rawMsg = 'An unexpected formatting error occurred during registration. Please check your inputs and try again.';
      }
      setError(rawMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message || 'Google sign-up failed.');
    }
  };

  // If email confirmation required state
  if (emailVerificationSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#070B14] text-[#F1F5F9]">
        <div className="w-full max-w-md space-y-6 glass-panel p-8 sm:p-10 rounded-3xl border border-[#263449] text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center glow-cyan shadow-xl">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-display font-bold text-white">Check Your Inbox</h2>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">
              We dispatched a verification link to <span className="text-sky-400 font-semibold">{email}</span>.
            </p>
          </div>

          {isExistingAccount && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-300 text-left space-y-1">
              <p className="font-semibold flex items-center space-x-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Existing Account Detected</span>
              </p>
              <p className="text-[11px] text-amber-200/80">
                An account with this email was previously created in Supabase. To prevent spam, Supabase does not resend verification automatically on new sign-up attempts. Use the <strong>Resend</strong> button below to dispatch a fresh verification link.
              </p>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-[#111C2E] border border-[#263449] text-xs font-mono text-slate-400 text-left space-y-2.5">
            <p className="text-white font-semibold flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Next Steps:</span>
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
              <li>Open your email inbox for <strong>{email}</strong>.</li>
              <li>Click the confirmation link to activate your account.</li>
              <li>Sign in and begin customizing your space exploration bookmarks!</li>
            </ol>
          </div>

          {/* Not getting the email troubleshooting card */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-left space-y-2 text-[11px] font-mono text-slate-400">
            <p className="text-slate-300 font-semibold flex items-center space-x-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Not receiving the email? Common reasons:</span>
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Check your <strong>Spam, Junk, or Promotions</strong> folder (emails come from <code>noreply@mail.app.supabase.io</code>).</li>
              <li>Supabase built-in default email service has a limit of <strong>3 emails per hour</strong>.</li>
              <li>In Supabase Dashboard, ensure <strong>"Confirm email"</strong> is enabled under <em>Authentication &gt; Providers &gt; Email</em>.</li>
            </ul>

            {resendMsg && (
              <div className="mt-2 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                {resendMsg}
              </div>
            )}

            {resendErr && (
              <div className="mt-2 p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300">
                {resendErr}
              </div>
            )}

            <div className="pt-1">
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold font-mono flex items-center justify-center space-x-2 border border-slate-700 transition cursor-pointer disabled:opacity-50"
              >
                <span>{resendLoading ? 'Sending...' : 'Resend Verification Email'}</span>
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setEmailVerificationSent(false)}
              className="text-xs font-mono text-slate-400 hover:text-white transition"
            >
              ← Edit Email
            </button>
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider transition-all"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#070B14] text-[#F1F5F9]">
      <div className="w-full max-w-lg space-y-6 glass-panel p-8 sm:p-10 rounded-3xl border border-[#263449]">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2 mb-1 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center glow-cyan shadow-md">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-wider text-white">SPACEOPS</span>
          </Link>
          <h2 className="text-2xl font-display font-bold text-white">Create Explorer Account</h2>
          <p className="text-xs text-slate-400 font-mono">
            Register to save missions, track rocket launches, and personalize discovery alerts.
          </p>
        </div>

        {!isConfigured && (
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-1 font-mono">
            <div className="flex items-center space-x-2 font-semibold">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Supabase Not Configured in client/.env</span>
            </div>
            <p className="text-[11px] text-amber-200/80 leading-relaxed">
              <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> are still using placeholder values. Registrations will use local mock storage and <strong>cannot send verification emails</strong> until your Supabase project keys are added to <code>client/.env</code>.
            </p>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-center space-x-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Google OAuth Quick Button */}
        <div>
          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="w-full py-2.5 px-4 rounded-xl bg-[#111C2E] hover:bg-[#162338] border border-[#263449] hover:border-slate-500 text-xs font-mono text-slate-200 hover:text-white flex items-center justify-center space-x-3 transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign up with Google</span>
          </button>

          <div className="flex items-center my-4 space-x-3">
            <div className="flex-1 h-px bg-[#263449]" />
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">or sign up with email</span>
            <div className="flex-1 h-px bg-[#263449]" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Display Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Alex Mercer"
                  className="w-full bg-[#111C2E] border border-[#263449] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Username (Optional)</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="alex_m"
                className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full bg-[#111C2E] border border-[#263449] rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Password (min 6) *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#111C2E] border border-[#263449] rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Confirm Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#111C2E] border border-[#263449] rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Affiliation / Club / Title (Optional)</label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value)}
                placeholder="e.g. Amateur Astronomer / High School Science / Student"
                className="w-full bg-[#111C2E] border border-[#263449] rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'Registering with Supabase...' : 'Create Explorer Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs font-mono text-slate-400">
          <span>Already have an account? </span>
          <Link to="/login" className="text-sky-400 hover:underline font-semibold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
