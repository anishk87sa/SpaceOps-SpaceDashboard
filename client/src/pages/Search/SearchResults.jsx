import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Compass, Rocket, Satellite, Globe, Calendar, Newspaper, BookOpen, ArrowRight, Users } from 'lucide-react';
import { apiClient } from '../../services/api/client';
import { PagePreloader } from '../../components/common/PagePreloader';

export function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    setSearchInput(query);
    if (!query.trim()) {
      setResults(null);
      return;
    }

    async function executeSearch() {
      setLoading(true);
      try {
        const res = await apiClient.searchAll(query);
        setResults(res.data);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }
    executeSearch();
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Mission':
        return <Compass className="w-4 h-4 text-sky-400" />;
      case 'Launch':
        return <Rocket className="w-4 h-4 text-amber-400" />;
      case 'Spacecraft':
        return <Satellite className="w-4 h-4 text-indigo-400" />;
      case 'Destination':
        return <Globe className="w-4 h-4 text-emerald-400" />;
      case 'Space Event':
        return <Calendar className="w-4 h-4 text-purple-400" />;
      case 'News':
        return <Newspaper className="w-4 h-4 text-cyan-400" />;
      case 'Astronaut':
        return <Users className="w-4 h-4 text-emerald-400" />;
      default:
        return <BookOpen className="w-4 h-4 text-blue-400" />;
    }
  };

  const allItems = results
    ? [
        ...(results.results?.astronauts || []),
        ...(results.results?.missions || []),
        ...(results.results?.launches || []),
        ...(results.results?.spacecraft || []),
        ...(results.results?.destinations || []),
        ...(results.results?.events || []),
        ...(results.results?.news || []),
        ...(results.results?.learn || []),
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header & Search Bar */}
      <div className="space-y-6 max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
          Global Space Discovery Search
        </h1>
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search across all missions, launches, spacecraft, events, and guides..."
              className="w-full pl-12 pr-4 py-3 bg-[#0D1422] border border-[#263449] rounded-2xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 shadow-inner"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs uppercase font-mono tracking-wider transition-all shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results Feed */}
      {loading ? (
        <PagePreloader
          title="Scanning SpaceOps Databases"
          message={`Searching missions, rocket launches, spacecraft, and guides for "${query || 'all records'}"...`}
        />
      ) : query && allItems.length === 0 ? (
        <div className="py-20 text-center rounded-2xl glass-panel border border-[#263449] p-8 animate-fade-in">
          <p className="text-slate-300 font-medium text-lg">No exploration results found for "{query}"</p>
          <p className="text-xs text-slate-400 mt-2">
            Try keywords like "Europa", "Mars", "Webb", "Starship", "Artemis", or "Eclipse".
          </p>
        </div>
      ) : allItems.length > 0 ? (
        <div className="space-y-4 animate-fade-in">
          <div className="text-xs font-mono text-slate-400 pb-2 border-b border-[#263449]">
            Found {allItems.length} matches for "{query}"
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allItems.map((item) => (
              <Link
                key={`${item.type}-${item.id}`}
                to={item.url}
                className="p-5 rounded-2xl glass-panel border border-[#263449] hover:border-sky-500/40 transition-all flex items-start justify-between group"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#0D1422] border border-slate-700/60 flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-base font-bold font-display text-white group-hover:text-sky-300 transition-colors">
                        {item.title}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {item.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-transform shrink-0 ml-4 mt-2" />
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default SearchResults;
