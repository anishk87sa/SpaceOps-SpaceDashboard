import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Mail, ArrowLeft, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your registered account email.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Error dispatching password recovery instructions.');
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
          <h2 className="text-2xl font-display font-bold text-white">Account Recovery</h2>
          <p className="text-xs text-slate-400 font-mono">
            Receive a secure link to reset your account password.
          </p>
        </div>

        {submitted ? (
          <div className="p-5 rounded-2xl bg-[#111C2E] border border-emerald-500/40 text-xs text-slate-300 space-y-4">
            <div className="flex items-center space-x-2.5 text-emerald-400 font-semibold text-sm">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Recovery Link Dispatched</span>
            </div>
            <p className="leading-relaxed">
              If an account is associated with <span className="text-white font-mono">{email}</span>, a secure recovery email has been sent.
            </p>
            <div className="p-3 rounded-xl bg-[#070B14] border border-[#263449] space-y-1.5 text-[11px] font-mono text-slate-400">
              <p className="text-sky-400 font-semibold flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Security Notice:</span>
              </p>
              <p>Check your spam folder if you do not receive the link within 2 minutes. The reset link expires in 60 minutes.</p>
            </div>
            <div className="pt-2">
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 text-sky-400 hover:underline font-mono text-xs font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Sign In</span>
              </Link>
            </div>
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
              <label className="block text-xs font-mono text-slate-400 mb-1">Account Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="explorer@example.com"
                  className="w-full bg-[#111C2E] border border-[#263449] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Dispatching Recovery Email...' : 'Send Recovery Link'}
            </button>

            <div className="text-center pt-2">
              <Link to="/login" className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white font-mono">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
