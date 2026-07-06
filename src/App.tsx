import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Clock,
  Activity,
  BookOpen,
  Heart,
  ShoppingBag
} from 'lucide-react';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import UpcomingEvents from './components/UpcomingEvents';
import Footer from './components/Footer';
import Modal from './components/Modal';
import FeaturedGallery from './components/FeaturedGallery';
import BibsAndMerch from './components/BibsAndMerch';

import EventDetailsPage from './pages/EventDetailsPage';
import RegistrationPage from './pages/RegistrationPage';
import CoachBookingPage from './pages/CoachBookingPage';
import ProductDetailsPage from './pages/ProductDetailsPage';

import EventsPage from './pages/EventsPage';
import EventResultsPage from './pages/EventResultsPage';
import StorePage from './pages/StorePage';
import CartPage, { type CartItem } from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import GalleryPage from './pages/GalleryPage';
import NewsPage from './pages/NewsPage';
import ArticleDetailsPage from './pages/ArticleDetailsPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';

import {
  mockEvents,
  mockProducts,
  mockArticles,
  type EventItem,
  type Product,
  type Article,
  type CommunityPost
} from './data/mockData';

import { mockCommunityPosts } from './data/mockData';

const getPathFromPage = (pageName: string): string => {
  switch (pageName) {
    case 'home': return '/';
    case 'events': return '/events';
    case 'event-details': return '/event-details';
    case 'event-results': return '/event-results';
    case 'register': return '/register';
    case 'gallery': return '/gallery';
    case 'news': return '/news';
    case 'article-details': return '/article-details';
    case 'store': return '/store';
    case 'product-details': return '/product-details';
    case 'cart': return '/cart';
    case 'checkout': return '/checkout';
    case 'order-confirmation': return '/order-confirmation';
    case 'contact': return '/contact';
    case 'admin-login': return '/admin_page';
    case 'admin-dashboard': return '/admin_dashboard';
    case 'admin-registrations': return '/admin_registrations';
    case 'admin-events': return '/admin_events';
    case 'admin-create-event': return '/admin_create_event';
    case 'admin-registration-details': return '/admin_registration_details';
    default: return '/';
  }
};

const getPageFromPath = (path: string): string => {
  switch (path) {
    case '/': return 'home';
    case '/events': return 'events';
    case '/event-details': return 'event-details';
    case '/event-results': return 'event-results';
    case '/register': return 'register';
    case '/gallery': return 'gallery';
    case '/news': return 'news';
    case '/article-details': return 'article-details';
    case '/store': return 'store';
    case '/product-details': return 'product-details';
    case '/cart': return 'cart';
    case '/checkout': return 'checkout';
    case '/order-confirmation': return 'order-confirmation';
    case '/contact': return 'contact';
    case '/admin_page': return 'admin-login';
    case '/admin_dashboard': return 'admin-dashboard';
    case '/admin_registrations': return 'admin-registrations';
    case '/admin_events': return 'admin-events';
    case '/admin_create_event': return 'admin-create-event';
    case '/admin_registration_details': return 'admin-registration-details';
    default: return 'home';
  }
};

