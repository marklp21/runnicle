import React from 'react';
import { Calendar, MapPin, Clock, Award, ArrowLeft, ShieldAlert } from 'lucide-react';
import { type EventItem } from '../data/mockData';

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
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors mb-8 cursor-pointer group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Events
      </button>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Left Column: Details (Main Content) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header Banner Visual */}
          <div 
            style={{ backgroundImage: `url(${event.image})` }}
            className="relative rounded-2xl overflow-hidden bg-cover bg-center border border-zinc-800 p-8 md:p-12 flex flex-col justify-end min-h-[300px] shadow-inner"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
            
            <div className="relative z-20">
              {/* Distance badges */}
              <div className="flex gap-2.5 mb-4">
                {event.distances.map((dist) => (
                  <span
                    key={dist}
                    className="rounded-sm border border-white/20 bg-white/5 px-2.5 py-0.5 text-[10px] font-black tracking-widest text-white uppercase"
                  >
                    {dist}
                  </span>
                ))}
              </div>

              <h1 className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
                {event.title}
              </h1>

              {/* Specs Row */}
              <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs text-zinc-400 font-semibold mt-6">
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-zinc-500" /> {event.date}</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-zinc-500" /> {event.location}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-zinc-500" /> Starts {event.details.time}</span>
              </div>
            </div>
          </div>

          {/* Race Overview */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-6 md:p-8 space-y-4">
            <h3 className="font-display text-lg font-black text-white tracking-tight">Race Description</h3>
            <p className="text-zinc-400 text-sm leading-relaxed font-medium">
              {event.description}
            </p>
            <p className="text-zinc-500 text-xs leading-relaxed font-medium">
              Join hundreds of athletes on this iconic course designed for both competitive elites chasing personal bests and recreational runners celebrating community fitness. Our event is certified by regional athletic associations and guarantees premium timing chips and support.
            </p>
          </div>

          {/* Timeline & Inclusions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Schedule */}
            <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-6">
              <h3 className="font-display text-base font-black text-white mb-4 tracking-tight uppercase">Event Schedule</h3>
              <ul className="space-y-3.5">
                {event.details.schedule.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-xs text-zinc-400 font-semibold">
                    <Clock className="h-4 w-4 text-zinc-600 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Perks */}
            <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-6">
              <h3 className="font-display text-base font-black text-white mb-4 tracking-tight uppercase">Runner Inclusions</h3>
              <ul className="space-y-3.5">
                {event.details.perks.map((perk, idx) => (
                  <li key={idx} className="flex gap-3 text-xs text-zinc-400 font-semibold">
                    <Award className="h-4 w-4 text-zinc-600 flex-shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Safety & Guidelines */}
          <div className="rounded-xl border border-red-950/30 bg-red-950/5 p-6 flex gap-4">
            <ShieldAlert className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider">Athlete Safety Briefing</h4>
              <p className="text-[11px] text-zinc-500 mt-2 font-medium leading-relaxed">
                All athletes must carry their designated timing BIB visible on the front torso. Hydration points are stationed every 2.5K. Medic stations will be active at loops start and finish lines. Please arrive at assembly points at least 30 minutes before gun start.
              </p>
            </div>
          </div>

          {/* Visual Showcase: Race Kit & Venue Map */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Race Kit Card */}
            <div className="rounded-xl border border-zinc-900 bg-[#0c0c0d] p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                <h3 className="font-display text-xs font-black text-white uppercase tracking-wider">Official Race Kit</h3>
                <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest">Singlet & Perks</span>
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden border border-zinc-900 bg-zinc-950">
                <img 
                  src={event.kitImage || 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=600&q=80'} 
                  alt="Official Race Kit" 
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 left-3 bg-black/85 border border-zinc-800 rounded px-2.5 py-1 text-[9px] font-black uppercase text-white tracking-widest">
                  Includes Finisher Tee & Medal
                </div>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-semibold">
                Your registered slot includes the official AthleRun dry-fit singlet, an RFID-equipped timing bib, sponsor vouchers, and a custom die-cast finisher medal upon crossing the finish line.
              </p>
            </div>

            {/* Venue & Route Card */}
            <div className="rounded-xl border border-zinc-900 bg-[#0c0c0d] p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
                <h3 className="font-display text-sm font-black text-white uppercase tracking-wider">Route & Venue Map</h3>
                <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest">{event.location}</span>
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden border border-zinc-900 bg-zinc-950">
                <img 
                  src={event.routeMapImage || 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80'} 
                  alt="Event Route Map" 
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-3 left-3 bg-black/85 border border-zinc-800 rounded px-2.5 py-1 text-[9px] font-black uppercase text-white tracking-widest">
                  Certified Course Map
                </div>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-semibold">
                The certified loop features hydration and nutrition points every 2.5 kilometers, timing mats at key check junctions, and emergency medical personnel stationed along the route.
              </p>
            </div>

          </div>

        </div>

        {/* Right Column: Checkout Card */}
        <div className="rounded-xl border border-zinc-800 bg-[#0c0c0c] p-6 shadow-2xl space-y-6 lg:sticky lg:top-24">
          <div>
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Registration Status</span>
            <div className="flex items-center justify-between mt-2.5">
              <span className={`rounded-sm px-2 py-0.5 text-[9px] font-black tracking-widest uppercase ${
                event.badge === 'SOLD OUT' ? 'bg-red-500/10 text-red-400 border border-red-900/30' : 'bg-white text-black font-extrabold'
              }`}>
                {event.badge}
              </span>
              
              {event.badge !== 'SOLD OUT' && event.details.slotsLeft && (
                <span className="text-xs text-emerald-400 font-bold">{event.details.slotsLeft} slots left!</span>
              )}
            </div>
          </div>

          <div className="border-t border-zinc-900 pt-6">
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Entry Price</span>
            <span className="text-3xl font-display font-black text-white mt-1.5 block">
              {event.details.fee}
            </span>
          </div>

          <div className="border-t border-zinc-900 pt-6 space-y-3.5 text-xs text-zinc-400 font-semibold">
            <div className="flex justify-between">
              <span className="text-zinc-500">Route Map</span>
              <span className="text-white text-right">{event.details.route}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Timer Method</span>
              <span className="text-white">RFID Timing Chip</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Location Area</span>
              <span className="text-white">{event.location}</span>
            </div>
          </div>

          {/* Registration Trigger CTA */}
          <button
            disabled={event.badge === 'SOLD OUT'}
            onClick={() => onRegisterClick(event)}
            className="w-full rounded-md bg-white py-4 mt-6 text-sm font-black text-black hover:bg-zinc-200 active:scale-98 transition-all duration-200 uppercase tracking-wider cursor-pointer disabled:opacity-30 disabled:hover:bg-white"
          >
            {event.badge === 'SOLD OUT' ? 'Sold Out' : 'Register for this Race'}
          </button>

          <p className="text-[10px] text-zinc-600 text-center font-medium leading-relaxed">
            Registration packets can be picked up at the Expo Center 3 days leading up to the race event.
          </p>

        </div>

      </div>

    </div>
  );
};
export default EventDetailsPage;
