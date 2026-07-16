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
  Menu,
  Plus,
  Edit2,
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Settings,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type EventItem } from '@/types';

const parseImages = (imgStr?: string): string[] => {
  if (!imgStr) return [];
  if (imgStr.startsWith('[')) {
    try {
      return JSON.parse(imgStr);
    } catch (e) {
      // fallback
    }
  }
  if (imgStr.includes('|')) {
    return imgStr.split('|');
  }
  return [imgStr];
};


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
  view: 'login' | 'dashboard' | 'registrations' | 'events' | 'create-event' | 'registration-details' | 'forms' | 'settings';
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

  // Settings view properties
  heroSettings?: { promotedEventId: string; heroBackgroundImage: string };
  onUpdateHeroSettings?: (settings: { promotedEventId: string; heroBackgroundImage: string }) => void;
}

export const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 800, quality = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
};

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
  onSelectReg,
  heroSettings,
  onUpdateHeroSettings
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
  const [routeMapPhotos, setRouteMapPhotos] = useState<string[]>([]);
  const [kitPhotos, setKitPhotos] = useState<string[]>([]);

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
    iconType: 'compass' as 'compass' | 'mountain' | 'drop',

    // New specs fields
    inclusions: 'Singlet, Race Bib',
    jerseyFee: 250,
    earlyBirdDeadline: '',
    earlyBirdDiscountPercent: 20,
    distanceFees: {} as Record<string, number>
  });
  const [successToast, setSuccessToast] = useState('');
  const [errorToast, setErrorToast] = useState('');

  // Admin-side manual registration states
  const [newReg, setNewReg] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'Male',
    eventTitle: '',
    distance: '',
    size: 'Unisex - Medium (M)',
    paymentMethod: 'GCash',
    referenceNumber: '',
    emergencyContact: '',
    emergencyPhone: '',
    registeredBib: '',
    status: 'Verified'
  });
  const [editingRegId, setEditingRegId] = useState<string | null>(null);


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

  const showErrorToast = (msg: string) => {
    setErrorToast(msg);
    setTimeout(() => {
      setErrorToast('');
    }, 4000);
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
      showErrorToast('Please fill out all required fields and check at least one distance.');
      return;
    }

    if (galleryPhotos.length === 0) {
      showErrorToast('Please upload at least one photo from your folders to serve as the event cover image.');
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
            routeMapImage: routeMapPhotos.length > 0 ? JSON.stringify(routeMapPhotos) : undefined,
            kitImage: kitPhotos.length > 0 ? JSON.stringify(kitPhotos) : undefined,
            // New specs fields
            inclusions: newEvent.inclusions ? newEvent.inclusions.split(',').map(i => i.trim()) : ['Singlet', 'Race Bib'],
            jerseyFee: Number(newEvent.jerseyFee) || 250,
            earlyBirdDeadline: newEvent.earlyBirdDeadline || undefined,
            earlyBirdDiscountPercent: Number(newEvent.earlyBirdDiscountPercent) || 20,
            distanceFees: newEvent.distanceFees
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
        routeMapImage: routeMapPhotos.length > 0 ? JSON.stringify(routeMapPhotos) : undefined,
        kitImage: kitPhotos.length > 0 ? JSON.stringify(kitPhotos) : undefined,
        // New specs fields
        inclusions: newEvent.inclusions ? newEvent.inclusions.split(',').map(i => i.trim()) : ['Singlet', 'Race Bib'],
        jerseyFee: Number(newEvent.jerseyFee) || 250,
        earlyBirdDeadline: newEvent.earlyBirdDeadline || undefined,
        earlyBirdDiscountPercent: Number(newEvent.earlyBirdDiscountPercent) || 20,
        distanceFees: newEvent.distanceFees
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
      iconType: 'compass',
      inclusions: 'Singlet, Race Bib',
      jerseyFee: 250,
      earlyBirdDeadline: '',
      earlyBirdDiscountPercent: 20,
      distanceFees: {}
    });
    setGalleryPhotos([]);
    setDistanceRoutes({});
    setRouteMapPhotos([]);
    setKitPhotos([]);
    setFormStep(1);

    // Navigate to respective lists
    onNavigate('admin-events');
  };

  const resetNewRegForm = () => {
    const firstEvent = events.length > 0 ? events[0] : null;
    setNewReg({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      gender: 'Male',
      eventTitle: firstEvent ? firstEvent.title : '',
      distance: firstEvent ? firstEvent.distances[0] : '',
      size: 'Unisex - Medium (M)',
      paymentMethod: 'GCash',
      referenceNumber: '',
      emergencyContact: '',
      emergencyPhone: '',
      registeredBib: '',
      status: 'Verified'
    });
  };

  const handleAddRegSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReg.firstName.trim() || !newReg.lastName.trim() || !newReg.email.trim() || !newReg.phone.trim() || !newReg.eventTitle || !newReg.distance || !newReg.referenceNumber.trim()) {
      showErrorToast('Please fill out all required fields.');
      return;
    }

    const bib = newReg.registeredBib.trim() || Math.floor(100 + Math.random() * 900).toString();

    if (editingRegId) {
      const updated = registrations.map(reg => {
        if (reg.id === editingRegId) {
          return {
            ...reg,
            firstName: newReg.firstName.trim(),
            lastName: newReg.lastName.trim(),
            email: newReg.email.trim(),
            phone: newReg.phone.trim(),
            gender: newReg.gender,
            eventTitle: newReg.eventTitle,
            distance: newReg.distance,
            size: newReg.size,
            paymentMethod: newReg.paymentMethod,
            referenceNumber: newReg.referenceNumber.trim(),
            registeredBib: bib,
            emergencyContact: newReg.emergencyContact.trim() || 'Maria Dela Cruz',
            emergencyPhone: newReg.emergencyPhone.trim() || '09187654321',
            status: newReg.status
          };
        }
        return reg;
      });
      onUpdateRegistrations(updated);
      showToast(`Updated registration for ${newReg.firstName.trim()} ${newReg.lastName.trim()}`);
      setEditingRegId(null);
      resetNewRegForm();
      onNavigate('admin-registration-details');
    } else {
      const createdRecord = {
        id: `reg-${Date.now()}`,
        firstName: newReg.firstName.trim(),
        lastName: newReg.lastName.trim(),
        email: newReg.email.trim(),
        phone: newReg.phone.trim(),
        gender: newReg.gender,
        eventTitle: newReg.eventTitle,
        distance: newReg.distance,
        size: newReg.size,
        paymentMethod: newReg.paymentMethod,
        referenceNumber: newReg.referenceNumber.trim(),
        registeredBib: bib,
        emergencyContact: newReg.emergencyContact.trim() || 'Maria Dela Cruz',
        emergencyPhone: newReg.emergencyPhone.trim() || '09187654321',
        registrationDate: new Date().toISOString(),
        status: newReg.status
      };

      onUpdateRegistrations([createdRecord, ...registrations]);
      showToast(`Registered ${createdRecord.firstName} ${createdRecord.lastName}`);
      resetNewRegForm();
      onNavigate('admin-registrations');
    }
  };


  const handleNewRegEventChange = (title: string) => {
    const matched = events.find(e => e.title === title);
    setNewReg(prev => ({
      ...prev,
      eventTitle: title,
      distance: matched ? matched.distances[0] : ''
    }));
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
    // Use the registration's actual totalAmount (number)
    const numericFee = Number(curr.totalAmount) || 0;
    return acc + numericFee;
  }, 0);

  const verifiedCount = filteredRegistrations.filter(r => r.status === 'Verified').length;
  const pendingCount = filteredRegistrations.filter(r => r.status === 'Pending').length;

  // Export to CSV utility
  const exportToCSV = () => {
    if (filteredRegistrations.length === 0) {
      showErrorToast('No registrations available to export.');
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
      <div className="min-h-screen flex items-center justify-center bg-[#F9F9F9] px-4 py-16 font-sans select-none text-zinc-800">
        <div className="max-w-md w-full bg-white rounded-xl border border-zinc-200 p-8 shadow-xl relative overflow-hidden">
          {/* Accent decoration */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#FF4400]" />

          <div className="text-center mb-6">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-[#FF4400]/10 text-[#FF4400] mb-4">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
              Admin login
            </h2>
            <p className="mt-1 text-xs font-semibold text-zinc-500">
              Runnicle timing core admin portal
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs font-semibold text-zinc-600">
            <div>
              <label className="block text-xs font-semibold text-zinc-650 mb-1.5">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                className="w-full rounded-[7px] border border-zinc-205 bg-white px-3.5 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand font-medium transition-all shadow-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-655 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-[7px] border border-zinc-205 bg-white pl-3.5 pr-11 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand font-medium transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-700 transition-colors focus:outline-none flex items-center justify-center p-1.5 rounded cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 bg-white text-brand focus:ring-0 cursor-pointer"
                />
                <span className="text-xs font-semibold text-zinc-500">
                  Remember me
                </span>
              </label>
            </div>

            {errorMsg && (
              <div className="rounded-lg bg-red-55/60 border border-red-200 p-3 flex gap-2 text-xs text-red-700 font-semibold leading-relaxed">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full rounded-[7px] bg-[#FF4400] hover:bg-[#E63D00] py-2.5 text-center text-xs font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-brand/10 active:scale-[0.98] disabled:opacity-50"
            >
              {isAuthenticating ? 'Authenticating...' : 'Access portal'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={onBackToHome}
              className="text-xs font-semibold text-zinc-500 hover:text-[#FF4400] transition-colors cursor-pointer"
            >
              Back to website
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-800 select-none flex flex-col lg:flex-row">

      {/* Desktop Sidebar (visible on lg screens and up) */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-zinc-200 h-screen sticky top-0 flex-shrink-0 z-40 select-none shadow-sm">
        <div className="p-6 border-b border-zinc-150 flex items-center gap-3">
          <img src="/logo-orange.png" alt="RUNNICLE" className="h-5 w-auto" />
          <div className="border-l border-zinc-200 h-5 flex items-center pl-3">
            <span className="font-sans text-[10px] font-extrabold text-zinc-500 tracking-wider uppercase">
              Console
            </span>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <div className="flex-1 py-6 px-4 space-y-1.5">
          {view !== 'registration-details' ? (
            <>
              <button
                onClick={() => onNavigate('admin-dashboard')}
                className={`w-full font-sans text-xs font-bold tracking-wider uppercase transition-colors px-4 py-3 rounded-lg flex items-center gap-3 cursor-pointer ${view === 'dashboard'
                    ? 'bg-orange-50 text-[#FF4400]'
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                  }`}
              >
                <LayoutDashboard className="h-4.5 w-4.5" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => onNavigate('admin-registrations')}
                className={`w-full font-sans text-xs font-bold tracking-wider uppercase transition-colors px-4 py-3 rounded-lg flex items-center gap-3 cursor-pointer ${view === 'registrations'
                    ? 'bg-orange-50 text-[#FF4400]'
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                  }`}
              >
                <Users className="h-4.5 w-4.5" />
                <span>Registrations</span>
              </button>

              <button
                onClick={() => onNavigate('admin-events')}
                className={`w-full font-sans text-xs font-bold tracking-wider uppercase transition-colors px-4 py-3 rounded-lg flex items-center gap-3 cursor-pointer ${view === 'events' || view === 'create-event'
                    ? 'bg-orange-50 text-[#FF4400]'
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                  }`}
              >
                <Calendar className="h-4.5 w-4.5" />
                <span>Events</span>
              </button>

              <button
                onClick={() => {
                  setEditingRegId(null);
                  resetNewRegForm();
                  onNavigate('admin-forms');
                }}
                className={`w-full font-sans text-xs font-bold tracking-wider uppercase transition-colors px-4 py-3 rounded-lg flex items-center gap-3 cursor-pointer ${view === 'forms'
                    ? 'bg-orange-50 text-[#FF4400]'
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                  }`}
              >
                <ClipboardList className="h-4.5 w-4.5" />
                <span>Forms</span>
              </button>

              <button
                onClick={() => onNavigate('admin-settings')}
                className={`w-full font-sans text-xs font-bold tracking-wider uppercase transition-colors px-4 py-3 rounded-lg flex items-center gap-3 cursor-pointer ${view === 'settings'
                    ? 'bg-orange-50 text-[#FF4400]'
                    : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                  }`}
              >
                <Settings className="h-4.5 w-4.5" />
                <span>Settings</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => onNavigate('admin-registrations')}
              className="w-full font-sans text-xs font-bold tracking-wider uppercase text-zinc-500 hover:text-[#FF4400] transition-colors px-4 py-3 rounded-lg flex items-center gap-3 cursor-pointer animate-fade-in"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
              <span>Back to List</span>
            </button>
          )}
        </div>

        {/* Sidebar Footer / Logout */}
        <div className="p-4 border-t border-zinc-150">
          <button
            onClick={handleLogout}
            className="w-full bg-zinc-900 hover:bg-[#E63D00] text-white text-xs font-sans font-bold rounded-[7px] py-2.5 transition-all tracking-wider uppercase cursor-pointer shadow-sm text-center"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Top Navbar (visible on mobile screens, sticky on top) */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-zinc-200 select-none px-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo-orange.png" alt="RUNNICLE" className="h-4.5 w-auto" />
          <div className="border-l border-zinc-200 h-4 flex items-center pl-2.5">
            <span className="font-sans text-[9px] font-extrabold text-zinc-400 tracking-wider uppercase">
              Console
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="inline-flex items-center justify-center rounded-md p-1.5 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 focus:outline-none transition-colors cursor-pointer"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
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
            className="lg:hidden fixed top-16 left-0 right-0 z-40 overflow-hidden border-b border-zinc-200 bg-white px-4 pt-2 pb-6 space-y-4 text-zinc-800 shadow-lg"
          >
            <div className="flex flex-col space-y-1.5 font-sans">
              <button
                onClick={() => {
                  onNavigate('admin-dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className={`block rounded-lg px-4 py-3 text-left text-xs font-bold tracking-wider uppercase transition-colors ${view === 'dashboard'
                    ? 'bg-orange-50 text-[#FF4400]'
                    : 'text-zinc-650 hover:bg-zinc-50'
                  }`}
              >
                Dashboard
              </button>

              <button
                onClick={() => {
                  onNavigate('admin-registrations');
                  setIsMobileMenuOpen(false);
                }}
                className={`block rounded-lg px-4 py-3 text-left text-xs font-bold tracking-wider uppercase transition-colors ${view === 'registrations'
                    ? 'bg-orange-50 text-[#FF4400]'
                    : 'text-zinc-655 hover:bg-zinc-50'
                  }`}
              >
                Registrations
              </button>

              <button
                onClick={() => {
                  onNavigate('admin-events');
                  setIsMobileMenuOpen(false);
                }}
                className={`block rounded-lg px-4 py-3 text-left text-xs font-bold tracking-wider uppercase transition-colors ${view === 'events' || view === 'create-event'
                    ? 'bg-orange-50 text-[#FF4400]'
                    : 'text-zinc-655 hover:bg-zinc-50'
                  }`}
              >
                Events
              </button>

              <button
                onClick={() => {
                  setEditingRegId(null);
                  resetNewRegForm();
                  onNavigate('admin-forms');
                  setIsMobileMenuOpen(false);
                }}
                className={`block rounded-lg px-4 py-3 text-left text-xs font-bold tracking-wider uppercase transition-colors ${view === 'forms'
                    ? 'bg-orange-50 text-[#FF4400]'
                    : 'text-zinc-655 hover:bg-zinc-50'
                  }`}
              >
                Forms
              </button>

              <button
                onClick={() => {
                  onNavigate('admin-settings');
                  setIsMobileMenuOpen(false);
                }}
                className={`block rounded-lg px-4 py-3 text-left text-xs font-bold tracking-wider uppercase transition-colors ${view === 'settings'
                    ? 'bg-orange-50 text-[#FF4400]'
                    : 'text-zinc-655 hover:bg-zinc-50'
                  }`}
              >
                Settings
              </button>
            </div>

            <div className="pt-4 border-t border-zinc-200 flex flex-col gap-2">
              <button
                onClick={handleLogout}
                className="w-full bg-zinc-900 py-3 text-center text-xs font-mono font-black tracking-widest uppercase text-white hover:bg-zinc-850 transition-colors rounded-[7px]"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Admin Workspace Area */}
      <main className="flex-1 min-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-10 pt-24 lg:pt-10 space-y-8">
        {/* Success Alert Toast */}
        {successToast && (
          <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-white border border-zinc-200 text-zinc-900 px-5 py-4 flex items-center gap-3.5 shadow-xl font-sans text-xs uppercase tracking-wider animate-fade-in border-l-4 border-l-brand">
            <Sparkles className="h-5 w-5 text-brand" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Error Alert Toast */}
        {errorToast && (
          <div className="fixed bottom-6 right-6 z-50 rounded-xl bg-white border border-zinc-200 text-zinc-900 px-5 py-4 flex items-center gap-3.5 shadow-xl font-sans text-xs uppercase tracking-wider animate-fade-in border-l-4 border-l-red-550">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span>{errorToast}</span>
          </div>
        )}

        {/* Content Tabs */}
        {view === 'dashboard' && (
          <div className="space-y-6">

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-xl border border-zinc-200/85 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold text-zinc-500">Total runners</span>
                    <h3 className="text-2xl font-bold text-zinc-900 mt-1.5 tracking-tight">{totalRegistrations}</h3>
                  </div>
                  <Users className="h-5 w-5 text-brand" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-zinc-200/85 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold text-zinc-500">Total revenue</span>
                    <h3 className="text-2xl font-bold text-zinc-900 mt-1.5 tracking-tight">₱{totalRevenue.toLocaleString()}</h3>
                  </div>
                  <DollarSign className="h-5 w-5 text-brand" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-zinc-200/85 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold text-zinc-500">Verified slots</span>
                    <h3 className="text-2xl font-bold text-zinc-900 mt-1.5 tracking-tight">{verifiedCount}</h3>
                  </div>
                  <Check className="h-5 w-5 text-brand" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-zinc-200/85 shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-semibold text-zinc-500">Pending review</span>
                    <h3 className="text-2xl font-bold text-zinc-900 mt-1.5 tracking-tight">{pendingCount}</h3>
                  </div>
                  <AlertCircle className="h-5 w-5 text-brand animate-pulse" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Left Side: Upcoming Events slots analysis (2 columns wide) */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-zinc-200/85 p-6 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-zinc-150 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-zinc-900 tracking-tight">
                      Race events overview
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Registration slots and status tracking
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('admin-create-event')}
                    className="rounded-[7px] bg-[#FF4400] hover:bg-[#E63D00] text-white text-xs font-bold py-2 px-3.5 flex items-center gap-1.5 cursor-pointer transition-all shadow-sm active:scale-[0.98]"
                  >
                    + Launch event
                  </button>
                </div>

                <div className="space-y-4">
                  {events.map((evt) => {
                    const runnersForEvt = registrations.filter(r => r.eventTitle === evt.title && r.status === 'Verified').length;
                    const fillPercentage = Math.min(100, Math.round((runnersForEvt / (evt.details.slotsLeft || 500)) * 100));

                    return (
                      <div key={evt.id} className="border border-zinc-200/60 rounded-lg p-4 space-y-3 font-sans text-xs bg-zinc-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-zinc-800 text-sm leading-tight">
                              {evt.title}
                            </h4>
                            <span className="text-[10px] font-semibold text-zinc-500 block mt-1 font-mono">
                              Date: {evt.date} | Limit: {evt.details.slotsLeft || 500} Slots
                            </span>
                          </div>
                          <span className={`rounded-[4px] border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider font-mono ${evt.badge === 'OPEN'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                            {evt.badge || 'OPEN'}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-semibold text-zinc-500 font-mono">
                            <span>Slots filled: {runnersForEvt} / {evt.details.slotsLeft || 500}</span>
                            <span>{fillPercentage}%</span>
                          </div>
                          <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[#FF4400] h-full rounded-full transition-all duration-500"
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
              <div className="bg-white rounded-xl border border-zinc-200/85 p-6 shadow-sm space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="border-b border-zinc-150 pb-4">
                    <h3 className="text-base font-bold text-zinc-900 tracking-tight">
                      Recent signups
                    </h3>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      Latest 5 registered athletes
                    </p>
                  </div>

                  <div className="divide-y divide-zinc-100 font-sans text-xs">
                    {registrations.slice(0, 5).map((reg) => (
                      <div
                        key={reg.id}
                        onClick={() => {
                          if (onSelectReg) onSelectReg(reg.id);
                          onNavigate('admin-registration-details');
                        }}
                        className="py-3 flex justify-between items-center cursor-pointer hover:bg-zinc-50 px-2 rounded-lg transition-colors"
                      >
                        <div className="truncate pr-2">
                          <span className="font-bold text-zinc-800 text-xs block leading-tight">
                            {reg.firstName} {reg.lastName}
                          </span>
                          <span className="text-[10px] font-medium text-zinc-500 block mt-0.5 truncate max-w-[150px]">
                            {reg.eventTitle || 'Timing Portal'}
                          </span>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="font-bold text-[#FF4400] block">{reg.distance}</span>
                          <span className={`inline-block rounded-[4px] px-1.5 py-0.5 text-[9px] font-bold uppercase mt-1 font-mono ${reg.status === 'Verified'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                              : 'bg-amber-50 text-amber-700 border border-amber-100'
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
                  className="w-full rounded-[7px] border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 py-2.5 text-center text-xs font-bold text-zinc-700 transition-all cursor-pointer mt-4 shadow-sm active:scale-[0.98]"
                >
                  View all registrations
                </button>
              </div>

            </div>

          </div>
        )}

        {view === 'registrations' && (
          <div className="space-y-6">

            {/* Filter / Control Bar */}
            <div className="bg-white rounded-xl border border-zinc-200/85 p-5 shadow-sm space-y-4">
              <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                {/* Search */}
                <div className="relative w-full lg:max-w-md">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, bib number..."
                    className="w-full rounded-[7px] border border-zinc-200 bg-white pl-9.5 pr-4 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand font-medium shadow-sm transition-all"
                  />
                </div>

                {/* Exporter & Direct Register */}
                <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
                  <button
                    onClick={() => {
                      setEditingRegId(null);
                      resetNewRegForm();
                      onNavigate('admin-forms');
                    }}
                    className="w-full lg:w-auto rounded-[7px] bg-[#FF4400] hover:bg-[#E63D00] px-4 py-2 text-xs font-bold text-white transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-brand/10 active:scale-[0.98]"
                  >
                    <Plus className="h-4 w-4" />
                    New registration
                  </button>
                  <button
                    onClick={exportToCSV}
                    className="w-full lg:w-auto rounded-[7px] bg-white hover:bg-zinc-50 px-4 py-2 text-xs font-bold text-zinc-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm border border-zinc-200 active:scale-[0.98]"
                  >
                    <Download className="h-4 w-4" />
                    Export sheet
                  </button>
                </div>
              </div>

              {/* Filters list */}
              <div className="flex flex-wrap gap-3 pt-2 border-t border-zinc-150 items-center">
                <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-500 mr-2">
                  <Filter className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Filters</span>
                </div>

                {/* Event Title filter */}
                <div className="relative">
                  <select
                    value={selectedEventFilter}
                    onChange={(e) => setSelectedEventFilter(e.target.value)}
                    className="rounded-[7px] border border-zinc-200 bg-white pl-3.5 pr-8 py-2 text-xs text-zinc-600 focus:border-brand focus:outline-none cursor-pointer font-medium shadow-sm transition-colors appearance-none"
                  >
                    <option value="">All events</option>
                    {distinctEvents.map(evt => (
                      <option key={evt} value={evt} className="bg-white">{evt}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-zinc-400">
                    <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>

                {/* Payment filter */}
                <div className="relative">
                  <select
                    value={selectedPaymentFilter}
                    onChange={(e) => setSelectedPaymentFilter(e.target.value)}
                    className="rounded-[7px] border border-zinc-200 bg-white pl-3.5 pr-8 py-2 text-xs text-zinc-600 focus:border-brand focus:outline-none cursor-pointer font-medium shadow-sm transition-colors appearance-none"
                  >
                    <option value="" className="bg-white">All payment methods</option>
                    <option value="GCash" className="bg-white">GCash</option>
                    <option value="Maya" className="bg-white">Maya</option>
                    <option value="Bank" className="bg-white">Bank Deposit</option>
                    <option value="Card" className="bg-white">Credit/Debit Card</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-zinc-400">
                    <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>

                {/* Status filter */}
                <div className="relative">
                  <select
                    value={selectedStatusFilter}
                    onChange={(e) => setSelectedStatusFilter(e.target.value)}
                    className="rounded-[7px] border border-zinc-200 bg-white pl-3.5 pr-8 py-2 text-xs text-zinc-600 focus:border-brand focus:outline-none cursor-pointer font-medium shadow-sm transition-colors appearance-none"
                  >
                    <option value="" className="bg-white">All statuses</option>
                    <option value="Verified" className="bg-white">Verified</option>
                    <option value="Pending" className="bg-white">Pending</option>
                    <option value="Cancelled" className="bg-white">Cancelled</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-zinc-400">
                    <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedEventFilter || selectedPaymentFilter || selectedStatusFilter || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedEventFilter('');
                      setSelectedPaymentFilter('');
                      setSelectedStatusFilter('');
                      setSearchQuery('');
                    }}
                    className="text-xs font-semibold text-[#FF4400] hover:text-[#E63D00] transition-colors ml-auto cursor-pointer"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            {/* Spreadsheet Table */}
            <div className="bg-white rounded-xl border border-zinc-200/85 shadow-sm overflow-hidden font-sans">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs font-semibold text-zinc-600">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold text-zinc-500 uppercase tracking-wider select-none font-sans">
                      <th className="px-5 py-4">Bib #</th>
                      <th className="px-5 py-4">Runner Name</th>
                      <th className="px-5 py-4">Email Address</th>
                      <th className="px-5 py-4">Phone</th>
                      <th className="px-5 py-4">Category</th>
                      <th className="px-5 py-4">Dist / Size</th>
                      <th className="px-5 py-4">Method</th>
                      <th className="px-5 py-4">Ref # / Date</th>
                      <th className="px-5 py-4 text-center">Status</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {filteredRegistrations.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="px-5 py-12 text-center text-zinc-400 font-medium">
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
                          className="hover:bg-zinc-50/70 transition-colors cursor-pointer text-zinc-600"
                        >
                          {/* Bib */}
                          <td className="px-5 py-4 font-extrabold text-zinc-900">
                            {reg.registeredBib ? `${reg.registeredBib}` : '—'}
                          </td>
                          {/* Name */}
                          <td className="px-5 py-4 text-xs font-bold text-zinc-900">
                            {reg.firstName} {reg.lastName}
                            <span className="text-[10px] block font-medium text-zinc-500 truncate max-w-[160px] mt-0.5 font-mono">
                              {reg.eventTitle || 'Timing Portal'}
                            </span>
                          </td>
                          {/* Email */}
                          <td className="px-5 py-4 text-zinc-500 font-medium">
                            {reg.email}
                          </td>
                          {/* Phone */}
                          <td className="px-5 py-4 text-zinc-500 font-medium text-[11px]">
                            {reg.phone || '—'}
                          </td>
                          {/* Gender */}
                          <td className="px-5 py-4 text-zinc-500 font-semibold text-[11px]">
                            {reg.gender || '—'}
                          </td>
                          {/* Distance & Size */}
                          <td className="px-5 py-4 text-[11px]">
                            <span className="text-[#FF4400] font-bold block">{reg.distance}</span>
                            <span className="text-zinc-500 font-medium text-[10px] block truncate max-w-[100px]">{reg.size ? reg.size.replace('Unisex - ', '') : '—'}</span>
                          </td>
                          {/* Method */}
                          <td className="px-5 py-4 text-[11px] font-semibold text-zinc-700">
                            {reg.paymentMethod}
                          </td>
                          {/* Ref # / Date */}
                          <td className="px-5 py-4 text-[10px] leading-tight text-zinc-500">
                            <span className="font-semibold text-zinc-750 block truncate max-w-[120px] font-sans">{reg.referenceNumber}</span>
                            <span className="text-[9px] font-medium block mt-0.5 font-mono">
                              {reg.registrationDate ? new Date(reg.registrationDate).toLocaleDateString() : '—'}
                            </span>
                          </td>
                          {/* Status */}
                          <td className="px-5 py-4 text-center">
                            <span className={`inline-block rounded-[4px] px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase border font-mono ${reg.status === 'Verified'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : reg.status === 'Cancelled'
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                              {reg.status || 'Pending'}
                            </span>
                          </td>
                          {/* Actions */}
                          <td className="px-5 py-4 text-right">
                            <div className="flex gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                              {reg.status !== 'Verified' && (
                                <button
                                  onClick={() => handleVerifyStatus(reg.id, 'Verified')}
                                  title="Verify Runner"
                                  className="h-7 w-7 rounded-[7px] border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-center transition-all cursor-pointer text-zinc-600 active:scale-[0.98] shadow-sm"
                                >
                                  <Check className="h-4 w-4" />
                                </button>
                              )}
                              {reg.status !== 'Cancelled' && (
                                <button
                                  onClick={() => handleVerifyStatus(reg.id, 'Cancelled')}
                                  title="Cancel Registration"
                                  className="h-7 w-7 rounded-[7px] border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 flex items-center justify-center transition-all cursor-pointer text-zinc-600 active:scale-[0.98] shadow-sm"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteRegistration(reg.id)}
                                title="Delete Record"
                                className="h-7 w-7 rounded-[7px] border border-zinc-200 bg-zinc-50 hover:bg-red-50 hover:text-red-650 flex items-center justify-center transition-all cursor-pointer text-zinc-600 active:scale-[0.98] shadow-sm"
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

        {view === 'forms' && (() => {
          const selectedEvent = events.find(e => e.title === newReg.eventTitle) || events[0];
          const formattedRaceDate = selectedEvent?.date
            ? new Date(selectedEvent.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
            : '—';

          const baseFee = selectedEvent?.distanceFees?.[newReg.distance] || 0;

          let earlyBirdDiscount = 0;
          if (selectedEvent?.earlyBirdDeadline && selectedEvent?.earlyBirdDiscountPercent) {
            const today = new Date();
            const deadline = new Date(selectedEvent.earlyBirdDeadline);
            if (today <= deadline) {
              earlyBirdDiscount = Math.round(baseFee * (selectedEvent.earlyBirdDiscountPercent / 100));
            }
          }
          const totalFee = Math.max(0, baseFee - earlyBirdDiscount);
          const inclusionsList = selectedEvent?.inclusions || selectedEvent?.details?.perks || [];

          return (
            <div className="bg-white p-6 md:p-8 w-full animate-fade-in font-sans text-zinc-800">

              <div className="mb-8">
                <h1 className="font-sans text-3xl font-extrabold tracking-tight text-zinc-900">
                  Runner <span className="font-serif italic font-bold text-brand">Registration</span>
                </h1>
                <p className="mt-2 text-sm text-zinc-500 font-medium">
                  {editingRegId
                    ? 'Update profile details to verify the slot in the administrative dashboard.'
                    : 'Manually register a runner profile to verify slots and timing tags.'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Form Column */}
                <form onSubmit={handleAddRegSubmit} className="lg:col-span-2 space-y-8 text-xs font-semibold text-zinc-650">

                  {/* Personal Data */}
                  <div className="space-y-5">
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-900 pb-1">
                      PERSONAL DATA
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-900 mb-2 block">
                          FIRST NAME
                        </label>
                        <input
                          type="text"
                          required
                          value={newReg.firstName}
                          onChange={(e) => setNewReg(prev => ({ ...prev, firstName: e.target.value }))}
                          placeholder="e.g. Juan"
                          className="w-full rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-brand focus:outline-none transition-colors shadow-sm font-sans"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-900 mb-2 block">
                          LAST NAME
                        </label>
                        <input
                          type="text"
                          required
                          value={newReg.lastName}
                          onChange={(e) => setNewReg(prev => ({ ...prev, lastName: e.target.value }))}
                          placeholder="e.g. Dela Cruz"
                          className="w-full rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-brand focus:outline-none transition-colors shadow-sm font-sans"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-900 mb-2 block">
                          EMAIL ADDRESS
                        </label>
                        <input
                          type="email"
                          required
                          value={newReg.email}
                          onChange={(e) => setNewReg(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="jundelacruz@gmail.com"
                          className="w-full rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-brand focus:outline-none transition-colors shadow-sm font-sans"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-900 mb-2 block">
                          PHONE NUMBER
                        </label>
                        <input
                          type="text"
                          required
                          value={newReg.phone}
                          onChange={(e) => setNewReg(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="09123456789"
                          className="w-full rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-brand focus:outline-none transition-colors shadow-sm font-sans"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-900 mb-2 block">
                          GENDER IDENTIFICATION
                        </label>
                        <div className="relative">
                          <select
                            value={newReg.gender}
                            onChange={(e) => setNewReg(prev => ({ ...prev, gender: e.target.value }))}
                            className="w-full rounded-md border border-zinc-200 bg-white pl-4 pr-10 py-3 text-sm text-zinc-900 focus:border-brand focus:outline-none cursor-pointer font-medium shadow-sm transition-colors font-sans appearance-none"
                          >
                            <option value="Male" className="bg-white">Male</option>
                            <option value="Female" className="bg-white">Female</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-900 mb-2 block">
                          JERSEY SIZE (OPTIONAL)
                        </label>
                        <div className="relative">
                          <select
                            value={newReg.size}
                            onChange={(e) => setNewReg(prev => ({ ...prev, size: e.target.value }))}
                            className="w-full rounded-md border border-zinc-200 bg-white pl-4 pr-10 py-3 text-sm text-zinc-900 focus:border-brand focus:outline-none cursor-pointer font-medium shadow-sm transition-colors font-sans appearance-none"
                          >
                            <option value="Unisex - Extra Small (XS)" className="bg-white">Extra Small (XS)</option>
                            <option value="Unisex - Small (S)" className="bg-white">Small (S)</option>
                            <option value="Unisex - Medium (M)" className="bg-white">Medium (M)</option>
                            <option value="Unisex - Large (L)" className="bg-white">Large (L)</option>
                            <option value="Unisex - Extra Large (XL)" className="bg-white">Extra Large (XL)</option>
                            <option value="Unisex - Double Extra Large (2XL)" className="bg-white">Double Extra Large (2XL)</option>
                            <option value="Unisex - Triple Extra Large (3XL)" className="bg-white">Triple Extra Large (3XL)</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Event Selection */}
                  <div className="space-y-5">
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-900 pb-1">
                      EVENT SELECTION
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-900 mb-2 block">
                          SELECTED EVENT
                        </label>
                        <div className="relative">
                          <select
                            value={newReg.eventTitle}
                            onChange={(e) => handleNewRegEventChange(e.target.value)}
                            className="w-full rounded-md border border-zinc-200 bg-white pl-4 pr-10 py-3 text-sm text-zinc-900 focus:border-brand focus:outline-none cursor-pointer font-medium shadow-sm transition-colors font-sans appearance-none"
                          >
                            {events.map(evt => (
                              <option key={evt.id} value={evt.title} className="bg-white">{evt.title}</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-900 mb-2 block">
                          SELECTED DISTANCE
                        </label>
                        <div className="relative">
                          <select
                            value={newReg.distance}
                            onChange={(e) => setNewReg(prev => ({ ...prev, distance: e.target.value }))}
                            className="w-full rounded-md border border-zinc-200 bg-white pl-4 pr-10 py-3 text-sm text-zinc-900 focus:border-brand focus:outline-none cursor-pointer font-medium shadow-sm transition-colors font-sans appearance-none"
                          >
                            {((events.find(e => e.title === newReg.eventTitle))?.distances || ['3K', '5K', '10K']).map(dist => (
                              <option key={dist} value={dist} className="bg-white">{dist}</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-900 mb-2 block">
                          PAYMENT METHOD
                        </label>
                        <div className="relative">
                          <select
                            value={newReg.paymentMethod}
                            onChange={(e) => setNewReg(prev => ({ ...prev, paymentMethod: e.target.value }))}
                            className="w-full rounded-md border border-zinc-200 bg-white pl-4 pr-10 py-3 text-sm text-zinc-900 focus:border-brand focus:outline-none cursor-pointer font-medium shadow-sm transition-colors font-sans appearance-none"
                          >
                            <option value="GCash" className="bg-white">GCash</option>
                            <option value="Maya" className="bg-white">Maya</option>
                            <option value="Bank" className="bg-white">Bank Deposit</option>
                            <option value="Card" className="bg-white">Credit/Debit Card</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-900 mb-2 block">
                          REFERENCE NUMBER
                        </label>
                        <input
                          type="text"
                          required
                          value={newReg.referenceNumber}
                          onChange={(e) => setNewReg(prev => ({ ...prev, referenceNumber: e.target.value }))}
                          placeholder="e.g. 1029384756102"
                          className="w-full rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-brand focus:outline-none transition-colors shadow-sm font-sans"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-900 mb-2 block">
                          REGISTRATION STATUS
                        </label>
                        <div className="relative">
                          <select
                            value={newReg.status}
                            onChange={(e) => setNewReg(prev => ({ ...prev, status: e.target.value as any }))}
                            className="w-full rounded-md border border-zinc-200 bg-white pl-4 pr-10 py-3 text-sm text-zinc-900 focus:border-brand focus:outline-none cursor-pointer font-medium shadow-sm transition-colors font-sans appearance-none"
                          >
                            <option value="Verified" className="bg-white">Verified</option>
                            <option value="Pending" className="bg-white">Pending</option>
                            <option value="Cancelled" className="bg-white">Cancelled</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-900 mb-2 block">
                          ASSIGNED BIB NUMBER (OPTIONAL)
                        </label>
                        <input
                          type="text"
                          value={newReg.registeredBib}
                          onChange={(e) => setNewReg(prev => ({ ...prev, registeredBib: e.target.value.replace(/\D/g, '') }))}
                          placeholder="Auto-generated if empty"
                          className="w-full rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-brand focus:outline-none transition-colors shadow-sm font-sans font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-5">
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-900 pb-1">
                      EMERGENCY CONTACT
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-900 mb-2 block">
                          EMERGENCY NAME
                        </label>
                        <input
                          type="text"
                          value={newReg.emergencyContact}
                          onChange={(e) => setNewReg(prev => ({ ...prev, emergencyContact: e.target.value }))}
                          placeholder="Maria Dela Cruz"
                          className="w-full rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-brand focus:outline-none transition-colors shadow-sm font-sans"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-extrabold uppercase tracking-wider text-zinc-900 mb-2 block">
                          EMERGENCY PHONE NUMBER
                        </label>
                        <input
                          type="text"
                          value={newReg.emergencyPhone}
                          onChange={(e) => setNewReg(prev => ({ ...prev, emergencyPhone: e.target.value }))}
                          placeholder="e.g. 09187654321"
                          className="w-full rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:border-brand focus:outline-none transition-colors shadow-sm font-sans"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6 font-sans">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingRegId(null);
                        resetNewRegForm();
                        if (editingRegId) {
                          onNavigate('admin-registration-details');
                        } else {
                          onNavigate('admin-registrations');
                        }
                      }}
                      className="flex-1 rounded-[7px] border border-zinc-200 bg-white py-3.5 text-center text-sm font-sans font-bold text-zinc-700 hover:bg-zinc-50 transition-colors uppercase tracking-widest cursor-pointer shadow-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-[7px] bg-[#FF4400] hover:bg-[#E63D00] py-3.5 text-center text-sm font-sans font-bold text-white transition-colors uppercase tracking-widest cursor-pointer shadow-md shadow-brand/10"
                    >
                      {editingRegId ? 'Save changes' : 'Proceed to Register'}
                    </button>
                  </div>
                </form>

                {/* Right Column: Registration Summary */}
                <div className="lg:col-span-1">
                  <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-5 text-left font-sans lg:sticky lg:top-6">
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-900">
                      REGISTRATION SUMMARY
                    </h3>

                    <div className="border-t border-zinc-150 pt-4 space-y-4">
                      <div>
                        <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest block">
                          SELECTED EVENT
                        </span>
                        <span className="text-sm font-bold text-zinc-900 mt-1 block">
                          {newReg.eventTitle || '—'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest block">
                            LOCATION
                          </span>
                          <span className="text-xs font-semibold text-zinc-750 mt-1 block">
                            {selectedEvent?.location || '—'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest block">
                            RACE DATE
                          </span>
                          <span className="text-xs font-semibold text-zinc-750 mt-1 block">
                            {formattedRaceDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    {inclusionsList.length > 0 && (
                      <div className="border-t border-zinc-150 pt-4">
                        <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest block">
                          INCLUSIONS FOR {newReg.distance || '—'} EARLY BIRD
                        </span>
                        <ul className="mt-2.5 space-y-1.5 text-xs text-zinc-550 font-semibold list-none pl-0">
                          {inclusionsList.map((inclusion, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 flex-shrink-0" />
                              {inclusion}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Charge Breakdown */}
                    <div className="border-t border-zinc-150 pt-4 space-y-2">
                      <div className="flex justify-between items-center text-xs text-zinc-550 font-semibold">
                        <span>Base Fee ({newReg.distance || '—'})</span>
                        <span>P {baseFee.toLocaleString()}</span>
                      </div>
                      {earlyBirdDiscount > 0 ? (
                        <div className="flex justify-between items-center text-xs text-emerald-600 font-extrabold font-mono">
                          <span>Early Bird Discount ({selectedEvent?.earlyBirdDiscountPercent || 0}%)</span>
                          <span>- P {earlyBirdDiscount.toLocaleString()}</span>
                        </div>
                      ) : null}
                    </div>

                    <div className="border-t border-zinc-150 pt-4 flex justify-between items-center">
                      <span className="text-sm font-bold text-zinc-900">
                        Total Charge
                      </span>
                      <span className="text-sm font-extrabold text-brand">
                        P {totalFee.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          );
        })()}

        {view === 'settings' && (
          <div className="bg-white p-6 md:p-8 w-full animate-fade-in font-sans select-none">

            <div className="mb-8">
              <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">
                Hero & Promotion Settings
              </h2>
              <p className="mt-1.5 text-sm text-zinc-500 font-medium">
                Configure which race is promoted in the Hero section and customize its appearance.
              </p>
            </div>

            <div className="space-y-6">
              {/* Select Promoted Event */}
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-zinc-900 mb-2 font-sans">
                  Select Promoted Event / Race
                </label>
                <div className="relative">
                  <select
                    value={heroSettings?.promotedEventId || ''}
                    onChange={(e) => {
                      if (onUpdateHeroSettings && heroSettings) {
                        onUpdateHeroSettings({
                          ...heroSettings,
                          promotedEventId: e.target.value
                        });
                      }
                    }}
                    className="w-full rounded-[7px] border border-zinc-200 bg-white pl-4 pr-10 py-3.5 text-sm text-zinc-900 focus:border-brand focus:outline-none cursor-pointer font-medium shadow-sm transition-colors animate-fade-in appearance-none"
                  >
                    <option value="" className="bg-white">Automatic (Resolve Nearest Upcoming Event)</option>
                    {events.map((evt) => (
                      <option key={evt.id} value={evt.id} className="bg-white">
                        {evt.title} ({evt.date})
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-zinc-500 font-medium mt-1.5">
                  The selected event's name will replace the Hero text, and the countdown clock will target its registration deadline.
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-zinc-900 mb-2 font-sans">
                  Hero Section Background Image
                </label>

                <div className="relative h-44 rounded-2xl border border-zinc-200 overflow-hidden shadow-sm bg-zinc-50 flex items-center justify-center">
                  <img
                    src={heroSettings?.heroBackgroundImage || '/images/hero-bg.png'}
                    alt="Hero Background Preview"
                    className="h-full w-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent flex items-end p-4">
                    <span className="text-[10px] font-mono text-white/95 overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
                      Active Image: {heroSettings?.heroBackgroundImage}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-600 block font-sans mb-1">Custom URL</span>
                    <input
                      type="text"
                      value={heroSettings?.heroBackgroundImage || ''}
                      onChange={(e) => {
                        if (onUpdateHeroSettings && heroSettings) {
                          onUpdateHeroSettings({
                            ...heroSettings,
                            heroBackgroundImage: e.target.value
                          });
                        }
                      }}
                      placeholder="e.g. https://example.com/image.jpg"
                      className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-brand focus:outline-none shadow-sm"
                    />
                  </div>

                  <div className="space-y-1.5 font-sans">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-600 block font-sans mb-1">Upload File</span>
                    <div className="border border-dashed border-zinc-200 hover:border-brand rounded-lg p-3.5 text-center transition-colors cursor-pointer relative bg-zinc-50 hover:bg-brand/[0.01] flex items-center justify-center gap-2 h-[46px] shadow-sm">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              if (typeof reader.result === 'string' && onUpdateHeroSettings && heroSettings) {
                                onUpdateHeroSettings({
                                  ...heroSettings,
                                  heroBackgroundImage: reader.result
                                });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <ImageIcon className="h-4 w-4 text-zinc-500" />
                      <span className="text-xs font-bold text-zinc-700">Choose custom file</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-600 block font-sans mb-1">Presets</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { name: 'Original', url: '/images/hero-bg.png' },
                      { name: 'Neon Night', url: 'https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&w=800&q=80' },
                      { name: 'Mountain Peak', url: 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?auto=format&fit=crop&w=800&q=80' },
                      { name: 'Ocean Coastal', url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80' }
                    ].map(preset => {
                      const isActive = heroSettings?.heroBackgroundImage === preset.url;
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            if (onUpdateHeroSettings && heroSettings) {
                              onUpdateHeroSettings({
                                ...heroSettings,
                                heroBackgroundImage: preset.url
                              });
                            }
                          }}
                          className={`rounded-lg border py-3 px-4 text-center text-xs font-bold transition-all cursor-pointer truncate ${isActive
                              ? 'bg-[#FF4400] text-white border-[#FF4400] shadow-sm font-black font-sans'
                              : 'border-zinc-200 text-zinc-600 bg-white hover:border-brand hover:text-brand'
                            }`}
                        >
                          {preset.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    showToast('Hero and Promotion settings saved successfully!');
                    onNavigate('admin-dashboard');
                  }}
                  className="rounded-[7px] bg-[#FF4400] hover:bg-[#E63D00] text-white text-sm font-bold py-3.5 px-8 cursor-pointer transition-all shadow-md shadow-brand/10 active:scale-[0.98] font-sans"
                >
                  Save settings
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'events' && !editingEvent && (
          <div className="space-y-6 animate-fade-in font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl border border-zinc-200 shadow-sm gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 animate-fade-in">
                  Active race events
                </h2>
                <p className="mt-1 text-xs text-zinc-500 font-medium animate-fade-in">
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
                    iconType: 'compass',
                    inclusions: 'Singlet, Race Bib',
                    jerseyFee: 250,
                    earlyBirdDeadline: '',
                    earlyBirdDiscountPercent: 20,
                    distanceFees: {}
                  });
                  setGalleryPhotos([]);
                  setDistanceRoutes({});
                  setRouteMapPhotos([]);
                  setKitPhotos([]);
                  setFormStep(1);
                  onNavigate('admin-create-event');
                }}
                className="w-full sm:w-auto rounded-[7px] bg-[#FF4400] hover:bg-[#E63D00] text-white text-xs font-bold py-2 px-3.5 cursor-pointer transition-all shadow-md shadow-brand/10 text-center whitespace-nowrap active:scale-[0.98]"
              >
                + Create event
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((evt) => {
                const verifiedRunners = registrations.filter(r => r.eventTitle === evt.title && r.status === 'Verified').length;

                return (
                  <div key={evt.id} className="bg-white rounded-xl border border-zinc-200/85 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                    <div>
                      {/* Image header */}
                      <div className="h-44 bg-zinc-100 overflow-hidden relative">
                        <img src={evt.image} alt={evt.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <span className={`absolute top-4 right-4 rounded-[4px] border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider font-mono ${evt.badge === 'OPEN'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                          }`}>
                          {evt.badge || 'OPEN'}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="font-bold text-zinc-800 text-sm leading-snug line-clamp-2">
                            {evt.title}
                          </h3>
                          <span className="text-[10px] font-semibold text-zinc-500 block mt-1.5 font-mono">
                            {evt.date} | {evt.location}
                          </span>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-3 text-xs border-t border-b border-zinc-150 py-3 text-zinc-650 font-sans">
                          <div>
                            <span className="text-zinc-450 font-bold uppercase tracking-wider block text-[9px]">Fee</span>
                            <span className="text-zinc-800 font-semibold">{evt.details.fee}</span>
                          </div>
                          <div>
                            <span className="text-zinc-450 font-bold uppercase tracking-wider block text-[9px]">Slots Left</span>
                            <span className="text-zinc-800 font-semibold">{evt.details.slotsLeft || 500}</span>
                          </div>
                          <div>
                            <span className="text-zinc-450 font-bold uppercase tracking-wider block text-[9px]">Distances</span>
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {evt.distances.map(d => (
                                <span key={d} className="bg-zinc-50 border border-zinc-150 px-1.5 py-0.5 rounded-[4px] font-bold text-[#FF4400] text-[10px]">{d}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-zinc-455 font-bold uppercase tracking-wider block text-[9px]">Subscribers</span>
                            <span className="text-zinc-800 font-semibold">{verifiedRunners} Verified</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions bar */}
                    <div className="px-6 pb-6 pt-2 flex gap-3 text-xs">
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
                            iconType: evt.iconType || 'compass',
                            inclusions: evt.inclusions ? evt.inclusions.join(', ') : 'Singlet, Race Bib',
                            jerseyFee: evt.jerseyFee !== undefined ? evt.jerseyFee : 250,
                            earlyBirdDeadline: evt.earlyBirdDeadline || '',
                            earlyBirdDiscountPercent: evt.earlyBirdDiscountPercent !== undefined ? evt.earlyBirdDiscountPercent : 20,
                            distanceFees: evt.distanceFees || {}
                          });
                          setGalleryPhotos(evt.galleryImages || [evt.image]);
                          const initialRoutes: Record<string, string> = {};
                          evt.distances.forEach(d => {
                            initialRoutes[d] = evt.details.routes?.[d] || evt.details.route || '';
                          });
                          setDistanceRoutes(initialRoutes);
                          setRouteMapPhotos(parseImages(evt.routeMapImage));
                          setKitPhotos(parseImages(evt.kitImage));
                          setFormStep(1);
                        }}
                        className="flex-1 rounded-[7px] border border-zinc-200 bg-zinc-50 py-2 text-center text-xs font-bold text-zinc-700 hover:bg-zinc-100 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
                      >
                        Edit info
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to permanently delete event "${evt.title}"?`)) {
                            const updatedList = events.filter(e => e.id !== evt.id);
                            if (onUpdateEvents) onUpdateEvents(updatedList);
                            showToast(`Successfully deleted event: "${evt.title}"`);
                          }
                        }}
                        className="rounded-[7px] border border-red-200 hover:border-red-350 bg-red-50 px-3 py-2 text-red-650 hover:bg-red-100/80 transition-all cursor-pointer active:scale-[0.98]"
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
          <div className="bg-white p-6 md:p-8 w-full text-zinc-800">

            <div className="mb-8">
              <h2 className="font-display text-2xl font-black text-zinc-900 uppercase tracking-tight">
                {editingEvent ? "Edit Race Event Details" : "Race Event Upload Form"}
              </h2>
              <p className="mt-1 text-sm text-zinc-500 font-medium animate-fade-in">
                {editingEvent
                  ? `Modify the fields below to update specifications for "${editingEvent.title}".`
                  : "Fill in the details below to launch a new competitive race category and activate it in the client system."
                }
              </p>
            </div>

            {/* Form Progress Bar */}
            <div className="mb-6 select-none bg-zinc-50 rounded-2xl border border-zinc-200 p-4 animate-fade-in">
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-zinc-650 mb-2">
                <span className={formStep === 1 ? "text-brand font-black" : ""}>Step 1: Specifications</span>
                <span className={formStep === 2 ? "text-brand font-black" : ""}>Step 2: Media & Gallery</span>
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
                <div className="space-y-8 animate-fade-in font-sans">
                  {/* Card 1: Basic Specifications */}
                  <div className="bg-white rounded-xl border border-zinc-200/80 p-6 shadow-sm space-y-6">
                    <div className="border-b border-zinc-150 pb-3.5">
                      <h3 className="text-xs font-black uppercase tracking-wider text-zinc-800 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-brand"></span>
                        Basic Details
                      </h3>
                      <p className="text-[11px] text-zinc-400 font-medium mt-0.5">Define name, date, location, and registration status.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 mb-2">
                          Race Event Title <span className="text-brand">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={newEvent.title}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="e.g. Bacolod Sunset Coast Half Marathon"
                          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-350 focus:border-brand focus:ring-2 focus:ring-brand/10 focus:outline-none transition-all shadow-sm font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 mb-2">
                          Badge / Registration Status
                        </label>
                        <div className="relative">
                          <select
                            value={newEvent.badge}
                            onChange={(e) => setNewEvent(prev => ({ ...prev, badge: e.target.value as any }))}
                            className="w-full rounded-lg border border-zinc-200 bg-white pl-4 pr-10 py-3 text-sm text-zinc-900 focus:border-brand focus:ring-2 focus:ring-brand/10 focus:outline-none cursor-pointer font-bold transition-all shadow-sm appearance-none"
                          >
                            <option value="OPEN">OPEN (REGISTERING)</option>
                            <option value="CLOSING SOON">CLOSING SOON</option>
                            <option value="SOLD OUT">SOLD OUT</option>
                            <option value="PAST EVENT">PAST EVENT</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 mb-2">
                          Race Date <span className="text-brand">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={newEvent.date}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                          placeholder="Oct 24, 2026"
                          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-350 focus:border-brand focus:ring-2 focus:ring-brand/10 focus:outline-none transition-all shadow-sm font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 mb-2">
                          Gunstart Time
                        </label>
                        <input
                          type="text"
                          value={newEvent.time}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                          placeholder="05:00 AM"
                          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-350 focus:border-brand focus:ring-2 focus:ring-brand/10 focus:outline-none text-center transition-all shadow-sm font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 mb-2">
                          Deadline Date
                        </label>
                        <input
                          type="text"
                          value={newEvent.deadline}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, deadline: e.target.value }))}
                          placeholder="Oct 15, 2026"
                          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-350 focus:border-brand focus:ring-2 focus:ring-brand/10 focus:outline-none transition-all shadow-sm font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 mb-2">
                          Location <span className="text-brand">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={newEvent.location}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="Bacolod City"
                          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-350 focus:border-brand focus:ring-2 focus:ring-brand/10 focus:outline-none transition-all shadow-sm font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Fees & Inclusions */}
                  <div className="bg-white rounded-xl border border-zinc-200/80 p-6 shadow-sm space-y-6">
                    <div className="border-b border-zinc-150 pb-3.5">
                      <h3 className="text-xs font-black uppercase tracking-wider text-zinc-800 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-brand"></span>
                        Fees & Inclusions
                      </h3>
                      <p className="text-[11px] text-zinc-400 font-medium mt-0.5">Specify basic entry charges, optional add-ons, and items included in the kit.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 mb-2">
                          Base Entry Fee (PHP) <span className="text-brand">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={newEvent.fee}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, fee: e.target.value }))}
                          placeholder="₱1,200.00"
                          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-355 focus:border-brand focus:ring-2 focus:ring-brand/10 focus:outline-none transition-all shadow-sm font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 mb-2">
                          Runner Limit (Slots)
                        </label>
                        <input
                          type="number"
                          value={newEvent.slotsLimit}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, slotsLimit: parseInt(e.target.value) || 500 }))}
                          placeholder="500"
                          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-355 focus:border-brand focus:ring-2 focus:ring-brand/10 focus:outline-none transition-all shadow-sm font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 mb-2">
                          Jersey / Kit Add-on Fee (PHP)
                        </label>
                        <input
                          type="number"
                          value={newEvent.jerseyFee}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, jerseyFee: parseInt(e.target.value) || 0 }))}
                          placeholder="250"
                          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-355 focus:border-brand focus:ring-2 focus:ring-brand/10 focus:outline-none transition-all shadow-sm font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 mb-2">
                        Race Inclusions (Comma-separated)
                      </label>
                      <input
                        type="text"
                        value={newEvent.inclusions}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, inclusions: e.target.value }))}
                        placeholder="e.g. Dry-Fit Singlet, Race Bib, Finisher Medal"
                        className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-355 focus:border-brand focus:ring-2 focus:ring-brand/10 focus:outline-none transition-all shadow-sm font-medium"
                      />
                    </div>
                  </div>

                  {/* Card 3: Early Bird Promotion */}
                  <div className="bg-white rounded-xl border border-zinc-200/80 p-6 shadow-sm space-y-6">
                    <div className="border-b border-zinc-150 pb-3.5">
                      <h3 className="text-xs font-black uppercase tracking-wider text-zinc-800 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-brand"></span>
                        Early Bird Promotion
                      </h3>
                      <p className="text-[11px] text-zinc-400 font-medium mt-0.5">Optionally configure discounts for early registrations.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 mb-2">
                          Early Bird Promotion Deadline Date
                        </label>
                        <input
                          type="text"
                          value={newEvent.earlyBirdDeadline}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, earlyBirdDeadline: e.target.value }))}
                          placeholder="e.g. Oct 5, 2026"
                          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-355 focus:border-brand focus:ring-2 focus:ring-brand/10 focus:outline-none transition-all shadow-sm font-medium"
                        />
                        <span className="text-[10px] text-zinc-450 font-medium mt-2 block">Leave empty to disable early bird discount.</span>
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 mb-2">
                          Early Bird Discount Percentage (%)
                        </label>
                        <input
                          type="number"
                          value={newEvent.earlyBirdDiscountPercent}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, earlyBirdDiscountPercent: parseInt(e.target.value) || 0 }))}
                          placeholder="20"
                          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-355 focus:border-brand focus:ring-2 focus:ring-brand/10 focus:outline-none transition-all shadow-sm font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Distance & Course Configuration */}
                  <div className="bg-white rounded-xl border border-zinc-200/80 p-6 shadow-sm space-y-6">
                    <div className="border-b border-zinc-150 pb-3.5">
                      <h3 className="text-xs font-black uppercase tracking-wider text-zinc-800 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-brand"></span>
                        Distance & Course Configuration
                      </h3>
                      <p className="text-[11px] text-zinc-400 font-medium mt-0.5">Select active distance classes and configure pricing and maps for each.</p>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 mb-2">
                        Distance Categories <span className="text-brand">*</span>
                      </label>
                      <div className="flex flex-wrap gap-2.5 bg-zinc-50 rounded-xl border border-zinc-200 p-4">
                        {['3K', '5K', '10K', '16K', '21K', '32K', '42K'].map(dist => {
                          const isChecked = newEvent.distances.includes(dist);
                          return (
                            <label
                              key={dist}
                              className={`flex items-center gap-2 cursor-pointer border px-4.5 py-2.5 rounded-lg select-none transition-all ${isChecked ? 'border-brand text-brand font-black bg-brand/[0.03] shadow-sm' : 'border-zinc-200 hover:border-zinc-350 text-zinc-700 bg-white hover:bg-zinc-50'
                                }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleDistanceCheckboxChange(dist)}
                                className="sr-only"
                              />
                              <span className="text-xs font-bold">{dist}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Pricing per Distance Category */}
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 mb-2">
                        Pricing per Distance Category (PHP) <span className="text-brand">*</span>
                      </label>
                      {newEvent.distances.length === 0 ? (
                        <div className="text-xs font-medium bg-zinc-50 text-zinc-400 border border-zinc-200 rounded-xl p-4 text-center">
                          Select at least one distance category above to configure pricing.
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-zinc-50 border border-zinc-200 rounded-xl p-4 animate-fade-in">
                          {newEvent.distances.map((dist) => (
                            <div key={dist} className="space-y-1.5">
                              <span className="text-xs font-bold text-zinc-650 block">{dist} Fee</span>
                              <input
                                type="number"
                                required
                                value={newEvent.distanceFees[dist] || ''}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0;
                                  setNewEvent(prev => ({
                                    ...prev,
                                    distanceFees: {
                                      ...prev.distanceFees,
                                      [dist]: val
                                    }
                                  }));
                                }}
                                placeholder="e.g. 500"
                                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-355 focus:border-brand focus:ring-2 focus:ring-brand/10 focus:outline-none transition-all shadow-sm font-medium"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Route Maps / Path descriptions per category */}
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 mb-2">
                        Route Maps / Path descriptions per category <span className="text-brand">*</span>
                      </label>
                      {newEvent.distances.length === 0 ? (
                        <div className="text-xs font-medium bg-zinc-50 text-zinc-400 border border-zinc-200 rounded-xl p-4 text-center">
                          Please select at least one distance category above to specify routes.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-50 rounded-xl border border-zinc-200 p-4">
                          {newEvent.distances.map((dist) => (
                            <div key={dist} className="space-y-1.5 animate-fade-in">
                              <div className="flex justify-between items-center">
                                <span className="bg-brand/10 text-brand font-mono font-bold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">{dist} category</span>
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
                                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder-zinc-355 focus:border-brand focus:ring-2 focus:ring-brand/10 focus:outline-none transition-all shadow-sm font-medium"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card 5: Aesthetic & Additional Features */}
                  <div className="bg-white rounded-xl border border-zinc-200/80 p-6 shadow-sm space-y-6">
                    <div className="border-b border-zinc-150 pb-3.5">
                      <h3 className="text-xs font-black uppercase tracking-wider text-zinc-800 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-brand"></span>
                        Aesthetics & Perks
                      </h3>
                      <p className="text-[11px] text-zinc-400 font-medium mt-0.5">Describe secondary event features, athlete highlights, and other details.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 mb-2">
                          Athlete Perks (Comma-separated)
                        </label>
                        <input
                          type="text"
                          value={newEvent.perks}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, perks: e.target.value }))}
                          placeholder="e.g. RFID Timing Chip, Finisher Medal, Sub-assembly Singlet"
                          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-355 focus:border-brand focus:ring-2 focus:ring-brand/10 focus:outline-none transition-all shadow-sm font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 mb-2">
                          Race Highlights (Comma-separated)
                        </label>
                        <input
                          type="text"
                          value={newEvent.highlights}
                          onChange={(e) => setNewEvent(prev => ({ ...prev, highlights: e.target.value }))}
                          placeholder="e.g. AIMS Certified course, Sub-15 Timing Hubs, Post-race hydration booths"
                          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-355 focus:border-brand focus:ring-2 focus:ring-brand/10 focus:outline-none transition-all shadow-sm font-medium"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-zinc-500 mb-2">
                        Race Description
                      </label>
                      <textarea
                        rows={3}
                        value={newEvent.description}
                        onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Provide registration notes, details about the hydration hubs, medical stands, and finishing criteria..."
                        className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3.5 text-sm text-zinc-900 placeholder-zinc-355 focus:border-brand focus:ring-2 focus:ring-brand/10 focus:outline-none transition-all shadow-sm font-medium"
                      ></textarea>
                    </div>
                  </div>

                  {/* Step 1 Actions */}
                  <div className="flex gap-4 pt-6 font-sans">
                    <button
                      type="button"
                      onClick={() => {
                        setDistanceRoutes({});
                        setRouteMapPhotos([]);
                        setKitPhotos([]);
                        setFormStep(1);
                        setEditingEvent(null);
                        onNavigate('admin-events');
                      }}
                      className="flex-1 rounded-[7px] border border-zinc-200 bg-white py-3.5 text-center text-sm font-sans font-bold text-zinc-700 hover:bg-zinc-50 transition-colors uppercase tracking-widest cursor-pointer shadow-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newEvent.title || !newEvent.date || !newEvent.location || newEvent.distances.length === 0) {
                          showErrorToast('Please fill out all required fields and check at least one distance.');
                          return;
                        }
                        setFormStep(2);
                      }}
                      className="flex-1 rounded-[7px] bg-[#FF4400] hover:bg-[#E63D00] py-3.5 text-center text-sm font-sans font-bold text-white transition-colors uppercase tracking-widest cursor-pointer shadow-md shadow-brand/10"
                    >
                      Next Step: Uploads
                    </button>
                  </div>
                </div>
              )}

              {formStep === 2 && (
                <div className="space-y-6 animate-fade-in">
                  {/* Event Gallery Image Upload (Max 3 photos) */}
                  <div className="space-y-3">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-zinc-900 mb-2 flex items-center gap-1.5">
                      <ImageIcon className="h-4 w-4 text-zinc-500" />
                      <span>Upload Race Event Gallery Photos (Max 3 images from folders) <span className="text-brand">*</span></span>
                    </label>

                    {uploaderError && (
                      <div className="text-[10px] font-bold text-red-700 font-mono uppercase bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-2 animate-fade-in">
                        <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                        <span>{uploaderError}</span>
                      </div>
                    )}

                    {/* Upload Zone */}
                    <div className="border border-dashed border-zinc-200 hover:border-brand rounded-2xl p-6 text-center transition-colors cursor-pointer relative bg-zinc-50 hover:bg-brand/[0.01] group">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          if (galleryPhotos.length + files.length > 3) {
                            setUploaderError("You can upload a maximum of 3 gallery photos.");
                            setTimeout(() => {
                              setUploaderError(null);
                            }, 4000);
                            return;
                          }
                          setUploaderError(null);

                          files.forEach((file) => {
                            const reader = new FileReader();
                            reader.onloadend = async () => {
                              if (typeof reader.result === 'string') {
                                const compressed = await compressImage(reader.result);
                                setGalleryPhotos(prev => [...prev, compressed]);
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
                        PNG, JPG, or WEBP (Max 3 photos)
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

                  {/* Route Map & Race Kit uploads (Max 3 photos each) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    {/* Route Map Image Upload (Max 3 photos) */}
                    <div className="space-y-3">
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-zinc-900 mb-2 flex items-center gap-1.5">
                        <ImageIcon className="h-4 w-4 text-zinc-500" />
                        <span>Upload Route Map Image <span className="text-zinc-500">(Optional)</span></span>
                      </label>

                      {routeMapPhotos.length < 3 ? (
                        <div className="border border-dashed border-zinc-200 hover:border-brand rounded-2xl p-4 text-center transition-colors cursor-pointer relative bg-zinc-50 hover:bg-brand/[0.01] group h-32 flex flex-col justify-center items-center">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []);
                              if (routeMapPhotos.length + files.length > 3) {
                                setUploaderError("You can upload a maximum of 3 Route Map photos.");
                                setTimeout(() => setUploaderError(null), 4000);
                                return;
                              }
                              setUploaderError(null);
                              files.forEach((file) => {
                                const reader = new FileReader();
                                reader.onloadend = async () => {
                                  if (typeof reader.result === 'string') {
                                    const compressed = await compressImage(reader.result);
                                    setRouteMapPhotos(prev => [...prev, compressed]);
                                  }
                                };
                                reader.readAsDataURL(file);
                              });
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <ImageIcon className="h-5 w-5 text-zinc-400 group-hover:text-brand mb-1 transition-colors" />
                          <span className="text-xs font-bold text-zinc-700 block">Browse Route Map Photo</span>
                          <span className="text-[10px] text-zinc-500 block mt-0.5 font-sans">PNG, JPG, or WEBP (Max 3)</span>
                        </div>
                      ) : (
                        <div className="border border-zinc-150 rounded-2xl p-4 text-center bg-zinc-50/50 h-32 flex flex-col justify-center items-center">
                          <Check className="h-5 w-5 text-green-500 mb-1" />
                          <span className="text-xs font-bold text-zinc-650 block">Maximum 3 photos reached</span>
                        </div>
                      )}

                      {/* Thumbnails list */}
                      {routeMapPhotos.length > 0 && (
                        <div className="flex flex-wrap gap-2.5 mt-2">
                          {routeMapPhotos.map((photo, idx) => (
                            <div key={idx} className="relative h-14 w-14 rounded-xl border border-zinc-200 overflow-hidden group shadow-sm bg-zinc-50">
                              <img src={photo} alt="" className="h-full w-full object-cover" />
                              <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <button
                                  type="button"
                                  onClick={() => setRouteMapPhotos(prev => prev.filter((_, i) => i !== idx))}
                                  className="p-1 bg-red-500 rounded-full hover:bg-red-650 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Race Kit / Singlet Preview (Max 3 photos) */}
                    <div className="space-y-3">
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-zinc-900 mb-2 flex items-center gap-1.5">
                        <ImageIcon className="h-4 w-4 text-zinc-500" />
                        <span>Upload Race Kit / Singlet Preview <span className="text-zinc-500">(Optional)</span></span>
                      </label>

                      {kitPhotos.length < 3 ? (
                        <div className="border border-dashed border-zinc-200 hover:border-brand rounded-2xl p-4 text-center transition-colors cursor-pointer relative bg-zinc-50 hover:bg-brand/[0.01] group h-32 flex flex-col justify-center items-center">
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []);
                              if (kitPhotos.length + files.length > 3) {
                                setUploaderError("You can upload a maximum of 3 Race Kit photos.");
                                setTimeout(() => setUploaderError(null), 4000);
                                return;
                              }
                              setUploaderError(null);
                              files.forEach((file) => {
                                const reader = new FileReader();
                                reader.onloadend = async () => {
                                  if (typeof reader.result === 'string') {
                                    const compressed = await compressImage(reader.result);
                                    setKitPhotos(prev => [...prev, compressed]);
                                  }
                                };
                                reader.readAsDataURL(file);
                              });
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <ImageIcon className="h-5 w-5 text-zinc-400 group-hover:text-brand mb-1 transition-colors" />
                          <span className="text-xs font-bold text-zinc-700 block">Browse Race Kit Photo</span>
                          <span className="text-[10px] text-zinc-500 block mt-0.5 font-sans">PNG, JPG, or WEBP (Max 3)</span>
                        </div>
                      ) : (
                        <div className="border border-zinc-150 rounded-2xl p-4 text-center bg-zinc-50/50 h-32 flex flex-col justify-center items-center">
                          <Check className="h-5 w-5 text-green-500 mb-1" />
                          <span className="text-xs font-bold text-zinc-650 block">Maximum 3 photos reached</span>
                        </div>
                      )}

                      {/* Thumbnails list */}
                      {kitPhotos.length > 0 && (
                        <div className="flex flex-wrap gap-2.5 mt-2">
                          {kitPhotos.map((photo, idx) => (
                            <div key={idx} className="relative h-14 w-14 rounded-xl border border-zinc-200 overflow-hidden group shadow-sm bg-zinc-50">
                              <img src={photo} alt="" className="h-full w-full object-cover" />
                              <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <button
                                  type="button"
                                  onClick={() => setKitPhotos(prev => prev.filter((_, i) => i !== idx))}
                                  className="p-1 bg-red-500 rounded-full hover:bg-red-650 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Step 2 Actions */}
                  <div className="flex gap-4 pt-6 font-sans">
                    <button
                      type="button"
                      onClick={() => setFormStep(1)}
                      className="flex-1 rounded-[7px] border border-zinc-200 bg-white py-3.5 text-center text-sm font-sans font-bold text-zinc-700 hover:bg-zinc-50 transition-colors uppercase tracking-widest cursor-pointer shadow-sm"
                    >
                      Back to Specs
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-[7px] bg-[#FF4400] hover:bg-[#E63D00] py-3.5 text-center text-sm font-sans font-bold text-white transition-colors uppercase tracking-widest cursor-pointer shadow-md shadow-brand/10"
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
              <style dangerouslySetInnerHTML={{
                __html: `
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
                    color: #09090b !important;
                  }
                  #printable-pass-card .print-text-dark {
                    color: #09090b !important;
                  }
                  #printable-pass-card .print-border-dark {
                    border-color: #e4e4e7 !important;
                  }
                  #printable-pass-card .print-bg-light {
                    background-color: #f4f4f5 !important;
                  }
                }
              `}} />

              <div className="flex flex-col lg:flex-row gap-8 items-start">

                {/* Left Column: Timing Pass card */}
                <div className="w-full lg:w-96 flex-shrink-0 space-y-4">
                  <div
                    id="printable-pass-card"
                    className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 relative overflow-hidden print:bg-white print:border-zinc-200 print:text-zinc-955"
                  >
                    {/* Decorative brand accent */}
                    <div className="absolute top-0 left-0 right-0 h-4 bg-brand" />

                    <div className="text-center pt-2 pb-6 border-b border-dashed border-zinc-250 print:border-zinc-200 print-border-dark">
                      <span className="font-mono text-[9px] font-black text-brand tracking-widest uppercase">
                        RUNNICLE OFFICIAL TIMING PASS
                      </span>
                      <h2 className="font-display text-lg font-black text-zinc-900 mt-0.5 uppercase tracking-tight truncate print:text-zinc-900 print-text-dark">
                        {selectedReg.eventTitle || 'Early-Bird Runner'}
                      </h2>
                    </div>

                    {/* Large BIB Display */}
                    <div className="py-8 text-center bg-zinc-50 rounded-2xl border border-zinc-200/80 my-6 print:bg-zinc-50 print:border-zinc-100 print-bg-light print-border-dark">
                      <span className="font-mono text-xs text-zinc-500 font-bold uppercase tracking-wider block print:text-zinc-400">
                        RACE BIB NUMBER
                      </span>
                      <span className="font-mono text-6xl font-black text-zinc-900 mt-2 block tracking-tight print:text-zinc-900 print-text-dark">
                        {selectedReg.registeredBib ? `#${selectedReg.registeredBib}` : 'UNASSIGNED'}
                      </span>
                    </div>

                    <div className="space-y-4 font-mono text-xs text-zinc-600 pb-6 border-b border-dashed border-zinc-250 print:border-zinc-200 print:text-zinc-600 print-border-dark">
                      <div className="flex justify-between">
                        <span className="text-zinc-500 font-bold uppercase text-[10px] print:text-zinc-400">ATHLETE</span>
                        <span className="font-sans font-extrabold text-zinc-800 text-right text-xs print:text-zinc-900 print-text-dark">
                          {selectedReg.firstName} {selectedReg.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500 font-bold uppercase text-[10px] print:text-zinc-400">DISTANCE</span>
                        <span className="font-black text-brand text-right">{selectedReg.distance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500 font-bold uppercase text-[10px] print:text-zinc-400">SIZE</span>
                        <span className="font-bold text-zinc-800 text-right print:text-zinc-900 print-text-dark">
                          {selectedReg.size ? selectedReg.size.replace('Unisex - ', '') : '—'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500 font-bold uppercase text-[10px] print:text-zinc-400">VERIFIED</span>
                        <span className={`font-black text-right ${selectedReg.status === 'Verified' ? 'text-emerald-600 print:text-emerald-700' : 'text-yellow-600 print:text-yellow-600'}`}>
                          {selectedReg.status || 'Pending'}
                        </span>
                      </div>
                    </div>

                    {/* Mock Barcode rendering */}
                    <div className="pt-6 flex flex-col items-center">
                      <div className="flex items-center justify-center gap-[1.5px] h-10 bg-white px-3 select-none rounded-[4px] border border-zinc-150">
                        {[1, 3, 2, 1, 4, 1, 2, 3, 1, 4, 2, 1, 3, 1, 2, 1, 4, 2, 1, 3, 1, 4, 1, 2, 1, 3, 2].map((w, idx) => (
                          <div
                            key={idx}
                            className="bg-black h-full"
                            style={{ width: `${w}px` }}
                          />
                        ))}
                      </div>
                      <span className="font-mono text-[9px] text-zinc-500 mt-2 tracking-widest font-semibold">
                        *{selectedReg.referenceNumber || selectedReg.id}*
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="w-full rounded-[7px] bg-white hover:bg-zinc-50 border border-zinc-200 py-3 text-center text-xs font-mono font-black text-zinc-700 transition-colors uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 shadow-sm active:scale-[0.98]"
                  >
                    <Printer className="h-4 w-4" />
                    Print Timing Pass
                  </button>
                </div>

                {/* Right Column: Detailed Profiles */}
                <div className="flex-1 w-full space-y-6">

                  {/* Personal Information */}
                  <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 space-y-4">
                    <h3 className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-150 pb-2">
                      Runner Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div>
                        <span className="text-zinc-500 font-bold uppercase text-[9px] block">First Name</span>
                        <span className="font-sans font-extrabold text-zinc-800 text-[13px] mt-1 block">
                          {selectedReg.firstName}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-bold uppercase text-[9px] block">Last Name</span>
                        <span className="font-sans font-extrabold text-zinc-800 text-[13px] mt-1 block">
                          {selectedReg.lastName}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-bold uppercase text-[9px] block">Email Address</span>
                        <span className="text-zinc-650 font-semibold mt-1 block">
                          {selectedReg.email}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-bold uppercase text-[9px] block">Phone Number</span>
                        <span className="text-zinc-650 font-semibold mt-1 block">
                          {selectedReg.phone || '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-bold uppercase text-[9px] block">Gender Category</span>
                        <span className="text-zinc-800 font-bold mt-1 block uppercase">
                          {selectedReg.gender || '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-bold uppercase text-[9px] block">T-Shirt Size</span>
                        <span className="text-zinc-800 font-bold mt-1 block">
                          {selectedReg.size || '—'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Transaction & System Data */}
                  <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 space-y-4">
                    <h3 className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-150 pb-2">
                      Payment & Registration Metadata
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div>
                        <span className="text-zinc-500 font-bold uppercase text-[9px] block">Payment Method</span>
                        <span className="text-zinc-800 font-bold mt-1 block">
                          {selectedReg.paymentMethod}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-bold uppercase text-[9px] block">Reference Code</span>
                        <span className="text-zinc-900 font-black mt-1 block tracking-wider">
                          {selectedReg.referenceNumber || '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-bold uppercase text-[9px] block">Registration Date</span>
                        <span className="text-zinc-650 font-semibold mt-1 block">
                          {selectedReg.registrationDate
                            ? new Date(selectedReg.registrationDate).toLocaleString()
                            : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-bold uppercase text-[9px] block">Assigned BIB</span>
                        <span className="text-brand font-black mt-1 block text-sm">
                          {selectedReg.registeredBib ? `BIB #${selectedReg.registeredBib}` : 'UNASSIGNED'}
                        </span>
                      </div>
                      {selectedReg.paymentProof && (
                        <div className="sm:col-span-2 mt-2 pt-3 border-t border-zinc-150">
                          <span className="text-zinc-500 font-bold uppercase text-[9.5px] block mb-2 font-mono">Proof of Payment Screenshot</span>
                          <div className="relative rounded-2xl border border-zinc-200 overflow-hidden bg-zinc-50 max-w-xs shadow-sm group">
                            <img src={selectedReg.paymentProof} alt="Proof of Payment" className="w-full object-contain max-h-60" />
                            <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <a
                                href={selectedReg.paymentProof}
                                download={`Proof_${selectedReg.firstName}_${selectedReg.lastName}.png`}
                                className="rounded-full bg-brand hover:bg-brand-hover text-white text-[10px] font-mono font-black uppercase tracking-wider px-4 py-2 transition-colors cursor-pointer shadow text-center"
                              >
                                Download Proof
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Emergency Contact & Legal */}
                  <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 space-y-4">
                    <h3 className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-150 pb-2">
                      Emergency Contact & Legal
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                      <div>
                        <span className="text-zinc-500 font-bold uppercase text-[9px] block">Emergency Person</span>
                        <span className="font-sans font-bold text-zinc-800 mt-1 block">
                          {selectedReg.emergencyName || 'Maria Dela Cruz'}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 font-bold uppercase text-[9px] block">Emergency Contact Phone</span>
                        <span className="text-zinc-650 font-bold mt-1 block">
                          {selectedReg.emergencyPhone || '09187654321'}
                        </span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-zinc-500 font-bold uppercase text-[9px] block">Liability Waiver Agreement</span>
                        <div className="flex items-center gap-1.5 text-emerald-600 font-bold mt-1">
                          <Check className="h-4 w-4" />
                          <span>Signed and Agreed to Runnicle Liability Waiver & Policy</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Toggles & Management */}
                  <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 space-y-4">
                    <h3 className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-150 pb-2">
                      Registration Management
                    </h3>
                    <div className="flex flex-wrap gap-3 font-sans">
                      {selectedReg.status !== 'Verified' && (
                        <button
                          onClick={() => {
                            handleVerifyStatus(selectedReg.id, 'Verified');
                            showToast(`Successfully verified runner "${selectedReg.firstName}"`);
                          }}
                          className="rounded-[7px] bg-emerald-650 hover:bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer flex items-center gap-2 shadow-sm active:scale-[0.98]"
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
                          className="rounded-[7px] bg-amber-500 hover:bg-amber-600 px-4 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer flex items-center gap-2 shadow-sm active:scale-[0.98]"
                        >
                          <X className="h-4 w-4" />
                          Mark as Cancelled
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setEditingRegId(selectedReg.id);
                          setNewReg({
                            firstName: selectedReg.firstName || '',
                            lastName: selectedReg.lastName || '',
                            email: selectedReg.email || '',
                            phone: selectedReg.phone || '',
                            gender: selectedReg.gender || 'Male',
                            eventTitle: selectedReg.eventTitle || '',
                            distance: selectedReg.distance || '',
                            size: selectedReg.size || 'Unisex - Medium (M)',
                            paymentMethod: selectedReg.paymentMethod || 'GCash',
                            referenceNumber: selectedReg.referenceNumber || '',
                            emergencyContact: selectedReg.emergencyContact || '',
                            emergencyPhone: selectedReg.emergencyPhone || '',
                            registeredBib: selectedReg.registeredBib || '',
                            status: selectedReg.status || 'Verified'
                          });
                          onNavigate('admin-forms');
                        }}
                        className="rounded-[7px] border border-zinc-200 bg-white hover:bg-zinc-50 px-4 py-2.5 text-xs font-bold text-zinc-700 transition-colors cursor-pointer flex items-center gap-2 shadow-sm active:scale-[0.98]"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit details
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to permanently delete this registration record?`)) {
                            handleDeleteRegistration(selectedReg.id);
                            onNavigate('admin-registrations');
                          }
                        }}
                        className="rounded-[7px] border border-red-200 hover:border-red-350 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-650 transition-colors cursor-pointer flex items-center gap-2 shadow-sm ml-auto active:scale-[0.98]"
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

      </main>
    </div>
  );
};
export default AdminPage;
