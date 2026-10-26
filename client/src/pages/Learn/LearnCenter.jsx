import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BookOpen, Search, ArrowRight, Clock, Sparkles, ChevronRight } from 'lucide-react';
import { apiClient } from '../../services/api/client';
import { PagePreloader } from '../../components/common/PagePreloader';

export function LearnCenter() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get('q') || '';
  const currentCategory = searchParams.get('category') || 'All';

  const categories = [
    'All',
    'Rocketry & Propulsion',
    'Orbital Mechanics',
    'Planetary Science',
    'Astrophysics & Telescopes',
  ];

  useEffect(() => {
    async function loadArticles() {
      setLoading(true);
      try {
        const params = {};
        if (searchQuery) params.q = searchQuery;
        if (currentCategory !== 'All') params.category = currentCategory;

        const res = await apiClient.getArticles(params);
        setArticles(res.data);
      } catch (err) {
        console.error('Failed to load educational articles:', err);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, [searchQuery, currentCategory]);

  const updateParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val === 'All' || !val) {
      next.delete(key);
    } else {
      next.set(key, val);
    }
    setSearchParams(next);
  };

  if (loading && articles.length === 0) {
    return (
      <PagePreloader
        title="Loading Educational Center"
        message="Curating rocketry, orbital mechanics, and astronomy learning modules..."
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center space-x-2 text-xs font-mono text-blue-400 uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          <span>Space Education & Science Guides</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
          Educational Learning Center
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl font-light">
          Accessible, beautifully explained space science guides written for students, curious minds, and space enthusiasts.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-[#263449] space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => updateParam('category', cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                  currentCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-blue-500 text-white font-bold'
                    : 'bg-[#0D1422] text-slate-300 hover:text-white border border-[#263449]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => updateParam('q', e.target.value)}
              placeholder="Search topic or concept..."
              className="w-full pl-9 pr-4 py-2 bg-[#0D1422] border border-[#263449] rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 font-mono text-xs">
          Loading learning guides...
        </div>
      ) : articles.length === 0 ? (
        <div className="py-20 text-center rounded-2xl glass-panel border border-[#263449] p-8">
          <p className="text-slate-300 font-medium">No guides found for your query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((art) => (
            <Link
              key={art.id}
              to={`/learn/${art.slug}`}
              className="glass-panel rounded-3xl overflow-hidden border border-[#263449] hover:border-blue-500/50 transition-all flex flex-col justify-between group shadow-xl"
            >
              <div>
                <div className="h-56 relative overflow-hidden">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[10px] font-mono text-blue-300 uppercase">
                    {art.category}
                  </div>
                  <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-md bg-slate-900/90 text-[10px] font-mono text-slate-300 border border-slate-700 flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-blue-400" />
                    <span>{art.readingTime}</span>
                  </div>
                </div>

                <div className="p-8 space-y-3">
                  <h3 className="text-xl font-bold font-display text-white group-hover:text-blue-300 transition-colors">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed font-light">
                    {art.summary}
                  </p>
                </div>
              </div>

              <div className="px-8 py-5 border-t border-[#263449] bg-[#070B14]/40 flex items-center justify-between text-xs font-mono text-blue-400">
                <span>Start Reading Guide</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default LearnCenter;
