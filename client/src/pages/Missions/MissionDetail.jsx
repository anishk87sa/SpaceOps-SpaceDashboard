import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Compass,
  Calendar,
  Globe,
  Building,
  Rocket,
  Bookmark,
  ExternalLink,
  ChevronLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { apiClient } from '../../services/api/client';
import { useAuth } from '../../context/AuthContext';
import { favoritesService } from '../../services/supabase/favoritesService';
import { AuthPromptModal } from '../../components/auth/AuthPromptModal';
import { getLocalBookmarks } from '../../utils/storage';
import { PagePreloader } from '../../components/common/PagePreloader';

export function MissionDetail() {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  useEffect(() => {
    async function loadMission() {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.getMissionBySlug(slug);
        setMission(res.data);

        // Check if bookmarked in Supabase or localStorage
        if (user?.id) {
          const favorited = await favoritesService.isFavorited(user.id, 'mission', [res.data.slug, res.data.id, slug].filter(Boolean));
          setIsBookmarked(favorited);
        } else {
          const saved = getLocalBookmarks();
          setIsBookmarked(saved.some((b) => b.id === res.data.id || b.slug === slug || b.entity_id === res.data.slug || b.entity_id === res.data.id));
        }
      } catch (err) {
        console.error('Failed to load mission details:', err);
        setError(err.message || 'Mission profile not found');
      } finally {
        setLoading(false);
      }
    }
    loadMission();
  }, [slug, user]);

  const toggleBookmark = async () => {
    if (!mission) return;

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setFavoriteLoading(true);
    try {
      const entityId = mission.slug || slug || String(mission.id);
      if (isBookmarked) {
        await favoritesService.removeFavorite(user.id, 'mission', [entityId, mission.id, mission.slug, slug].filter(Boolean));
        setIsBookmarked(false);
      } else {
        await favoritesService.addFavorite(user.id, {
          entityType: 'mission',
          entityId: entityId,
          entityName: mission.name,
          metadata: {
            summary: mission.summary,
            url: `/missions/${entityId}`,
            category: mission.category,
          },
        });
        setIsBookmarked(true);
      }
    } catch (e) {
      console.error('Error toggling favorite:', e);
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) {
    return (
      <PagePreloader
        title="Loading Mission Profile"
        message="Connecting to spacecraft telemetry, science payload, and mission log..."
      />
    );
  }

  if (!loading && (error || !mission)) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-fade-in">
        <h2 className="text-2xl font-bold font-display text-white mb-4">Mission Not Found</h2>
        <p className="text-slate-400 mb-6">The requested space mission profile could not be located.</p>
        <Link to="/missions" className="px-4 py-2 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs uppercase font-mono">
          Return to Missions Registry
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/missions"
          className="inline-flex items-center space-x-1.5 text-xs font-mono text-slate-400 hover:text-sky-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Missions Directory</span>
        </Link>

        {/* Favorite action */}
        <button
          onClick={toggleBookmark}
          disabled={favoriteLoading}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg border text-xs font-mono transition-all disabled:opacity-50 cursor-pointer ${
            isBookmarked
              ? 'bg-sky-500/20 text-sky-300 border-sky-500/50'
              : 'bg-[#111C2E] text-slate-300 border-[#263449] hover:text-white'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-sky-400 text-sky-400' : ''}`} />
          <span>{favoriteLoading ? 'Updating...' : isBookmarked ? 'Saved to Favorites' : 'Add to Favorites'}</span>
        </button>
      </div>

      {/* Mission Banner & Header */}
      <div className="relative rounded-3xl overflow-hidden border border-[#263449] glass-panel shadow-2xl">
        <div className="h-72 sm:h-96 relative">
          <img
            src={mission.featuredImage}
            alt={mission.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/60 to-transparent"></div>
          <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-xs font-mono text-emerald-400 uppercase">
            Status: {mission.status}
          </div>
        </div>

        <div className="p-8 sm:p-12 -mt-24 relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-sky-400">
            <span>{mission.category}</span>
            <span>•</span>
            <span>{mission.organization}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-display text-white">
            {mission.name}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-4xl font-light leading-relaxed">
            {mission.summary}
          </p>
        </div>
      </div>

      {/* Overview Grid Facts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0D1422] border border-[#263449]">
          <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center space-x-1 mb-1">
            <Globe className="w-3 h-3 text-sky-400" />
            <span>Destination</span>
          </span>
          <span className="text-base font-bold text-white">{mission.destination}</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D1422] border border-[#263449]">
          <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center space-x-1 mb-1">
            <Building className="w-3 h-3 text-indigo-400" />
            <span>Organization</span>
          </span>
          <span className="text-base font-bold text-white">{mission.organization}</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D1422] border border-[#263449]">
          <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center space-x-1 mb-1">
            <Calendar className="w-3 h-3 text-amber-400" />
            <span>Launch Date</span>
          </span>
          <span className="text-base font-bold text-white">{mission.launchDate}</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0D1422] border border-[#263449]">
          <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center space-x-1 mb-1">
            <Rocket className="w-3 h-3 text-emerald-400" />
            <span>Launch Vehicle</span>
          </span>
          <span className="text-base font-bold text-white">{mission.launchVehicle || 'N/A'}</span>
        </div>
      </div>

      {/* Main Content Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Detailed Mission Description & Objectives (8 cols) */}
        <div className="lg:col-span-8 space-y-10">
          {/* Mission Overview */}
          <div className="p-8 rounded-2xl glass-panel border border-[#263449] space-y-4">
            <h2 className="text-xl font-bold font-display text-white">
              Mission Overview
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              {mission.description}
            </p>
          </div>

          {/* Primary Scientific Objectives */}
          {mission.objectives && (
            <div className="p-8 rounded-2xl glass-panel border border-[#263449] space-y-4">
              <h2 className="text-xl font-bold font-display text-white flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-sky-400" />
                <span>Primary Scientific Objectives</span>
              </h2>
              <ul className="space-y-3">
                {mission.objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Major Milestones Timeline */}
          {mission.milestones && (
            <div className="p-8 rounded-2xl glass-panel border border-[#263449] space-y-6">
              <h2 className="text-xl font-bold font-display text-white flex items-center space-x-2">
                <Clock className="w-5 h-5 text-indigo-400" />
                <span>Mission Milestones & Timeline</span>
              </h2>

              <div className="space-y-4">
                {mission.milestones.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-start space-x-4 p-4 rounded-xl bg-[#0D1422] border border-[#263449]"
                  >
                    <div
                      className={`w-3 h-3 rounded-full mt-1 shrink-0 ${
                        m.status === 'completed'
                          ? 'bg-emerald-400'
                          : m.status === 'in-progress'
                          ? 'bg-sky-400 animate-pulse'
                          : 'bg-slate-600'
                      }`}
                    ></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <span className="text-slate-400">{m.date}</span>
                        <span className="uppercase text-[10px] text-slate-500">{m.status}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-white">{m.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scientific Discoveries */}
          {mission.scientificDiscoveries && (
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#111C2E] to-[#0D1422] border border-sky-500/30 space-y-3">
              <h2 className="text-xl font-bold font-display text-white flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Scientific Discoveries & Legacy</span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                {mission.scientificDiscoveries}
              </p>
            </div>
          )}
        </div>

        {/* Right Sidebar: Official Links & Sources (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl glass-panel border border-[#263449] space-y-4">
            <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
              Official Reference Links
            </h3>

            {mission.officialWebsite && (
              <a
                href={mission.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider transition-all flex items-center justify-center space-x-2"
              >
                <span>Official Mission Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            <div className="pt-2 space-y-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase block">
                Primary Data Sources
              </span>
              {mission.sources?.map((src, idx) => (
                <a
                  key={idx}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#0D1422] hover:bg-[#162338] border border-[#263449] text-xs text-slate-300 hover:text-white transition-all"
                >
                  <span className="truncate">{src.name}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-2" />
                </a>
              ))}
            </div>
          </div>

          {/* Destination Quick Navigation */}
          <div className="p-6 rounded-2xl bg-[#0D1422] border border-[#263449] space-y-3">
            <span className="text-[11px] font-mono text-sky-400 uppercase block">Destination Explorer</span>
            <h4 className="text-sm font-bold text-white">Explore {mission.destination}</h4>
            <p className="text-xs text-slate-400">
              Discover all other space probes, rovers, and future missions exploring this destination.
            </p>
            <Link
              to={`/destinations/${mission.destinationSlug}`}
              className="inline-flex items-center space-x-1 text-xs font-mono text-sky-400 hover:underline pt-1"
            >
              <span>View Destination Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        entityName={mission?.name}
        entityType="Mission"
      />
    </div>
  );
}

export default MissionDetail;
