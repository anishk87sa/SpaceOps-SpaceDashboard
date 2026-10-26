import React from 'react';
import { RefreshCw, Server, Database, CheckCircle2, AlertTriangle, XCircle, Shield, Radio } from 'lucide-react';
import { useApiHealth } from '../../hooks/useApiHealth';

export function Dashboard() {
  const { health, loading, error, refresh } = useApiHealth();

  return (
    <div className="space-y-8">
      {/* Hero Welcome / Platform Status */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 sm:p-8 border border-cyan-900/40 glow-subtle">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 text-xs font-mono mb-3">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>SPACE OPERATIONS TELEMETRY & CONTROL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide">
              SpaceOps Intelligence Shell
            </h1>
            <p className="mt-2 text-sm text-slate-400 max-w-2xl leading-relaxed">
              Foundational architecture environment initialized. This control console validates client-server IPC,
              database readiness checks, and security infrastructure.
            </p>
          </div>

          <button
            onClick={refresh}
            disabled={loading}
            className="self-start md:self-auto inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 font-mono text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Ping Backend</span>
          </button>
        </div>
      </div>

      {/* Backend Health & Connection Diagnostic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: API Server Connectivity */}
        <div className="glass-panel rounded-xl p-5 border border-slate-800/80">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-4">
            <div className="flex items-center space-x-2.5">
              <Server className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-semibold text-slate-200">Express API Gateway</h2>
            </div>
            {loading ? (
              <span className="text-xs text-slate-500 font-mono animate-pulse">Probing...</span>
            ) : error ? (
              <span className="inline-flex items-center space-x-1 text-xs text-rose-400 font-mono">
                <XCircle className="w-3.5 h-3.5" />
                <span>OFFLINE</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 text-xs text-cyan-400 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{health?.status?.toUpperCase()}</span>
              </span>
            )}
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Target URL:</span>
              <span className="text-slate-200 truncate max-w-[180px]">
                {import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>HTTP Status:</span>
              <span className={error ? 'text-rose-400' : 'text-cyan-300'}>
                {loading ? '---' : error ? 'Disconnected' : '200 OK'}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Uptime:</span>
              <span className="text-slate-300">
                {loading ? '---' : health?.uptimeSeconds ? `${health.uptimeSeconds}s` : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Database Readiness */}
        <div className="glass-panel rounded-xl p-5 border border-slate-800/80">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-4">
            <div className="flex items-center space-x-2.5">
              <Database className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-semibold text-slate-200">MongoDB Readiness</h2>
            </div>
            {loading ? (
              <span className="text-xs text-slate-500 font-mono animate-pulse">Checking...</span>
            ) : health?.dependencies?.database?.connected ? (
              <span className="inline-flex items-center space-x-1 text-xs text-emerald-400 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>CONNECTED</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 text-xs text-amber-400 font-mono">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>STANDALONE</span>
              </span>
            )}
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>Config State:</span>
              <span className="text-slate-200">
                {health?.dependencies?.database?.configured ? 'Configured' : 'Detached Mode'}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Connection:</span>
              <span className={health?.dependencies?.database?.connected ? 'text-emerald-400' : 'text-amber-400'}>
                {health?.dependencies?.database?.status || (error ? 'Unknown' : 'Unconfigured')}
              </span>
            </div>
            <p className="pt-1 text-[11px] text-slate-400 leading-normal">
              {health?.dependencies?.database?.message || 'Database credentials optional during initial project setup.'}
            </p>
          </div>
        </div>

        {/* Card 3: Security & Environment */}
        <div className="glass-panel rounded-xl p-5 border border-slate-800/80">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-4">
            <div className="flex items-center space-x-2.5">
              <Shield className="w-4 h-4 text-indigo-400" />
              <h2 className="text-sm font-semibold text-slate-200">Security & Isolation</h2>
            </div>
            <span className="inline-flex items-center space-x-1 text-xs text-indigo-300 font-mono">
              <span>ACTIVE</span>
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>CORS Policy:</span>
              <span className="text-slate-200">Explicit Origin</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Helmet Headers:</span>
              <span className="text-cyan-300">Enabled</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Environment:</span>
              <span className="text-slate-300">{health?.environment || 'development'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Connection State Alert */}
      {error && (
        <div className="rounded-xl bg-amber-950/30 border border-amber-800/40 p-4 flex items-start space-x-3 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-slate-300">
            <p className="font-semibold text-amber-300">Standalone Frontend Mode Active</p>
            <p>
              The frontend is running independently without the backend API server. To establish end-to-end communication,
              start the backend server using <code className="px-1.5 py-0.5 bg-slate-900 rounded text-cyan-300 font-mono">npm run dev:server</code> or run both together with <code className="px-1.5 py-0.5 bg-slate-900 rounded text-cyan-300 font-mono">npm run dev</code>.
            </p>
          </div>
        </div>
      )}

      {/* Foundation Architecture Notice */}
      <div className="glass-panel rounded-xl p-6 border border-slate-800/60">
        <h3 className="text-sm font-semibold text-slate-200 font-display mb-3">
          Architecture Milestone Roadmap
        </h3>
        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          The foundational infrastructure separates the client, server, and data tiers with centralized API services and strict security middleware.
          Future milestones will integrate live launch schedules, telemetry graphs, mission manifests, and tracking watchlists.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
            <span className="text-cyan-400 font-bold block mb-1">01 / Foundation</span>
            <span className="text-slate-300">Client, Server & Config</span>
            <span className="text-[10px] text-emerald-400 block mt-1">Ready</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/30 border border-slate-800/40 opacity-70">
            <span className="text-slate-400 font-bold block mb-1">02 / Telemetry</span>
            <span className="text-slate-400">Launch Schedules</span>
            <span className="text-[10px] text-slate-500 block mt-1">Next Milestone</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/30 border border-slate-800/40 opacity-70">
            <span className="text-slate-400 font-bold block mb-1">03 / Missions</span>
            <span className="text-slate-400">Spacecraft & Payloads</span>
            <span className="text-[10px] text-slate-500 block mt-1">Pending</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/30 border border-slate-800/40 opacity-70">
            <span className="text-slate-400 font-bold block mb-1">04 / Watchlist</span>
            <span className="text-slate-400">Persistence & Alerts</span>
            <span className="text-[10px] text-slate-500 block mt-1">Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
}
