export interface EventDetails {
  time: string;
  fee: string;
  route: string;
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

export const mockEvents: EventItem[] = [
  {
    id: 'event-1',
    title: 'MegaWorld Fun Run',
    badge: 'CLOSING SOON',
    distances: ['5K', '10K'],
    date: 'Oct 24, 2026',
    deadline: 'Oct 15, 2026',
    location: 'Bacolod City',
    description: 'Conquer the streets of Bacolod in the most anticipated evening run of the year. Featuring a vibrant light show and post-race music festival.',
    highlights: ['Night run with neon illumination', 'Live DJs along the course route', 'Premium medal for all finishers'],
    details: {
      time: '05:00 PM',
      fee: '₱1,250.00',
      route: 'MegaWorld Boulevard Loop',
      slotsLeft: 42,
      schedule: [
        '04:30 PM - Warm-up & Assembly',
        '05:00 PM - 10K Gun Start',
        '05:15 PM - 5K Gun Start',
        '07:00 PM - Awarding Ceremony & Afterparty'
      ],
      perks: [
        'Premium Runnicle Tech Tee',
        'Finisher Medal',
        'RFID Timing Chip',
        'Sponsor Goodie Bag',
        'Free entrance to the post-race concert'
      ]
    },
    iconType: 'compass',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80',
    kitImage: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=600&q=80',
    routeMapImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'event-2',
    title: 'Coastal Expressway Marathon',
    badge: 'OPEN',
    distances: ['MARATHON', '10K'],
    date: 'Nov 12, 2026',
    deadline: 'Nov 01, 2026',
    location: 'Bacolod City',
    description: 'A challenging marathon course designed for PB hunters. Flat, fast, and fully certified, running through the scenic coastal bypass road.',
    highlights: ['Flat coastal course optimized for PRs', 'Certified timing standard', 'Pacers available for multiple target times'],
    details: {
      time: '04:00 AM',
      fee: '₱2,800.00',
      route: 'Bacolod Coastal Expressway to MegaWorld',
      slotsLeft: 250,
      schedule: [
        '03:00 AM - Baggage Drop & Assembly',
        '04:00 AM - Full Marathon (42.2K) Gun Start',
        '05:30 AM - 10K Gun Start',
        '10:30 AM - Event Cut-off & Recovery Lounge'
      ],
      perks: [
        'Sub-4/Sub-5 Finisher Singlet (Marathon only)',
        'Finisher Medal',
        'Digital Certificate',
        'Hydration & Nutrition Stations every 2.5K',
        'Post-race Massage Session'
      ]
    },
    iconType: 'mountain',
    image: 'https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&w=800&q=80',
    kitImage: 'https://images.unsplash.com/photo-1486218119243-13883505764c?auto=format&fit=crop&w=600&q=80',
    routeMapImage: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'event-3',
    title: 'Amihan Year-End Championship Cup',
    badge: 'SOLD OUT',
    distances: ['10K'],
    date: 'Dec 05, 2026',
    deadline: 'Nov 20, 2026',
    location: 'Bacolod City',
    description: 'The final leg of the local championship series. A high-stakes race where Bacolod\'s top elite athletes and running groups go head-to-head for the year-end cup.',
    highlights: ['Championship point-scaling race', 'Cash prizes for top 3 in all age groups', 'Custom limited edition jersey'],
    details: {
      time: '06:00 AM',
      fee: '₱1,500.00',
      route: 'Downtown Bacolod Heritage Loop',
      slotsLeft: 0,
      schedule: [
        '05:30 AM - Elite Athlete Call',
        '06:00 AM - 10K Gun Start',
        '08:00 AM - Championship Ceremony'
      ],
      perks: [
        'Championship Edition Jersey',
        'Custom Die-cast Medal',
        'Action Photos Package',
        'Hot Recovery Meal'
      ]
    },
    iconType: 'drop',
    image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=800&q=80',
    kitImage: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=600&q=80',
    routeMapImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'event-4',
    title: 'Bacolod Summer Run 2025',
    badge: 'PAST EVENT',
    distances: ['5K', '10K'],
    date: 'May 18, 2025',
    deadline: 'May 10, 2025',
    location: 'Bacolod City',
    description: 'Our annual summer run that brought together over 1,500 runners. Warm breezes, ocean views, and cold hydration packs made this race a fan favorite.',
    highlights: ['Scenic coastal views', 'Summer themed finisher jerseys', 'Coconut hydration bars at finish line'],
    details: {
      time: '05:30 AM',
      fee: '₱950.00',
      route: 'Coastal Esplanade Loop',
      schedule: ['Completed'],
      perks: ['Jersey', 'Medal']
    },
    iconType: 'compass',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80',
    results: [
      { bib: '241', name: 'Marc Villanueva', rank: 1, category: '10K', finishTime: '00:32:14', pace: '3:13/km' },
      { bib: '108', name: 'Sarah Geronimo', rank: 2, category: '10K', finishTime: '00:35:45', pace: '3:34/km' },
      { bib: '315', name: 'Alex Gonzaga', rank: 3, category: '10K', finishTime: '00:36:10', pace: '3:37/km' },
      { bib: '412', name: 'Daniel Padilla', rank: 4, category: '10K', finishTime: '00:38:12', pace: '3:49/km' },
      { bib: '502', name: 'Clara Benin', rank: 5, category: '10K', finishTime: '00:40:02', pace: '4:00/km' },
      { bib: '142', name: 'Jaime Cardenas', rank: 1, category: '5K', finishTime: '00:15:32', pace: '3:06/km' },
      { bib: '89', name: 'Jess Diaz', rank: 2, category: '5K', finishTime: '00:17:41', pace: '3:32/km' }
    ]
  },
  {
    id: 'event-5',
    title: 'Heritage Mile Challenge 2024',
    badge: 'PAST EVENT',
    distances: ['10K', '15K'],
    date: 'Sep 21, 2024',
    deadline: 'Sep 10, 2024',
    location: 'Bacolod City',
    description: 'A historic run traversing the landmark routes of Bacolod. A total of 1,200 participants completed the loop in pleasant autumn weather.',
    highlights: ['Traversing old historical landmarks', 'Post-run food expo featuring local delicacies'],
    details: {
      time: '06:00 AM',
      fee: '₱1,100.00',
      route: 'Heritage Center Loop',
      schedule: ['Completed'],
      perks: ['Jersey', 'Medal']
    },
    iconType: 'mountain',
    image: 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&w=800&q=80',
    results: [
      { bib: '302', name: 'Dom Yulo', rank: 1, category: '15K', finishTime: '00:49:12', pace: '3:16/km' },
      { bib: '115', name: 'Mia Aquino', rank: 2, category: '15K', finishTime: '00:52:45', pace: '3:31/km' },
      { bib: '280', name: 'Lucas Fernandez', rank: 3, category: '15K', finishTime: '00:55:02', pace: '3:40/km' },
      { bib: '101', name: 'Art De Leon', rank: 1, category: '10K', finishTime: '00:33:12', pace: '3:19/km' },
      { bib: '44', name: 'Juan dela Cruz', rank: 2, category: '10K', finishTime: '00:34:55', pace: '3:29/km' }
    ]
  }
];

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Runnicle Carbon Elite 4',
    category: 'Accessories', 
    price: 12495.00,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
    description: 'Engineered with a full-length carbon fiber plate and responsive foam to maximize energy return. Designed specifically for breaking personal records on the road.',
    colors: ['Red-Orange', 'Vibrant White', 'Triple Black'],
    sizes: ['8', '9', '10', '11', '12'],
    specs: ['Weight: 185g (Size 9)', 'Carbon Plate: Full-length curve', 'Stack height: 38mm / 30mm']
  },
  {
    id: 'prod-2',
    name: 'Official Championship Jersey',
    category: 'Jerseys',
    price: 1950.00,
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=400&q=80',
    description: 'The official championship running jersey. Breathable side-mesh panels and moisture-wicking technology keep you dry through any tempo session.',
    colors: ['Athletic Black', 'Neon Crimson'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    specs: ['Material: 100% Recycled Polyester', 'Reflective trims on front and back', 'Flatlock stitching']
  },
  {
    id: 'prod-3',
    name: 'Runnicle Pace Race Kit',
    category: 'Race Kits',
    price: 1495.00,
    image: 'https://images.unsplash.com/photo-1519042508741-7f99be9a6857?auto=format&fit=crop&w=400&q=80',
    description: 'Includes a race bib belt, high-visibility arm bands, and two energy-gel flasks. Everything you need to manage your race essentials on the go.',
    colors: ['Neon Green', 'Charcoal'],
    sizes: ['One Size'],
    specs: ['Bib Belt: Adjustable elastic fit', 'Flasks: BPA free, 150ml capacity', 'Reflective print highlights']
  },
  {
    id: 'prod-4',
    name: 'ChronoGPS Apex Smart Watch',
    category: 'Accessories',
    price: 21995.00,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
    description: 'High-performance GPS athlete watch tracking heart rate variability, training load, VO2 max, and real-time offline map routing. Battery lasts up to 40 hours in GPS mode.',
    colors: ['Stealth Black', 'Steel Silver'],
    sizes: ['Standard'],
    specs: ['Battery: 40 hours full GPS', 'Waterproof rating: 50m / 5 ATM', 'Sensors: Heart Rate, Altimeter, Barometer']
  },
  {
    id: 'prod-5',
    name: 'Runnicle Aero Cap',
    category: 'Accessories',
    price: 995.00,
    image: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=400&q=80',
    description: 'Ultra-lightweight mesh cap with flexible brim and adjustable rear clasp. Shades eyes while venting heat during sunny miles.',
    colors: ['Ice White', 'Shadow Black'],
    sizes: ['One Size'],
    specs: ['Weight: 45g', 'UPF 50+ UV Sun Protection', 'Foldable pack-away design']
  },
  {
    id: 'prod-6',
    name: 'Performance Compression Socks',
    category: 'Merchandise',
    price: 795.00,
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=400&q=80',
    description: 'Arch support, padded heels, and graduated compression to boost circulation and shorten post-run recovery windows.',
    colors: ['Blue Streak', 'Stealth Dark'],
    sizes: ['S/M', 'L/XL'],
    specs: ['Compression scale: 15-20 mmHg', 'Reinforced toe & heel padding', 'Merino wool blend option']
  }
];

