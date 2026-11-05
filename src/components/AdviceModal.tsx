import React from 'react';
import { X, Sparkles, CheckCircle2, TrendingUp, ShieldAlert, Cpu, Truck, DollarSign } from 'lucide-react';

interface AdviceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdviceModal: React.FC<AdviceModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="clay-card-white w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 relative border border-emerald-900/15">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Strategic Blueprint & Advice for Mavuno
            </h2>
            <p className="text-xs font-bold text-emerald-800">
              Comparative Analysis: US Direct-Farm Apps vs. Kenyan Agritech Realities
            </p>
          </div>
        </div>

        {/* Section 1: Comparison with US Apps */}
        <div className="clay-inset-well p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-black text-slate-900">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            <span>How Mavuno Compares to US Platforms (Localize, GrownBy, Farmish)</span>
          </div>
          <div className="text-xs text-slate-600 space-y-2 leading-relaxed font-medium">
            <p>
              • <b>Localize (US)</b> relies on a $19.99–$39.99 in-app subscription and paywalls its map. <b>Recommendation for Mavuno:</b> Do <i>not</i> paywall the map in Kenya. Kenyan consumers and mama mbogas will immediately churn to open-air roadside markets if charged an upfront fee.
            </p>
            <p>
              • <b>GrownBy (US)</b> is farmer-owned and handles credit cards/SNAP benefits. In Kenya, <b>M-Pesa</b> is the uncontested sovereign rail. A simulated or live Lipa na M-Pesa escrow flow (releasing cash only when buyer inspects goods) builds 10x higher trust.
            </p>
            <p>
              • <b>Farmish (US)</b> allows simple chat between backyard growers. Mavuno's addition of <b>FPOs</b> and <b>Supermarket Bulk Tenders</b> is significantly higher value, addressing commercial volume rather than just hobbyist trading.
            </p>
          </div>
        </div>

        {/* Section 2: Concrete High-Impact Recommendations for Mavuno Kenya */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
            5 Critical Pillars for Mavuno's Growth in Vihiga & Western Kenya
          </h3>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="clay-card p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 font-black text-slate-800">
                <ShieldAlert className="w-4 h-4 text-emerald-700" />
                <span>1. De-centralized Verification</span>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed">
                Third-party certifications (GlobalGAP/Organic) cost $1,500+, locking out smallholders. Your <b>CBF on-site visit + County Officer badge confirmation</b> model gives institutional credibility without imposing crippling fees on rural farmers.
              </p>
            </div>

            <div className="clay-card p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 font-black text-slate-800">
                <Truck className="w-4 h-4 text-emerald-700" />
                <span>2. Boda Boda Micro-Logistics</span>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed">
                Rather than investing in costly refrigerated logistics, leverage the existing boda boda network in Luanda. A rider picking up greens harvested at 6:30 AM arrives in town by 8:00 AM before wilting occurs.
              </p>
            </div>

            <div className="clay-card p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 font-black text-slate-800">
                <DollarSign className="w-4 h-4 text-emerald-700" />
                <span>3. Sustainable Monetization</span>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed">
                Charge a <b>2.5%–4% facilitation fee</b> strictly on institutional wholesale/bulk supermarket orders. Keep household purchases free. Offer county extension offices or NGOs subscription dashboards for real-time agronomic data.
              </p>
            </div>

            <div className="clay-card p-3.5 space-y-1.5">
              <div className="flex items-center gap-1.5 font-black text-slate-800">
                <Cpu className="w-4 h-4 text-emerald-700" />
                <span>4. WhatsApp & USSD Bridge</span>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed">
                Many elder farmers use feature phones (Nokia/Kabambe). Provide an SMS/USSD or automated WhatsApp gateway so farmers can reply "1 for Accept" or "ADD TOMATOES 50KG 100" without needing high-speed 4G data.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Summary Takeaway */}
        <div className="clay-inset-well p-3.5 flex items-center justify-between text-xs">
          <div className="font-extrabold text-slate-800">
            Mavuno's Claymorphic UI + Multi-Stakeholder Engine is ready for pilot deployment.
          </div>
          <button
            onClick={onClose}
            className="clay-btn-primary px-4 py-2 text-xs font-black shrink-0 cursor-pointer"
          >
            Got it, explore app
          </button>
        </div>
      </div>
    </div>
  );
};
