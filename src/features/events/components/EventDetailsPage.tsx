import React from 'react';
import { Calendar, MapPin, Clock, Award, ArrowLeft, ShieldAlert } from 'lucide-react';
import { type EventItem } from '@/types';

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
}

export const EventDetailsPage: React.FC<EventDetailsPageProps> = ({
  event,
  onBack,
  onRegisterClick,
}) => {
  const kitPhotos = parseImages(event.kitImage);
  const routeMapPhotos = parseImages(event.routeMapImage);
  const [activeKitIdx, setActiveKitIdx] = React.useState(0);
  const [activeRouteIdx, setActiveRouteIdx] = React.useState(0);
  
  const activeKitPhoto = kitPhotos[activeKitIdx] || kitPhotos[0] || 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=600&q=80';
  const activeRoutePhoto = routeMapPhotos[activeRouteIdx] || routeMapPhotos[0] || 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-orange-500 uppercase tracking-wider transition-colors mb-8 cursor-pointer group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Events
      </button>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {}
        <div className="lg:col-span-2 space-y-8">
          
          {}
          <div 
            style={{ backgroundImage: `url(${event.image})` }}
            className="relative rounded-2xl overflow-hidden bg-cover bg-center border border-zinc-200 p-8 md:p-12 flex flex-col justify-end min-h-[300px] shadow-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
            
            <div className="relative z-20">
              {}
              <div className="flex gap-2.5 mb-4">
                {event.distances.map((dist) => (
                  <span
                    key={dist}
                    className="rounded-sm border border-white/30 bg-black/20 px-2.5 py-0.5 text-[10px] font-black tracking-widest text-white uppercase"
                  >
                    {dist}
                  </span>
                ))}
              </div>

              <h1 className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
                {event.title}
              </h1>

              {}
              <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs text-zinc-300 font-semibold mt-6">
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-orange-500" /> {event.date}</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-orange-500" /> {event.location}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-orange-500" /> Starts {event.details.time}</span>
              </div>
            </div>
          </div>

          {}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 md:p-8 space-y-4">
            <h3 className="font-sans text-lg font-bold text-zinc-900 tracking-tight">Race Description</h3>
            <p className="text-zinc-700 text-sm leading-relaxed font-medium">
              {event.description}
            </p>
            <p className="text-zinc-500 text-xs leading-relaxed font-medium">
              Join hundreds of athletes on this iconic course designed for both competitive elites chasing personal bests and recreational runners celebrating community fitness. Our event is certified by regional athletic associations and guarantees premium timing chips and support.
            </p>
          </div>

          {}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="font-sans text-base font-bold text-zinc-900 mb-4 tracking-tight uppercase">Event Schedule</h3>
              <ul className="space-y-3.5">
                {event.details.schedule.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-xs text-zinc-600 font-semibold">
                    <Clock className="h-4.5 w-4.5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h3 className="font-sans text-base font-bold text-zinc-900 mb-4 tracking-tight uppercase">Runner Inclusions</h3>
              <ul className="space-y-3.5">
                {event.details.perks.map((perk, idx) => (
                  <li key={idx} className="flex gap-3 text-xs text-zinc-600 font-semibold">
                    <Award className="h-4.5 w-4.5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {}
          <div className="rounded-xl border border-red-200 bg-red-50/50 p-6 flex gap-4">
            <ShieldAlert className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-red-650 uppercase tracking-wider">Athlete Safety Briefing</h4>
              <p className="text-[11px] text-zinc-550 mt-2 font-medium leading-relaxed">
                All athletes must carry their designated timing BIB visible on the front torso. Hydration points are stationed every 2.5K. Medic stations will be active at loops start and finish lines. Please arrive at assembly points at least 30 minutes before gun start.
              </p>
            </div>
          </div>

          {/* Race Gallery Section */}
          {event.galleryImages && event.galleryImages.length > 0 && (
            <div className="rounded-xl border border-zinc-200 bg-white p-6 md:p-8 space-y-4 shadow-sm">
              <h3 className="font-sans text-base font-bold text-zinc-900 tracking-tight uppercase">Event Gallery</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {event.galleryImages.map((imgUrl, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50 group">
                    <img 
                      src={imgUrl} 
                      alt={`Race gallery photo ${idx + 1}`} 
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-zoom-in"
                      onClick={() => {
                        const win = window.open();
                        if (win) {
                          win.document.write(`<img src="${imgUrl}" style="max-width:100%; max-height:100vh; display:block; margin:auto;"/>`);
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4 shadow-sm">
              <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
                <h3 className="font-sans text-xs font-bold text-zinc-900 uppercase tracking-wider">Official Race Kit</h3>
                <span className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-widest">Singlet & Perks</span>
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50">
                <img 
                  src={activeKitPhoto} 
                  alt="Official Race Kit" 
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 left-3 bg-zinc-900 rounded px-2.5 py-1 text-[9px] font-black uppercase text-white tracking-widest">
                  Includes Finisher Tee & Medal
                </div>
              </div>

              {/* Race Kit Thumbnail Selection */}
              {kitPhotos.length > 1 && (
                <div className="flex gap-2.5 pt-1">
                  {kitPhotos.map((photo, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveKitIdx(idx)}
                      className={`relative h-12 w-12 rounded-lg border overflow-hidden transition-all duration-200 cursor-pointer ${
                        (activeKitIdx === idx || (idx === 0 && activeKitIdx >= kitPhotos.length)) ? 'border-[#FF4400] ring-2 ring-[#FF4400]/20' : 'border-zinc-200 hover:border-zinc-350'
                      }`}
                    >
                      <img src={photo} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              <p className="text-[11px] text-zinc-500 leading-relaxed font-semibold">
                Your registered slot includes the official Runnicle dry-fit singlet, an RFID-equipped timing bib, sponsor vouchers, and a custom die-cast finisher medal upon crossing the finish line.
              </p>
            </div>

            {}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 space-y-4 shadow-sm">
              <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
                <h3 className="font-sans text-sm font-bold text-zinc-900 uppercase tracking-wider">Route & Venue Map</h3>
                <span className="text-[10px] text-zinc-450 font-extrabold uppercase tracking-widest">{event.location}</span>
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50">
                <img 
                  src={activeRoutePhoto} 
                  alt="Event Route Map" 
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 left-3 bg-zinc-900 rounded px-2.5 py-1 text-[9px] font-black uppercase text-white tracking-widest">
                  Certified Course Map
                </div>
              </div>

              {/* Route Map Thumbnail Selection */}
              {routeMapPhotos.length > 1 && (
                <div className="flex gap-2.5 pt-1">
                  {routeMapPhotos.map((photo, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveRouteIdx(idx)}
                      className={`relative h-12 w-12 rounded-lg border overflow-hidden transition-all duration-200 cursor-pointer ${
                        (activeRouteIdx === idx || (idx === 0 && activeRouteIdx >= routeMapPhotos.length)) ? 'border-[#FF4400] ring-2 ring-[#FF4400]/20' : 'border-zinc-200 hover:border-zinc-350'
                      }`}
                    >
                      <img src={photo} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              <p className="text-[11px] text-zinc-500 leading-relaxed font-semibold">
                The certified loop features hydration and nutrition points every 2.5 kilometers, timing mats at key check junctions, and emergency medical personnel stationed along the route.
              </p>
            </div>

          </div>

        </div>

        {}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm space-y-6 lg:sticky lg:top-24">
          <div>
            <span className="text-[10px] font-black text-zinc-450 uppercase tracking-widest">Registration Status</span>
            <div className="flex items-center justify-between mt-2.5">
              <span className={`rounded-sm px-2 py-0.5 text-[9px] font-black tracking-widest uppercase ${
                event.badge === 'SOLD OUT' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-orange-500 text-white font-extrabold'
              }`}>
                {event.badge}
              </span>
              
              {event.badge !== 'SOLD OUT' && event.details.slotsLeft && (
                <span className="text-xs text-emerald-600 font-bold">{event.details.slotsLeft} slots left!</span>
              )}
            </div>
          </div>

          <div className="border-t border-zinc-200 pt-6">
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">Entry Price</span>
            <span className="text-3xl font-mono font-bold text-zinc-900 mt-1.5 block">
              {event.details.fee}
            </span>
          </div>

          <div className="border-t border-zinc-200 pt-6 space-y-3.5 text-xs text-zinc-500 font-semibold">
            <div className="flex justify-between items-start">
              <span className="text-zinc-400">Route Map</span>
              <div className="text-zinc-800 text-right space-y-1 max-w-[65%]">
                {event.details.routes && Object.keys(event.details.routes).length > 0 ? (
                  Object.entries(event.details.routes).map(([dist, rPath]) => (
                    <div key={dist} className="text-xs">
                      <span className="font-mono font-black text-brand mr-1">{dist}:</span>
                      <span className="font-medium text-zinc-700">{rPath}</span>
                    </div>
                  ))
                ) : (
                  <span className="font-medium text-zinc-700">{event.details.route}</span>
                )}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Timer Method</span>
              <span className="text-zinc-800">RFID Timing Chip</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">Location Area</span>
              <span className="text-zinc-800">{event.location}</span>
            </div>
          </div>

          {}
          <button
            disabled={event.badge === 'SOLD OUT'}
            onClick={() => onRegisterClick(event)}
            className="w-full rounded-md bg-orange-500 py-4 mt-6 text-sm font-black text-white hover:bg-orange-600 active:scale-98 transition-all duration-200 uppercase tracking-wider cursor-pointer disabled:opacity-30 disabled:hover:bg-orange-500 shadow-md shadow-orange-500/10"
          >
            {event.badge === 'SOLD OUT' ? 'Sold Out' : 'Register for this Race'}
          </button>

          <p className="text-[10px] text-zinc-500 text-center font-medium leading-relaxed">
            Registration packets can be picked up at the Expo Center 3 days leading up to the race event.
          </p>

        </div>

      </div>

    </div>
  );
};
export default EventDetailsPage;