export const mockCalendarEvents = [
  { date: 'Oct 10, 2026', title: 'Runnicle Pre-Season Briefing', type: 'coaching' },
  { date: 'Oct 24, 2026', title: 'MegaWorld Fun Run (5K/10K)', type: 'race' },
  { date: 'Nov 01, 2026', title: 'Amihan Marathon Training Block Starts', type: 'training' },
  { date: 'Nov 12, 2026', title: 'Coastal Expressway Marathon (Full/10K)', type: 'race' },
  { date: 'Nov 20, 2026', title: 'Elite Performance Webinar with Coach Dan', type: 'coaching' },
  { date: 'Dec 05, 2026', title: 'Amihan Year-End Championship Cup (10K)', type: 'race' },
  { date: 'Dec 15, 2026', title: 'Runnicle Year-End Gear Expo', type: 'equipment' },
];

export const mockCommunityPosts: CommunityPost[] = [
  {
    id: 'post-1',
    username: 'alex_runs_fast',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80',
    caption: 'Nothing beats early morning miles. Melted the asphalt today! 🏃‍♂️⚡️ #RunniclePro #runlife',
    likes: 248,
    commentsCount: 2,
    comments: [
      { user: 'runner_clara', text: 'Insane pace today!' },
      { user: 'coach_dan', text: 'Form is looking rock solid.' }
    ],
    date: '2 hours ago'
  },
  {
    id: 'post-2',
    username: 'marathon_mindset',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    image: 'https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&w=800&q=80',
    caption: 'Lacing up for the Coastal Expressway Marathon. Getting those hill repeats done. ⛰️ #RunniclePro #marathontraining',
    likes: 312,
    commentsCount: 2,
    comments: [
      { user: 'fit_jess', text: 'That hill is no joke!' },
      { user: 'marathon_mindset', text: 'Thanks! Hard work paying off.' }
    ],
    date: '4 hours ago'
  },
  {
    id: 'post-3',
    username: 'run_with_heart',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=800&q=80',
    caption: 'Felt the community vibes at the local 10k! Rule the road together. 👥🖤 #RunniclePro #community',
    likes: 185,
    commentsCount: 1,
    comments: [
      { user: 'run_jack', text: 'Great team photo!' }
    ],
    date: '6 hours ago'
  }
];

