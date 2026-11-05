import React, { useState } from 'react';
import { Farm, FarmProduct, CategoryId } from '../types';
import { CATEGORIES } from '../mockData';
import { ShoppingBag, Search, Plus, Check, Star, ShieldCheck, MapPin } from 'lucide-react';

interface MarketplaceViewProps {
  farms: Farm[];
  onSelectFarm: (farm: Farm) => void;
  onAddToCart: (item: FarmProduct, farm: Farm) => void;
  cartItemIds: Record<string, number>;
  onSwitchToFeed?: () => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  farms,
  onSelectFarm,
  onAddToCart,
  cartItemIds,
  onSwitchToFeed,
}) => {
  const [selectedCat, setSelectedCat] = useState<CategoryId>('all');
  const [search, setSearch] = useState('');

  // Collect all available products from all farms
  const allProducts: { product: FarmProduct; farm: Farm }[] = [];
  farms.forEach((f) => {
    f.items.forEach((item) => {
      allProducts.push({ product: item, farm: f });
    });
  });

  const filteredProducts = allProducts.filter(({ product, farm }) => {
    const matchesCat = selectedCat === 'all' || product.category === selectedCat;
    const matchesSearch =
      search.trim() === '' ||
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      farm.name.toLowerCase().includes(search.toLowerCase()) ||
      farm.area.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Hero Marketplace Banner */}
      <div className="clay-card p-6 relative overflow-hidden bg-gradient-to-r from-[#edf7ec] via-white to-[#edf7ec]">
        <div className="max-w-md space-y-2">
          <div className="clay-pill px-3 py-1 text-[10px] font-black text-emerald-800 bg-white inline-block">
            🌾 Direct Shamba Harvest · No Middlemen
          </div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            Explore Fresh Harvest Produce
          </h1>
          <p className="text-xs font-semibold text-slate-500 leading-relaxed">
            Order directly from verified family shambas in Vihiga. Farm-gate prices, pay on delivery, picked fresh this morning.
          </p>
          {onSwitchToFeed && (
            <div className="pt-1">
              <button
                onClick={onSwitchToFeed}
                className="clay-btn-primary px-3.5 py-1.5 text-xs font-black inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>📱 Switch to TikTok-Style Produce Feed</span>
                <span>→</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Category Filter Pills & Search */}
      <div className="clay-card p-4 space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`clay-pill px-3.5 py-2 text-xs font-bold whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isSelected ? 'clay-pill-active' : 'text-slate-700'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-black text-slate-900">
            Available Produce ({filteredProducts.length} items)
          </h2>
          <span className="text-xs font-bold text-emerald-700">
            Harvested daily in Vihiga
          </span>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2 md:grid-cols-3">
          {filteredProducts.map(({ product, farm }) => {
            const inCartQty = cartItemIds[product.id] || 0;
            return (
              <div
                key={`${farm.id}-${product.id}`}
                className="clay-card p-4 flex flex-col justify-between hover:-translate-y-1 transition-all duration-200 group"
              >
                <div className="space-y-2.5">
                  {/* Category icon / photo */}
                  <div className="w-full h-28 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center text-4xl shadow-xs border border-emerald-900/5 relative">
                    <span>
                      {product.category === 'vegetables'
                        ? '🥬'
                        : product.category === 'chicken'
                        ? '🍗'
                        : product.category === 'eggs'
                        ? '🥚'
                        : product.category === 'milk'
                        ? '🥛'
                        : product.category === 'beef'
                        ? '🥩'
                        : '🍠'}
                    </span>
                    {farm.isVerified && (
                      <span className="absolute top-2 right-2 bg-white/90 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Verified
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-black text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {product.name}
                    </h3>
                    <div
                      onClick={() => onSelectFarm(farm)}
                      className="text-xs font-bold text-slate-500 hover:text-emerald-800 cursor-pointer flex items-center gap-1 mt-0.5"
                    >
                      <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{farm.name}</span>
                      <span>·</span>
                      <span className="text-emerald-800">{farm.area}</span>
                    </div>
                  </div>

                  {product.availableQty && (
                    <div className="text-[11px] font-bold text-slate-400">
                      📦 {product.availableQty} ready
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-emerald-900/5 flex items-center justify-between">
                  <div>
                    <div className="text-base font-black text-emerald-800">
                      KES {product.price}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 -mt-0.5">
                      per {product.unit}
                    </div>
                  </div>

                  <button
                    onClick={() => onAddToCart(product, farm)}
                    className="clay-btn-primary px-3 py-1.5 text-xs font-black inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    {inCartQty > 0 ? `In Cart (${inCartQty})` : 'Add to Order'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
