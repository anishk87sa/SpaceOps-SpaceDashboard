import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, Satellite, Radio, Activity, AlertTriangle, Database, CheckCircle } from 'lucide-react';

export function Capabilities() {
  const capabilities = [
    {
      title: 'Mission Planning & Milestones',
      description: 'Comprehensive phase tracking from pre-launch integration and orbital injection to de-orbit maneuvers and decommissioning.',
      details: ['Multi-phase timeline scheduling', 'Milestone completion criteria audits', 'Payload activation sequences', 'Automated resource reservation'],
    },
    {
      title: 'Satellite Fleet Monitoring',
      description: 'Continuous health assessment tracking electrical power, thermal equilibrium, attitude determination, and RF link margin.',
      details: ['Real-time bus voltage & current telemetry', 'Solar array orientation tracking', 'Battery depth-of-discharge monitoring', 'Reaction wheel RPM diagnostics'],
    },
    {
      title: 'Ground Segment Operations',
      description: 'Automated coordination across international satellite ground stations with pass visibility calculations.',
      details: ['AOS/LOS pass window calculations', 'Azimuth and elevation tracking angles', 'S-band, X-band, and Ka-band scheduling', 'Doppler frequency shift compensation'],
    },
    {
      title: 'Telemetry Analytics & Quality',
      description: 'Interactive time-series telemetry charts with statistical anomaly detection and data quality confidence scores.',
      details: ['Sub-second live streaming graphs', 'Configurable threshold limits', 'Historical multi-orbit comparisons', 'Telemetry frame loss rate audits'],
    },
    {
      title: 'Alert & Incident Resolution',
      description: 'Classified incident dispatch system allowing flight controllers to acknowledge, investigate, and resolve spaceflight anomalies.',
      details: ['Severity taxonomy (Critical, Major, Warning, Info)', 'Collaborative investigation logs', 'Audit trail for safety governance', 'Emergency pass re-routing'],
    },
    {
      title: 'Space Data Intelligence',
      description: 'Ingestion pipeline connecting Space-Track TLE catalogs, NOAA space weather solar flux, and ground telemetry frames.',
      details: ['Continuous TLE catalog synchronization', 'Geomagnetic solar flare alerts', 'Ephemeris interpolation algorithms', 'Exportable flight logs in CSV & JSON'],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="max-w-3xl">
        <span className="text-xs font-mono uppercase tracking-widest text-[#38BDF8] font-semibold block mb-3">
          Platform Capabilities
        </span>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight">
          Comprehensive Toolset for Modern Flight Operations
        </h1>
        <p className="mt-4 text-base text-[#94A3B8] leading-relaxed">
          From single cubesats to global mega-constellations, SpaceOps delivers the precision telemetry,
          visualization, and ground coordination tools required for 24/7 spaceflight success.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {capabilities.map((cap) => (
          <div key={cap.title} className="p-8 rounded-2xl glass-panel border border-[#263449] space-y-5">
            <h3 className="text-xl font-display font-bold text-white">{cap.title}</h3>
            <p className="text-sm text-[#94A3B8] leading-relaxed">{cap.description}</p>
            <ul className="space-y-2.5 pt-2 border-t border-[#263449]/60">
              {cap.details.map((item) => (
                <li key={item} className="flex items-center space-x-2.5 text-xs text-slate-300 font-mono">
                  <CheckCircle className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Capabilities;