export const mockArticles: Article[] = [
  {
    id: 'art-1',
    title: 'Coastal Expressway Route Map Details Released',
    category: 'Route Changes',
    date: 'Jun 22, 2026',
    author: 'Organizer Team',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80',
    summary: 'Review changes to the final 5K stretch of the Coastal Expressway Marathon. A minor detour will avoid downtown construction areas.',
    readTime: '3 min read',
    image: 'https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&w=800&q=80',
    content: [
      'As we draw closer to the Coastal Expressway Marathon on November 12, we are releasing the final certified route map configurations.',
      'Due to ongoing historical preservation construction around the downtown municipal hall, the regional sports board has authorized a detour. Instead of looping around City Plaza, runners will stay straight on Waterfront Drive, connecting directly to the MegaWorld finishing gates.',
      'This detour slightly shifts the hydration station coordinates. A new station will be added at the 38K mark, ensuring runners have access to electrolytes and nutrition before the final push. Check the interactive maps now!'
    ]
  },
  {
    id: 'art-2',
    title: 'Registration Closing Soon for MegaWorld Fun Run',
    category: 'Registration',
    date: 'Jun 20, 2026',
    author: 'Race Committee',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80',
    summary: 'Less than 50 slots remain for the night 10K category. Secure your singlet sizes before the registration system closes.',
    readTime: '2 min read',
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80',
    content: [
      'The response to the MegaWorld Fun Run has been unprecedented. The 5K category is now fully booked, and less than 50 slots remain active for the competitive 10K run.',
      'Organizers remind participants that shirt/ jersey sizing allocations are compiled directly from early registrations. After October 15, remaining open slots will receive standard default sizing (M/L).',
      'Don\'t miss the neon night vibes. Confirm your waiver and grab your timing bib immediately.'
    ]
  },
  {
    id: 'art-3',
    title: 'Runnicle Partner and Gear Sponsor Announcements',
    category: 'Sponsors',
    date: 'Jun 15, 2026',
    author: 'Marketing Board',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80',
    summary: 'Welcoming Apex Nutrition and Hydration as our main hydration partner, providing energy gels at all expressway stations.',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=800&q=80',
    content: [
      'Runnicle is proud to announce its strategic partnership with Apex Nutrition, the leading organic endurance sports brand.',
      'Apex will set up dedicated electrolyte fuel zones every 5 kilometers. In addition to clean purified water, runners will be provided with custom isotonic citrus drinks and berry-flavored energy gels.',
      'This partnership ensures our runners stay properly fueled, decreasing injury spikes and supporting peak performance. Specialized recovery packs will also be waiting at finish line lounges.'
    ]
  }
];

