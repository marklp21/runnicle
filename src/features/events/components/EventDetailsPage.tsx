import React from 'react';
import { Calendar, MapPin, Clock, ShieldAlert } from 'lucide-react';
import { type EventItem } from '@/types';

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
    <div className="bg-[#FBFBFB] min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Back Link */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-[#FF4400] uppercase tracking-widest transition-colors mb-6 cursor-pointer"
        >
          <span>&larr;</span> BACK TO HOME
        </button>

        {/* 2-Column Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Banner Image Card */}
            <div 
              style={{ backgroundImage: `url(${event.image || 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=80'})` }}
              className="relative rounded-xl overflow-hidden bg-cover bg-center border border-zinc-200/80 p-8 sm:p-10 flex flex-col justify-end min-h-[340px] shadow-xs"
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10" />
              
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
    </div>
  );
};

export default EventDetailsPage;

