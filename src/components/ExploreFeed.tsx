import React, { useState, useEffect, useRef } from 'react';
import {
  ExplorePost,
  ExploreCategory,
  ExploreComment,
  Farm,
  FarmProduct,
} from '../types';
import { EXPLORE_CATEGORIES } from '../mockData';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  Plus,
  Check,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  Send,
  PlusCircle,
  SlidersHorizontal,
  Wifi,
  WifiOff,
  Phone,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface ExploreFeedProps {
  posts: ExplorePost[];
  onLikePost: (postId: string) => void;
  onBookmarkPost: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onAddToCart: (product: FarmProduct, farm: Farm) => void;
  cartItemIds: Record<string, number>;
  onSelectFarm: (farm: Farm) => void;
  onOpenChatWithFarmer: (farmId: number, initialMessage?: string) => void;
  farms: Farm[];
  onCreatePost?: (newPost: Omit<ExplorePost, 'id' | 'likesCount' | 'commentsCount' | 'sharesCount' | 'comments'>) => void;
  onSwitchToGrid?: () => void;
  onSwitchToMap?: () => void;
}

export const ExploreFeed: React.FC<ExploreFeedProps> = ({
  posts,
  onLikePost,
  onBookmarkPost,
  onAddComment,
  onAddToCart,
  cartItemIds,
  onSelectFarm,
  onOpenChatWithFarmer,
  farms,
  onCreatePost,
  onSwitchToGrid,
  onSwitchToMap,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ExploreCategory>('foryou');
  const [listingTypeFilter, setListingTypeFilter] = useState<'all' | 'retail' | 'wholesale'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isDataSaver, setIsDataSaver] = useState(false);
  const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [expandedCaption, setExpandedCaption] = useState(false);
  const [followedHandles, setFollowedHandles] = useState<Record<string, boolean>>({});
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  // New Post Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ExploreCategory>('vegetables');
  const [newPrice, setNewPrice] = useState('80');
  const [newUnit, setNewUnit] = useState('kg');
  const [newQty, setNewQty] = useState('150 kg');
  const [newHarvestDate, setNewHarvestDate] = useState('Today, Morning cut');
  const [newCaption, setNewCaption] = useState('');
  const [newTags, setNewTags] = useState('#Organic #VihigaFresh #Harvest');
  const [newMediaType, setNewMediaType] = useState<'video' | 'image'>('video');
  const [newMediaUrl, setNewMediaUrl] = useState('https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=900&q=80');

  // Filter posts
  const filteredPosts = posts.filter((p) => {
    const matchesCategory =
      selectedCategory === 'foryou' || p.category === selectedCategory;
    const matchesListingType =
      listingTypeFilter === 'all' || p.listingType === listingTypeFilter;
    return matchesCategory && matchesListingType;
  });

  // Keep index within bounds
  useEffect(() => {
    if (currentIndex >= filteredPosts.length && filteredPosts.length > 0) {
      setCurrentIndex(0);
    }
  }, [filteredPosts.length, currentIndex]);

  const activePost = filteredPosts[currentIndex] || filteredPosts[0];

  // Keyboard navigation for vertical swiping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCommentDrawerOpen || isCreateModalOpen) return;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, filteredPosts.length, isCommentDrawerOpen, isCreateModalOpen]);

  const handleNext = () => {
    if (filteredPosts.length === 0) return;
    setCurrentIndex((prev) => (prev + 1 < filteredPosts.length ? prev + 1 : 0));
    setExpandedCaption(false);
  };

  const handlePrev = () => {
    if (filteredPosts.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredPosts.length - 1));
    setExpandedCaption(false);
  };

  const handleToggleFollow = (handle: string) => {
    setFollowedHandles((prev) => ({
      ...prev,
      [handle]: !prev[handle],
    }));
  };

  const handleShare = (post: ExplorePost) => {
    const shareText = `Check out fresh ${post.productTitle} from ${post.farmName} in Vihiga on Mavuno Kenya: KSh ${post.price}/${post.unit}! 🌾`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    
    // Copy link as fallback
    navigator.clipboard?.writeText(window.location.href);
    setShareFeedback('Link copied! Opening WhatsApp...');
    setTimeout(() => setShareFeedback(null), 2500);

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activePost) return;
    onAddComment(activePost.id, newCommentText.trim());
    setNewCommentText('');
  };

  const handleAddActiveToCart = () => {
    if (!activePost) return;
    // Find matching farm or construct proxy
    const farm = farms.find((f) => f.id === activePost.farmId) || {
      id: activePost.farmId,
      name: activePost.farmName,
      owner: activePost.farmerName,
      area: activePost.ward,
      ward: activePost.ward,
      x: 180,
      y: 150,
      isVerified: activePost.isVerified,
      rating: '4.8 (Verified)',
      practices: 'Organic & sustainable smallholder methods',
      items: [],
    };

    const product: FarmProduct = {
      id: activePost.productId || `prod-${activePost.id}`,
      category: activePost.category === 'fruits' ? 'vegetables' : (activePost.category as any),
      name: activePost.productTitle,
      price: activePost.price,
      unit: activePost.unit,
      availableQty: activePost.availableQty,
      farmerName: activePost.farmerName,
      farmId: activePost.farmId,
    };

    onAddToCart(product, farm);
  };

  const handleOpenContactFarmer = () => {
    if (!activePost) return;
    const msg = `Habari ${activePost.farmerName}! I am interested in your ${activePost.productTitle} listed on Mavuno Explore (${activePost.price} KSh / ${activePost.unit}). Is delivery available today?`;
    onOpenChatWithFarmer(activePost.farmId, msg);
  };

  const handleCreatePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCaption.trim()) return;

    if (onCreatePost) {
      onCreatePost({
        farmId: 1, // Default to Grace Achieng / logged in farmer
        farmName: 'Amani Greens Shamba',
        farmHandle: '@AmaniGreens',
        farmerName: 'Grace Achieng',
        farmerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
        isVerified: true,
        ward: 'Luanda Township',
        category: newCategory,
        productTitle: newTitle,
        price: parseFloat(newPrice) || 50,
        unit: newUnit,
        availableQty: newQty,
        harvestDate: newHarvestDate,
        status: 'Available',
        listingType: 'retail',
        mediaType: newMediaType,
        mediaUrl: newMediaUrl,
        caption: newCaption,
        tags: newTags.split(' ').filter(Boolean),
        phone: '+254722998877',
      });
    }

    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewCaption('');
  };

  return (
    <div className="space-y-4">
      {/* Top Controls: Mode Switcher & Filter Ribbon (Screenshot 419, 417, 416) */}
      <div className="clay-card p-3.5 space-y-3">
        {/* Row 1: Mode Switcher (TikTok Feed vs Grid Catalog vs Map) */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-emerald-900/5 pb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black text-slate-900 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span>Explore Feed</span>
            </span>
            <span className="clay-badge bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5">
              Live Shamba Discovery
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Retail vs Wholesale Filter Switch (Rule #4) */}
            <div className="flex items-center gap-1 bg-emerald-950/5 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setListingTypeFilter('all')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  listingTypeFilter === 'all'
                    ? 'bg-white text-emerald-900 shadow-xs font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setListingTypeFilter('retail')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  listingTypeFilter === 'retail'
                    ? 'bg-white text-emerald-900 shadow-xs font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🛒 Retail
              </button>
              <button
                onClick={() => setListingTypeFilter('wholesale')}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  listingTypeFilter === 'wholesale'
                    ? 'bg-white text-emerald-900 shadow-xs font-black'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🏪 Wholesale / FPO
              </button>
            </div>

            {/* Low Bandwidth Toggle (Rule #7) */}
            <button
              onClick={() => setIsDataSaver(!isDataSaver)}
              title="Toggle low-bandwidth data saver mode"
              className={`clay-pill px-2.5 py-1 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all ${
                isDataSaver ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {isDataSaver ? <WifiOff className="w-3.5 h-3.5 text-amber-700" /> : <Wifi className="w-3.5 h-3.5 text-emerald-700" />}
              <span className="hidden sm:inline">{isDataSaver ? 'Data Saver' : 'HD Mode'}</span>
            </button>

            {/* Create Post Button (Rule #1) */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="clay-btn-primary px-3 py-1.5 text-xs font-black inline-flex items-center gap-1 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post Produce</span>
            </button>
          </div>
        </div>

        {/* Row 2: Category Filter Ribbon (Section 3 of User Prompt) */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {EXPLORE_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentIndex(0);
                }}
                className={`clay-tab px-3 py-1.5 text-xs font-extrabold whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  isActive ? 'clay-tab-on' : ''
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main TikTok-Style Shoppable Viewport */}
      {filteredPosts.length === 0 ? (
        <div className="clay-card p-12 text-center space-y-3">
          <div className="text-3xl">🌾</div>
          <h3 className="text-base font-black text-slate-800">No Produce Posts in this Category</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try switching categories or toggle between Retail and Wholesale listings above.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('foryou');
              setListingTypeFilter('all');
            }}
            className="clay-btn-secondary px-4 py-2 text-xs font-black"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="relative max-w-md mx-auto">
          {/* Vertical Navigation Pill Overlays for Desktop */}
          <div className="hidden md:flex absolute -right-14 top-1/2 -translate-y-1/2 flex-col gap-2 z-20">
            <button
              onClick={handlePrev}
              title="Previous Shamba Post (Up Arrow)"
              className="w-10 h-10 rounded-2xl bg-white shadow-lg border border-emerald-900/10 flex items-center justify-center text-slate-700 hover:text-emerald-800 hover:scale-110 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <div className="w-10 py-1.5 bg-slate-900 text-white rounded-xl text-center text-[10px] font-black shadow-md">
              {currentIndex + 1}/{filteredPosts.length}
            </div>
            <button
              onClick={handleNext}
              title="Next Shamba Post (Down Arrow)"
              className="w-10 h-10 rounded-2xl bg-white shadow-lg border border-emerald-900/10 flex items-center justify-center text-slate-700 hover:text-emerald-800 hover:scale-110 active:scale-95 transition-all cursor-pointer"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Shoppable Post Container (Phone Aspect Ratio) */}
          <div className="relative rounded-[32px] overflow-hidden bg-slate-950 shadow-2xl border-4 border-slate-800 text-white min-h-[620px] sm:min-h-[660px] flex flex-col justify-between select-none">
            {/* Visual Media Background (Video simulation / high quality photo) */}
            <div className="absolute inset-0 z-0">
              <img
                src={activePost.mediaUrl}
                alt={activePost.productTitle}
                className="w-full h-full object-cover"
                loading="eager"
              />
              {/* Cinematic Vignette Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/60 pointer-events-none" />
              {/* Subtle top video progress bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-10">
                <div
                  className="h-full bg-emerald-400 transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / filteredPosts.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Top Overlay: Creator / Farmer Badge & Sound Toggle */}
            <div className="relative z-10 p-4 pt-5 flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={activePost.farmerAvatar}
                  alt={activePost.farmerName}
                  className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover cursor-pointer"
                  onClick={() => {
                    const farm = farms.find((f) => f.id === activePost.farmId);
                    if (farm) onSelectFarm(farm);
                  }}
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-sm text-white drop-shadow-md">
                      {activePost.farmHandle}
                    </span>
                    {activePost.isVerified && (
                      <span className="bg-emerald-500 text-white p-0.5 rounded-full" title="Verified Producer">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-200 drop-shadow-xs">
                    <MapPin className="w-3 h-3" />
                    <span>{activePost.ward}</span>
                    <span>·</span>
                    <span>Harvested: {activePost.harvestDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {activePost.fpoAggregated && (
                  <span className="clay-badge bg-emerald-900/90 text-emerald-100 border border-emerald-400/30 text-[10px] font-black px-2 py-0.5 backdrop-blur-xs">
                    🤝 FPO Lot
                  </span>
                )}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white transition-all cursor-pointer"
                  title={isMuted ? 'Unmute Ambient Sound' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>
              </div>
            </div>

            {/* Middle Touch Area (Double Tap for Like, Swipe Hints) */}
            <div
              className="relative z-10 flex-1 cursor-pointer flex items-center justify-center"
              onDoubleClick={() => onLikePost(activePost.id)}
            >
              {/* Optional ambient indicator */}
              {!isMuted && (
                <div className="absolute top-2 right-4 flex items-center gap-0.5">
                  <span className="w-1 h-3 bg-emerald-400 animate-pulse rounded-full" />
                  <span className="w-1 h-5 bg-emerald-400 animate-pulse delay-75 rounded-full" />
                  <span className="w-1 h-2 bg-emerald-400 animate-pulse delay-150 rounded-full" />
                </div>
              )}
            </div>

            {/* Right Action Rail (TikTok / Reels Style matching Screenshots) */}
            <div className="absolute right-3.5 bottom-32 z-20 flex flex-col items-center gap-4 text-white">
              {/* Follow Button on Avatar */}
              <div className="relative mb-1">
                <button
                  onClick={() => handleToggleFollow(activePost.farmHandle)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-lg transition-transform hover:scale-110 cursor-pointer ${
                    followedHandles[activePost.farmHandle]
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-500 text-white hover:bg-emerald-600'
                  }`}
                  title={followedHandles[activePost.farmHandle] ? 'Following' : 'Follow Farmer'}
                >
                  {followedHandles[activePost.farmHandle] ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Like Button */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => onLikePost(activePost.id)}
                  className={`w-11 h-11 rounded-full backdrop-blur-md flex items-center justify-center transition-transform hover:scale-110 active:scale-90 cursor-pointer ${
                    activePost.isLiked
                      ? 'bg-red-500/90 text-white shadow-lg'
                      : 'bg-black/40 text-white/90 hover:text-white'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${activePost.isLiked ? 'fill-current text-white' : ''}`} />
                </button>
                <span className="text-[11px] font-black mt-1 drop-shadow-md">
                  {activePost.likesCount + (activePost.isLiked ? 1 : 0)}
                </span>
              </div>

              {/* Comment Bubble */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setIsCommentDrawerOpen(true)}
                  className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white hover:scale-110 active:scale-90 transition-transform cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
                <span className="text-[11px] font-black mt-1 drop-shadow-md">
                  {activePost.comments.length}
                </span>
              </div>

              {/* Quick Add To Cart / Buy */}
              <div className="flex flex-col items-center">
                <button
                  onClick={handleAddActiveToCart}
                  className="w-11 h-11 rounded-full bg-emerald-600 text-white shadow-xl flex items-center justify-center hover:bg-emerald-500 hover:scale-110 active:scale-90 transition-transform cursor-pointer relative"
                  title="Add to order"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartItemIds[activePost.productId || `prod-${activePost.id}`] ? (
                    <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                      {cartItemIds[activePost.productId || `prod-${activePost.id}`]}
                    </span>
                  ) : null}
                </button>
                <span className="text-[10px] font-black mt-1 text-emerald-300 drop-shadow-md">
                  Order
                </span>
              </div>

              {/* Share */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleShare(activePost)}
                  className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/90 hover:text-white hover:scale-110 active:scale-90 transition-transform cursor-pointer"
                  title="Share to WhatsApp"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <span className="text-[11px] font-black mt-1 drop-shadow-md">
                  {activePost.sharesCount}
                </span>
              </div>

              {/* Bookmark */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => onBookmarkPost(activePost.id)}
                  className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                    activePost.isBookmarked ? 'bg-amber-500 text-slate-950' : 'bg-black/30 text-white/80'
                  }`}
                  title="Save for later"
                >
                  <Bookmark className={`w-4 h-4 ${activePost.isBookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Bottom Overlay: Shoppable Product Basin & CTAs (Screenshot 419, 418, 417) */}
            <div className="relative z-10 p-4 space-y-3 bg-gradient-to-t from-black via-black/80 to-transparent pt-6">
              {/* Product Price & Availability Badge */}
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-base font-black text-white tracking-tight drop-shadow-md">
                      {activePost.productTitle}
                    </h2>
                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-xs">
                      <span className="text-emerald-300 font-black text-sm drop-shadow-xs">
                        KSh {activePost.price} <span className="text-xs font-semibold text-white/80">/ {activePost.unit}</span>
                      </span>
                      <span className="text-white/40">·</span>
                      <span className="text-white/90 font-bold">
                        {activePost.availableQty} available
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 shadow-xs ${
                      activePost.status === 'Available'
                        ? 'bg-emerald-500 text-white'
                        : activePost.status === 'Limited stock'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-red-500 text-white'
                    }`}
                  >
                    ● {activePost.status}
                  </span>
                </div>

                {/* Caption text */}
                <p className="text-xs text-white/90 font-medium leading-relaxed drop-shadow-xs">
                  {expandedCaption
                    ? activePost.caption
                    : activePost.caption.slice(0, 110) + (activePost.caption.length > 110 ? '...' : '')}
                  {activePost.caption.length > 110 && (
                    <button
                      onClick={() => setExpandedCaption(!expandedCaption)}
                      className="text-emerald-300 font-extrabold ml-1 hover:underline cursor-pointer"
                    >
                      {expandedCaption ? 'less' : 'more'}
                    </button>
                  )}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {activePost.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] font-bold text-emerald-300/90">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Contact Farmer & View / Order (Direct from User Prompt) */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={handleOpenContactFarmer}
                  className="bg-white/15 hover:bg-white/25 active:scale-95 text-white font-extrabold py-2.5 px-3 rounded-2xl border border-white/20 backdrop-blur-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-300" />
                  <span>Contact Farmer</span>
                </button>

                <button
                  onClick={handleAddActiveToCart}
                  className="bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black py-2.5 px-3 rounded-2xl shadow-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-slate-950" />
                  <span>Order · KES {activePost.price}</span>
                </button>
              </div>

              {/* Swipe down / Up hint */}
              <div
                onClick={handleNext}
                className="pt-1 flex items-center justify-center gap-1 text-[11px] font-extrabold text-white/60 hover:text-white cursor-pointer transition-colors"
              >
                <span>Discover more from Vihiga</span>
                <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
              </div>
            </div>
          </div>

          {/* Share toast feedback */}
          {shareFeedback && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 bg-emerald-900 text-white px-4 py-2 rounded-2xl text-xs font-black shadow-2xl border border-emerald-400/40 animate-fade-in">
              {shareFeedback}
            </div>
          )}
        </div>
      )}

      {/* Slide-Up Comments Drawer */}
      {isCommentDrawerOpen && activePost && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="bg-white text-slate-900 w-full max-w-md rounded-t-[32px] sm:rounded-[32px] p-5 space-y-4 shadow-2xl max-h-[80vh] flex flex-col border border-emerald-900/10">
            <div className="flex items-center justify-between border-b border-emerald-900/10 pb-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-black text-slate-900">
                  Comments & Inquiries ({activePost.comments.length})
                </h3>
              </div>
              <button
                onClick={() => setIsCommentDrawerOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {activePost.comments.length === 0 ? (
                <div className="text-center py-8 text-slate-400 font-semibold">
                  No comments yet. Ask the farmer about harvest, volume, or delivery!
                </div>
              ) : (
                activePost.comments.map((c) => (
                  <div key={c.id} className="clay-inset-well p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900">{c.userName}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{c.timeAgo}</span>
                    </div>
                    <p className="text-slate-700 font-medium">{c.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Comment Input */}
            <form onSubmit={handleCommentSubmit} className="pt-2 border-t border-emerald-900/10 flex gap-2">
              <input
                type="text"
                placeholder="Ask about quantity, delivery, or quality..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="clay-input flex-1 p-2.5 text-xs font-semibold text-slate-800"
              />
              <button
                type="submit"
                className="clay-btn-primary px-4 py-2.5 text-xs font-black inline-flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create New Post Modal (Farmer Tool - Rule #1) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white text-slate-900 w-full max-w-md rounded-[32px] p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto border border-emerald-900/10">
            <div className="flex items-center justify-between border-b border-emerald-900/10 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Publish Produce to Explore Feed
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Showcase your shamba harvest directly to local buyers in Vihiga.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePostSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Produce Name</label>
                <input
                  type="text"
                  placeholder="e.g. Fresh Hass Avocados, Crisp Sukuma Wiki"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="clay-input w-full p-2.5 font-semibold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="clay-input w-full p-2 font-semibold text-slate-800"
                  >
                    <option value="vegetables">🥬 Vegetables</option>
                    <option value="fruits">🥑 Fruits</option>
                    <option value="cereals">🌽 Cereals</option>
                    <option value="livestock">🍗 Livestock</option>
                    <option value="inputs">🌱 Inputs & Seeds</option>
                    <option value="stories">📖 Farm Stories</option>
                  </select>
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Price (KES)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    required
                    className="clay-input w-full p-2 font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Unit</label>
                  <input
                    type="text"
                    placeholder="kg, bunch, tray"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="clay-input w-full p-2 font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-slate-700 block mb-1">Available Quantity</label>
                  <input
                    type="text"
                    placeholder="e.g. 500 kg, 30 trays"
                    value={newQty}
                    onChange={(e) => setNewQty(e.target.value)}
                    className="clay-input w-full p-2 font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Harvest Time</label>
                <input
                  type="text"
                  placeholder="e.g. Today 06:00 AM, Yesterday"
                  value={newHarvestDate}
                  onChange={(e) => setNewHarvestDate(e.target.value)}
                  className="clay-input w-full p-2 font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Farmer Caption / Story</label>
                <textarea
                  rows={3}
                  placeholder="Describe your harvest, compost practices, taste, and delivery options..."
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  required
                  className="clay-input w-full p-2.5 font-semibold text-slate-800"
                />
              </div>

              <div>
                <label className="font-extrabold text-slate-700 block mb-1">Tags</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="clay-input w-full p-2 font-semibold text-slate-800"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="clay-btn-secondary flex-1 py-2.5 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="clay-btn-primary flex-1 py-2.5 text-xs font-black cursor-pointer"
                >
                  Publish to Feed 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
