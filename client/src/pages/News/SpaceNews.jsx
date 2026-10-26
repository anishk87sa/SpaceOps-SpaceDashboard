import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Newspaper, Search, ArrowRight, ExternalLink, Calendar, Building, Sparkles } from 'lucide-react';
import { apiClient } from '../../services/api/client';
import { PagePreloader } from '../../components/common/PagePreloader';

export function SpaceNews() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('q') || '';

  const categories = [
    'All',
    'Scientific Discoveries',
    'Mission Updates',
    'Space Agencies',
    'Rocket Launches',
  ];

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      try {
        const params = {};
        if (currentCategory !== 'All') params.category = currentCategory;
        if (searchQuery) params.q = searchQuery;

        const res = await apiClient.getNews(params);
        setNewsList(res.data);
      } catch (err) {
        console.error('Failed to load space news:', err);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
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

  if (loading && newsList.length === 0) {
    return (
      <PagePreloader
        title="Loading Space News Feed"
        message="Retrieving verified announcements from global space agencies..."
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
          <Newspaper className="w-4 h-4" />
          <span>Space Journalism & Scientific Discoveries</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
          Latest Space News
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl font-light">
          Follow verified announcements from NASA, ESA, ISRO, and leading aerospace research institutions. Unpack scientific breakthroughs without sensationalism.
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
                    ? 'bg-cyan-500 text-slate-950 font-bold'
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
              placeholder="Search news or discovery..."
              className="w-full pl-9 pr-4 py-2 bg-[#0D1422] border border-[#263449] rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* News Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 font-mono text-xs">
          Loading news articles...
        </div>
      ) : newsList.length === 0 ? (
        <div className="py-20 text-center rounded-2xl glass-panel border border-[#263449] p-8">
          <p className="text-slate-300 font-medium">No articles found matching your query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsList.map((article) => (
            <Link
              key={article.id}
              to={`/news/${article.slug}`}
              className="glass-panel rounded-2xl overflow-hidden border border-[#263449] hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="h-52 relative overflow-hidden bg-[#070B14]">
                  <img
                    src={article.image || article.imageUrl || 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80'}
                    alt={article.headline || article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[10px] font-mono text-cyan-300 uppercase">
                    {article.category}
                  </div>
                  {article.isRealApi && (
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-cyan-500/90 text-slate-950 font-bold text-[9px] font-mono uppercase tracking-wider">
                      Live Wire
                    </div>
                  )}
                </div>

                <div className="p-6 space-y-3">
                  <div className="text-[11px] font-mono text-slate-400">
                    {article.publisher} • {new Date(article.publicationDate).toLocaleDateString()}
                  </div>

                  <h3 className="text-lg font-bold font-display text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                    {article.headline}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-[#263449]/70 bg-[#070B14]/40 flex items-center justify-between text-xs font-mono text-cyan-400">
                <span>Read Full Article</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default SpaceNews;
