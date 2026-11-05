import React from 'react';
import { Sparkles, MapPin, Lightbulb } from 'lucide-react';
import { RoleId } from '../types';

interface NavbarProps {
  activeTab: 'explore' | 'account';
  setActiveTab: (tab: 'explore' | 'account') => void;
  currentRole: RoleId | null;
  onOpenAdvice: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentRole,
  onOpenAdvice,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-900/10 px-4 py-3">
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div
          onClick={() => setActiveTab('explore')}
          className="flex items-center gap-2 cursor-pointer select-none group shrink-0"
        >
          <div className="w-9 h-9 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-lg clay-badge shadow-sm group-hover:scale-105 transition-transform">
            🌾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-slate-900 group-hover:text-emerald-800 transition-colors">
                Mavuno
              </span>
              <span className="clay-pill px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-800 bg-[#e3f1e4] hidden sm:inline-block">
                📍 Kenya · Vihiga
              </span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 block -mt-0.5">
              Farm to plate, no middlemen
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Segmented Control */}
        <nav className="flex items-center gap-1.5 p-1 bg-emerald-50/80 rounded-2xl border border-emerald-900/10 shrink-0">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-3.5 py-1.5 text-xs font-black rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'explore'
                ? 'clay-pill-active'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🗺️ Explore Map
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`px-3.5 py-1.5 text-xs font-black rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'account'
                ? 'clay-pill-active'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>👤 Roles</span>
            {currentRole && (
              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
            )}
          </button>
        </nav>

        {/* Zone 3: Strategic Advice Modal Launcher */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenAdvice}
            className="clay-btn-secondary px-3 py-1.5 text-xs font-black flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="hidden md:inline">Strategy Advice</span>
            <span className="md:hidden">Advice</span>
          </button>
        </div>
      </div>
    </header>
  );
};
