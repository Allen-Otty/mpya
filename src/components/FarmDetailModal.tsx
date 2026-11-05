import React, { useState } from 'react';
import { Farm, Order, ChatMessage } from '../types';
import {
  ArrowLeft,
  ShieldCheck,
  MapPin,
  MessageCircle,
  Send,
  CheckCircle,
  Truck,
  Sparkles,
  PhoneCall,
} from 'lucide-react';

interface FarmDetailModalProps {
  farm: Farm;
  onBack: () => void;
  onOrderPlaced: (order: Order) => void;
  isUnlocked: boolean;
  chatHistory: ChatMessage[];
  onSendMessage: (farmId: number, message: string) => void;
}

export const FarmDetailModal: React.FC<FarmDetailModalProps> = ({
  farm,
  onBack,
  onOrderPlaced,
  isUnlocked,
  chatHistory,
  onSendMessage,
}) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [inputMessage, setInputMessage] = useState('');
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [deliveryPreference, setDeliveryPreference] = useState<'Boda Pickup' | 'Direct Delivery' | 'Farm Pickup'>('Direct Delivery');

  const updateQuantity = (itemId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [itemId]: next };
    });
  };

  const totalAmount = farm.items.reduce((sum, item) => {
    const qty = quantities[item.id] || 0;
    return sum + qty * item.price;
  }, 0);

  const selectedItemsCount = Object.values(quantities).reduce((a, b) => a + b, 0);

  const handlePlaceOrder = () => {
    if (totalAmount <= 0) return;

    const orderedItems = farm.items
      .filter((item) => (quantities[item.id] || 0) > 0)
      .map((item) => ({
        productName: item.name,
        qty: quantities[item.id],
        unit: item.unit,
        price: item.price,
      }));

    const summary = orderedItems.map((i) => `${i.productName} ×${i.qty}`).join(', ');

    const newOrder: Order = {
      id: `ORD-${Date.now().toString().slice(-4)}`,
      farmId: farm.id,
      farmName: farm.name,
      itemsSummary: summary,
      totalAmount,
      status: 'Accepted',
      date: 'Just now',
      items: orderedItems,
      customerName: 'Wanjiru T. (You)',
      deliveryMethod: deliveryPreference,
    };

    onOrderPlaced(newOrder);
    setOrderConfirmed(true);
  };

  const handleSendChat = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSendMessage(farm.id, trimmed);
    setInputMessage('');
  };

  if (orderConfirmed) {
    return (
      <div className="space-y-4">
        <button
          onClick={onBack}
          className="clay-btn-secondary px-3.5 py-1.5 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to all shambas
        </button>

        <div className="clay-card p-6 space-y-4 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto clay-badge">
            <CheckCircle className="w-10 h-10" />
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-900">
              Order Placed with {farm.name}!
            </h2>
            <p className="text-sm font-semibold text-slate-500 mt-1">
              Order Total: <span className="text-emerald-700 font-extrabold">KES {totalAmount.toLocaleString()}</span> (Pay on delivery)
            </p>
          </div>

          <div className="clay-inset-well p-4 text-left space-y-2.5 text-xs font-semibold text-slate-700">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                ✓
              </span>
              <span>
                <b>WhatsApp notification:</b> {farm.owner} was instantly alerted on their phone.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                ✓
              </span>
              <span>
                <b>Exact GPS pin unlocked:</b> The red marker on the map now shows the farm's pinpoint location for Boda Boda pickup.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                ✓
              </span>
              <span>
                <b>Coordinate delivery:</b> Use the live chat below to agree on harvest time and transport cost sharing.
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onBack}
              className="clay-btn-primary w-full py-3 text-sm font-extrabold cursor-pointer"
            >
              Done & Return to Map
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="clay-btn-secondary px-3.5 py-1.5 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to all shambas
      </button>

      {/* Shamba Profile Header Card */}
      <div className="clay-card p-5 space-y-4">
        {farm.image ? (
          <img
            src={farm.image}
            alt={farm.name}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
              const fb = (e.target as HTMLElement).nextElementSibling;
              if (fb) (fb as HTMLElement).style.display = 'flex';
            }}
            className="w-full h-44 rounded-2xl object-cover shadow-sm border border-white"
          />
        ) : null}
        <div
          style={{ display: farm.image ? 'none' : 'flex' }}
          className="w-full h-40 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 text-white p-5 flex flex-col justify-end shadow-sm border border-white/20"
        >
          <div className="text-3xl mb-1">
            {farm.items[0]?.category === 'vegetables'
              ? '🥬'
              : farm.items[0]?.category === 'chicken'
              ? '🍗'
              : farm.items[0]?.category === 'eggs'
              ? '🥚'
              : farm.items[0]?.category === 'milk'
              ? '🥛'
              : '🌾'}
          </div>
          <div className="text-base font-black tracking-tight">{farm.name}</div>
          <div className="text-xs font-semibold text-emerald-100">
            {farm.area} · Certified Shamba Practice
          </div>
        </div>

        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-black text-slate-900">{farm.name}</h1>
            <p className="text-xs font-bold text-slate-500 mt-0.5">
              Managed by <span className="text-slate-800">{farm.owner}</span> · {farm.area}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs font-black text-amber-700">★ {farm.rating}</div>
            {farm.isVerified ? (
              <span className="clay-badge bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 border border-emerald-200 inline-flex items-center gap-1 mt-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Verified Shamba
              </span>
            ) : (
              <span className="clay-badge bg-amber-50 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 border border-amber-200 inline-block mt-1">
                Awaiting CBF Visit
              </span>
            )}
          </div>
        </div>

        {/* Farmer-Declared Practices */}
        <div className="clay-inset-well p-3 space-y-1 text-xs">
          <div className="font-extrabold text-emerald-900 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Farm Practices (Farmer-Declared)</span>
          </div>
          <p className="text-slate-600 font-medium leading-relaxed">{farm.practices}</p>
        </div>

        {/* Privacy Note / Exact GPS Pin */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-white/70 p-2.5 rounded-xl border border-emerald-900/10">
          <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            {isUnlocked ? (
              <span className="text-red-600 font-black">
                Exact GPS Location Unlocked (Red Dot on Map)
              </span>
            ) : (
              'Approximate ~100m area shown. Exact shamba GPS pin is revealed upon placing an order.'
            )}
          </span>
        </div>
      </div>

      {/* Fresh Produce & Cart Selection */}
      <div className="clay-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-900">
            Harvest Price List ({farm.items.length} items)
          </h2>
          <span className="text-xs font-bold text-emerald-700">
            {selectedItemsCount > 0 ? `${selectedItemsCount} items in cart` : 'Select quantity'}
          </span>
        </div>

        <div className="divide-y divide-emerald-900/5">
          {farm.items.map((item) => {
            const qty = quantities[item.id] || 0;
            return (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-lg shrink-0">
                    {item.category === 'vegetables'
                      ? '🥬'
                      : item.category === 'chicken'
                      ? '🍗'
                      : item.category === 'eggs'
                      ? '🥚'
                      : item.category === 'milk'
                      ? '🥛'
                      : item.category === 'beef'
                      ? '🥩'
                      : '🍠'}
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">{item.name}</div>
                    <div className="text-xs font-bold text-slate-500">
                      <span className="text-emerald-700 font-extrabold">KES {item.price}</span> / {item.unit}
                      {item.availableQty && (
                        <span className="text-slate-400 font-semibold ml-2">
                          · {item.availableQty} available
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="clay-qty-btn text-slate-700"
                    disabled={qty === 0}
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-xs font-black text-slate-900">
                    {qty}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="clay-qty-btn text-emerald-800"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Delivery Mode Choice */}
        <div className="pt-2">
          <div className="text-xs font-bold text-slate-600 mb-1.5 flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Fulfillment Preference</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['Direct Delivery', 'Boda Pickup', 'Farm Pickup'] as const).map((method) => (
              <button
                key={method}
                onClick={() => setDeliveryPreference(method)}
                className={`py-2 px-1 text-[11px] font-extrabold rounded-xl text-center cursor-pointer transition-all ${
                  deliveryPreference === method
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={totalAmount === 0}
          className={`w-full py-3.5 text-sm font-extrabold transition-all cursor-pointer ${
            totalAmount > 0
              ? 'clay-btn-primary'
              : 'clay-btn-secondary opacity-50 cursor-not-allowed'
          }`}
        >
          {totalAmount > 0
            ? `Place Order · KES ${totalAmount.toLocaleString()} (Pay on Delivery)`
            : 'Select produce above to order'}
        </button>
      </div>

      {/* Direct Buyer-Farmer Chat & WhatsApp Alert */}
      <div className="clay-card p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-emerald-700" />
              <span>Direct Chat with {farm.owner}</span>
            </h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Discuss packaging, pickup time, or share boda transport cost.
            </p>
          </div>
          <span className="clay-badge bg-emerald-50 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 border border-emerald-200">
            WhatsApp Connected
          </span>
        </div>

        {/* Message Thread */}
        <div className="clay-inset-well p-3 space-y-2 max-h-48 overflow-y-auto">
          {chatHistory.length === 0 ? (
            <div className="text-center py-4 text-xs font-semibold text-slate-400">
              No messages yet. Send a question below or pick a quick prompt!
            </div>
          ) : (
            chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.sender === 'you' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs font-semibold ${
                    msg.sender === 'you'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-400 font-bold px-1 mt-0.5">
                  {msg.time}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Quick Prompts */}
        <div className="space-y-1">
          <div className="text-[11px] font-bold text-slate-400">Quick inquiries:</div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => handleSendChat('Habari Grace! Can you harvest KES 300 of fresh Sukuma wiki today?')}
              className="clay-pill px-2.5 py-1 text-[11px] font-bold text-slate-700 cursor-pointer"
            >
              "Harvest KES 300 Sukuma?"
            </button>
            <button
              onClick={() => handleSendChat('What are your payment terms? Can I pay on delivery via M-Pesa?')}
              className="clay-pill px-2.5 py-1 text-[11px] font-bold text-slate-700 cursor-pointer"
            >
              "Payment terms / M-Pesa?"
            </button>
            <button
              onClick={() => handleSendChat('Can my local Boda Boda rider come pick up the order around 4:00 PM?')}
              className="clay-pill px-2.5 py-1 text-[11px] font-bold text-slate-700 cursor-pointer"
            >
              "Boda rider pickup at 4 PM?"
            </button>
          </div>
        </div>

        {/* Chat Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendChat(inputMessage);
            }}
            placeholder={`Message ${farm.owner}...`}
            className="clay-input flex-1 px-3 py-2 text-xs font-semibold text-slate-800"
          />
          <button
            onClick={() => handleSendChat(inputMessage)}
            disabled={!inputMessage.trim()}
            className="clay-btn-primary px-3.5 py-2 text-xs font-black inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
