import React from 'react';
import {
  Satellite,
  Activity,
  Database,
  Radio,
  Clock,
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';

export function GlobeStatusBar({
  totalSatellites = 0,
  visibleSatellites = 0,
  dataSource = 'CelesTrak GP API',
  lastRefreshTime = null,
  dataQualityStatus = 'nominal',
  onManualRefresh = () => {},
  isRefreshing = false,
}) {
  return (
    <div className="h-9 px-4 bg-[#070B14]/95 border-t border-[#263449] backdrop-blur-md flex items-center justify-between text-[11px] font-mono text-slate-400 select-none z-20">
      {/* Left: Satellite Counts */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1.5 text-white">
          <Satellite className="w-3.5 h-3.5 text-sky-400" />
          <span>
            <strong className="text-sky-400">{visibleSatellites}</strong> / {totalSatellites} Assets Rendered
          </span>
        </div>

        <div className="hidden md:flex items-center space-x-1.5">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>Engine: <span className="text-slate-300">SGP4 Analytical Propagation</span></span>
        </div>
      </div>

      {/* Center: Source & Quality */}
      <div className="hidden lg:flex items-center space-x-3">
        <div className="flex items-center space-x-1.5">
          <Database className="w-3.5 h-3.5 text-sky-400" />
          <span>Source: <span className="text-slate-300">{dataSource}</span></span>
        </div>

        <span className="text-slate-600">•</span>

        <div className="flex items-center space-x-1.5">
          {dataQualityStatus === 'nominal' ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          )}
          <span className={dataQualityStatus === 'nominal' ? 'text-emerald-400' : 'text-amber-400'}>
            {dataQualityStatus === 'nominal' ? 'FRESH TELEMETRY' : 'CACHE FALLBACK'}
          </span>
        </div>
      </div>

      {/* Right: Last Refresh Time & Refresh Button */}
      <div className="flex items-center space-x-3">
        {lastRefreshTime && (
          <span className="hidden sm:inline text-slate-500">
            Updated: {new Date(lastRefreshTime).toLocaleTimeString()}
          </span>
        )}

        <button
          onClick={onManualRefresh}
          disabled={isRefreshing}
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          title="Refresh CelesTrak Orbital Data"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
        </button>
      </div>
    </div>
  );
}

export default GlobeStatusBar;
