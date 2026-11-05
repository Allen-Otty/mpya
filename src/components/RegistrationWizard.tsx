import React, { useState } from 'react';
import { RoleId } from '../types';
import { Check, ArrowRight, ArrowLeft, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { VIHIGA_WARDS } from '../mockData';

interface RegistrationWizardProps {
  onComplete: (role: RoleId, name: string, ward: string) => void;
  onCancel: () => void;
}

export const RegistrationWizard: React.FC<RegistrationWizardProps> = ({
  onComplete,
  onCancel,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedRole, setSelectedRole] = useState<RoleId>('farmer');

  // Form fields
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [county, setCounty] = useState('Vihiga');
  const [subCounty, setSubCounty] = useState('Luanda');
  const [ward, setWard] = useState('Luanda Township');
  const [village, setVillage] = useState('');
  const [fullName, setFullName] = useState('');
  const [entityName, setEntityName] = useState('');
  const [farmingPractices, setFarmingPractices] = useState('Organic manure, zero synthetic pesticides');
  const [primaryProduce, setPrimaryProduce] = useState('Vegetables & Poultry');

  const roles = [
    {
      id: 'farmer' as RoleId,
      icon: '🌱',
      title: 'Farmer',
      subtitle: 'Grow and sell produce directly to households & bulk buyers',
    },
    {
      id: 'fpo' as RoleId,
      icon: '👥',
      title: 'FPO / Cooperative',
      subtitle: 'Manage farmer groups, produce aggregation & bulk contracts',
    },
    {
      id: 'buyer' as RoleId,
      icon: '🛍️',
      title: 'Local Buyer',
      subtitle: 'Buy fresh harvested produce straight from verified shambas',
    },
    {
      id: 'officer' as RoleId,
      icon: '🏛️',
      title: 'Agricultural Officer',
      subtitle: 'Manage extension services, CBF audits & badge confirmations',
    },
    {
      id: 'cbf' as RoleId,
      icon: '🎓',
      title: 'CBF Facilitator',
      subtitle: 'Conduct on-site shamba inspections & farmer training barazas',
    },
    {
      id: 'bulk' as RoleId,
      icon: '🏪',
      title: 'Bulk Buyer',
      subtitle: 'Procure wholesale produce for supermarkets, schools & hotels',
    },
  ];

  const handleFinish = () => {
    onComplete(selectedRole, fullName || 'New Shamba Owner', ward);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Step Indicator (Screenshot 405) */}
      <div className="clay-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-slate-900">
            Create Your Mavuno Account
          </h2>
          <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Step {step} of 5
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2">
          {[
            { num: 1, label: 'Account' },
            { num: 2, label: 'Location' },
            { num: 3, label: 'Profile' },
            { num: 4, label: 'Shamba' },
            { num: 5, label: 'Confirm' },
          ].map((s) => (
            <div key={s.num} className="flex-1">
              <div
                className={`h-1.5 rounded-full transition-all ${
                  step >= s.num ? 'bg-emerald-600' : 'bg-slate-200'
                }`}
              />
              <span
                className={`text-[10px] font-bold block mt-1 ${
                  step === s.num ? 'text-emerald-800 font-black' : 'text-slate-400'
                }`}
              >
                {s.num}. {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: Account Type & Login Details */}
      {step === 1 && (
        <div className="clay-card p-6 space-y-5">
          <div>
            <h3 className="text-sm font-black text-slate-900">1. Choose Your Account Type</h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Select how you will participate in the Mavuno agricultural network.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {roles.map((r) => {
              const isSelected = selectedRole === r.id;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedRole(r.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/90 border-emerald-600 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{r.icon}</span>
                    <div>
                      <div className="font-black text-sm text-slate-900 flex items-center gap-1.5">
                        <span>{r.title}</span>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                        {r.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
            <div>
              <label className="font-extrabold text-slate-700 block mb-1">
                WhatsApp Phone Number
              </label>
              <input
                type="tel"
                placeholder="0712 345 678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="clay-input w-full p-2.5 font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="font-extrabold text-slate-700 block mb-1">
                Security PIN (4 Digits)
              </label>
              <input
                type="password"
                maxLength={4}
                placeholder="••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="clay-input w-full p-2.5 font-semibold text-slate-800"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={onCancel}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => setStep(2)}
              className="clay-btn-primary px-5 py-2.5 text-xs font-black inline-flex items-center gap-1.5 cursor-pointer"
            >
              Next: Location →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Location Hierarchy (Screenshot 404) */}
      {step === 2 && (
        <div className="clay-card p-6 space-y-4">
          <div>
            <h3 className="text-sm font-black text-slate-900">2. Geographical Location</h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Consistent administrative hierarchy ensures field CBFs and buyers locate you accurately.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-extrabold text-slate-700 block mb-1">County</label>
              <select
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                className="clay-input w-full p-2.5 font-semibold text-slate-800"
              >
                <option value="Vihiga">Vihiga County (Pilot)</option>
                <option value="Kisumu">Kisumu County</option>
                <option value="Kakamega">Kakamega County</option>
              </select>
            </div>

            <div>
              <label className="font-extrabold text-slate-700 block mb-1">Sub-County</label>
              <select
                value={subCounty}
                onChange={(e) => setSubCounty(e.target.value)}
                className="clay-input w-full p-2.5 font-semibold text-slate-800"
              >
                <option value="Luanda">Luanda Sub-County</option>
                <option value="Emuhaya">Emuhaya Sub-County</option>
                <option value="Hamisi">Hamisi Sub-County</option>
                <option value="Sabatia">Sabatia Sub-County</option>
              </select>
            </div>

            <div>
              <label className="font-extrabold text-slate-700 block mb-1">Ward</label>
              <select
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="clay-input w-full p-2.5 font-semibold text-slate-800"
              >
                {VIHIGA_WARDS.filter((w) => w !== 'All Wards').map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-extrabold text-slate-700 block mb-1">Village / Landmark</label>
              <input
                type="text"
                placeholder="e.g. Ebwiranyi / Near Posta"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="clay-input w-full p-2.5 font-semibold text-slate-800"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-100">
            <button
              onClick={() => setStep(1)}
              className="clay-btn-secondary px-4 py-2 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="clay-btn-primary px-5 py-2 text-xs font-black inline-flex items-center gap-1.5 cursor-pointer"
            >
              Next: Profile →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Personal or Organization Information */}
      {step === 3 && (
        <div className="clay-card p-6 space-y-4">
          <div>
            <h3 className="text-sm font-black text-slate-900">3. Profile & Contact Information</h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Enter details for notifications, order receipts, and verification scheduling.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-extrabold text-slate-700 block mb-1">Full Legal Name</label>
              <input
                type="text"
                placeholder="e.g. Grace Achieng / Samuel Wafula"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="clay-input w-full p-2.5 font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="font-extrabold text-slate-700 block mb-1">
                {selectedRole === 'fpo'
                  ? 'FPO / Cooperative Name'
                  : selectedRole === 'farmer'
                  ? 'Shamba / Farm Name'
                  : 'Business / Household Name'}
              </label>
              <input
                type="text"
                placeholder="e.g. Amani Greens Shamba / Luanda Supermarket"
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                className="clay-input w-full p-2.5 font-semibold text-slate-800"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-100">
            <button
              onClick={() => setStep(2)}
              className="clay-btn-secondary px-4 py-2 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="clay-btn-primary px-5 py-2 text-xs font-black inline-flex items-center gap-1.5 cursor-pointer"
            >
              Next: Shamba Details →
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Farm or Business Details */}
      {step === 4 && (
        <div className="clay-card p-6 space-y-4">
          <div>
            <h3 className="text-sm font-black text-slate-900">4. Agricultural & Produce Specifications</h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Declared practices are audited on-site by Community-Based Facilitators.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-extrabold text-slate-700 block mb-1">Primary Produce Harvested</label>
              <input
                type="text"
                placeholder="e.g. Sukuma Wiki, Tomatoes, Kienyeji Poultry, Eggs"
                value={primaryProduce}
                onChange={(e) => setPrimaryProduce(e.target.value)}
                className="clay-input w-full p-2.5 font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="font-extrabold text-slate-700 block mb-1">Declared Farming Practices</label>
              <textarea
                rows={2}
                value={farmingPractices}
                onChange={(e) => setFarmingPractices(e.target.value)}
                className="clay-input w-full p-2.5 font-semibold text-slate-800"
              />
              <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                Transparency note: Buyers see declared practices; verified badges are issued after CBF inspection.
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-100">
            <button
              onClick={() => setStep(3)}
              className="clay-btn-secondary px-4 py-2 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              onClick={() => setStep(5)}
              className="clay-btn-primary px-5 py-2 text-xs font-black inline-flex items-center gap-1.5 cursor-pointer"
            >
              Next: Confirmation →
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Confirmation & Account Submission */}
      {step === 5 && (
        <div className="clay-card p-6 space-y-5 text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl clay-badge">
            ✓
          </div>

          <div>
            <h3 className="text-base font-black text-slate-900">
              Ready to Launch Your {selectedRole.toUpperCase()} Account!
            </h3>
            <p className="text-xs font-semibold text-slate-500 mt-1 max-w-md mx-auto">
              Welcome {fullName || 'Member'} to the Mavuno network. Your account will be initialized in {ward}, Vihiga County.
            </p>
          </div>

          <div className="clay-inset-well p-4 text-left text-xs space-y-1.5">
            <div><b>Role:</b> {selectedRole}</div>
            <div><b>Location:</b> {ward}, {subCounty}, Vihiga</div>
            <div><b>Produce Focus:</b> {primaryProduce}</div>
            <div><b>Practices:</b> {farmingPractices}</div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setStep(4)}
              className="clay-btn-secondary flex-1 py-2.5 text-xs font-bold cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={handleFinish}
              className="clay-btn-primary flex-2 py-2.5 text-xs font-black cursor-pointer"
            >
              Launch My Workspace Now →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
