import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Rocket,
  Clock,
  MapPin,
  Search,
  ArrowRight,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  ChevronDown,
  Radio,
  CloudSun,
  Sparkles,
  RotateCcw,
  Layers,
  Filter
} from 'lucide-react';
import { apiClient } from '../../services/api/client';
import { PagePreloader } from '../../components/common/PagePreloader';

export function LaunchTracker() {
  const [launches, setLaunches] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [timeRemaining, setTimeRemaining] = useState({});

  // Active filter state from URL search params
  const selectedMonth = searchParams.get('month') || 'all';
  const searchQuery = searchParams.get('q') || '';
  const selectedProvider = searchParams.get('provider') || 'All';
  const selectedStatus = searchParams.get('status') || 'All';
  const currentSort = searchParams.get('sort') || 'date_asc';

  // Sort dropdown options
  const sortOptions = [
    { label: 'Date: Earliest First', value: 'date_asc' },
    { label: 'Date: Furthest First', value: 'date_desc' },
    { label: 'Mission Name: A–Z', value: 'name_asc' },
    { label: 'Mission Name: Z–A', value: 'name_desc' },
  ];

  // Fetch upcoming 3-month window from backend endpoint
  const fetchUpcoming = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const params = {};
      if (isRefresh) params.refresh = 'true';

      const res = await apiClient.getUpcomingLaunches(params);
      setLaunches(res.data || []);
      setMeta(res.meta || null);
    } catch (err) {
      console.error('Failed to load upcoming launches:', err);
      setError(err.message || 'Unable to connect to Launch Library 2 API sandbox.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUpcoming(false);
  }, [fetchUpcoming]);

  // Precision-aware live countdown timer calculation
  useEffect(() => {
    if (!launches.length) return;

    const calculateTimes = () => {
      const updated = {};
      const now = new Date().getTime();

      launches.forEach((launch) => {
        const targetDateStr = launch.launchDate || launch.plannedLaunchDate;
        if (!targetDateStr) {
          updated[launch.id] = { precision: 'unknown', text: 'Date Pending Confirmation' };
          return;
        }

        const precision = (launch.datePrecision || launch.netPrecision || 'Second').toLowerCase();
        const target = new Date(targetDateStr).getTime();
        const diff = target - now;

        // If precision is Month, Quarter, or Year: never fabricate seconds
        if (precision === 'month' || precision === 'quarter' || precision === 'year') {
          const dateObj = new Date(targetDateStr);
          const monthYear = dateObj.toLocaleDateString(undefined, {
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC',
          });
          updated[launch.id] = {
            precision: 'month',
            formatted: `Target: ${monthYear}`,
            badge: 'Target Month Window',
          };
          return;
        }

        // If precision is Day: show calendar date without ticking seconds
        if (precision === 'day') {
          const dateObj = new Date(targetDateStr);
          const dayDate = dateObj.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            timeZone: 'UTC',
          });
          updated[launch.id] = {
            precision: 'day',
            formatted: `Target Date: ${dayDate}`,
            badge: 'Day Window',
          };
          return;
        }

        // Second, Minute, or Hour precision: live countdown
        if (diff <= 0) {
          const isSuccess = launch.launchStatus === 'success';
          updated[launch.id] = {
            precision: 'second',
            expired: true,
            formatted: isSuccess ? 'T-00:00:00 (Liftoff Completed)' : 'T-00:00:00 (In Flight / Concluded)',
          };
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);

          updated[launch.id] = {
            precision: 'second',
            expired: false,
            days,
            hours,
            minutes,
            seconds,
            formatted: `T-${days > 0 ? `${days}d ` : ''}${String(hours).padStart(2, '0')}:${String(
              minutes
            ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
          };
        }
      });
      setTimeRemaining(updated);
    };

    calculateTimes();
    const interval = setInterval(calculateTimes, 1000);
    return () => clearInterval(interval);
  }, [launches]);

  // Update URL search parameters
  const updateParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (!val || val === 'All' || val === 'all') {
      next.delete(key);
    } else {
      next.set(key, val);
    }
    setSearchParams(next);
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Derive unique provider and status lists from current dataset
  const dynamicProviders = useMemo(() => {
    const set = new Set();
    launches.forEach((l) => {
      const name = l.provider?.name || l.launchProvider;
      if (name) set.add(name);
    });
    return ['All', ...Array.from(set).sort()];
  }, [launches]);

  const dynamicStatuses = useMemo(() => {
    const set = new Set();
    launches.forEach((l) => {
      const name = l.status?.name || l.scheduleConfidence;
      if (name) set.add(name);
    });
    return ['All', ...Array.from(set).sort()];
  }, [launches]);

  // Client-side filtering and sorting over the 3-month dataset
  const filteredLaunches = useMemo(() => {
    let result = [...launches];

    // Month filter
    if (selectedMonth && selectedMonth !== 'all') {
      result = result.filter((l) => l.monthKey === selectedMonth);
    }

    // Provider filter
    if (selectedProvider && selectedProvider !== 'All') {
      const p = selectedProvider.toLowerCase();
      result = result.filter((l) =>
        (l.provider?.name || l.launchProvider || '').toLowerCase() === p
      );
    }

    // Status filter
    if (selectedStatus && selectedStatus !== 'All') {
      const s = selectedStatus.toLowerCase();
      result = result.filter(
        (l) =>
          (l.status?.name || l.scheduleConfidence || '').toLowerCase() === s ||
          l.launchStatus.toLowerCase() === s
      );
    }

    // Search query
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((l) => {
        return (
          l.name?.toLowerCase().includes(q) ||
          (l.rocket?.name || l.rocket || '').toLowerCase().includes(q) ||
          (l.provider?.name || l.launchProvider || '').toLowerCase().includes(q) ||
          (l.payload || l.mission?.name || '').toLowerCase().includes(q) ||
          (l.destination || l.mission?.orbit?.name || '').toLowerCase().includes(q) ||
          (l.location?.name || l.launchSite || '').toLowerCase().includes(q)
        );
      });
    }

    // Sort
    result.sort((a, b) => {
      const timeA = a.launchDate ? new Date(a.launchDate).getTime() : null;
      const timeB = b.launchDate ? new Date(b.launchDate).getTime() : null;

      if (timeA === null && timeB === null) return 0;
      if (timeA === null) return 1;
      if (timeB === null) return -1;

      if (currentSort === 'date_desc') return timeB - timeA;
      if (currentSort === 'name_asc') return (a.name || '').localeCompare(b.name || '');
      if (currentSort === 'name_desc') return (b.name || '').localeCompare(a.name || '');
      return timeA - timeB; // default date_asc
    });

    return result;
  }, [launches, selectedMonth, selectedProvider, selectedStatus, searchQuery, currentSort]);

  // Format dynamic date window text
  const windowRangeText = useMemo(() => {
    if (!meta?.windowStart || !meta?.windowEndExclusive) {
      return 'Rolling 3-Calendar-Month Window';
    }
    const start = new Date(meta.windowStart).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    });
    // End date exclusive minus 1 day represents the last calendar day included
    const lastDay = new Date(new Date(meta.windowEndExclusive).getTime() - 86400000).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    });
    return `${start} – ${lastDay}`;
  }, [meta]);

  const hasActiveFilters =
    searchQuery || selectedProvider !== 'All' || selectedStatus !== 'All' || selectedMonth !== 'all';

  if (loading && launches.length === 0) {
    return (
      <PagePreloader
        title="Loading Rocket Launch Manifest"
        message="Connecting to verified launch schedules across the rolling three-calendar-month window..."
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* 1. Header with Rolling 3-Month Range & Refresh */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#263449] pb-8">
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-amber-400 uppercase tracking-wider">
            <Rocket className="w-4 h-4" />
            <span>Launch Library 2 • Rolling Three-Calendar-Month Window</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-display text-white tracking-tight">
            Upcoming Rocket Launches
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl font-light leading-relaxed">
            Live schedule of orbital spaceflights spanning the current calendar month and the following two months ({windowRangeText}). Data retrieved dynamically from the verified Launch Library 2 Developer Sandbox.
          </p>
        </div>

        {/* Counter Badge & Refresh Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-[#0D1422] border border-[#263449] text-xs font-mono text-slate-300">
            <span className="text-slate-500">Manifest: </span>
            {loading ? (
              <span className="text-amber-400 font-bold animate-pulse">Syncing...</span>
            ) : (
              <>
                <span className="text-amber-400 font-bold">{meta?.total ?? launches.length}</span>
                <span className="text-slate-500"> scheduled</span>
              </>
            )}
          </div>

          <button
            onClick={() => fetchUpcoming(true)}
            disabled={refreshing || loading}
            aria-label="Refresh launch manifest"
            className="px-4 py-2.5 rounded-xl bg-[#111C2E] hover:bg-[#162338] text-xs font-mono text-slate-200 border border-[#263449] flex items-center space-x-2 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Updating Sandbox...' : 'Refresh Manifest'}</span>
          </button>
        </div>
      </div>

      {/* 2. Stale or Fallback Cache Notice */}
      {meta?.isStale && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-300 text-xs font-mono">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              <strong>Manifest Cache Notice:</strong> {meta.staleReason || 'Displaying cached launch manifest.'}
            </span>
          </div>
          <button
            onClick={() => fetchUpcoming(true)}
            className="px-3 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-400/40 text-[11px] uppercase tracking-wider shrink-0 transition-colors"
          >
            Force Sync
          </button>
        </div>
      )}

      {/* 3. Monthly Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => updateParam('month', 'all')}
          className={`px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all border ${
            selectedMonth === 'all'
              ? 'bg-amber-400 text-slate-950 font-bold border-amber-400 shadow-md'
              : 'bg-[#0D1422] text-slate-400 hover:text-white border-[#263449]'
          }`}
        >
          All 3 Months {loading ? '' : `(${meta?.total ?? launches.length})`}
        </button>

        {meta?.months?.map((m) => (
          <button
            key={m.key}
            onClick={() => updateParam('month', m.key)}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all border flex items-center space-x-2 ${
              selectedMonth === m.key
                ? 'bg-amber-400 text-slate-950 font-bold border-amber-400 shadow-md'
                : 'bg-[#0D1422] text-slate-400 hover:text-white border-[#263449]'
            }`}
          >
            <span>{m.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] ${
                selectedMonth === m.key
                  ? 'bg-slate-950 text-amber-400'
                  : 'bg-[#162338] text-slate-300'
              }`}
            >
              {loading ? '...' : m.count}
            </span>
          </button>
        ))}
      </div>

      {/* 4. Controls: Search, Provider, Status, Sort */}
      <div className="p-5 rounded-2xl glass-panel border border-[#263449] space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => updateParam('q', e.target.value)}
              placeholder="Search mission, rocket, payload..."
              className="w-full pl-9 pr-8 py-2.5 bg-[#0D1422] border border-[#263449] rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => updateParam('q', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Provider Filter */}
          <div className="relative">
            <select
              value={selectedProvider}
              onChange={(e) => updateParam('provider', e.target.value)}
              className="w-full pl-3 pr-8 py-2.5 bg-[#0D1422] border border-[#263449] rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-400 appearance-none cursor-pointer"
            >
              <option value="All">All Launch Providers</option>
              {dynamicProviders
                .filter((p) => p !== 'All')
                .map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => updateParam('status', e.target.value)}
              className="w-full pl-3 pr-8 py-2.5 bg-[#0D1422] border border-[#263449] rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-400 appearance-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              {dynamicStatuses
                .filter((s) => s !== 'All')
                .map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={currentSort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="w-full pl-3 pr-8 py-2.5 bg-[#0D1422] border border-[#263449] rounded-xl text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-400 appearance-none cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Filter Summary & Reset Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#263449]/60 text-xs font-mono text-slate-400">
            <div className="flex items-center space-x-2">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Showing {filteredLaunches.length} of {launches.length} launches
                {selectedMonth !== 'all' && (
                  <span className="text-amber-300 ml-1">
                    [{meta?.months?.find((m) => m.key === selectedMonth)?.label || selectedMonth}]
                  </span>
                )}
                {selectedProvider !== 'All' && (
                  <span className="text-sky-300 ml-1">[{selectedProvider}]</span>
                )}
                {selectedStatus !== 'All' && (
                  <span className="text-emerald-300 ml-1">[{selectedStatus}]</span>
                )}
              </span>
            </div>

            <button
              onClick={resetFilters}
              className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* 5. Error State */}
      {error && !loading && (
        <div className="p-8 rounded-2xl glass-panel border border-red-500/40 text-center space-y-4">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
          <h3 className="text-lg font-bold font-display text-white">Failed to Retrieve Sandbox Manifest</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">{error}</p>
          <button
            onClick={() => fetchUpcoming(true)}
            className="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-all"
          >
            Retry Sandbox Connection
          </button>
        </div>
      )}

      {/* 6. Loading Skeletons */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-6 rounded-2xl glass-panel border border-[#263449] animate-pulse space-y-4"
            >
              <div className="flex items-center space-x-3">
                <div className="w-28 h-5 bg-[#162338] rounded-md" />
                <div className="w-36 h-5 bg-[#162338] rounded-md" />
              </div>
              <div className="w-3/4 h-7 bg-[#162338] rounded-lg" />
              <div className="w-full h-4 bg-[#162338] rounded" />
              <div className="flex items-center space-x-6 pt-2">
                <div className="w-44 h-4 bg-[#162338] rounded" />
                <div className="w-44 h-4 bg-[#162338] rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 7. Empty State for filtered results or individual months */}
      {!loading && !error && filteredLaunches.length === 0 && (
        <div className="p-12 text-center rounded-2xl glass-panel border border-[#263449] space-y-4">
          <Rocket className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold font-display text-white">
            {selectedMonth !== 'all'
              ? `No Launches Scheduled in ${
                  meta?.months?.find((m) => m.key === selectedMonth)?.label || 'this month'
                }`
              : 'No Upcoming Launches Found'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {selectedMonth !== 'all'
              ? 'There are currently no public orbital launches scheduled in the Launch Library 2 Sandbox for this specific calendar month.'
              : 'No launch records matched your active filter criteria. Try clearing your search or switching providers.'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-[#162338] hover:bg-[#20314f] text-slate-200 border border-[#263449] text-xs font-mono uppercase tracking-wider transition-all"
            >
              Reset All Filters
            </button>
          )}
        </div>
      )}

      {/* 8. Launch Cards Listing */}
      {!loading && !error && filteredLaunches.length > 0 && (
        <div className="space-y-4">
          {filteredLaunches.map((launch) => {
            const timer = timeRemaining[launch.id];
            const isCompleted = launch.launchStatus === 'success';
            const isFailed = launch.launchStatus === 'failed';
            const isGo = launch.launchStatus === 'go';
            const providerName = launch.provider?.name || launch.launchProvider;
            const rocketName = launch.rocket?.name || launch.rocket?.fullName || launch.rocket;
            const locationName = launch.location?.name || launch.pad?.name || launch.launchSite;
            const launchDateObj = launch.launchDate ? new Date(launch.launchDate) : null;

            return (
              <div
                key={launch.id}
                className="p-6 rounded-2xl glass-panel border border-[#263449] hover:border-amber-500/50 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 group relative overflow-hidden"
              >
                {/* Visual Accent Indicator */}
                <div
                  className={`absolute top-0 left-0 bottom-0 w-1 transition-colors ${
                    isCompleted
                      ? 'bg-emerald-500'
                      : isFailed
                      ? 'bg-red-500'
                      : isGo
                      ? 'bg-amber-400 group-hover:bg-amber-300'
                      : 'bg-sky-500'
                  }`}
                />

                {/* Left Column: Mission, Rocket, Location */}
                <div className="space-y-3 flex-1 pl-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Provider Badge */}
                    <span className="px-2.5 py-0.5 rounded-md bg-[#162338] text-[11px] font-mono text-amber-300 border border-[#263449] font-medium">
                      {providerName}
                    </span>

                    {/* Rocket Badge */}
                    <span className="text-xs font-mono text-slate-300">{rocketName}</span>
                    <span className="text-slate-600">•</span>

                    {/* Status Badge */}
                    <span
                      className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-semibold ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : isFailed
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : isGo
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      }`}
                    >
                      {launch.status?.name || launch.scheduleConfidence || launch.launchStatus}
                    </span>

                    {/* Month Tag */}
                    {launch.monthLabel && (
                      <span className="px-2 py-0.5 rounded-md bg-[#0D1422] text-[10px] font-mono text-slate-400 border border-[#263449]">
                        {launch.monthLabel}
                      </span>
                    )}

                    {/* Weather Probability Badge if available */}
                    {typeof launch.probability === 'number' && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-sky-950/60 text-[10px] font-mono text-sky-300 border border-sky-800/50">
                        <CloudSun className="w-3 h-3 text-sky-400" />
                        <span>{launch.probability}% GO</span>
                      </span>
                    )}

                    {/* Live Broadcast Badge */}
                    {launch.isLive && (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-red-600/20 text-[10px] font-mono text-red-400 border border-red-600/40 animate-pulse">
                        <Radio className="w-3 h-3" />
                        <span>LIVE NOW</span>
                      </span>
                    )}
                  </div>

                  {/* Title Link */}
                  <Link
                    to={`/launches/${launch.slug}`}
                    className="text-xl sm:text-2xl font-bold font-display text-white group-hover:text-amber-300 transition-colors block"
                  >
                    {launch.name}
                  </Link>

                  {/* Summary / Description */}
                  <p className="text-xs text-slate-300 leading-relaxed max-w-3xl line-clamp-2">
                    {launch.mission?.description ||
                      launch.description ||
                      `Orbital launch operation by ${providerName}.`}
                  </p>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-slate-400 pt-1">
                    <span className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate max-w-xs">{locationName}</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <Rocket className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>
                        Payload: {launch.mission?.name || launch.payload || 'Orbital Deployment'}
                      </span>
                    </span>
                    {launch.mission?.orbit?.name && (
                      <span className="flex items-center space-x-1.5">
                        <Layers className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>Orbit: {launch.mission.orbit.name}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Column: Countdown Clock & Detail Button */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#263449] pl-2 lg:pl-0">
                  <div className="text-left lg:text-right">
                    <div className="text-[11px] font-mono text-slate-400 mb-0.5">
                      {launchDateObj ? launchDateObj.toUTCString() : 'Date Pending'}
                    </div>
                    <div className="text-sm sm:text-base font-mono font-bold text-amber-300 flex items-center space-x-1.5 lg:justify-end">
                      <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{timer?.formatted || (isCompleted ? 'Liftoff Succeeded' : 'Schedule TBD')}</span>
                    </div>
                  </div>

                  <Link
                    to={`/launches/${launch.slug}`}
                    className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-all flex items-center space-x-2 shadow-md hover:shadow-amber-400/20"
                  >
                    <span>Launch Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 9. Data Attribution & Transparency Footer Note */}
      <div className="pt-6 border-t border-[#263449] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Source: {meta?.source || 'Launch Library 2 Developer Sandbox (v2.3.0)'}</span>
        </div>
        <div>
          <span>Attribution: {meta?.attribution || 'Data provided by The Space Devs / Launch Library 2'}</span>
        </div>
      </div>
    </div>
  );
}

export default LaunchTracker;
