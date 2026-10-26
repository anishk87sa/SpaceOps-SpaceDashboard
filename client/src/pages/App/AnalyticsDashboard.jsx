import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  FileText,
  Activity,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { apiClient } from '../../services/api/client';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('fleet_status');
  const [reportGenerating, setReportGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await apiClient.getAnalytics();
        setAnalytics(res?.data || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleGenerateReport = async () => {
    setReportGenerating(true);
    try {
      const res = await apiClient.generateReport({ reportType, timeframe: '30d' });
      setGeneratedReport(res.data);
    } catch (err) {
      alert('Error generating report: ' + err.message);
    } finally {
      setReportGenerating(false);
    }
  };

  const handleDownloadCsv = () => {
    if (!generatedReport?.csvContent) return;
    const blob = new Blob([generatedReport.csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `spaceops_${reportType}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fleetAvailability = analytics?.fleetAvailability || [];
  const subsystemHealth = analytics?.subsystemHealth || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#263449]">
        <div>
          <span className="text-xs font-mono text-[#38BDF8] uppercase tracking-wider block">
            Fleet Intelligence & Diagnostics
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide">
            Operational Analytics & Reports
          </h1>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-[#34D399]">
          <CheckCircle2 className="w-4 h-4" />
          <span>Fleet Health Aggregate 99.8%</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Fleet Availability Over Months */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-panel border border-[#263449] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#263449]">
            <h3 className="text-sm font-display font-semibold text-white">Monthly Fleet Operational Uptime (%)</h3>
            <span className="text-xs font-mono text-[#38BDF8]">6-Month Rolling Window</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fleetAvailability}>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[98, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#111C2E', borderColor: '#263449', fontSize: '11px', color: '#fff' }} />
                <Line type="monotone" dataKey="availability" stroke="#38BDF8" strokeWidth={3} dot={{ fill: '#38BDF8', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Subsystem Health Ratios */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-panel border border-[#263449] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#263449]">
            <h3 className="text-sm font-display font-semibold text-white">Subsystem Deviation</h3>
            <span className="text-xs font-mono text-[#34D399]">Nominal vs Warning</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subsystemHealth} layout="vertical">
                <XAxis type="number" stroke="#94A3B8" fontSize={10} tickLine={false} domain={[85, 100]} />
                <YAxis dataKey="subsystem" type="category" stroke="#94A3B8" fontSize={10} tickLine={false} width={80} />
                <Tooltip contentStyle={{ backgroundColor: '#111C2E', borderColor: '#263449', fontSize: '11px', color: '#fff' }} />
                <Bar dataKey="nominal" fill="#38BDF8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Automated Report Builder Tool */}
      <div className="p-8 rounded-3xl glass-panel border border-[#263449] space-y-6">
        <div className="flex items-center space-x-3 pb-3 border-b border-[#263449]">
          <FileText className="w-5 h-5 text-[#38BDF8]" />
          <div>
            <h3 className="text-base font-display font-bold text-white">Automated Flight Operations Report Builder</h3>
            <p className="text-xs font-mono text-[#94A3B8]">Generate structured audit manifests for mission reviews.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div>
            <label className="block text-[#94A3B8] mb-1">Select Report Schema</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#38BDF8]"
            >
              <option value="fleet_status">Fleet Status & Orbit Ephemeris</option>
              <option value="passes_audit">Ground Pass Contact Manifest</option>
              <option value="telemetry_quality">Telemetry Frame Loss & Ingestion</option>
            </select>
          </div>

          <div>
            <label className="block text-[#94A3B8] mb-1">Audit Timeframe</label>
            <select className="w-full bg-[#111C2E] border border-[#263449] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-[#38BDF8]">
              <option value="30d">Last 30 Days Operations</option>
              <option value="90d">Quarterly Mission Assessment</option>
              <option value="all">Full Flight Lifetime History</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerateReport}
              disabled={reportGenerating}
              className="w-full py-2.5 rounded-xl bg-[#38BDF8] hover:bg-sky-400 text-slate-950 font-bold uppercase transition-all cursor-pointer"
            >
              {reportGenerating ? 'Compiling Metrics...' : 'Compile Report Preview'}
            </button>
          </div>
        </div>

        {/* Generated Report Preview Area */}
        {generatedReport && (
          <div className="p-6 rounded-2xl bg-[#070B14] border border-[#263449] space-y-4 font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-white font-bold block">Generated Report: {generatedReport.reportId}</span>
                <span className="text-[#94A3B8] text-[11px]">
                  Generated: {new Date(generatedReport.generatedAt).toLocaleString()} by {generatedReport.generatedBy}
                </span>
              </div>
              <button
                onClick={handleDownloadCsv}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#34D399] hover:bg-emerald-400 text-slate-950 font-bold uppercase"
              >
                <Download className="w-4 h-4" />
                <span>Download CSV Manifest</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-[#0D1422] border border-[#263449] text-slate-300 text-[10px] overflow-x-auto max-h-40">
              {generatedReport.csvContent}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
