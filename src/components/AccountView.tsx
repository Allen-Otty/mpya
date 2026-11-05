import React, { useState } from 'react';
import {
  RoleId,
  Farm,
  Order,
  Complaint,
  VerificationTask,
  HelpRequest,
  BulkRequest,
  TrainingSession,
  FpoStockItem,
  RiderJob,
  FpoAggregationLot,
} from '../types';
import { ROLES, CATEGORIES, INITIAL_AGGREGATION_LOTS, VIHIGA_WARDS } from '../mockData';
import {
  ShieldCheck,
  MapPin,
  CheckCircle,
  PlusCircle,
  HelpCircle,
  Truck,
  Building2,
  AlertTriangle,
  Layers,
  Sparkles,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Check,
} from 'lucide-react';
import { CbfDashboard } from './dashboards/CbfDashboard';

interface AccountViewProps {
  currentRole: RoleId | null;
  onSelectRole: (role: RoleId | null) => void;
  orders: Order[];
  complaints: Complaint[];
  onAddComplaint: (c: Complaint) => void;
  onUpdateComplaintStatus: (id: string | number, status: Complaint['status']) => void;
  farms: Farm[];
  onUpdateFarm: (updated: Farm) => void;
  verificationQueue: VerificationTask[];
  onUpdateVerificationStage: (id: string | number, stage: VerificationTask['stage']) => void;
  helpRequests: HelpRequest[];
  onAddHelpRequest: (req: HelpRequest) => void;
  onAnswerHelpRequest: (id: string, answer: string) => void;
  bulkRequests: BulkRequest[];
  onAddBulkRequest: (req: BulkRequest) => void;
  onQuoteBulkRequest: (id: string | number, quoteAmt: number) => void;
  trainingSessions: TrainingSession[];
  onAddTrainingSession: (session: TrainingSession) => void;
  fpoStock: FpoStockItem[];
  onAddFpoStock: (item: FpoStockItem) => void;
  riderJobs: RiderJob[];
  onUpdateRiderJob: (id: string, status: RiderJob['status']) => void;
  partnerNotices: string[];
  onAddPartnerNotice: (notice: string) => void;
  onOpenCreatePost?: () => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  currentRole,
  onSelectRole,
  orders,
  complaints,
  onAddComplaint,
  onUpdateComplaintStatus,
  farms,
  onUpdateFarm,
  verificationQueue,
  onUpdateVerificationStage,
  helpRequests,
  onAddHelpRequest,
  onAnswerHelpRequest,
  bulkRequests,
  onAddBulkRequest,
  onQuoteBulkRequest,
  trainingSessions,
  onAddTrainingSession,
  fpoStock,
  onAddFpoStock,
  riderJobs,
  onUpdateRiderJob,
  partnerNotices,
  onAddPartnerNotice,
  onOpenCreatePost,
}) => {
  // Navigation tabs within specific role pages (Screenshot 414 & 410)
  const [farmerSubTab, setFarmerSubTab] = useState<'overview' | 'profile' | 'products' | 'orders' | 'help'>('overview');
  const [fpoSubTab, setFpoSubTab] = useState<'overview' | 'aggregation' | 'stock' | 'members' | 'bulk' | 'payouts'>('overview');
  const [cbfSubTab, setCbfSubTab] = useState<'visits' | 'training' | 'requests'>('visits');
  const [officerSubTab, setOfficerSubTab] = useState<'overview' | 'verification' | 'complaints' | 'wards'>('overview');
  const [buyerSubTab, setBuyerSubTab] = useState<'orders' | 'complaints'>('orders');

  // Aggregation Workspace State (Screenshot 410)
  const [aggregationLots, setAggregationLots] = useState<FpoAggregationLot[]>(INITIAL_AGGREGATION_LOTS);
  const [selectedLotId, setSelectedLotId] = useState<string>('lot-1');
  const [contribFarmerName, setContribFarmerName] = useState('');
  const [contribQty, setContribQty] = useState('');

  // Form states for Buyer complaints
  const [complaintReason, setComplaintReason] = useState('Poor quality');
  const [complaintDetails, setComplaintDetails] = useState('');
  const [complaintPhoto, setComplaintPhoto] = useState<string | null>(null);

  // Form states for Farmer adding produce
  const [newProdName, setNewProdName] = useState('');
  const [newProdCat, setNewProdCat] = useState('vegetables');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdUnit, setNewProdUnit] = useState('kg');
  const [newProdQty, setNewProdQty] = useState('');
  const [newProdPhoto, setNewProdPhoto] = useState<string | null>(null);

  // Farmer shamba edit form
  const defaultShamba = farms[0] || null;
  const [shambaDirections, setShambaDirections] = useState(
    'From Luanda Market, take Kima road 800m. Turn left at the blue water kiosk; farm is 150m ahead on the right.'
  );
  const [shambaPractices, setShambaPractices] = useState(
    defaultShamba?.practices || 'Compost and organic manure only. Integrated pest management, zero synthetic pesticides.'
  );
  const [farmPhoto, setFarmPhoto] = useState<string | null>(defaultShamba?.image || null);
  const [gpsCaptured, setGpsCaptured] = useState(false);
  const [farmerReplyText, setFarmerReplyText] = useState('');

  // Farmer help ticket
  const [helpTo, setHelpTo] = useState<'cbf' | 'officer' | 'ngo'>('cbf');
  const [helpTopic, setHelpTopic] = useState('');

  // Bulk buyer request form
  const [bulkProduct, setBulkProduct] = useState('');
  const [bulkQtyFreq, setBulkQtyFreq] = useState('');

  // FPO new stock
  const [fpoProdName, setFpoProdName] = useState('');
  const [fpoProdPrice, setFpoProdPrice] = useState('');
  const [fpoProdQty, setFpoProdQty] = useState('');

  // CBF training form
  const [newTrainingTopic, setNewTrainingTopic] = useState('');

  // NGO broadcast notice
  const [newNoticeText, setNewNoticeText] = useState('');

  // File upload helper
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setter(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // If no role selected, render role picker
  if (!currentRole) {
    return (
      <div className="space-y-6">
        <div className="clay-card p-6 text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto text-2xl clay-badge">
            👤
          </div>
          <h2 className="text-xl font-black text-slate-900">Mavuno Role Portals</h2>
          <p className="text-xs font-semibold text-slate-500 max-w-md mx-auto">
            Choose a role below to access tailored tools designed for your work in Vihiga.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(ROLES).map(([key, config]) => (
            <div
              key={key}
              onClick={() => onSelectRole(key as RoleId)}
              className="clay-card p-4.5 cursor-pointer hover:-translate-y-1 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center text-xl shrink-0 clay-badge">
                    {config.emoji}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {config.title.split(' (')[0]}
                    </h3>
                    <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                      {config.id} Portal
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {config.subtitle}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-900/5 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">
                  {config.fields.length} account attributes
                </span>
                <span className="text-xs font-extrabold text-emerald-700 group-hover:underline">
                  Open Workspace →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const roleConfig = ROLES[currentRole];

  return (
    <div className="space-y-5">
      {/* Role Banner & Switcher Bar */}
      <div className="clay-card p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl shrink-0">
            {roleConfig.emoji}
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900">{roleConfig.title.split(' (')[0]}</h2>
            <p className="text-xs font-bold text-slate-500">
              Vihiga County Pilot · Active Workspace
            </p>
          </div>
        </div>

        <button
          onClick={() => onSelectRole(null)}
          className="clay-btn-secondary px-3.5 py-1.5 text-xs font-bold cursor-pointer"
        >
          Switch Role Portal ⇄
        </button>
      </div>

      {/* ----------------- 1. BUYER DASHBOARD ----------------- */}
      {currentRole === 'buyer' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={() => setBuyerSubTab('orders')}
              className={`clay-tab flex-1 py-2 text-xs font-bold ${
                buyerSubTab === 'orders' ? 'clay-tab-on' : ''
              }`}
            >
              My Orders ({orders.length})
            </button>
            <button
              onClick={() => setBuyerSubTab('complaints')}
              className={`clay-tab flex-1 py-2 text-xs font-bold ${
                buyerSubTab === 'complaints' ? 'clay-tab-on' : ''
              }`}
            >
              Report a Problem (24h)
            </button>
          </div>

          {buyerSubTab === 'orders' ? (
            <div className="clay-card p-5 space-y-4">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <span>🛒</span>
                <span>My Orders</span>
              </h3>

              <div className="space-y-3">
                {orders.map((o) => (
                  <div key={o.id} className="clay-inset-well p-3.5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm font-black text-slate-900">{o.farmName}</div>
                        <div className="text-xs font-semibold text-slate-600 mt-0.5">
                          {o.itemsSummary}
                        </div>
                        <div className="text-xs font-extrabold text-emerald-700 mt-1">
                          KES {o.totalAmount.toLocaleString()} · {o.deliveryMethod || 'Direct Delivery'}
                        </div>
                      </div>
                      <span
                        className={`clay-badge px-2.5 py-0.5 text-[10px] font-extrabold ${
                          o.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.status === 'Complaint filed'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {o.status}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-semibold">Pay on Delivery</span>
                      <button
                        onClick={() => setBuyerSubTab('complaints')}
                        className="text-amber-700 hover:text-amber-800 font-bold underline"
                      >
                        Report issue within 24h →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="clay-card p-5 space-y-3">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Report an Issue (Within 24 Hours)</span>
              </h3>
              <p className="text-xs font-medium text-slate-500">
                Extension officers arbitrate quality complaints with photo evidence to ensure fair refunds.
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Issue Type</label>
                  <select
                    value={complaintReason}
                    onChange={(e) => setComplaintReason(e.target.value)}
                    className="clay-input w-full p-2.5 font-semibold text-slate-800"
                  >
                    <option>Poor quality / spoiled produce</option>
                    <option>Wrong or missing items</option>
                    <option>Farmer did not harvest or deliver</option>
                  </select>
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Details</label>
                  <textarea
                    rows={2}
                    value={complaintDetails}
                    onChange={(e) => setComplaintDetails(e.target.value)}
                    placeholder="e.g. Tomatoes arrived crushed; 2 bunches of kales missing."
                    className="clay-input w-full p-2.5 font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">
                    📷 Photo Evidence (Required for arbitration)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setComplaintPhoto)}
                    className="text-xs file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-emerald-50 file:text-emerald-800 cursor-pointer"
                  />
                  {complaintPhoto && (
                    <img
                      src={complaintPhoto}
                      alt="Evidence"
                      className="w-20 h-20 rounded-xl object-cover mt-2 shadow-xs"
                    />
                  )}
                </div>

                <button
                  onClick={() => {
                    if (!complaintDetails.trim()) return;
                    const newC: Complaint = {
                      id: Date.now(),
                      farmName: orders[0]?.farmName || 'Amani Greens Shamba',
                      buyerName: 'Wanjiru T. (You)',
                      reason: complaintReason,
                      details: complaintDetails,
                      status: 'open',
                      evidencePhoto: complaintPhoto || undefined,
                      date: 'Today',
                    };
                    onAddComplaint(newC);
                    setComplaintDetails('');
                    setComplaintPhoto(null);
                    setBuyerSubTab('orders');
                    alert('Complaint submitted to County Extension Officer!');
                  }}
                  className="clay-btn-primary w-full py-2.5 text-xs font-black cursor-pointer"
                >
                  Submit Claim to County Officer
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ----------------- 2. FARMER DASHBOARD (Screenshot 414 & 413) ----------------- */}
      {currentRole === 'farmer' && (
        <div className="space-y-4">
          {/* Subtabs matching Screenshot 414 & 413 */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'overview', label: '📊 Overview' },
              { id: 'profile', label: '🏡 My Farm' },
              { id: 'products', label: '📦 Products' },
              { id: 'orders', label: '🛒 Orders' },
              { id: 'help', label: '🌱 Support & Climate' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFarmerSubTab(tab.id as any)}
                className={`clay-tab px-3.5 py-2 text-xs font-bold whitespace-nowrap shrink-0 ${
                  farmerSubTab === tab.id ? 'clay-tab-on' : ''
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB: Overview (Screenshot 414 & 413) */}
          {farmerSubTab === 'overview' && (
            <div className="space-y-4">
              {/* Welcome Banner */}
              <div className="clay-card p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Good morning, Grace Achieng!
                    </h3>
                    <p className="text-xs font-bold text-slate-500">
                      Amani Greens Shamba · Luanda Township · Vihiga County
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {onOpenCreatePost && (
                      <button
                        onClick={onOpenCreatePost}
                        className="clay-btn-secondary px-3 py-1.5 text-xs font-black inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>📱 Post to Feed</span>
                      </button>
                    )}
                    <button
                      onClick={() => setFarmerSubTab('products')}
                      className="clay-btn-primary px-3.5 py-1.5 text-xs font-black inline-flex items-center gap-1 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      + Add Produce
                    </button>
                  </div>
                </div>
              </div>

              {/* 4 Summary Overview KPI Cards (Screenshot 414) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="clay-card p-3.5 space-y-1">
                  <div className="text-[10px] font-extrabold uppercase text-slate-400">
                    Active Products
                  </div>
                  <div className="text-2xl font-black text-emerald-800">
                    {defaultShamba?.items.length || 4}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold">● Live in market</div>
                </div>

                <div className="clay-card p-3.5 space-y-1">
                  <div className="text-[10px] font-extrabold uppercase text-slate-400">
                    Incoming Orders
                  </div>
                  <div className="text-2xl font-black text-emerald-800">
                    {orders.length}
                  </div>
                  <div className="text-[10px] text-blue-700 font-bold">Ready for harvest</div>
                </div>

                <div className="clay-card p-3.5 space-y-1">
                  <div className="text-[10px] font-extrabold uppercase text-slate-400">
                    Monthly Sales
                  </div>
                  <div className="text-2xl font-black text-emerald-800">
                    KES 42.5k
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold">100% farm-gate</div>
                </div>

                <div className="clay-card p-3.5 space-y-1">
                  <div className="text-[10px] font-extrabold uppercase text-slate-400">
                    Pending Payouts
                  </div>
                  <div className="text-2xl font-black text-emerald-800">
                    KES 6.4k
                  </div>
                  <div className="text-[10px] text-amber-700 font-bold">M-Pesa scheduled</div>
                </div>
              </div>

              {/* Four Questions Architecture (Screenshot 413) */}
              <div className="clay-card p-5 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Farm Operations Navigation
                </h4>
                <div className="grid sm:grid-cols-2 gap-3 text-xs">
                  <div
                    onClick={() => setFarmerSubTab('profile')}
                    className="clay-inset-well p-3 space-y-1 cursor-pointer hover:border-emerald-300 transition-colors"
                  >
                    <div className="font-black text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                      <span>1. What is happening on my farm?</span>
                    </div>
                    <p className="text-slate-500 font-medium">
                      GPS coordinates, directions, declared practices, and CBF verification visit status.
                    </p>
                  </div>

                  <div
                    onClick={() => setFarmerSubTab('products')}
                    className="clay-inset-well p-3 space-y-1 cursor-pointer hover:border-emerald-300 transition-colors"
                  >
                    <div className="font-black text-slate-900 flex items-center gap-1.5">
                      <PlusCircle className="w-3.5 h-3.5 text-emerald-700" />
                      <span>2. What produce do I have available?</span>
                    </div>
                    <p className="text-slate-500 font-medium">
                      Daily harvest prices, bunches/kg in stock, photo uploads, and catalog availability.
                    </p>
                  </div>

                  <div
                    onClick={() => setFarmerSubTab('orders')}
                    className="clay-inset-well p-3 space-y-1 cursor-pointer hover:border-emerald-300 transition-colors"
                  >
                    <div className="font-black text-slate-900 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>3. What orders and payments do I have?</span>
                    </div>
                    <p className="text-slate-500 font-medium">
                      Incoming buyer orders, direct WhatsApp chat, boda courier arrangements, and receipts.
                    </p>
                  </div>

                  <div
                    onClick={() => setFarmerSubTab('help')}
                    className="clay-inset-well p-3 space-y-1 cursor-pointer hover:border-emerald-300 transition-colors"
                  >
                    <div className="font-black text-slate-900 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
                      <span>4. Where can I get agricultural support?</span>
                    </div>
                    <p className="text-slate-500 font-medium">
                      Direct extension advisory, CBF training sessions, and real-time pest/weather alerts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: My Farm (Profile & Directions) */}
          {farmerSubTab === 'profile' && (
            <div className="clay-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {defaultShamba?.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-500">
                    Luanda Township · Grace Achieng
                  </p>
                </div>
                <span className="clay-badge bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5">
                  {defaultShamba?.isVerified ? '✔ Verified Badge' : 'Awaiting CBF Visit'}
                </span>
              </div>

              <div className="space-y-2 text-xs border-t border-emerald-900/5 pt-3">
                <b className="text-slate-800 block">Shamba Location & Boda Directions</b>
                <textarea
                  rows={2}
                  value={shambaDirections}
                  onChange={(e) => setShambaDirections(e.target.value)}
                  className="clay-input w-full p-2.5 font-semibold text-slate-800"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-bold text-slate-500">
                    {gpsCaptured
                      ? '📍 GPS saved: 0.0154° N, 34.5982° E (Accuracy: 2.8m)'
                      : 'Buyers see ~100m area until order confirmation.'}
                  </span>
                  <button
                    onClick={() => {
                      setGpsCaptured(true);
                      alert('Coordinates captured via phone GPS!');
                    }}
                    className="clay-btn-secondary px-3 py-1.5 text-xs font-bold cursor-pointer"
                  >
                    {gpsCaptured ? 'Recapture GPS' : '📍 Capture GPS Pin'}
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-xs border-t border-emerald-900/5 pt-3">
                <b className="text-slate-800 block">Declared Farming Practices</b>
                <textarea
                  rows={2}
                  value={shambaPractices}
                  onChange={(e) => {
                    setShambaPractices(e.target.value);
                    if (defaultShamba) {
                      onUpdateFarm({ ...defaultShamba, practices: e.target.value });
                    }
                  }}
                  className="clay-input w-full p-2.5 font-semibold text-slate-800"
                />
              </div>
            </div>
          )}

          {/* TAB: Products & Prices */}
          {farmerSubTab === 'products' && (
            <div className="space-y-4">
              <div className="clay-card p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900">
                    Active Produce Inventory ({defaultShamba?.items.length || 0} items)
                  </h3>
                  <span className="text-xs font-bold text-emerald-700">Harvested Daily</span>
                </div>

                <div className="divide-y divide-emerald-900/5">
                  {defaultShamba?.items.map((it) => (
                    <div key={it.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-extrabold text-slate-900">{it.name}</div>
                        <div className="text-slate-500 font-semibold">
                          KES {it.price}/{it.unit} {it.availableQty ? `· ${it.availableQty}` : ''}
                        </div>
                      </div>
                      <span className="clay-badge bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                        In Stock
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Produce Form */}
              <div className="clay-card p-5 space-y-3">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4 text-emerald-700" />
                  <span>List New Produce</span>
                </h3>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">Category</label>
                    <select
                      value={newProdCat}
                      onChange={(e) => setNewProdCat(e.target.value)}
                      className="clay-input w-full p-2 font-semibold"
                    >
                      {CATEGORIES.slice(1).map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.emoji} {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">Item Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Traditional Terere"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      className="clay-input w-full p-2 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">Price (KES)</label>
                    <input
                      type="number"
                      placeholder="e.g. 50"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      className="clay-input w-full p-2 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">Unit</label>
                    <input
                      type="text"
                      placeholder="bunch, kg, tray"
                      value={newProdUnit}
                      onChange={(e) => setNewProdUnit(e.target.value)}
                      className="clay-input w-full p-2 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block text-xs mb-1">
                    Available Quantity
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 100 bunches available"
                    value={newProdQty}
                    onChange={(e) => setNewProdQty(e.target.value)}
                    className="clay-input w-full p-2 text-xs font-semibold"
                  />
                </div>

                <button
                  onClick={() => {
                    if (!newProdName || !newProdPrice) return;
                    const newItem = {
                      id: `p-${Date.now()}`,
                      category: newProdCat as any,
                      name: newProdName,
                      price: parseFloat(newProdPrice),
                      unit: newProdUnit,
                      availableQty: newProdQty,
                    };
                    if (defaultShamba) {
                      onUpdateFarm({
                        ...defaultShamba,
                        items: [...defaultShamba.items, newItem],
                      });
                    }
                    setNewProdName('');
                    setNewProdPrice('');
                    setNewProdQty('');
                    alert('Produce published to your catalog!');
                  }}
                  className="clay-btn-primary w-full py-2.5 text-xs font-black cursor-pointer"
                >
                  + Publish Produce
                </button>
              </div>
            </div>
          )}

          {/* TAB: Orders & Chat */}
          {farmerSubTab === 'orders' && (
            <div className="space-y-4">
              <div className="clay-card p-5 space-y-3">
                <h3 className="text-sm font-black text-slate-900">Incoming Harvest Orders</h3>
                <div className="clay-inset-well p-3.5 space-y-2 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-extrabold text-slate-900">Wanjiru T. (Luanda Posta)</div>
                      <div className="text-slate-600 font-semibold mt-0.5">
                        Kales ×3, Tomatoes ×2 · KES 360 · Pay on delivery
                      </div>
                    </div>
                    <span className="clay-badge bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                      Accepted
                    </span>
                  </div>
                  <p className="text-slate-500 font-medium">
                    Delivery via Boda Boda agreed.
                  </p>
                </div>
              </div>

              <div className="clay-card p-5 space-y-3">
                <h3 className="text-sm font-black text-slate-900">Buyer Direct Inquiries</h3>
                <div className="clay-inset-well p-3 space-y-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="font-extrabold text-slate-900 block">Buyer:</span>
                    "Habari Grace! Can you pack KES 300 of fresh Sukuma wiki today?"
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Reply to buyer..."
                      value={farmerReplyText}
                      onChange={(e) => setFarmerReplyText(e.target.value)}
                      className="clay-input flex-1 p-2 text-xs font-semibold"
                    />
                    <button
                      onClick={() => {
                        if (!farmerReplyText) return;
                        alert('Reply sent to buyer!');
                        setFarmerReplyText('');
                      }}
                      className="clay-btn-secondary px-3 py-1 text-xs font-bold cursor-pointer"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: Support & Climate */}
          {farmerSubTab === 'help' && (
            <div className="space-y-4">
              <div className="clay-card p-5 space-y-3">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-emerald-700" />
                  <span>Get Agronomic Advice</span>
                </h3>
                <div className="space-y-2 text-xs">
                  <label className="font-extrabold text-slate-700 block">Who to contact:</label>
                  <select
                    value={helpTo}
                    onChange={(e) => setHelpTo(e.target.value as any)}
                    className="clay-input w-full p-2 font-semibold"
                  >
                    <option value="cbf">Community-Based Facilitator (Field advice)</option>
                    <option value="officer">County Agricultural Officer (Pests / Regs)</option>
                    <option value="ngo">Partner Organization (Inputs / Grants)</option>
                  </select>

                  <textarea
                    rows={2}
                    value={helpTopic}
                    onChange={(e) => setHelpTopic(e.target.value)}
                    placeholder="Describe crop symptom or management question..."
                    className="clay-input w-full p-2.5 font-semibold text-slate-800"
                  />

                  <button
                    onClick={() => {
                      if (!helpTopic.trim()) return;
                      onAddHelpRequest({
                        id: `req-${Date.now()}`,
                        to: helpTo,
                        from: 'Grace A. (Amani Greens)',
                        topic: helpTopic,
                        status: 'new',
                        isMine: true,
                      });
                      setHelpTopic('');
                      alert('Inquiry sent to facilitator!');
                    }}
                    className="clay-btn-secondary w-full py-2 text-xs font-bold cursor-pointer"
                  >
                    Submit Question
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ----------------- 3. FPO COOPERATIVE DASHBOARD (Screenshot 411 & 410) ----------------- */}
      {currentRole === 'fpo' && (
        <div className="space-y-4">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'overview', label: '📊 Overview' },
              { id: 'aggregation', label: '🌾 Aggregation Workspace' },
              { id: 'stock', label: '📦 Stock Listed' },
              { id: 'members', label: '👥 Member Farmers' },
              { id: 'bulk', label: '🏪 Bulk Requests' },
              { id: 'payouts', label: '💰 Member Payouts' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFpoSubTab(tab.id as any)}
                className={`clay-tab px-3.5 py-2 text-xs font-bold whitespace-nowrap shrink-0 ${
                  fpoSubTab === tab.id ? 'clay-tab-on' : ''
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* FPO Overview (Screenshot 411) */}
          {fpoSubTab === 'overview' && (
            <div className="space-y-4">
              <div className="clay-card p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Luanda Farmers' Produce Organization (FPO)
                    </h3>
                    <p className="text-xs font-bold text-slate-500">
                      Vihiga County Cooperative System · Reg: FPO/VHG/2024/089
                    </p>
                  </div>
                  <span className="clay-badge bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5">
                    Cooperative Active
                  </span>
                </div>
              </div>

              {/* Overview Metrics Cards (Screenshot 411) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="clay-card p-3.5 space-y-1">
                  <div className="text-[10px] font-extrabold uppercase text-slate-400">
                    Registered Farmers
                  </div>
                  <div className="text-2xl font-black text-emerald-800">48</div>
                  <div className="text-[10px] text-emerald-700 font-bold">36 Active this week</div>
                </div>

                <div className="clay-card p-3.5 space-y-1">
                  <div className="text-[10px] font-extrabold uppercase text-slate-400">
                    Produce Aggregated
                  </div>
                  <div className="text-2xl font-black text-emerald-800">2,850 kg</div>
                  <div className="text-[10px] text-emerald-700 font-bold">Tomatoes, kales, eggs</div>
                </div>

                <div className="clay-card p-3.5 space-y-1">
                  <div className="text-[10px] font-extrabold uppercase text-slate-400">
                    Pending Buyer Requests
                  </div>
                  <div className="text-2xl font-black text-emerald-800">{bulkRequests.length}</div>
                  <div className="text-[10px] text-amber-700 font-bold">Supermarket tenders</div>
                </div>

                <div className="clay-card p-3.5 space-y-1">
                  <div className="text-[10px] font-extrabold uppercase text-slate-400">
                    Total Sales (YTD)
                  </div>
                  <div className="text-2xl font-black text-emerald-800">KES 380k</div>
                  <div className="text-[10px] text-emerald-700 font-bold">Wholesale institutional</div>
                </div>

                <div className="clay-card p-3.5 space-y-1">
                  <div className="text-[10px] font-extrabold uppercase text-slate-400">
                    Outstanding Member Payouts
                  </div>
                  <div className="text-2xl font-black text-emerald-800">KES 48.2k</div>
                  <div className="text-[10px] text-blue-700 font-bold">Pending delivery confirm</div>
                </div>

                <div className="clay-card p-3.5 space-y-1">
                  <div className="text-[10px] font-extrabold uppercase text-slate-400">
                    FPO Retention (3%)
                  </div>
                  <div className="text-2xl font-black text-emerald-800">KES 11.4k</div>
                  <div className="text-[10px] text-emerald-700 font-bold">Reinvested in grading</div>
                </div>
              </div>
            </div>
          )}

          {/* Aggregation Workspace (Screenshot 410) */}
          {fpoSubTab === 'aggregation' && (
            <div className="space-y-4">
              <div className="clay-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-emerald-700" />
                      <span>Produce Aggregation Workspace</span>
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                      Combine smallholder harvest lots into one unified bulk commercial contract.
                    </p>
                  </div>
                </div>

                {/* Active Lots */}
                <div className="space-y-3 pt-2">
                  {aggregationLots.map((lot) => (
                    <div
                      key={lot.id}
                      className="clay-inset-well p-4 space-y-3 text-xs"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-black text-slate-900 text-sm">{lot.product}</div>
                          <div className="text-slate-500 font-semibold mt-0.5">
                            Target Contract: <b>{lot.targetWeight}</b> · Bulk Price: <b>KES {lot.bulkPricePerKg}/kg</b>
                          </div>
                          <div className="text-emerald-800 font-bold text-[11px] mt-0.5">
                            Destination: {lot.destination}
                          </div>
                        </div>
                        <span className="clay-badge bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5">
                          {lot.committedWeight}
                        </span>
                      </div>

                      {/* Member Contributions */}
                      <div className="bg-white/80 p-3 rounded-xl border border-emerald-900/10 space-y-2">
                        <div className="font-extrabold text-slate-800 text-[11px]">
                          Member Shamba Commitments:
                        </div>
                        <div className="space-y-1">
                          {lot.memberFarms.map((m, idx) => (
                            <div key={idx} className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-700 font-semibold">● {m.name}</span>
                              <span className="font-black text-emerald-800">{m.qty}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Add Member Contribution Form */}
                      <div className="pt-2 border-t border-emerald-900/10 space-y-2">
                        <span className="font-extrabold text-slate-800 text-[11px] block">
                          + Pool Member Produce into this Contract:
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Farmer Name (e.g. Peter M.)"
                            value={contribFarmerName}
                            onChange={(e) => setContribFarmerName(e.target.value)}
                            className="clay-input p-2 font-semibold"
                          />
                          <input
                            type="text"
                            placeholder="Quantity (e.g. 150 kg)"
                            value={contribQty}
                            onChange={(e) => setContribQty(e.target.value)}
                            className="clay-input p-2 font-semibold"
                          />
                        </div>
                        <button
                          onClick={() => {
                            if (!contribFarmerName || !contribQty) return;
                            setAggregationLots((prev) =>
                              prev.map((l) =>
                                l.id === lot.id
                                  ? {
                                      ...l,
                                      memberFarms: [
                                        ...l.memberFarms,
                                        { name: contribFarmerName, qty: contribQty },
                                      ],
                                    }
                                  : l
                              )
                            );
                            setContribFarmerName('');
                            setContribQty('');
                            alert('Member harvest pooled into bulk aggregation lot!');
                          }}
                          className="clay-btn-primary w-full py-2 text-xs font-black cursor-pointer"
                        >
                          Commit Produce to Bulk Lot
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Stock Listed */}
          {fpoSubTab === 'stock' && (
            <div className="clay-card p-5 space-y-4">
              <h3 className="text-sm font-black text-slate-900">Stock Listed by the FPO</h3>
              <div className="space-y-2 text-xs">
                {fpoStock.map((s) => (
                  <div key={s.id} className="clay-inset-well p-3 flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-slate-900">{s.product}</div>
                      <div className="text-slate-500 font-semibold">{s.quantity}</div>
                    </div>
                    <div className="font-black text-emerald-700">KES {s.price}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Member Farmers */}
          {fpoSubTab === 'members' && (
            <div className="clay-card p-5 space-y-3">
              <h3 className="text-sm font-black text-slate-900">Registered Cooperative Members</h3>
              <div className="space-y-2 text-xs">
                {[
                  ['Grace Achieng (Amani Greens)', '120 kg tomatoes · 140 bunches kales'],
                  ['Peter Makori (Kilima Poultry)', '40 trays of eggs · 25 kienyeji birds'],
                  ['Lucy Nyongesa (Neema Farm)', '60 kg sweet potatoes · 30 kg managu'],
                  ['John Omondi (Shamba Fresh)', '200 heads cabbage · 150 kg onions'],
                ].map(([name, vol], idx) => (
                  <div key={idx} className="clay-inset-well p-3 flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-slate-900">{name}</div>
                      <div className="text-slate-500 font-semibold">{vol}</div>
                    </div>
                    <span className="clay-badge bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                      Verified Member
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bulk Requests */}
          {fpoSubTab === 'bulk' && (
            <div className="clay-card p-5 space-y-3">
              <h3 className="text-sm font-black text-slate-900">
                Bulk Wholesale Requests from Supermarkets & Schools
              </h3>
              <div className="space-y-2.5 text-xs">
                {bulkRequests.map((req) => (
                  <div key={req.id} className="clay-inset-well p-3 flex items-center justify-between gap-2">
                    <div>
                      <div className="font-extrabold text-slate-900">{req.businessName}</div>
                      <div className="text-slate-600 font-semibold">
                        {req.product} · {req.quantity}
                      </div>
                    </div>
                    {req.status === 'open' ? (
                      <button
                        onClick={() => onQuoteBulkRequest(req.id, 95)}
                        className="clay-btn-primary px-3 py-1.5 text-xs font-extrabold cursor-pointer"
                      >
                        Send Quote (KES 95/kg)
                      </button>
                    ) : (
                      <span className="clay-badge bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5">
                        Quoted
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payouts */}
          {fpoSubTab === 'payouts' && (
            <div className="clay-card p-5 space-y-3 text-xs">
              <h3 className="text-sm font-black text-slate-900">Member Payouts & Commission Engine</h3>
              <p className="text-slate-600 font-medium leading-relaxed">
                Wholesale receipts are processed transparently: FPO retains 3% administrative commission, and 97% is disbursed directly to member farmers' M-Pesa or registered chamas upon delivery confirmation.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ----------------- 4. COUNTY AGRICULTURAL OFFICER (Screenshot 409 & 408) ----------------- */}
      {currentRole === 'officer' && (
        <div className="space-y-4">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'overview', label: '📊 Monitoring Overview' },
              { id: 'verification', label: '✔ Verification Queue' },
              { id: 'complaints', label: '⚖️ Dispute Arbitration' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setOfficerSubTab(tab.id as any)}
                className={`clay-tab px-3.5 py-2 text-xs font-bold whitespace-nowrap shrink-0 ${
                  officerSubTab === tab.id ? 'clay-tab-on' : ''
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Monitoring Overview (Screenshot 409 & 408) */}
          {officerSubTab === 'overview' && (
            <div className="space-y-4">
              <div className="clay-card p-5 space-y-2">
                <h3 className="text-base font-black text-slate-900">
                  Vihiga County Agricultural Monitoring Desk
                </h3>
                <p className="text-xs font-bold text-slate-500">
                  Extension Officer: Eng. James Nyabuto · Ministry of Agriculture
                </p>
              </div>

              {/* Ward-based farmer statistics */}
              <div className="clay-card p-5 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Registered Farmers by Ward
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="clay-inset-well p-3 text-center">
                    <div className="font-black text-emerald-800 text-lg">54</div>
                    <div className="font-bold text-slate-600">Luanda Township</div>
                  </div>
                  <div className="clay-inset-well p-3 text-center">
                    <div className="font-black text-emerald-800 text-lg">36</div>
                    <div className="font-bold text-slate-600">Kima Ward</div>
                  </div>
                  <div className="clay-inset-well p-3 text-center">
                    <div className="font-black text-emerald-800 text-lg">28</div>
                    <div className="font-bold text-slate-600">Chavakali Ward</div>
                  </div>
                  <div className="clay-inset-well p-3 text-center">
                    <div className="font-black text-emerald-800 text-lg">24</div>
                    <div className="font-bold text-slate-600">Mbale Ward</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Verification Queue */}
          {officerSubTab === 'verification' && (
            <div className="clay-card p-5 space-y-3">
              <h3 className="text-sm font-black text-slate-900">
                Shamba Verification Queue ({verificationQueue.length})
              </h3>
              {verificationQueue.length === 0 ? (
                <div className="clay-inset-well p-4 text-center text-xs text-slate-500">
                  All farm verifications reviewed and confirmed.
                </div>
              ) : (
                verificationQueue.map((item) => (
                  <div key={item.id} className="clay-inset-well p-3.5 space-y-2 text-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-extrabold text-slate-900">{item.farmName}</div>
                        <div className="text-slate-500">{item.ward} · CBF report submitted</div>
                      </div>
                      <span className="clay-badge bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5">
                        {item.stage}
                      </span>
                    </div>

                    <div className="text-slate-600 font-medium">
                      ☑ GPS coordinates match · ☑ Declared practices confirmed on-site
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => {
                          onUpdateVerificationStage(item.id, 'completed');
                          alert(`Verified badge approved for ${item.farmName}!`);
                        }}
                        className="clay-btn-primary flex-1 py-1.5 text-xs font-extrabold cursor-pointer"
                      >
                        Approve Verified Badge
                      </button>
                      <button
                        onClick={() => onUpdateVerificationStage(item.id, 'rejected')}
                        className="clay-btn-secondary flex-1 py-1.5 text-xs font-extrabold text-red-700 cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Complaints */}
          {officerSubTab === 'complaints' && (
            <div className="clay-card p-5 space-y-3">
              <h3 className="text-sm font-black text-slate-900">Consumer Disputes Arbitration</h3>
              {complaints.length === 0 ? (
                <div className="clay-inset-well p-4 text-center text-xs text-slate-500">
                  No disputes pending arbitration.
                </div>
              ) : (
                complaints.map((c) => (
                  <div key={c.id} className="clay-inset-well p-3.5 space-y-2 text-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-extrabold text-slate-900">{c.farmName}</div>
                        <div className="text-slate-500">
                          Buyer: {c.buyerName} · <b className="text-red-700">{c.reason}</b>
                        </div>
                      </div>
                      <span className="clay-badge px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800">
                        {c.status}
                      </span>
                    </div>

                    <div className="bg-white/80 p-2 rounded-xl text-slate-700 font-medium">
                      "{c.details}"
                    </div>

                    {c.status === 'open' && (
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => onUpdateComplaintStatus(c.id, 'Refunded buyer')}
                          className="clay-btn-secondary flex-1 py-1 text-[11px] font-bold text-emerald-800"
                        >
                          Refund Buyer
                        </button>
                        <button
                          onClick={() => onUpdateComplaintStatus(c.id, 'Partial refund')}
                          className="clay-btn-secondary flex-1 py-1 text-[11px] font-bold text-amber-800"
                        >
                          Partial Refund
                        </button>
                        <button
                          onClick={() => onUpdateComplaintStatus(c.id, 'Dismissed')}
                          className="clay-btn-secondary flex-1 py-1 text-[11px] font-bold text-slate-600"
                        >
                          Dismiss
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* ----------------- 5. CBF FACILITATOR (Screenshot 407: FieldServicely Console) ----------------- */}
      {currentRole === 'cbf' && (
        <CbfDashboard
          farms={farms}
          helpRequests={helpRequests}
          onAnswerHelpRequest={onAnswerHelpRequest}
          trainingSessions={trainingSessions}
          onAddTrainingSession={onAddTrainingSession}
        />
      )}

      {/* ----------------- 6. BULK BUYER WORKSPACE (Screenshot 406) ----------------- */}
      {currentRole === 'bulk' && (
        <div className="space-y-4">
          <div className="clay-card p-5 space-y-3">
            <h3 className="text-sm font-black text-slate-900">
              Post Wholesale Procurement Tender
            </h3>
            <div className="space-y-2.5 text-xs">
              <div>
                <label className="font-extrabold text-slate-700 block mb-1">
                  Produce Needed
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tomatoes (Grade 1)"
                  value={bulkProduct}
                  onChange={(e) => setBulkProduct(e.target.value)}
                  className="clay-input w-full p-2.5 font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">
                  Volume & Frequency
                </label>
                <input
                  type="text"
                  placeholder="e.g. 400 kg weekly for 3 months"
                  value={bulkQtyFreq}
                  onChange={(e) => setBulkQtyFreq(e.target.value)}
                  className="clay-input w-full p-2.5 font-semibold text-slate-800"
                />
              </div>

              <button
                onClick={() => {
                  if (!bulkProduct || !bulkQtyFreq) return;
                  onAddBulkRequest({
                    id: `req-${Date.now()}`,
                    businessName: 'Luanda Central Supermarket',
                    product: bulkProduct,
                    quantity: bulkQtyFreq,
                    status: 'open',
                  });
                  setBulkProduct('');
                  setBulkQtyFreq('');
                  alert('Bulk request broadcast to all verified FPOs and shambas!');
                }}
                className="clay-btn-primary w-full py-2.5 text-xs font-black cursor-pointer"
              >
                Broadcast Tender to FPOs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- 7. RIDER WORKSPACE ----------------- */}
      {currentRole === 'rider' && (
        <div className="space-y-4">
          <div className="clay-card p-5 space-y-3">
            <h3 className="text-sm font-black text-slate-900">
              Boda Boda Harvest Runs
            </h3>
            <div className="space-y-2.5 text-xs">
              {riderJobs.map((job) => (
                <div key={job.id} className="clay-inset-well p-3.5 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-extrabold text-slate-900">
                        {job.pickup} → {job.dropoff}
                      </div>
                      <div className="text-emerald-700 font-black mt-0.5">
                        Agreed Courier Fee: KES {job.fee}
                      </div>
                    </div>
                    <span className="clay-badge bg-blue-50 text-blue-800 text-[10px] font-bold px-2 py-0.5">
                      {job.status}
                    </span>
                  </div>

                  {job.status === 'New' ? (
                    <button
                      onClick={() => onUpdateRiderJob(job.id, 'Accepted')}
                      className="clay-btn-primary w-full py-2 text-xs font-black cursor-pointer"
                    >
                      Accept Delivery Run
                    </button>
                  ) : (
                    <button
                      onClick={() => onUpdateRiderJob(job.id, 'Completed')}
                      className="clay-btn-secondary w-full py-2 text-xs font-black text-emerald-800 cursor-pointer"
                    >
                      Mark as Delivered (Confirm OTP)
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- 8. NGO WORKSPACE ----------------- */}
      {currentRole === 'ngo' && (
        <div className="space-y-4">
          <div className="clay-card p-5 space-y-3">
            <h3 className="text-sm font-black text-slate-900">
              Regional Programme Reach
            </h3>
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="clay-inset-well p-3">
                <div className="text-lg font-black text-emerald-700">142</div>
                <div className="text-[10px] font-bold text-slate-500">Enrolled Shambas</div>
              </div>
              <div className="clay-inset-well p-3">
                <div className="text-lg font-black text-emerald-700">8</div>
                <div className="text-[10px] font-bold text-slate-500">Active CBFs</div>
              </div>
              <div className="clay-inset-well p-3">
                <div className="text-lg font-black text-emerald-700">46</div>
                <div className="text-[10px] font-bold text-slate-500">Badges Confirmed</div>
              </div>
            </div>
          </div>

          <div className="clay-card p-5 space-y-3">
            <h3 className="text-sm font-black text-slate-900">
              Broadcast Agronomy & Weather Notice to Farmers
            </h3>
            <div className="space-y-2 text-xs">
              <textarea
                rows={2}
                value={newNoticeText}
                onChange={(e) => setNewNoticeText(e.target.value)}
                placeholder="e.g. Fall Armyworm alert in Chavakali. Apply biological neem spray."
                className="clay-input w-full p-2.5 font-semibold text-slate-800"
              />
              <button
                onClick={() => {
                  if (!newNoticeText) return;
                  onAddPartnerNotice(newNoticeText);
                  setNewNoticeText('');
                  alert('Notice published to all farmer dashboards in Vihiga!');
                }}
                className="clay-btn-primary w-full py-2.5 text-xs font-black cursor-pointer"
              >
                Publish Broadcast Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
