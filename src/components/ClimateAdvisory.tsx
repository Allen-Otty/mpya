import React from 'react';
import { ClimateAlert, TrainingSession } from '../types';
import {
  CloudSun,
  AlertTriangle,
  Droplets,
  Wind,
  Calendar,
  CheckCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface ClimateAdvisoryProps {
  alerts: ClimateAlert[];
  trainingSessions: TrainingSession[];
  onAskAgronomist: () => void;
}

export const ClimateAdvisory: React.FC<ClimateAdvisoryProps> = ({
  alerts,
  trainingSessions,
  onAskAgronomist,
}) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="clay-card p-6 bg-gradient-to-r from-[#eaf4e8] to-white space-y-2">
        <div className="clay-pill px-3 py-1 text-[10px] font-black text-emerald-800 bg-white inline-block">
          🌦️ Kenya Meteorological Dept & Vihiga Extension Hub
        </div>
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          Climate & Agronomic Advisory Services
        </h1>
        <p className="text-xs font-semibold text-slate-500 leading-relaxed">
          Real-time weather telemetry, pest scouting advisories, and climate-smart farming techniques tailored for Maragoli and Luanda sub-counties.
        </p>
      </div>

      {/* 3-Day Agro-Weather Forecast */}
      <div className="clay-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
            <CloudSun className="w-4 h-4 text-emerald-700" />
            <span>Vihiga Agro-Weather Outlook</span>
          </h2>
          <span className="text-[11px] font-bold text-slate-400">Station: Luanda Sub-County</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
          <div className="clay-inset-well p-3 space-y-1">
            <div className="font-extrabold text-slate-500">Today</div>
            <div className="text-lg">⛅</div>
            <div className="font-black text-slate-900">27°C / 18°C</div>
            <div className="text-[10px] text-emerald-700 font-bold">40% light showers</div>
          </div>
          <div className="clay-inset-well p-3 space-y-1">
            <div className="font-extrabold text-slate-500">Tomorrow</div>
            <div className="text-lg">🌧️</div>
            <div className="font-black text-slate-900">24°C / 17°C</div>
            <div className="text-[10px] text-emerald-700 font-bold">85% heavy rain</div>
          </div>
          <div className="clay-inset-well p-3 space-y-1">
            <div className="font-extrabold text-slate-500">Saturday</div>
            <div className="text-lg">🌤️</div>
            <div className="font-black text-slate-900">26°C / 18°C</div>
            <div className="text-[10px] text-emerald-700 font-bold">Good harvest window</div>
          </div>
        </div>
      </div>

      {/* Real-time Pest & Disease Alerts */}
      <div className="clay-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Pest & Weather Broadcasts ({alerts.length})</span>
          </h2>
          <span className="text-xs font-bold text-emerald-700">Broadcast to all farmers</span>
        </div>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="clay-inset-well p-4 space-y-2 text-xs">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-black text-slate-900 text-sm">{alert.title}</h3>
                  <p className="text-[11px] font-bold text-slate-500">
                    📍 {alert.area} · <span className="text-slate-400">{alert.date}</span>
                  </p>
                </div>
                <span
                  className={`clay-badge px-2.5 py-0.5 text-[10px] font-black ${
                    alert.severity === 'high'
                      ? 'bg-red-100 text-red-800'
                      : alert.severity === 'medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {alert.severity.toUpperCase()}
                </span>
              </div>

              <p className="text-slate-700 font-semibold leading-relaxed">
                {alert.message}
              </p>

              <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-900/10 space-y-1">
                <span className="font-extrabold text-emerald-900 text-[11px] block">
                  Recommended Action:
                </span>
                <span className="text-slate-600 font-medium leading-relaxed block">
                  {alert.recommendedAction}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Climate-Smart Agronomy Practices */}
      <div className="clay-card p-5 space-y-3">
        <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-700" />
          <span>Climate-Smart Practices for Vihiga Soils</span>
        </h2>

        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div className="clay-inset-well p-3.5 space-y-1">
            <b className="font-extrabold text-slate-900 block">1. Push-Pull Pest Protection</b>
            <p className="text-slate-600 font-medium leading-relaxed">
              Intercrop maize with silverleaf desmodium to repel stemborers and smother parasitic Striga weed, while planting Napier grass along boundaries to trap pests.
            </p>
          </div>

          <div className="clay-inset-well p-3.5 space-y-1">
            <b className="font-extrabold text-slate-900 block">2. Vermiculture & Organic Compost</b>
            <p className="text-slate-600 font-medium leading-relaxed">
              Using red wiggler earthworms to recycle poultry manure and vegetable peelings into rich worm castings improves soil water retention by up to 35%.
            </p>
          </div>
        </div>

        <button
          onClick={onAskAgronomist}
          className="clay-btn-secondary w-full py-2.5 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer mt-2"
        >
          <HelpCircle className="w-4 h-4 text-emerald-700" />
          <span>Ask Extension Officer a Specific Question</span>
        </button>
      </div>
    </div>
  );
};
