import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Satellite,
  Radio,
  Calendar,
  AlertTriangle,
  Activity,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  Server,
  Database,
  TrendingUp,
} from 'lucide-react';
import { apiClient } from '../../services/api/client';
import { OrbitalGlobe } from '../../components/orbital/OrbitalGlobe';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export function DashboardOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSat, setSelectedSat] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.getDashboardOverview();
      setData(res?.data || null);
    } catch (err) {
      setError(err.message || 'Failed to load live flight telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const metrics = data?.metrics;
  const recentAlerts = data?.recentAlerts || [];
  const upcomingPasses = data?.upcomingPasses || [];
  const activeMissions = data?.activeMissions || [];
  const fleetSample = data?.fleetSample || [];

  const trendData = [
    { time: 'T-10h', rate: 1380 },
    { time: 'T-8h', rate: 1420 },
    { time: 'T-6h', rate: 1510 },
    { time: 'T-4h', rate: 1490 },
    { time: 'T-2h', rate: 1620 },
    { time: 'Now', rate: 1580 },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#263449]">
        <div>
          <span className="text-xs font-mono text-[#38BDF8] uppercase tracking-wider block">
            System Operations Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide">
            Flight Dynamics Command Console
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-[#111C2E] hover:bg-[#162338] text-[#38BDF8] border border-[#263449] font-mono text-xs uppercase transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh State</span>
          </button>
          <Link
            to="/app/orbital"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#38BDF8] hover:bg-sky-400 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider shadow-lg glow-cyan"
          >
            <span>Full 3D Orbit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: Total Missions */}
        <div className="p-4 rounded-xl glass-panel border border-[#263449] space-y-1">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-[11px] font-mono">Missions</span>
            <Compass className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="text-2xl font-bold font-display text-white">
            {metrics?.missions?.total || 5}
          </div>
          <span className="text-[10px] font-mono text-[#34D399] block">
            {metrics?.missions?.active || 3} Active Operations
          </span>
        </div>

        {/* Card 2: Satellites */}
        <div className="p-4 rounded-xl glass-panel border border-[#263449] space-y-1">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-[11px] font-mono">Satellites</span>
            <Satellite className="w-4 h-4 text-[#818CF8]" />
          </div>
          <div className="text-2xl font-bold font-display text-white">
            {metrics?.satellites?.total || 7}
          </div>
          <span className="text-[10px] font-mono text-[#34D399] block">
            {metrics?.satellites?.operational || 6} Nominal Health
          </span>
        </div>

        {/* Card 3: Needing Attention */}
        <div className="p-4 rounded-xl glass-panel border border-[#263449] space-y-1">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-[11px] font-mono">Attention</span>
            <AlertTriangle className="w-4 h-4 text-[#FBBF24]" />
          </div>
          <div className="text-2xl font-bold font-display text-[#FBBF24]">
            {metrics?.satellites?.requiringAttention || 1}
          </div>
          <span className="text-[10px] font-mono text-[#94A3B8] block">Starlink-4182 Warm</span>
        </div>

        {/* Card 4: Upcoming Passes */}
        <div className="p-4 rounded-xl glass-panel border border-[#263449] space-y-1">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-[11px] font-mono">Next Passes</span>
            <Calendar className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="text-2xl font-bold font-display text-white">
            {metrics?.communications?.upcomingPassesCount || 4}
          </div>
          <span className="text-[10px] font-mono text-[#38BDF8] block">Next in 8 min</span>
        </div>

        {/* Card 5: Ground Stations */}
        <div className="p-4 rounded-xl glass-panel border border-[#263449] space-y-1">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-[11px] font-mono">Ground Sites</span>
            <Radio className="w-4 h-4 text-[#34D399]" />
          </div>
          <div className="text-2xl font-bold font-display text-white">
            {metrics?.communications?.groundStationsOnline || 5} / {metrics?.communications?.totalGroundStations || 6}
          </div>
          <span className="text-[10px] font-mono text-slate-400 block">1 In Maintenance</span>
        </div>

        {/* Card 6: Telemetry Rates */}
        <div className="p-4 rounded-xl glass-panel border border-[#263449] space-y-1">
          <div className="flex items-center justify-between text-[#94A3B8]">
            <span className="text-[11px] font-mono">Ingestion</span>
            <Activity className="w-4 h-4 text-[#38BDF8]" />
          </div>
          <div className="text-2xl font-bold font-display text-white">
            {metrics?.system?.dataIngestionRatePps || 1420} <span className="text-xs font-normal text-slate-400">pps</span>
          </div>
          <span className="text-[10px] font-mono text-[#34D399] block">
            Latency {metrics?.system?.telemetryFreshnessMs || 240}ms
          </span>
        </div>
      </div>

      {/* Main Center Split: 3D Globe + Upcoming Passes & Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 3D Orbital HUD */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-display font-bold text-white flex items-center space-x-2">
              <span>Orbital Fleet Overview</span>
              <span className="text-xs font-mono text-[#38BDF8] font-normal">(Interactive 3D)</span>
            </h2>
            <Link to="/app/satellites" className="text-xs font-mono text-[#38BDF8] hover:underline">
              View All Satellites →
            </Link>
          </div>
          <OrbitalGlobe
            satellites={fleetSample}
            selectedSatelliteId={selectedSat?.id}
            onSelectSatellite={(sat) => setSelectedSat(sat)}
            height="460px"
          />
        </div>

        {/* Right Column: Pass Schedule & Active Events */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upcoming Passes Panel */}
          <div className="p-5 rounded-2xl glass-panel border border-[#263449] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#263449]">
              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-[#38BDF8]" />
                <h3 className="text-sm font-display font-semibold text-white">Upcoming Ground Contacts</h3>
              </div>
              <Link to="/app/communication-passes" className="text-[11px] font-mono text-[#38BDF8] hover:underline">
                Full Calendar
              </Link>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              {upcomingPasses.map((p) => (
                <div key={p.id} className="p-3 rounded-xl bg-[#070B14]/70 border border-[#263449] flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white block">{p.satelliteName}</span>
                    <span className="text-[11px] text-[#94A3B8]">{p.groundStationName} • {p.frequencyBand}</span>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.status === 'active' ? 'bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/30' : 'bg-[#111C2E] text-[#38BDF8]'
                    }`}>
                      {p.status === 'active' ? 'IN CONTACT' : `${Math.floor(p.durationMinutes)} min pass`}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-1">Elev {p.maxElevationDeg}°</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Alerts Feed */}
          <div className="p-5 rounded-2xl glass-panel border border-[#263449] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#263449]">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-[#FB7185]" />
                <h3 className="text-sm font-display font-semibold text-white">Critical & Warning Alerts</h3>
              </div>
              <Link to="/app/alerts" className="text-[11px] font-mono text-[#38BDF8] hover:underline">
                Alert Console
              </Link>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              {recentAlerts.slice(0, 3).map((a) => (
                <div key={a.id} className="p-3 rounded-xl bg-[#070B14]/70 border border-[#263449] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                      a.severity === 'critical' ? 'bg-[#FB7185]/20 text-[#FB7185]' : 'bg-[#FBBF24]/20 text-[#FBBF24]'
                    }`}>
                      {a.severity}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-white font-medium text-[11px] truncate">{a.title}</p>
                  <p className="text-[10px] text-slate-400">{a.assetName}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Operations Timeline & Telemetry Trends Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Missions Quick Status */}
        <div className="lg:col-span-6 p-6 rounded-2xl glass-panel border border-[#263449] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#263449]">
            <h3 className="text-sm font-display font-semibold text-white">Active Flight Missions</h3>
            <Link to="/app/missions" className="text-xs font-mono text-[#38BDF8] hover:underline">
              Manage Missions
            </Link>
          </div>
          <div className="space-y-3 font-mono text-xs">
            {activeMissions.map((m) => (
              <div key={m.id} className="p-3.5 rounded-xl bg-[#070B14]/60 border border-[#263449] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">{m.name}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-sky-950 text-[#38BDF8] border border-sky-800/40">
                    {m.code}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-[#94A3B8]">
                  <span>Progress: {m.progress}%</span>
                  <span>{m.type}</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-[#111C2E] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#38BDF8] to-[#34D399]" style={{ width: `${m.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Telemetry Frame Ingestion Rates */}
        <div className="lg:col-span-6 p-6 rounded-2xl glass-panel border border-[#263449] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#263449]">
            <h3 className="text-sm font-display font-semibold text-white">Telemetry Packet Ingestion Trend</h3>
            <span className="text-xs font-mono text-[#34D399]">1,420 pps Average</span>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111C2E', borderColor: '#263449', fontSize: '11px', color: '#fff' }} />
                <Area type="monotone" dataKey="rate" stroke="#38BDF8" fill="#38BDF8" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardOverview;
