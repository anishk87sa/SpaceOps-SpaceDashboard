import React, { useEffect, useState } from 'react';
import { Database, RefreshCw, CheckCircle2, Clock, Layers, ArrowRight, Zap } from 'lucide-react';
import { apiClient } from '../../services/api/client';

export function DataExplorer() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState(null);

  const fetchDataSources = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getDataSources();
      setSources(res?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataSources();
  }, []);

  const handleSync = async (id) => {
    setSyncingId(id);
    try {
      await apiClient.syncDataSource(id);
      fetchDataSources();
    } catch (err) {
      alert('Sync failed: ' + err.message);
    } finally {
      setSyncingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#263449]">
        <div>
          <span className="text-xs font-mono text-[#38BDF8] uppercase tracking-wider block">
            Ingestion Pipeline & Ephemeris Lake
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide">
            Space Data Explorer
          </h1>
        </div>

        <button
          onClick={fetchDataSources}
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-[#111C2E] border border-[#263449] text-[#38BDF8] font-mono text-xs uppercase"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Sources</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-[#94A3B8] animate-pulse">
          Auditing data ingestion feeds and synchronization status...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sources.map((src) => (
            <div key={src.id} className="p-6 rounded-2xl glass-panel border border-[#263449] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#38BDF8] uppercase tracking-wider block">
                      {src.protocol} • {src.cadence}
                    </span>
                    <h3 className="text-base font-display font-bold text-white mt-0.5">{src.name}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/30">
                    {src.status}
                  </span>
                </div>

                <p className="text-xs font-mono text-[#94A3B8]">Provider: {src.provider}</p>

                <div className="p-3.5 rounded-xl bg-[#070B14]/70 border border-[#263449] font-mono text-xs space-y-1.5 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Records Processed:</span>
                    <span className="text-white font-bold">{src.recordsCount.toLocaleString()} frames</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Data Quality Score:</span>
                    <span className="text-[#34D399] font-bold">{src.qualityScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94A3B8]">Last Synchronized:</span>
                    <span className="text-slate-400">{new Date(src.lastSync).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#263449]/60 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">Auto-sync enabled</span>
                <button
                  onClick={() => handleSync(src.id)}
                  disabled={syncingId === src.id}
                  className="px-3 py-1.5 rounded-lg bg-[#111C2E] border border-[#263449] hover:border-[#38BDF8] text-xs font-mono text-[#38BDF8] flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncingId === src.id ? 'animate-spin' : ''}`} />
                  <span>{syncingId === src.id ? 'Syncing...' : 'Sync Now'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DataExplorer;
