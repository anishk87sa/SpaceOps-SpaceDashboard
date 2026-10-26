import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Compass, Search, Filter, ArrowRight, Globe, Calendar, Building, Sparkles, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../../services/api/client';
import { PagePreloader } from '../../components/common/PagePreloader';

export function MissionsDirectory() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get('category') || 'All';
  const currentStatus = searchParams.get('status') || 'All';
  const searchQuery = searchParams.get('q') || '';

  const categories = [
    'All',
    'Planetary Science',
    'Mars Exploration',
    'Lunar Exploration',
    'Space Telescopes',
    'Solar Science',
    'Deep Space',
    'Human Spaceflight'
  ];

  const statuses = ['All', 'active', 'upcoming', 'completed'];

  useEffect(() => {
    async function loadMissions() {
      setLoading(true);
      try {
        const params = {};
        if (currentCategory !== 'All') params.category = currentCategory;
        if (currentStatus !== 'All') params.status = currentStatus;
        if (searchQuery) params.q = searchQuery;

        const res = await apiClient.getMissions(params);
        setMissions(res.data);
      } catch (err) {
        console.error('Failed to load missions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMissions();
  }, [currentCategory, currentStatus, searchQuery]);

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === 'All' || !value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  if (loading && missions.length === 0) {
    return (
      <PagePreloader
        title="Loading Space Missions Registry"
        message="Gathering interplanetary probes, Mars rovers, and cosmic space telescopes..."
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-sky-400 uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>Space Missions Registry</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
          Explore Space Missions
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl font-light">
          From robotic rovers on Mars to space telescopes gazing at cosmic dawn, discover the robotic and crewed voyages expanding the frontiers of human knowledge.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-[#263449] space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => updateFilter('q', e.target.value)}
              placeholder="Search by mission name, destination, or objective..."
              className="w-full pl-10 pr-4 py-2 bg-[#0D1422] border border-[#263449] rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* Status buttons */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-400 mr-2 text-[11px] uppercase">Status:</span>
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => updateFilter('status', st)}
                className={`px-3 py-1.5 rounded-lg uppercase transition-all ${
                  currentStatus.toLowerCase() === st.toLowerCase()
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'bg-[#111C2E] text-slate-300 hover:text-white border border-[#263449]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#263449]/60">
          <span className="text-[11px] font-mono uppercase text-slate-400 mr-2">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => updateFilter('category', cat)}
              className={`px-3 py-1 rounded-full text-xs transition-all ${
                currentCategory === cat
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/50 font-medium'
                  : 'bg-[#0D1422] text-slate-400 hover:text-slate-200 border border-[#263449]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Missions Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 font-mono text-xs">
          Loading space missions registry...
        </div>
      ) : missions.length === 0 ? (
        <div className="py-20 text-center rounded-2xl glass-panel border border-[#263449] p-8">
          <p className="text-slate-300 font-medium">No missions match your selected filters.</p>
          <button
            onClick={() => setSearchParams({})}
            className="mt-4 px-4 py-2 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs uppercase font-mono"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missions.map((mission) => (
            <Link
              key={mission.id}
              to={`/missions/${mission.slug}`}
              className="glass-panel rounded-2xl overflow-hidden border border-[#263449] hover:border-sky-500/40 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="h-48 relative overflow-hidden bg-[#070B14]">
                  <img
                    src={
                      mission.featuredImage ||
                      'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={mission.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                    {mission.isRealApi && (
                      <span className="px-2 py-0.5 rounded-full bg-sky-500/90 text-slate-950 font-bold text-[9px] font-mono uppercase tracking-wider">
                        Live API
                      </span>
                    )}
                    <div className="px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-slate-700 text-[10px] font-mono text-emerald-400 uppercase">
                      {mission.status}
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded bg-slate-900/90 text-[11px] font-mono text-sky-300 border border-slate-700">
                    {mission.category}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="line-clamp-1">{mission.organization}</span>
                    <span>
                      {mission.launchDate && !isNaN(new Date(mission.launchDate).getTime())
                        ? `Launched ${new Date(mission.launchDate).getFullYear()}`
                        : (mission.launchDate || 'Active')}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-display text-white group-hover:text-sky-300 transition-colors line-clamp-1">
                    {mission.name}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {mission.summary}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-[#263449]/70 bg-[#070B14]/40 flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center space-x-1.5 text-slate-300">
                  <Globe className="w-3.5 h-3.5 text-sky-400" />
                  <span>{mission.destination}</span>
                </span>
                <span className="text-sky-400 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                  <span>Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default MissionsDirectory;
