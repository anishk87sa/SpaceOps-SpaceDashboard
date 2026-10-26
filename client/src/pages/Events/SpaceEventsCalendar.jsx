import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Search,
  ArrowRight,
  Eye,
  Sparkles,
  Clock,
  Globe,
  Rocket,
  ChevronLeft,
  ChevronRight,
  Layers,
  MapPin,
  RefreshCw,
  Video,
  CalendarDays,
  List,
  Compass,
  Satellite,
  Building,
  X,
  ExternalLink
} from 'lucide-react';
import { apiClient } from '../../services/api/client';
import { PagePreloader } from '../../components/common/PagePreloader';

export function SpaceEventsCalendar() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [timelineScope, setTimelineScope] = useState('all'); // 'all' or 'month'
  
  // Selected preview event for the first-class entity preview modal
  const [selectedPreviewEvent, setSelectedPreviewEvent] = useState(null);
  const [navigatingId, setNavigatingId] = useState(null);

  // Reference date: initialized to October 2026 (current project timeframe)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // October 2026
  const [selectedDayDate, setSelectedDayDate] = useState(null); // YYYY-MM-DD string
  
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('q') || '';

  const categories = [
    { label: 'All Events', value: 'All' },
    { label: 'Rocket Launches', value: 'Rocket Launch', icon: Rocket },
    { label: 'Mission Milestones', value: 'Mission Milestone', icon: Compass },
    { label: 'Spacecraft Operations', value: 'Spacecraft', icon: Satellite },
    { label: 'Meteor Showers', value: 'Meteor Shower', icon: Sparkles },
    { label: 'Eclipses & Moon', value: 'Eclipse', icon: Eye },
    { label: 'Planetary Conjunctions', value: 'Planetary', icon: Globe },
  ];

  // Fetch all events (including live Launch Library 2 launches merged with ephemerides and missions)
  async function loadCalendarEvents() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.getEvents();
      if (res && res.data) {
        setEvents(res.data);
      }
    } catch (err) {
      console.error('Failed to load space events:', err);
      setError(err?.message || 'Could not load space events calendar.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCalendarEvents();
  }, []);

  // Keyboard accessibility: Close preview on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedPreviewEvent(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const updateParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val === 'All' || !val) {
      next.delete(key);
    } else {
      next.set(key, val);
    }
    setSearchParams(next);
  };

  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDayDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDayDate(null);
  };

  const jumpToCurrent = () => {
    setCurrentDate(new Date(2026, 9, 1)); // October 2026
    setSelectedDayDate('2026-10-23');
  };

  // Handler for clicking More Details to navigate to the canonical entity detail page
  const handleOpenMoreDetails = (evt) => {
    if (!evt) return;
    setNavigatingId(evt.id);
    const targetUrl = evt.detailUrl || (evt.isLaunch ? `/launches/${evt.launchSlug || evt.slug}` : `/events/${evt.slug}`);
    navigate(targetUrl);
  };

  // Filter events based on active category and search
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      // Category filter
      if (currentCategory !== 'All') {
        const cat = (e.eventType || '').toLowerCase();
        const mainCat = (e.category || '').toLowerCase();
        const entType = (e.entityType || '').toLowerCase();
        const target = currentCategory.toLowerCase();

        const match =
          cat.includes(target) ||
          mainCat.includes(target) ||
          entType.includes(target) ||
          (target.includes('spacecraft') && (cat.includes('spacecraft') || entType.includes('spacecraft'))) ||
          (target.includes('milestone') && (cat.includes('milestone') || entType.includes('mission')));

        if (!match) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          (e.title && e.title.toLowerCase().includes(q)) ||
          (e.description && e.description.toLowerCase().includes(q)) ||
          (e.rocket && e.rocket.toLowerCase().includes(q)) ||
          (e.launchProvider && e.launchProvider.toLowerCase().includes(q)) ||
          (e.locationOrVisibility && e.locationOrVisibility.toLowerCase().includes(q)) ||
          (e.relatedEntities?.mission?.name && e.relatedEntities.mission.name.toLowerCase().includes(q)) ||
          (e.relatedEntities?.spacecraft?.name && e.relatedEntities.spacecraft.name.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [events, currentCategory, searchQuery]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: events.length };
    events.forEach((e) => {
      const type = ((e.eventType || '') + ' ' + (e.category || '') + ' ' + (e.entityType || '')).toLowerCase();
      if (type.includes('launch')) counts['Rocket Launch'] = (counts['Rocket Launch'] || 0) + 1;
      else if (type.includes('milestone') || e.entityType === 'mission') counts['Mission Milestone'] = (counts['Mission Milestone'] || 0) + 1;
      else if (type.includes('spacecraft') || e.entityType === 'spacecraft') counts['Spacecraft'] = (counts['Spacecraft'] || 0) + 1;
      else if (type.includes('meteor')) counts['Meteor Shower'] = (counts['Meteor Shower'] || 0) + 1;
      else if (type.includes('eclipse') || type.includes('lunar')) counts['Eclipse'] = (counts['Eclipse'] || 0) + 1;
      else if (type.includes('planetary') || type.includes('conjunction')) counts['Planetary'] = (counts['Planetary'] || 0) + 1;
    });
    return counts;
  }, [events]);

  // Calendar Grid Calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthLabel = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const activeMonthKey = `${year}-${String(month + 1).padStart(2, '0')}`;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 for Sunday
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Map events by date (YYYY-MM-DD)
  const eventsByDate = useMemo(() => {
    const map = {};
    filteredEvents.forEach((e) => {
      if (!e.startTime) return;
      const dateKey = e.startTime.slice(0, 10);
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(e);
    });
    return map;
  }, [filteredEvents]);

  // Selected day events
  const selectedDayEvents = selectedDayDate ? (eventsByDate[selectedDayDate] || []) : [];

  // Filtered events for the current active month (for list view)
  const currentMonthEvents = useMemo(() => {
    return filteredEvents.filter((e) => e.startTime && e.startTime.startsWith(activeMonthKey));
  }, [filteredEvents, activeMonthKey]);

  // Combined or scoped events for agenda timeline
  const listEvents = useMemo(() => {
    return timelineScope === 'month' ? currentMonthEvents : filteredEvents;
  }, [timelineScope, currentMonthEvents, filteredEvents]);

  if (loading && events.length === 0) {
    return (
      <PagePreloader
        title="Loading Space Events Calendar"
        message="Synchronizing celestial ephemerides, meteor showers, and live rocket launches..."
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      {/* 1. Header & Live Indicator */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-purple-400 uppercase tracking-wider">
            <CalendarIcon className="w-4 h-4" />
            <span>Astronomical Observations, Missions & Rocket Launches</span>
          </div>

          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Real Data: Launch Library 2 + Mission Operations + Ephemerides ({loading ? 'Syncing...' : `${events.length} Events`})</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
              Space Events Calendar
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl font-light mt-1">
              Explore scheduled orbital rocket liftoffs, mission milestones, spacewalks, meteor showers, and planetary conjunctions. Select any event to inspect its preview or view its complete entity dossier.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-[#0D1422] border border-[#263449] shrink-0 self-start md:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                viewMode === 'grid'
                  ? 'bg-purple-600 text-white font-semibold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Calendar Grid</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                viewMode === 'list'
                  ? 'bg-purple-600 text-white font-semibold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Agenda Timeline</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Month Selector & Rolling Window Tabs */}
      <div className="p-4 rounded-2xl glass-panel border border-[#263449] flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Month Navigation Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={prevMonth}
            className="p-2 rounded-xl bg-[#0D1422] hover:bg-[#162338] border border-[#263449] text-slate-300 hover:text-white transition-all"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-lg font-bold font-display text-white min-w-[160px] text-center">
            {monthLabel}
          </div>
          <button
            onClick={nextMonth}
            className="p-2 rounded-xl bg-[#0D1422] hover:bg-[#162338] border border-[#263449] text-slate-300 hover:text-white transition-all"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={jumpToCurrent}
            className="px-3 py-1.5 rounded-xl bg-[#111C2E] hover:bg-[#162338] border border-purple-500/30 text-xs font-mono text-purple-300 transition-all"
          >
            Today (Oct 2026)
          </button>
        </div>

        {/* Rolling 3-Month Quick Jump Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: '2026-10', label: 'Oct 2026', date: new Date(2026, 9, 1) },
            { key: '2026-11', label: 'Nov 2026', date: new Date(2026, 10, 1) },
            { key: '2026-12', label: 'Dec 2026', date: new Date(2026, 11, 1) },
            { key: '2027-01', label: 'Jan 2027', date: new Date(2027, 0, 1) },
          ].map((m) => {
            const isSelected = activeMonthKey === m.key;
            const countForMonth = filteredEvents.filter(
              (e) => e.startTime && e.startTime.startsWith(m.key)
            ).length;

            return (
              <button
                key={m.key}
                onClick={() => {
                  setCurrentDate(m.date);
                  setSelectedDayDate(null);
                  if (viewMode === 'list') {
                    setTimelineScope('month');
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center space-x-1.5 ${
                  isSelected && (viewMode === 'grid' || timelineScope === 'month')
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold'
                    : 'bg-[#0D1422] text-slate-400 hover:text-white border border-[#263449]'
                }`}
              >
                <span>{m.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300">
                  {countForMonth}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => {
              setViewMode('list');
              setTimelineScope('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center space-x-1.5 ${
              viewMode === 'list' && timelineScope === 'all'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold'
                : 'bg-[#0D1422] text-slate-400 hover:text-white border border-[#263449]'
            }`}
          >
            <span>All Upcoming</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300">
              {filteredEvents.length}
            </span>
          </button>
        </div>
      </div>

      {/* 3. Category Filter Chips & Search Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-[#263449] space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const count = categoryCounts[cat.value] || 0;
              const isSelected = currentCategory.toLowerCase() === cat.value.toLowerCase();

              return (
                <button
                  key={cat.value}
                  onClick={() => updateParam('category', cat.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-950/50'
                      : 'bg-[#0D1422] text-slate-300 hover:text-white border border-[#263449]'
                  }`}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-purple-900/60 text-purple-200' : 'bg-[#162338] text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => updateParam('q', e.target.value)}
              placeholder="Search launches, missions, spacecraft..."
              className="w-full pl-9 pr-4 py-2 bg-[#0D1422] border border-[#263449] rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-purple-400 font-mono"
            />
          </div>
        </div>
      </div>

      {/* 4. Main Calendar Content: Loading / Error / Views */}
      {loading ? (
        <div className="py-24 text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-400">
            Synchronizing space events from Launch Library 2, NASA JPL & ephemerides...
          </p>
        </div>
      ) : error ? (
        <div className="py-16 text-center rounded-2xl glass-panel border border-rose-500/30 p-8 space-y-4">
          <p className="text-rose-400 font-medium text-sm">{error}</p>
          <button
            onClick={loadCalendarEvents}
            className="px-4 py-2 rounded-xl bg-purple-600 text-white font-mono text-xs uppercase"
          >
            Retry Loading Events
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* ======================== CALENDAR GRID VIEW ======================== */
        <div className="space-y-6">
          <div className="rounded-2xl glass-panel border border-[#263449] overflow-hidden shadow-2xl">
            {/* Days of the Week Header */}
            <div className="grid grid-cols-7 border-b border-[#263449] bg-[#0A0F1D] text-center text-xs font-mono font-semibold text-slate-400 py-3">
              <span>SUN</span>
              <span>MON</span>
              <span>TUE</span>
              <span>WED</span>
              <span>THU</span>
              <span>FRI</span>
              <span>SAT</span>
            </div>

            {/* Calendar Grid Cells */}
            <div className="grid grid-cols-7 auto-rows-fr bg-[#070B14] divide-x divide-y divide-[#162338]">
              {/* Previous Month trailing days */}
              {Array.from({ length: firstDayIndex }).map((_, i) => {
                const prevDayNum = daysInPrevMonth - firstDayIndex + i + 1;
                return (
                  <div
                    key={`prev-${i}`}
                    className="min-h-[115px] p-2 bg-[#050810]/60 text-slate-700 font-mono text-xs"
                  >
                    <span>{prevDayNum}</span>
                  </div>
                );
              })}

              {/* Current Month Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const dayEvents = eventsByDate[dateKey] || [];
                const isSelected = selectedDayDate === dateKey;
                const isToday = dateKey === '2026-10-23';

                return (
                  <div
                    key={dateKey}
                    onClick={() => setSelectedDayDate(isSelected ? null : dateKey)}
                    className={`min-h-[115px] p-2 transition-all cursor-pointer relative flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-purple-950/30 ring-2 ring-purple-500 z-10'
                        : isToday
                        ? 'bg-sky-950/20 hover:bg-[#111C2E]'
                        : 'bg-[#0D1422]/70 hover:bg-[#111C2E]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-mono font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                          isToday
                            ? 'bg-sky-400 text-slate-950 shadow-md'
                            : isSelected
                            ? 'bg-purple-500 text-white'
                            : 'text-slate-300'
                        }`}
                      >
                        {dayNum}
                      </span>
                      {dayEvents.length > 0 && (
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'}
                        </span>
                      )}
                    </div>

                    {/* Events List Pills in Day Cell */}
                    <div className="space-y-1 my-1 overflow-hidden">
                      {dayEvents.slice(0, 3).map((evt) => {
                        const isLaunch = evt.entityType === 'launch' || evt.isLaunch;
                        const isMission = evt.entityType === 'mission';
                        const isSpacecraft = evt.entityType === 'spacecraft';

                        let badgeColor = 'bg-purple-500/15 text-purple-300 border-purple-500/30 hover:border-purple-400';
                        let icon = '✨ ';

                        if (isLaunch) {
                          badgeColor = 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:border-amber-400';
                          icon = '🚀 ';
                        } else if (isMission) {
                          badgeColor = 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30 hover:border-indigo-400';
                          icon = '🧭 ';
                        } else if (isSpacecraft) {
                          badgeColor = 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30 hover:border-cyan-400';
                          icon = '🛰️ ';
                        }

                        return (
                          <div
                            key={evt.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPreviewEvent(evt);
                            }}
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded border truncate transition-all cursor-pointer ${badgeColor}`}
                            title={`Click to preview: ${evt.title} (${evt.eventType})`}
                          >
                            <span>{icon}</span>
                            <span>{evt.title}</span>
                          </div>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <div className="text-[9px] font-mono text-slate-400 px-1">
                          +{dayEvents.length - 3} more...
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Next Month leading days */}
              {Array.from({
                length: (7 - ((firstDayIndex + daysInMonth) % 7)) % 7,
              }).map((_, i) => (
                <div
                  key={`next-${i}`}
                  className="min-h-[115px] p-2 bg-[#050810]/60 text-slate-700 font-mono text-xs"
                >
                  <span>{i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Day Event Drawer / Detail Inspector */}
          {selectedDayDate && (
            <div className="p-6 rounded-2xl glass-panel border border-purple-500/40 bg-gradient-to-br from-purple-950/20 via-[#0D1422] to-[#0D1422] space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-[#263449]">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold font-display text-white">
                    Events on{' '}
                    {new Date(selectedDayDate + 'T12:00:00Z').toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedDayDate(null)}
                  className="text-xs font-mono text-slate-400 hover:text-white"
                >
                  Clear Selection ✕
                </button>
              </div>

              {selectedDayEvents.length === 0 ? (
                <p className="text-xs text-slate-400 font-mono py-4 text-center">
                  No space events scheduled on this date.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedDayEvents.map((evt) => {
                    const isLaunch = evt.entityType === 'launch' || evt.isLaunch;
                    const isMission = evt.entityType === 'mission';
                    const isSpacecraft = evt.entityType === 'spacecraft';

                    return (
                      <div
                        key={evt.id}
                        className="p-4 rounded-xl bg-[#070B14] border border-[#263449] hover:border-purple-500/40 transition-all space-y-3 cursor-pointer"
                        onClick={() => setSelectedPreviewEvent(evt)}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                            isLaunch
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              : isMission
                              ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                              : isSpacecraft
                              ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                              : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                          }`}>
                            {evt.eventType}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {new Date(evt.startTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                              timeZoneName: 'short',
                            })}
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-white line-clamp-1">{evt.title}</h4>
                        <p className="text-xs text-slate-300 line-clamp-2">{evt.description}</p>

                        {/* Connected entities summary tags */}
                        {evt.relatedEntities && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-mono text-slate-400">
                            {evt.relatedEntities.mission && (
                              <span className="text-indigo-300">
                                Mission: {evt.relatedEntities.mission.name}
                              </span>
                            )}
                            {evt.relatedEntities.rocket && (
                              <>
                                <span>•</span>
                                <span className="text-amber-300">{evt.relatedEntities.rocket.name}</span>
                              </>
                            )}
                            {evt.relatedEntities.spacecraft && (
                              <>
                                <span>•</span>
                                <span className="text-cyan-300">{evt.relatedEntities.spacecraft.name}</span>
                              </>
                            )}
                          </div>
                        )}

                        <div className="pt-2 border-t border-[#263449]/70 flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-400 truncate max-w-[180px]">
                            {evt.locationOrVisibility}
                          </span>
                          <div className="flex items-center space-x-2 shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPreviewEvent(evt);
                              }}
                              className="text-slate-300 hover:text-white underline text-[11px]"
                            >
                              Preview
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenMoreDetails(evt);
                              }}
                              className="text-purple-400 hover:text-purple-300 font-bold flex items-center space-x-1"
                            >
                              <span>More Details</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* ======================== AGENDA TIMELINE LIST VIEW ======================== */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#263449] gap-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setTimelineScope('all')}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  timelineScope === 'all'
                    ? 'bg-purple-600 text-white font-bold shadow'
                    : 'bg-[#0D1422] text-slate-400 hover:text-white border border-[#263449]'
                }`}
              >
                All Upcoming Timeline ({filteredEvents.length})
              </button>
              <button
                onClick={() => setTimelineScope('month')}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  timelineScope === 'month'
                    ? 'bg-purple-600 text-white font-bold shadow'
                    : 'bg-[#0D1422] text-slate-400 hover:text-white border border-[#263449]'
                }`}
              >
                {monthLabel} ({currentMonthEvents.length})
              </button>
            </div>
            <span className="text-xs font-mono text-purple-400 font-semibold">
              Chronological Space Manifest ({listEvents.length} Events)
            </span>
          </div>

          {listEvents.length === 0 ? (
            <div className="py-20 text-center rounded-2xl glass-panel border border-[#263449] p-8 space-y-2">
              <p className="text-slate-300 font-medium">No events found matching current filters.</p>
              <button
                onClick={() => {
                  updateParam('category', 'All');
                  updateParam('q', '');
                }}
                className="text-xs font-mono text-purple-400 hover:underline"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            listEvents.map((evt) => {
              const isLaunch = evt.entityType === 'launch' || evt.isLaunch;
              const isMission = evt.entityType === 'mission';
              const isSpacecraft = evt.entityType === 'spacecraft';
              const launchDate = new Date(evt.startTime);

              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedPreviewEvent(evt)}
                  className="p-6 rounded-2xl glass-panel border border-[#263449] hover:border-purple-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group cursor-pointer"
                >
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold border ${
                        isLaunch
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                          : isMission
                          ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                          : isSpacecraft
                          ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                          : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                      }`}>
                        {evt.eventType}
                      </span>
                      {evt.launchProvider && (
                        <span className="text-xs font-mono text-sky-400 font-semibold">
                          {evt.launchProvider}
                        </span>
                      )}
                      {evt.rocket && (
                        <>
                          <span className="text-slate-600">•</span>
                          <span className="text-xs font-mono text-slate-300">{evt.rocket}</span>
                        </>
                      )}
                      {evt.relatedEntities?.mission && (
                        <span className="text-xs font-mono text-indigo-300">
                          Mission: {evt.relatedEntities.mission.name}
                        </span>
                      )}
                      {evt.scheduleConfidence && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#162338] text-slate-300 border border-[#263449]">
                          {evt.scheduleConfidence}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold font-display text-white group-hover:text-purple-300 transition-colors">
                      {evt.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                      {evt.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                      <span className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span className="truncate max-w-md">{evt.locationOrVisibility}</span>
                      </span>
                      {evt.streamUrl && (
                        <a
                          href={evt.streamUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center space-x-1 text-emerald-400 hover:underline"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Live Webcast</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Date & Actions */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-[#263449]">
                    <div className="text-left md:text-right">
                      <div className="text-xs font-mono text-slate-400">Date & Window</div>
                      <div className="text-sm font-mono font-bold text-purple-300 flex items-center space-x-1.5">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span>
                          {launchDate.toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {launchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenMoreDetails(evt);
                      }}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono uppercase tracking-wider transition-all flex items-center space-x-1.5 shadow-md group-hover:glow-cyan"
                    >
                      <span>More Details</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ======================== FIRST-CLASS ENTITY PREVIEW MODAL ======================== */}
      {selectedPreviewEvent && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="preview-modal-title"
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fadeIn"
          onClick={() => setSelectedPreviewEvent(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#090D18] border border-[#263449] hover:border-purple-500/40 rounded-3xl shadow-2xl overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Accent Strip */}
            <div
              className={`h-1.5 w-full ${
                selectedPreviewEvent.entityType === 'launch'
                  ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400'
                  : selectedPreviewEvent.entityType === 'mission'
                  ? 'bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400'
                  : selectedPreviewEvent.entityType === 'spacecraft'
                  ? 'bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-400'
                  : 'bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-400'
              }`}
            />

            <div className="p-6 sm:p-8 space-y-6">
              {/* Header Badges & Close Button */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold border ${
                      selectedPreviewEvent.entityType === 'launch'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : selectedPreviewEvent.entityType === 'mission'
                        ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                        : selectedPreviewEvent.entityType === 'spacecraft'
                        ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                        : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                    }`}
                  >
                    {selectedPreviewEvent.entityType === 'launch' && <Rocket className="w-3.5 h-3.5" />}
                    {selectedPreviewEvent.entityType === 'mission' && <Compass className="w-3.5 h-3.5" />}
                    {selectedPreviewEvent.entityType === 'spacecraft' && <Satellite className="w-3.5 h-3.5" />}
                    {selectedPreviewEvent.entityType === 'celestial_event' && <Sparkles className="w-3.5 h-3.5" />}
                    <span>{selectedPreviewEvent.eventType || selectedPreviewEvent.category}</span>
                  </span>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono border ${
                      selectedPreviewEvent.status === 'go' ||
                      selectedPreviewEvent.status === 'success' ||
                      selectedPreviewEvent.status === 'confirmed'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : selectedPreviewEvent.status === 'in-progress'
                        ? 'bg-sky-500/15 text-sky-300 border-sky-500/30 animate-pulse'
                        : 'bg-[#162338] text-slate-300 border-[#263449]'
                    }`}
                  >
                    {selectedPreviewEvent.scheduleConfidence || selectedPreviewEvent.status}
                  </span>

                  <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-[#0D1422] border border-[#263449]">
                    Source: {selectedPreviewEvent.source?.split('(')[0]?.trim() || 'Authoritative Space API'}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedPreviewEvent(null)}
                  className="p-1.5 rounded-xl bg-[#0D1422] hover:bg-[#162338] border border-[#263449] text-slate-400 hover:text-white transition-colors"
                  title="Close Preview (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Title & Organization Subheading */}
              <div className="space-y-1">
                <h2 id="preview-modal-title" className="text-2xl sm:text-3xl font-bold font-display text-white leading-tight">
                  {selectedPreviewEvent.title}
                </h2>
                {selectedPreviewEvent.launchProvider && (
                  <p className="text-xs font-mono text-sky-400">
                    Operated by {selectedPreviewEvent.launchProvider}
                    {selectedPreviewEvent.rocket && ` • Vehicle: ${selectedPreviewEvent.rocket}`}
                  </p>
                )}
                {selectedPreviewEvent.relatedOrganization && !selectedPreviewEvent.launchProvider && (
                  <p className="text-xs font-mono text-indigo-400">
                    Lead Agency: {selectedPreviewEvent.relatedOrganization}
                  </p>
                )}
              </div>

              {/* Timing & Location Details Box */}
              <div className="p-4 rounded-2xl bg-[#0D1422] border border-[#263449] space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="space-y-1">
                    <span className="text-slate-400 flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>Scheduled Time (UTC)</span>
                    </span>
                    <p className="text-white font-bold">
                      {selectedPreviewEvent.startTime
                        ? new Date(selectedPreviewEvent.startTime).toUTCString()
                        : 'Date TBD'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                      <span>Your Local Time</span>
                    </span>
                    <p className="text-slate-200">
                      {selectedPreviewEvent.startTime
                        ? new Date(selectedPreviewEvent.startTime).toLocaleString([], {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Local Time TBD'}
                    </p>
                  </div>
                </div>

                {selectedPreviewEvent.locationOrVisibility && (
                  <div className="pt-2 border-t border-[#1C283B] flex items-start space-x-2 text-xs font-mono text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                    <span>{selectedPreviewEvent.locationOrVisibility}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                  Event Summary & Mission Context
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed font-light">
                  {selectedPreviewEvent.description}
                </p>
              </div>

              {/* Viewing Guidance if available */}
              {selectedPreviewEvent.viewingGuidance && (
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-200 leading-relaxed space-y-1">
                  <span className="font-semibold block text-purple-300 font-mono flex items-center space-x-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Public Observation & Guidance</span>
                  </span>
                  <p>{selectedPreviewEvent.viewingGuidance}</p>
                </div>
              )}

              {/* Connected Entities Chips */}
              {selectedPreviewEvent.relatedEntities && (
                <div className="space-y-2 pt-2 border-t border-[#263449]">
                  <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider flex items-center space-x-1.5">
                    <Layers className="w-3.5 h-3.5 text-purple-400" />
                    <span>Connected Space Entities</span>
                  </h4>
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedPreviewEvent.relatedEntities.mission && (
                      selectedPreviewEvent.relatedEntities.mission.url ? (
                        <Link
                          to={selectedPreviewEvent.relatedEntities.mission.url}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#111C2E] hover:bg-[#162338] border border-indigo-500/40 text-xs font-mono text-indigo-300 transition-all group"
                        >
                          <Compass className="w-3.5 h-3.5 text-indigo-400 group-hover:rotate-45 transition-transform" />
                          <span>Mission: {selectedPreviewEvent.relatedEntities.mission.name}</span>
                          <ArrowRight className="w-3 h-3 text-indigo-400 ml-1" />
                        </Link>
                      ) : (
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#111C2E] border border-[#263449] text-xs font-mono text-slate-300">
                          <Compass className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Payload: {selectedPreviewEvent.relatedEntities.mission.name}</span>
                        </span>
                      )
                    )}

                    {selectedPreviewEvent.relatedEntities.spacecraft && (
                      <Link
                        to={selectedPreviewEvent.relatedEntities.spacecraft.url || `/spacecraft/${selectedPreviewEvent.relatedEntities.spacecraft.slug}`}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#111C2E] hover:bg-[#162338] border border-cyan-500/40 text-xs font-mono text-cyan-300 transition-all group"
                      >
                        <Satellite className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Spacecraft: {selectedPreviewEvent.relatedEntities.spacecraft.name}</span>
                        <ArrowRight className="w-3 h-3 text-cyan-400 ml-1" />
                      </Link>
                    )}

                    {selectedPreviewEvent.relatedEntities.rocket && (
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#111C2E] border border-[#263449] text-xs font-mono text-slate-300">
                        <Rocket className="w-3.5 h-3.5 text-amber-400" />
                        <span>Rocket: {selectedPreviewEvent.relatedEntities.rocket.name}</span>
                      </span>
                    )}

                    {selectedPreviewEvent.relatedEntities.provider && (
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#111C2E] border border-[#263449] text-xs font-mono text-slate-300">
                        <Building className="w-3.5 h-3.5 text-sky-400" />
                        <span>{selectedPreviewEvent.relatedEntities.provider.name}</span>
                      </span>
                    )}

                    {selectedPreviewEvent.relatedEntities.destination && (
                      <Link
                        to={selectedPreviewEvent.relatedEntities.destination.url}
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#111C2E] hover:bg-[#162338] border border-emerald-500/40 text-xs font-mono text-emerald-300 transition-all"
                      >
                        <Globe className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Destination: {selectedPreviewEvent.relatedEntities.destination.name}</span>
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Live Webcast link */}
              {selectedPreviewEvent.streamUrl && (
                <div className="pt-2">
                  <a
                    href={selectedPreviewEvent.streamUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold hover:bg-emerald-500/25 transition-all"
                  >
                    <Video className="w-4 h-4 text-emerald-400" />
                    <span>Watch Live Webcast Broadcast</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              )}

              {/* Action Buttons: Return & More Details */}
              <div className="pt-4 border-t border-[#263449] flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedPreviewEvent(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#0D1422] hover:bg-[#162338] border border-[#263449] text-xs font-mono text-slate-400 hover:text-white transition-colors"
                >
                  Back to Calendar
                </button>

                <button
                  onClick={() => handleOpenMoreDetails(selectedPreviewEvent)}
                  disabled={navigatingId === selectedPreviewEvent.id}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-lg shadow-purple-950/50"
                >
                  {navigatingId === selectedPreviewEvent.id ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Loading Dossier...</span>
                    </>
                  ) : (
                    <>
                      <span>More Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SpaceEventsCalendar;
