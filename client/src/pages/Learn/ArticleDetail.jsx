import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  ChevronLeft,
  Bookmark,
  CheckCircle2,
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

export function ArticleDetail() {
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
        const res = await apiClient.getArticleBySlug(slug);
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
        setError(err.message || 'Educational guide not found');
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
          entityName: article.title,
          metadata: {
            summary: article.summary,
            url: `/learn/${entityId}`,
            category: article.category,
          },
        });
        setIsBookmarked(true);
      }
    } catch (e) {
      console.error('Failed to toggle article favorite:', e);
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading) {
    return (
      <PagePreloader
        title="Loading Educational Guide"
        message="Retrieving space science concepts, illustrations, and study guides..."
      />
    );
  }

  if (!loading && (error || !article)) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-fade-in">
        <h2 className="text-2xl font-bold font-display text-white mb-4">Guide Not Found</h2>
        <Link to="/learn" className="px-4 py-2 rounded-xl bg-blue-500 text-white font-bold text-xs uppercase font-mono">
          Return to Learning Center
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      {/* Back and Bookmark */}
      <div className="flex items-center justify-between">
        <Link
          to="/learn"
          className="inline-flex items-center space-x-1.5 text-xs font-mono text-slate-400 hover:text-blue-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Learning Center</span>
        </Link>

        <button
          onClick={toggleBookmark}
          disabled={favoriteLoading}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg border text-xs font-mono transition-all disabled:opacity-50 cursor-pointer ${
            isBookmarked
              ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
              : 'bg-[#111C2E] text-slate-300 border-[#263449] hover:text-white'
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-blue-400 text-blue-400' : ''}`} />
          <span>{favoriteLoading ? 'Updating...' : isBookmarked ? 'Saved to Favorites' : 'Add to Favorites'}</span>
        </button>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-xs font-mono text-blue-400">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30">
            {article.category}
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.readingTime}</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold font-display text-white leading-tight">
          {article.title}
        </h1>

        <p className="text-lg text-slate-300 font-light leading-relaxed border-l-2 border-blue-400 pl-4 italic">
          {article.summary}
        </p>
      </div>

      {/* Banner Image */}
      <div className="rounded-3xl overflow-hidden border border-[#263449] shadow-2xl h-80 sm:h-96">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
      </div>

      {/* Key Takeaways */}
      {article.keyTakeaways && (
        <div className="p-8 rounded-3xl bg-gradient-to-br from-[#111C2E] to-[#0D1422] border border-blue-500/30 space-y-4">
          <h2 className="text-lg font-bold font-display text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span>Key Takeaways for Students & Readers</span>
          </h2>
          <ul className="space-y-2">
            {article.keyTakeaways.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-3 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Content Article */}
      <div className="p-8 sm:p-12 rounded-3xl glass-panel border border-[#263449] space-y-6 text-slate-200 text-base leading-relaxed font-light whitespace-pre-line">
        {article.content}
      </div>

      {/* References */}
      {article.references && (
        <div className="p-6 rounded-2xl bg-[#0D1422] border border-[#263449] space-y-3 text-xs font-mono">
          <span className="text-slate-400 uppercase block">Educational References & Further Reading</span>
          <ul className="space-y-1 text-slate-300 list-disc list-inside">
            {article.references.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        entityName={article?.title}
        entityType="Educational Guide"
      />
    </div>
  );
}

export default ArticleDetail;
