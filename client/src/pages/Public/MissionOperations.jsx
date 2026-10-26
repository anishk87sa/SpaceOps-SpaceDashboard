import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, CheckCircle2, Radio, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export function MissionOperations() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="max-w-3xl">
        <span className="text-xs font-mono uppercase tracking-widest text-[#38BDF8] font-semibold block mb-3">
          Flight Operations Command
        </span>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight">
          Precision Flight Dynamics & Procedure Execution
        </h1>
        <p className="mt-4 text-base text-[#94A3B8] leading-relaxed">
          Coordinate real-time orbital injection, maneuver execution, automated ground pass sequencing,
          and operator shift handovers with high-reliability flight consoles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl glass-panel border border-[#263449] space-y-4">
          <Clock className="w-8 h-8 text-[#38BDF8]" />
          <h3 className="text-lg font-display font-bold text-white">Timeline Management</h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Dynamic Gantt and chronological pass sequencing keeping all flight controllers synchronized with countdown clocks and LOS warning timers.
          </p>
        </div>

        <div className="p-8 rounded-2xl glass-panel border border-[#263449] space-y-4">
          <Radio className="w-8 h-8 text-[#34D399]" />
          <h3 className="text-lg font-display font-bold text-white">Automated Pass Orchestration</h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Automatic tracking dish pointing vectors generated from high-precision orbit determination models for reliable contact lock-on.
          </p>
        </div>

        <div className="p-8 rounded-2xl glass-panel border border-[#263449] space-y-4">
          <ShieldCheck className="w-8 h-8 text-[#818CF8]" />
          <h3 className="text-lg font-display font-bold text-white">Audit & Governance</h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Immutable operation logs recording procedure steps, parameter overrides, and flight director approvals for mission reviews.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-2xl bg-[#0D1422] border border-[#263449] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-display font-bold text-white">Ready to examine active missions?</h3>
          <p className="text-xs text-[#94A3B8] mt-1 font-mono">Explore Artemis Lunar Relay, Sentinel Biosphere, and Heliosphere projects in the operations console.</p>
        </div>
        <Link
          to="/app/missions"
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-[#38BDF8] hover:bg-sky-400 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider shrink-0"
        >
          <span>Open Missions Registry</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default MissionOperations;
