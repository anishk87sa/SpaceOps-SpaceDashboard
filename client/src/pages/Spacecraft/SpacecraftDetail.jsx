import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Satellite,
  Globe,
  Building,
  Calendar,
  Bookmark,
  ExternalLink,
  ChevronLeft,
  Sparkles,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';
import { apiClient } from '../../services/api/client';
import { useAuth } from '../../context/AuthContext';
import { favoritesService } from '../../services/supabase/favoritesService';
import { AuthPromptModal } from '../../components/auth/AuthPromptModal';
import { getLocalBookmarks } from '../../utils/storage';
import { PagePreloader } from '../../components/common/PagePreloader';

export function SpacecraftDetail() {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [craft, setCraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    async function loadCraft() {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.getSpacecraftBySlug(slug);
        setCraft(res.data);

        // Check if bookmarked in Supabase or localStorage
        if (user?.id) {
          const favorited = await favoritesService.isFavorited(user.id, 'spacecraft', [res.data.slug, res.data.id, slug].filter(Boolean));
          setIsBookmarked(favorited);
        } else {
          const saved = getLocalBookmarks();
          setIsBookmarked(saved.some((b) => b.id === res.data.id || b.slug === slug || b.entity_id === res.data.slug || b.entity_id === res.data.id));
        }
      } catch (err) {
        console.error('Failed to load spacecraft:', err);
        setError(err.message || 'Spacecraft record not found');
      } finally {
        setLoading(false);
      }
    }
    loadCraft();
  }, [slug, user]);

  const toggleBookmark = async () => {
    if (!craft) return;

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setFavoriteLoading(true);
    try {
      const entityId = craft.slug || slug || String(craft.id);
      if (isBookmarked) {
        await favoritesService.removeFavorite(user.id, 'spacecraft', [entityId, craft.id, craft.slug, slug].filter(Boolean));
        setIsBookmarked(false);
      } else {
        await favoritesService.addFavorite(user.id, {
          entityType: 'spacecraft',
          entityId: entityId,
          entityName: craft.name,
          metadata: {
            summary: `${craft.type} • ${craft.destination}`,
            url: `/spacecraft/${entityId}`,
          },
        });
        setIsBookmarked(true);
      }
    } catch (e) {
      console.error('Error toggling spacecraft favorite:', e);
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) {
    return (
      <PagePreloader
        title="Loading Spacecraft Specifications"
        message="Retrieving propulsion systems, scientific instruments, and flight history..."
      />
    );
  }

  if (!loading && (error || !craft)) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-fade-in">
        <h2 className="text-2xl font-bold font-display text-white mb-4">Spacecraft Not Found</h2>
        <Link to="/spacecraft" className="px-4 py-2 rounded-xl bg-indigo-500 text-white font-bold text-xs uppercase font-mono">
          Return to Spacecraft Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in">
      {/* Back and Bookmark Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/spacecraft"
          className="inline-flex items-center space-x-1.5 text-xs font-mono text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Spacecraft Directory</span>
        </Link>

        <button
          onClick={toggleBookmark}
          disabled={favoriteLoading}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg border text-xs font-mono transition-all disabled:opacity-50 cursor-pointer ${
            isBookmarked
              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50'
              : 'bg-[#111C2E] text-slate-300 border-[#263449] hover:text-white'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-indigo-400 text-indigo-400' : ''}`} />
          <span>{favoriteLoading ? 'Updating...' : isBookmarked ? 'Saved to Favorites' : 'Add to Favorites'}</span>
        </button>
      </div>

      {/* Hero Visual Card */}
      <div className="relative rounded-3xl overflow-hidden border border-[#263449] glass-panel shadow-2xl">
        <div className="h-72 sm:h-96 relative">
          <img src={craft.image} alt={craft.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070B14] via-[#070B14]/60 to-transparent"></div>
          <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-xs font-mono text-emerald-400 uppercase">
            Status: {craft.status}
          </div>
        </div>

        <div className="p-8 sm:p-12 -mt-24 relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-indigo-400">
            <span>{craft.type}</span>
            <span>•</span>
            <span>{craft.organization}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-display text-white">
            {craft.name}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-4xl font-light leading-relaxed">
            {craft.educationalNotes}
          </p>
        </div>
      </div>

      {/* Specifications & Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Scientific Achievements */}
          <div className="p-8 rounded-2xl glass-panel border border-[#263449] space-y-4">
            <h2 className="text-xl font-bold font-display text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span>Key Achievements & Discoveries</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed font-light">
              {craft.keyAchievements}
            </p>
          </div>

          {/* Technical Specifications */}
          {craft.specifications && (
            <div className="p-8 rounded-2xl glass-panel border border-[#263449] space-y-6">
              <h2 className="text-xl font-bold font-display text-white flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-sky-400" />
                <span>Spacecraft Specifications</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(craft.specifications).map(([k, v]) => (
                  <div key={k} className="p-4 rounded-xl bg-[#0D1422] border border-[#263449]">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                      {k.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {Array.isArray(v) ? v.join(', ') : String(v)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl glass-panel border border-[#263449] space-y-4">
            <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
              Mission Context
            </h3>

            <div className="space-y-3 text-xs font-mono text-slate-300">
              <div className="flex justify-between border-b border-[#263449] pb-2">
                <span className="text-slate-400">Associated Mission</span>
                <Link to={`/missions/${craft.missionSlug}`} className="text-sky-400 hover:underline">
                  {craft.associatedMission}
                </Link>
              </div>
              <div className="flex justify-between border-b border-[#263449] pb-2">
                <span className="text-slate-400">Destination</span>
                <span className="text-white">{craft.destination}</span>
              </div>
              <div className="flex justify-between border-b border-[#263449] pb-2">
                <span className="text-slate-400">Launch Date</span>
                <span className="text-white">{craft.launchDate}</span>
              </div>
            </div>

            {craft.officialSource && (
              <a
                href={craft.officialSource}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-4 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase font-mono tracking-wider transition-all flex items-center justify-center space-x-2"
              >
                <span>Official Documentation</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        entityName={craft?.name}
        entityType="Spacecraft"
      />
    </div>
  );
}

export default SpacecraftDetail;
