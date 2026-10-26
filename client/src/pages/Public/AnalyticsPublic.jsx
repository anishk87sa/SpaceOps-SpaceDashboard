import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp, Cpu, Database, CheckCircle2, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export function AnalyticsPublic() {
  const chartData = [
    { name: 'Power / EPS', nominal: 98, warning: 2 },
    { name: 'ADCS / Gyro', nominal: 94, warning: 6 },
    { name: 'Thermal', nominal: 91, warning: 9 },
    { name: 'Comms / RF', nominal: 99, warning: 1 },
    { name: 'Payload', nominal: 96, warning: 4 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="max-w-3xl">
        <span className="text-xs font-mono uppercase tracking-widest text-[#38BDF8] font-semibold block mb-3">
          Telemetry Intelligence
        </span>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-white tracking-tight">
          Operational Analytics & Predictive Fleet Diagnostics
        </h1>
        <p className="mt-4 text-base text-[#94A3B8] leading-relaxed">
          Transform raw frame buffers and engineering parameters into actionable performance indicators,
          availability trends, and automated compliance reports.
        </p>
      </div>

      <div className="p-8 rounded-3xl glass-panel border border-[#263449]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-display font-bold text-white">Subsystem State-of-Health Breakdown (%)</h3>
            <p className="text-xs text-[#94A3B8] font-mono mt-1">Cross-fleet telemetry nominal vs warning deviation ratios</p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded bg-[#111C2E] border border-[#263449] text-[#34D399]">
            Fleet Overall: 99.4% Nominal
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111C2E', borderColor: '#263449', fontSize: '11px', color: '#fff' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="nominal" name="Nominal %" fill="#38BDF8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="warning" name="Warning Excursion %" fill="#FB7185" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono">
        <div className="p-6 rounded-2xl bg-[#0D1422] border border-[#263449]">
          <span className="text-[#38BDF8] font-bold block mb-1">Pass Duration Efficacy</span>
          <p className="text-[#94A3B8] leading-relaxed">
            Measures actual contact RF duration against predicted line-of-sight geometry to audit antenna motor latency.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-[#0D1422] border border-[#263449]">
          <span className="text-[#34D399] font-bold block mb-1">Battery Depth-of-Discharge</span>
          <p className="text-[#94A3B8] leading-relaxed">
            Historical cycle analytics predicting lithium-ion battery capacity decay across thousands of solar eclipse transitions.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-[#0D1422] border border-[#263449]">
          <span className="text-[#818CF8] font-bold block mb-1">CSV & PDF Report Generation</span>
          <p className="text-[#94A3B8] leading-relaxed">
            Export flight audit manifests, orbital ephemeris tables, and payload performance telemetry with cryptographic timestamps.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPublic;
