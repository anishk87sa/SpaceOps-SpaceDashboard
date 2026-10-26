import React, { useEffect, useState } from 'react';
import { Radio, Calendar, Search, Clock, Satellite, ArrowRight, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../../services/api/client';

export function CommunicationPasses() {
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchPasses = async () => {
      setLoading(true);
      try {
        const res = await apiClient.getPasses({ status: statusFilter });
        setPasses(res?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPasses();
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#263449]">
        <div>
          <span className="text-xs font-mono text-[#38BDF8] uppercase tracking-wider block">
            RF Link Schedule
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide">
            Ground Communication Passes
          </h1>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          {['all', 'active', 'scheduled', 'completed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg uppercase text-[11px] font-semibold transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40'
                  : 'text-[#94A3B8] hover:bg-[#111C2E]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-[#94A3B8] animate-pulse">
          Computing line-of-sight elevation vectors and Doppler tracking schedules...
        </div>
      ) : passes.length === 0 ? (
        <div className="p-12 text-center space-y-2 glass-panel rounded-2xl">
          <Calendar className="w-8 h-8 text-[#94A3B8] mx-auto" />
          <p className="text-xs text-[#94A3B8] font-mono">No communication passes match the selected filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {passes.map((p) => (
            <div key={p.id} className="p-6 rounded-2xl glass-panel border border-[#263449] space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#38BDF8] uppercase tracking-wider block">
                    Pass Reference #{p.id}
                  </span>
                  <h3 className="text-base font-display font-bold text-white mt-0.5">{p.satelliteName}</h3>
                  <span className="text-xs font-mono text-[#94A3B8]">{p.groundStationName}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                  p.status === 'active'
                    ? 'bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/40 animate-pulse'
                    : p.status === 'scheduled'
                    ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40'
                    : 'bg-[#94A3B8]/20 text-[#94A3B8]'
                }`}>
                  {p.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#070B14]/70 border border-[#263449] text-xs font-mono text-slate-300">
                <div>
                  <span className="text-[#94A3B8] text-[10px] block">AOS (Acquisition)</span>
                  <span className="text-white font-bold">{new Date(p.aos).toLocaleTimeString()}</span>
                </div>
                <div>
                  <span className="text-[#94A3B8] text-[10px] block">LOS (Loss of Signal)</span>
                  <span className="text-white font-bold">{new Date(p.los).toLocaleTimeString()}</span>
                </div>
                <div>
                  <span className="text-[#94A3B8] text-[10px] block">Max Elevation</span>
                  <span className="text-[#38BDF8] font-bold">{p.maxElevationDeg}°</span>
                </div>
                <div>
                  <span className="text-[#94A3B8] text-[10px] block">Contact Window</span>
                  <span className="text-[#34D399] font-bold">{p.durationMinutes} min</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
                <span>Band: {p.frequencyBand}</span>
                <span>Payload: ~{(p.dataVolumeExpectedMb / 1024).toFixed(1)} GB Downlink</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CommunicationPasses;
