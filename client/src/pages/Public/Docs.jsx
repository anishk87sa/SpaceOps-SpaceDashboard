import React, { useState } from 'react';
import { BookOpen, Terminal, Code, Cpu, Shield, Database, ChevronRight, Search } from 'lucide-react';

export function Docs() {
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    { id: 'getting-started', title: 'Getting Started' },
    { id: 'platform-overview', title: 'Platform Architecture' },
    { id: 'mission-management', title: 'Mission Management' },
    { id: 'satellite-registry', title: 'Satellite Registry & TLE' },
    { id: 'orbital-visualization', title: '3D Orbital Mechanics' },
    { id: 'ground-stations', title: 'Ground Station Tracking' },
    { id: 'telemetry', title: 'Telemetry & Ingestion' },
    { id: 'alerts', title: 'Alerts & Incidents' },
    { id: 'api-reference', title: 'REST API v1 Reference' },
    { id: 'troubleshooting', title: 'Troubleshooting & Offline Mode' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-4 rounded-2xl bg-[#0D1422] border border-[#263449]">
            <span className="text-xs font-mono text-[#38BDF8] uppercase tracking-wider block mb-3 font-semibold">
              Documentation Hub
            </span>
            <div className="space-y-1 font-mono text-xs">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                    activeSection === sec.id
                      ? 'bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 font-semibold'
                      : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#111C2E]'
                  }`}
                >
                  <span className="truncate">{sec.title}</span>
                  {activeSection === sec.id && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-9 p-8 rounded-3xl glass-panel border border-[#263449] space-y-8">
          {activeSection === 'getting-started' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-display font-bold text-white">Getting Started with SpaceOps</h2>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Welcome to SpaceOps, a flight operations platform engineered for real-time satellite intelligence,
                ground pass scheduling, and orbital trajectory awareness.
              </p>

              <h3 className="text-lg font-display font-semibold text-white pt-4">1. Authentication & Session Setup</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                SpaceOps uses JSON Web Token (JWT) authorization. Pre-configured flight director and operator accounts
                are enabled for local evaluation:
              </p>
              <div className="p-4 rounded-xl bg-[#070B14] border border-[#263449] font-mono text-xs space-y-2 text-slate-300">
                <p><span className="text-[#38BDF8]">Administrator:</span> admin@spaceops.org / spaceops2026</p>
                <p><span className="text-[#38BDF8]">Operations Manager:</span> operator@spaceops.org / spaceops2026</p>
                <p><span className="text-[#38BDF8]">Payload Analyst:</span> analyst@spaceops.org / spaceops2026</p>
              </div>

              <h3 className="text-lg font-display font-semibold text-white pt-4">2. Unified Local Execution</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                From the repository root, start both the Express backend API and the Vite frontend:
              </p>
              <pre className="p-4 rounded-xl bg-[#070B14] border border-[#263449] font-mono text-xs text-[#38BDF8] overflow-x-auto">
                npm run dev
              </pre>
            </div>
          )}

          {activeSection === 'api-reference' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-display font-bold text-white">REST API v1 Reference</h2>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                All endpoints reside under <code className="text-[#38BDF8] font-mono">/api/v1/</code> and return standardized JSON envelopes.
              </p>

              <div className="space-y-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-[#070B14] border border-[#263449] space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold">GET</span>
                    <span className="text-white">/api/v1/dashboard</span>
                  </div>
                  <p className="text-[#94A3B8]">Returns fleet metrics, upcoming ground passes, active alerts, and recent events.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#070B14] border border-[#263449] space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold">GET</span>
                    <span className="text-white">/api/v1/satellites</span>
                  </div>
                  <p className="text-[#94A3B8]">Queries satellite records with optional filters for orbitType and status.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#070B14] border border-[#263449] space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-sky-950 text-[#38BDF8] font-bold">POST</span>
                    <span className="text-white">/api/v1/missions</span>
                  </div>
                  <p className="text-[#94A3B8]">Creates a new spaceflight mission plan with milestones and allocated satellite IDs.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#070B14] border border-[#263449] space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 font-bold">PATCH</span>
                    <span className="text-white">/api/v1/alerts/:id/acknowledge</span>
                  </div>
                  <p className="text-[#94A3B8]">Records operator acknowledgment for active anomaly alerts.</p>
                </div>
              </div>
            </div>
          )}

          {activeSection !== 'getting-started' && activeSection !== 'api-reference' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-display font-bold text-white capitalize">
                {activeSection.replace('-', ' ')}
              </h2>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Detailed aerospace systems specification, schema architecture, and procedure documentation for {activeSection.replace('-', ' ')}.
              </p>
              <div className="p-6 rounded-2xl bg-[#070B14] border border-[#263449] space-y-3">
                <span className="text-xs font-mono text-[#38BDF8] uppercase">Production Flight Specification</span>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Refer to the full system architecture document in <code className="text-[#38BDF8] font-mono">docs/ARCHITECTURE.md</code> and the live API specification in <code className="text-[#38BDF8] font-mono">docs/API.md</code>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Docs;
