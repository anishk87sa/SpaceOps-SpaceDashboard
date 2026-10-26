import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Satellite, Search, ArrowRight, Globe, Compass, ChevronRight } from 'lucide-react';
import { apiClient } from '../../services/api/client';
import { PagePreloader } from '../../components/common/PagePreloader';

export function SpacecraftDirectory() {
  const [spacecraftList, setSpacecraftList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('q') || '';

  const categories = [
    'All',
    'Space Telescopes',
    'Rovers and Landers',
    'Space Probes',
    'Space Stations',
  ];

  useEffect(() => {
    async function loadSpacecraft() {
      setLoading(true);
      try {
        const params = {};
        if (currentCategory !== 'All') params.category = currentCategory;
        if (searchQuery) params.q = searchQuery;

        const res = await apiClient.getSpacecraft(params);
        setSpacecraftList(res.data);
      } catch (err) {
        console.error('Failed to load spacecraft:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSpacecraft();
  }, [currentCategory, searchQuery]);

  const updateParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val === 'All' || !val) {
      next.delete(key);
    } else {
      next.set(key, val);
    }
    setSearchParams(next);
  };

  if (loading && spacecraftList.length === 0) {
    return (
      <PagePreloader
        title="Loading Spacecraft Explorer"
        message="Gathering space telescopes, planetary rovers, and deep-space probes..."
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-indigo-400 uppercase tracking-wider">
          <Satellite className="w-4 h-4" />
          <span>Spacecraft & Deep Space Probes</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
          Spacecraft Explorer
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl font-light">
          Browse space telescopes, robotic rovers, interstellar probes, and crewed orbital habitats voyaging across our solar system and beyond.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-[#263449] space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => updateParam('category', cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  currentCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-indigo-500 text-white font-bold'
                    : 'bg-[#0D1422] text-slate-300 hover:text-white border border-[#263449]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => updateParam('q', e.target.value)}
              placeholder="Search spacecraft or probe..."
              className="w-full pl-9 pr-4 py-2 bg-[#0D1422] border border-[#263449] rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-400"
            />
          </div>
        </div>
      </div>

      {/* Spacecraft Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 font-mono text-xs">
          Loading spacecraft directory...
        </div>
      ) : spacecraftList.length === 0 ? (
        <div className="py-20 text-center rounded-2xl glass-panel border border-[#263449] p-8">
          <p className="text-slate-300 font-medium">No spacecraft match your query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spacecraftList.map((craft) => (
            <Link
              key={craft.id}
              to={`/spacecraft/${craft.slug}`}
              className="glass-panel rounded-2xl overflow-hidden border border-[#263449] hover:border-indigo-500/40 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="h-48 relative overflow-hidden bg-[#070B14]">
                  <img
                    src={
                      craft.image ||
                      craft.featuredImage ||
                      'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={craft.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                    {craft.isRealApi && (
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/90 text-white font-bold text-[9px] font-mono uppercase tracking-wider">
                        Live API
                      </span>
                    )}
                    <div className="px-2.5 py-1 rounded-full bg-slate-950/85 backdrop-blur-md border border-slate-700 text-[10px] font-mono text-emerald-400 uppercase">
                      {craft.status}
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded bg-slate-900/90 text-[11px] font-mono text-indigo-300 border border-slate-700">
                    {craft.type}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="line-clamp-1">{craft.organization || craft.operator}</span>
                    <span>
                      {craft.launchDate && !isNaN(new Date(craft.launchDate).getTime())
                        ? `Launched ${new Date(craft.launchDate).getFullYear()}`
                        : (craft.launchDate || 'Active')}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-display text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                    {craft.name}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {craft.educationalNotes || craft.keyAchievements}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-[#263449]/70 bg-[#070B14]/40 flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center space-x-1.5 text-slate-300">
                  <Globe className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{craft.destination}</span>
                </span>
                <span className="text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                  <span>Specifications</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default SpacecraftDirectory;
