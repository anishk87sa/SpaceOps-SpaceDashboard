import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Bookmark, Sparkles, X, ArrowRight, ShieldCheck } from 'lucide-react';

export function AuthPromptModal({ isOpen, onClose, entityName = 'this item', entityType = 'item' }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md rounded-3xl bg-[#0D1422] border border-[#263449] p-6 sm:p-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow backdrop decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#162338] transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative z-10 space-y-6">
          {/* Header Icon */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center glow-cyan shadow-lg">
              <Bookmark className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 text-[10px] font-mono uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>Personal Collection</span>
              </div>
              <h3 className="text-lg font-display font-bold text-white mt-0.5">
                Save to Favorites
              </h3>
            </div>
          </div>

          {/* Body Text */}
          <div className="space-y-2 text-xs leading-relaxed text-slate-300">
            <p>
              Sign in with your SpaceOps account to add <span className="font-semibold text-white">"{entityName}"</span> to your personal cloud-synced space collection.
            </p>
            <p className="text-slate-400 font-light">
              Create a free Explorer profile to bookmark rocket launches, monitor active spacecraft trajectories, and customize celestial observation alerts.
            </p>
          </div>

          {/* Value Highlights */}
          <div className="p-3.5 rounded-2xl bg-[#111C2E] border border-[#263449] space-y-2 text-[11px] font-mono text-slate-300">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>Multi-device cloud synchronization</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Custom launch countdown tracking</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => {
                onClose();
                navigate('/login');
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-300 hover:to-indigo-400 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider transition-all shadow-md flex items-center justify-center space-x-2 cursor-pointer glow-cyan"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                onClose();
                navigate('/register');
              }}
              className="w-full py-2.5 rounded-xl bg-[#111C2E] hover:bg-[#162338] border border-[#263449] text-xs font-mono text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              Create Free Account
            </button>

            <button
              onClick={onClose}
              className="w-full py-1.5 text-center text-[11px] font-mono text-slate-500 hover:text-slate-300 transition-colors"
            >
              Continue Browsing as Guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPromptModal;
