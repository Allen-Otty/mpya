export type CategoryId = 'all' | 'beef' | 'chicken' | 'eggs' | 'vegetables' | 'milk' | 'tubers';

export type MainNavArea =
  | 'explore'
  | 'marketplace'
  | 'map'
  | 'workspace'
  | 'climate'
  | 'communication'
  | 'admin'
  | 'register';

export type ExploreCategory =
  | 'foryou'
  | 'vegetables'
  | 'fruits'
  | 'cereals'
  | 'livestock'
  | 'inputs'
  | 'stories';

export interface ExploreComment {
  id: string;
  userName: string;
  userAvatar?: string;
  text: string;
  timeAgo: string;
  likes?: number;
}

export interface ExplorePost {
  id: string;
  farmId: number;
  farmName: string;
  farmHandle: string;
  farmerName: string;
  farmerAvatar: string;
  isVerified: boolean;
  ward: string;
  category: ExploreCategory;
  productTitle: string;
  price: number;
  unit: string;
  availableQty: string;
  harvestDate: string;
  status: 'Available' | 'Limited stock' | 'Sold out';
  listingType: 'retail' | 'wholesale';
  mediaType: 'image' | 'video';
  mediaUrl: string;
  videoPoster?: string;
  caption: string;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isBookmarked?: boolean;
  comments: ExploreComment[];
  fpoAggregated?: boolean;
  fpoName?: string;
  productId?: string;
  phone?: string;
}

export interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
}

export interface FarmProduct {
  id: string;
  category: CategoryId;
  name: string;
  price: number; // KES
  unit: string;
  availableQty?: string;
  image?: string;
  farmerName?: string;
  farmId?: number;
}

export interface Farm {
  id: number;
  name: string;
  owner: string;
  area: string;
  ward: string;
  x: number;
  y: number;
  isVerified: boolean;
  rating: string;
  practices: string;
  image?: string;
  items: FarmProduct[];
}

export type RoleId = 'buyer' | 'farmer' | 'fpo' | 'officer' | 'rider' | 'cbf' | 'bulk' | 'ngo';

export interface RoleConfig {
  id: RoleId;
  emoji: string;
  title: string;
  subtitle: string;
  fields: string[];
}

export interface OrderItem {
  productName: string;
  qty: number;
  unit: string;
  price: number;
}

export interface Order {
  id: string;
  farmId: number;
  farmName: string;
  itemsSummary: string;
  totalAmount: number; // KES
  status: 'Pending' | 'Accepted' | 'Delivered' | 'Complaint filed';
  date: string;
  items: OrderItem[];
  customerName: string;
  deliveryMethod?: 'Boda Pickup' | 'Farm Pickup' | 'Direct Delivery';
}

export interface Complaint {
  id: string | number;
  farmName: string;
  buyerName: string;
  reason: string;
  details: string;
  status: 'open' | 'Refunded buyer' | 'Partial refund' | 'Dismissed';
  evidencePhoto?: string;
  date: string;
}

export interface VerificationTask {
  id: string | number;
  farmName: string;
  ward: string;
  stage: 'visit' | 'review' | 'completed' | 'rejected';
  directions?: string;
}

export interface HelpRequest {
  id: string;
  to: 'cbf' | 'officer' | 'ngo';
  from: string;
  topic: string;
  status: 'new' | 'answered';
  answer?: string;
  isMine?: boolean;
}

export interface BulkRequest {
  id: string | number;
  businessName: string;
  product: string;
  quantity: string;
  status: 'open' | 'quoted' | 'accepted';
  quoteAmount?: number;
}

export interface TrainingSession {
  id: string;
  title: string;
  schedule: string;
  attendeesCount: number;
  cbfName?: string;
}

export interface FpoStockItem {
  id: string;
  product: string;
  price: number;
  quantity: string;
  image?: string;
  contributorsCount?: number;
}

export interface FpoAggregationLot {
  id: string;
  product: string;
  targetWeight: string;
  committedWeight: string;
  memberFarms: { name: string; qty: string }[];
  bulkPricePerKg: number;
  destination: string;
  status: 'aggregating' | 'ready' | 'dispatched';
}

export interface RiderJob {
  id: string;
  pickup: string;
  dropoff: string;
  fee: number;
  status: 'New' | 'Accepted' | 'Completed';
}

export interface ChatMessage {
  sender: 'you' | 'farm';
  text: string;
  time: string;
}

export interface ClimateAlert {
  id: string;
  title: string;
  type: 'rain' | 'pest' | 'drought' | 'advisory';
  severity: 'high' | 'medium' | 'info';
  area: string;
  message: string;
  recommendedAction: string;
  date: string;
}
