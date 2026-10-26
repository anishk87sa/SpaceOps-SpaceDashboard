import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Newspaper,
  Calendar,
  Building,
  Bookmark,
  ExternalLink,
  ChevronLeft,
  Sparkles,
  Compass,
  ArrowRight
} from 'lucide-react';
import { apiClient } from '../../services/api/client';
import { useAuth } from '../../context/AuthContext';
import { favoritesService } from '../../services/supabase/favoritesService';
import { AuthPromptModal } from '../../components/auth/AuthPromptModal';
import { getLocalBookmarks } from '../../utils/storage';
import { PagePreloader } from '../../components/common/PagePreloader';

export function NewsDetail() {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    async function loadArticle() {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.getNewsBySlug(slug);
        setArticle(res.data);

        if (user?.id) {
          const favorited = await favoritesService.isFavorited(user.id, 'article', [res.data.slug, res.data.id, slug].filter(Boolean));
          setIsBookmarked(favorited);
        } else {
          const saved = getLocalBookmarks();
          setIsBookmarked(saved.some((b) => b.id === res.data.id || b.slug === slug || b.entity_id === res.data.slug || b.entity_id === res.data.id));
        }
      } catch (err) {
        console.error('Failed to load article:', err);
        setError(err.message || 'News article not found');
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [slug, user]);

  const toggleBookmark = async () => {
    if (!article) return;

    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setFavoriteLoading(true);
    try {
      const entityId = article.slug || slug || String(article.id);
      if (isBookmarked) {
        await favoritesService.removeFavorite(user.id, 'article', [entityId, article.id, article.slug, slug].filter(Boolean));
        setIsBookmarked(false);
      } else {
        await favoritesService.addFavorite(user.id, {
          entityType: 'article',
          entityId: entityId,
          entityName: article.headline,
          metadata: {
            summary: article.summary,
            url: `/news/${entityId}`,
            category: article.category,
          },
        });
        setIsBookmarked(true);
      }
    } catch (e) {
      console.error('Failed to toggle news favorite:', e);
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) {
    return (
      <PagePreloader
        title="Loading News Article"
        message="Retrieving scientific reporting and agency source records..."
      />
    );
  }

  if (!loading && (error || !article)) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-fade-in">
        <h2 className="text-2xl font-bold font-display text-white mb-4">Article Not Found</h2>
        <Link to="/news" className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs uppercase font-mono">
          Return to Space News
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      {/* Back and Bookmark */}
      <div className="flex items-center justify-between">
        <Link
          to="/news"
          className="inline-flex items-center space-x-1.5 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Space News</span>
        </Link>

        <button
          onClick={toggleBookmark}
          disabled={favoriteLoading}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg border text-xs font-mono transition-all disabled:opacity-50 cursor-pointer ${
            isBookmarked
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
              : 'bg-[#111C2E] text-slate-300 border-[#263449] hover:text-white'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-cyan-400 text-cyan-400' : ''}`} />
          <span>{favoriteLoading ? 'Updating...' : isBookmarked ? 'Saved to Favorites' : 'Add to Favorites'}</span>
        </button>
      </div>

      {/* Header & Meta */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30">
            {article.category}
          </span>
          <span>•</span>
          <span>{article.publisher}</span>
          <span>•</span>
          <span>{new Date(article.publicationDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold font-display text-white leading-tight">
          {article.headline}
        </h1>

        <p className="text-lg text-slate-300 font-light leading-relaxed border-l-2 border-cyan-400 pl-4 italic">
          {article.summary}
        </p>
      </div>

      {/* Main Image */}
      <div className="rounded-3xl overflow-hidden border border-[#263449] shadow-2xl h-80 sm:h-96">
        <img
          src={article.image}
          alt={article.headline}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Body */}
      <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-[#263449] space-y-6 text-slate-200 text-base leading-relaxed font-light">
        <p>{article.body}</p>

        {article.originalUrl && (
          <div className="pt-6 border-t border-[#263449] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
            <span className="text-slate-400">Published by {article.publisher}</span>
            <a
              href={article.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 text-cyan-400 hover:underline"
            >
              <span>View Original Agency Source</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        entityName={article?.headline}
        entityType="Space News Article"
      />
    </div>
  );
}

export default NewsDetail;
