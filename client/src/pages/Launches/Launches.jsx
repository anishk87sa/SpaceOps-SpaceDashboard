import React from 'react';
import { Rocket } from 'lucide-react';

export function Launches() {
  return (
    <div className="glass-panel rounded-2xl p-8 border border-slate-800 text-center max-w-xl mx-auto my-12">
      <div className="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-800/40 mx-auto flex items-center justify-center mb-4">
        <Rocket className="w-6 h-6 text-cyan-400" />
      </div>
      <h2 className="text-xl font-display font-bold text-white mb-2">Launch Telemetry Schedule</h2>
      <p className="text-sm text-slate-400 font-mono mb-4">
        Module initialized. Live countdowns and launch manifest feeds are scheduled for Milestone 2.
      </p>
      <span className="inline-block px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-cyan-400 font-mono">
        Status: Foundation Ready
      </span>
    </div>
  );
}
