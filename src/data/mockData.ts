import {
  type EventDetails,
  type EventResult,
  type EventItem,
  type CommunityPost,
  type Product,
  type Article,
  type GalleryItem
} from '../types';

export {
  type EventDetails,
  type EventResult,
  type EventItem,
  type CommunityPost,
  type Product,
  type Article,
  type GalleryItem
};

export const mockEvents: EventItem[] = [
  {
    id: 'event-1',
    title: 'MegaWorld Fun Run',
    badge: 'CLOSING SOON',
    distances: ['3K', '5K', '10K'],
    date: 'Oct 24, 2026',
    deadline: 'Oct 18, 2026',
    location: 'Bacolod City',
    description: 'Push your boundaries on the track. A premier city road run designed for runners of all paces.',
    highlights: ['Flat scenic highway route', 'Over P50,000 in raffle prizes', 'Free hydration & energy snacks'],
    details: {
      time: '6:00 AM',
      fee: '500',
      route: 'MegaWorld Boulevard, Bacolod City',
      schedule: [
        '5:00 AM - Gates Open & Bag Drop',
        '5:30 AM - Dynamic Warm-Up Session',
        '6:00 AM - Gun Start (10K)',
        '6:15 AM - Gun Start (5K & 3K)',
        '8:00 AM - Awarding & Closing Ceremony'
      ],
      perks: ['Dry-Fit Singlet', 'Official Race Bib', 'Finisher Medal', 'Sponsor Loot Bag']
    },
    iconType: 'compass',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'event-2',
    title: 'Lasallian Run 2026',
    badge: 'OPEN',
    distances: ['10K', 'MARATHON'],
    date: 'Nov 23, 2026',
    deadline: 'Nov 15, 2026',
    location: 'Bacolod City',
    description: 'Join the annual solidarity run for education and athletic programs. Go green, go run!',
    highlights: ['USLS campus scenic trail loop', 'Inclusive finisher kits & shirts', 'Proceeds support student-athlete scholarships'],
    details: {
      time: '5:00 AM',
      fee: '1000',
      route: 'USLS Campus to Main Highway',
      schedule: [
        '4:00 AM - Registration & Assembly',
        '4:30 AM - Gun Start (Marathon)',
        '5:00 AM - Gun Start (10K)',
        '10:30 AM - Podium Finishers Recognition'
      ],
      perks: ['Premium Singlet', 'Official Race Bib', 'RFID Timing Chip', 'Finisher Medal', 'Finisher Shirt']
    },
    iconType: 'mountain',
    image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'event-3',
    title: 'Pawtection Run',
    badge: 'PAST EVENT',
    distances: ['3K', '5K', '10K'],
    date: 'Sept 20, 2025',
    deadline: 'Sept 10, 2025',
    location: 'Bacolod City',
    description: 'A run for the benefit of stray and rescued animals. Bring your pets and help save lives!',
    highlights: ['Pet-friendly run lanes', 'Free pet vaccine voucher', 'Grooming kits & sponsor giveaways'],
    details: {
      time: '6:00 AM',
      fee: '500',
      route: 'Bacolod Government Center Grounds',
      schedule: [
        '5:30 AM - Pet Check-in & Assembly',
        '6:00 AM - Gun Start (All Categories)',
        '7:30 AM - Fun Pet Show & Dog Rallying',
        '8:30 AM - Distribution of Pet Certificates'
      ],
      perks: ['Dry-Fit Singlet', 'Official Race Bib', 'Sponsor Loot Bag']
    },
    iconType: 'drop',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80'
  }
];

export const mockProducts: Product[] = [];

export const mockCalendarEvents: { date: string; title: string; type: string }[] = [];

export const mockCommunityPosts: CommunityPost[] = [];

export const mockArticles: Article[] = [];

export const mockGalleryItems: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'MegaWorld 10K Gun Start',
    category: 'Race Day',
    type: 'photo',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'gal-2',
    title: 'Lasallian Run Trail Loop',
    category: 'Race Day',
    type: 'photo',
    image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'gal-3',
    title: 'Race Kit Pickup & Expo',
    category: 'Expo',
    type: 'photo',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'gal-4',
    title: 'Behind The Scenes Setup',
    category: 'Behind the Scenes',
    type: 'photo',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80'
  }
];
