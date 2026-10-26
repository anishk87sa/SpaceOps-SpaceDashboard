import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Satellite,
  Radio,
  Edit,
  Shield,
  Trash2,
  Check,
} from 'lucide-react';
import { apiClient } from '../../services/api/client';

export function MissionDetail() {
  const { missionId } = useParams();
  const navigate = useNavigate();
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMission = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getMissionById(missionId);
      setMission(res?.data || null);
    } catch (err) {
      setError(err.message || 'Mission not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMission();
  }, [missionId]);

  const handleUpdateProgress = async (newProgress) => {
    try {
      const res = await apiClient.updateMission(missionId, { progress: newProgress });
      setMission(res.data);
    } catch (err) {
      alert('Failed to update progress: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center font-mono text-xs text-[#94A3B8] animate-pulse">
        Retrieving flight mission manifests...
      </div>
    );
  }

  if (error || !mission) {
    return (
      <div className="p-12 text-center space-y-4">
        <h3 className="text-xl font-display font-bold text-white">Mission Record Not Found</h3>
        <p className="text-xs text-[#94A3B8] font-mono">{error || 'ID does not exist in registry.'}</p>
        <Link to="/app/missions" className="text-xs font-mono text-[#38BDF8] underline">
          Return to Missions List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back and Title Header */}
      <div>
        <Link
          to="/app/missions"
          className="inline-flex items-center space-x-1 text-xs font-mono text-[#94A3B8] hover:text-[#38BDF8] mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Missions Registry</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
                {mission.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-950 text-[#38BDF8] border border-sky-800/40 text-xs font-mono font-bold">
                {mission.code}
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] font-mono">
              Lead Officer: {mission.owner || 'Flight Director'} • Regimen: {mission.type}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase font-mono ${
              mission.status === 'active'
                ? 'bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/40'
                : 'bg-[#818CF8]/20 text-[#818CF8] border border-[#818CF8]/40'
            }`}>
              {mission.status}
            </span>
          </div>
        </div>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl glass-panel border border-[#263449] space-y-2">
          <span className="text-xs font-mono text-[#94A3B8]">Overall Completion</span>
          <div className="text-3xl font-bold font-display text-white">{mission.progress}%</div>
          <div className="w-full h-2 bg-[#111C2E] rounded-full overflow-hidden mt-2">
            <div className="h-full bg-gradient-to-r from-[#38BDF8] to-[#34D399]" style={{ width: `${mission.progress}%` }}></div>
          </div>
          <div className="pt-2 flex gap-2">
            {[25, 50, 75, 100].map((val) => (
              <button
                key={val}
                onClick={() => handleUpdateProgress(val)}
                className="px-2 py-0.5 rounded bg-[#111C2E] border border-[#263449] text-[10px] font-mono text-[#38BDF8] hover:bg-[#38BDF8]/20"
              >
                Set {val}%
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-[#263449] space-y-2">
          <span className="text-xs font-mono text-[#94A3B8]">Operational Timeframe</span>
          <div className="text-sm font-mono text-white pt-1">
            <div className="flex justify-between py-1 border-b border-[#263449]/40">
              <span className="text-[#94A3B8]">Start Date:</span>
              <span>{mission.startDate}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#94A3B8]">Scheduled End:</span>
              <span>{mission.endDate}</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-[#263449] space-y-2">
          <span className="text-xs font-mono text-[#94A3B8]">Allocated Resources</span>
          <div className="text-sm font-mono text-white pt-1 space-y-1">
            <p className="flex justify-between">
              <span className="text-[#94A3B8]">Satellites:</span>
              <span className="text-[#38BDF8]">{mission.satellites?.length || 0} Assets</span>
            </p>
            <p className="flex justify-between">
              <span className="text-[#94A3B8]">Ground Stations:</span>
              <span className="text-[#34D399]">{mission.groundStations?.length || 0} Nodes</span>
            </p>
          </div>
        </div>
      </div>

      {/* Primary Objective Description */}
      <div className="p-6 rounded-2xl glass-panel border border-[#263449] space-y-3">
        <h3 className="text-sm font-display font-semibold text-white">Mission Statement & Primary Objectives</h3>
        <p className="text-xs text-slate-300 leading-relaxed font-mono">{mission.objective}</p>
      </div>

      {/* Flight Milestones Checklist */}
      <div className="p-6 rounded-2xl glass-panel border border-[#263449] space-y-4">
        <h3 className="text-sm font-display font-semibold text-white">Flight Dynamics Milestones</h3>
        <div className="space-y-3 font-mono text-xs">
          {mission.milestones && mission.milestones.length > 0 ? (
            mission.milestones.map((ms) => (
              <div key={ms.id} className="p-3.5 rounded-xl bg-[#070B14]/70 border border-[#263449] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    ms.status === 'completed'
                      ? 'bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/40'
                      : 'bg-amber-950/40 text-amber-400 border border-amber-800/40'
                  }`}>
                    {ms.status === 'completed' ? <Check className="w-3 h-3" /> : '•'}
                  </span>
                  <span className="text-white font-medium">{ms.title}</span>
                </div>
                <div className="flex items-center space-x-4 text-[#94A3B8]">
                  <span>{ms.date}</span>
                  <span className="uppercase text-[10px] text-slate-400">{ms.status}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-[#94A3B8]">No sequential milestones configured for this mission.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MissionDetail;
