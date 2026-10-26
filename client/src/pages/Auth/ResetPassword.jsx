import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../../services/supabase/supabaseClient';

export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasValidSession, setHasValidSession] = useState(true);

  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  // Validate that an active session or recovery token is present
  useEffect(() => {
    async function checkSession() {
      if (isSupabaseConfigured) {
        const { data: { session } } = await supabase.auth.getSession();
        // In Supabase, clicking the reset link injects access token and creates recovery session
        if (!session && !window.location.hash.includes('access_token')) {
          setHasValidSession(false);
          setError('No active password recovery session detected. Please request a new password reset link.');
        }
      }
    }
    checkSession();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError('Please enter and confirm your new password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please ensure both fields are identical.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await resetPassword(password);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to update your password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#070B14] text-[#F1F5F9]">
      <div className="w-full max-w-md space-y-6 glass-panel p-8 sm:p-10 rounded-3xl border border-[#263449]">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2 mb-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-purple-600 flex items-center justify-center glow-cyan shadow-lg">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg tracking-wider text-white">SPACEOPS</span>
          </Link>
          <h2 className="text-2xl font-display font-bold text-white">Reset Your Password</h2>
          <p className="text-xs text-slate-400 font-mono">
            Enter a secure new password for your SpaceOps account.
          </p>
        </div>

        {!hasValidSession ? (
          <div className="p-5 rounded-2xl bg-[#111C2E] border border-amber-500/40 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-white">Recovery Link Expired or Invalid</h3>
              <p className="text-xs text-slate-300">
                No active password recovery session was detected. Reset tokens expire after 60 minutes or upon single use.
              </p>
            </div>
            <Link
              to="/forgot-password"
              className="w-full py-2.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Request New Reset Link</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="pt-2">
              <Link to="/login" className="text-xs text-slate-400 hover:text-white font-mono">
                ← Return to Sign In
              </Link>
            </div>
          </div>
        ) : success ? (
          <div className="p-5 rounded-2xl bg-[#111C2E] border border-emerald-500/40 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-white">Password Updated</h3>
              <p className="text-xs text-slate-300">
                Your new password has been verified and saved to your account.
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-2.5 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Continue to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">New Password (min 6 characters)</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#111C2E] border border-[#263449] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 font-mono"
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

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Confirm New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#111C2E] border border-[#263449] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Updating Credentials...' : 'Set New Password'}
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="text-xs text-slate-400 hover:text-white font-mono">
                Cancel and return to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
