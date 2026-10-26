import React from 'react';
import {
  Search,
  X,
  Filter,
  Satellite,
  Compass,
  Radio,
  Globe,
  CloudSun,
  Activity,
  Layers,
  ChevronRight,
} from 'lucide-react';

const CATEGORY_ICONS = {
  all: Layers,
  stations: Radio,
  earth_observation: Globe,
  weather: CloudSun,
  navigation: Compass,
  science: Activity,
  communications: Satellite,
  other: Satellite,
};

export function SatelliteSearchFilter({
  satellites = [],
  categories = [],
  selectedCategory = 'all',
  onSelectCategory = () => {},
  searchQuery = '',
  onSearchChange = () => {},
  selectedSatellite = null,
  onSelectSatellite = () => {},
  isCollapsed = false,
  onToggleCollapse = () => {},
}) {
  const filteredSatellites = satellites.filter((sat) => {
    const matchesCategory =
      selectedCategory === 'all' || sat.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      sat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sat.noradId.toString().includes(searchQuery) ||
      (sat.designator && sat.designator.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full bg-[#0D1422]/95 border-r border-[#263449] backdrop-blur-xl w-full sm:w-80 md:w-88 shrink-0 overflow-hidden text-[#F1F5F9]">
      {/* Search Header */}
      <div className="p-4 border-b border-[#263449] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider text-sky-400 uppercase">
              ORBITAL REGISTRY
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {filteredSatellites.length} / {satellites.length}
          </span>
        </div>

        {/* Search Bar Input */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search name, NORAD ID..."
            className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#111C2E] border border-[#263449] text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Pills Slider / Filter List */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px] font-mono">
          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id] || Satellite;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-500 text-slate-950 font-semibold shadow-md'
                    : 'bg-[#111C2E] text-slate-400 hover:text-white hover:bg-[#162338] border border-[#263449]'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{cat.label}</span>
                {cat.count !== undefined && (
                  <span className={`text-[9px] px-1 rounded-full ${isSelected ? 'bg-black/30 text-black' : 'bg-slate-800 text-slate-400'}`}>
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Satellite List Container */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#263449]/40">
        {filteredSatellites.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs font-mono space-y-2">
            <Satellite className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="font-semibold text-slate-300">No Satellites Found</p>
            <p className="text-[11px] text-slate-500">
              Try adjusting your search criteria or category filter.
            </p>
          </div>
        ) : (
          filteredSatellites.map((sat) => {
            const isSelected = selectedSatellite?.noradId === sat.noradId;
            return (
              <button
                key={sat.noradId}
                onClick={() => onSelectSatellite(sat)}
                className={`w-full text-left p-3 transition-all flex items-center justify-between group cursor-pointer ${
                  isSelected
                    ? 'bg-sky-500/15 border-l-4 border-sky-400'
                    : 'hover:bg-[#111C2E]/70'
                }`}
              >
                <div className="space-y-1 min-w-0 pr-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs truncate text-white group-hover:text-sky-300">
                      {sat.name}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      #{sat.noradId}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-[10px] font-mono text-slate-400">
                    <span className="text-sky-400/90 font-medium">
                      {sat.categoryLabel || sat.category}
                    </span>
                    {sat.designator && (
                      <span className="text-slate-500 truncate">{sat.designator}</span>
                    )}
                  </div>
                </div>

                <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'text-sky-400 translate-x-0.5' : 'text-slate-600 group-hover:text-slate-400'}`} />
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

export default SatelliteSearchFilter;
