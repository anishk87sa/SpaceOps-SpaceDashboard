import React from 'react';
import { Satellite, Radio, Compass } from 'lucide-react';

/**
 * Universal Space-Themed Preloader for Orbitron SpaceOps
 * Prevents premature rendering of empty UI or zero counters while fetching data.
 */
export function PagePreloader({
  title = 'Synchronizing SpaceOps Data',
  message = 'Retrieving verified telemetry, orbital parameters, and mission records...',
  minHeight = 'min-h-[55vh]',
  badge = 'TELEMETRY SYNC'
}) {
  return (
    <div className={`w-full flex items-center justify-center p-6 ${minHeight} animate-fade-in`}>
      <div className="relative max-w-md w-full glass-panel rounded-3xl p-8 border border-[#263449] shadow-2xl text-center overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent" />
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-32 bg-sky-500/10 blur-3xl pointer-events-none rounded-full" />

        {/* Center Radar Scanner Reticle */}
        <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          {/* Outer rotating dashed ring */}
          <div className="absolute inset-0 rounded-full border border-dashed border-sky-400/40 animate-spin" style={{ animationDuration: '12s' }} />

          {/* Middle pulsing ring */}
          <div className="absolute inset-2 rounded-full border border-sky-500/30 animate-ping opacity-25" style={{ animationDuration: '3s' }} />

          {/* Inner radar sweeping gradient circle */}
          <div className="absolute inset-3 rounded-full bg-gradient-to-tr from-sky-500/20 via-indigo-500/10 to-transparent border border-sky-400/30 flex items-center justify-center animate-radar-sweep">
            <div className="w-full h-full rounded-full border-t-2 border-sky-400/80" />
          </div>

          {/* Central Satellite Core */}
          <div className="relative z-10 w-10 h-10 rounded-xl bg-[#0D1422] border border-sky-400/50 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <Satellite className="w-5 h-5 text-sky-400 animate-pulse" />
          </div>
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-[10px] font-mono text-sky-400 uppercase tracking-widest mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
          <span>{badge}</span>
        </div>

        {/* Heading */}
        <h3 className="text-lg font-bold font-display text-white tracking-wide mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-300 font-mono leading-relaxed max-w-sm mx-auto mb-6 font-light">
          {message}
        </p>

        {/* Cyber Scanning Progress Beam */}
        <div className="w-full bg-[#0D1422] h-1.5 rounded-full overflow-hidden border border-[#263449] relative">
          <div className="h-full bg-gradient-to-r from-transparent via-sky-400 to-indigo-500 w-1/2 rounded-full animate-beam-slide" />
        </div>

        {/* Operational Footer Details */}
        <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-slate-300 px-1">
          <span className="flex items-center space-x-1">
            <Radio className="w-3 h-3 text-sky-400 animate-pulse" />
            <span>DOWNLINK 100%</span>
          </span>
          <span className="text-slate-300">ORBITRON PROTOCOL</span>
        </div>
      </div>
    </div>
  );
}

export default PagePreloader;
