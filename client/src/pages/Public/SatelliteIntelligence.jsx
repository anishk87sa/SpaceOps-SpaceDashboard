import React from 'react';
import { Link } from 'react-router-dom';
import { Satellite, Globe, AlertTriangle, Layers, ArrowRight } from 'lucide-react';
import { OrbitalGlobe } from '../../components/orbital/OrbitalGlobe';

export function SatelliteIntelligence() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="max-w-3xl">
        <span className="text-xs font-mono uppercase tracking-widest text-[#38BDF8] font-semibold block mb-3">
          Space Situational Awareness
        </span>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight">
          Orbital Intelligence & Conjunction Mitigation
        </h1>
        <p className="mt-4 text-base text-[#94A3B8] leading-relaxed">
          Monitor orbital regimes from Low Earth Orbit (LEO) and Sun-Synchronous Orbits (SSO) to
          Geostationary (GEO) and Lunar Near-Rectilinear Halo Orbits (NRHO) with predictive analytics.
        </p>
      </div>

      {/* Embedded 3D Orbital Model */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">Tactical 3D Preview</span>
          <Link
            to="/satellites"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-400 text-xs font-mono font-semibold transition-all shadow-lg"
          >
            <span>Open Full 3D Satellite Ops Center</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="rounded-2xl border border-[#263449] p-2 bg-[#0D1422] shadow-2xl">
          <OrbitalGlobe height="450px" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 rounded-2xl glass-panel border border-[#263449] space-y-3">
          <Globe className="w-7 h-7 text-[#38BDF8]" />
          <h3 className="text-base font-display font-bold text-white">SGP4 Orbit Propagation</h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Analytical solution accounting for Earth oblateness (J2, J3, J4 gravitational terms), atmospheric drag, and lunar-solar perturbations.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-[#263449] space-y-3">
          <AlertTriangle className="w-7 h-7 text-[#FBBF24]" />
          <h3 className="text-base font-display font-bold text-white">Conjunction Assessment</h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Continuous screening against 26,000+ cataloged debris objects. Automatic warning generation when miss distances fall below 5 km.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-[#263449] space-y-3">
          <Layers className="w-7 h-7 text-[#34D399]" />
          <h3 className="text-base font-display font-bold text-white">Fleet Registry Management</h3>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Direct tracking of NORAD IDs, international designators, operational statuses, and last successful ground contact timestamps.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SatelliteIntelligence;
