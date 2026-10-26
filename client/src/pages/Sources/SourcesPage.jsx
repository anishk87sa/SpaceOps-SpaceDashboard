import React, { useState, useEffect } from 'react';
import { Database, ExternalLink, ShieldCheck, CheckCircle2, Clock, Info } from 'lucide-react';
import { apiClient } from '../../services/api/client';
import { PagePreloader } from '../../components/common/PagePreloader';

export function SourcesPage() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSources() {
      try {
        const res = await apiClient.getDataSources();
        setSources(res.data);
      } catch (err) {
        console.error('Failed to load data sources:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSources();
  }, []);

  if (loading && sources.length === 0) {
    return (
      <PagePreloader
        title="Verifying Data Sources"
        message="Validating authoritative space telemetry and observatory ingestion channels..."
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-emerald-400 uppercase tracking-wider">
          <Database className="w-4 h-4" />
          <span>Data Integrity & Attribution Policy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
          Data Sources & Verification Policy
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed font-light">
          SpaceOps brings together authoritative data from international space agencies, astronomical observatories, and launch tracking networks. We adhere to rigorous standards of attribution, freshness verification, and scientific honesty.
        </p>
      </div>

      {/* Freshness Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl glass-panel border border-[#263449] space-y-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <h3 className="text-base font-bold font-display text-white">Agency Verified Data</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            All mission milestones and scientific discoveries are cross-referenced with official mission releases from NASA, ESA, ISRO, and peer-reviewed journals.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-[#263449] space-y-3">
          <Clock className="w-6 h-6 text-amber-400" />
          <h3 className="text-base font-bold font-display text-white">Honest Launch Schedules</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            We never fabricate exact launch seconds when schedules are uncertain. Launches are labeled with clear confidence indicators (e.g. Confirmed vs Target Window).
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-[#263449] space-y-3">
          <Info className="w-6 h-6 text-sky-400" />
          <h3 className="text-base font-bold font-display text-white">Public Domain & Attribution</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            NASA and agency public media assets are used under educational fair use guidelines with explicit back-links to official mission pages.
          </p>
        </div>
      </div>

      {/* Connected Data Providers */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold font-display text-white">
          Active Data Providers & Ingestion Channels
        </h2>

        {loading ? (
          <div className="py-10 text-center text-slate-400 font-mono text-xs">
            Loading sources inventory...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sources.map((src) => (
              <div
                key={src.id}
                className="p-6 rounded-2xl glass-panel border border-[#263449] flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono text-emerald-400 uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                      {src.providerType}
                    </span>
                    <span className="text-xs font-mono text-slate-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{src.status}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-display text-white mb-2">
                    {src.name}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {src.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#263449] flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Last Synced: {new Date(src.lastSync).toLocaleDateString()}</span>
                  <a
                    href={src.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-400 hover:underline flex items-center space-x-1"
                  >
                    <span>Provider Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SourcesPage;
