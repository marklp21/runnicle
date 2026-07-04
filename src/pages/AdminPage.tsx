import React, { useState } from 'react';
import { 
  Lock, 
  Search, 
  Download, 
  Trash2, 
  Check, 
  X, 
  AlertCircle, 
  Filter, 
  DollarSign, 
  Users, 
  Sparkles,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Printer,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type EventItem } from '../data/mockData';

// Preset image lists for beautiful cards
const coverPresets = [
  {
    name: 'Neon Night Run',
    url: 'https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&w=800&q=80',
    description: 'Neon lighting & urban streets'
  },
  {
    name: 'Mountain Peak Trail',
    url: 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&w=800&q=80',
    description: 'Lush trails and steep ridges'
  },
  {
    name: 'Ocean Coastal Route',
    url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80',
    description: 'Seaside breeze & flat courses'
  },
  {
    name: 'Sunset Urban Circuit',
    url: 'https://images.unsplash.com/photo-1533560904424-a0c61dc306fc?auto=format&fit=crop&w=800&q=80',
    description: 'Golden hour city vibes'
  }
];

interface AdminPageProps {
  view: 'login' | 'dashboard' | 'registrations' | 'events' | 'create-event' | 'registration-details';
  selectedRegId?: string | null;
  events: EventItem[];
  onAddEvent: (event: EventItem) => void;
  onUpdateEvents?: (newEvents: EventItem[]) => void;
  registrations: any[];
  onUpdateRegistrations: (newRegs: any[]) => void;
  onBackToHome: () => void;
  onNavigate: (page: string) => void;
  onLoginSuccess: () => void;
  onSelectReg?: (id: string | null) => void;
}

