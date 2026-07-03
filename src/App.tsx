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

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import UpcomingEvents from './components/UpcomingEvents';
import CommunityPulse from './components/CommunityPulse';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import Modal from './components/Modal';

// Pages
import EventDetailsPage from './pages/EventDetailsPage';
import RegistrationPage from './pages/RegistrationPage';
import CoachBookingPage from './pages/CoachBookingPage';
import ProductDetailsPage from './pages/ProductDetailsPage';

// Expanded Feature Pages
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

// Centralized Database
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

export const App: React.FC = () => {
  // Page Routing State
  const [page, setPage] = useState<string>('home');

  // Scroll to top on page change
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [page]);
  
  // Shopping Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Detail context states
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCoach, setSelectedCoach] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // E-Commerce Order Confirmation details state
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);

  // Lightweight post comment lightbox overlay (Community pulse)
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(mockCommunityPosts);
  const [newCommentText, setNewCommentText] = useState<string>('');

  // Training Plan Generator state
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

  // Dynamically calculate nearest upcoming event from database for Countdown
  const getNearestUpcomingEvent = () => {
    const now = new Date().getTime();
    const upcoming = mockEvents.filter(e => e.badge !== 'PAST EVENT');
    
    // Sort chronological
    const sorted = [...upcoming].sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      return timeA - timeB;
    });

    const nearest = sorted.find(e => new Date(e.date).getTime() > now) || sorted[0] || mockEvents[0];
    return nearest;
  };

  const nearestEvent = getNearestUpcomingEvent();

  // Helper determining active navbar tab highlighted state
  const getNavbarActiveTab = () => {
    if (page === 'home') return 'Community';
    if (['events', 'event-details', 'event-results', 'register'].includes(page)) return 'Events';
    if (page === 'gallery') return 'Gallery';
    if (page === 'contact') return 'Contact';
    return 'Community';
  };

  // Nav tab clicked handler
  const handleTabChange = (tab: string) => {
    if (tab === 'Community') setPage('home');
    else if (tab === 'Events') setPage('events');
    else if (tab === 'Gallery') setPage('gallery');
    else if (tab === 'Contact') setPage('contact');
  };

  // Add Item to Cart
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

  // Update Cart Qty
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

  // Remove item
  const handleRemoveCartItem = (idx: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== idx));
  };

  // Submit dynamic comment inside lightbox modal
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
    
    // Update selectedPost view
    const postToUpdate = updated.find(p => p.id === postId);
    if (postToUpdate) {
      setSelectedPost(postToUpdate);
    }
    
    setNewCommentText('');
  };

  // Toggle like inside lightbox
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

  // Cart total items count
  const cartTotalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-800 antialiased selection:bg-orange-500 selection:text-white">
      
      {/* Dynamic Navbar */}
      <Navbar
        activeTab={getNavbarActiveTab()}
        setActiveTab={handleTabChange}
        onJoinClick={() => {
          setSelectedEvent(null);
          setPage('register');
        }}
      />

      {/* Cart Badge float */}
      {cartTotalItems > 0 && page !== 'cart' && page !== 'checkout' && page !== 'order-confirmation' && (
        <div 
          onClick={() => setPage('cart')}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg hover:scale-105 transition-transform cursor-pointer hover:bg-orange-600 shadow-orange-500/20"
        >
          <ShoppingBag className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-black text-orange-600 border border-orange-200 shadow-sm">
            {cartTotalItems}
          </span>
        </div>
      )}

      {/* Content router */}
      <main className="flex-1">
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
                {/* Real-time Event Countdown */}
                <Hero
                  onSecureSlotClick={() => {
                    setSelectedEvent(nearestEvent);
                    setPage('register');
                  }}
                  onViewCalendarClick={() => setPage('events')}
                  targetEventName={nearestEvent.title}
                  targetEventDate={nearestEvent.date}
                  targetEventDeadline={nearestEvent.deadline}
                  targetEventTimestamp={new Date(nearestEvent.date).getTime()}
                />
                
                {/* Event previews */}
                <UpcomingEvents
                  onViewDetailsClick={(event) => {
                    setSelectedEvent(event);
                    setPage('event-details');
                  }}
                  onViewAllClick={() => setPage('events')}
                />

                {/* Asymmetric Campaign Banner: Mission and Vision */}
                <section className="relative bg-zinc-900 text-white py-24 overflow-hidden select-none">
                  <div className="absolute inset-0 opacity-30">
                    <img
                      src="https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&w=1600&q=80"
                      alt="Athletes running a marathon on the road"
                      className="w-full h-full object-cover filter grayscale contrast-125"
                    />
                  </div>
                  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10 flex flex-col items-start text-left max-w-2xl">
                    <span className="font-mono text-[9px] font-black tracking-widest text-brand uppercase">
                      [ CORE SYSTEM // MISSION & VISION ]
                    </span>
                    <h2 className="mt-4 font-display text-5xl sm:text-6xl font-black uppercase tracking-tight leading-[0.95] text-white">
                      EMPOWERING EVERY RUNNER.
                    </h2>
                    <p className="mt-4 font-mono text-[10px] tracking-wide text-zinc-300 leading-relaxed uppercase">
                      // TO CULTIVATE A THRIVING, INCLUSIVE ATHLETIC COMMUNITY ACROSS BACOLOD AND THE PHILIPPINES. WE ARE COMMITTED TO DELIVERING CERTIFIED HIGH-PERFORMANCE RACE TIMING TECHNOLOGY, TAILORED TRAINING PLANS, AND GRASSROOTS RUNNING INITIATIVES THAT EMPOWER EVERY LOCAL ATHLELE TO ACHIEVE THEIR PERSONAL BEST.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedEvent(null);
                        setPage('register');
                      }}
                      className="mt-8 bg-brand hover:bg-brand-hover text-white text-[10px] font-mono font-black tracking-widest uppercase px-8 py-3.5 transition-all cursor-pointer flex items-center justify-center gap-1.5 group"
                    >
                      <span>JOIN THE MOVEMENT</span>
                      <span className="group-hover:translate-x-1 transition-transform duration-200">{"[>]"}</span>
                    </button>
                  </div>
                </section>
                
                {/* Image hover feeds */}
                <CommunityPulse
                  onPostClick={(post) => setSelectedPost(post)}
                />
                
                <Newsletter />
              </>
            )}

            {page === 'events' && (
              <EventsPage
                events={mockEvents}
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
                  setCartItems([]); // Clear cart
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

                {/* Coaches list */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                  {/* Coach 1 */}
                  <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden p-6 hover:border-orange-200 transition-all flex flex-col justify-between shadow-sm hover:shadow-md">
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
                      className="w-full rounded-md bg-orange-500 py-3.5 mt-4 text-xs font-bold text-white hover:bg-orange-600 transition-all cursor-pointer uppercase tracking-wider shadow-md shadow-orange-500/10"
                    >
                      Book Consultation
                    </button>
                  </div>

                  {/* Coach 2 */}
                  <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden p-6 hover:border-orange-200 transition-all flex flex-col justify-between shadow-sm hover:shadow-md">
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
                      className="w-full rounded-md bg-orange-500 py-3.5 mt-4 text-xs font-bold text-white hover:bg-orange-600 transition-all cursor-pointer uppercase tracking-wider shadow-md shadow-orange-500/10"
                    >
                      Book Consultation
                    </button>
                  </div>

                  {/* Coach 3 */}
                  <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden p-6 hover:border-orange-200 transition-all flex flex-col justify-between shadow-sm hover:shadow-md">
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
                      className="w-full rounded-md bg-orange-500 py-3.5 mt-4 text-xs font-bold text-white hover:bg-orange-600 transition-all cursor-pointer uppercase tracking-wider shadow-md shadow-orange-500/10"
                    >
                      Book Consultation
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-orange-100 bg-gradient-to-r from-orange-50 to-orange-100/30 p-8 text-center shadow-sm">
                  <h4 className="text-lg font-bold text-zinc-900 mb-2">Not sure which coach is right for you?</h4>
                  <p className="text-xs text-zinc-650 mb-6">Take our placement program and schedule a session with our panel organizer.</p>
                  <button
                    onClick={() => {
                      setSelectedCoach('Runnicle Head Coach');
                      setPage('book-consultation');
                    }}
                    className="rounded-full bg-orange-500 px-6 py-2.5 text-xs font-bold text-white hover:bg-orange-600 transition-all cursor-pointer shadow-md shadow-orange-500/10"
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

                {/* Plan Generator Form UI */}
                <div className="rounded-3xl border border-zinc-200 bg-white p-6 md:p-8 max-w-4xl mx-auto mb-12 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    
                    {/* Distance Option */}
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

                    {/* Level Option */}
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

                {/* Generated Plan Output */}
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

          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer localization */}
      <Footer onPlatformClick={(item) => {
        if (item === 'Event Calendar') setPage('events');
        else if (item === 'Contact Us') setPage('contact');
        else {
          alert(`You clicked ${item}. This is a demonstration link with placeholder content.`);
        }
      }} />

      {/* Lightweight comment lightbox modal overlay */}
      <Modal
        isOpen={selectedPost !== null}
        onClose={() => setSelectedPost(null)}
        title={selectedPost ? `Feed details - @${selectedPost.username}` : ''}
      >
        {selectedPost && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden">
            {/* Post image */}
            <div className="relative aspect-square rounded-lg overflow-hidden bg-zinc-50 border border-zinc-100 flex items-center justify-center shadow-inner">
              <img
                src={selectedPost.image}
                alt={selectedPost.caption}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Right side comments */}
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

              {/* Comments stream */}
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

              {/* Likes and form */}
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
