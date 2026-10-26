import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Plus, Search, Filter, CheckCircle2, Clock, AlertTriangle, ArrowRight, Trash2 } from 'lucide-react';
import { apiClient } from '../../services/api/client';

export function MissionsList() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchMissions = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getMissions({ search, status: statusFilter });
      setMissions(res?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMissions();
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    if (!window.confirm('Are you sure you want to archive this mission record?')) return;
    try {
      await apiClient.deleteMission(id);
      fetchMissions();
    } catch (err) {
      alert(err.message || 'Failed to archive mission');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#263449]">
        <div>
          <span className="text-xs font-mono text-[#38BDF8] uppercase tracking-wider block">
            Flight Operations Registry
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide">
            Spaceflight Missions
          </h1>
        </div>

        <Link
          to="/app/missions/new"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#38BDF8] hover:bg-sky-400 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider shadow-lg glow-cyan transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Plan New Mission</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl glass-panel border border-[#263449] flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search mission name, code, objective..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111C2E] border border-[#263449] rounded-lg pl-9 pr-4 py-2 text-xs text-[#F1F5F9] focus:outline-none focus:border-[#38BDF8] font-mono"
          />
        </form>

        <div className="flex items-center space-x-2 w-full md:w-auto font-mono text-xs">
          <span className="text-[#94A3B8] text-[11px]">Status:</span>
          {['all', 'active', 'planning', 'completed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg uppercase text-[11px] font-semibold transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40'
                  : 'text-[#94A3B8] hover:bg-[#111C2E] hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Missions Table */}
      <div className="rounded-2xl glass-panel border border-[#263449] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-[#94A3B8] animate-pulse">
            Querying mission operations database...
          </div>
        ) : missions.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Compass className="w-8 h-8 text-[#94A3B8] mx-auto" />
            <h3 className="text-base font-display font-bold text-white">No Missions Found</h3>
            <p className="text-xs text-[#94A3B8] font-mono">Try adjusting your search criteria or register a new mission plan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0D1422] border-b border-[#263449] text-[#94A3B8] uppercase text-[10px]">
                <tr>
                  <th className="px-6 py-3.5">Mission Code</th>
                  <th className="px-6 py-3.5">Mission Title & Objective</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Progress</th>
                  <th className="px-6 py-3.5">Timeframe</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263449]/60">
                {missions.map((m) => (
                  <tr key={m.id} className="hover:bg-[#111C2E]/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#38BDF8]">
                      <Link to={`/app/missions/${m.id}`} className="hover:underline">
                        {m.code}
                      </Link>
                    </td>
                    <td className="px-6 py-4 max-w-sm">
                      <span className="font-bold text-white block text-sm">{m.name}</span>
                      <span className="text-[11px] text-[#94A3B8] line-clamp-1">{m.objective}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        m.status === 'active'
                          ? 'bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/30'
                          : m.status === 'planning'
                          ? 'bg-[#818CF8]/20 text-[#818CF8] border border-[#818CF8]/30'
                          : 'bg-[#94A3B8]/20 text-[#94A3B8]'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 w-40">
                      <div className="flex justify-between text-[10px] text-slate-300 mb-1">
                        <span>{m.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#111C2E] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#38BDF8] to-[#34D399]" style={{ width: `${m.progress}%` }}></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[11px] text-[#94A3B8]">
                      <span>{m.startDate} → {m.endDate}</span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        to={`/app/missions/${m.id}`}
                        className="px-2.5 py-1 rounded bg-[#111C2E] border border-[#263449] text-[#38BDF8] hover:bg-[#38BDF8]/10 text-[11px]"
                      >
                        Inspect
                      </Link>
                      <button
                        onClick={(e) => handleDelete(m.id, e)}
                        className="p-1 rounded text-[#94A3B8] hover:text-[#FB7185] transition-colors"
                        title="Archive Mission"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default MissionsList;
