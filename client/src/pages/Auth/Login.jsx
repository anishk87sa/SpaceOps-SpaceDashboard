import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Rocket, Sparkles, Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState('');
  const [resendError, setResendError] = useState('');

  const { login, loginWithGoogle, demoLogin, resendVerificationEmail, isConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  const handleResendUnconfirmed = async () => {
    if (!email) {
      setResendError('Please enter your email address in the field above.');
      return;
    }
    setResendError('');
    setResendSuccess('');
    setResendLoading(true);
    try {
      const res = await resendVerificationEmail(email);
      setResendSuccess(res.message || 'Verification email dispatched. Please check your inbox and spam folder.');
    } catch (err) {
      setResendError(err.message || 'Failed to dispatch verification email. Supabase free projects have a limit of 3 emails/hour.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your email address and password.');
      return;
    }

    setError('');
    setResendSuccess('');
    setResendError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      let rawMsg = typeof err === 'string' ? err : err?.message || 'Authentication failed. Please check your credentials.';
      if (rawMsg.includes('[object Object]')) {
        rawMsg = 'An unexpected formatting error occurred during authentication. Please try again.';
      }
      setError(rawMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      // Supabase OAuth redirects automatically to provider
    } catch (err) {
      setError(err.message || 'Google sign-in could not be initiated.');
      setGoogleLoading(false);
    }
  };

  const handleQuickDemo = async (role) => {
    setError('');
    setLoading(true);
    try {
      await demoLogin(role);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Demo session initialisation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#070B14] text-[#F1F5F9]">
      {/* Left Column: Space Exploration Community Hero */}
      <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-[#0D1422] to-[#070B14] border-r border-[#263449] p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600 flex items-center justify-center glow-cyan shadow-lg">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl tracking-wider text-white">SPACEOPS</span>
        </div>

        <div className="space-y-6 relative z-10 max-w-lg">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#111C2E] border border-sky-500/30 text-sky-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>COMMUNITY SPACE EXPLORER ACCOUNT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-wide leading-tight">
            Your Personal Space Exploration Hub
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed font-light">
            Sign in to save your favorite missions, bookmark upcoming rocket launches, follow deep-space probes, and customize your celestial observation alerts.
          </p>

          <div className="p-4 rounded-2xl bg-[#111C2E]/80 border border-[#263449] text-xs font-mono space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-sky-400 font-bold block">Instant Evaluation Profiles:</span>
              <span className="text-[10px] text-slate-500">Quick Testing</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('Space Science Curator')}
                className="px-2.5 py-1 rounded-lg bg-[#070B14] border border-sky-500/40 text-cyan-300 hover:bg-sky-500/20 transition-colors cursor-pointer text-[11px]"
              >
                Lead Space Science Curator
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('Astronomy Observer')}
                className="px-2.5 py-1 rounded-lg bg-[#070B14] border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/20 transition-colors cursor-pointer text-[11px]"
              >
                Astronomy Observer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('Student Researcher')}
                className="px-2.5 py-1 rounded-lg bg-[#070B14] border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20 transition-colors cursor-pointer text-[11px]"
              >
                Student Researcher
              </button>
            </div>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-500 flex items-center justify-between">
          <span>Open Public Space Intelligence</span>
          <span>Powered by Supabase Auth</span>
        </div>
      </div>

      {/* Right Column: Sign In Form */}
      <div className="lg:col-span-6 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-7">
          <div>
            <div className="flex items-center space-x-2.5 lg:hidden mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-400 to-indigo-500 flex items-center justify-center glow-cyan">
                <Rocket className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white">SPACEOPS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Sign In to SpaceOps
            </h2>
            <p className="mt-2 text-xs font-mono text-slate-400">
              Access your personal space exploration bookmarks and preferences.
            </p>
          </div>

          {!isConfigured && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 space-y-1 font-mono">
              <div className="flex items-center space-x-2 font-semibold">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Supabase Placeholder Credentials in client/.env</span>
              </div>
              <p className="text-[11px] text-amber-200/80 leading-relaxed">
                <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> are not filled in. Supabase cloud accounts and verification emails are unavailable until credentials are set.
              </p>
            </div>
          )}

          {error && (
            <div className="space-y-2">
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-center space-x-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>

              {error.toLowerCase().includes('email not confirmed') && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-200 space-y-2.5">
                  <p className="font-semibold text-amber-300 flex items-center space-x-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>Email Verification Required</span>
                  </p>
                  <p className="text-[11px] text-amber-200/80 leading-relaxed">
                    Your Supabase account requires email confirmation before you can sign in. Check your inbox and spam folder for the activation link.
                  </p>

                  {resendSuccess && (
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px]">
                      {resendSuccess}
                    </div>
                  )}

                  {resendError && (
                    <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px]">
                      {resendError}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleResendUnconfirmed}
                    disabled={resendLoading}
                    className="w-full py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-semibold flex items-center justify-center space-x-2 transition cursor-pointer disabled:opacity-50"
                  >
                    <span>{resendLoading ? 'Sending...' : 'Resend Verification Email'}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Google OAuth Button */}
          <div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#111C2E] hover:bg-[#162338] border border-[#263449] hover:border-slate-500 text-xs font-mono text-slate-200 hover:text-white flex items-center justify-center space-x-3 transition-all cursor-pointer disabled:opacity-50"
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
              <span>{googleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
            </button>

            <div className="flex items-center my-4 space-x-3">
              <div className="flex-1 h-px bg-[#263449]" />
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">or email</span>
              <div className="flex-1 h-px bg-[#263449]" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="explorer@example.com"
                  className="w-full bg-[#111C2E] border border-[#263449] rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400 font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-mono text-slate-400">Password</label>
                <Link to="/forgot-password" className="text-[11px] font-mono text-sky-400 hover:underline">
                  Forgot password?
                </Link>
              </div>
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
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs font-mono text-slate-400">
            <span>Don't have an account? </span>
            <Link to="/register" className="text-sky-400 hover:underline font-semibold">
              Create an Explorer Account
            </Link>
          </div>

          <div className="pt-3 border-t border-[#263449] text-center">
            <Link to="/" className="text-xs font-mono text-slate-500 hover:text-slate-300">
              ← Return to Space Exploration Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
