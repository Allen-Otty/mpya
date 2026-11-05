import React, { useState } from 'react';
import { Farm, HelpRequest, TrainingSession } from '../../types';
import {
  CheckCircle,
  MapPin,
  Clock,
  Camera,
  FileText,
  Navigation,
  Phone,
  CheckSquare,
  AlertCircle,
  Sparkles,
  Wifi,
  WifiOff,
  UserCheck,
  Send,
  Calendar,
  Layers,
  ArrowRight,
  Plus,
  Check,
} from 'lucide-react';

interface CbfDashboardProps {
  farms: Farm[];
  helpRequests: HelpRequest[];
  onAnswerHelpRequest: (id: string, answer: string) => void;
  trainingSessions: TrainingSession[];
  onAddTrainingSession: (session: TrainingSession) => void;
}

interface ShambaStop {
  id: number;
  time: string;
  farmName: string;
  owner: string;
  area: string;
  status: 'Completed' | 'In Progress' | 'Scheduled';
  distance: string;
  coordinates: string;
  directions: string;
  checklist: {
    gpsVerified: boolean;
    compostChecked: boolean;
    pesticideWithdrawal: boolean;
    cropHealth: boolean;
    waterSource: boolean;
  };
  notes?: string;
  photoUrl?: string;
}

export const CbfDashboard: React.FC<CbfDashboardProps> = ({
  farms,
  helpRequests,
  onAnswerHelpRequest,
  trainingSessions,
  onAddTrainingSession,
}) => {
  const [activeTab, setActiveTab] = useState<
    'route' | 'farmers' | 'verification' | 'requests' | 'training' | 'reports' | 'offline'
  >('route');

  const [viewLayout, setViewLayout] = useState<'desktop' | 'mobile'>('desktop');
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [offlineSyncQueue, setOfflineSyncQueue] = useState<string[]>([
    'Neema Organic Shamba (Luanda South) - Composting verified',
    'Kilima Poultry - Newcastle vaccine log checked',
    'Baraka Beef - Maragoli pasture boundary GPS updated',
  ]);

  // Today's scheduled field route stops (matching Screenshot 407)
  const [stops, setStops] = useState<ShambaStop[]>([
    {
      id: 1,
      time: '09:00 AM',
      farmName: 'Amani Greens Shamba',
      owner: 'Grace Achieng',
      area: 'Luanda Township',
      status: 'Completed',
      distance: '0.8 km',
      coordinates: '0.0154° N, 34.5982° E',
      directions: 'Take Kima road 800m from Luanda market, left at blue water kiosk.',
      checklist: {
        gpsVerified: true,
        compostChecked: true,
        pesticideWithdrawal: true,
        cropHealth: true,
        waterSource: true,
      },
      notes: 'Excellent vermicompost trenches. Spinach and kales vigorous with zero synthetic spraying.',
      photoUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 2,
      time: '10:45 AM',
      farmName: 'Kilima Poultry Project',
      owner: 'Peter Makori',
      area: 'Kima Ward',
      status: 'In Progress',
      distance: '2.4 km',
      coordinates: '0.0381° N, 34.5721° E',
      directions: 'Near Kima railway station, follow footpath to the hill.',
      checklist: {
        gpsVerified: true,
        compostChecked: true,
        pesticideWithdrawal: false,
        cropHealth: true,
        waterSource: false,
      },
      notes: 'Free-range enclosure clean. Vaccinations current.',
    },
    {
      id: 6,
      time: '01:30 PM',
      farmName: 'Neema Organic Shamba',
      owner: 'Lucy Nyongesa',
      area: 'Luanda South',
      status: 'Scheduled',
      distance: '3.1 km',
      coordinates: '0.0092° N, 34.6110° E',
      directions: 'Past Luanda south market, 500m along southern feeder road.',
      checklist: {
        gpsVerified: false,
        compostChecked: false,
        pesticideWithdrawal: false,
        cropHealth: false,
        waterSource: false,
      },
    },
    {
      id: 4,
      time: '03:45 PM',
      farmName: 'Shamba Fresh Cooperative',
      owner: 'John Omondi',
      area: 'Luanda North',
      status: 'Scheduled',
      distance: '4.5 km',
      coordinates: '0.0270° N, 34.5890° E',
      directions: 'Along Chavakali tarmac, branch off at St. Peters school.',
      checklist: {
        gpsVerified: false,
        compostChecked: false,
        pesticideWithdrawal: false,
        cropHealth: false,
        waterSource: false,
      },
    },
  ]);

  const [inspectingStop, setInspectingStop] = useState<ShambaStop | null>(stops[1]);
  const [activeInspectionNotes, setActiveInspectionNotes] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // New Training form
  const [trainingTopic, setTrainingTopic] = useState('');
  const [trainingSchedule, setTrainingSchedule] = useState('');

  // Reply text map for support requests
  const [replyInput, setReplyInput] = useState<Record<string, string>>({});

  const handleToggleCheck = (field: keyof ShambaStop['checklist']) => {
    if (!inspectingStop) return;
    const updated = {
      ...inspectingStop,
      checklist: {
        ...inspectingStop.checklist,
        [field]: !inspectingStop.checklist[field],
      },
    };
    setInspectingStop(updated);
    setStops((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleFinishInspection = () => {
    if (!inspectingStop) return;
    const finished: ShambaStop = {
      ...inspectingStop,
      status: 'Completed',
      notes: activeInspectionNotes || inspectingStop.notes || 'Inspection completed on-site.',
      photoUrl: photoPreview || inspectingStop.photoUrl,
    };
    setStops((prev) => prev.map((s) => (s.id === finished.id ? finished : s)));
    setOfflineSyncQueue((prev) => [
      `${finished.farmName} inspection logged on-site`,
      ...prev,
    ]);
    alert(`Inspection report for ${finished.farmName} completed & queued for County Agricultural Officer!`);
    setInspectingStop(null);
  };

  return (
    <div className="space-y-5">
      {/* Top Field Servicing Header Bar (Screenshot 407) */}
      <div className="clay-card p-5 space-y-4 bg-gradient-to-r from-[#eef7ed] via-white to-[#eef7ed]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <h1 className="text-base font-black text-slate-900 tracking-tight">
                CBF Field Facilitator Hub · Luanda Zone V3
              </h1>
            </div>
            <p className="text-xs font-bold text-slate-500 mt-0.5">
              Facilitator: <b>Denis Kweyu</b> · Ministry of Agriculture Field Partner
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Switcher: Desktop Console vs Mobile Field Handheld (Screenshot 407) */}
            <div className="flex items-center gap-1 bg-emerald-950/5 p-1 rounded-xl">
              <button
                onClick={() => setViewLayout('desktop')}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  viewLayout === 'desktop' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🖥️ Route Console
              </button>
              <button
                onClick={() => setViewLayout('mobile')}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  viewLayout === 'mobile' ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                📱 Mobile Handheld
              </button>
            </div>

            {/* Offline sync badge */}
            <button
              onClick={() => setIsOfflineMode(!isOfflineMode)}
              className={`clay-pill px-3 py-1.5 text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
                isOfflineMode ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
              }`}
            >
              {isOfflineMode ? <WifiOff className="w-3.5 h-3.5 text-amber-700" /> : <Wifi className="w-3.5 h-3.5 text-emerald-700" />}
              <span>{isOfflineMode ? 'Offline Mode Active' : 'Online (4G Sync)'}</span>
            </button>
          </div>
        </div>

        {/* 4 Key Field Telemetry Metrics (Screenshot 407 Top Bar) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="clay-inset-well p-3.5 space-y-1">
            <div className="flex items-center justify-between text-slate-400 font-extrabold text-[10px] uppercase">
              <span>Check-ins Today</span>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {stops.filter((s) => s.status === 'Completed').length} / {stops.length}
            </div>
            <div className="text-[10px] text-emerald-700 font-bold">50% Route Completed</div>
          </div>

          <div className="clay-inset-well p-3.5 space-y-1">
            <div className="flex items-center justify-between text-slate-400 font-extrabold text-[10px] uppercase">
              <span>Field Notes Logged</span>
              <FileText className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">18</div>
            <div className="text-[10px] text-blue-700 font-bold">Agronomic audits</div>
          </div>

          <div className="clay-inset-well p-3.5 space-y-1">
            <div className="flex items-center justify-between text-slate-400 font-extrabold text-[10px] uppercase">
              <span>Photos Captured</span>
              <Camera className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">32</div>
            <div className="text-[10px] text-amber-700 font-bold">Shamba evidence</div>
          </div>

          <div className="clay-inset-well p-3.5 space-y-1">
            <div className="flex items-center justify-between text-slate-400 font-extrabold text-[10px] uppercase">
              <span>Active Field Time</span>
              <Clock className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">6h 45m</div>
            <div className="text-[10px] text-purple-700 font-bold">Zone V3 territory</div>
          </div>
        </div>
      </div>

      {/* Recommended Navigation Tabs (Screenshot 407 list) */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'route', label: '📍 Today’s Route & Map' },
          { id: 'verification', label: '☑️ Verification Checklist' },
          { id: 'farmers', label: '👥 Assigned Farmers (24)' },
          { id: 'requests', label: '💬 Support Requests (3)' },
          { id: 'training', label: '🎓 Field Trainings' },
          { id: 'reports', label: '📄 Submitted Reports' },
          { id: 'offline', label: '💾 Offline Queue (3)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`clay-tab px-3.5 py-2 text-xs font-bold whitespace-nowrap shrink-0 ${
              activeTab === tab.id ? 'clay-tab-on' : ''
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. ROUTE & TERRITORY MAP (Screenshot 407 Central Visual) */}
      {activeTab === 'route' && viewLayout === 'mobile' && (
        <div className="py-2">
          <div className="max-w-sm mx-auto bg-slate-900 rounded-[44px] p-3.5 shadow-2xl border-4 border-slate-700">
            {/* Phone Screen Area */}
            <div className="bg-white rounded-[34px] overflow-hidden flex flex-col text-xs text-slate-800">
              {/* Phone Top Notch / Status Bar */}
              <div className="bg-slate-900 text-white px-5 py-2 flex items-center justify-between text-[11px] font-bold">
                <span>09:41</span>
                <div className="w-16 h-3.5 bg-black rounded-full" />
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span>4G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* App Bar: FieldServicely */}
              <div className="bg-emerald-800 text-white p-3.5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-emerald-200 uppercase tracking-wider">Mavuno Field Hub</div>
                  <div className="text-sm font-black tracking-tight">FieldServicely Mobile</div>
                </div>
                <span className="bg-emerald-700/80 text-[10px] px-2 py-0.5 rounded-full font-bold">Zone V3B</span>
              </div>

              {/* Top 3 KPI Telemetry Row (matching Screenshot 407 mobile phone) */}
              <div className="grid grid-cols-3 gap-1.5 p-3 bg-emerald-50/50 border-b border-emerald-900/10 text-center">
                <div className="clay-card p-2">
                  <div className="text-base font-black text-slate-900">24</div>
                  <div className="text-[9px] font-bold text-slate-500 uppercase">Check-ins</div>
                </div>
                <div className="clay-card p-2">
                  <div className="text-base font-black text-slate-900">18</div>
                  <div className="text-[9px] font-bold text-slate-500 uppercase">Notes</div>
                </div>
                <div className="clay-card p-2">
                  <div className="text-base font-black text-slate-900">6h 45m</div>
                  <div className="text-[9px] font-bold text-slate-500 uppercase">Work Time</div>
                </div>
              </div>

              <div className="p-3.5 space-y-3 max-h-[380px] overflow-y-auto">
                {/* Route Tracking Micro-Map */}
                <div className="clay-card p-2.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-900 text-xs flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5 text-emerald-700" />
                      Route Tracking
                    </span>
                    <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                      In Progress
                    </span>
                  </div>
                  <div className="h-28 rounded-xl bg-emerald-100/70 border border-emerald-300 relative overflow-hidden flex items-center justify-center">
                    <svg viewBox="0 0 200 100" className="w-full h-full">
                      <path d="M20 30 Q80 70 120 40 T180 80" stroke="#2e7d32" strokeWidth="3" strokeDasharray="4 2" fill="none" />
                      <circle cx="20" cy="30" r="5" fill="#2e7d32" />
                      <circle cx="120" cy="40" r="7" fill="#e65100" className="animate-ping" />
                      <circle cx="120" cy="40" r="5" fill="#e65100" />
                      <circle cx="180" cy="80" r="4" fill="#78909c" />
                    </svg>
                    <div className="absolute bottom-1 right-2 bg-white/90 px-2 py-0.5 rounded text-[9px] font-black text-slate-700">
                      Next: Kilima Poultry (2.4 km)
                    </div>
                  </div>
                </div>

                {/* Assigned Area Card (Screenshot 407) */}
                <div className="clay-inset-well p-2.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-xs">Assigned Territory</span>
                    <span className="text-[10px] font-bold text-emerald-800">Zone V3B</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-semibold">
                    36% of assigned shambas inspected (24 of 68 completed)
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-1">
                    <div className="bg-emerald-600 h-full w-[36%]" />
                  </div>
                </div>

                {/* Today's Next Stop Action */}
                <div className="clay-card p-3 space-y-2 border border-amber-300 bg-amber-50/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-black text-slate-900 text-xs">Kilima Poultry Project</div>
                      <div className="text-[10px] text-slate-500 font-semibold">Peter Makori · Kima Ward</div>
                    </div>
                    <span className="clay-badge bg-amber-100 text-amber-900 text-[9px] font-extrabold px-1.5 py-0.5">
                      Current Stop
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setInspectingStop(stops[1]);
                      setActiveTab('verification');
                    }}
                    className="clay-btn-primary w-full py-2 text-xs font-black flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    Open Audit Checklist
                  </button>
                </div>

                {/* Recent Activity List (Screenshot 407) */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    Recent Field Activity
                  </div>
                  <div className="clay-inset-well p-2 text-[11px] space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>✓ Amani Greens Shamba</span>
                      <span className="text-slate-400 text-[9px]">09:15 AM</span>
                    </div>
                    <div className="text-slate-500 text-[10px]">Photo uploaded · Organic compost verified</div>
                  </div>
                  <div className="clay-inset-well p-2 text-[11px] space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>✓ Maragoli Farm Kima</span>
                      <span className="text-slate-400 text-[9px]">Yesterday</span>
                    </div>
                    <div className="text-slate-500 text-[10px]">Pesticide withdrawal clearance confirmed</div>
                  </div>
                </div>
              </div>

              {/* Bottom Mobile Tab Bar (Screenshot 407) */}
              <div className="bg-slate-50 border-t border-slate-200 px-3 py-2 flex items-center justify-around text-[10px] font-black text-slate-600">
                <span className="text-emerald-700 flex flex-col items-center">
                  <span>🏠</span>
                  <span>Home</span>
                </span>
                <span onClick={() => setActiveTab('route')} className="cursor-pointer flex flex-col items-center">
                  <span>🗺️</span>
                  <span>Routes</span>
                </span>
                <span onClick={() => setActiveTab('verification')} className="cursor-pointer flex flex-col items-center">
                  <span>☑️</span>
                  <span>Audit</span>
                </span>
                <span onClick={() => setActiveTab('offline')} className="cursor-pointer flex flex-col items-center">
                  <span>💾</span>
                  <span>Sync</span>
                </span>
              </div>
            </div>
          </div>
          <div className="text-center mt-3">
            <button
              onClick={() => setViewLayout('desktop')}
              className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
            >
              Switch back to Full Desktop Route Console →
            </button>
          </div>
        </div>
      )}

      {/* 1. ROUTE & TERRITORY MAP (Desktop Console) */}
      {activeTab === 'route' && viewLayout === 'desktop' && (
        <div className="space-y-4">
          <div className="grid lg:grid-cols-12 gap-5">
            {/* Left / Center: Interactive Territory Route Map */}
            <div className="lg:col-span-7 clay-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-emerald-700" />
                    <span>Route Tracking & Territory Zones</span>
                  </h3>
                  <p className="text-[11px] font-bold text-slate-400">
                    Zone V3 · 4 shamba inspections scheduled along Luanda-Kima axis
                  </p>
                </div>
                <span className="clay-badge bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 border border-emerald-200">
                  GPS Tracking Active
                </span>
              </div>

              {/* Visual Route Canvas */}
              <div className="relative rounded-2xl overflow-hidden bg-[#e8f6e8] border border-emerald-900/10 h-72">
                <svg viewBox="0 0 400 300" className="w-full h-full select-none">
                  <rect width="400" height="300" fill="#eaf6ea" />

                  {/* Territory Zone Polygons (Matching Screenshot 407) */}
                  <path
                    d="M40 40 L160 30 L180 120 L80 160 Z"
                    fill="#c8e6c9"
                    opacity="0.45"
                    stroke="#81c784"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                  <text x="90" y="75" fontSize="10" fontWeight="bold" fill="#2e7d32">
                    Zone V3A (Kima)
                  </text>

                  <path
                    d="M170 110 L350 90 L340 220 L190 240 Z"
                    fill="#bbdefb"
                    opacity="0.45"
                    stroke="#64b5f6"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                  <text x="230" y="140" fontSize="10" fontWeight="bold" fill="#1565c0">
                    Zone V3B (Luanda Township)
                  </text>

                  {/* River Yala feeder */}
                  <path
                    d="M0 90 C80 120 180 80 400 130"
                    stroke="#90caf9"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                  />

                  {/* Field Route Path */}
                  <path
                    d="M90 70 L180 150 L140 210 L230 120"
                    stroke="#2e7d32"
                    strokeWidth="3.5"
                    strokeDasharray="6 3"
                    fill="none"
                  />

                  {/* Stop 1: Amani Greens */}
                  <g transform="translate(180, 150)" className="cursor-pointer">
                    <circle r="14" fill="#2e7d32" stroke="#ffffff" strokeWidth="2.5" />
                    <text y="4" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">1</text>
                    <text y="24" textAnchor="middle" fill="#1b5e20" fontSize="9" fontWeight="bold">Amani Greens (Done)</text>
                  </g>

                  {/* Stop 2: Kilima Poultry */}
                  <g transform="translate(90, 70)" className="cursor-pointer">
                    <circle r="18" fill="#43a047" opacity="0.3" className="animate-ping" />
                    <circle r="14" fill="#e65100" stroke="#ffffff" strokeWidth="2.5" />
                    <text y="4" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">2</text>
                    <text y="24" textAnchor="middle" fill="#bf360c" fontSize="9" fontWeight="bold">Kilima Poultry (Active)</text>
                  </g>

                  {/* Stop 3: Neema Farm */}
                  <g transform="translate(140, 210)" className="cursor-pointer">
                    <circle r="12" fill="#546e7a" stroke="#ffffff" strokeWidth="2" />
                    <text y="4" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">3</text>
                    <text y="22" textAnchor="middle" fill="#37474f" fontSize="9" fontWeight="bold">Neema Farm</text>
                  </g>

                  {/* Stop 4: Shamba Fresh */}
                  <g transform="translate(230, 120)" className="cursor-pointer">
                    <circle r="12" fill="#546e7a" stroke="#ffffff" strokeWidth="2" />
                    <text y="4" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">4</text>
                    <text y="22" textAnchor="middle" fill="#37474f" fontSize="9" fontWeight="bold">Shamba Fresh</text>
                  </g>
                </svg>

                {/* In-Map Floating Route Target */}
                <div className="absolute left-3 bottom-3 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl text-[10px] font-bold text-slate-700 shadow-sm border border-emerald-900/10">
                  🚀 Current Stop: <b>Kilima Poultry Project (Peter M.)</b> · 2.4 km away
                </div>
              </div>

              {/* Quick action bar */}
              <div className="flex gap-2 pt-1 text-xs">
                <button
                  onClick={() => {
                    setInspectingStop(stops[1]);
                    setActiveTab('verification');
                  }}
                  className="clay-btn-primary flex-1 py-2 text-xs font-black inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Start Inspection on Kilima Poultry</span>
                </button>
              </div>
            </div>

            {/* Right: Today's Route Stops List (Screenshot 407 Right Card) */}
            <div className="lg:col-span-5 clay-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-900">
                  Today’s Assigned Route
                </h3>
                <span className="text-[11px] font-bold text-emerald-700">4 Shambas</span>
              </div>

              <div className="space-y-2.5">
                {stops.map((stop, idx) => {
                  const isSelected = inspectingStop?.id === stop.id;
                  return (
                    <div
                      key={stop.id}
                      onClick={() => setInspectingStop(stop)}
                      className={`clay-inset-well p-3 space-y-1.5 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/50'
                          : 'hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-black text-[10px] flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="font-extrabold text-slate-900 text-xs">
                              {stop.farmName}
                            </div>
                            <div className="text-[11px] text-slate-500 font-semibold">
                              {stop.owner} · {stop.area}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`clay-badge px-2 py-0.5 text-[9px] font-black ${
                            stop.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : stop.status === 'In Progress'
                              ? 'bg-amber-100 text-amber-800 animate-pulse'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {stop.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                        <span>⏱️ {stop.time}</span>
                        <span>📍 {stop.distance} away</span>
                        <span className="text-emerald-700 font-bold">Inspect →</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 5 Field Capability Pills from Screenshot 407 */}
          <div className="clay-card p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="clay-badge bg-emerald-50 text-emerald-800 px-3 py-1 font-extrabold text-[11px]">
              🎯 Target the right neighborhoods
            </span>
            <span className="clay-badge bg-blue-50 text-blue-800 px-3 py-1 font-extrabold text-[11px]">
              🗺️ Track routes & visit every shamba
            </span>
            <span className="clay-badge bg-amber-50 text-amber-800 px-3 py-1 font-extrabold text-[11px]">
              📷 Capture notes & add photos
            </span>
            <span className="clay-badge bg-purple-50 text-purple-800 px-3 py-1 font-extrabold text-[11px]">
              ⏱️ Real-time check-ins & progress
            </span>
            <span className="clay-badge bg-slate-100 text-slate-800 px-3 py-1 font-extrabold text-[11px]">
              ⚡ Log work hours automatically
            </span>
          </div>
        </div>
      )}

      {/* 2. ON-SITE VERIFICATION CHECKLIST (Screenshot 407 Checklist) */}
      {activeTab === 'verification' && inspectingStop && (
        <div className="clay-card p-6 space-y-5">
          <div className="flex items-start justify-between border-b border-emerald-900/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="clay-badge bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5">
                  Inspection in Progress
                </span>
                <span className="text-xs font-bold text-slate-400">
                  Assigned Route Stop #{stops.findIndex((s) => s.id === inspectingStop.id) + 1}
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 mt-1">
                {inspectingStop.farmName}
              </h2>
              <p className="text-xs font-semibold text-slate-500">
                Farmer: <b>{inspectingStop.owner}</b> · {inspectingStop.area} · {inspectingStop.coordinates}
              </p>
            </div>

            <button
              onClick={() => setActiveTab('route')}
              className="clay-btn-secondary px-3 py-1.5 text-xs font-bold"
            >
              Back to Map
            </button>
          </div>

          {/* Shamba Directions */}
          <div className="clay-inset-well p-3 text-xs font-semibold text-slate-700">
            <span className="font-extrabold text-emerald-900 block mb-0.5">Farmer Road Directions:</span>
            {inspectingStop.directions}
          </div>

          {/* Interactive Checklist Items (Screenshot 407) */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
              On-Site Audit Checklist & Evidence Collection
            </h3>

            <div className="space-y-2 text-xs">
              {[
                {
                  key: 'gpsVerified' as const,
                  title: '1. GPS Pin Match Verification',
                  desc: 'Stand on the central shamba plot and verify GPS coordinates match within 15 meters radius.',
                  status: inspectingStop.checklist.gpsVerified,
                },
                {
                  key: 'compostChecked' as const,
                  title: '2. Organic Manure & Composting Verification',
                  desc: 'Inspect composting pits, cattle dung slurry, or vermiculture trenches on site.',
                  status: inspectingStop.checklist.compostChecked,
                },
                {
                  key: 'pesticideWithdrawal' as const,
                  title: '3. Chemical Spraying & Withdrawal Audit',
                  desc: 'Confirm zero prohibited organophosphates; ensure 14-day pre-harvest safety interval is adhered to.',
                  status: inspectingStop.checklist.pesticideWithdrawal,
                },
                {
                  key: 'cropHealth' as const,
                  title: '4. Produce Quality & Flock Health Check',
                  desc: 'Check leaves for Fall Armyworm/blight; audit vaccination logbook for poultry/dairy.',
                  status: inspectingStop.checklist.cropHealth,
                },
                {
                  key: 'waterSource' as const,
                  title: '5. Clean Irrigation & Washing Water Source',
                  desc: 'Verify clean borehole or rain catchment water used for post-harvest washing.',
                  status: inspectingStop.checklist.waterSource,
                },
              ].map((item) => (
                <div
                  key={item.key}
                  onClick={() => handleToggleCheck(item.key)}
                  className={`clay-inset-well p-3.5 flex items-start gap-3 cursor-pointer transition-all ${
                    item.status ? 'bg-emerald-50/60 border-emerald-500' : 'hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 font-black text-xs ${
                      item.status ? 'bg-emerald-600 text-white' : 'border border-slate-300 bg-white'
                    }`}
                  >
                    {item.status && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <div className="font-black text-slate-900 text-xs">{item.title}</div>
                    <p className="text-slate-500 font-medium text-[11px] mt-0.5 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Photo Evidence & Inspector Notes */}
          <div className="grid sm:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="font-extrabold text-slate-700 block mb-1">
                📸 Field Photo Evidence (Required for Badge Confirmation)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      if (event.target?.result) setPhotoPreview(event.target.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-emerald-50 file:text-emerald-800 cursor-pointer"
              />
              {(photoPreview || inspectingStop.photoUrl) && (
                <img
                  src={photoPreview || inspectingStop.photoUrl}
                  alt="Inspection Evidence"
                  className="w-full h-32 rounded-xl object-cover mt-2 shadow-xs border border-white"
                />
              )}
            </div>

            <div>
              <label className="font-extrabold text-slate-700 block mb-1">
                Facilitator Field Notes & Recommendations
              </label>
              <textarea
                rows={4}
                value={activeInspectionNotes || inspectingStop.notes || ''}
                onChange={(e) => setActiveInspectionNotes(e.target.value)}
                placeholder="Enter observations on crop health, soil conservation, and farmer practices..."
                className="clay-input w-full p-2.5 font-semibold text-slate-800"
              />
            </div>
          </div>

          {/* Submit Report to County Officer */}
          <div className="pt-3 border-t border-emerald-900/10 flex gap-3">
            <button
              onClick={() => setActiveTab('route')}
              className="clay-btn-secondary px-4 py-2.5 text-xs font-bold cursor-pointer"
            >
              Save Draft
            </button>
            <button
              onClick={handleFinishInspection}
              className="clay-btn-primary flex-1 py-3 text-xs font-black inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Submit Inspection Report to County Agricultural Officer</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. ASSIGNED FARMERS DIRECTORY (Screenshot 407) */}
      {activeTab === 'farmers' && (
        <div className="clay-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                My Assigned Farmers ({farms.length})
              </h3>
              <p className="text-xs font-semibold text-slate-500">
                Luanda & Kima Wards smallholder producers
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 text-xs">
            {farms.map((farm) => (
              <div key={farm.id} className="clay-inset-well p-3.5 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-black text-slate-900 text-sm">{farm.name}</div>
                    <div className="text-slate-500 font-semibold">{farm.owner} · {farm.area}</div>
                  </div>
                  <span
                    className={`clay-badge px-2 py-0.5 text-[10px] font-bold ${
                      farm.isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {farm.isVerified ? 'Verified' : 'Pending Visit'}
                  </span>
                </div>

                <div className="text-slate-600 line-clamp-2">
                  Practices: {farm.practices}
                </div>

                <div className="flex gap-2 pt-1 border-t border-slate-200/60">
                  <button
                    onClick={() => {
                      const stop = stops.find((s) => s.id === farm.id) || {
                        id: farm.id,
                        time: 'Next Available',
                        farmName: farm.name,
                        owner: farm.owner,
                        area: farm.area,
                        status: 'In Progress',
                        distance: '1.5 km',
                        coordinates: `${farm.x}, ${farm.y}`,
                        directions: 'Contact farmer for directions.',
                        checklist: {
                          gpsVerified: false,
                          compostChecked: false,
                          pesticideWithdrawal: false,
                          cropHealth: false,
                          waterSource: false,
                        },
                      };
                      setInspectingStop(stop as any);
                      setActiveTab('verification');
                    }}
                    className="clay-btn-primary flex-1 py-1.5 text-xs font-black cursor-pointer"
                  >
                    Inspect Farm
                  </button>
                  <button
                    onClick={() => alert(`Calling ${farm.owner} via WhatsApp...`)}
                    className="clay-btn-secondary px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. FARMER SUPPORT REQUESTS (Screenshot 407) */}
      {activeTab === 'requests' && (
        <div className="clay-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900">
              Farmer Agronomy & Field Advice Requests ({helpRequests.length})
            </h3>
            <span className="text-xs font-bold text-emerald-700">Reply directly via in-app alert</span>
          </div>

          <div className="space-y-3 text-xs">
            {helpRequests.map((req) => (
              <div key={req.id} className="clay-inset-well p-4 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-black text-slate-900">{req.from}</div>
                    <div className="text-slate-500 font-semibold text-[11px]">
                      Topic: <b>{req.topic}</b>
                    </div>
                  </div>
                  <span
                    className={`clay-badge px-2 py-0.5 text-[10px] font-bold ${
                      req.status === 'answered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {req.status === 'answered' ? 'Answered' : 'Awaiting Reply'}
                  </span>
                </div>

                {req.status === 'answered' && req.answer ? (
                  <div className="bg-emerald-50/80 p-2.5 rounded-xl text-emerald-900 font-medium">
                    <b>Your Advice:</b> {req.answer}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type agronomic recommendation..."
                      value={replyInput[req.id] || ''}
                      onChange={(e) => setReplyInput({ ...replyInput, [req.id]: e.target.value })}
                      className="clay-input flex-1 p-2 text-xs font-semibold text-slate-800"
                    />
                    <button
                      onClick={() => {
                        const answer = replyInput[req.id];
                        if (!answer) return;
                        onAnswerHelpRequest(req.id, answer);
                        alert(`Advice sent to ${req.from}!`);
                      }}
                      className="clay-btn-primary px-3.5 py-1.5 text-xs font-black inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" /> Send
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TRAINING SESSIONS (Screenshot 407) */}
      {activeTab === 'training' && (
        <div className="clay-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900">
              Community Field Training Sessions ({trainingSessions.length})
            </h3>
            <span className="text-xs font-bold text-emerald-700">Baraza & Demonstration</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {trainingSessions.map((session) => (
              <div key={session.id} className="clay-inset-well p-3.5 flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-slate-900 text-sm">{session.title}</div>
                  <div className="text-slate-500 font-semibold">{session.schedule}</div>
                </div>
                <span className="clay-badge bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1">
                  {session.attendeesCount} Farmers Attending
                </span>
              </div>
            ))}
          </div>

          {/* Schedule New Session Form */}
          <div className="pt-3 border-t border-emerald-900/10 space-y-2 text-xs">
            <b className="text-slate-900 block font-black">Schedule New Farmer Field Workshop</b>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Topic: e.g. Fall Armyworm Bio-Control"
                value={trainingTopic}
                onChange={(e) => setTrainingTopic(e.target.value)}
                className="clay-input p-2 font-semibold text-slate-800"
              />
              <input
                type="text"
                placeholder="Time & Venue (e.g. Saturday · Kima Hall)"
                value={trainingSchedule}
                onChange={(e) => setTrainingSchedule(e.target.value)}
                className="clay-input p-2 font-semibold text-slate-800"
              />
            </div>
            <button
              onClick={() => {
                if (!trainingTopic || !trainingSchedule) return;
                onAddTrainingSession({
                  id: `tr-${Date.now()}`,
                  title: trainingTopic,
                  schedule: trainingSchedule,
                  attendeesCount: 15,
                  cbfName: 'Denis Kweyu',
                });
                setTrainingTopic('');
                setTrainingSchedule('');
                alert('Training workshop scheduled & broadcast to local farmers!');
              }}
              className="clay-btn-primary w-full py-2.5 text-xs font-black cursor-pointer"
            >
              + Schedule Field Baraza
            </button>
          </div>
        </div>
      )}

      {/* 6. SUBMITTED REPORTS (Screenshot 407) */}
      {activeTab === 'reports' && (
        <div className="clay-card p-5 space-y-4">
          <h3 className="text-sm font-black text-slate-900">Submitted Field Reports</h3>
          <div className="space-y-2 text-xs">
            {stops
              .filter((s) => s.status === 'Completed')
              .map((s) => (
                <div key={s.id} className="clay-inset-well p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="font-black text-slate-900">{s.farmName}</div>
                    <span className="clay-badge bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                      Transmitted to Officer
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium">Notes: {s.notes}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 7. OFFLINE RECORDS QUEUE (Screenshot 407) */}
      {activeTab === 'offline' && (
        <div className="clay-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900">
              Offline Field Records Queue ({offlineSyncQueue.length})
            </h3>
            <button
              onClick={() => {
                setOfflineSyncQueue([]);
                alert('All offline inspection logs successfully synchronized with County Cloud database!');
              }}
              className="clay-btn-primary px-3 py-1.5 text-xs font-black cursor-pointer"
            >
              Sync All to County Cloud
            </button>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            When inspecting rural shambas with poor cellular network, records are encrypted and saved locally in IndexedDB/browser storage until you reconnect.
          </p>

          <div className="space-y-2 text-xs">
            {offlineSyncQueue.map((item, idx) => (
              <div key={idx} className="clay-inset-well p-3 flex items-center justify-between">
                <span className="text-slate-800 font-semibold">{item}</span>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                  Queued Locally
                </span>
              </div>
            ))}
            {offlineSyncQueue.length === 0 && (
              <div className="text-center py-6 text-xs text-slate-400 font-bold">
                All field inspection records are synchronized!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