export const App: React.FC = () => {
  
  const [page, setPage] = useState<string>(() => {
    const path = window.location.pathname;
    const matchedPage = getPageFromPath(path);
    if (matchedPage !== 'home') {
      return matchedPage;
    }
    
    const savedPage = sessionStorage.getItem('runnicle_current_page');
    if (savedPage && !['admin-login', 'admin-dashboard', 'admin-registrations', 'admin-events', 'admin-create-event', 'admin-registration-details'].includes(savedPage)) {
      return savedPage;
    }
    return 'home';
  });

  const [selectedRegId, setSelectedRegId] = useState<string | null>(() => {
    return sessionStorage.getItem('runnicle_selected_reg_id');
  });

  const handleSelectReg = (id: string | null) => {
    setSelectedRegId(id);
    if (id) {
      sessionStorage.setItem('runnicle_selected_reg_id', id);
    } else {
      sessionStorage.removeItem('runnicle_selected_reg_id');
    }
  };

  // Elevate events state (initial load from mockEvents and sync with localStorage)
  const [events, setEvents] = useState<EventItem[]>(() => {
    const stored = localStorage.getItem('runnicle_events');
    const hasReset = localStorage.getItem('runnicle_events_redesign_v2');
    if (!hasReset) {
      localStorage.setItem('runnicle_events_redesign_v2', 'true');
      localStorage.setItem('runnicle_events', JSON.stringify(mockEvents));
      return mockEvents;
    }
    return stored ? JSON.parse(stored) : mockEvents;
  });

  // Handle adding a new event
  const handleAddEvent = (newEvent: EventItem) => {
    const updated = [newEvent, ...events];
    setEvents(updated);
    localStorage.setItem('runnicle_events', JSON.stringify(updated));
  };

  // Handle updating / deleting events
  const handleUpdateEvents = (newEvents: EventItem[]) => {
    setEvents(newEvents);
    localStorage.setItem('runnicle_events', JSON.stringify(newEvents));
  };

  // Elevate registrations state (initial load from mock + sync with localStorage)
  const [registrations, setRegistrations] = useState<any[]>(() => {
    const stored = localStorage.getItem('runnicle_registrations');
    if (stored) return JSON.parse(stored);
    
    // Default pre-populated list
    const defaults = [
      {
        id: 'reg-1',
        firstName: 'Juan',
        lastName: 'Dela Cruz',
        email: 'juan.delacruz@example.com',
        phone: '09171234567',
        gender: 'Male',
        eventTitle: 'MegaWorld Fun Run',
        distance: '10K',
        size: 'Unisex - Medium (M)',
        paymentMethod: 'GCash',
        referenceNumber: '1029384756102',
        registeredBib: '245',
        emergencyContact: 'Maria Dela Cruz',
        emergencyPhone: '09187654321',
        registrationDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Verified'
      },
      {
        id: 'reg-2',
        firstName: 'Samantha',
        lastName: 'Santos',
        email: 'sam.santos@example.com',
        phone: '09192233445',
        gender: 'Female',
        eventTitle: 'MegaWorld Fun Run',
        distance: '5K',
        size: 'Unisex - Small (S)',
        paymentMethod: 'Maya',
        referenceNumber: '9988776655443',
        registeredBib: '189',
        emergencyContact: 'David Santos',
        emergencyPhone: '09201122334',
        registrationDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Verified'
      },
      {
        id: 'reg-3',
        firstName: 'Mark',
        lastName: 'Lee',
        email: 'mark.lee@example.com',
        phone: '09154433221',
        gender: 'Male',
        eventTitle: 'Guimaras Mountain Challenge',
        distance: '21K',
        size: 'Unisex - Large (L)',
        paymentMethod: 'Bank Deposit',
        referenceNumber: 'BDO-TRSF-5839',
        registeredBib: '412',
        emergencyContact: 'Lin Lee',
        emergencyPhone: '09088899001',
        registrationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Verified'
      }
    ];
    return defaults;
  });

  const handleUpdateRegistrations = (newRegs: any[]) => {
    setRegistrations(newRegs);
    localStorage.setItem('runnicle_registrations', JSON.stringify(newRegs));
  };

  const handleRegisterComplete = (newRegistration: any) => {
    const record = {
      id: `reg-${Date.now()}`,
      registrationDate: new Date().toISOString(),
      status: 'Pending',
      ...newRegistration
    };
    const updated = [record, ...registrations];
    setRegistrations(updated);
    localStorage.setItem('runnicle_registrations', JSON.stringify(updated));
  };

  
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Sync path with page state & implement Auth Guard
    const currentPath = window.location.pathname;
    const isLoggedIn = sessionStorage.getItem('runnicle_admin_logged') === 'true' || localStorage.getItem('runnicle_admin_logged') === 'true';
    const isAdminView = ['admin-login', 'admin-dashboard', 'admin-registrations', 'admin-events', 'admin-create-event', 'admin-registration-details'].includes(page);

    if (isAdminView && !isLoggedIn && page !== 'admin-login') {
      setPage('admin-login');
      return;
    }

    const targetPath = getPathFromPage(page);
    if (currentPath !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }

    // Persist to sessionStorage if it's not an admin page
    if (!isAdminView) {
      sessionStorage.setItem('runnicle_current_page', page);
    } else {
      sessionStorage.removeItem('runnicle_current_page');
    }
  }, [page]);

  React.useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const matchedPage = getPageFromPath(path);
      setPage(matchedPage);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  
  
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem('runnicle_cart_items');
    return stored ? JSON.parse(stored) : [];
  });
  
  
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(() => {
    const stored = sessionStorage.getItem('runnicle_selected_event');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => {
    const stored = sessionStorage.getItem('runnicle_selected_product');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(() => {
    const stored = sessionStorage.getItem('runnicle_selected_article');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  React.useEffect(() => {
    localStorage.setItem('runnicle_cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  React.useEffect(() => {
    if (selectedEvent) {
      sessionStorage.setItem('runnicle_selected_event', JSON.stringify(selectedEvent));
    } else {
      sessionStorage.removeItem('runnicle_selected_event');
    }
  }, [selectedEvent]);

  React.useEffect(() => {
    if (selectedProduct) {
      sessionStorage.setItem('runnicle_selected_product', JSON.stringify(selectedProduct));
    } else {
      sessionStorage.removeItem('runnicle_selected_product');
    }
  }, [selectedProduct]);

  React.useEffect(() => {
    if (selectedArticle) {
      sessionStorage.setItem('runnicle_selected_article', JSON.stringify(selectedArticle));
    } else {
      sessionStorage.removeItem('runnicle_selected_article');
    }
  }, [selectedArticle]);

  
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);

  
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(mockCommunityPosts);
  const [newCommentText, setNewCommentText] = useState<string>('');

  
  const [planDistance, setPlanDistance] = useState<string>('5K');
  const [planLevel, setPlanLevel] = useState<string>('Beginner');
  const [generatedPlan, setGeneratedPlan] = useState<any[] | null>(null);

  const handleGeneratePlan = () => {
    const plansData: Record<string, Record<string, any[]>> = {
      '5K': {
        'Beginner': [
          { week: 'Week 1', focus: 'Base building', runs: ['Mon: 2km Easy', 'Wed: 2.5km Easy', 'Sat: 3km Long Run'] },
          { week: 'Week 2', focus: 'Consistency', runs: ['Mon: 2.5km Easy', 'Wed: 3km Easy', 'Sat: 3.5km Long Run'] },
          { week: 'Week 3', focus: 'Endurance step-up', runs: ['Mon: 3km Easy', 'Wed: 3km Tempo', 'Sat: 4km Long Run'] },
          { week: 'Week 4', focus: 'Race week & Taper', runs: ['Mon: 2.5km Easy', 'Wed: 2km Light Jog', 'Sat: 5K Race Day!'] },
        ],
        'Intermediate': [
          { week: 'Week 1', focus: 'Speed intervals', runs: ['Mon: 4km Easy', 'Wed: 5x400m Intervals', 'Fri: 3km Recovery', 'Sat: 6km Long Run'] },
          { week: 'Week 2', focus: 'Tempo endurance', runs: ['Mon: 4km Easy', 'Wed: 3km Tempo Run', 'Fri: 3km Recovery', 'Sat: 8km Long Run'] },
          { week: 'Week 3', focus: 'Peak distance', runs: ['Mon: 5km Easy', 'Wed: 6x400m Intervals', 'Fri: 4km Recovery', 'Sat: 9km Long Run'] },
          { week: 'Week 4', focus: 'Race preparation', runs: ['Mon: 3km Easy', 'Wed: 2km Tempo', 'Fri: Rest', 'Sat: 5K Race Day!'] },
        ],
        'Advanced': [
          { week: 'Week 1', focus: 'Threshold pace', runs: ['Mon: 6km Easy', 'Tue: Track Intervals', 'Thu: 5km Tempo', 'Sat: 12km Long Run'] },
          { week: 'Week 2', focus: 'Aerobic capacity', runs: ['Mon: 8km Easy', 'Tue: Speed Intervals', 'Thu: 6km Tempo', 'Sat: 14km Long Run'] },
          { week: 'Week 3', focus: 'Peak load', runs: ['Mon: 10km Easy', 'Tue: Hill Repeats', 'Thu: 8km Tempo', 'Sat: 16km Long Run'] },
          { week: 'Week 4', focus: 'Taper & Sprint Prep', runs: ['Mon: 5km Easy', 'Wed: 3km Light Jog', 'Fri: Rest', 'Sat: 5K Race Day!'] },
        ],
      },
      '10K': {
        'Beginner': [
          { week: 'Week 1', focus: 'Base creation', runs: ['Mon: 3km Easy', 'Wed: 3km Easy', 'Sat: 5km Long Run'] },
          { week: 'Week 2', focus: 'Endurance buildup', runs: ['Mon: 3.5km Easy', 'Wed: 4km Easy', 'Sat: 6km Long Run'] },
          { week: 'Week 3', focus: 'Long run peak', runs: ['Mon: 4km Easy', 'Wed: 5km Easy', 'Sat: 8km Long Run'] },
          { week: 'Week 4', focus: 'Taper & Goal test', runs: ['Mon: 3km Easy', 'Wed: 2.5km Light Jog', 'Sat: 10K Race Day!'] },
        ],
        'Intermediate': [
          { week: 'Week 1', focus: 'Tempo introduction', runs: ['Mon: 5km Easy', 'Wed: 4km Tempo', 'Fri: 4km Recovery', 'Sat: 8km Long Run'] },
          { week: 'Week 2', focus: 'Interval loading', runs: ['Mon: 5km Easy', 'Wed: 5x800m Intervals', 'Fri: 4km Recovery', 'Sat: 10km Long Run'] },
          { week: 'Week 3', focus: 'Peak aerobic volume', runs: ['Mon: 6km Easy', 'Wed: 5km Tempo', 'Fri: 4km Recovery', 'Sat: 12km Long Run'] },
          { week: 'Week 4', focus: 'Taper & Race Strategy', runs: ['Mon: 4km Easy', 'Wed: 3km Light Jog', 'Fri: Rest', 'Sat: 10K Race Day!'] },
        ],
        'Advanced': [
          { week: 'Week 1', focus: 'V02 Max focus', runs: ['Mon: 8km Easy', 'Tue: 6x1000m Intervals', 'Thu: 6km Tempo', 'Sat: 16km Long Run'] },
          { week: 'Week 2', focus: 'Strength building', runs: ['Mon: 8km Easy', 'Tue: Hill Repeats', 'Thu: 8km Tempo', 'Sat: 18km Long Run'] },
          { week: 'Week 3', focus: 'Peak miles', runs: ['Mon: 10km Easy', 'Tue: 8x800m Intervals', 'Thu: 8km Tempo', 'Sat: 20km Long Run'] },
          { week: 'Week 4', focus: 'Sharpening & Taper', runs: ['Mon: 6km Easy', 'Wed: 4km Light Jog', 'Fri: Rest', 'Sat: 10K Race Day!'] },
        ],
      },
      'Half Marathon': {
        'Beginner': [
          { week: 'Week 1', focus: 'Base buildup', runs: ['Mon: 5km Easy', 'Wed: 5km Easy', 'Sat: 8km Long Run'] },
          { week: 'Week 2', focus: 'Endurance stretch', runs: ['Mon: 5km Easy', 'Wed: 6km Easy', 'Sat: 11km Long Run'] },
          { week: 'Week 3', focus: 'Peak long run', runs: ['Mon: 6km Easy', 'Wed: 6km Easy', 'Sat: 15km Long Run'] },
          { week: 'Week 4', focus: 'Taper week', runs: ['Mon: 4km Easy', 'Wed: 3km Light Jog', 'Sat: 21.1K Race Day!'] },
        ],
        'Intermediate': [
          { week: 'Week 1', focus: 'Threshold building', runs: ['Mon: 6km Easy', 'Wed: 6km Tempo', 'Fri: 5km Recovery', 'Sat: 12km Long Run'] },
          { week: 'Week 2', focus: 'Speed & volume mix', runs: ['Mon: 8km Easy', 'Wed: 6x1000m Intervals', 'Fri: 5km Recovery', 'Sat: 15km Long Run'] },
          { week: 'Week 3', focus: 'Peak endurance', runs: ['Mon: 8km Easy', 'Wed: 8km Tempo', 'Fri: 5km Recovery', 'Sat: 18km Long Run'] },
          { week: 'Week 4', focus: 'Taper & recovery', runs: ['Mon: 5km Easy', 'Wed: 4km Light Jog', 'Fri: Rest', 'Sat: 21.1K Race Day!'] },
        ],
        'Advanced': [
          { week: 'Week 1', focus: 'Aerobic threshold', runs: ['Mon: 10km Easy', 'Tue: 8x1000m Intervals', 'Thu: 8km Tempo', 'Sat: 20km Long Run'] },
          { week: 'Week 2', focus: 'Peak speed-endurance', runs: ['Mon: 12km Easy', 'Tue: Hill Repeats', 'Thu: 10km Tempo', 'Sat: 22km Long Run'] },
          { week: 'Week 3', focus: 'Volume peak', runs: ['Mon: 14km Easy', 'Tue: 5x2000m Intervals', 'Thu: 12km Tempo', 'Sat: 25km Long Run'] },
          { week: 'Week 4', focus: 'Active tapering', runs: ['Mon: 8km Easy', 'Wed: 5km Light Jog', 'Fri: Rest', 'Sat: 21.1K Race Day!'] },
        ],
      },
      'Full Marathon': {
        'Beginner': [
          { week: 'Week 1', focus: 'Base milestone', runs: ['Mon: 8km Easy', 'Wed: 8km Easy', 'Sat: 15km Long Run'] },
          { week: 'Week 2', focus: 'Volume step-up', runs: ['Mon: 8km Easy', 'Wed: 10km Easy', 'Sat: 22km Long Run'] },
          { week: 'Week 3', focus: 'Peak endurance test', runs: ['Mon: 10km Easy', 'Wed: 10km Easy', 'Sat: 30km Long Run'] },
          { week: 'Week 4', focus: 'Deep taper', runs: ['Mon: 6km Easy', 'Wed: 4km Light Jog', 'Sat: 42.2K Race Day!'] },
        ],
        'Intermediate': [
          { week: 'Week 1', focus: 'Aerobic efficiency', runs: ['Mon: 10km Easy', 'Wed: 8km Tempo', 'Fri: 8km Recovery', 'Sat: 20km Long Run'] },
          { week: 'Week 2', focus: 'Endurance intensity', runs: ['Mon: 12km Easy', 'Wed: 4x2000m Intervals', 'Fri: 8km Recovery', 'Sat: 28km Long Run'] },
          { week: 'Week 3', focus: 'Peak long volume', runs: ['Mon: 12km Easy', 'Wed: 10km Tempo', 'Fri: 8km Recovery', 'Sat: 32km Long Run'] },
          { week: 'Week 4', focus: 'Taper and nutrition', runs: ['Mon: 8km Easy', 'Wed: 5km Light Jog', 'Fri: Rest', 'Sat: 42.2K Race Day!'] },
        ],
        'Advanced': [
          { week: 'Week 1', focus: 'Intense volume threshold', runs: ['Mon: 12km Easy', 'Tue: 5x2000m Intervals', 'Thu: 12km Tempo', 'Sat: 30km Long Run'] },
          { week: 'Week 2', focus: 'Strength peak', runs: ['Mon: 14km Easy', 'Tue: Hill Repeats', 'Thu: 14km Tempo', 'Sat: 35km Long Run'] },
          { week: 'Week 3', focus: 'Peak aerobic stress', runs: ['Mon: 16km Easy', 'Tue: 8x1000m Intervals', 'Thu: 15km Tempo', 'Sat: 38km Long Run'] },
          { week: 'Week 4', focus: 'Fine tune & taper', runs: ['Mon: 10km Easy', 'Wed: 6km Light Jog', 'Fri: Rest', 'Sat: 42.2K Race Day!'] },
        ],
      }
    };

    setGeneratedPlan(plansData[planDistance]?.[planLevel] || null);
  };

  
  const getNearestUpcomingEvent = () => {
    const now = new Date().getTime();
    const upcoming = events.filter(e => e.badge !== 'PAST EVENT');
    
    
    const sorted = [...upcoming].sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return timeA - timeB;
    });

    const nearest = sorted.find(e => new Date(e.date).getTime() > now) || sorted[0] || events[0];
    return nearest;
  };

  const nearestEvent = getNearestUpcomingEvent() || mockEvents[0];

  
  const getNavbarActiveTab = () => {
    if (page === 'home') return 'Dashboard';
    if (['events', 'event-details', 'event-results', 'register'].includes(page)) return 'Events';
    if (page === 'gallery') return 'Gallery';
    if (page === 'news' || page === 'article-details') return 'News';
    if (page === 'store' || page === 'product-details' || page === 'cart' || page === 'checkout' || page === 'order-confirmation') return 'Merch';
    if (page === 'contact') return 'Contact';
    return 'Dashboard';
  };

  
  const handleTabChange = (tab: string) => {
    if (tab === 'Dashboard') setPage('home');
    else if (tab === 'Events') setPage('events');
    else if (tab === 'Gallery') setPage('gallery');
    else if (tab === 'News') setPage('news');
    else if (tab === 'Merch') setPage('store');
    else if (tab === 'Contact') setPage('contact');
  };

  
  const handleAddToCart = (product: Product, size?: string, color?: string) => {
    const itemSize = size || product.sizes[0] || 'Standard';
    const itemColor = color || product.colors[0] || 'Default';

    setCartItems((prev) => {
      const existIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.size === itemSize && item.color === itemColor
      );

      if (existIdx > -1) {
        const copy = [...prev];
        copy[existIdx].quantity += 1;
        return copy;
      } else {
        return [...prev, { product, quantity: 1, size: itemSize, color: itemColor }];
      }
    });
  };

  
  const handleUpdateCartQuantity = (idx: number, delta: number) => {
    setCartItems((prev) => {
      const copy = [...prev];
      const newQty = copy[idx].quantity + delta;
      
      if (newQty <= 0) {
        copy.splice(idx, 1);
      } else {
        copy[idx].quantity = newQty;
      }
      return copy;
    });
  };

  
  const handleRemoveCartItem = (idx: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== idx));
  };

  
  const handleAddComment = (postId: string) => {
    if (!newCommentText.trim()) return;

    const updated = communityPosts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          commentsCount: post.commentsCount + 1,
          comments: [
            ...post.comments,
            { user: 'you_run_fast', text: newCommentText }
          ]
        };
      }
      return post;
    });

    setCommunityPosts(updated);
    
    
    const postToUpdate = updated.find(p => p.id === postId);
    if (postToUpdate) {
      setSelectedPost(postToUpdate);
    }
    
    setNewCommentText('');
  };

  
  const handleToggleLike = (postId: string) => {
    const updated = communityPosts.map((post) => {
      if (post.id === postId) {
        const hasLiked = (post as any).hasLiked;
        return {
          ...post,
          likes: hasLiked ? post.likes - 1 : post.likes + 1,
          hasLiked: !hasLiked
        };
      }
      return post;
    });

    setCommunityPosts(updated);
    const postToUpdate = updated.find(p => p.id === postId);
    if (postToUpdate) {
      setSelectedPost(postToUpdate);
    }
  };

  
  const cartTotalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-800 antialiased selection:bg-orange-500 selection:text-white">
      
      {}
      {!['admin-login', 'admin-dashboard', 'admin-registrations', 'admin-events', 'admin-create-event', 'admin-registration-details'].includes(page) && (
        <Navbar
          activeTab={getNavbarActiveTab()}
          setActiveTab={handleTabChange}
          onJoinClick={() => {
            setSelectedEvent(null);
            setPage('register');
          }}
        />
      )}

      {}
      {cartTotalItems > 0 && page !== 'cart' && page !== 'checkout' && page !== 'order-confirmation' && (
        <div 
          onClick={() => setPage('cart')}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded bg-orange-500 text-white shadow-lg hover:scale-105 transition-transform cursor-pointer hover:bg-orange-600 shadow-orange-500/20"
        >
          <ShoppingBag className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-black text-orange-600 border border-orange-200 shadow-sm">
            {cartTotalItems}
          </span>
        </div>
      )}

      {}
      <main className="flex-1 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            
            {page === 'home' && (
              <>
                {}
                <Hero
                  onSecureSlotClick={() => {
                    setSelectedEvent(nearestEvent);
                    setPage('register');
                  }}
                  onViewCalendarClick={() => setPage('events')}
                  targetEventTimestamp={nearestEvent ? new Date(nearestEvent.date).getTime() : new Date().getTime()}
                />
                
                {}
                <UpcomingEvents
                  events={events}
                  onViewDetailsClick={(event) => {
                    setSelectedEvent(event);
                    setPage('event-details');
                  }}
                  onViewAllClick={() => setPage('events')}
                />

                <FeaturedGallery />
                
                <BibsAndMerch 
                  products={mockProducts} 
                  onProductClick={(product) => {
                    setSelectedProduct(product);
                    setPage('product-details');
                  }}
                  onViewAllClick={() => setPage('store')}
                />
                
              </>
            )}

            {page === 'events' && (
              <EventsPage
                events={events}
                onBack={() => setPage('home')}
                onRegisterClick={(event) => {
                  setSelectedEvent(event);
                  setPage('register');
                }}
                onLearnMoreClick={(event) => {
                  setSelectedEvent(event);
                  setPage('event-details');
                }}
                onViewResultsClick={(event) => {
                  setSelectedEvent(event);
                  setPage('event-results');
                }}
              />
            )}

            {page === 'event-details' && selectedEvent && (
              <EventDetailsPage
                event={selectedEvent}
                onBack={() => setPage('events')}
                onRegisterClick={(ev) => {
                  setSelectedEvent(ev);
                  setPage('register');
                }}
              />
            )}

            {page === 'event-results' && selectedEvent && (
              <EventResultsPage
                event={selectedEvent}
                onBack={() => setPage('events')}
              />
            )}

            {page === 'register' && (
              <RegistrationPage
                event={selectedEvent}
                onRegisterComplete={handleRegisterComplete}
                onBack={() => {
                  if (selectedEvent) setPage('event-details');
                  else setPage('events');
                }}
              />
            )}

            {page === 'store' && (
              <StorePage
                products={mockProducts}
                cartCount={cartTotalItems}
                onProductClick={(product) => {
                  setSelectedProduct(product);
                  setPage('product-details');
                }}
                onAddToCart={(product) => handleAddToCart(product)}
                onViewCartClick={() => setPage('cart')}
              />
            )}

            {page === 'product-details' && selectedProduct && (
              <ProductDetailsPage
                product={selectedProduct}
                onBack={() => setPage('store')}
                onAddToCart={() => handleAddToCart(selectedProduct)}
              />
            )}

            {page === 'cart' && (
              <CartPage
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateCartQuantity}
                onRemoveItem={handleRemoveCartItem}
                onBackToStore={() => setPage('store')}
                onCheckout={() => setPage('checkout')}
              />
            )}

            {page === 'checkout' && (
              <CheckoutPage
                cartItems={cartItems}
                onBack={() => setPage('cart')}
                onOrderSuccess={(order) => {
                  setConfirmedOrder(order);
                  setCartItems([]); 
                  setPage('order-confirmation');
                }}
              />
            )}

            {page === 'order-confirmation' && confirmedOrder && (
              <OrderConfirmationPage
                orderInfo={confirmedOrder}
                onContinueShopping={() => setPage('store')}
              />
            )}

            {page === 'gallery' && (
              <GalleryPage />
            )}

            {page === 'news' && (
              <NewsPage
                articles={mockArticles}
                onArticleClick={(article) => {
                  setSelectedArticle(article);
                  setPage('article-details');
                }}
              />
            )}

            {page === 'article-details' && selectedArticle && (
              <ArticleDetailsPage
                article={selectedArticle}
                onBack={() => setPage('news')}
                onNavigateToArticle={(art) => {
                  setSelectedArticle(art);
                  setPage('article-details');
                }}
              />
            )}

            {page === 'contact' && (
              <ContactPage />
            )}

            {page === 'coaching' && (
              <div className="py-16 md:py-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <span className="rounded-full bg-orange-50 px-4 py-1 text-xs font-extrabold tracking-widest text-orange-600 border border-orange-200 uppercase">
                    COACHING PORTAL
                  </span>
                  <h1 className="mt-6 font-display text-4xl font-black leading-tight text-zinc-900 sm:text-5xl md:text-6xl">
                    Professional Coaching.<br/>Personal Breakthroughs.
                  </h1>
                  <p className="mt-4 text-zinc-500 text-sm md:text-base leading-relaxed">
                    Work with elite runners and certified coaches who build tailored plans around your body, lifestyle, and racing objectives.
                  </p>
                </div>

                {}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                  {}
                  <div className="rounded border border-zinc-200 bg-white overflow-hidden p-6 hover:border-orange-200 transition-all flex flex-col justify-between shadow-sm hover:shadow-md">
                    <div>
                      <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&h=300&q=80"
                        alt="Coach Dan"
                        className="h-32 w-32 rounded-full object-cover border-2 border-zinc-100 mx-auto mb-6 shadow-sm"
                      />
                      <h3 className="text-xl font-bold text-zinc-900 text-center">Coach Dan</h3>
                      <p className="text-[10px] text-zinc-500 font-extrabold uppercase text-center tracking-widest mt-1">Marathon & Ultra Specialist</p>
                      
                      <div className="border-t border-zinc-100 my-4 pt-4 text-xs space-y-2 text-zinc-650">
                        <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-orange-500 flex-shrink-0" /> Over 15 years running experience</p>
                        <p className="flex items-center gap-2"><Award className="h-4 w-4 text-orange-500 flex-shrink-0" /> Qualified sub-2:30 marathoner</p>
                        <p className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-orange-500 flex-shrink-0" /> Focuses on aerobic engine & mindset</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCoach('Coach Dan');
                        setPage('book-consultation');
                      }}
                      className="w-full rounded bg-orange-500 py-3.5 mt-4 text-xs font-bold text-white hover:bg-orange-600 transition-all cursor-pointer uppercase tracking-wider shadow-md shadow-orange-500/10"
                    >
                      Book Consultation
                    </button>
                  </div>

                  {}
                  <div className="rounded border border-zinc-200 bg-white overflow-hidden p-6 hover:border-orange-200 transition-all flex flex-col justify-between shadow-sm hover:shadow-md">
                    <div>
                      <img
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&h=300&q=80"
                        alt="Coach Clara"
                        className="h-32 w-32 rounded-full object-cover border-2 border-zinc-100 mx-auto mb-6 shadow-sm"
                      />
                      <h3 className="text-xl font-bold text-zinc-900 text-center">Coach Clara</h3>
                      <p className="text-[10px] text-zinc-500 font-extrabold uppercase text-center tracking-widest mt-1">Trail Running & Core Stability</p>
                      
                      <div className="border-t border-zinc-100 my-4 pt-4 text-xs space-y-2 text-zinc-650">
                        <p className="flex items-center gap-2"><Activity className="h-4 w-4 text-orange-500 flex-shrink-0" /> Specialized in biomechanics & core</p>
                        <p className="flex items-center gap-2"><Award className="h-4 w-4 text-orange-500 flex-shrink-0" /> Completed multiple 100-mile trail races</p>
                        <p className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-orange-500 flex-shrink-0" /> Focuses on posture, agility & recovery</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCoach('Coach Clara');
                        setPage('book-consultation');
                      }}
                      className="w-full rounded bg-orange-500 py-3.5 mt-4 text-xs font-bold text-white hover:bg-orange-600 transition-all cursor-pointer uppercase tracking-wider shadow-md shadow-orange-500/10"
                    >
                      Book Consultation
                    </button>
                  </div>

                  {}
                  <div className="rounded border border-zinc-200 bg-white overflow-hidden p-6 hover:border-orange-200 transition-all flex flex-col justify-between shadow-sm hover:shadow-md">
                    <div>
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80"
                        alt="Coach Alex"
                        className="h-32 w-32 rounded-full object-cover border-2 border-zinc-100 mx-auto mb-6 shadow-sm"
                      />
                      <h3 className="text-xl font-bold text-zinc-900 text-center">Coach Alex</h3>
                      <p className="text-[10px] text-zinc-500 font-extrabold uppercase text-center tracking-widest mt-1">V02 Max & Track Speed</p>
                      
                      <div className="border-t border-zinc-100 my-4 pt-4 text-xs space-y-2 text-zinc-650">
                        <p className="flex items-center gap-2"><Activity className="h-4 w-4 text-orange-500 flex-shrink-0" /> Certified Track & Field athletics coach</p>
                        <p className="flex items-center gap-2"><Award className="h-4 w-4 text-orange-500 flex-shrink-0" /> Sub-15 minute 5,000m specialist</p>
                        <p className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-orange-500 flex-shrink-0" /> Focuses on lactate threshold & sprints</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCoach('Coach Alex');
                        setPage('book-consultation');
                      }}
                      className="w-full rounded bg-orange-500 py-3.5 mt-4 text-xs font-bold text-white hover:bg-orange-600 transition-all cursor-pointer uppercase tracking-wider shadow-md shadow-orange-500/10"
                    >
                      Book Consultation
                    </button>
                  </div>
                </div>

                <div className="rounded border border-orange-100 bg-gradient-to-r from-orange-50 to-orange-100/30 p-8 text-center shadow-sm">
                  <h4 className="text-lg font-bold text-zinc-900 mb-2">Not sure which coach is right for you?</h4>
                  <p className="text-xs text-zinc-650 mb-6">Take our placement program and schedule a session with our panel organizer.</p>
                  <button
                    onClick={() => {
                      setSelectedCoach('Runnicle Head Coach');
                      setPage('book-consultation');
                    }}
                    className="rounded bg-orange-500 px-6 py-2.5 text-xs font-bold text-white hover:bg-orange-600 transition-all cursor-pointer shadow-md shadow-orange-500/10"
                  >
                    Match Me Now
                  </button>
                </div>
              </div>
            )}

            {page === 'training' && (
              <div className="py-16 md:py-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <span className="rounded-full bg-orange-50 px-4 py-1 text-xs font-extrabold tracking-widest text-orange-600 border border-orange-200 uppercase">
                    TRAINING ZONE
                  </span>
                  <h1 className="mt-6 font-display text-4xl font-black leading-tight text-zinc-900 sm:text-5xl md:text-6xl">
                    Personalized Training Plans.
                  </h1>
                  <p className="mt-4 text-zinc-500 text-sm md:text-base leading-relaxed">
                    Choose your race distance and running experience level below to generate a tailored 4-week sample training cycle.
                  </p>
                </div>

                {}
                <div className="rounded-3xl border border-zinc-200 bg-white p-6 md:p-8 max-w-4xl mx-auto mb-12 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    
                    {}
                    <div>
                      <label className="block text-xs font-black text-zinc-900 uppercase tracking-widest mb-3">Target Distance</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {['5K', '10K', 'Half', 'Full'].map((dist) => (
                          <button
                            key={dist}
                            type="button"
                            onClick={() => {
                              const fullName = dist === 'Half' ? 'Half Marathon' : dist === 'Full' ? 'Full Marathon' : dist;
                              setPlanDistance(fullName);
                              setGeneratedPlan(null);
                            }}
                            className={`rounded-full border py-2.5 text-center text-[10px] font-black tracking-wider uppercase transition-all cursor-pointer ${
                              planDistance === (dist === 'Half' ? 'Half Marathon' : dist === 'Full' ? 'Full Marathon' : dist)
                                ? 'bg-black text-white border-black shadow-sm'
                                : 'border-zinc-200 text-zinc-600 bg-white hover:border-black hover:text-black'
                            }`}
                          >
                            {dist}
                          </button>
                        ))}
                      </div>
                    </div>

                    {}
                    <div>
                      <label className="block text-xs font-black text-zinc-900 uppercase tracking-widest mb-3">Fitness Level</label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => {
                              setPlanLevel(lvl);
                              setGeneratedPlan(null);
                            }}
                            className={`rounded-full border py-2.5 text-center text-[10px] font-black tracking-wider uppercase transition-all cursor-pointer ${
                              planLevel === lvl
                                ? 'bg-black text-white border-black shadow-sm'
                                : 'border-zinc-200 text-zinc-600 bg-white hover:border-black hover:text-black'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  <button
                    onClick={handleGeneratePlan}
                    className="w-full rounded-full bg-black py-3.5 text-xs font-black text-white hover:bg-zinc-900 active:scale-98 transition-all duration-200 cursor-pointer uppercase tracking-widest shadow-md shadow-black/10"
                  >
                    Generate 4-Week Plan
                  </button>
                </div>

                {}
                <AnimatePresence>
                  {generatedPlan && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.4 }}
                      className="max-w-4xl mx-auto"
                    >
                      <h3 className="text-xl font-black text-zinc-900 mb-6 text-center tracking-tight flex items-center justify-center gap-2">
                        <Activity className="h-5 w-5 text-orange-500" />
                        Custom {planDistance} Plan ({planLevel})
                      </h3>

                      <div className="space-y-4">
                        {generatedPlan.map((weekData: { week: string; focus: string; runs: string[] }, idx: number) => (
                          <div
                            key={idx}
                            className="rounded-2xl border border-zinc-200 bg-white p-5 hover:border-black transition-all shadow-sm"
                          >
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-zinc-150 pb-3 mb-4 gap-2">
                              <span className="font-display font-black text-zinc-900 text-base uppercase tracking-tight">{weekData.week}</span>
                              <span className="text-[9px] text-orange-600 font-extrabold bg-orange-50 border border-orange-100 rounded-full px-3 py-0.5 uppercase tracking-wider">{weekData.focus}</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              {weekData.runs.map((run: string, rIdx: number) => (
                                <div key={rIdx} className="rounded-xl bg-zinc-50 border border-zinc-150 p-3 text-xs text-zinc-700 font-semibold">
                                  {run}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 text-center">
                        <button
                          onClick={() => {
                            setSelectedEvent(null);
                            setPage('register');
                          }}
                          className="rounded-full bg-black px-8 py-3.5 text-xs font-black text-white hover:bg-zinc-900 transition-all cursor-pointer uppercase tracking-widest shadow-md shadow-black/10"
                        >
                          Export Full Plan to Email
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {page === 'book-consultation' && (
              <CoachBookingPage
                coachName={selectedCoach}
                onBack={() => setPage('coaching')}
              />
            )}

            {page === 'admin-login' && (
              <AdminPage
                view="login"
                events={events}
                onAddEvent={handleAddEvent}
                onUpdateEvents={handleUpdateEvents}
                registrations={registrations}
                onUpdateRegistrations={handleUpdateRegistrations}
                onBackToHome={() => setPage('home')}
                onNavigate={(route) => setPage(route)}
                onLoginSuccess={() => setPage('admin-dashboard')}
                onSelectReg={handleSelectReg}
              />
            )}

            {page === 'admin-dashboard' && (
              <AdminPage
                view="dashboard"
                events={events}
                onAddEvent={handleAddEvent}
                onUpdateEvents={handleUpdateEvents}
                registrations={registrations}
                onUpdateRegistrations={handleUpdateRegistrations}
                onBackToHome={() => setPage('home')}
                onNavigate={(route) => setPage(route)}
                onLoginSuccess={() => setPage('admin-dashboard')}
                onSelectReg={handleSelectReg}
              />
            )}

            {page === 'admin-registrations' && (
              <AdminPage
                view="registrations"
                events={events}
                onAddEvent={handleAddEvent}
                onUpdateEvents={handleUpdateEvents}
                registrations={registrations}
                onUpdateRegistrations={handleUpdateRegistrations}
                onBackToHome={() => setPage('home')}
                onNavigate={(route) => setPage(route)}
                onLoginSuccess={() => setPage('admin-dashboard')}
                onSelectReg={handleSelectReg}
              />
            )}

            {page === 'admin-events' && (
              <AdminPage
                view="events"
                events={events}
                onAddEvent={handleAddEvent}
                onUpdateEvents={handleUpdateEvents}
                registrations={registrations}
                onUpdateRegistrations={handleUpdateRegistrations}
                onBackToHome={() => setPage('home')}
                onNavigate={(route) => setPage(route)}
                onLoginSuccess={() => setPage('admin-dashboard')}
                onSelectReg={handleSelectReg}
              />
            )}

            {page === 'admin-create-event' && (
              <AdminPage
                view="create-event"
                events={events}
                onAddEvent={handleAddEvent}
                onUpdateEvents={handleUpdateEvents}
                registrations={registrations}
                onUpdateRegistrations={handleUpdateRegistrations}
                onBackToHome={() => setPage('home')}
                onNavigate={(route) => setPage(route)}
                onLoginSuccess={() => setPage('admin-dashboard')}
                onSelectReg={handleSelectReg}
              />
            )}

            {page === 'admin-registration-details' && (
              <AdminPage
                view="registration-details"
                selectedRegId={selectedRegId}
                events={events}
                onAddEvent={handleAddEvent}
                onUpdateEvents={handleUpdateEvents}
                registrations={registrations}
                onUpdateRegistrations={handleUpdateRegistrations}
                onBackToHome={() => setPage('home')}
                onNavigate={(route) => setPage(route)}
                onLoginSuccess={() => setPage('admin-dashboard')}
                onSelectReg={handleSelectReg}
              />
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {}
      {!['admin-login', 'admin-dashboard', 'admin-registrations', 'admin-events', 'admin-create-event', 'admin-registration-details'].includes(page) && (
        <Footer onPlatformClick={(item) => {
          if (item === 'Dashboard') setPage('home');
          else if (item === 'Events') setPage('events');
          else if (item === 'Gallery') setPage('gallery');
          else if (item === 'Merch') setPage('store');
          else if (item === 'Contact') setPage('contact');
        }} />
      )}

      {}
      <Modal
        isOpen={selectedPost !== null}
        onClose={() => setSelectedPost(null)}
        title={selectedPost ? `Feed details - @${selectedPost.username}` : ''}
      >
        {selectedPost && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
            {}
            <div className="relative aspect-square rounded-lg overflow-hidden bg-zinc-50 border border-zinc-100 flex items-center justify-center shadow-inner">
              <img
                src={selectedPost.image}
                alt={selectedPost.caption}
                className="h-full w-full object-cover"
              />
            </div>

            {}
            <div className="flex flex-col h-full justify-between max-h-[500px]">
              
              <div className="border-b border-zinc-200 pb-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={selectedPost.userAvatar}
                    alt={selectedPost.username}
                    className="h-8 w-8 rounded-full border border-zinc-200 object-cover"
                  />
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block">@{selectedPost.username}</span>
                    <span className="text-[10px] text-zinc-500 font-medium block">{selectedPost.date}</span>
                  </div>
                </div>
                <p className="text-xs text-zinc-650 font-medium leading-relaxed">
                  {selectedPost.caption}
                </p>
              </div>

              {}
              <div className="flex-1 overflow-y-auto mb-4 pr-1.5 space-y-3 max-h-[220px]">
                {selectedPost.comments.length === 0 ? (
                  <p className="text-[11px] text-zinc-500 font-medium py-4 text-center">No comments yet. Be the first to cheer them on!</p>
                ) : (
                  selectedPost.comments.map((c, idx) => (
                    <div key={idx} className="text-[11px] font-medium leading-relaxed bg-zinc-50 p-2.5 rounded border border-zinc-150">
                      <span className="text-zinc-900 font-bold block mb-0.5">@{c.user}</span>
                      <span className="text-zinc-600">{c.text}</span>
                    </div>
                  ))
                )}
              </div>

              {}
              <div className="border-t border-zinc-150 pt-4 mt-auto">
                <div className="flex items-center gap-3.5 text-xs text-zinc-900 mb-4">
                  <button
                    onClick={() => handleToggleLike(selectedPost.id)}
                    className="flex items-center gap-1.5 hover:text-red-500 transition-colors font-bold cursor-pointer"
                  >
                    <Heart className={`h-4.5 w-4.5 ${
                      (selectedPost as any).hasLiked ? 'fill-red-500 stroke-red-500' : 'text-zinc-450 hover:text-red-500'
                    }`} />
                    <span>{selectedPost.likes} Likes</span>
                  </button>
                  <span className="text-zinc-300 font-medium">|</span>
                  <span className="text-zinc-600 font-medium">{selectedPost.comments.length} Comments</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddComment(selectedPost.id);
                    }}
                    placeholder="Write a comment..."
                    className="flex-1 rounded border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 placeholder-zinc-450 focus:border-orange-500 focus:outline-none"
                  />
                  <button
                    onClick={() => handleAddComment(selectedPost.id)}
                    className="rounded bg-orange-500 px-4 py-2 text-xs font-bold text-white hover:bg-orange-600 transition-colors uppercase tracking-wider cursor-pointer"
                  >
                    Post
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};
export default App;
