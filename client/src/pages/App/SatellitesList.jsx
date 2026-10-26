import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Satellite,
  Search,
  Plus,
  Filter,
  Grid,
  List,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Radio,
  ArrowRight,
  X,
} from 'lucide-react';
import { apiClient } from '../../services/api/client';

export function SatellitesList() {
  const [satellites, setSatellites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [orbitFilter, setOrbitFilter] = useState('all');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // New satellite form state
  const [newSat, setNewSat] = useState({
    name: '',
    noradId: '',
    designator: '',
    type: 'Earth Observation',
    orbitType: 'LEO',
    altitudeKm: 550,
    inclinationDeg: 51.6,
  });

  const fetchSatellites = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getSatellites({ search, orbitType: orbitFilter });
      setSatellites(res?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSatellites();
  }, [orbitFilter]);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.createSatellite(newSat);
      setShowRegisterModal(false);
      fetchSatellites();
    } catch (err) {
      alert('Failed to register: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#263449]">
        <div>
          <span className="text-xs font-mono text-[#38BDF8] uppercase tracking-wider block">
            Space Object Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide">
            Satellite Fleet Registry
          </h1>
        </div>

        <button
          onClick={() => setShowRegisterModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#38BDF8] hover:bg-sky-400 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider shadow-lg glow-cyan transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register Satellite</span>
        </button>
      </div>

      {/* Controls Bar */}
      <div className="p-4 rounded-xl glass-panel border border-[#263449] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, NORAD ID, designator..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchSatellites()}
            className="w-full bg-[#111C2E] border border-[#263449] rounded-lg pl-9 pr-4 py-2 text-xs text-[#F1F5F9] focus:outline-none focus:border-[#38BDF8] font-mono"
          />
        </div>

        <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
          {/* Orbit Filter Pills */}
          <div className="flex items-center space-x-1.5 font-mono text-xs">
            <span className="text-[#94A3B8] text-[11px] hidden sm:inline">Orbit:</span>
            {['all', 'LEO', 'GEO', 'SSO', 'NRHO'].map((ob) => (
              <button
                key={ob}
                onClick={() => setOrbitFilter(ob)}
                className={`px-2.5 py-1 rounded-lg uppercase text-[11px] font-semibold transition-colors cursor-pointer ${
                  orbitFilter === ob
                    ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40'
                    : 'text-[#94A3B8] hover:bg-[#111C2E]'
                }`}
              >
                {ob}
              </button>
            ))}
          </div>

          {/* Table / Grid view switcher */}
          <div className="flex items-center space-x-1 p-1 rounded-lg bg-[#070B14] border border-[#263449]">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-[#111C2E] text-[#38BDF8]' : 'text-[#94A3B8]'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded ${viewMode === 'cards' ? 'bg-[#111C2E] text-[#38BDF8]' : 'text-[#94A3B8]'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Display: Table or Cards */}
      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-[#94A3B8] animate-pulse">
          Querying orbital satellite records...
        </div>
      ) : satellites.length === 0 ? (
        <div className="p-12 text-center space-y-3 glass-panel rounded-2xl">
          <Satellite className="w-8 h-8 text-[#94A3B8] mx-auto" />
          <h3 className="text-base font-display font-bold text-white">No Satellites Found</h3>
          <p className="text-xs text-[#94A3B8] font-mono">Try adjusting filters or register a new on-orbit asset.</p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="rounded-2xl glass-panel border border-[#263449] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0D1422] border-b border-[#263449] text-[#94A3B8] uppercase text-[10px]">
                <tr>
                  <th className="px-6 py-3.5">Satellite Asset</th>
                  <th className="px-6 py-3.5">NORAD ID</th>
                  <th className="px-6 py-3.5">Regime</th>
                  <th className="px-6 py-3.5">Altitude</th>
                  <th className="px-6 py-3.5">Velocity</th>
                  <th className="px-6 py-3.5">Health</th>
                  <th className="px-6 py-3.5 text-right">Telemetry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#263449]/60">
                {satellites.map((sat) => (
                  <tr key={sat.id} className="hover:bg-[#111C2E]/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link to={`/app/satellites/${sat.id}`} className="font-bold text-white hover:text-[#38BDF8] block text-sm">
                        {sat.name}
                      </Link>
                      <span className="text-[11px] text-[#94A3B8]">{sat.type}</span>
                    </td>
                    <td className="px-6 py-4 text-[#38BDF8]">{sat.noradId}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-sky-950 text-cyan-300 border border-sky-800/40 text-[10px] font-bold">
                        {sat.orbitType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{sat.altitudeKm} km</td>
                    <td className="px-6 py-4 text-slate-300">{sat.velocityKmS} km/s</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        sat.status === 'operational'
                          ? 'bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/30'
                          : 'bg-[#FB7185]/20 text-[#FB7185] border border-[#FB7185]/30'
                      }`}>
                        {sat.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/app/satellites/${sat.id}`}
                        className="px-3 py-1.5 rounded-lg bg-[#111C2E] border border-[#263449] text-[#38BDF8] hover:bg-[#38BDF8]/10 text-[11px]"
                      >
                        Telemetry →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {satellites.map((sat) => (
            <div key={sat.id} className="p-6 rounded-2xl glass-panel border border-[#263449] space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#38BDF8] uppercase tracking-wider block">
                    NORAD #{sat.noradId}
                  </span>
                  <h3 className="text-lg font-display font-bold text-white mt-0.5">{sat.name}</h3>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                  sat.status === 'operational' ? 'bg-[#34D399]/20 text-[#34D399]' : 'bg-[#FB7185]/20 text-[#FB7185]'
                }`}>
                  {sat.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono py-2 border-y border-[#263449]/60 text-slate-400">
                <div>
                  <span className="block text-[10px]">Altitude</span>
                  <span className="text-white font-bold">{sat.altitudeKm} km</span>
                </div>
                <div>
                  <span className="block text-[10px]">Inclination</span>
                  <span className="text-white font-bold">{sat.inclinationDeg}°</span>
                </div>
                <div>
                  <span className="block text-[10px]">Period</span>
                  <span className="text-white font-bold">{sat.periodMinutes} min</span>
                </div>
                <div>
                  <span className="block text-[10px]">Bus Voltage</span>
                  <span className="text-[#34D399] font-bold">{sat.batteryChargePercent}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-mono text-[#94A3B8]">
                  {sat.orbitType} Orbit
                </span>
                <Link
                  to={`/app/satellites/${sat.id}`}
                  className="inline-flex items-center space-x-1 text-xs font-mono text-[#38BDF8] hover:underline"
                >
                  <span>Inspect Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Registration Modal Dialog */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D1422] border border-[#263449] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 relative shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#263449]">
              <h3 className="text-lg font-display font-bold text-white">Register Satellite Asset</h3>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-[#94A3B8] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-[#94A3B8] mb-1">Satellite Name *</label>
                <input
                  type="text"
                  required
                  value={newSat.name}
                  onChange={(e) => setNewSat({ ...newSat, name: e.target.value })}
                  placeholder="e.g. Starlink Node 9201"
                  className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#94A3B8] mb-1">NORAD Catalog ID</label>
                  <input
                    type="number"
                    value={newSat.noradId}
                    onChange={(e) => setNewSat({ ...newSat, noradId: e.target.value })}
                    placeholder="e.g. 52410"
                    className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>
                <div>
                  <label className="block text-[#94A3B8] mb-1">Orbit Regime</label>
                  <select
                    value={newSat.orbitType}
                    onChange={(e) => setNewSat({ ...newSat, orbitType: e.target.value })}
                    className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#38BDF8]"
                  >
                    <option value="LEO">LEO (Low Earth Orbit)</option>
                    <option value="GEO">GEO (Geostationary)</option>
                    <option value="SSO">SSO (Sun-Synchronous)</option>
                    <option value="NRHO">NRHO (Lunar Halo)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#94A3B8] mb-1">Altitude (km)</label>
                  <input
                    type="number"
                    value={newSat.altitudeKm}
                    onChange={(e) => setNewSat({ ...newSat, altitudeKm: e.target.value })}
                    className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>
                <div>
                  <label className="block text-[#94A3B8] mb-1">Inclination (deg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newSat.inclinationDeg}
                    onChange={(e) => setNewSat({ ...newSat, inclinationDeg: e.target.value })}
                    className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-4 py-2 rounded-xl text-[#94A3B8] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#38BDF8] hover:bg-sky-400 text-slate-950 font-bold uppercase"
                >
                  Register Object
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SatellitesList;
