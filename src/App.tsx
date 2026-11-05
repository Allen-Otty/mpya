import React, { useState, useEffect } from 'react';
import {
  CategoryId,
  Farm,
  FarmProduct,
  Order,
  Complaint,
  VerificationTask,
  HelpRequest,
  BulkRequest,
  TrainingSession,
  FpoStockItem,
  RiderJob,
  RoleId,
  ChatMessage,
  MainNavArea,
  ClimateAlert,
  ExplorePost,
} from './types';
import {
  INITIAL_FARMS,
  INITIAL_CLIMATE_ALERTS,
  ROLES,
  INITIAL_EXPLORE_POSTS,
} from './mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ExploreFeed } from './components/ExploreFeed';
import { MarketplaceView } from './components/MarketplaceView';
import { ExploreMap } from './components/ExploreMap';
import { FarmDetailModal } from './components/FarmDetailModal';
import { AccountView } from './components/AccountView';
import { ClimateAdvisory } from './components/ClimateAdvisory';
import { RegistrationWizard } from './components/RegistrationWizard';
import { AdviceModal } from './components/AdviceModal';
import {
  ShoppingBag,
  X,
  CheckCircle,
  Truck,
  MessageSquare,
  ShieldCheck,
  Send,
} from 'lucide-react';

export default function App() {
  const [currentArea, setCurrentArea] = useState<MainNavArea>('explore');
  const [currentRole, setCurrentRole] = useState<RoleId | null>('farmer');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdviceOpen, setIsAdviceOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Explore TikTok-style shoppable feed state
  const [explorePosts, setExplorePosts] = useState<ExplorePost[]>(() => {
    const saved = localStorage.getItem('mavuno_explore_posts_v4');
    return saved ? JSON.parse(saved) : INITIAL_EXPLORE_POSTS;
  });

  // Selected farm for deep inspection
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);

  // Cart state
  const [cartItems, setCartItems] = useState<{ product: FarmProduct; farm: Farm; qty: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutDone, setCheckoutDone] = useState(false);

  // Persistent / stateful entities
  const [farms, setFarms] = useState<Farm[]>(() => {
    const saved = localStorage.getItem('mavuno_farms_v2');
    return saved ? JSON.parse(saved) : INITIAL_FARMS;
  });

  const [unlockedFarmIds, setUnlockedFarmIds] = useState<Record<number, boolean>>(() => {
    const saved = localStorage.getItem('mavuno_unlocked_farms');
    return saved ? JSON.parse(saved) : { 1: false };
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('mavuno_orders_v2');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'ORD-1042',
            farmId: 1,
            farmName: 'Amani Greens Shamba',
            itemsSummary: 'Kales (Sukuma Wiki) ×3, Fresh Salad Tomatoes ×2',
            totalAmount: 360,
            status: 'Delivered',
            date: 'Yesterday',
            items: [
              { productName: 'Kales (Sukuma Wiki)', qty: 3, unit: 'bunch', price: 40 },
              { productName: 'Fresh Salad Tomatoes', qty: 2, unit: 'kg', price: 120 },
            ],
            customerName: 'Wanjiru T.',
            deliveryMethod: 'Direct Delivery',
          },
        ];
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem('mavuno_complaints');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            farmName: 'Shamba Fresh Cooperative',
            buyerName: 'Wanjiru T.',
            reason: 'Poor quality / bruised produce',
            details: 'Tomatoes arrived soft and crushed in the transit bag. Photos uploaded for officer review.',
            status: 'open',
            date: 'Yesterday',
          },
        ];
  });

  const [verificationQueue, setVerificationQueue] = useState<VerificationTask[]>(() => {
    const saved = localStorage.getItem('mavuno_verif_queue');
    return saved
      ? JSON.parse(saved)
      : [
          { id: 2, farmName: 'Kilima Poultry Project', ward: 'Kima', stage: 'review' },
          { id: 6, farmName: 'Neema Organic Shamba', ward: 'Luanda South', stage: 'visit' },
        ];
  });

  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>(() => {
    const saved = localStorage.getItem('mavuno_help_requests');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'h1',
            to: 'cbf',
            from: 'Peter M. (Kilima Poultry)',
            topic: 'Indigenous chickens have mild coughing. Recommended herbal or vaccination protocol?',
            status: 'new',
          },
        ];
  });

  const [bulkRequests, setBulkRequests] = useState<BulkRequest[]>(() => {
    const saved = localStorage.getItem('mavuno_bulk_requests');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            businessName: 'Luanda Central Supermarket',
            product: 'Salad Tomatoes (Grade 1)',
            quantity: '300 kg weekly',
            status: 'open',
          },
        ];
  });

  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>(() => {
    const saved = localStorage.getItem('mavuno_trainings');
    return saved
      ? JSON.parse(saved)
      : [
          { id: 't1', title: 'Bio-pesticides & Safe Neem Extraction', schedule: 'Saturday · Luanda Social Hall', attendeesCount: 18 },
          { id: 't2', title: 'Organic Composting & Vermiculture', schedule: 'Next Wednesday · Kima Baraza', attendeesCount: 12 },
        ];
  });

  const [fpoStock, setFpoStock] = useState<FpoStockItem[]>(() => {
    const saved = localStorage.getItem('mavuno_fpo_stock');
    return saved
      ? JSON.parse(saved)
      : [
          { id: 'fs1', product: 'Salad Tomatoes (Bulk Crates)', price: 100, quantity: '650 kg aggregated' },
          { id: 'fs2', product: 'Fresh Kienyeji Eggs (Trays)', price: 400, quantity: '80 trays available' },
        ];
  });

  const [riderJobs, setRiderJobs] = useState<RiderJob[]>(() => {
    const saved = localStorage.getItem('mavuno_rider_jobs');
    return saved
      ? JSON.parse(saved)
      : [
          { id: 'rj1', pickup: 'Amani Greens (Luanda)', dropoff: 'Luanda Posta Market', fee: 100, status: 'New' },
          { id: 'rj2', pickup: 'Kilima Poultry (Kima)', dropoff: 'Chavakali High School Junction', fee: 180, status: 'Accepted' },
        ];
  });

  const [partnerNotices, setPartnerNotices] = useState<string[]>(() => {
    const saved = localStorage.getItem('mavuno_notices');
    return saved
      ? JSON.parse(saved)
      : ['Heavy rains anticipated in Maragoli hills. Ensure drainage around poultry houses and sweet potato beds.'];
  });

  const [climateAlerts] = useState<ClimateAlert[]>(INITIAL_CLIMATE_ALERTS);

  const [chatHistories, setChatHistories] = useState<Record<number, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('mavuno_chats');
    return saved ? JSON.parse(saved) : {};
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('mavuno_farms_v2', JSON.stringify(farms));
  }, [farms]);

  useEffect(() => {
    localStorage.setItem('mavuno_unlocked_farms', JSON.stringify(unlockedFarmIds));
  }, [unlockedFarmIds]);

  useEffect(() => {
    localStorage.setItem('mavuno_orders_v2', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('mavuno_chats', JSON.stringify(chatHistories));
  }, [chatHistories]);

  useEffect(() => {
    localStorage.setItem('mavuno_explore_posts_v4', JSON.stringify(explorePosts));
  }, [explorePosts]);

  // Feed interactions
  const handleLikePost = (postId: string) => {
    setExplorePosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked;
          return {
            ...p,
            isLiked: nextLiked,
            likesCount: p.likesCount + (nextLiked ? 1 : -1),
          };
        }
        return p;
      })
    );
  };

  const handleBookmarkPost = (postId: string) => {
    setExplorePosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, isBookmarked: !p.isBookmarked } : p))
    );
  };

  const handleAddComment = (postId: string, commentText: string) => {
    setExplorePosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const newC = {
            id: `c-${Date.now()}`,
            userName: 'You (Marketplace Buyer)',
            text: commentText,
            timeAgo: 'Just now',
          };
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [newC, ...p.comments],
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = (
    newPostData: Omit<ExplorePost, 'id' | 'likesCount' | 'commentsCount' | 'sharesCount' | 'comments'>
  ) => {
    const newPost: ExplorePost = {
      ...newPostData,
      id: `post-${Date.now()}`,
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      comments: [],
      isLiked: true,
    };
    setExplorePosts((prev) => [newPost, ...prev]);
    setCurrentArea('explore');
  };

  // Cart operations
  const handleAddToCart = (product: FarmProduct, farm: Farm) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) => (i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { product, farm, qty: 1 }];
    });
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) => (i.product.id === productId ? { ...i, qty: Math.max(0, i.qty + delta) } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const totalCartAmount = cartItems.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const cartItemIdsMap: Record<string, number> = {};
  cartItems.forEach((item) => {
    cartItemIdsMap[item.product.id] = item.qty;
  });

  // Order Placement Handler (with Rule #3 auto-stock reflection)
  const handleOrderPlaced = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setUnlockedFarmIds((prev) => ({ ...prev, [order.farmId]: true }));

    // Rule #3: Feed automatically reflects updated availability when stock is ordered
    setExplorePosts((prev) =>
      prev.map((p) => {
        if (p.farmId === order.farmId) {
          const currentQtyNum = parseInt(p.availableQty) || 50;
          const updatedQty = Math.max(5, currentQtyNum - 15);
          return {
            ...p,
            status: updatedQty < 30 ? 'Limited stock' : 'Available',
            availableQty: `${updatedQty} ${p.unit} remaining`,
          };
        }
        return p;
      })
    );
  };

  // Cart Checkout
  const handleCartCheckout = () => {
    if (cartItems.length === 0) return;
    const primaryFarm = cartItems[0].farm;
    const summary = cartItems.map((i) => `${i.product.name} ×${i.qty}`).join(', ');

    const newOrder: Order = {
      id: `ORD-${Date.now().toString().slice(-4)}`,
      farmId: primaryFarm.id,
      farmName: primaryFarm.name,
      itemsSummary: summary,
      totalAmount: totalCartAmount,
      status: 'Accepted',
      date: 'Just now',
      items: cartItems.map((i) => ({
        productName: i.product.name,
        qty: i.qty,
        unit: i.product.unit,
        price: i.product.price,
      })),
      customerName: 'You (Marketplace Buyer)',
      deliveryMethod: 'Direct Delivery',
    };

    handleOrderPlaced(newOrder);
    setCartItems([]);
    setCheckoutDone(true);
  };

  // Farmer / Farm Update
  const handleUpdateFarm = (updated: Farm) => {
    setFarms((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
    if (selectedFarm?.id === updated.id) {
      setSelectedFarm(updated);
    }
  };

  // Verification stage update
  const handleUpdateVerificationStage = (id: string | number, stage: VerificationTask['stage']) => {
    setVerificationQueue((prev) => prev.filter((item) => item.id !== id));
    if (stage === 'completed') {
      setFarms((prev) =>
        prev.map((f) => (f.id === Number(id) ? { ...f, isVerified: true } : f))
      );
    }
  };

  // Chat message sending
  const handleSendMessage = (farmId: number, message: string) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = { sender: 'you', text: message, time: now };

    setChatHistories((prev) => {
      const thread = prev[farmId] || [];
      return { ...prev, [farmId]: [...thread, userMsg] };
    });

    setTimeout(() => {
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const farmReplies = [
        'Karibu sana! Yes, our morning harvest is packed and ready for pickup or boda dropoff.',
        'Sawa kabisa. Pay on delivery via M-Pesa is perfectly fine with us.',
        'Asante! We have verified your request. Our local boda rider is on standby.',
      ];
      const randomReply = farmReplies[Math.floor(Math.random() * farmReplies.length)];
      const farmMsg: ChatMessage = { sender: 'farm', text: randomReply, time: replyTime };

      setChatHistories((prev) => {
        const thread = prev[farmId] || [];
        return { ...prev, [farmId]: [...thread, farmMsg] };
      });
    }, 700);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col lg:flex-row antialiased">
      {/* 3-Part Shell: Left Sidebar (Screenshot 414 & 399) */}
      <Sidebar
        currentArea={currentArea}
        onSelectArea={(area) => {
          setCurrentArea(area);
          if (area !== 'map') setSelectedFarm(null);
        }}
        currentRole={currentRole}
        onSelectRole={(r) => {
          setCurrentRole(r);
          setCurrentArea('workspace');
        }}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onOpenAdvice={() => setIsAdviceOpen(true)}
        cartCount={totalCartCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          currentRole={currentRole}
          onSelectRole={(r) => {
            setCurrentRole(r);
            setCurrentArea('workspace');
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          cartCount={totalCartCount}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* Demo Notification Banner */}
        <div className="max-w-4xl mx-auto w-full px-4 pt-3">
          <div className="clay-demo-banner px-4 py-2.5 flex items-center justify-between text-xs font-bold gap-3">
            <div className="flex items-center gap-2">
              <span>🌾</span>
              <span>
                <b>Mavuno Kenya:</b> Direct farm-to-plate network in Vihiga. Zero middleman markup.
              </span>
            </div>
            <button
              onClick={() => setIsAdviceOpen(true)}
              className="text-amber-800 hover:text-amber-950 underline font-extrabold cursor-pointer shrink-0"
            >
              Strategy Blueprint →
            </button>
          </div>
        </div>

        {/* Main Workspaces */}
        <main className="max-w-4xl mx-auto w-full px-4 py-5 flex-1">
          {/* 0. Explore Feed (TikTok-Style Shoppable Agricultural Marketplace Feed) */}
          {currentArea === 'explore' && (
            <ExploreFeed
              posts={explorePosts}
              onLikePost={handleLikePost}
              onBookmarkPost={handleBookmarkPost}
              onAddComment={handleAddComment}
              onAddToCart={handleAddToCart}
              cartItemIds={cartItemIdsMap}
              onSelectFarm={(farm) => {
                setSelectedFarm(farm);
                setCurrentArea('map');
              }}
              onOpenChatWithFarmer={(farmId, initialMessage) => {
                const farm = farms.find((f) => f.id === farmId);
                if (farm) {
                  setSelectedFarm(farm);
                  setCurrentArea('map');
                  if (initialMessage) {
                    handleSendMessage(farmId, initialMessage);
                  }
                }
              }}
              farms={farms}
              onCreatePost={handleCreatePost}
              onSwitchToGrid={() => setCurrentArea('marketplace')}
              onSwitchToMap={() => setCurrentArea('map')}
            />
          )}

          {/* 1. Marketplace Area (Screenshot 403) */}
          {currentArea === 'marketplace' && (
            <MarketplaceView
              farms={farms}
              onSelectFarm={(farm) => {
                setSelectedFarm(farm);
                setCurrentArea('map');
              }}
              onAddToCart={handleAddToCart}
              cartItemIds={cartItemIdsMap}
              onSwitchToFeed={() => setCurrentArea('explore')}
            />
          )}

          {/* 2. Maps & Discovery Area (Screenshot 402 & 401) */}
          {currentArea === 'map' && (
            selectedFarm ? (
              <FarmDetailModal
                farm={selectedFarm}
                onBack={() => setSelectedFarm(null)}
                onOrderPlaced={handleOrderPlaced}
                isUnlocked={!!unlockedFarmIds[selectedFarm.id]}
                chatHistory={chatHistories[selectedFarm.id] || []}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <ExploreMap
                farms={farms}
                selectedCategory="all"
                onSelectCategory={() => {}}
                onSelectFarm={(farm) => setSelectedFarm(farm)}
                unlockedFarmIds={unlockedFarmIds}
                onSwitchToFeed={() => setCurrentArea('explore')}
              />
            )
          )}

          {/* 3. My Workspace / Role Portals (Screenshot 414, 413, 411, 409, 407, 406) */}
          {currentArea === 'workspace' && (
            <AccountView
              currentRole={currentRole}
              onSelectRole={setCurrentRole}
              orders={orders}
              complaints={complaints}
              onAddComplaint={(c) => setComplaints((prev) => [c, ...prev])}
              onUpdateComplaintStatus={(id, status) =>
                setComplaints((prev) =>
                  prev.map((c) => (c.id === id ? { ...c, status } : c))
                )
              }
              farms={farms}
              onUpdateFarm={handleUpdateFarm}
              verificationQueue={verificationQueue}
              onUpdateVerificationStage={handleUpdateVerificationStage}
              helpRequests={helpRequests}
              onAddHelpRequest={(r) => setHelpRequests((prev) => [r, ...prev])}
              onAnswerHelpRequest={(id, ans) =>
                setHelpRequests((prev) =>
                  prev.map((r) => (r.id === id ? { ...r, status: 'answered', answer: ans } : r))
                )
              }
              bulkRequests={bulkRequests}
              onAddBulkRequest={(b) => setBulkRequests((prev) => [b, ...prev])}
              onQuoteBulkRequest={(id, quoteAmt) =>
                setBulkRequests((prev) =>
                  prev.map((r) =>
                    r.id === id ? { ...r, status: 'quoted', quoteAmount: quoteAmt } : r
                  )
                )
              }
              trainingSessions={trainingSessions}
              onAddTrainingSession={(s) => setTrainingSessions((prev) => [s, ...prev])}
              fpoStock={fpoStock}
              onAddFpoStock={(s) => setFpoStock((prev) => [s, ...prev])}
              riderJobs={riderJobs}
              onUpdateRiderJob={(id, status) =>
                setRiderJobs((prev) =>
                  prev.map((j) => (j.id === id ? { ...j, status } : j))
                )
              }
              partnerNotices={partnerNotices}
              onAddPartnerNotice={(n) => setPartnerNotices((prev) => [n, ...prev])}
              onOpenCreatePost={() => setCurrentArea('explore')}
            />
          )}

          {/* 4. Climate & Advisory Area (Screenshot 399 & 412) */}
          {currentArea === 'climate' && (
            <ClimateAdvisory
              alerts={climateAlerts}
              trainingSessions={trainingSessions}
              onAskAgronomist={() => {
                setCurrentRole('farmer');
                setCurrentArea('workspace');
              }}
            />
          )}

          {/* 5. Communication Area */}
          {currentArea === 'communication' && (
            <div className="space-y-4">
              <div className="clay-card p-5 space-y-3">
                <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-700" />
                  <span>Direct Communication & WhatsApp Hub</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Connect directly between households, rural shambas, and Boda couriers. All orders dispatch instant SMS & WhatsApp notifications.
                </p>
              </div>

              <div className="clay-card p-5 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Active Direct Messages
                </h3>
                <div className="space-y-2.5 text-xs">
                  {Object.entries(chatHistories).map(([fId, messages]) => {
                    const farm = farms.find((f) => f.id === Number(fId));
                    const lastMsg = messages[messages.length - 1];
                    return (
                      <div
                        key={fId}
                        onClick={() => {
                          if (farm) {
                            setSelectedFarm(farm);
                            setCurrentArea('map');
                          }
                        }}
                        className="clay-inset-well p-3.5 flex items-center justify-between cursor-pointer hover:border-emerald-300"
                      >
                        <div>
                          <div className="font-extrabold text-slate-900">{farm?.name || `Shamba #${fId}`}</div>
                          <div className="text-slate-500 text-[11px] truncate max-w-xs mt-0.5">
                            {lastMsg ? `${lastMsg.sender === 'you' ? 'You' : farm?.owner}: ${lastMsg.text}` : 'No messages yet'}
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700">Open Chat →</span>
                      </div>
                    );
                  })}
                  {Object.keys(chatHistories).length === 0 && (
                    <div className="clay-inset-well p-4 text-center text-slate-400 font-semibold">
                      No active chats yet. Open a shamba on the map or marketplace to message a farmer directly.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 6. Administration Area (Screenshot 409 & 408) */}
          {currentArea === 'admin' && (
            <div className="space-y-4">
              <div className="clay-card p-5 space-y-2">
                <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Mavuno Administrative & Audit Console</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Audits, verification queues, and dispute arbitrations overseen by the County Agricultural Office.
                </p>
              </div>

              {/* Quick switch to officer role */}
              <div className="clay-card p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    County Agricultural Officer Desk
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Review {verificationQueue.length} pending farm verifications and {complaints.length} complaints.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setCurrentRole('officer');
                    setCurrentArea('workspace');
                  }}
                  className="clay-btn-primary px-4 py-2 text-xs font-black cursor-pointer"
                >
                  Open Officer Desk →
                </button>
              </div>
            </div>
          )}

          {/* 7. Registration Wizard (Screenshot 405 & 404) */}
          {currentArea === 'register' && (
            <RegistrationWizard
              onComplete={(role, name, ward) => {
                setCurrentRole(role);
                setCurrentArea('workspace');
                alert(`Welcome ${name} to Mavuno! Your ${role} portal is initialized.`);
              }}
              onCancel={() => setCurrentArea('marketplace')}
            />
          )}
        </main>

        {/* Global Footer */}
        <footer className="max-w-4xl mx-auto w-full px-4 pt-6 pb-12 text-center text-xs font-bold text-slate-400">
          <p className="text-slate-500 font-semibold">
            MAVUNO · Farm to Plate Kenya · Direct fair trade connecting farmers, FPOs, and households with zero middleman markup.
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Vihiga County Pilot · Built for East African Smallholders
          </p>
        </footer>
      </div>

      {/* Shopping Cart Drawer / Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="clay-card-white w-full max-w-md p-5 space-y-4 relative border border-emerald-900/10 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-emerald-700" />
                <span>Harvest Shopping Cart ({totalCartCount})</span>
              </h3>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setCheckoutDone(false);
                }}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {checkoutDone ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl clay-badge">
                  ✓
                </div>
                <h4 className="text-base font-black text-slate-900">Order Confirmed!</h4>
                <p className="text-xs text-slate-500 font-semibold max-w-xs mx-auto">
                  Farmer notified via WhatsApp alert. Pay on delivery when your harvest arrives!
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCheckoutDone(false);
                    setCurrentArea('workspace');
                    setCurrentRole('buyer');
                  }}
                  className="clay-btn-primary px-4 py-2 text-xs font-black cursor-pointer"
                >
                  View in My Orders →
                </button>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 font-bold">
                Your cart is empty. Add fresh produce from the Marketplace!
              </div>
            ) : (
              <>
                <div className="divide-y divide-emerald-900/5 max-h-56 overflow-y-auto pr-1">
                  {cartItems.map(({ product, farm, qty }) => (
                    <div key={product.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-extrabold text-slate-900">{product.name}</div>
                        <div className="text-[11px] text-slate-500">
                          {farm.name} · <b className="text-emerald-700">KES {product.price}</b>/{product.unit}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateCartQty(product.id, -1)}
                          className="clay-qty-btn text-slate-700"
                        >
                          -
                        </button>
                        <span className="w-5 text-center font-black text-slate-900">
                          {qty}
                        </span>
                        <button
                          onClick={() => handleUpdateCartQty(product.id, 1)}
                          className="clay-qty-btn text-emerald-800"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-emerald-900/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-black">
                    <span className="text-slate-600">Total Harvest Cost:</span>
                    <span className="text-emerald-800 text-base">KES {totalCartAmount.toLocaleString()}</span>
                  </div>

                  <button
                    onClick={handleCartCheckout}
                    className="clay-btn-primary w-full py-3 text-xs font-black cursor-pointer"
                  >
                    Place Order · KES {totalCartAmount.toLocaleString()} (Pay on Delivery)
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Strategic Advice Modal */}
      <AdviceModal isOpen={isAdviceOpen} onClose={() => setIsAdviceOpen(false)} />
    </div>
  );
}
