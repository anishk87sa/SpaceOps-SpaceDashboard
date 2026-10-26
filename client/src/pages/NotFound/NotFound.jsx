import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-800/40 flex items-center justify-center mb-6 glow-cyan">
        <Compass className="w-8 h-8 text-cyan-400 animate-spin-slow" />
      </div>
      <h1 className="text-4xl font-display font-bold text-white tracking-wider mb-2">404</h1>
      <h2 className="text-lg font-mono text-cyan-400 mb-4 uppercase tracking-widest">
        Sector Coordinate Not Found
      </h2>
      <p className="text-sm text-slate-400 max-w-md mb-8">
        The orbital trajectory or resource route you requested does not exist in the SpaceOps registry.
      </p>
      <Link
        to="/"
        className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 font-mono text-xs uppercase tracking-wider transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  );
}
