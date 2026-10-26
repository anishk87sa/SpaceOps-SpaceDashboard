import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Bookmark,
  Trash2,
  ArrowRight,
  Compass,
  Rocket,
  Satellite,
  Calendar,
  BookOpen,
  Search,
  Sparkles,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { favoritesService } from '../../services/supabase/favoritesService';
import { PagePreloader } from '../../components/common/PagePreloader';

export function MyFavorites() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get('filter') || 'all';

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [removingId, setRemovingId] = useState(null);

  // Sync activeFilter when searchParams change (e.g. navigation from /saved-missions)
  useEffect(() => {
    const f = searchParams.get('filter');
    if (f) setActiveFilter(f);
  }, [searchParams]);

  const loadFavorites = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await favoritesService.getFavorites(user.id);
      setFavorites(data || []);
    } catch (err) {
      console.error('Failed to load favorites:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleRemove = async (item) => {
    const entityType = item.entity_type || item.itemType || 'mission';
    const entityId = item.entity_id || item.id || item.slug;
    setRemovingId(item.id || entityId);

    try {
      await favoritesService.removeFavorite(user.id, entityType, entityId);
      setFavorites((prev) => prev.filter((f) => (f.id !== item.id && f.entity_id !== entityId)));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    } finally {
      setRemovingId(null);
    }
  };

  const getEntityIcon = (type) => {
    const t = (type || '').toLowerCase();
    switch (t) {
      case 'mission':
        return <Compass className="w-4 h-4 text-sky-400" />;
      case 'launch':
        return <Rocket className="w-4 h-4 text-amber-400" />;
      case 'spacecraft':
        return <Satellite className="w-4 h-4 text-indigo-400" />;
      case 'event':
        return <Calendar className="w-4 h-4 text-purple-400" />;
      case 'article':
      case 'guide':
      case 'learn':
        return <BookOpen className="w-4 h-4 text-cyan-400" />;
      default:
        return <Bookmark className="w-4 h-4 text-sky-400" />;
    }
  };

  const getEntityLink = (item) => {
    if (item.metadata?.url) return item.metadata.url;
    if (item.url) return item.url;
    const type = (item.entity_type || item.itemType || '').toLowerCase();
    const id = item.entity_id || item.id || item.slug;
    switch (type) {
      case 'mission':
        return `/missions/${id}`;
      case 'launch':
        return `/launches/${id}`;
      case 'spacecraft':
        return `/spacecraft/${id}`;
      case 'event':
        return `/events/${id}`;
      case 'article':
      case 'guide':
      case 'learn':
        return `/learn/${id}`;
      default:
        return `/search?q=${encodeURIComponent(id)}`;
    }
  };

  // Filter items
  const filteredFavorites = favorites.filter((item) => {
    const type = (item.entity_type || item.itemType || '').toLowerCase();
    const name = (item.entity_name || item.title || item.entity_id || '').toLowerCase();
    const matchesFilter = activeFilter === 'all' || type === activeFilter.toLowerCase();
    const matchesSearch = !searchQuery || name.includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts = {
    all: favorites.length,
    mission: favorites.filter((f) => (f.entity_type || f.itemType || '').toLowerCase() === 'mission').length,
    launch: favorites.filter((f) => (f.entity_type || f.itemType || '').toLowerCase() === 'launch').length,
    spacecraft: favorites.filter((f) => (f.entity_type || f.itemType || '').toLowerCase() === 'spacecraft').length,
    event: favorites.filter((f) => (f.entity_type || f.itemType || '').toLowerCase() === 'event').length,
    article: favorites.filter((f) => ['article', 'guide', 'learn'].includes((f.entity_type || f.itemType || '').toLowerCase())).length,
  };

  if (loading && favorites.length === 0) {
    return (
      <PagePreloader
        title="Accessing Saved Watchlist"
        message="Synchronizing personal favorites and bookmarked missions from cloud archive..."
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#263449] pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CLOUD SYNCHRONIZED ARCHIVE</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">
            My Space Favorites
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Personal watchlist of missions, rocket launches, spacecraft, and celestial observations.
          </p>
        </div>

        <button
          onClick={loadFavorites}
          disabled={loading}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#111C2E] hover:bg-[#162338] border border-[#263449] text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sync Watchlist</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none font-mono text-xs">
          {[
            { id: 'all', label: 'All Saved', count: counts.all },
            { id: 'mission', label: 'Missions', count: counts.mission },
            { id: 'launch', label: 'Launches', count: counts.launch },
            { id: 'spacecraft', label: 'Spacecraft', count: counts.spacecraft },
            { id: 'event', label: 'Events', count: counts.event },
            { id: 'article', label: 'Articles', count: counts.article },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center space-x-1.5 ${
                activeFilter === tab.id
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40 font-semibold'
                  : 'bg-[#111C2E] text-slate-400 hover:text-white border border-[#263449]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeFilter === tab.id ? 'bg-sky-500/30 text-white' : 'bg-slate-900 text-slate-400'
              }`}>
                {loading ? '...' : tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Filter */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved favorites..."
            className="w-full bg-[#111C2E] border border-[#263449] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 font-mono"
          />
        </div>
      </div>

      {/* Favorites Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-44 rounded-3xl bg-[#111C2E]/60 border border-[#263449]" />
          ))}
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center border border-[#263449] space-y-5 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 mx-auto flex items-center justify-center">
            <FolderOpen className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-display font-bold text-white">No Favorites Found</h3>
            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              {searchQuery
                ? `No saved items match "${searchQuery}".`
                : activeFilter !== 'all'
                ? `You haven't favorited any ${activeFilter} items yet.`
                : 'Browse space missions, rocket launches, or spacecraft to begin saving items to your personal watchlist.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <Link
              to="/missions"
              className="px-4 py-2 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-400 hover:bg-sky-500/25 transition-colors text-xs font-mono font-medium"
            >
              Explore Missions
            </Link>
            <Link
              to="/launches"
              className="px-4 py-2 rounded-xl bg-[#111C2E] border border-[#263449] text-slate-300 hover:text-white transition-colors text-xs font-mono"
            >
              Rocket Launches
            </Link>
            <Link
              to="/events"
              className="px-4 py-2 rounded-xl bg-[#111C2E] border border-[#263449] text-slate-300 hover:text-white transition-colors text-xs font-mono"
            >
              Events Calendar
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFavorites.map((item) => {
            const entityType = item.entity_type || item.itemType || 'mission';
            const entityTitle = item.entity_name || item.title || item.entity_id;
            const targetUrl = getEntityLink(item);
            const isRemoving = removingId === (item.id || item.entity_id);

            return (
              <div
                key={item.id || `${entityType}-${item.entity_id}`}
                className="glass-panel rounded-3xl p-5 border border-[#263449] hover:border-sky-500/40 transition-all flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-1.5 rounded-lg bg-[#111C2E] border border-[#263449]">
                        {getEntityIcon(entityType)}
                      </div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                        {entityType}
                      </span>
                    </div>

                    <button
                      onClick={() => handleRemove(item)}
                      disabled={isRemoving}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Title & Summary */}
                  <div>
                    <h3 className="text-base font-display font-bold text-white group-hover:text-sky-400 transition-colors line-clamp-1">
                      {entityTitle}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono mt-1.5 line-clamp-2 leading-relaxed">
                      {item.metadata?.summary || item.summary || 'Verified space exploration entity registered in SpaceOps.'}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-[#263449] flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-500">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Saved'}
                  </span>

                  <Link
                    to={targetUrl}
                    className="inline-flex items-center space-x-1.5 text-sky-400 hover:text-sky-300 font-medium group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyFavorites;