export const mockGalleryItems: GalleryItem[] = [
  { id: 'g-1', title: 'Marathon Wave Start', category: 'Race Day', type: 'photo', image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=800&q=80' },
  { id: 'g-2', title: 'Runner at Sunset', category: 'Community', type: 'photo', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80' },
  { id: 'g-3', title: 'Training Camp Group', category: 'Behind the Scenes', type: 'photo', image: 'https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&w=800&q=80' },
  { id: 'g-4', title: 'Runnicle Gear Expo', category: 'Expo', type: 'photo', image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80' },
  { id: 'g-5', title: 'Elite Finishers Line', category: 'Race Day', type: 'photo', image: 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&w=800&q=80' },
  { id: 'g-6', title: 'Stretching & Dynamic Prep', category: 'Behind the Scenes', type: 'photo', image: 'https://images.unsplash.com/photo-1486218119243-13883505764c?auto=format&fit=crop&w=800&q=80' },
  { id: 'g-7', title: 'Post Race Concert Crowd', category: 'Community', type: 'photo', image: 'https://images.unsplash.com/photo-1532444458054-01a7dd3e9fca?auto=format&fit=crop&w=800&q=80' },
  { id: 'g-8', title: 'Winter Course Recon Walk', category: 'Expo', type: 'photo', image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80' },
  { id: 'g-video-1', title: 'Expressway Marathon Reel', category: 'Race Day', type: 'video', image: 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&w=800&q=80', videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 'g-video-2', title: 'Coaching Warmup Guide', category: 'Behind the Scenes', type: 'video', image: 'https://images.unsplash.com/photo-1486218119243-13883505764c?auto=format&fit=crop&w=800&q=80', videoUrl: 'https://www.w3schools.com/html/movie.mp4' }
];