export const sha256 = async (text: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const AdminPage: React.FC<AdminPageProps> = ({
  view,
  selectedRegId,
  events,
  onAddEvent,
  onUpdateEvents,
  registrations,
  onUpdateRegistrations,
  onBackToHome,
  onNavigate,
  onLoginSuccess,
  onSelectReg
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Spreadsheet view filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventFilter, setSelectedEventFilter] = useState('');
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('');

  // Custom Event Gallery Photos State
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([]);

  // Event editing state
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  // Uploader error message state
  const [uploaderError, setUploaderError] = useState<string | null>(null);

  // Distance specific routes state
  const [distanceRoutes, setDistanceRoutes] = useState<Record<string, string>>({});

  // Form wizard step tracker state
  const [formStep, setFormStep] = useState<1 | 2>(1);

  // Mobile menu responsiveness toggler
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Custom single file upload states
  const [routeMapPhoto, setRouteMapPhoto] = useState<string>('');
  const [kitPhoto, setKitPhoto] = useState<string>('');

  // Create Event Form state
  const [newEvent, setNewEvent] = useState({
    title: '',
    badge: 'OPEN' as 'OPEN' | 'CLOSING SOON' | 'SOLD OUT' | 'PAST EVENT',
    date: '',
    time: '05:00 AM',
    deadline: '',
    location: '',
    fee: '₱1,200.00',
    slotsLimit: 500,
    description: '',
    route: '',
    distances: [] as string[],
    perks: 'Timing Chip, Finisher Medal, Event Singlet',
    highlights: 'Certified race course, Fully loaded hydrations, Post-race concert',
    image: coverPresets[0].url,
    iconType: 'compass' as 'compass' | 'mountain' | 'drop'
  });
  const [successToast, setSuccessToast] = useState('');

  // Handle Login Authentication securely
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsAuthenticating(true);

    try {
      const uHash = await sha256(username);
      const pHash = await sha256(password);

      // Verify hashes
      // admin -> 8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918
      // runnicle-secret-2026 -> 84e027a0d5ecfe03fdd832e4c34e72efa4b12b6fab8378a0e97a293e29ce35b1
      if (
        uHash === '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918' &&
        pHash === '84e027a0d5ecfe03fdd832e4c34e72efa4b12b6fab8378a0e97a293e29ce35b1'
      ) {
        if (rememberMe) {
          localStorage.setItem('runnicle_admin_logged', 'true');
        } else {
          sessionStorage.setItem('runnicle_admin_logged', 'true');
        }
        onLoginSuccess();
      } else {
        setErrorMsg('Invalid username or password.');
      }
    } catch (err) {
      setErrorMsg('Authentication error. Try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('runnicle_admin_logged');
    localStorage.removeItem('runnicle_admin_logged');
    setUsername('');
    setPassword('');
    onNavigate('admin-login');
  };

  // Manage registrations state actions
  const handleVerifyStatus = (id: string, newStatus: 'Verified' | 'Pending' | 'Cancelled') => {
    const updated = registrations.map(reg => {
      if (reg.id === id) {
        return { ...reg, status: newStatus };
      }
      return reg;
    });
    onUpdateRegistrations(updated);
    showToast(`Registration status updated to ${newStatus}`);
  };

  const handleDeleteRegistration = (id: string) => {
    if (window.confirm('Are you sure you want to delete this runner registration record?')) {
      const updated = registrations.filter(reg => reg.id !== id);
      onUpdateRegistrations(updated);
      showToast('Registration record deleted');
    }
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast('');
    }, 3000);
  };

  // Event Category Checklist helper
  const handleDistanceCheckboxChange = (distance: string) => {
    setNewEvent(prev => {
      const exists = prev.distances.includes(distance);
      if (exists) {
        setDistanceRoutes(routes => {
          const next = { ...routes };
          delete next[distance];
          return next;
        });
        return { ...prev, distances: prev.distances.filter(d => d !== distance) };
      } else {
        return { ...prev, distances: [...prev.distances, distance] };
      }
    });
  };

  // Create & Edit Event Submit
  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date || !newEvent.location || newEvent.distances.length === 0) {
      alert('Please fill out all required fields and check at least one distance.');
      return;
    }

    if (galleryPhotos.length === 0) {
      alert('Please upload at least one photo from your folders to serve as the event cover image.');
      return;
    }

    const cleanFee = newEvent.fee.startsWith('₱') ? newEvent.fee : `₱${newEvent.fee}`;
    const firstRoute = newEvent.distances.length > 0 ? (distanceRoutes[newEvent.distances[0]] || 'Official Course Route Loop') : 'Official Course Route Loop';

    if (editingEvent) {
      // EDIT MODE
      const updatedEvents = events.map(evt => {
        if (evt.id === editingEvent.id) {
          return {
            ...evt,
            title: newEvent.title,
            badge: newEvent.badge,
            distances: newEvent.distances,
            date: newEvent.date,
            deadline: newEvent.deadline || newEvent.date,
            location: newEvent.location,
            description: newEvent.description || `Experience the ultimate running event: ${newEvent.title} in ${newEvent.location}.`,
            highlights: newEvent.highlights ? newEvent.highlights.split(',').map(h => h.trim()) : [],
            details: {
              ...evt.details,
              time: newEvent.time,
              fee: cleanFee,
              route: firstRoute,
              routes: distanceRoutes,
              slotsLeft: newEvent.slotsLimit,
              perks: newEvent.perks ? newEvent.perks.split(',').map(p => p.trim()) : ['Timing Chip', 'Finisher Medal']
            },
            iconType: newEvent.iconType,
            image: galleryPhotos[0],
            galleryImages: galleryPhotos,
            routeMapImage: routeMapPhoto || undefined,
            kitImage: kitPhoto || undefined
          };
        }
        return evt;
      });

      if (onUpdateEvents) {
        onUpdateEvents(updatedEvents);
      }
      showToast(`Successfully updated event: "${newEvent.title}"`);
      setEditingEvent(null);
    } else {
      // CREATE MODE
      const eventId = `event-generated-${Date.now()}`;
      const formattedEvent: EventItem = {
        id: eventId,
        title: newEvent.title,
        badge: newEvent.badge,
        distances: newEvent.distances,
        date: newEvent.date,
        deadline: newEvent.deadline || newEvent.date,
        location: newEvent.location,
        description: newEvent.description || `Experience the ultimate running event: ${newEvent.title} in ${newEvent.location}.`,
        highlights: newEvent.highlights ? newEvent.highlights.split(',').map(h => h.trim()) : [],
        details: {
          time: newEvent.time,
          fee: cleanFee,
          route: firstRoute,
          routes: distanceRoutes,
          slotsLeft: newEvent.slotsLimit,
          schedule: [
            '04:30 AM - Assembly & Timing Tag Inspection',
            '05:00 AM - Race Gunstart',
            '08:05 AM - Awarding & Post-race Program'
          ],
          perks: newEvent.perks ? newEvent.perks.split(',').map(p => p.trim()) : ['Timing Chip', 'Finisher Medal']
        },
        iconType: newEvent.iconType,
        image: galleryPhotos[0],
        galleryImages: galleryPhotos,
        routeMapImage: routeMapPhoto || undefined,
        kitImage: kitPhoto || undefined
      };

      onAddEvent(formattedEvent);
      showToast(`Successfully created event: "${newEvent.title}"`);
    }
    
    // Reset Form
    setNewEvent({
      title: '',
      badge: 'OPEN',
      date: '',
      time: '05:00 AM',
      deadline: '',
      location: '',
      fee: '₱1,200.00',
      slotsLimit: 500,
      description: '',
      route: '',
      distances: [],
      perks: 'Timing Chip, Finisher Medal, Event Singlet',
      highlights: 'Certified race course, Fully loaded hydrations, Post-race concert',
      image: coverPresets[0].url,
      iconType: 'compass'
    });
    setGalleryPhotos([]);
    setDistanceRoutes({});
    setRouteMapPhoto('');
    setKitPhoto('');
    setFormStep(1);

    // Navigate to respective lists
    if (editingEvent) {
      onNavigate('admin-events');
    } else {
      onNavigate('admin-registrations');
    }
  };

  // Filter registrations list
  const filteredRegistrations = registrations.filter(reg => {
    const fullName = `${reg.firstName || ''} ${reg.lastName || ''}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    const matchesSearch = 
      fullName.includes(query) || 
      (reg.email || '').toLowerCase().includes(query) ||
      (reg.registeredBib || '').toLowerCase().includes(query) ||
      (reg.eventTitle || '').toLowerCase().includes(query);

    const matchesEvent = selectedEventFilter === '' || reg.eventTitle === selectedEventFilter;
    const matchesPayment = selectedPaymentFilter === '' || reg.paymentMethod === selectedPaymentFilter;
    const matchesStatus = selectedStatusFilter === '' || reg.status === selectedStatusFilter;

    return matchesSearch && matchesEvent && matchesPayment && matchesStatus;
  });

  // Calculate stats based on filtered list
  const totalRegistrations = filteredRegistrations.length;
  
  const totalRevenue = filteredRegistrations.reduce((acc, curr) => {
    if (curr.status === 'Cancelled') return acc;
    // Calculate basic revenue, parse fee out of the event or assume standard 1250 if not present
    const feeStr = curr.eventTitle ? (events.find(e => e.title === curr.eventTitle)?.details.fee || '₱1,250.00') : '₱1,250.00';
    const numericFee = parseInt(feeStr.replace(/\D/g, '')) || 0;
    return acc + numericFee;
  }, 0);

  const verifiedCount = filteredRegistrations.filter(r => r.status === 'Verified').length;
  const pendingCount = filteredRegistrations.filter(r => r.status === 'Pending').length;

  // Export to CSV utility
  const exportToCSV = () => {
    if (filteredRegistrations.length === 0) {
      alert('No registrations available to export.');
      return;
    }

    // CSV Headers
    const headers = [
      'ID', 'Bib #', 'First Name', 'Last Name', 'Email', 'Phone', 'Gender', 
      'Event', 'Distance', 'T-Shirt Size', 'Payment Method', 'Reference #', 'Status', 'Date Registered'
    ];

    // CSV Rows
    const rows = filteredRegistrations.map(reg => [
      reg.id || '',
      reg.registeredBib || '',
      reg.firstName || '',
      reg.lastName || '',
      reg.email || '',
      reg.phone || '',
      reg.gender || '',
      reg.eventTitle || '',
      reg.distance || '',
      reg.size || '',
      reg.paymentMethod || '',
      reg.referenceNumber || '',
      reg.status || 'Pending',
      reg.registrationDate ? new Date(reg.registrationDate).toLocaleDateString() : ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `runnicle_registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get distinct event names for filter list
  const distinctEvents = Array.from(new Set(registrations.map(r => r.eventTitle).filter(Boolean)));

  if (view === 'login') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-zinc-50 px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-3xl border border-zinc-200 p-8 shadow-xl relative overflow-hidden">
          {/* Accent decoration */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-brand" />
          
          <div className="text-center mb-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-brand mb-4">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="font-display text-3xl font-black uppercase tracking-tight text-zinc-900">
              Admin Login
            </h2>
            <p className="mt-2 text-xs text-zinc-400 font-mono tracking-widest uppercase">
              Runnicle Timing Core Portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 font-mono">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-900 placeholder-zinc-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand font-mono transition-all"
              />
            </div>

            <div>
              <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 font-mono">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-zinc-200 bg-white pl-4 pr-11 py-3 text-xs text-zinc-900 placeholder-zinc-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand font-mono transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-zinc-450 hover:text-zinc-700 transition-colors focus:outline-none flex items-center justify-center p-1 rounded"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-brand focus:ring-0 cursor-pointer"
                />
                <span className="text-[10px] font-mono font-bold text-zinc-550 uppercase tracking-widest">
                  Remember Me
                </span>
              </label>
            </div>

            {errorMsg && (
              <div className="rounded-lg bg-red-50 border border-red-100 p-3 flex gap-2 text-xs text-red-650 font-semibold leading-relaxed">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full rounded-full bg-brand hover:bg-brand-hover text-white text-xs font-mono font-black tracking-widest uppercase py-3.5 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-brand/10 disabled:opacity-50"
            >
              {isAuthenticating ? 'AUTHENTICATING...' : 'ACCESS PORTAL [>]'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={onBackToHome}
              className="text-[10px] font-mono font-bold text-zinc-400 hover:text-brand transition-colors uppercase tracking-wider"
            >
              [ Back to Website ]
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 select-none">
      {/* Original Style Admin Navbar */}
      <nav className="sticky top-0 z-50 w-full h-16 bg-white border-b border-zinc-200 select-none">
        <div className="w-full h-full flex items-center justify-between pl-0 pr-0">
          {/* Logo / brand */}
          <div className="flex items-center h-full">
            <div className="h-full bg-brand text-white px-6 flex items-center justify-center">
              <span className="font-mono text-sm font-extrabold tracking-[0.25em] uppercase select-none">
                [R]
              </span>
            </div>
            <div className="pl-5 border-l border-zinc-200 h-6 flex items-center">
              <span className="font-mono text-[10px] font-black text-zinc-900 tracking-widest uppercase">
                ADMIN CONSOLE
              </span>
            </div>
          </div>

          {/* Center Tabs Navigation (for desktop views) */}
          {view !== 'registration-details' ? (
            <div className="hidden lg:flex items-center space-x-6">
              <button
                onClick={() => onNavigate('admin-dashboard')}
                className={`font-mono text-[10px] font-black tracking-widest uppercase transition-colors duration-200 cursor-pointer flex items-center gap-1.5 group ${
                  view === 'dashboard' ? 'text-zinc-900 font-extrabold' : 'text-zinc-450 hover:text-zinc-900'
                }`}
              >
                <span>Dashboard</span>
                <span className="text-brand font-light text-[9px] opacity-75 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150 inline-block">
                  [{view === 'dashboard' ? '=' : '>'}]
                </span>
              </button>

              <button
                onClick={() => onNavigate('admin-registrations')}
                className={`font-mono text-[10px] font-black tracking-widest uppercase transition-colors duration-200 cursor-pointer flex items-center gap-1.5 group ${
                  view === 'registrations' ? 'text-zinc-900 font-extrabold' : 'text-zinc-450 hover:text-zinc-900'
                }`}
              >
                <span>Registrations</span>
                <span className="text-brand font-light text-[9px] opacity-75 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150 inline-block">
                  [{view === 'registrations' ? '=' : '>'}]
                </span>
              </button>

              <button
                onClick={() => onNavigate('admin-events')}
                className={`font-mono text-[10px] font-black tracking-widest uppercase transition-colors duration-200 cursor-pointer flex items-center gap-1.5 group ${
                  view === 'events' ? 'text-zinc-900 font-extrabold' : 'text-zinc-450 hover:text-zinc-900'
                }`}
              >
                <span>Events</span>
                <span className="text-brand font-light text-[9px] opacity-75 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150 inline-block">
                  [{view === 'events' ? '=' : '>'}]
                </span>
              </button>

              <button
                onClick={() => onNavigate('admin-create-event')}
                className={`font-mono text-[10px] font-black tracking-widest uppercase transition-colors duration-200 cursor-pointer flex items-center gap-1.5 group ${
                  view === 'create-event' ? 'text-zinc-900 font-extrabold' : 'text-zinc-450 hover:text-zinc-900'
                }`}
              >
                <span>New Event</span>
                <span className="text-brand font-light text-[9px] opacity-75 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150 inline-block">
                  [{view === 'create-event' ? '=' : '>'}]
                </span>
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center text-[10px] font-mono select-none">
              <button 
                onClick={() => onNavigate('admin-registrations')}
                className="text-zinc-450 hover:text-brand transition-colors uppercase font-black tracking-widest flex items-center gap-1.5"
              >
                &lt; Runner Registrations
              </button>
              <span className="text-zinc-300 mx-2.5">/</span>
              <span className="text-zinc-800 font-black uppercase tracking-widest">
                Runner Details
              </span>
            </div>
          )}

          {/* Right Actions Section (for desktop views) */}
          <div className="hidden lg:flex items-center h-full gap-6">
            <button
              onClick={handleLogout}
              className="h-full bg-zinc-950 hover:bg-black text-white text-[10px] font-mono font-black tracking-widest px-8 flex items-center justify-center transition-colors uppercase cursor-pointer"
            >
              Logout
            </button>
          </div>

          {/* Hamburger Menu Icon (for mobile screen views) */}
          <div className="flex lg:hidden pr-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer/Menu content */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              height: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.12, ease: 'linear' }
            }}
            className="lg:hidden overflow-hidden border-t border-zinc-200 bg-white px-4 pt-2 pb-6 space-y-4"
          >
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  onNavigate('admin-dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className={`block rounded-lg px-4 py-3 text-left font-mono text-xs font-bold tracking-widest uppercase transition-colors ${
                  view === 'dashboard'
                    ? 'bg-zinc-50 text-zinc-900'
                    : 'text-zinc-550 hover:bg-zinc-50/50 hover:text-zinc-900'
                }`}
              >
                Dashboard <span className="text-brand font-light text-[9px]">[{view === 'dashboard' ? '=' : '>'}]</span>
              </button>
              
              <button
                onClick={() => {
                  onNavigate('admin-registrations');
                  setIsMobileMenuOpen(false);
                }}
                className={`block rounded-lg px-4 py-3 text-left font-mono text-xs font-bold tracking-widest uppercase transition-colors ${
                  view === 'registrations'
                    ? 'bg-zinc-50 text-zinc-900'
                    : 'text-zinc-550 hover:bg-zinc-50/50 hover:text-zinc-900'
                }`}
              >
                Registrations <span className="text-brand font-light text-[9px]">[{view === 'registrations' ? '=' : '>'}]</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('admin-events');
                  setIsMobileMenuOpen(false);
                }}
                className={`block rounded-lg px-4 py-3 text-left font-mono text-xs font-bold tracking-widest uppercase transition-colors ${
                  view === 'events'
                    ? 'bg-zinc-50 text-zinc-900'
                    : 'text-zinc-550 hover:bg-zinc-50/50 hover:text-zinc-900'
                }`}
              >
                Events <span className="text-brand font-light text-[9px]">[{view === 'events' ? '=' : '>'}]</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('admin-create-event');
                  setIsMobileMenuOpen(false);
                }}
                className={`block rounded-lg px-4 py-3 text-left font-mono text-xs font-bold tracking-widest uppercase transition-colors ${
                  view === 'create-event'
                    ? 'bg-zinc-50 text-zinc-900'
                    : 'text-zinc-550 hover:bg-zinc-50/50 hover:text-zinc-900'
                }`}
              >
                New Event <span className="text-brand font-light text-[9px]">[{view === 'create-event' ? '=' : '>'}]</span>
              </button>
            </div>

            <div className="pt-4 border-t border-zinc-200 flex flex-col gap-2">
              <button
                onClick={handleLogout}
                className="w-full bg-zinc-950 py-3 text-center text-xs font-mono font-black tracking-widest uppercase text-white hover:bg-black transition-colors"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Admin Workspace Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Success Alert Toast */}
        {successToast && (
          <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-zinc-900 border border-zinc-800 text-white px-5 py-4 flex items-center gap-3.5 shadow-2xl font-mono text-xs uppercase tracking-wider animate-fade-in border-l-4 border-l-brand">
            <Sparkles className="h-5 w-5 text-brand" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Content Tabs */}
        {view === 'dashboard' && (
          <div className="space-y-8">
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-orange-50 text-brand flex items-center justify-center flex-shrink-0">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block font-mono">Total Runners</span>
                  <span className="text-xl font-bold text-zinc-900 mt-1 block leading-none">{totalRegistrations}</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block font-mono">Total Revenue</span>
                  <span className="text-xl font-bold text-zinc-900 mt-1 block leading-none">₱{totalRevenue.toLocaleString()}</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block font-mono">Verified Slots</span>
                  <span className="text-xl font-bold text-zinc-900 mt-1 block leading-none">{verifiedCount}</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block font-mono">Pending Review</span>
                  <span className="text-xl font-bold text-zinc-900 mt-1 block leading-none">{pendingCount}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Side: Upcoming Events slots analysis (2 columns wide) */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-zinc-200 p-6 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
                  <div>
                    <h3 className="font-display text-lg font-black text-zinc-900 uppercase tracking-tight">
                      Race Events Overview
                    </h3>
                    <p className="text-[10px] text-zinc-450 mt-0.5 font-mono uppercase tracking-wider">
                      Registration slots and status tracking
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('admin-create-event')}
                    className="rounded-full bg-brand hover:bg-brand-hover text-white text-[9px] font-mono font-black uppercase tracking-widest py-2 px-4 flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                  >
                    + Launch Event
                  </button>
                </div>

                <div className="space-y-4">
                  {events.map((evt) => {
                    const runnersForEvt = registrations.filter(r => r.eventTitle === evt.title && r.status === 'Verified').length;
                    const fillPercentage = Math.min(100, Math.round((runnersForEvt / (evt.details.slotsLeft || 500)) * 100));
                    
                    return (
                      <div key={evt.id} className="border border-zinc-150 rounded-2xl p-4 space-y-3 font-mono text-xs">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-sans font-extrabold text-zinc-900 uppercase text-sm leading-tight">
                              {evt.title}
                            </h4>
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider block mt-1">
                              Date: {evt.date} | Limit: {evt.details.slotsLeft || 500} Slots
                            </span>
                          </div>
                          <span className={`rounded-full border px-2 py-0.5 text-[8px] font-black uppercase ${
                            evt.badge === 'OPEN'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : 'bg-red-50 text-red-600 border-red-100'
                          }`}>
                            {evt.badge || 'OPEN'}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
                            <span>Slots Filled: {runnersForEvt} / {evt.details.slotsLeft || 500}</span>
                            <span>{fillPercentage}%</span>
                          </div>
                          <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-brand h-full rounded-full transition-all duration-500" 
                              style={{ width: `${fillPercentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Side: Recent Registrations Activity list (1 column wide) */}
              <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-sm space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="border-b border-zinc-100 pb-4">
                    <h3 className="font-display text-lg font-black text-zinc-900 uppercase tracking-tight">
                      Recent Signups
                    </h3>
                    <p className="text-[10px] text-zinc-455 mt-0.5 font-mono uppercase tracking-wider">
                      Latest 5 registered athletes
                    </p>
                  </div>

                  <div className="divide-y divide-zinc-100 font-mono text-xs">
                    {registrations.slice(0, 5).map((reg) => (
                      <div 
                        key={reg.id}
                        onClick={() => {
                          if (onSelectReg) onSelectReg(reg.id);
                          onNavigate('admin-registration-details');
                        }}
                        className="py-3 flex justify-between items-center cursor-pointer hover:bg-zinc-50/50 px-2 rounded-lg transition-colors"
                      >
                        <div className="truncate pr-2">
                          <span className="font-sans font-extrabold text-zinc-900 text-xs block leading-tight">
                            {reg.firstName} {reg.lastName}
                          </span>
                          <span className="text-[8px] text-zinc-400 block mt-0.5 uppercase truncate max-w-[150px]">
                            {reg.eventTitle || 'Timing Portal'}
                          </span>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="font-black text-brand block">{reg.distance}</span>
                          <span className={`inline-block rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase mt-1 ${
                            reg.status === 'Verified' 
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-yellow-50 text-yellow-600'
                          }`}>
                            {reg.status || 'Pending'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('admin-registrations')}
                  className="w-full rounded-full border border-zinc-200 bg-white hover:border-zinc-950 hover:bg-zinc-50 py-3 text-center text-xs font-mono font-black text-zinc-800 transition-colors uppercase tracking-widest cursor-pointer mt-4"
                >
                  View All Registrations
                </button>
              </div>

            </div>

          </div>
        )}

        {view === 'registrations' && (
          <div className="space-y-6">

            {/* Filter / Control Bar */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm space-y-4">
              <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                {/* Search */}
                <div className="relative w-full lg:max-w-md">
                  <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, bib number..."
                    className="w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 py-3 text-xs text-zinc-900 placeholder-zinc-450 focus:border-brand focus:outline-none"
                  />
                </div>

                {/* Exporter */}
                <button
                  onClick={exportToCSV}
                  className="w-full lg:w-auto rounded-xl bg-zinc-900 hover:bg-black px-5 py-3 text-xs font-mono font-black text-white transition-colors uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download className="h-4 w-4" />
                  Export Sheet (CSV)
                </button>
              </div>

              {/* Filters list */}
              <div className="flex flex-wrap gap-3 pt-2 border-t border-zinc-100 items-center">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-zinc-400 uppercase font-mono mr-2">
                  <Filter className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Filters:</span>
                </div>

                {/* Event Title filter */}
                <select
                  value={selectedEventFilter}
                  onChange={(e) => setSelectedEventFilter(e.target.value)}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-700 focus:border-brand focus:outline-none cursor-pointer font-semibold"
                >
                  <option value="">All Events</option>
                  {distinctEvents.map(evt => (
                    <option key={evt} value={evt}>{evt}</option>
                  ))}
                </select>

                {/* Payment filter */}
                <select
                  value={selectedPaymentFilter}
                  onChange={(e) => setSelectedPaymentFilter(e.target.value)}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-700 focus:border-brand focus:outline-none cursor-pointer font-semibold"
                >
                  <option value="">All Payment Methods</option>
                  <option value="GCash">GCash</option>
                  <option value="Maya">Maya</option>
                  <option value="Bank">Bank Deposit</option>
                  <option value="Card">Credit/Debit Card</option>
                </select>

                {/* Status filter */}
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-700 focus:border-brand focus:outline-none cursor-pointer font-semibold"
                >
                  <option value="">All Statuses</option>
                  <option value="Verified">Verified</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                {/* Clear Filters */}
                {(selectedEventFilter || selectedPaymentFilter || selectedStatusFilter || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedEventFilter('');
                      setSelectedPaymentFilter('');
                      setSelectedStatusFilter('');
                      setSearchQuery('');
                    }}
                    className="text-[9px] font-mono font-bold text-brand hover:underline uppercase tracking-wider ml-auto cursor-pointer"
                  >
                    [ Clear All ]
                  </button>
                )}
              </div>
            </div>

            {/* Spreadsheet Table */}
            <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs font-semibold text-zinc-700">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 font-mono text-[9px] font-black text-zinc-400 uppercase tracking-widest select-none">
                      <th className="px-5 py-4 border-r border-zinc-200">Bib #</th>
                      <th className="px-5 py-4 border-r border-zinc-200">Runner Name</th>
                      <th className="px-5 py-4 border-r border-zinc-200">Email Address</th>
                      <th className="px-5 py-4 border-r border-zinc-200">Phone</th>
                      <th className="px-5 py-4 border-r border-zinc-200">Category</th>
                      <th className="px-5 py-4 border-r border-zinc-200">Dist / Size</th>
                      <th className="px-5 py-4 border-r border-zinc-200">Method</th>
                      <th className="px-5 py-4 border-r border-zinc-200">Ref # / Date</th>
                      <th className="px-5 py-4 border-r border-zinc-200 text-center">Status</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200">
                    {filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-5 py-12 text-center text-zinc-400 font-mono font-medium">
                          No registrations found matching the specified filters.
                        </td>
                      </tr>
                    ) : (
                      filteredRegistrations.map((reg) => (
                        <tr 
                          key={reg.id} 
                          onClick={() => {
                            if (onSelectReg) onSelectReg(reg.id);
                            onNavigate('admin-registration-details');
                          }}
                          className="hover:bg-zinc-50/50 transition-colors font-mono cursor-pointer"
                        >
                          {/* Bib */}
                          <td className="px-5 py-4 border-r border-zinc-200 font-bold text-zinc-900">
                            {reg.registeredBib ? `[${reg.registeredBib}]` : '—'}
                          </td>
                          {/* Name */}
                          <td className="px-5 py-4 border-r border-zinc-200 font-sans text-xs font-extrabold text-zinc-900">
                            {reg.firstName} {reg.lastName}
                            <span className="text-[9px] block font-mono font-semibold text-zinc-455 tracking-tight truncate max-w-[160px] mt-0.5 uppercase">
                              {reg.eventTitle || 'Early-Bird Portal'}
                            </span>
                          </td>
                          {/* Email */}
                          <td className="px-5 py-4 border-r border-zinc-200 text-zinc-600 font-medium">
                            {reg.email}
                          </td>
                          {/* Phone */}
                          <td className="px-5 py-4 border-r border-zinc-200 text-zinc-500 font-medium text-[11px]">
                            {reg.phone || '—'}
                          </td>
                          {/* Gender */}
                          <td className="px-5 py-4 border-r border-zinc-200 text-zinc-650 font-bold text-[10px]">
                            {reg.gender || '—'}
                          </td>
                          {/* Distance & Size */}
                          <td className="px-5 py-4 border-r border-zinc-200 text-[11px]">
                            <span className="text-brand font-black block">{reg.distance}</span>
                            <span className="text-zinc-500 font-medium text-[9px] block truncate max-w-[100px]">{reg.size ? reg.size.replace('Unisex - ', '') : '—'}</span>
                          </td>
                          {/* Method */}
                          <td className="px-5 py-4 border-r border-zinc-200 text-[11px] font-bold text-zinc-800">
                            {reg.paymentMethod}
                          </td>
                          {/* Ref # / Date */}
                          <td className="px-5 py-4 border-r border-zinc-200 text-[10px] leading-tight text-zinc-500">
                            <span className="font-semibold text-zinc-700 block truncate max-w-[120px]">{reg.referenceNumber}</span>
                            <span className="text-[9px] font-medium block mt-0.5">
                              {reg.registrationDate ? new Date(reg.registrationDate).toLocaleDateString() : '—'}
                            </span>
                          </td>
                          {/* Status */}
                          <td className="px-5 py-4 border-r border-zinc-200 text-center">
                            <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[9px] font-extrabold tracking-wider uppercase ${
                              reg.status === 'Verified' 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                : reg.status === 'Cancelled'
                                ? 'bg-red-50 text-red-600 border-red-100'
                                : 'bg-yellow-50 text-yellow-600 border-yellow-100'
                            }`}>
                              {reg.status || 'Pending'}
                            </span>
                          </td>
                          {/* Actions */}
                          <td className="px-5 py-4 text-right font-sans">
                            <div className="flex gap-2 justify-end">
                              {reg.status !== 'Verified' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleVerifyStatus(reg.id, 'Verified');
                                  }}
                                  title="Verify Runner"
                                  className="h-7 w-7 rounded-lg border border-zinc-200 bg-white hover:border-emerald-500 hover:text-emerald-600 flex items-center justify-center transition-colors cursor-pointer text-zinc-400"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                              )}
                              {reg.status !== 'Cancelled' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleVerifyStatus(reg.id, 'Cancelled');
                                  }}
                                  title="Cancel Registration"
                                  className="h-7 w-7 rounded-lg border border-zinc-200 bg-white hover:border-red-500 hover:text-red-500 flex items-center justify-center transition-colors cursor-pointer text-zinc-400"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteRegistration(reg.id);
                                }}
                                title="Delete Record"
                                className="h-7 w-7 rounded-lg border border-zinc-200 bg-white hover:border-zinc-900 hover:text-zinc-900 flex items-center justify-center transition-colors cursor-pointer text-zinc-400"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {view === 'events' && !editingEvent && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm gap-4">
              <div>
                <h2 className="font-display text-2xl font-black text-zinc-900 uppercase tracking-tight">
                  Active Race Events
                </h2>
                <p className="mt-1 text-xs text-zinc-500 font-medium">
                  Review, edit details, or delete active race categories currently displayed on the registration portal.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingEvent(null);
                  setNewEvent({
                    title: '',
                    badge: 'OPEN',
                    date: '',
                    time: '05:00 AM',
                    deadline: '',
                    location: '',
                    fee: '₱1,200.00',
                    slotsLimit: 500,
                    description: '',
                    route: '',
                    distances: [],
                    perks: 'Timing Chip, Finisher Medal, Event Singlet',
                    highlights: 'Certified race course, Fully loaded hydrations, Post-race concert',
                    image: '',
                    iconType: 'compass'
                  });
                  setGalleryPhotos([]);
                  setDistanceRoutes({});
                  setRouteMapPhoto('');
                  setKitPhoto('');
                  setFormStep(1);
                  onNavigate('admin-create-event');
                }}
                className="w-full sm:w-auto rounded-full bg-brand hover:bg-brand-hover text-white text-xs font-mono font-black uppercase tracking-widest py-3 px-6 cursor-pointer transition-colors shadow-sm text-center whitespace-nowrap"
              >
                + Create Event
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((evt) => {
                const verifiedRunners = registrations.filter(r => r.eventTitle === evt.title && r.status === 'Verified').length;
                
                return (
                  <div key={evt.id} className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                    <div>
                      {/* Image header */}
                      <div className="h-44 bg-zinc-105 overflow-hidden relative">
                        <img src={evt.image} alt={evt.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <span className={`absolute top-4 right-4 rounded-sm border px-2 py-0.5 text-[9px] font-black uppercase ${
                          evt.badge === 'OPEN'
                            ? 'bg-emerald-500 text-white border-emerald-400'
                            : 'bg-red-500 text-white border-red-400'
                        }`}>
                          {evt.badge || 'OPEN'}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="font-sans font-extrabold text-zinc-900 text-base leading-snug uppercase tracking-tight line-clamp-2">
                            {evt.title}
                          </h3>
                          <span className="text-[9px] font-bold text-zinc-450 uppercase tracking-wider block mt-1.5 font-mono">
                            {evt.date} | {evt.location}
                          </span>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-3 text-[10px] font-mono border-t border-b border-zinc-100 py-3 text-zinc-650">
                          <div>
                            <span className="text-zinc-400 font-bold uppercase block text-[8px]">Fee</span>
                            <span className="text-zinc-800 font-bold">{evt.details.fee}</span>
                          </div>
                          <div>
                            <span className="text-zinc-400 font-bold uppercase block text-[8px]">Slots Left</span>
                            <span className="text-zinc-850 font-bold">{evt.details.slotsLeft || 500}</span>
                          </div>
                          <div>
                            <span className="text-zinc-400 font-bold uppercase block text-[8px]">Distances</span>
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {evt.distances.map(d => (
                                <span key={d} className="bg-zinc-50 border border-zinc-200 px-1.5 py-0.2 rounded font-black text-brand text-[8px]">{d}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-zinc-400 font-bold uppercase block text-[8px]">Subscribers</span>
                            <span className="text-zinc-850 font-bold">{verifiedRunners} Verified</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions bar */}
                    <div className="px-6 pb-6 pt-2 flex gap-3 font-mono text-xs">
                      <button
                        onClick={() => {
                          setEditingEvent(evt);
                          setNewEvent({
                            title: evt.title,
                            badge: evt.badge || 'OPEN',
                            date: evt.date,
                            time: evt.details.time,
                            deadline: evt.deadline || evt.date,
                            location: evt.location,
                            fee: evt.details.fee,
                            slotsLimit: evt.details.slotsLeft || 500,
                            description: evt.description || '',
                            route: evt.details.route || '',
                            distances: evt.distances,
                            perks: evt.details.perks ? evt.details.perks.join(', ') : 'Timing Chip, Finisher Medal',
                            highlights: evt.highlights ? evt.highlights.join(', ') : 'Certified race course, Fully loaded hydrations',
                            image: evt.image,
                            iconType: evt.iconType || 'compass'
                          });
                          setGalleryPhotos(evt.galleryImages || [evt.image]);
                          const initialRoutes: Record<string, string> = {};
                          evt.distances.forEach(d => {
                            initialRoutes[d] = evt.details.routes?.[d] || evt.details.route || '';
                          });
                          setDistanceRoutes(initialRoutes);
                          setRouteMapPhoto(evt.routeMapImage || '');
                          setKitPhoto(evt.kitImage || '');
                          setFormStep(1);
                        }}
                        className="flex-1 rounded-full border border-zinc-200 hover:border-zinc-950 bg-white py-2.5 text-center text-[10px] font-black text-zinc-750 hover:text-zinc-900 transition-colors uppercase tracking-widest cursor-pointer shadow-sm"
                      >
                        Edit Info
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to permanently delete event "${evt.title}"?`)) {
                            const updatedList = events.filter(e => e.id !== evt.id);
                            if (onUpdateEvents) onUpdateEvents(updatedList);
                            showToast(`Successfully deleted event: "${evt.title}"`);
                          }
                        }}
                        className="rounded-full border border-red-200 hover:border-red-650 hover:bg-red-50 px-3 py-2.5 text-red-650 transition-colors cursor-pointer"
                        title="Delete Event"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {(view === 'create-event' || (view === 'events' && editingEvent)) && (
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 md:p-8 shadow-sm max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand animate-pulse" />
            
            <div className="mb-8 border-b border-zinc-150 pb-5">
              <h2 className="font-display text-2xl font-black text-zinc-900 uppercase tracking-tight">
                {editingEvent ? "Edit Race Event Details" : "Race Event Upload Form"}
              </h2>
              <p className="mt-1 text-sm text-zinc-600 font-medium">
                {editingEvent 
                  ? `Modify the fields below to update specifications for "${editingEvent.title}".`
                  : "Fill in the details below to launch a new competitive race category and activate it in the client system."
                }
              </p>
            </div>

            {/* Form Progress Bar */}
            <div className="mb-6 select-none bg-zinc-50 rounded-2xl border border-zinc-200/80 p-4">
              <div className="flex items-center justify-between font-mono text-[11px] font-black uppercase tracking-wider text-zinc-500 mb-2">
                <span className={formStep === 1 ? "text-brand" : ""}>Step 1: Specifications</span>
                <span className={formStep === 2 ? "text-brand" : ""}>Step 2: Media & Gallery</span>
              </div>
              <div className="h-1 w-full bg-zinc-200 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-brand transition-all duration-500 rounded-full" 
                  style={{ width: formStep === 1 ? '50%' : '100%' }}
                />
              </div>
            </div>

            <form onSubmit={handleCreateEventSubmit} className="space-y-6">
              {formStep === 1 && (
                <div className="space-y-6 animate-fade-in">
                  {/* Event Name & Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-black text-zinc-700 uppercase tracking-widest mb-1.5 font-mono">
                        Race Event Title <span className="text-brand">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newEvent.title}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Bacolod Sunset Coast Half Marathon"
                        className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-500 focus:border-brand focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-zinc-700 uppercase tracking-widest mb-1.5 font-mono">
                        Badge / Registration Status
                      </label>
                      <select
                        value={newEvent.badge}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, badge: e.target.value as any }))}
                        className="w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-3 text-sm text-zinc-900 focus:border-brand focus:outline-none cursor-pointer font-bold"
                      >
                        <option value="OPEN">OPEN (REGISTERING)</option>
                        <option value="CLOSING SOON">CLOSING SOON</option>
                        <option value="SOLD OUT">SOLD OUT</option>
                        <option value="PAST EVENT">PAST EVENT</option>
                      </select>
                    </div>
                  </div>

                  {/* Date, Time, Deadline, Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                    <div>
                      <label className="block text-[11px] font-black text-zinc-700 uppercase tracking-widest mb-1.5 font-mono">
                        Race Date <span className="text-brand">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newEvent.date}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                        placeholder="Oct 24, 2026"
                        className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-500 focus:border-brand focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-zinc-700 uppercase tracking-widest mb-1.5 font-mono">
                        Gunstart Time
                      </label>
                      <input
                        type="text"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                        placeholder="05:00 AM"
                        className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-500 focus:border-brand focus:outline-none font-mono text-center"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-zinc-700 uppercase tracking-widest mb-1.5 font-mono">
                        Deadline Date
                      </label>
                      <input
                        type="text"
                        value={newEvent.deadline}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, deadline: e.target.value }))}
                        placeholder="Oct 15, 2026"
                        className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-500 focus:border-brand focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-zinc-700 uppercase tracking-widest mb-1.5 font-mono">
                        Location <span className="text-brand">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newEvent.location}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Bacolod City"
                        className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-500 focus:border-brand focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Fee & Limit */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] font-black text-zinc-700 uppercase tracking-widest mb-1.5 font-mono">
                        Entry Fee (PHP)
                      </label>
                      <input
                        type="text"
                        value={newEvent.fee}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, fee: e.target.value }))}
                        placeholder="₱1,200.00"
                        className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-500 focus:border-brand focus:outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-zinc-700 uppercase tracking-widest mb-1.5 font-mono">
                        Runner Limit
                      </label>
                      <input
                        type="number"
                        value={newEvent.slotsLimit}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, slotsLimit: parseInt(e.target.value) || 0 }))}
                        placeholder="500"
                        className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-500 focus:border-brand focus:outline-none font-mono text-center"
                      />
                    </div>
                  </div>

                  {/* Distances Category checklist */}
                  <div>
                    <label className="block text-[11px] font-black text-zinc-700 uppercase tracking-widest mb-2 font-mono">
                      Distance Categories <span className="text-brand">*</span>
                    </label>
                    <div className="flex flex-wrap gap-4 bg-zinc-50 rounded-xl border border-zinc-200 p-4">
                      {['3K', '5K', '10K', '16K', '21K', '32K', '42K'].map(dist => {
                        const isChecked = newEvent.distances.includes(dist);
                        return (
                          <label 
                            key={dist} 
                            className={`flex items-center gap-2 cursor-pointer border px-4 py-2 rounded-lg bg-white select-none transition-all ${
                              isChecked ? 'border-brand text-brand font-extrabold shadow-sm bg-brand/5' : 'border-zinc-200 hover:border-zinc-300 text-zinc-650'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleDistanceCheckboxChange(dist)}
                              className="sr-only"
                            />
                            <span className="text-sm font-mono font-bold">{dist}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Route Maps / Path descriptions per category */}
                  <div>
                    <label className="block text-[11px] font-black text-zinc-700 uppercase tracking-widest mb-2.5 font-mono">
                      Route Maps / Path descriptions per category <span className="text-brand">*</span>
                    </label>
                    {newEvent.distances.length === 0 ? (
                      <div className="text-xs font-mono bg-zinc-55 text-zinc-600 border border-zinc-200 rounded-xl p-4 text-center">
                        Please select at least one distance category above to specify routes.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-50 rounded-xl border border-zinc-200 p-4">
                        {newEvent.distances.map((dist) => (
                          <div key={dist} className="space-y-1.5 animate-fade-in">
                            <div className="flex justify-between items-center">
                              <span className="bg-brand text-white font-mono font-black text-[11px] px-2.5 py-1 rounded uppercase tracking-wider">{dist} category</span>
                            </div>
                            <input
                              type="text"
                              required
                              value={distanceRoutes[dist] || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setDistanceRoutes(prev => ({ ...prev, [dist]: val }));
                              }}
                              placeholder={`e.g. ${dist} race course loop description`}
                              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-500 focus:border-brand focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Perks & Highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[11px] font-black text-zinc-700 uppercase tracking-widest mb-1.5 font-mono">
                        Athlete Perks (Comma-separated)
                      </label>
                      <input
                        type="text"
                        value={newEvent.perks}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, perks: e.target.value }))}
                        placeholder="e.g. RFID Timing Chip, Finisher Medal, Sub-assembly Singlet"
                        className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-500 focus:border-brand focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black text-zinc-700 uppercase tracking-widest mb-1.5 font-mono">
                        Race Highlights (Comma-separated)
                      </label>
                      <input
                        type="text"
                        value={newEvent.highlights}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, highlights: e.target.value }))}
                        placeholder="e.g. AIMS Certified course, Sub-15 Timing Hubs, Post-race hydration booths"
                        className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-500 focus:border-brand focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[11px] font-black text-zinc-700 uppercase tracking-widest mb-1.5 font-mono">
                      Race Description
                    </label>
                    <textarea
                      rows={3}
                      value={newEvent.description}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Provide registration notes, details about the hydration hubs, medical stands, and finishing criteria..."
                      className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-500 focus:border-brand focus:outline-none"
                    />
                  </div>

                  {/* Step 1 Actions */}
                  <div className="flex gap-4 pt-4 border-t border-zinc-150 font-mono">
                    <button
                      type="button"
                      onClick={() => {
                        setDistanceRoutes({});
                        setRouteMapPhoto('');
                        setKitPhoto('');
                        setFormStep(1);
                        if (editingEvent) {
                          setEditingEvent(null);
                          onNavigate('admin-events');
                        } else {
                          onNavigate('admin-registrations');
                        }
                      }}
                      className="flex-1 rounded-full border border-zinc-300 bg-white py-3.5 text-center text-sm font-mono font-black text-zinc-800 hover:bg-zinc-50 transition-colors uppercase tracking-widest cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newEvent.title || !newEvent.date || !newEvent.location || newEvent.distances.length === 0) {
                          alert('Please fill out all required fields and check at least one distance.');
                          return;
                        }
                        setFormStep(2);
                      }}
                      className="flex-1 rounded-full bg-brand hover:bg-brand-hover py-3.5 text-center text-sm font-mono font-black text-white transition-colors uppercase tracking-widest cursor-pointer shadow-md shadow-brand/10"
                    >
                      Next Step: Uploads
                    </button>
                  </div>
                </div>
              )}

              {formStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  {/* Event Gallery Image Upload (Max 5 photos) */}
                  <div className="space-y-3">
                    <label className="block text-[11px] font-black text-zinc-700 uppercase tracking-widest font-mono flex items-center gap-1.5">
                      <ImageIcon className="h-4 w-4 text-zinc-500" />
                      <span>Upload Race Event Gallery Photos (Max 5 images from folders) <span className="text-brand">*</span></span>
                    </label>

                    {uploaderError && (
                      <div className="text-[10px] font-bold text-red-655 font-mono uppercase bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2 animate-fade-in">
                        <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                        <span>{uploaderError}</span>
                      </div>
                    )}
                    
                    {/* Upload Zone */}
                    <div className="border-2 border-dashed border-zinc-200 hover:border-brand rounded-2xl p-6 text-center transition-colors cursor-pointer relative bg-zinc-50 hover:bg-brand/[0.01] group">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          if (galleryPhotos.length + files.length > 5) {
                            setUploaderError("You can upload a maximum of 5 gallery photos.");
                            setTimeout(() => {
                              setUploaderError(null);
                            }, 4000);
                            return;
                          }
                          setUploaderError(null);
                          
                          files.forEach((file) => {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === 'string') {
                                setGalleryPhotos(prev => [...prev, reader.result as string]);
                              }
                            };
                            reader.readAsDataURL(file);
                          });
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <ImageIcon className="h-8 w-8 text-zinc-400 group-hover:text-brand mx-auto mb-2 transition-colors" />
                      <span className="text-sm font-semibold text-zinc-700 block">
                        Drag & drop or browse from your folders
                      </span>
                      <span className="text-xs text-zinc-500 block mt-1">
                        PNG, JPG, or WEBP (Max 5 photos)
                      </span>
                    </div>

                    {/* Thumbnails list */}
                    {galleryPhotos.length > 0 && (
                      <div className="flex flex-wrap gap-3 mt-3">
                        {galleryPhotos.map((photo, idx) => (
                          <div key={idx} className="relative h-16 w-16 rounded-xl border border-zinc-200 overflow-hidden group shadow-sm bg-zinc-50">
                            <img src={photo} alt={`Uploaded gallery ${idx + 1}`} className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                              <button
                                type="button"
                                onClick={() => setGalleryPhotos(prev => prev.filter((_, i) => i !== idx))}
                                className="p-1 hover:text-red-500 transition-colors cursor-pointer"
                                title="Remove photo"
                              >
                                <Trash2 className="h-4.5 w-4.5" />
                              </button>
                            </div>
                            {idx === 0 && (
                              <div className="absolute bottom-0 left-0 right-0 bg-brand text-white text-[8px] font-black tracking-widest text-center py-0.5 uppercase">
                                Cover
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Route Map & Race Kit uploads */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    {/* Route Map Photo */}
                    <div className="space-y-3">
                      <label className="block text-[11px] font-black text-zinc-700 uppercase tracking-widest font-mono flex items-center gap-1.5">
                        <ImageIcon className="h-4 w-4 text-zinc-500" />
                        <span>Upload Route Map Image <span className="text-zinc-500">(Optional)</span></span>
                      </label>
                      
                      {routeMapPhoto ? (
                        <div className="relative h-44 rounded-2xl border border-zinc-200 overflow-hidden group shadow-sm bg-zinc-50">
                          <img src={routeMapPhoto} alt="Route Map Preview" className="h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <button
                              type="button"
                              onClick={() => setRouteMapPhoto('')}
                              className="rounded-full bg-red-600 hover:bg-red-700 text-white font-mono text-[9px] font-black uppercase tracking-wider px-3.5 py-2 cursor-pointer transition-colors shadow"
                            >
                              Remove Photo
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-zinc-200 hover:border-brand rounded-2xl p-6 text-center transition-colors cursor-pointer relative bg-zinc-50 hover:bg-brand/[0.01] group h-44 flex flex-col justify-center items-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === 'string') {
                                    setRouteMapPhoto(reader.result);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <ImageIcon className="h-6 w-6 text-zinc-400 group-hover:text-brand mb-1.5 transition-colors" />
                          <span className="text-xs font-bold text-zinc-700 block">Browse Route Map Photo</span>
                          <span className="text-[10px] text-zinc-500 block mt-0.5">PNG, JPG, or WEBP (Max 1)</span>
                        </div>
                      )}
                    </div>

                    {/* Race Kit / Singlet Preview */}
                    <div className="space-y-3">
                      <label className="block text-[11px] font-black text-zinc-700 uppercase tracking-widest font-mono flex items-center gap-1.5">
                        <ImageIcon className="h-4 w-4 text-zinc-500" />
                        <span>Upload Race Kit / Singlet Preview <span className="text-zinc-500">(Optional)</span></span>
                      </label>
                      
                      {kitPhoto ? (
                        <div className="relative h-44 rounded-2xl border border-zinc-200 overflow-hidden group shadow-sm bg-zinc-50">
                          <img src={kitPhoto} alt="Race Kit Preview" className="h-full w-full object-cover" />
                          <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <button
                              type="button"
                              onClick={() => setKitPhoto('')}
                              className="rounded-full bg-red-650 hover:bg-red-700 text-white font-mono text-[9px] font-black uppercase tracking-wider px-3.5 py-2 cursor-pointer transition-colors shadow"
                            >
                              Remove Photo
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-zinc-200 hover:border-brand rounded-2xl p-6 text-center transition-colors cursor-pointer relative bg-zinc-50 hover:bg-brand/[0.01] group h-44 flex flex-col justify-center items-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === 'string') {
                                    setKitPhoto(reader.result);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <ImageIcon className="h-6 w-6 text-zinc-400 group-hover:text-brand mb-1.5 transition-colors" />
                          <span className="text-xs font-bold text-zinc-700 block">Browse Race Kit Photo</span>
                          <span className="text-[10px] text-zinc-500 block mt-0.5">PNG, JPG, or WEBP (Max 1)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Step 2 Actions */}
                  <div className="flex gap-4 pt-4 border-t border-zinc-150 font-mono">
                    <button
                      type="button"
                      onClick={() => setFormStep(1)}
                      className="flex-1 rounded-full border border-zinc-300 bg-white py-3.5 text-center text-sm font-mono font-black text-zinc-800 hover:bg-zinc-50 transition-colors uppercase tracking-widest cursor-pointer"
                    >
                      Back to Specs
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-full bg-brand hover:bg-brand-hover py-3.5 text-center text-sm font-mono font-black text-white transition-colors uppercase tracking-widest cursor-pointer shadow-md shadow-brand/10"
                    >
                      {editingEvent ? "Save Event Changes" : "Create & Launch Race"}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

        {view === 'registration-details' && (() => {
          const selectedReg = registrations.find(r => r.id === selectedRegId);
          if (!selectedReg) return null;
          return (
            <div className="space-y-6">
              <style dangerouslySetInnerHTML={{__html: `
                @media print {
                  body * {
                    visibility: hidden !important;
                  }
                  #printable-pass-card, #printable-pass-card * {
                    visibility: visible !important;
                  }
                  #printable-pass-card {
                    position: absolute !important;
                    left: 50% !important;
                    top: 50% !important;
                    transform: translate(-50%, -50%) !important;
                    width: 450px !important;
                    border: 2px solid #e4e4e7 !important;
                    border-radius: 24px !important;
                    box-shadow: none !important;
                    margin: 0 !important;
                    padding: 24px !important;
                    background-color: white !important;
                  }
                }
              `}} />

              <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                {/* Left Column: Timing Pass card */}
                <div className="w-full lg:w-96 flex-shrink-0 space-y-4">
                  <div 
                    id="printable-pass-card"
                    className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 relative overflow-hidden"
                  >
                    {/* Decorative brand accent */}
                    <div className="absolute top-0 left-0 right-0 h-4 bg-brand" />
                    
                    <div className="text-center pt-2 pb-6 border-b border-dashed border-zinc-200">
                      <span className="font-mono text-[9px] font-black text-brand tracking-widest uppercase">
                        RUNNICLE OFFICIAL TIMING PASS
                      </span>
                      <h2 className="font-display text-lg font-black text-zinc-900 mt-0.5 uppercase tracking-tight truncate">
                        {selectedReg.eventTitle || 'Early-Bird Runner'}
                      </h2>
                    </div>

                    {/* Large BIB Display */}
                    <div className="py-8 text-center bg-zinc-50 rounded-2xl border border-zinc-100 my-6">
                      <span className="font-mono text-xs text-zinc-400 font-bold uppercase tracking-wider block">
                        RACE BIB NUMBER
                      </span>
                      <span className="font-mono text-6xl font-black text-zinc-900 mt-2 block tracking-tight">
                        {selectedReg.registeredBib ? `#${selectedReg.registeredBib}` : 'UNASSIGNED'}
                      </span>
                    </div>

                    <div className="space-y-4 font-mono text-xs text-zinc-650 pb-6 border-b border-dashed border-zinc-200">
                      <div className="flex justify-between">
                        <span className="text-zinc-400 font-bold uppercase text-[10px]">ATHLETE</span>
                        <span className="font-sans font-extrabold text-zinc-900 text-right text-xs">
                          {selectedReg.firstName} {selectedReg.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400 font-bold uppercase text-[10px]">DISTANCE</span>
                        <span className="font-black text-brand text-right">{selectedReg.distance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400 font-bold uppercase text-[10px]">SIZE</span>
                        <span className="font-bold text-zinc-900 text-right">
                          {selectedReg.size ? selectedReg.size.replace('Unisex - ', '') : '—'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400 font-bold uppercase text-[10px]">VERIFIED</span>
                        <span className={`font-black text-right ${selectedReg.status === 'Verified' ? 'text-emerald-600' : 'text-yellow-600'}`}>
                          {selectedReg.status || 'Pending'}
                        </span>
                      </div>
                    </div>

                    {/* Mock Barcode rendering */}
                    <div className="pt-6 flex flex-col items-center">
                      <div className="flex items-center justify-center gap-[1.5px] h-10 bg-white px-2 select-none">
                        {[1, 3, 2, 1, 4, 1, 2, 3, 1, 4, 2, 1, 3, 1, 2, 1, 4, 2, 1, 3, 1, 4, 1, 2, 1, 3, 2].map((w, idx) => (
                          <div 
                            key={idx} 
                            className="bg-black h-full" 
                            style={{ width: `${w}px` }} 
                          />
                        ))}
                      </div>
                      <span className="font-mono text-[9px] text-zinc-400 mt-2 tracking-widest font-semibold">
                        *{selectedReg.referenceNumber || selectedReg.id}*
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="w-full rounded-full bg-zinc-900 hover:bg-black py-3 text-center text-xs font-mono font-black text-white transition-colors uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Printer className="h-4 w-4" />
                    Print Timing Pass
                  </button>
                </div>

                {/* Right Column: Detailed Profiles */}
                <div className="flex-1 w-full space-y-6">
                  
                  {/* Personal Information */}
                  <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 space-y-4">
                    <h3 className="font-mono text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-2">
                      Runner Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div>
                        <span className="text-zinc-400 font-bold uppercase text-[9px] block">First Name</span>
                        <span className="font-sans font-extrabold text-zinc-900 text-[13px] mt-1 block">
                          {selectedReg.firstName}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-400 font-bold uppercase text-[9px] block">Last Name</span>
                        <span className="font-sans font-extrabold text-zinc-900 text-[13px] mt-1 block">
                          {selectedReg.lastName}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-400 font-bold uppercase text-[9px] block">Email Address</span>
                        <span className="text-zinc-800 font-semibold mt-1 block">
                          {selectedReg.email}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-400 font-bold uppercase text-[9px] block">Phone Number</span>
                        <span className="text-zinc-800 font-semibold mt-1 block">
                          {selectedReg.phone || '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-400 font-bold uppercase text-[9px] block">Gender Category</span>
                        <span className="text-zinc-800 font-bold mt-1 block uppercase">
                          {selectedReg.gender || '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-400 font-bold uppercase text-[9px] block">T-Shirt Size</span>
                        <span className="text-zinc-800 font-bold mt-1 block">
                          {selectedReg.size || '—'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Transaction & System Data */}
                  <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 space-y-4">
                    <h3 className="font-mono text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-2">
                      Payment & Registration Metadata
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div>
                        <span className="text-zinc-400 font-bold uppercase text-[9px] block">Payment Method</span>
                        <span className="text-zinc-800 font-bold mt-1 block">
                          {selectedReg.paymentMethod}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-400 font-bold uppercase text-[9px] block">Reference Code</span>
                        <span className="text-zinc-900 font-black mt-1 block tracking-wider">
                          {selectedReg.referenceNumber || '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-400 font-bold uppercase text-[9px] block">Registration Date</span>
                        <span className="text-zinc-800 font-semibold mt-1 block">
                          {selectedReg.registrationDate 
                            ? new Date(selectedReg.registrationDate).toLocaleString() 
                            : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-400 font-bold uppercase text-[9px] block">Assigned BIB</span>
                        <span className="text-brand font-black mt-1 block text-sm">
                          {selectedReg.registeredBib ? `BIB #${selectedReg.registeredBib}` : 'UNASSIGNED'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact & Legal */}
                  <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 space-y-4">
                    <h3 className="font-mono text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-2">
                      Emergency Contact & Legal
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div>
                        <span className="text-zinc-400 font-bold uppercase text-[9px] block">Emergency Person</span>
                        <span className="font-sans font-bold text-zinc-900 mt-1 block">
                          {selectedReg.emergencyName || 'Maria Dela Cruz'}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-400 font-bold uppercase text-[9px] block">Emergency Contact Phone</span>
                        <span className="text-zinc-800 font-bold mt-1 block">
                          {selectedReg.emergencyPhone || '09187654321'}
                        </span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-zinc-400 font-bold uppercase text-[9px] block">Liability Waiver Agreement</span>
                        <div className="flex items-center gap-1.5 text-emerald-600 font-bold mt-1">
                          <Check className="h-4 w-4" />
                          <span>Signed and Agreed to Runnicle Liability Waiver & Policy</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Toggles & Management */}
                  <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 space-y-4">
                    <h3 className="font-mono text-[10px] font-black text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-2">
                      Registration Management
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {selectedReg.status !== 'Verified' && (
                        <button
                          onClick={() => {
                            handleVerifyStatus(selectedReg.id, 'Verified');
                            showToast(`Successfully verified runner "${selectedReg.firstName}"`);
                          }}
                          className="rounded-full bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-xs font-mono font-black text-white transition-colors uppercase tracking-widest cursor-pointer flex items-center gap-2 shadow-sm"
                        >
                          <Check className="h-4 w-4" />
                          Verify Payment
                        </button>
                      )}
                      {selectedReg.status !== 'Cancelled' && (
                        <button
                          onClick={() => {
                            handleVerifyStatus(selectedReg.id, 'Cancelled');
                            showToast(`Successfully cancelled registration for "${selectedReg.firstName}"`);
                          }}
                          className="rounded-full bg-yellow-500 hover:bg-yellow-600 px-5 py-2.5 text-xs font-mono font-black text-white transition-colors uppercase tracking-widest cursor-pointer flex items-center gap-2 shadow-sm"
                        >
                          <X className="h-4 w-4" />
                          Mark as Cancelled
                        </button>
                      )}
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to permanently delete this registration record?`)) {
                            handleDeleteRegistration(selectedReg.id);
                            onNavigate('admin-registrations');
                          }
                        }}
                        className="rounded-full border border-red-200 hover:border-red-650 hover:bg-red-50 px-5 py-2.5 text-xs font-mono font-bold text-red-650 transition-colors uppercase tracking-widest cursor-pointer flex items-center gap-2 shadow-sm ml-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Record
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
};
export default AdminPage;
