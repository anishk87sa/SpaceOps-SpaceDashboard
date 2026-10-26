import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Satellite,
  ArrowLeft,
  Activity,
  Radio,
  AlertTriangle,
  Clock,
  Layers,
  Thermometer,
  Zap,
  BatteryCharging,
  Cpu,
} from 'lucide-react';
import { apiClient } from '../../services/api/client';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export function SatelliteDetail() {
  const { satelliteId } = useParams();
  const [satellite, setSatellite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSatellite = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getSatelliteById(satelliteId);
      setSatellite(res?.data || null);
    } catch (err) {
      setError(err.message || 'Satellite record not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSatellite();
  }, [satelliteId]);

  if (loading) {
    return (
      <div className="p-12 text-center font-mono text-xs text-[#94A3B8] animate-pulse">
        Retrieving telemetry parameters and orbital ephemeris...
      </div>
    );
  }

  if (error || !satellite) {
    return (
      <div className="p-12 text-center space-y-4">
        <h3 className="text-xl font-display font-bold text-white">Satellite Not Found</h3>
        <p className="text-xs text-[#94A3B8] font-mono">{error || 'ID does not exist in registry.'}</p>
        <Link to="/app/satellites" className="text-xs font-mono text-[#38BDF8] underline">
          Back to Satellite Registry
        </Link>
      </div>
    );
  }

  const telemetrySeries = satellite.latestTelemetry?.series || [];

  return (
    <div className="space-y-8">
      {/* Back and Title Header */}
      <div>
        <Link
          to="/app/satellites"
          className="inline-flex items-center space-x-1 text-xs font-mono text-[#94A3B8] hover:text-[#38BDF8] mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Satellite Fleet</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">
                {satellite.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-950 text-[#38BDF8] border border-sky-800/40 text-xs font-mono font-bold">
                NORAD #{satellite.noradId}
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] font-mono">
              Designator: {satellite.designator} • Type: {satellite.type} • Orbit: {satellite.orbitType}
            </p>
          </div>

          <div className="flex items-center space-x-3 font-mono">
            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${
              satellite.status === 'operational'
                ? 'bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/40'
                : 'bg-[#FB7185]/20 text-[#FB7185] border border-[#FB7185]/40'
            }`}>
              {satellite.status}
            </span>
          </div>
        </div>
      </div>

      {/* Telemetry Health Gauges Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Gauge 1: Power */}
        <div className="p-5 rounded-2xl glass-panel border border-[#263449] space-y-1">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-[11px] font-mono">Battery Charge</span>
            <BatteryCharging className="w-4 h-4 text-[#34D399]" />
          </div>
          <div className="text-2xl font-bold font-display text-white">
            {satellite.batteryChargePercent}%
          </div>
          <span className="text-[10px] font-mono text-[#34D399] block">EPS Nominal</span>
        </div>

        {/* Gauge 2: Solar Array */}
        <div className="p-5 rounded-2xl glass-panel border border-[#263449] space-y-1">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-[11px] font-mono">Solar Array Output</span>
            <Zap className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="text-2xl font-bold font-display text-white">
            {satellite.solarArrayPowerKw} <span className="text-xs font-normal text-[#94A3B8]">kW</span>
          </div>
          <span className="text-[10px] font-mono text-slate-300 block">Sun Tracking On</span>
        </div>

        {/* Gauge 3: Thermal */}
        <div className="p-5 rounded-2xl glass-panel border border-[#263449] space-y-1">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-[11px] font-mono">Bus Temp</span>
            <Thermometer className="w-4 h-4 text-[#FBBF24]" />
          </div>
          <div className="text-2xl font-bold font-display text-white">
            {satellite.internalTempC}°C
          </div>
          <span className={`text-[10px] font-mono block ${satellite.internalTempC > 30 ? 'text-[#FB7185]' : 'text-[#34D399]'}`}>
            {satellite.internalTempC > 30 ? 'Elevated Heat' : 'Equilibrium'}
          </span>
        </div>

        {/* Gauge 4: RF Transponder */}
        <div className="p-5 rounded-2xl glass-panel border border-[#263449] space-y-1">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-[11px] font-mono">Signal RSSI</span>
            <Radio className="w-4 h-4 text-[#818CF8]" />
          </div>
          <div className="text-2xl font-bold font-display text-white">
            {satellite.signalStrengthDbm} <span className="text-xs font-normal text-[#94A3B8]">dBm</span>
          </div>
          <span className="text-[10px] font-mono text-slate-300 block">Link Lock Nominal</span>
        </div>
      </div>

      {/* Orbital Parameters & Historical Telemetry Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Orbital Mechanics Parameters */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-panel border border-[#263449] space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-[#263449]">
            <Cpu className="w-4 h-4 text-[#38BDF8]" />
            <h3 className="text-sm font-display font-semibold text-white">Keplerian Orbital Elements</h3>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1 border-b border-[#263449]/40 text-[#94A3B8]">
              <span>Semi-major Axis Altitude:</span>
              <span className="text-white font-bold">{satellite.altitudeKm} km</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#263449]/40 text-[#94A3B8]">
              <span>Orbital Inclination:</span>
              <span className="text-white font-bold">{satellite.inclinationDeg}°</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#263449]/40 text-[#94A3B8]">
              <span>Orbital Period:</span>
              <span className="text-white font-bold">{satellite.periodMinutes} min</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#263449]/40 text-[#94A3B8]">
              <span>Orbital Velocity:</span>
              <span className="text-white font-bold">{satellite.velocityKmS} km/s</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#263449]/40 text-[#94A3B8]">
              <span>Eccentricity (e):</span>
              <span className="text-white font-bold">{satellite.eccentricity || '0.000624'}</span>
            </div>
            <div className="flex justify-between py-1 text-[#94A3B8]">
              <span>Apogee / Perigee:</span>
              <span className="text-white font-bold">{satellite.apogeeKm} km / {satellite.perigeeKm} km</span>
            </div>
          </div>

          {/* TLE Lines Display */}
          {satellite.tle && (
            <div className="pt-3 border-t border-[#263449]">
              <span className="text-[10px] font-mono text-[#38BDF8] uppercase tracking-wider block mb-1">
                Authoritative Two-Line Element (TLE)
              </span>
              <div className="p-3 rounded-lg bg-[#070B14] border border-[#263449] font-mono text-[10px] text-slate-300 space-y-1 overflow-x-auto">
                <p>{satellite.tle.line1}</p>
                <p>{satellite.tle.line2}</p>
              </div>
            </div>
          )}
        </div>

        {/* Real-time Telemetry Historical Chart */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-panel border border-[#263449] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#263449]">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-[#38BDF8]" />
              <h3 className="text-sm font-display font-semibold text-white">Power & Thermal Time-Series</h3>
            </div>
            <span className="text-[11px] font-mono text-[#34D399]">Live Sampling</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={telemetrySeries}>
                <defs>
                  <linearGradient id="colorVoltage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="timeLabel" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip contentStyle={{ backgroundColor: '#111C2E', borderColor: '#263449', fontSize: '11px', color: '#fff' }} />
                <Area type="monotone" dataKey="busVoltage" name="Bus Voltage (V)" stroke="#38BDF8" strokeWidth={2} fill="url(#colorVoltage)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Correlated Upcoming Passes */}
      <div className="p-6 rounded-2xl glass-panel border border-[#263449] space-y-4">
        <h3 className="text-sm font-display font-semibold text-white">Ground Station Passes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          {satellite.upcomingPasses && satellite.upcomingPasses.length > 0 ? (
            satellite.upcomingPasses.map((p) => (
              <div key={p.id} className="p-4 rounded-xl bg-[#070B14] border border-[#263449] flex justify-between items-center">
                <div>
                  <span className="text-white font-bold block">{p.groundStationName}</span>
                  <span className="text-[#94A3B8] text-[11px]">{p.frequencyBand} • Duration {p.durationMinutes} min</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#38BDF8] block">Max Elev: {p.maxElevationDeg}°</span>
                  <span className="text-[10px] text-slate-400">{new Date(p.aos).toLocaleTimeString()}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-[#94A3B8]">No direct ground passes currently in acquisition window.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SatelliteDetail;
