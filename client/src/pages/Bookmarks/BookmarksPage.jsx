import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2, ArrowRight, Compass, Rocket, Satellite, BookOpen, Calendar, Newspaper } from 'lucide-react';
import { getLocalBookmarks, setLocalBookmarks } from '../../utils/storage';

export function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    setBookmarks(getLocalBookmarks());
  }, []);

  const removeBookmark = (id) => {
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    setLocalBookmarks(updated);
  };

  const clearAll = () => {
    setBookmarks([]);
    try {
      localStorage.removeItem('spaceops_bookmarks');
      localStorage.removeItem('orbitron_bookmarks');
    } catch {}
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Mission':
        return <Compass className="w-4 h-4 text-sky-400" />;
      case 'Launch':
        return <Rocket className="w-4 h-4 text-amber-400" />;
      case 'Spacecraft':
        return <Satellite className="w-4 h-4 text-indigo-400" />;
      case 'Event':
        return <Calendar className="w-4 h-4 text-purple-400" />;
      case 'News':
        return <Newspaper className="w-4 h-4 text-cyan-400" />;
      default:
        return <BookOpen className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#263449] pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 text-xs font-mono text-sky-400 uppercase tracking-wider">
            <Bookmark className="w-4 h-4" />
            <span>Personal Discovery</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white">
            Saved Missions & Bookmarks
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl font-light">
            Your saved collection of space exploration missions, upcoming rocket launches, spacecraft specifications, and educational guides.
          </p>
        </div>

        {bookmarks.length > 0 && (
          <button
            onClick={clearAll}
            className="px-4 py-2 rounded-xl bg-[#111C2E] hover:bg-rose-500/20 hover:text-rose-300 text-xs font-mono text-slate-400 border border-[#263449] transition-all self-start sm:self-auto"
          >
            Clear All Bookmarks
          </button>
        )}
      </div>

      {bookmarks.length === 0 ? (
        <div className="py-24 text-center rounded-3xl glass-panel border border-[#263449] p-8 space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mx-auto text-sky-400">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold font-display text-white">No Bookmarks Saved Yet</h3>
          <p className="text-xs text-slate-400 leading-relaxed font-light">
            As you explore missions, rocket launches, spacecraft, and educational articles, tap the bookmark icon to save them here for quick access.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link to="/missions" className="px-4 py-2 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs uppercase font-mono">
              Explore Missions
            </Link>
            <Link to="/launches" className="px-4 py-2 rounded-xl bg-[#111C2E] text-slate-300 border border-[#263449] text-xs uppercase font-mono">
              View Launches
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((bm) => (
            <div
              key={bm.id}
              className="p-6 rounded-2xl glass-panel border border-[#263449] hover:border-sky-500/30 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getIcon(bm.itemType)}
                    <span className="text-[11px] font-mono text-sky-400 uppercase">{bm.itemType}</span>
                  </div>
                  <button
                    onClick={() => removeBookmark(bm.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                    title="Remove from bookmarks"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <Link
                  to={bm.url}
                  className="text-lg font-bold font-display text-white group-hover:text-sky-300 transition-colors block"
                >
                  {bm.title}
                </Link>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {bm.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-[#263449]/70 mt-4 flex items-center justify-between text-xs font-mono">
                <Link to={bm.url} className="text-sky-400 hover:underline flex items-center space-x-1">
                  <span>Open Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookmarksPage;
