import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Rewind,
  Clock,
  Radio,
} from 'lucide-react';

export function TimeControls({
  simulationTime = new Date(),
  isPlaying = true,
  onTogglePlay = () => {},
  speedMultiplier = 1,
  onChangeSpeed = () => {},
  onResetToNow = () => {},
  onStepTime = () => {},
  isLive = true,
}) {
  const speeds = [1, 5, 15, 60, 300];

  const formatUtcTime = (date) => {
    try {
      const d = date instanceof Date ? date : new Date(date);
      return d.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    } catch (e) {
      return '';
    }
  };

  return (
    <div className="flex items-center space-x-2 sm:space-x-3 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl bg-[#0D1422]/90 border border-[#263449] backdrop-blur-xl shadow-2xl text-xs font-mono text-[#F1F5F9]">
      {/* Live / Simulated Telemetry Badge */}
      <div className="flex items-center space-x-1.5 pr-2 border-r border-[#263449]">
        <span
          className={`relative flex h-2 w-2 ${
            isLive ? 'text-emerald-400' : 'text-amber-400'
          }`}
        >
          {isLive && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isLive ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
          ></span>
        </span>
        <span className={`text-[10px] font-bold tracking-wider ${isLive ? 'text-emerald-400' : 'text-amber-400'}`}>
          {isLive ? 'LIVE' : 'SIMULATED'}
        </span>
      </div>

      {/* Play / Pause Toggle */}
      <button
        onClick={onTogglePlay}
        className="p-1.5 rounded-lg bg-[#111C2E] hover:bg-[#162338] text-sky-400 hover:text-white transition-colors cursor-pointer border border-[#263449]"
        title={isPlaying ? 'Pause Simulation Clock' : 'Resume Simulation Clock'}
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
      </button>

      {/* Step -15m */}
      <button
        onClick={() => onStepTime(-15 * 60 * 1000)}
        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#111C2E] transition-colors cursor-pointer"
        title="Step Backward 15 Minutes"
      >
        <Rewind className="w-3.5 h-3.5" />
      </button>

      {/* Step +15m */}
      <button
        onClick={() => onStepTime(15 * 60 * 1000)}
        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#111C2E] transition-colors cursor-pointer"
        title="Step Forward 15 Minutes"
      >
        <FastForward className="w-3.5 h-3.5" />
      </button>

      {/* Speed Multipliers */}
      <div className="hidden sm:flex items-center space-x-1 pl-1">
        {speeds.map((s) => (
          <button
            key={s}
            onClick={() => onChangeSpeed(s)}
            className={`px-1.5 py-0.5 rounded text-[10px] transition-all cursor-pointer ${
              speedMultiplier === s
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                : 'text-slate-400 hover:text-white hover:bg-[#111C2E]'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>

      {/* Time Display */}
      <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded-lg bg-[#111C2E]/80 text-[11px] text-slate-300 border border-[#263449]">
        <Clock className="w-3 h-3 text-sky-400" />
        <span className="tabular-nums">{formatUtcTime(simulationTime)}</span>
      </div>

      {/* Reset to Now Button */}
      {!isLive && (
        <button
          onClick={onResetToNow}
          className="flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all text-[10px] cursor-pointer"
          title="Reset simulation to current real-world time"
        >
          <RotateCcw className="w-3 h-3" />
          <span>RESET NOW</span>
        </button>
      )}
    </div>
  );
}

export default TimeControls;
