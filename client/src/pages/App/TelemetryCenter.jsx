import React, { useEffect, useState } from 'react';
import { Activity, RefreshCw, Filter, Download, Zap, Thermometer, Radio, Cpu } from 'lucide-react';
import { apiClient } from '../../services/api/client';
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export function TelemetryCenter() {
  const [satellites, setSatellites] = useState([]);
  const [selectedSatId, setSelectedSatId] = useState('sat-iss-alpha');
  const [timeframeHours, setTimeframeHours] = useState(12);
  const [telemetry, setTelemetry] = useState(null);
  const [activeParameter, setActiveParameter] = useState('busVoltage');
  const [loading, setLoading] = useState(true);

  // Fetch satellite list for dropdown
  useEffect(() => {
    const initSatellites = async () => {
      try {
        const res = await apiClient.getSatellites();
        setSatellites(res?.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    initSatellites();
  }, []);

  const fetchTelemetry = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getTelemetry({ satelliteId: selectedSatId, hours: timeframeHours });
      setTelemetry(res?.data || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, [selectedSatId, timeframeHours]);

  const series = telemetry?.series || [];

  const parameterConfig = {
    busVoltage: { label: 'EPS Bus Voltage', unit: 'V', color: '#38BDF8', icon: Zap },
    batteryTempC: { label: 'Battery Core Temp', unit: '°C', color: '#FBBF24', icon: Thermometer },
    solarArrayKw: { label: 'Solar Array Output', unit: 'kW', color: '#34D399', icon: Zap },
    reactionWheelRpm: { label: 'Reaction Wheel Speed', unit: 'RPM', color: '#818CF8', icon: Cpu },
    transponderRssiDbm: { label: 'RF Downlink RSSI', unit: 'dBm', color: '#FB7185', icon: Radio },
  };

  const currentParam = parameterConfig[activeParameter];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#263449]">
        <div>
          <span className="text-xs font-mono text-[#38BDF8] uppercase tracking-wider block">
            Subsystem Engineering Diagnostic
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide">
            Telemetry Exploration Center
          </h1>
        </div>

        <button
          onClick={fetchTelemetry}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-[#111C2E] hover:bg-[#162338] text-[#38BDF8] border border-[#263449] font-mono text-xs uppercase cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data Feed</span>
        </button>
      </div>

      {/* Control & Selection Bar */}
      <div className="p-4 rounded-xl glass-panel border border-[#263449] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        {/* Satellite Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-[#94A3B8]">Target Satellite:</span>
          <select
            value={selectedSatId}
            onChange={(e) => setSelectedSatId(e.target.value)}
            className="bg-[#111C2E] border border-[#263449] rounded-lg px-3 py-1.5 text-white focus:outline-none focus:border-[#38BDF8]"
          >
            {satellites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} (#{s.noradId})
              </option>
            ))}
          </select>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center space-x-1.5">
          <span className="text-[#94A3B8]">Window:</span>
          {[6, 12, 24, 48].map((h) => (
            <button
              key={h}
              onClick={() => setTimeframeHours(h)}
              className={`px-2.5 py-1 rounded-lg cursor-pointer ${
                timeframeHours === h
                  ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40 font-bold'
                  : 'text-[#94A3B8] hover:bg-[#111C2E]'
              }`}
            >
              {h}h
            </button>
          ))}
        </div>
      </div>

      {/* Parameter Selector Pills */}
      <div className="flex flex-wrap gap-2 font-mono text-xs">
        {Object.entries(parameterConfig).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <button
              key={key}
              onClick={() => setActiveParameter(key)}
              className={`px-3 py-2 rounded-xl flex items-center space-x-2 border transition-all cursor-pointer ${
                activeParameter === key
                  ? 'bg-[#162338] border-[#38BDF8] text-white shadow-md'
                  : 'bg-[#0D1422] border-[#263449] text-[#94A3B8] hover:text-white hover:bg-[#111C2E]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
              <span>{cfg.label}</span>
              <span className="text-[10px] text-slate-500">({cfg.unit})</span>
            </button>
          );
        })}
      </div>

      {/* Main Large Telemetry Chart */}
      <div className="p-6 rounded-2xl glass-panel border border-[#263449] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#263449]">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-[#38BDF8]" />
            <h3 className="text-sm font-display font-semibold text-white">
              {currentParam?.label} vs Elapsed Time
            </h3>
          </div>
          <span className="text-xs font-mono text-[#34D399]">
            Signal Integrity: Nominal (Quality Score 100%)
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series}>
              <defs>
                <linearGradient id="paramGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={currentParam?.color} stopOpacity={0.35}/>
                  <stop offset="95%" stopColor={currentParam?.color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="timeLabel" stroke="#94A3B8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} unit={` ${currentParam?.unit}`} domain={['auto', 'auto']} />
              <Tooltip contentStyle={{ backgroundColor: '#111C2E', borderColor: '#263449', fontSize: '11px', color: '#fff' }} />
              <Area type="monotone" dataKey={activeParameter} stroke={currentParam?.color} strokeWidth={2} fill="url(#paramGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical Telemetry Frame Data Table */}
      <div className="rounded-2xl glass-panel border border-[#263449] overflow-hidden">
        <div className="p-4 bg-[#0D1422] border-b border-[#263449] flex justify-between items-center">
          <h4 className="text-xs font-mono text-white uppercase font-bold">Downlinked Telemetry Frame Log</h4>
          <span className="text-[11px] font-mono text-[#94A3B8]">{series.length} Frame Samples</span>
        </div>
        <div className="overflow-x-auto max-h-72">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#111C2E] text-[#94A3B8] text-[10px] uppercase sticky top-0">
              <tr>
                <th className="px-6 py-2.5">UTC Timestamp</th>
                <th className="px-6 py-2.5">Bus Voltage (V)</th>
                <th className="px-6 py-2.5">Battery Temp (°C)</th>
                <th className="px-6 py-2.5">Solar Output (kW)</th>
                <th className="px-6 py-2.5">Reaction Wheel (RPM)</th>
                <th className="px-6 py-2.5">Downlink RSSI</th>
                <th className="px-6 py-2.5">Quality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#263449]/50">
              {series.map((row, i) => (
                <tr key={i} className="hover:bg-[#111C2E]/50">
                  <td className="px-6 py-2.5 text-slate-300">{new Date(row.timestamp).toLocaleTimeString()}</td>
                  <td className="px-6 py-2.5 text-white font-bold">{row.busVoltage}</td>
                  <td className="px-6 py-2.5 text-slate-300">{row.batteryTempC}</td>
                  <td className="px-6 py-2.5 text-slate-300">{row.solarArrayKw}</td>
                  <td className="px-6 py-2.5 text-slate-300">{row.reactionWheelRpm}</td>
                  <td className="px-6 py-2.5 text-slate-300">{row.transponderRssiDbm} dBm</td>
                  <td className="px-6 py-2.5">
                    <span className="text-[10px] text-[#34D399] uppercase font-bold">
                      {row.quality}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TelemetryCenter;
