export interface EventDetails {
  time: string;
  fee: string;
  route: string;
  routes?: Record<string, string>;
  slotsLeft?: number;
  schedule: string[];
  perks: string[];
}

export interface EventResult {
  bib: string;
  name: string;
  rank: number;
  category: string;
  finishTime: string;
  pace: string;
}

export interface EventItem {
  id: string;
  title: string;
  badge: 'CLOSING SOON' | 'OPEN' | 'SOLD OUT' | 'PAST EVENT';
  distances: string[];
  date: string;
  deadline: string;
  location: string;
  description: string;
  highlights?: string[];
  details: EventDetails;
  results?: EventResult[];
  iconType: 'compass' | 'mountain' | 'drop';
  image: string;
  kitImage?: string;
  routeMapImage?: string;
  galleryImages?: string[];
  
  // Settings properties
  inclusions?: string[];
  jerseyFee?: number;
  earlyBirdDeadline?: string;
  earlyBirdDiscountPercent?: number;
  distanceFees?: Record<string, number>;
}

export interface CommunityPost {
  id: string;
  username: string;
  userAvatar: string;
  image: string;
  caption: string;
  likes: number;
  commentsCount: number;
  comments: { user: string; text: string }[];
  date: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'Race Kits' | 'Jerseys' | 'Merchandise' | 'Accessories';
  price: number;
  image: string;
  description: string;
  colors: string[];
  sizes: string[];
  specs?: string[];
}

export interface Article {
  id: string;
  title: string;
  category: 'Event Updates' | 'Registration' | 'Sponsors' | 'Route Changes' | 'Community' | 'General Announcements';
  date: string;
  author: string;
  authorAvatar: string;
  summary: string;
  content: string[];
  image: string;
  readTime: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Race Day' | 'Expo' | 'Behind the Scenes' | 'Community';
  type: 'photo' | 'video';
  image: string;
  videoUrl?: string; 
}

export type DbEvent = {
  id: string;
  title: string;
  starts_at: string;
  location: string;
  badge: string;
  distances: string[];
  deadline: string;
  description: string;
  highlights: string[] | null;
  time: string;
  fee: string;
  route: string;
  routes: Record<string, string> | null;
  slots_left: number | null;
  schedule: string[] | null;
  perks: string[] | null;
  icon_type: string;
  image: string;
  kit_image: string | null;
  route_map_image: string | null;
  gallery_images: string[] | null;
  inclusions: string[] | null;
  jersey_fee: number | null;
  early_bird_deadline: string | null;
  early_bird_discount_percent: number | null;
  distance_fees: Record<string, number> | null;
  created_at: string;
}

export type RegistrationStatus = 'Verified' | 'Pending' | 'Cancelled';

export type DbRegistration = {
  id: string;
  event_id: string;
  first_name: string;
  last_name: string;
  distance_meters: number | null;
  size: string | null;
  registered_bib: string | null;
  status: RegistrationStatus;
  registration_date: string;
  ticket_code: string;
  ticket_code_hash: string;
  ticket_expires_at: string | null;
  created_at: string;
  
  // Custom columns added for registration detail persistence
  email: string;
  phone: string;
  gender: string | null;
  emergency_contact: string | null;
  emergency_phone: string | null;
  payment_method: string | null;
  reference_number: string | null;
  payment_proof: string | null;
  total_amount: number | null;
}
