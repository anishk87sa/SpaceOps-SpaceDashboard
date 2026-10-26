import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  Radio,
  Eye,
  Route,
  Bookmark,
  ExternalLink,
  Layers,
  Compass,
  Gauge,
  Clock,
  Rocket,
  Shield,
  Info,
} from 'lucide-react';
import {
  propagateSatellite,
  getSatelliteOrbitalElements,
} from '../../services/orbital/satellitePropagation';

export function SatelliteDetailPanel({
  satellite = null,
  onClose = () => {},
  isFollowing = false,
  onToggleFollow = () => {},
  showOrbitTrajectory = true,
  onToggleOrbit = () => {},
  onFlyTo = () => {},
  simulationTime = new Date(),
  isFavorite = false,
  onToggleFavorite = () => {},
}) {
  const [copied, setCopied] = useState(false);
  const [telemetry, setTelemetry] = useState(null);

  // High-frequency telemetry propagation update
  useEffect(() => {
    if (!satellite) {
      setTelemetry(null);
      return;
    }

    const prop = propagateSatellite(satellite, simulationTime);
    const elements = getSatelliteOrbitalElements(satellite);

    setTelemetry({
      ...prop,
      ...elements,
    });
  }, [satellite, simulationTime]);

  if (!satellite) return null;

  const handleCopyNorad = () => {
    if (satellite.noradId) {
      navigator.clipboard.writeText(satellite.noradId.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="absolute top-4 right-4 bottom-16 z-30 w-84 sm:w-96 flex flex-col rounded-2xl bg-[#0D1422]/95 border border-[#263449] backdrop-blur-xl shadow-2xl overflow-hidden text-[#F1F5F9]">
      {/* Panel Header */}
      <div className="p-4 border-b border-[#263449] flex items-start justify-between bg-gradient-to-r from-sky-950/40 to-transparent">
        <div className="space-y-1 pr-2 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30 font-semibold uppercase">
              {satellite.categoryLabel || satellite.category}
            </span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>NOMINAL</span>
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-bold font-display text-white tracking-wide truncate">
            {satellite.name}
          </h2>

          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <span>NORAD ID:</span>
            <span className="text-white font-bold">{satellite.noradId}</span>
            <button
              onClick={handleCopyNorad}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Copy NORAD Catalog ID"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="Close Panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Primary Action Buttons */}
      <div className="p-3 border-b border-[#263449] grid grid-cols-3 gap-2 bg-[#111C2E]/60 text-[11px] font-mono">
        <button
          onClick={onToggleFollow}
          className={`flex items-center justify-center space-x-1.5 py-2 px-2 rounded-xl transition-all border cursor-pointer ${
            isFollowing
              ? 'bg-sky-500/20 border-sky-400 text-sky-300 font-bold shadow-md'
              : 'bg-[#162338] border-[#263449] text-slate-300 hover:text-white hover:border-slate-600'
          }`}
          title="Keep satellite centered in 3D camera"
        >
          <Radio className="w-3.5 h-3.5" />
          <span>{isFollowing ? 'Following' : 'Follow'}</span>
        </button>

        <button
          onClick={onToggleOrbit}
          className={`flex items-center justify-center space-x-1.5 py-2 px-2 rounded-xl transition-all border cursor-pointer ${
            showOrbitTrajectory
              ? 'bg-sky-500/20 border-sky-400 text-sky-300 font-bold shadow-md'
              : 'bg-[#162338] border-[#263449] text-slate-300 hover:text-white hover:border-slate-600'
          }`}
          title="Toggle 3D orbital trajectory path"
        >
          <Route className="w-3.5 h-3.5" />
          <span>{showOrbitTrajectory ? 'Orbit On' : 'Orbit Off'}</span>
        </button>

        <button
          onClick={onToggleFavorite}
          className={`flex items-center justify-center space-x-1.5 py-2 px-2 rounded-xl transition-all border cursor-pointer ${
            isFavorite
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
              : 'bg-[#162338] border-[#263449] text-slate-300 hover:text-white hover:border-slate-600'
          }`}
          title="Save to favorites"
        >
          <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
          <span>{isFavorite ? 'Saved' : 'Favorite'}</span>
        </button>
      </div>

      {/* Scrollable Dossier Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Dynamic Telemetry Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="uppercase tracking-wider font-semibold text-sky-400">
              Live SGP4 Telemetry
            </span>
            <span className="text-[10px] text-slate-500">Calculated</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-[#111C2E] border border-[#263449]">
              <span className="text-[10px] text-slate-400 block">Latitude</span>
              <span className="font-bold text-white text-sm">
                {telemetry?.latitude !== undefined
                  ? `${Math.abs(telemetry.latitude).toFixed(2)}° ${telemetry.latitude >= 0 ? 'N' : 'S'}`
                  : '—'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#111C2E] border border-[#263449]">
              <span className="text-[10px] text-slate-400 block">Longitude</span>
              <span className="font-bold text-white text-sm">
                {telemetry?.longitude !== undefined
                  ? `${Math.abs(telemetry.longitude).toFixed(2)}° ${telemetry.longitude >= 0 ? 'E' : 'W'}`
                  : '—'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#111C2E] border border-[#263449]">
              <span className="text-[10px] text-slate-400 block">Altitude</span>
              <span className="font-bold text-sky-400 text-sm">
                {telemetry?.altitudeKm !== undefined ? `${telemetry.altitudeKm.toLocaleString()} km` : '—'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#111C2E] border border-[#263449]">
              <span className="text-[10px] text-slate-400 block">Velocity</span>
              <span className="font-bold text-emerald-400 text-sm">
                {telemetry?.velocityKmS !== undefined ? `${telemetry.velocityKmS} km/s` : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Orbital Mechanics Parameters */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-400 block">
            Orbital Elements
          </span>

          <div className="p-3 rounded-xl bg-[#111C2E] border border-[#263449] space-y-2 text-xs font-mono">
            <div className="flex justify-between items-center pb-1.5 border-b border-[#263449]/60">
              <span className="text-slate-400">Inclination:</span>
              <span className="text-white font-semibold">{telemetry?.inclinationDeg ?? '—'}°</span>
            </div>
            <div className="flex justify-between items-center pb-1.5 border-b border-[#263449]/60">
              <span className="text-slate-400">Orbital Period:</span>
              <span className="text-white font-semibold">{telemetry?.periodMinutes ?? '—'} min</span>
            </div>
            <div className="flex justify-between items-center pb-1.5 border-b border-[#263449]/60">
              <span className="text-slate-400">Apogee Altitude:</span>
              <span className="text-white font-semibold">
                {telemetry?.apogeeKm ? `${telemetry.apogeeKm.toLocaleString()} km` : '—'}
              </span>
            </div>
            <div className="flex justify-between items-center pb-1.5 border-b border-[#263449]/60">
              <span className="text-slate-400">Perigee Altitude:</span>
              <span className="text-white font-semibold">
                {telemetry?.perigeeKm ? `${telemetry.perigeeKm.toLocaleString()} km` : '—'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Eccentricity:</span>
              <span className="text-white font-semibold">{telemetry?.eccentricity ?? '0.000'}</span>
            </div>
          </div>
        </div>

        {/* Mission Dossier & Metadata */}
        {(satellite.operator || satellite.launchDate || satellite.launchVehicle || satellite.description) && (
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-400 block">
              Mission Specifications
            </span>

            <div className="p-3 rounded-xl bg-[#111C2E] border border-[#263449] space-y-2.5 text-xs">
              {satellite.operator && (
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">Operator / Agency</span>
                  <span className="text-white font-medium">{satellite.operator}</span>
                </div>
              )}

              {satellite.launchDate && (
                <div className="flex justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">Launch Date</span>
                    <span className="text-white font-mono">{satellite.launchDate}</span>
                  </div>
                  {satellite.launchVehicle && (
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-400 block">Launch Vehicle</span>
                      <span className="text-white font-mono">{satellite.launchVehicle}</span>
                    </div>
                  )}
                </div>
              )}

              {satellite.description && (
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block mb-1">Mission Profile</span>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                    {satellite.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Data Provenance & Telemetry Disclaimer */}
        <div className="p-3 rounded-xl bg-[#070B14] border border-[#263449]/60 text-[10px] font-mono text-slate-400 space-y-1">
          <div className="flex items-center space-x-1.5 text-slate-300 font-semibold">
            <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>Data Provenance & SGP4 Prediction</span>
          </div>
          <p className="leading-tight text-slate-500">
            Orbital coordinates are continuously computed in real-time using simplified general perturbations (SGP4) mathematical model from published TLE orbital elements provided by {satellite.source || 'CelesTrak'}.
          </p>
          <div className="pt-1 flex justify-between text-[9px] text-slate-600">
            <span>NORAD Designator: {satellite.designator || 'N/A'}</span>
            <span>Calculated: {telemetry?.calculatedAt ? new Date(telemetry.calculatedAt).toLocaleTimeString() : 'Live'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SatelliteDetailPanel;
