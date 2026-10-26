import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Globe,
  Search,
  Filter,
  Satellite,
  Compass,
  ArrowRight,
  Radio,
  Layers,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { apiClient } from '../../services/api/client';
import { OrbitalGlobe } from '../../components/orbital/OrbitalGlobe';

export function OrbitalWorkspace() {
  const [orbitalData, setOrbitalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [orbitFilter, setOrbitFilter] = useState('all');
  const [selectedSat, setSelectedSat] = useState(null);

  const fetchOrbitalData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getOrbitalData();
      setOrbitalData(res?.data || null);
      if (res?.data?.objects?.length > 0) {
        setSelectedSat(res.data.objects[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrbitalData();
  }, []);

  const allObjects = orbitalData?.objects || [];
  const filteredObjects = allObjects.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.noradId.toString().includes(search);
    const matchesOrbit = orbitFilter === 'all' || s.orbitType.includes(orbitFilter);
    return matchesSearch && matchesOrbit;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#263449]">
        <div>
          <span className="text-xs font-mono text-[#38BDF8] uppercase tracking-wider block">
            Space Domain Awareness (SDA)
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide">
            Orbital Reconnaissance 3D Workspace
          </h1>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-[#94A3B8]">
          <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse"></span>
          <span>SGP4 Orbit Determination Live</span>
        </div>
      </div>

      {/* Main 3-Column Visualization Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Panel: Satellite List & Filters */}
        <div className="lg:col-span-3 p-4 rounded-2xl glass-panel border border-[#263449] space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#38BDF8] uppercase tracking-wider block font-semibold">
              Tracked Fleet Catalog ({filteredObjects.length})
            </span>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search satellite / NORAD..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#111C2E] border border-[#263449] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#94A3B8]/60 focus:outline-none focus:border-[#38BDF8] font-mono"
              />
            </div>
          </div>

          {/* Orbit Filter Pills */}
          <div className="flex flex-wrap gap-1 font-mono text-[10px]">
            {['all', 'LEO', 'GEO', 'SSO', 'NRHO'].map((ob) => (
              <button
                key={ob}
                onClick={() => setOrbitFilter(ob)}
                className={`px-2 py-0.5 rounded cursor-pointer ${
                  orbitFilter === ob
                    ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40'
                    : 'text-[#94A3B8] hover:bg-[#111C2E]'
                }`}
              >
                {ob}
              </button>
            ))}
          </div>

          {/* Selectable Satellite List */}
          <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
            {filteredObjects.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSat(s)}
                className={`w-full text-left p-2.5 rounded-xl text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                  selectedSat?.id === s.id
                    ? 'bg-[#38BDF8]/15 border border-[#38BDF8]/40 text-white'
                    : 'bg-[#0D1422]/60 hover:bg-[#111C2E] text-[#94A3B8]'
                }`}
              >
                <div className="truncate">
                  <span className="font-semibold block text-white truncate">{s.name}</span>
                  <span className="text-[10px] text-[#94A3B8]">#{s.noradId} • {s.orbitType}</span>
                </div>
                <span className={`w-2 h-2 rounded-full shrink-0 ml-2 ${
                  s.status === 'operational' ? 'bg-[#34D399]' : 'bg-[#FB7185]'
                }`}></span>
              </button>
            ))}
          </div>
        </div>

        {/* Center: Large 3D Earth Globe Canvas */}
        <div className="lg:col-span-6 space-y-2">
          <OrbitalGlobe
            satellites={filteredObjects}
            selectedSatelliteId={selectedSat?.id}
            onSelectSatellite={(sat) => setSelectedSat(sat)}
            height="580px"
            showControls={true}
          />
        </div>

        {/* Right Panel: Selected Object Telemetry & Details */}
        <div className="lg:col-span-3 p-5 rounded-2xl glass-panel border border-[#263449] space-y-5">
          {selectedSat ? (
            <>
              <div>
                <span className="text-[10px] font-mono text-[#38BDF8] uppercase tracking-wider block">
                  Selected Target Telemetry
                </span>
                <h3 className="text-lg font-display font-bold text-white mt-0.5">{selectedSat.name}</h3>
                <p className="text-xs font-mono text-[#94A3B8]">NORAD Catalog #{selectedSat.noradId}</p>
              </div>

              <div className="space-y-2.5 font-mono text-xs border-y border-[#263449]/60 py-3">
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Altitude:</span>
                  <span className="text-white font-bold">{selectedSat.altitudeKm} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Inclination:</span>
                  <span className="text-white font-bold">{selectedSat.inclinationDeg}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Velocity:</span>
                  <span className="text-white font-bold">{selectedSat.velocityKmS} km/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Orbital Period:</span>
                  <span className="text-white font-bold">{selectedSat.periodMinutes} min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Orbit Regime:</span>
                  <span className="text-[#38BDF8] font-bold">{selectedSat.orbitType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94A3B8]">Flight Status:</span>
                  <span className={selectedSat.status === 'operational' ? 'text-[#34D399]' : 'text-[#FB7185]'}>
                    {selectedSat.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Coordinates Preview */}
              {selectedSat.coordinates && (
                <div className="p-3 rounded-xl bg-[#070B14] border border-[#263449] font-mono text-[11px] space-y-1">
                  <span className="text-[#38BDF8] text-[10px] uppercase font-bold block">Sub-Satellite Point</span>
                  <p className="text-slate-300">Lat: {selectedSat.coordinates.lat?.toFixed(4)}°</p>
                  <p className="text-slate-300">Lon: {selectedSat.coordinates.lon?.toFixed(4)}°</p>
                </div>
              )}

              <Link
                to={`/app/satellites/${selectedSat.id}`}
                className="w-full py-2.5 rounded-xl bg-[#38BDF8] hover:bg-sky-400 text-slate-950 font-bold font-mono text-xs uppercase flex items-center justify-center space-x-1.5 transition-colors"
              >
                <span>Full Telemetry Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          ) : (
            <div className="p-8 text-center text-xs font-mono text-[#94A3B8] space-y-2">
              <Info className="w-6 h-6 mx-auto text-[#38BDF8]" />
              <p>Click any satellite on the globe or left list to inspect orbital telemetry.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrbitalWorkspace;
