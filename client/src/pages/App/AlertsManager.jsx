import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shield,
  Search,
  Filter,
  Check,
  X,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { apiClient } from '../../services/api/client';
import { useAuth } from '../../context/AuthContext';

export function AlertsManager() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [resolveModalAlert, setResolveModalAlert] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const { user } = useAuth();

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getAlerts({
        severity: severityFilter,
        status: statusFilter,
      });
      setAlerts(res?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [severityFilter, statusFilter]);

  const handleAcknowledge = async (id) => {
    try {
      await apiClient.acknowledgeAlert(id, user?.name || 'Operations Lead');
      fetchAlerts();
    } catch (err) {
      alert('Failed to acknowledge alert: ' + err.message);
    }
  };

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    if (!resolveModalAlert) return;
    try {
      await apiClient.resolveAlert(resolveModalAlert.id, resolutionNotes, user?.name || 'Operations Lead');
      setResolveModalAlert(null);
      setResolutionNotes('');
      fetchAlerts();
    } catch (err) {
      alert('Failed to resolve alert: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#263449]">
        <div>
          <span className="text-xs font-mono text-[#38BDF8] uppercase tracking-wider block">
            Spaceflight Safety & Incident Dispatch
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide">
            Alerts & Anomaly Management
          </h1>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FB7185] animate-ping"></span>
          <span className="text-white font-bold">2 Critical Anomaly Tracks</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-xl glass-panel border border-[#263449] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        {/* Severity Filters */}
        <div className="flex items-center space-x-1.5">
          <span className="text-[#94A3B8] text-[11px]">Severity:</span>
          {['all', 'critical', 'warning', 'info'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 rounded-lg uppercase text-[11px] font-semibold transition-colors cursor-pointer ${
                severityFilter === sev
                  ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40'
                  : 'text-[#94A3B8] hover:bg-[#111C2E]'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        {/* Status Filters */}
        <div className="flex items-center space-x-1.5">
          <span className="text-[#94A3B8] text-[11px]">Status:</span>
          {['all', 'active', 'acknowledged', 'resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg uppercase text-[11px] font-semibold transition-colors cursor-pointer ${
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

      {/* Alerts List Cards */}
      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-[#94A3B8] animate-pulse">
          Querying active telemetry incident logs...
        </div>
      ) : alerts.length === 0 ? (
        <div className="p-12 text-center space-y-2 glass-panel rounded-2xl">
          <CheckCircle2 className="w-8 h-8 text-[#34D399] mx-auto" />
          <h3 className="text-base font-display font-bold text-white">No Incidents Found</h3>
          <p className="text-xs text-[#94A3B8] font-mono">All fleet assets and ground segment nodes are operating within nominal thresholds.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alt) => (
            <div
              key={alt.id}
              className={`p-6 rounded-2xl glass-panel border transition-all ${
                alt.severity === 'critical'
                  ? 'border-[#FB7185]/40 bg-[#FB7185]/5'
                  : alt.severity === 'warning'
                  ? 'border-[#FBBF24]/40 bg-[#FBBF24]/5'
                  : 'border-[#263449]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      alt.severity === 'critical'
                        ? 'bg-[#FB7185]/20 text-[#FB7185] border border-[#FB7185]/40'
                        : alt.severity === 'warning'
                        ? 'bg-[#FBBF24]/20 text-[#FBBF24] border border-[#FBBF24]/40'
                        : 'bg-[#38BDF8]/20 text-[#38BDF8]'
                    }`}>
                      {alt.severity}
                    </span>
                    <span className="text-xs font-mono text-[#94A3B8]">{alt.source}</span>
                    <span className="text-xs font-mono text-slate-500">• {new Date(alt.timestamp).toLocaleTimeString()}</span>
                  </div>

                  <h3 className="text-base font-display font-bold text-white">{alt.title}</h3>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed max-w-3xl">{alt.details}</p>

                  <div className="flex items-center space-x-4 pt-2 text-xs font-mono text-[#94A3B8]">
                    <span>Target: <span className="text-white font-semibold">{alt.assetName}</span></span>
                    {alt.acknowledgedBy && (
                      <span className="text-[#38BDF8]">Ack by: {alt.acknowledgedBy}</span>
                    )}
                    {alt.resolutionNotes && (
                      <span className="text-[#34D399]">Resolution: {alt.resolutionNotes}</span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex sm:flex-col items-end gap-2 shrink-0 font-mono text-xs">
                  {alt.status === 'active' && (
                    <button
                      onClick={() => handleAcknowledge(alt.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#111C2E] hover:bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40 transition-colors cursor-pointer"
                    >
                      Acknowledge
                    </button>
                  )}
                  {alt.status !== 'resolved' && (
                    <button
                      onClick={() => setResolveModalAlert(alt)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#34D399]/20 hover:bg-[#34D399]/30 text-[#34D399] border border-[#34D399]/40 transition-colors cursor-pointer"
                    >
                      Resolve Incident
                    </button>
                  )}
                  {alt.status === 'resolved' && (
                    <span className="inline-flex items-center space-x-1 text-[#34D399] font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>RESOLVED</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resolution Modal */}
      {resolveModalAlert && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D1422] border border-[#263449] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#263449]">
              <h3 className="text-lg font-display font-bold text-white">Resolve Flight Anomaly</h3>
              <button onClick={() => setResolveModalAlert(null)} className="text-[#94A3B8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResolveSubmit} className="space-y-4 font-mono text-xs">
              <p className="text-[#94A3B8]">
                Resolving incident: <span className="text-white font-bold">{resolveModalAlert.title}</span>
              </p>
              <div>
                <label className="block text-[#94A3B8] mb-1">Investigation & Corrective Action Notes *</label>
                <textarea
                  required
                  rows={4}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Detail telemetry stabilization, procedure executed, or sensor clearance verification..."
                  className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setResolveModalAlert(null)}
                  className="px-4 py-2 text-[#94A3B8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#34D399] hover:bg-emerald-400 text-slate-950 font-bold uppercase cursor-pointer"
                >
                  Confirm Resolution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AlertsManager;
