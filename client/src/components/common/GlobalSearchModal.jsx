import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Compass, Rocket, Satellite, Globe, Calendar, Newspaper, BookOpen, ArrowRight, Loader2, Users } from 'lucide-react';
import { apiClient } from '../../services/api/client';

export function GlobalSearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults(null);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const res = await apiClient.searchAll(query);
        setResults(res.data);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Keyboard shortcut ESC to close
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (url) => {
    onClose();
    navigate(url);
  };

  const getIconForType = (type) => {
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

  const flattenedResults = results
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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#0D1422] border border-[#263449] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#263449] bg-[#111C2E]">
          <Search className="w-5 h-5 text-sky-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search missions, launches, spacecraft, planets, celestial events..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm focus:outline-none"
          />
          {loading && <Loader2 className="w-4 h-4 text-sky-400 animate-spin mr-2 shrink-0" />}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results / Suggestions Container */}
        <div className="overflow-y-auto p-3 space-y-2">
          {!query && (
            <div className="p-6 text-center text-slate-400">
              <p className="text-xs font-mono uppercase tracking-wider text-sky-400 mb-2">Suggested Exploration Topics</p>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {['ISS Space Station', '3D Satellites', 'Europa Clipper', 'Mars Perseverance', 'Artemis II', 'Starship', 'JWST', 'Perseids', 'Moon', 'Jupiter'].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-3 py-1.5 rounded-full bg-[#162338] hover:bg-sky-500/20 hover:text-sky-300 text-xs text-slate-300 border border-[#263449] transition-all"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {query && !loading && flattenedResults.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-slate-300 font-medium">No results found for "{query}"</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for a space mission, rocket, planet, telescope, or astronomical event.
              </p>
            </div>
          )}

          {flattenedResults.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              onClick={() => handleSelect(item.url)}
              className="flex items-center justify-between p-3 rounded-xl bg-[#111C2E]/60 hover:bg-[#162338] border border-transparent hover:border-sky-500/30 cursor-pointer transition-all group"
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700/60 flex items-center justify-center shrink-0 mt-0.5">
                  {getIconForType(item.type)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-slate-100 group-hover:text-sky-300 transition-colors">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{item.summary}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition-transform group-hover:translate-x-1 shrink-0 ml-3" />
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 border-t border-[#263449] bg-[#070B14] flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>
            {results ? `${flattenedResults.length} matches found` : 'Discover humanity’s exploration of the universe'}
          </span>
          <span className="hidden sm:inline">Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
}
