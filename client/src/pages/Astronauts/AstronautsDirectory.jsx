import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  ArrowRight,
  Globe,
  Sparkles,
  Bookmark,
  ExternalLink,
  Radio,
  Clock,
  Shield,
  Award,
  RefreshCw,
  X,
  Compass,
  Rocket
} from 'lucide-react';
import { apiClient } from '../../services/api/client';
import { PagePreloader } from '../../components/common/PagePreloader';
import { favoritesService } from '../../services/supabase/favoritesService';
import { useAuth } from '../../context/AuthContext';

export function AstronautsDirectory() {
  const [astronauts, setAstronauts] = useState([]);
  const [inSpaceData, setInSpaceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inSpaceLoading, setInSpaceLoading] = useState(true);
  const [selectedAstronaut, setSelectedAstronaut] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [searchParams, setSearchParams] = useSearchParams();

  const { user } = useAuth();

  const currentTab = searchParams.get('filter') || 'All';
  const currentAgency = searchParams.get('agency') || 'All';
  const searchQuery = searchParams.get('q') || '';

  const filterTabs = [
    { id: 'All', label: 'All Astronauts' },
    { id: 'in_space', label: 'Currently in Orbit 🛰️' },
    { id: 'active', label: 'Active Corps' },
    { id: 'spacewalks', label: 'Spacewalkers (EVAs)' },
    { id: 'retired', label: 'Historic Legends' }
  ];

  const agencies = ['All', 'NASA', 'Roscosmos', 'ESA', 'CNSA', 'JAXA', 'Commercial'];

  // Load live currently in space headcount & manifest
  useEffect(() => {
    async function loadInSpace() {
      setInSpaceLoading(true);
      try {
        const res = await apiClient.getAstronautsInSpace();
        if (res && res.success) {
          setInSpaceData(res);
        }
      } catch (err) {
        console.warn('Failed to load in-space manifest:', err);
      } finally {
        setInSpaceLoading(false);
      }
    }
    loadInSpace();
  }, []);

  // Load astronaut directory
  useEffect(() => {
    async function loadAstronauts() {
      setLoading(true);
      try {
        const params = { limit: 60 };
        if (currentTab === 'in_space') {
          params.inSpace = true;
        } else if (currentTab === 'active') {
          params.status = 'active';
        } else if (currentTab === 'retired') {
          params.status = 'retired';
        }

        if (searchQuery) {
          params.q = searchQuery;
        }

        const res = await apiClient.getAstronauts(params);
        let list = res.data || [];

        // Client-side agency filtering for precise matches
        if (currentAgency !== 'All') {
          list = list.filter((a) => {
            const abbrev = (a.agency?.abbrev || '').toUpperCase();
            const name = (a.agency?.name || '').toUpperCase();
            const target = currentAgency.toUpperCase();
            if (target === 'COMMERCIAL') {
              return (
                abbrev.includes('SPX') ||
                name.includes('SPACEX') ||
                name.includes('AXIOM') ||
                name.includes('BLUE ORIGIN')
              );
            }
            return abbrev.includes(target) || name.includes(target);
          });
        }

        // Filter for spacewalkers if selected
        if (currentTab === 'spacewalks') {
          list = list.filter((a) => (a.spacewalksCount || 0) > 0);
        }

        setAstronauts(list);
      } catch (err) {
        console.error('Failed to load astronauts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAstronauts();
  }, [currentTab, currentAgency, searchQuery]);

  // Load user bookmarks
  useEffect(() => {
    async function checkBookmarks() {
      if (!user) return;
      try {
        const res = await favoritesService.getFavorites(user.id);
        if (res.data) {
          const ids = new Set(res.data.map((b) => String(b.entity_id || b.id)));
          setBookmarkedIds(ids);
        }
      } catch (e) {
        // Fallback
      }
    }
    checkBookmarks();
  }, [user]);

  const updateParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val === 'All' || !val) {
      next.delete(key);
    } else {
      next.set(key, val);
    }
    setSearchParams(next);
  };

  const handleToggleBookmark = async (e, astronaut) => {
    e.stopPropagation();
    const idStr = String(astronaut.id);
    const isCurrently = bookmarkedIds.has(idStr);

    // Optimistic state
    const nextSet = new Set(bookmarkedIds);
    if (isCurrently) nextSet.delete(idStr);
    else nextSet.add(idStr);
    setBookmarkedIds(nextSet);

    try {
      await favoritesService.toggleFavorite(user?.id, {
        entityType: 'astronaut',
        entityId: idStr,
        name: astronaut.name,
        slug: astronaut.slug,
        title: astronaut.name,
        imageUrl: astronaut.image,
        metadata: {
          agency: astronaut.agency?.name,
          country: astronaut.nationality,
          timeInSpace: astronaut.timeInSpace,
          inSpace: astronaut.inSpace
        }
      });
    } catch (err) {
      console.warn('Failed to toggle bookmark:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#263449]">
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-sky-400 uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Human Spaceflight & Cosmonaut Corps</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white tracking-tight">
            Astronauts & Orbital Crews
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl font-light leading-relaxed">
            Real-time tracking of spacefarers currently aboard orbital habitats, along with the complete historical register of moonwalkers, spacewalkers, and interplanetary mission commanders.
          </p>
        </div>

        {/* Live Status Chip */}
        <div className="shrink-0 flex items-center space-x-3 p-3.5 rounded-2xl glass-panel border border-emerald-500/30 bg-emerald-950/20 shadow-lg">
          <div className="relative flex items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-ping absolute opacity-75"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">
              Real-Time Manifest
            </div>
            <div className="text-sm font-display font-bold text-white">
              {inSpaceData?.totalInSpace ?? 11} Humans in Orbit
            </div>
          </div>
        </div>
      </div>

      {/* 2. Live Orbital Habitats Ribbon (Currently In Space) */}
      {inSpaceData && (
        <div className="p-6 rounded-2xl glass-panel border border-[#263449] bg-gradient-to-r from-[#0D1422] via-[#111C2E] to-[#0D1422] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h2 className="text-base font-bold font-display text-white">
                  Active Orbital Stations Crew Manifest
                </h2>
                <p className="text-xs text-slate-400">
                  Verified live telemetry from Open Notify & The Space Devs Launch Library 2
                </p>
              </div>
            </div>

            <button
              onClick={() => updateParam('filter', 'in_space')}
              className="text-xs font-mono text-sky-400 hover:text-sky-300 transition-colors flex items-center space-x-1.5 self-start sm:self-auto cursor-pointer"
            >
              <span>View All Orbiting Crew</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Station breakdown grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ISS Card */}
            <div className="p-4 rounded-xl bg-[#090E17]/80 border border-[#263449] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                  <span className="text-xs font-mono font-semibold text-white">
                    International Space Station (ISS)
                  </span>
                </div>
                <span className="text-[11px] font-mono bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded-full border border-sky-500/30">
                  {inSpaceData.stations?.iss?.count || 7} Crew Members
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {(inSpaceData.stations?.iss?.crew || []).slice(0, 7).map((c) => (
                  <button
                    key={c.id || c.name}
                    onClick={() => setSelectedAstronaut(c)}
                    className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-[#111C2E] hover:bg-[#1A2942] border border-[#263449] hover:border-sky-500/40 text-xs text-slate-200 transition-all cursor-pointer"
                  >
                    {c.thumbnail && (
                      <img
                        src={c.thumbnail}
                        alt={c.name}
                        className="w-5 h-5 rounded-full object-cover border border-sky-400/40"
                      />
                    )}
                    <span className="font-medium">{c.name}</span>
                    <span className="text-[10px] text-sky-400 font-mono">
                      {c.agency?.abbrev || 'NASA'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tiangong Card */}
            <div className="p-4 rounded-xl bg-[#090E17]/80 border border-[#263449] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="text-xs font-mono font-semibold text-white">
                    Tiangong Space Station (CSS)
                  </span>
                </div>
                <span className="text-[11px] font-mono bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">
                  {inSpaceData.stations?.tiangong?.count || 3} Crew Members
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {(inSpaceData.stations?.tiangong?.crew || []).length > 0 ? (
                  inSpaceData.stations.tiangong.crew.map((c) => (
                    <button
                      key={c.id || c.name}
                      onClick={() => setSelectedAstronaut(c)}
                      className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-[#111C2E] hover:bg-[#1A2942] border border-[#263449] hover:border-amber-500/40 text-xs text-slate-200 transition-all cursor-pointer"
                    >
                      {c.thumbnail && (
                        <img
                          src={c.thumbnail}
                          alt={c.name}
                          className="w-5 h-5 rounded-full object-cover border border-amber-400/40"
                        />
                      )}
                      <span className="font-medium">{c.name}</span>
                      <span className="text-[10px] text-amber-400 font-mono">CNSA</span>
                    </button>
                  ))
                ) : (
                  <div className="text-xs text-slate-400 italic py-1">
                    Shenzhou expedition rotation in progress
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Search & Filter Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-[#263449] space-y-4">
        {/* Top row: Search and Agency */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => updateParam('filter', tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                  currentTab === tab.id
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20'
                    : 'bg-[#0D1422] text-slate-300 hover:text-white border border-[#263449]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => updateParam('q', e.target.value)}
              placeholder="Search by astronaut, country, agency..."
              className="w-full pl-9 pr-4 py-2 bg-[#0D1422] border border-[#263449] rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>
        </div>

        {/* Agency filter chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#1C283B]">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mr-1">
            Agency:
          </span>
          {agencies.map((agency) => (
            <button
              key={agency}
              onClick={() => updateParam('agency', agency)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                currentAgency.toLowerCase() === agency.toLowerCase()
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50 font-bold'
                  : 'text-slate-400 hover:text-slate-200 bg-[#090E17] border border-[#1E293B]'
              }`}
            >
              {agency}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Astronauts Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-10 h-10 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-mono text-slate-400">
            Querying astronaut dossiers from The Space Devs live archives...
          </p>
        </div>
      ) : astronauts.length === 0 ? (
        <div className="py-20 text-center space-y-4 rounded-2xl glass-panel border border-[#263449]">
          <Users className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold font-display text-white">No Astronauts Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search criteria or resetting filters to browse all spacefarers.
          </p>
          <button
            onClick={() => setSearchParams(new URLSearchParams())}
            className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-mono uppercase font-bold transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {astronauts.map((astro) => {
            const isBookmarked = bookmarkedIds.has(String(astro.id));
            return (
              <div
                key={astro.id}
                onClick={() => setSelectedAstronaut(astro)}
                className="group relative rounded-2xl glass-panel border border-[#263449] hover:border-sky-500/50 bg-[#0D1422]/90 hover:bg-[#111C2E] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-sky-500/10 cursor-pointer flex flex-col"
              >
                {/* Photo & Status Banner */}
                <div className="relative h-64 w-full bg-[#070B14] overflow-hidden">
                  <img
                    src={
                      astro.image ||
                      'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={astro.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1422] via-transparent to-black/40"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    {/* Status Pill */}
                    {astro.inSpace ? (
                      <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/90 text-slate-950 font-bold text-[10px] font-mono tracking-wider uppercase shadow-md shadow-emerald-500/30">
                        <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping"></span>
                        <span>In Orbit 🛰️</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-300 text-[10px] font-mono uppercase tracking-wider">
                        {astro.statusLabel || astro.status}
                      </span>
                    )}

                    {/* Bookmark Toggle */}
                    <button
                      onClick={(e) => handleToggleBookmark(e, astro)}
                      className={`p-1.5 rounded-lg border backdrop-blur-md transition-all cursor-pointer ${
                        isBookmarked
                          ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                          : 'bg-black/40 text-slate-300 hover:text-white border-white/20 hover:bg-black/60'
                      }`}
                      title={isBookmarked ? 'Remove from Favorites' : 'Add to Favorites'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  {/* Bottom Image Overlay Tags */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-sky-300 px-2 py-0.5 rounded bg-sky-950/80 border border-sky-500/30">
                      {astro.agency?.abbrev || 'SPACE'}
                    </span>
                    <span className="text-[11px] font-mono text-slate-300">
                      {astro.nationality}
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold font-display text-white group-hover:text-sky-400 transition-colors line-clamp-1">
                      {astro.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {astro.bio}
                    </p>
                  </div>

                  {/* Key Stats Bar */}
                  <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-[#090E17] border border-[#1E293B] text-center">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Space Time</div>
                      <div className="text-xs font-bold font-mono text-white line-clamp-1">
                        {astro.timeInSpace || '0d'}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Flights</div>
                      <div className="text-xs font-bold font-mono text-sky-400">
                        {astro.flightsCount}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">EVAs</div>
                      <div className="text-xs font-bold font-mono text-indigo-400">
                        {astro.spacewalksCount}
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-2 flex items-center justify-between border-t border-[#1C283B] text-xs">
                    <span className="text-[11px] font-mono text-slate-400">
                      {astro.inSpace ? `Station: ${astro.station || 'ISS'}` : (astro.age ? `Age: ${astro.age}` : 'Astronaut')}
                    </span>
                    <span className="text-sky-400 font-mono font-medium flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                      <span>Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Astronaut Dossier Modal */}
      {selectedAstronaut && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedAstronaut(null)}
        >
          <div
            className="relative w-full max-w-2xl rounded-2xl glass-panel border border-[#38BDF8]/40 bg-[#0B111D] p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl shadow-sky-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedAstronaut(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-[#111C2E] hover:bg-[#1A2942] border border-[#263449] text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-[#070B14] border-2 border-sky-400/40 overflow-hidden shrink-0 shadow-lg">
                <img
                  src={
                    selectedAstronaut.image ||
                    selectedAstronaut.thumbnail ||
                    'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=400&q=80'
                  }
                  alt={selectedAstronaut.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>

              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {selectedAstronaut.inSpace ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] font-mono tracking-wider uppercase">
                      Currently in Space
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/40 text-[10px] font-mono uppercase">
                      {selectedAstronaut.statusLabel || selectedAstronaut.status}
                    </span>
                  )}
                  <span className="text-xs font-mono text-slate-400">
                    {selectedAstronaut.nationality}
                  </span>
                </div>

                <h2 className="text-2xl font-bold font-display text-white">
                  {selectedAstronaut.name}
                </h2>
                <p className="text-xs font-mono text-sky-400">
                  {selectedAstronaut.agency?.name} ({selectedAstronaut.agency?.abbrev})
                </p>

                {selectedAstronaut.currentCraft && (
                  <div className="inline-flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>Station: {selectedAstronaut.currentCraft}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Metrics Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#070B14] border border-[#263449] text-center font-mono">
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Cumulative Orbit Time</div>
                <div className="text-sm font-bold text-white mt-1">
                  {selectedAstronaut.timeInSpace || '0 days'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Total Flights</div>
                <div className="text-sm font-bold text-sky-400 mt-1">
                  {selectedAstronaut.flightsCount}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase">Spacewalks (EVAs)</div>
                <div className="text-sm font-bold text-indigo-400 mt-1">
                  {selectedAstronaut.spacewalksCount}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase">EVA Duration</div>
                <div className="text-sm font-bold text-amber-400 mt-1">
                  {selectedAstronaut.evaTime || '0h'}
                </div>
              </div>
            </div>

            {/* Biography */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Biographical Overview
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                {selectedAstronaut.bio}
              </p>
            </div>

            {/* Flight Milestones */}
            <div className="space-y-2 pt-2 border-t border-[#1C283B]">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Mission Flight Records
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-[#070B14] border border-[#1E293B]">
                  <span className="text-slate-400 block text-[10px]">First Spaceflight:</span>
                  <span className="text-slate-200">
                    {selectedAstronaut.firstFlight
                      ? new Date(selectedAstronaut.firstFlight).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                      : 'None recorded'}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-[#070B14] border border-[#1E293B]">
                  <span className="text-slate-400 block text-[10px]">Most Recent Flight:</span>
                  <span className="text-slate-200">
                    {selectedAstronaut.lastFlight
                      ? new Date(selectedAstronaut.lastFlight).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                      : 'None recorded'}
                  </span>
                </div>
              </div>
            </div>

            {/* External Links & Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#1C283B]">
              {selectedAstronaut.wikiUrl && (
                <a
                  href={selectedAstronaut.wikiUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs font-mono text-sky-400 hover:text-sky-300"
                >
                  <span>Wikipedia Dossier</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <div className="flex items-center space-x-3 ml-auto">
                <button
                  onClick={(e) => handleToggleBookmark(e, selectedAstronaut)}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                    bookmarkedIds.has(String(selectedAstronaut.id))
                      ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
                      : 'bg-[#111C2E] text-slate-300 hover:text-white border-[#263449]'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>
                    {bookmarkedIds.has(String(selectedAstronaut.id))
                      ? 'Saved to Favorites'
                      : 'Favorite Astronaut'}
                  </span>
                </button>

                <button
                  onClick={() => setSelectedAstronaut(null)}
                  className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AstronautsDirectory;
