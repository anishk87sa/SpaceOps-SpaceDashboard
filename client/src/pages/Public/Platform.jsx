import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Shield, Database, Cpu, Radio, Activity, CheckCircle2, ArrowRight } from 'lucide-react';

export function Platform() {
  const tiers = [
    {
      title: 'Orbital Dynamics Engine',
      desc: 'Performs precision SGP4 orbit propagation, conjunction screening against Space-Track debris catalogs, and ground track coordinate mapping in real-time.',
      icon: Cpu,
      color: 'text-sky-400',
    },
    {
      title: 'Global Ground Network Layer',
      desc: 'Orchestrates antenna dish scheduling across Svalbard, Goldstone, Madrid, Canberra, Singapore, and Hartebeesthoek with automated frequency allocation.',
      icon: Radio,
      color: 'text-indigo-400',
    },
    {
      title: 'High-Throughput Telemetry Ingestion',
      desc: 'Demuxes frame buffers, calculates real-time subsystem state of health, and triggers automated alerts on thermal, power, and attitude excursions.',
      icon: Activity,
      color: 'text-teal-400',
    },
    {
      title: 'Resilient Dual-Tier Data Store',
      desc: 'Hybrid storage architecture designed with local standalone detached execution and high-performance MongoDB Atlas clustering.',
      icon: Database,
      color: 'text-cyan-400',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      <div className="max-w-3xl">
        <span className="text-xs font-mono uppercase tracking-widest text-[#38BDF8] font-semibold block mb-3">
          Platform Architecture
        </span>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight">
          Engineered for Mission-Critical Aerospace Resilience
        </h1>
        <p className="mt-4 text-base text-[#94A3B8] leading-relaxed">
          SpaceOps decouples flight dynamics computation, telemetry parsing, and user telemetry presentation
          into a scalable, fault-tolerant infrastructure built for modern satellite constellations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {tiers.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.title} className="p-8 rounded-2xl glass-panel border border-[#263449] space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#111C2E] border border-[#263449] flex items-center justify-center">
                <Icon className={`w-6 h-6 ${t.color}`} />
              </div>
              <h3 className="text-xl font-display font-bold text-white">{t.title}</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed">{t.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="p-8 rounded-2xl bg-[#0D1422] border border-[#263449] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h4 className="text-lg font-display font-bold text-white">Ready to inspect live telemetry?</h4>
          <p className="text-xs text-[#94A3B8] mt-1 font-mono">Launch the full authenticated dashboard to evaluate operational telemetry.</p>
        </div>
        <Link
          to="/app/dashboard"
          className="px-5 py-2.5 rounded-xl bg-[#38BDF8] hover:bg-sky-400 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider shrink-0"
        >
          Open Dashboard
        </Link>
      </div>
    </div>
  );
}

export default Platform;
