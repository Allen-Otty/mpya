import React, { useState } from 'react';
import { Farm, CategoryId } from '../types';
import { CATEGORIES } from '../mockData';
import { Search, MapPin, CheckCircle, ShieldCheck, Star, Sparkles } from 'lucide-react';

interface ExploreMapProps {
  farms: Farm[];
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  onSelectFarm: (farm: Farm) => void;
  unlockedFarmIds: Record<number, boolean>;
  onSwitchToFeed?: () => void;
}

export const ExploreMap: React.FC<ExploreMapProps> = ({
  farms,
  selectedCategory,
  onSelectCategory,
  onSelectFarm,
  unlockedFarmIds,
  onSwitchToFeed,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activePinId, setActivePinId] = useState<number | null>(null);

  const filteredFarms = farms.filter((f) => {
    const matchesCategory =
      selectedCategory === 'all' || f.items.some((item) => item.category === selectedCategory);
    const matchesSearch =
      searchQuery.trim() === '' ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getFarmCategoryEmoji = (farm: Farm) => {
    if (selectedCategory !== 'all') {
      const match = CATEGORIES.find((c) => c.id === selectedCategory);
      if (match) return match.emoji;
    }
    const firstCat = farm.items[0]?.category;
    const catObj = CATEGORIES.find((c) => c.id === firstCat);
    return catObj ? catObj.emoji : '🌾';
  };

  return (
    <div className="space-y-6">
      {/* Search and Category Filter Section */}
      <div className="clay-card p-4 space-y-4">
        {onSwitchToFeed && (
          <div className="flex items-center justify-between pb-2 border-b border-emerald-900/5">
            <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <span>🗺️ Vihiga Shamba Map</span>
            </span>
            <button
              onClick={onSwitchToFeed}
              className="clay-btn-primary px-3 py-1 text-xs font-black inline-flex items-center gap-1 cursor-pointer"
            >
              <span>📱 Open TikTok Produce Feed →</span>
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 px-3 py-1.5 clay-inset-well">
          <Search className="w-5 h-5 text-emerald-700/70 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sukuma, kienyeji chicken, milk, Luanda..."
            className="w-full bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none py-1.5"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold px-2 py-0.5 rounded-full"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills with Clay Style */}
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-900/60 mb-2 px-1">
            Filter Produce
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`clay-pill px-4 py-2 text-xs font-extrabold whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer transition-all ${
                    isSelected ? 'clay-pill-active' : 'text-emerald-950 hover:text-emerald-700'
                  }`}
                >
                  <span className="text-sm">{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Illustrated Interactive Clay Map */}
      <div className="clay-card-white p-3 relative overflow-hidden">
        <div className="flex items-center justify-between px-2 py-1 mb-2 text-xs font-bold text-slate-600">
          <span className="flex items-center gap-1 text-emerald-800">
            <MapPin className="w-4 h-4 text-emerald-600" />
            Vihiga Pilot Zone · Illustrated GPS Grid
          </span>
          <span className="text-[11px] font-semibold text-slate-500">
            Tap a pin to inspect shamba
          </span>
        </div>

        <div className="relative rounded-2xl overflow-hidden bg-[#e8f6e6] border border-emerald-900/10">
          <svg
            viewBox="0 0 400 300"
            className="w-full h-auto block select-none"
            role="img"
            aria-label="Illustrated map of farms near Luanda, Kima, Chavakali, and Mbale"
          >
            <defs>
              <linearGradient id="terrainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#eaf7e8" />
                <stop offset="100%" stopColor="#d9eed6" />
              </linearGradient>
              <linearGradient id="hillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#cce8c8" />
                <stop offset="100%" stopColor="#bee0ba" />
              </linearGradient>
            </defs>

            {/* Base Terrain */}
            <rect width="400" height="300" fill="url(#terrainGrad)" />

            {/* Rolling Hills / Topography contours */}
            <path
              d="M0 210 C80 180 120 240 200 215 S330 160 400 190 V300 H0Z"
              fill="url(#hillGrad)"
            />
            <path
              d="M10 20 C90 10 160 50 250 30 S350 20 400 60 V0 H0Z"
              fill="#d4ebd0"
              opacity="0.6"
            />

            {/* River Yala tributary */}
            <path
              d="M-10 90 C60 110 110 60 190 85 S320 140 410 100"
              stroke="#b5def2"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M-10 90 C60 110 110 60 190 85 S320 140 410 100"
              stroke="#8bcbe9"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />

            {/* Main Highways & Feeder Boda Roads */}
            <path
              d="M40 0 C70 90 130 150 190 300"
              stroke="#ffffff"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M40 0 C70 90 130 150 190 300"
              stroke="#d1ded0"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />

            <path
              d="M0 160 C100 150 250 170 400 140"
              stroke="#ffffff"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M0 160 C100 150 250 170 400 140"
              stroke="#d1ded0"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />

            <path
              d="M290 0 C270 80 300 200 330 300"
              stroke="#ffffff"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />

            {/* Town Labels */}
            <g fontSize="11" fill="#446648" fontWeight="800">
              <rect x="160" y="156" width="56" height="18" rx="6" fill="#ffffff" opacity="0.85" />
              <text x="188" y="169" textAnchor="middle">Luanda</text>

              <rect x="52" y="38" width="44" height="18" rx="6" fill="#ffffff" opacity="0.85" />
              <text x="74" y="51" textAnchor="middle">Kima</text>

              <rect x="274" y="42" width="68" height="18" rx="6" fill="#ffffff" opacity="0.85" />
              <text x="308" y="55" textAnchor="middle">Chavakali</text>

              <rect x="216" y="252" width="50" height="18" rx="6" fill="#ffffff" opacity="0.85" />
              <text x="241" y="265" textAnchor="middle">Mbale</text>
            </g>

            {/* Farm Pins */}
            {filteredFarms.map((f) => {
              const isUnlocked = unlockedFarmIds[f.id];
              const isHighlighted = activePinId === f.id;
              const emoji = getFarmCategoryEmoji(f);

              return (
                <g
                  key={f.id}
                  transform={`translate(${f.x}, ${f.y})`}
                  className="cursor-pointer group"
                  onClick={() => {
                    setActivePinId(f.id);
                    onSelectFarm(f);
                  }}
                  onMouseEnter={() => setActivePinId(f.id)}
                  onMouseLeave={() => setActivePinId(null)}
                >
                  {/* Outer pulse/range zone */}
                  <circle
                    r={isHighlighted ? 26 : 20}
                    className="transition-all duration-300"
                    fill="#388e3c"
                    opacity={isHighlighted ? 0.28 : 0.16}
                  />

                  {/* Tactile Pin Circle */}
                  <circle
                    r="14"
                    fill={isUnlocked ? '#d32f2f' : '#2e7d32'}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    filter="drop-shadow(0 4px 6px rgba(0,0,0,0.25))"
                  />

                  {/* Category icon */}
                  <text
                    y="5"
                    fontSize="13"
                    textAnchor="middle"
                    className="select-none pointer-events-none"
                  >
                    {emoji}
                  </text>

                  {/* Unlocked exact indicator (Red dot) */}
                  {isUnlocked && (
                    <circle
                      cx="10"
                      cy="-8"
                      r="4.5"
                      fill="#ef4444"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  )}

                  {/* Mini Hover Label */}
                  <g
                    transform="translate(0, -22)"
                    opacity={isHighlighted ? 1 : 0}
                    className="transition-opacity duration-200 pointer-events-none"
                  >
                    <rect
                      x="-50"
                      y="-12"
                      width="100"
                      height="18"
                      rx="6"
                      fill="#1f2937"
                      opacity="0.9"
                    />
                    <text
                      y="1"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {f.name.slice(0, 15)}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Map Footer Note */}
          <div className="absolute left-2.5 bottom-2.5 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-xl text-[10px] font-bold text-slate-600 shadow-xs border border-white">
            📍 Illustrated Shamba Grid · Exact coordinates unlocked upon confirmed order
          </div>
        </div>
      </div>

      {/* Farms List Results */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-1.5">
            <span>🌾</span>
            <span>{filteredFarms.length} Shamba{filteredFarms.length === 1 ? '' : 's'} near Luanda</span>
          </h2>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Direct from Farmers
          </span>
        </div>

        {filteredFarms.length === 0 ? (
          <div className="clay-card p-6 text-center text-slate-500">
            <p className="font-semibold text-sm">No shambas found matching your filter.</p>
            <button
              onClick={() => {
                onSelectCategory('all');
                setSearchQuery('');
              }}
              className="clay-btn-secondary px-4 py-2 mt-3 text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-3.5 sm:grid-cols-2">
            {filteredFarms.map((farm) => {
              const isUnlocked = unlockedFarmIds[farm.id];
              return (
                <div
                  key={farm.id}
                  onClick={() => onSelectFarm(farm)}
                  className="clay-card p-4 cursor-pointer hover:-translate-y-1 transition-all duration-200 group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {farm.image ? (
                          <img
                            src={farm.image}
                            alt={farm.name}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                              const fallback = (e.target as HTMLElement).nextElementSibling;
                              if (fallback) (fallback as HTMLElement).style.display = 'flex';
                            }}
                            className="w-13 h-13 rounded-2xl object-cover shrink-0 shadow-sm border border-white"
                          />
                        ) : null}
                        <div
                          style={{ display: farm.image ? 'none' : 'flex' }}
                          className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-200 border border-emerald-300/40 items-center justify-center text-2xl shrink-0 shadow-xs"
                        >
                          {farm.items[0]?.category === 'vegetables'
                            ? '🥬'
                            : farm.items[0]?.category === 'chicken'
                            ? '🍗'
                            : farm.items[0]?.category === 'eggs'
                            ? '🥚'
                            : farm.items[0]?.category === 'milk'
                            ? '🥛'
                            : farm.items[0]?.category === 'beef'
                            ? '🥩'
                            : '🍠'}
                        </div>
                        <div>
                          <h3 className="font-black text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {farm.name}
                          </h3>
                          <p className="text-xs font-bold text-slate-500 mt-0.5">
                            {farm.owner} · <span className="text-emerald-800">{farm.area}</span>
                          </p>
                          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700 mt-1">
                            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                            <span>{farm.rating}</span>
                          </div>
                        </div>
                      </div>

                      {farm.isVerified ? (
                        <span className="clay-badge bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 border border-emerald-200 shrink-0 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          Verified
                        </span>
                      ) : (
                        <span className="clay-badge bg-amber-50 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 border border-amber-200 shrink-0">
                          Awaiting Visit
                        </span>
                      )}
                    </div>

                    <div className="clay-inset-well p-2.5 text-xs text-slate-600 line-clamp-2">
                      <span className="font-extrabold text-emerald-900">Practices: </span>
                      {farm.practices}
                    </div>

                    <div className="space-y-1">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Available Produce
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {farm.items.slice(0, 3).map((item) => (
                          <span
                            key={item.id}
                            className="bg-white/80 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-lg border border-slate-200/70"
                          >
                            {item.name} · <b className="text-emerald-700 font-extrabold">KES {item.price}</b>/{item.unit}
                          </span>
                        ))}
                        {farm.items.length > 3 && (
                          <span className="text-xs text-slate-500 font-bold self-center">
                            +{farm.items.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-emerald-900/5 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">
                      {isUnlocked ? (
                        <span className="text-red-600 font-bold flex items-center gap-1">
                          📍 Exact GPS Unlocked
                        </span>
                      ) : (
                        '📍 ~100m Privacy Area'
                      )}
                    </span>
                    <button className="clay-btn-secondary px-3.5 py-1.5 text-xs font-extrabold">
                      View & Order →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* How it Works / Trust Mechanism Banner */}
      <div className="clay-card p-5 space-y-3">
        <h3 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>How Mavuno Connects Kenya Directly</span>
        </h3>
        <div className="grid sm:grid-cols-3 gap-3 text-xs">
          <div className="clay-inset-well p-3 space-y-1">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-xs">
              1
            </div>
            <div className="font-black text-slate-800">Find Shamba on the Map</div>
            <div className="text-slate-500 font-medium leading-relaxed">
              Browse verified farmers in Vihiga. Filter by poultry, greens, milk, or bulk maize.
            </div>
          </div>
          <div className="clay-inset-well p-3 space-y-1">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-xs">
              2
            </div>
            <div className="font-black text-slate-800">Order & Coordinate Delivery</div>
            <div className="text-slate-500 font-medium leading-relaxed">
              Agree on Boda Boda dropoff or farm pickup via direct chat. Real-time WhatsApp alert sent to farmer.
            </div>
          </div>
          <div className="clay-inset-well p-3 space-y-1">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-xs">
              3
            </div>
            <div className="font-black text-slate-800">Pay on Delivery / Escrow</div>
            <div className="text-slate-500 font-medium leading-relaxed">
              Farmers keep 100% of farm-gate value. No brokers (middlemen) slashing farmer prices.
            </div>
          </div>
        </div>
      </div>

      {/* One Platform No Middlemen */}
      <div className="clay-card p-5 space-y-2">
        <h3 className="font-black text-sm text-slate-900 flex items-center gap-1.5">
          <span>🤝</span>
          <span>One Platform, No Middlemen</span>
        </h3>
        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          Farmers, FPOs, households and food vendors, bulk buyers like supermarkets and distributors, county agricultural officers, CBFs and partner organizations, all in one place. Buyers deal directly with the shamba or FPO, so more of the farm-gate value stays with the farmer.
        </p>
      </div>

      {/* Where Mavuno is Going Roadmap */}
      <div className="space-y-2.5">
        <div className="text-xs font-black uppercase tracking-wider text-slate-500 px-1">
          Where Mavuno is Going
        </div>
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          <div className="clay-card p-3.5 space-y-1">
            <b className="text-emerald-700 font-black text-[11px] block uppercase tracking-wider">NOW</b>
            <span className="text-slate-700 font-semibold leading-snug block">
              Farm map, price lists, orders, WhatsApp alerts
            </span>
          </div>
          <div className="clay-card p-3.5 space-y-1">
            <b className="text-emerald-700 font-black text-[11px] block uppercase tracking-wider">NEXT</b>
            <span className="text-slate-700 font-semibold leading-snug block">
              M-Pesa payments held in escrow until delivery is confirmed
            </span>
          </div>
          <div className="clay-card p-3.5 space-y-1">
            <b className="text-emerald-700 font-black text-[11px] block uppercase tracking-wider">THEN</b>
            <span className="text-slate-700 font-semibold leading-snug block">
              Farmer produce organizations (FPOs) selling in bulk
            </span>
          </div>
          <div className="clay-card p-3.5 space-y-1">
            <b className="text-emerald-700 font-black text-[11px] block uppercase tracking-wider">THEN</b>
            <span className="text-slate-700 font-semibold leading-snug block">
              Extension officers and NGOs advising farmers directly
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
