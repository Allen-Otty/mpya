import React from 'react';
import { MainNavArea, RoleId } from '../types';
import {
  Flame,
  ShoppingBag,
  MapPin,
  LayoutDashboard,
  CloudSun,
  MessageSquare,
  ShieldCheck,
  UserPlus,
  Sparkles,
  ChevronRight,
  TrendingUp,
  X,
} from 'lucide-react';

interface SidebarProps {
  currentArea: MainNavArea;
  onSelectArea: (area: MainNavArea) => void;
  currentRole: RoleId | null;
  onSelectRole: (role: RoleId | null) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenAdvice: () => void;
  cartCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentArea,
  onSelectArea,
  currentRole,
  onSelectRole,
  isMobileOpen,
  onCloseMobile,
  onOpenAdvice,
  cartCount,
}) => {
  const navItems: { id: MainNavArea; label: string; icon: any; badge?: string }[] = [
    { id: 'explore', label: 'Explore Feed', icon: Flame, badge: 'Live Shamba' },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, badge: cartCount > 0 ? `${cartCount}` : undefined },
    { id: 'map', label: 'Maps & Discovery', icon: MapPin },
    { id: 'workspace', label: 'My Workspace', icon: LayoutDashboard, badge: currentRole ? currentRole.toUpperCase() : undefined },
    { id: 'climate', label: 'Climate & Advisory', icon: CloudSun, badge: 'New Alert' },
    { id: 'communication', label: 'Communication', icon: MessageSquare },
    { id: 'admin', label: 'Administration', icon: ShieldCheck },
    { id: 'register', label: 'Join / Register', icon: UserPlus },
  ];

  const content = (
    <div className="flex flex-col h-full justify-between p-4 bg-white border-r border-emerald-900/10">
      <div className="space-y-6">
        {/* Brand & Mobile Close */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-900/5">
          <div
            onClick={() => onSelectArea('marketplace')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-xl clay-badge shadow-xs group-hover:scale-105 transition-transform">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-black tracking-tight text-slate-900">
                  MAVUNO
                </span>
                <span className="text-[9px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md">
                  Kenya
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 block -mt-0.5">
                Farm to Plate · No Middlemen
              </span>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Five Navigation Pillars */}
        <div className="space-y-1">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2.5 mb-2">
            Main Areas
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentArea === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectArea(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#e7f5e5] text-emerald-900 shadow-xs border border-emerald-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                      isActive ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : item.id === 'climate'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Current Role Switcher Mini-Widget */}
        <div className="clay-card p-3 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Role Workspace
            </span>
            <button
              onClick={() => {
                onSelectRole(null);
                onSelectArea('workspace');
                onCloseMobile();
              }}
              className="text-[10px] font-extrabold text-emerald-700 hover:underline cursor-pointer"
            >
              All Portals ⇄
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {[
              { id: 'farmer' as RoleId, label: '🧑‍🌾 Farmer' },
              { id: 'cbf' as RoleId, label: '🎓 CBF Hub' },
              { id: 'fpo' as RoleId, label: '🤝 FPO Co-op' },
              { id: 'officer' as RoleId, label: '🧑‍💼 Officer' },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  onSelectRole(r.id);
                  onSelectArea('workspace');
                  onCloseMobile();
                }}
                className={`px-2 py-1.5 rounded-xl text-[11px] font-extrabold transition-all text-left cursor-pointer ${
                  currentRole === r.id
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-emerald-50/70 text-slate-700 hover:bg-emerald-100'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <p className="text-[10px] text-slate-400 font-medium leading-tight pt-1">
            Select <b>CBF Hub</b> for FieldServicely route map, on-site audits & offline sync.
          </p>
        </div>
      </div>

      {/* Footer Advisory Link */}
      <div className="pt-4 border-t border-emerald-900/5 space-y-2">
        <button
          onClick={onOpenAdvice}
          className="clay-btn-secondary w-full py-2 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Strategy Blueprint</span>
        </button>
        <div className="text-[10px] text-slate-400 text-center font-bold">
          Vihiga County Pilot · Built for Kenya
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
