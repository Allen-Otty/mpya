import React from 'react';
import { Menu, Search, ShoppingBag, MapPin, Bell, User, CheckCircle2 } from 'lucide-react';
import { RoleId } from '../types';
import { ROLES } from '../mockData';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  currentRole: RoleId | null;
  onSelectRole: (role: RoleId | null) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  currentRole,
  onSelectRole,
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenCart,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-emerald-900/10 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Mobile Menu Trigger & Location Context */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Location context pill */}
          <div className="clay-pill px-3 py-1 text-xs font-black text-emerald-800 bg-[#e3f1e4] flex items-center gap-1.5 shrink-0">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">Vihiga County ·</span>
            <span>Luanda Pilot</span>
          </div>
        </div>

        {/* Center: Search Field */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="flex items-center gap-2 px-3 py-1.5 clay-inset-well">
            <Search className="w-4 h-4 text-emerald-700/70 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search produce, shambas, FPOs, extension advice..."
              className="w-full bg-transparent text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Right: Role Switcher & Cart */}
        <div className="flex items-center gap-2">
          {/* Quick Role Switcher */}
          <div className="flex items-center gap-1.5">
            <select
              value={currentRole || 'buyer'}
              onChange={(e) => onSelectRole(e.target.value as RoleId)}
              className="clay-pill px-3 py-1.5 text-xs font-extrabold text-slate-800 bg-white cursor-pointer focus:outline-none"
            >
              <option value="buyer">🛒 Local Buyer</option>
              <option value="farmer">🧑‍🌾 Shamba Owner</option>
              <option value="fpo">🤝 FPO Leader</option>
              <option value="officer">🧑‍💼 County Officer</option>
              <option value="cbf">🎓 CBF Facilitator</option>
              <option value="bulk">🏪 Bulk Buyer</option>
              <option value="rider">🏍️ Boda Courier</option>
              <option value="ngo">🏢 Partner NGO</option>
            </select>
          </div>

          {/* Shopping Cart button */}
          <button
            onClick={onOpenCart}
            className="clay-btn-secondary p-2 rounded-2xl relative cursor-pointer"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-800" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-emerald-700 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
