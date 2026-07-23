import React from 'react';
import { Calendar, MapPin, Clock, ShieldAlert, ZoomIn, Maximize2 } from 'lucide-react';
import { type EventItem } from '@/types';
import { EventImageLightbox, type ImageSection } from './EventImageLightbox';

const parseImages = (imgStr?: string): string[] => {
  if (!imgStr) return [];
  if (imgStr.startsWith('[')) {
    try {
      return JSON.parse(imgStr);
    } catch {
      // fallback
    }
  }
  if (imgStr.includes('|')) {
    return imgStr.split('|');
  }
  return [imgStr];
};

interface EventDetailsPageProps {
  event: EventItem;
  onBack: () => void;
  onRegisterClick: (event: EventItem) => void;
  hideBackLink?: boolean;
}

export const EventDetailsPage: React.FC<EventDetailsPageProps> = ({
  event,
  onBack,
  onRegisterClick,
  hideBackLink = false
}) => {
  const kitPhotos = parseImages(event.kitImage);
  const routeMapPhotos = parseImages(event.routeMapImage);
  const galleryPhotos = event.galleryImages || [];
  
  const heroPhoto = event.image || 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=80';
  const effectiveKitPhotos = kitPhotos.length > 0 ? kitPhotos : ['https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80'];
  const effectiveRoutePhotos = routeMapPhotos.length > 0 ? routeMapPhotos : ['https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80'];

  const [activeKitIdx, setActiveKitIdx] = React.useState(0);
  const [activeRouteIdx, setActiveRouteIdx] = React.useState(0);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [lightboxSectionId, setLightboxSectionId] = React.useState('hero');
  const [lightboxImageIdx, setLightboxImageIdx] = React.useState(0);

  const activeKitPhoto = effectiveKitPhotos[activeKitIdx] || effectiveKitPhotos[0];
  const activeRoutePhoto = effectiveRoutePhotos[activeRouteIdx] || effectiveRoutePhotos[0];

  // Construct sections for the lightbox switcher
  const imageSections: ImageSection[] = [
    {
      id: 'all',
      title: 'All Event Photos',
      subtitle: event.title,
      images: Array.from(new Set([heroPhoto, ...effectiveKitPhotos, ...effectiveRoutePhotos, ...galleryPhotos])),
    },
    {
      id: 'hero',
      title: 'Event Banner',
      subtitle: event.title,
      images: [heroPhoto],
    },
    {
      id: 'kit',
      title: 'Official Race Kit',
      subtitle: 'Singlet & Perks',
      images: effectiveKitPhotos,
    },
    {
      id: 'route',
      title: 'Route & Venue Map',
      subtitle: event.location || 'Bacolod City',
      images: effectiveRoutePhotos,
    },
  ];

  if (galleryPhotos.length > 0) {
    imageSections.push({
      id: 'gallery',
      title: 'Event Gallery',
      subtitle: `${galleryPhotos.length} Photos`,
      images: galleryPhotos,
    });
  }

  const openLightbox = (sectionId: string, index: number = 0) => {
    setLightboxSectionId(sectionId);
    setLightboxImageIdx(index);
    setLightboxOpen(true);
  };

  const defaultSchedule = [
    '04:30 AM - Warm-up & Assembly',
    '05:00 AM - 10K Gun Start',
    '05:15 AM - 5K Gun Start',
    '07:00 AM - Awarding Ceremony',
  ];

  const scheduleItems = (event.details?.schedule && event.details.schedule.length > 0)
    ? event.details.schedule
    : defaultSchedule;

  const inclusionItems = (event.details?.perks && event.details.perks.length > 0)
    ? event.details.perks
    : defaultSchedule;

  return (
    <div className={hideBackLink ? 'bg-[#FBFBFB] py-2 font-sans' : 'bg-[#FBFBFB] min-h-screen py-8 font-sans'}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Back Link */}
        {!hideBackLink && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-[#FF4400] uppercase tracking-widest transition-colors mb-6 cursor-pointer"
          >
            <span>&larr;</span> BACK TO HOME
          </button>
        )}

        {/* 2-Column Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Banner Image Card */}
            <div 
              onClick={() => openLightbox('hero', 0)}
              style={{ backgroundImage: `url(${heroPhoto})` }}
              className="group relative rounded-xl overflow-hidden bg-cover bg-center border border-zinc-200/80 p-8 sm:p-10 flex flex-col justify-end min-h-[340px] shadow-xs cursor-pointer hover:border-zinc-400 transition-all"
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10 group-hover:from-black/90 group-hover:via-black/50 transition-colors" />
              
              {/* Expand Indicator Badge */}
              <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-black/60 group-hover:bg-[#FF4400] text-white backdrop-blur-xs px-3 py-1.5 rounded-full text-xs font-bold border border-white/20 transition-all shadow-md group-hover:scale-105">
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Click to Expand</span>
              </div>

              <div className="relative z-20">
                {/* Distance Badges */}
                <div className="flex gap-2 mb-3">
                  {(event.distances && event.distances.length > 0 ? event.distances : ['3K', '5K', '10K']).map((dist) => (
                    <span
                      key={dist}
                      className="rounded bg-black/60 border border-white/20 px-2.5 py-0.5 text-[10px] font-bold text-white tracking-widest uppercase"
                    >
                      {dist}
                    </span>
                  ))}
                </div>

                {/* Event Title */}
                <h1 className="font-sans text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {event.title || 'MegaWorld Fun Run'}
                </h1>

                {/* Event Meta Line */}
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-zinc-200 font-semibold mt-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-[#FF4400]" />
                    {event.date || 'Oct 24, 2026'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-[#FF4400]" />
                    {event.location || 'Bacolod City'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-[#FF4400]" />
                    Starts at {event.details?.time || '4:00 AM'}
                  </span>
                </div>
              </div>
            </div>

            {/* Race Description Card */}
            <div className="rounded-xl border border-zinc-200/80 bg-[#F4F4F5] p-6 sm:p-8 space-y-3 shadow-xs">
              <h3 className="font-sans text-sm font-bold text-zinc-900 tracking-tight">
                Race Description
              </h3>
              <p className="text-zinc-600 text-xs leading-relaxed font-medium">
                {event.description || 'Conquer the streets of Bacolod in the most anticipated evening run of the year. Featuring a vibrant light show and post-race music festival.'}
              </p>
              <p className="text-zinc-500 text-xs leading-relaxed font-medium">
                Join hundreds of athletes on this iconic course designed for both competitive elites chasing personal bests and recreational runners celebrating community fitness. Our event is certified by regional athletic associations and guarantees premium timing chips and support.
              </p>
            </div>

            {/* Official Race Kit & Route Map Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Official Race Kit Card */}
              <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-200/80 pb-3">
                  <h3 className="font-sans text-xs font-bold text-zinc-900 uppercase tracking-wider">
                    OFFICIAL RACE KIT
                  </h3>
                  <button
                    type="button"
                    onClick={() => openLightbox('kit', activeKitIdx)}
                    className="text-[10px] font-bold text-[#FF4400] hover:text-[#E63D00] uppercase tracking-widest flex items-center gap-1 cursor-pointer"
                  >
                    <ZoomIn className="w-3 h-3" />
                    <span>VIEW {effectiveKitPhotos.length} {effectiveKitPhotos.length === 1 ? 'PHOTO' : 'PHOTOS'}</span>
                  </button>
                </div>
                
                <div 
                  onClick={() => openLightbox('kit', activeKitIdx)}
                  className="group relative aspect-video rounded-xl overflow-hidden bg-black border border-zinc-200/60 shadow-inner flex items-center justify-center cursor-pointer"
                >
                  <img
                    src={activeKitPhoto}
                    alt="Official Race Kit"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:via-black/30 transition-colors" />
                  
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-xs rounded-full px-2.5 py-1 text-[10px] font-bold text-white flex items-center gap-1 border border-white/20 shadow-md">
                    <ZoomIn className="w-3 h-3 text-[#FF4400]" />
                    <span>Expand</span>
                  </div>

                  <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-xs rounded px-2.5 py-1 text-[10px] font-bold uppercase text-white tracking-wider border border-white/10 flex items-center gap-1.5">
                    <Maximize2 className="w-3 h-3 text-[#FF4400]" />
                    INCLUDES FINISHER TEE &amp; MEDAL
                  </div>
                </div>

                {effectiveKitPhotos.length > 1 && (
                  <div className="flex gap-2 pt-1">
                    {effectiveKitPhotos.map((photo, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveKitIdx(idx);
                          openLightbox('kit', idx);
                        }}
                        className={`group relative h-11 w-11 rounded-lg border overflow-hidden transition-all duration-200 cursor-pointer ${
                          activeKitIdx === idx ? 'border-[#FF4400] ring-2 ring-[#FF4400]/20' : 'border-zinc-200 hover:border-zinc-350'
                        }`}
                      >
                        <img src={photo} alt="" className="h-full w-full object-cover group-hover:scale-110 transition-transform" />
                      </button>
                    ))}
                  </div>
                )}

                <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                  Your registered slot includes the official Runnicle dry-fit singlet, an official race bib, sponsor vouchers, and a custom die-cast finisher medal upon crossing the finish line.
                </p>
              </div>

              {/* Route & Venue Map Card */}
              <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-200/80 pb-3">
                  <h3 className="font-sans text-xs font-bold text-zinc-900 uppercase tracking-wider">
                    ROUTE &amp; VENUE MAP
                  </h3>
                  <button
                    type="button"
                    onClick={() => openLightbox('route', activeRouteIdx)}
                    className="text-[10px] font-bold text-[#FF4400] hover:text-[#E63D00] uppercase tracking-widest flex items-center gap-1 cursor-pointer"
                  >
                    <ZoomIn className="w-3 h-3" />
                    <span>VIEW {effectiveRoutePhotos.length} {effectiveRoutePhotos.length === 1 ? 'MAP' : 'MAPS'}</span>
                  </button>
                </div>
                
                <div 
                  onClick={() => openLightbox('route', activeRouteIdx)}
                  className="group relative aspect-video rounded-xl overflow-hidden bg-black border border-zinc-200/60 shadow-inner flex items-center justify-center cursor-pointer"
                >
                  <img
                    src={activeRoutePhoto}
                    alt="Route & Venue Map"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:via-black/30 transition-colors" />
                  
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 backdrop-blur-xs rounded-full px-2.5 py-1 text-[10px] font-bold text-white flex items-center gap-1 border border-white/20 shadow-md">
                    <ZoomIn className="w-3 h-3 text-[#FF4400]" />
                    <span>Expand Map</span>
                  </div>

                  <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-xs rounded px-2.5 py-1 text-[10px] font-bold uppercase text-white tracking-wider border border-white/10 flex items-center gap-1.5">
                    <Maximize2 className="w-3 h-3 text-[#FF4400]" />
                    CERTIFIED COURSE MAP
                  </div>
                </div>

                {effectiveRoutePhotos.length > 1 && (
                  <div className="flex gap-2 pt-1">
                    {effectiveRoutePhotos.map((photo, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveRouteIdx(idx);
                          openLightbox('route', idx);
                        }}
                        className={`group relative h-11 w-11 rounded-lg border overflow-hidden transition-all duration-200 cursor-pointer ${
                          activeRouteIdx === idx ? 'border-[#FF4400] ring-2 ring-[#FF4400]/20' : 'border-zinc-200 hover:border-zinc-350'
                        }`}
                      >
                        <img src={photo} alt="" className="h-full w-full object-cover group-hover:scale-110 transition-transform" />
                      </button>
                    ))}
                  </div>
                )}

                <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                  The certified loop features hydration and nutrition points every 2.5 kilometers, timing mats at key check junctions, and emergency medical personnel stationed along the route.
                </p>
              </div>

            </div>


            {/* Schedule & Inclusions Sub-cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Event Schedule */}
              <div className="rounded-xl border border-zinc-200/80 bg-[#F9F9FB] p-6 shadow-xs space-y-4">
                <h3 className="font-sans text-xs font-bold text-zinc-900 tracking-wider uppercase">
                  EVENT SCHEDULE
                </h3>
                <ul className="space-y-3">
                  {scheduleItems.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-xs text-zinc-700 font-semibold">
                      <Clock className="h-4 w-4 text-[#FF4400] flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Runner Inclusions */}
              <div className="rounded-xl border border-zinc-200/80 bg-[#F9F9FB] p-6 shadow-xs space-y-4">
                <h3 className="font-sans text-xs font-bold text-zinc-900 tracking-wider uppercase">
                  RUNNER INCLUSIONS
                </h3>
                <ul className="space-y-3">
                  {inclusionItems.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-xs text-zinc-700 font-semibold">
                      <Clock className="h-4 w-4 text-[#FF4400] flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Athlete Safety Briefing Card */}
            <div className="rounded-xl border border-red-300 bg-[#FFF0F0] p-6 flex gap-3.5 shadow-xs">
              <ShieldAlert className="h-5 w-5 text-[#D93838] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#D93838] uppercase tracking-wider">
                  ATHLETE SAFETY BRIEFING
                </h4>
                <p className="text-xs text-[#D93838]/90 mt-1.5 font-medium leading-relaxed">
                  All athletes must carry their designated timing BiB visible on the front torso. Hydration points are stationed every 2.5K. Medic stations will be active at loops start and finish lines. Please arrive at assembly points at least 30 minutes before gun start.
                </p>
              </div>
            </div>

          </div>

          {/* Right Column (Sidebar Registration Status Card) */}
          <div className="rounded-xl border border-zinc-200/80 bg-[#F9F9FB] p-6 shadow-xs space-y-6 lg:sticky lg:top-24">
            
            {/* Registration Status */}
            <div>
              <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider block mb-3">
                REGISTRATION STATUS
              </span>
              <div className="flex items-center justify-between">
                <span className="bg-[#EBF3B5] text-[#708A15] border border-[#D5E488] px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider">
                  {event.badge || 'CLOSING SOON'}
                </span>
                <span className="text-xs font-bold text-[#708A15]">
                  {event.details?.slotsLeft ? `${event.details.slotsLeft} slots left!` : '42 slots left!'}
                </span>
              </div>
            </div>

            <div className="border-t border-zinc-200/80" />

            {/* Entry Price */}
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                ENTRY PRICE
              </span>
              <span className="text-3xl font-extrabold text-zinc-900 tracking-tight font-mono block">
                {event.details?.fee || '₱1,250.00'}
              </span>
            </div>

            <div className="border-t border-zinc-200/80" />

            {/* Route Map & Location Metadata */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium">Route Map</span>
                <span className="font-bold text-zinc-900 text-right">
                  {event.details?.route || 'MegaWorld Boulevard Loop'}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-zinc-500 font-medium">Location Area</span>
                <span className="font-bold text-zinc-900 text-right">
                  {event.location || 'Bacolod City'}
                </span>
              </div>
            </div>

            {/* Register Button */}
            <button
              disabled={event.badge === 'SOLD OUT'}
              onClick={() => onRegisterClick(event)}
              className="w-full rounded-md bg-[#FF4400] hover:bg-[#E63D00] py-3.5 text-xs font-bold text-white uppercase tracking-wider transition-colors shadow-sm cursor-pointer disabled:opacity-40 disabled:hover:bg-[#FF4400]"
            >
              {event.badge === 'SOLD OUT' ? 'SOLD OUT' : 'REGISTER FOR THIS RACE'}
            </button>

          </div>

        </div>

      </div>

      {/* Expanded Image Lightbox */}
      <EventImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        sections={imageSections}
        initialSectionId={lightboxSectionId}
        initialImageIndex={lightboxImageIdx}
        eventTitle={event.title}
      />
    </div>
  );
};

export default EventDetailsPage;


