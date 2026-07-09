import React, { useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { type EventItem } from '../data/mockData';

interface EventsPageProps {
  events: EventItem[];
  onBack: () => void;
  onRegisterClick: (event: EventItem) => void;
  onLearnMoreClick: (event: EventItem) => void;
  onViewResultsClick: (event: EventItem) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({
  events,
  onBack,
  onRegisterClick,
  onLearnMoreClick,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'past'>('all');

  const upcomingEvents = events.filter((e) => e.badge === 'OPEN' || e.badge === 'CLOSING SOON');
  const pastEvents = events.filter((e) => e.badge === 'SOLD OUT' || e.badge === 'PAST EVENT');

  const displayEvents =
    activeTab === 'all'
      ? events
      : activeTab === 'upcoming'
      ? upcomingEvents
      : pastEvents;

  return (
    <div className="bg-white min-h-screen w-full py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-sans font-bold text-zinc-500 hover:text-[#FF4400] transition-colors cursor-pointer mb-10 group uppercase tracking-wider"
        >
          <span className="text-base transition-transform group-hover:-translate-x-0.5">←</span> BACK TO HOME
        </button>

        {/* Header section */}
        <div className="mb-10 text-center">
          <h1 className="font-sans text-4xl font-bold tracking-[-3px] text-zinc-900 sm:text-5xl">
            Race <span className="font-serif italic text-[#FF4400] font-bold">Calendar</span>
          </h1>
          <p className="mt-3 text-black text-sm font-normal">
            Events designed for every pace. Push your boundaries on the track.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-10">
          <button
            onClick={() => setActiveTab('all')}
            className={`rounded-full px-5 py-2.5 text-xs font-sans font-bold uppercase transition-all cursor-pointer border ${
              activeTab === 'all'
                ? 'bg-[#FF4400] text-white border-[#FF4400]'
                : 'border-zinc-300 text-zinc-500 hover:text-zinc-800 bg-[#F5F5F5]'
            }`}
          >
            ALL ({events.length})
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`rounded-full px-5 py-2.5 text-xs font-sans font-bold uppercase transition-all cursor-pointer border ${
              activeTab === 'upcoming'
                ? 'bg-[#FF4400] text-white border-[#FF4400]'
                : 'border-zinc-300 text-zinc-500 hover:text-zinc-800 bg-[#F5F5F5]'
            }`}
          >
            UPCOMING EVENTS ({upcomingEvents.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`rounded-full px-5 py-2.5 text-xs font-sans font-bold uppercase transition-all cursor-pointer border ${
              activeTab === 'past'
                ? 'bg-[#FF4400] text-white border-[#FF4400]'
                : 'border-zinc-300 text-zinc-500 hover:text-zinc-800 bg-[#F5F5F5]'
            }`}
          >
            PAST EVENTS ({pastEvents.length})
          </button>
        </div>

        {/* Card List */}
        <div className="space-y-6 max-w-3xl mx-auto">
          {displayEvents.map((event) => {
            const isPast = event.badge === 'SOLD OUT' || event.badge === 'PAST EVENT';
            
            return (
              <div
                key={event.id}
                className={`rounded-[8px] border border-zinc-200 bg-white overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col md:flex-row md:h-[280px] transition-all duration-300 ${
                  isPast ? 'bg-[#FDFDFD]' : 'hover:border-zinc-300'
                }`}
              >
                {/* Left Column: Image */}
                <div className="md:w-[40%] aspect-video md:aspect-auto min-h-[220px] md:h-full relative bg-zinc-100 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className={`h-full w-full object-cover transition-transform duration-500 ${
                      isPast ? 'grayscale opacity-70' : ''
                    }`}
                    loading="lazy"
                  />
                </div>

                {/* Right Column: Content */}
                <div className="md:w-[60%] p-6 flex flex-col justify-between h-full space-y-3">
                  <div>
                    {/* Tags & Badge Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {event.distances.map((dist) => (
                          <span
                            key={dist}
                            className={`rounded-[3px] border px-2.5 py-0.5 text-[11px] font-sans font-bold tracking-wider uppercase ${
                              isPast
                                ? 'border-zinc-200 text-zinc-400 bg-transparent'
                                : 'border-[#FF4400]/30 text-[#FF4400] bg-transparent'
                            }`}
                          >
                            {dist}
                          </span>
                        ))}
                      </div>
                      <span
                        className={`rounded-[3px] px-2.5 py-0.5 text-[11px] font-sans font-bold tracking-wider uppercase ${
                          event.badge === 'CLOSING SOON'
                            ? 'bg-[#FEF9C3] text-[#854D0E]'
                            : event.badge === 'OPEN'
                            ? 'bg-[#DCFCE7] text-[#166534]'
                            : 'bg-[#F3F4F6] text-[#4B5563]'
                        }`}
                      >
                        {event.badge === 'PAST EVENT' ? 'SOLD OUT' : event.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className={`text-xl font-bold tracking-tight mt-3 ${
                        isPast ? 'text-zinc-400' : 'text-zinc-900'
                      }`}
                    >
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p
                      className={`text-[13px] leading-relaxed mt-2.5 font-normal ${
                        isPast ? 'text-zinc-400' : 'text-zinc-500'
                      }`}
                    >
                      {event.description}
                    </p>

                    {/* Date & Location */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-xs font-sans font-bold text-zinc-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
                        <span className={isPast ? 'text-zinc-400 font-bold' : 'text-zinc-500'}>
                          {event.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
                        <span className={isPast ? 'text-zinc-400 font-bold' : 'text-zinc-500'}>
                          {event.location}
                        </span>
                      </div>
                    </div>

                    {/* Registration Deadline */}
                    <div className="mt-4">
                      <p
                        className={`text-[11px] font-sans font-bold uppercase tracking-wider ${
                          isPast ? 'text-zinc-400' : 'text-zinc-500'
                        }`}
                      >
                        REGISTRATION DEADLINE:{' '}
                        <span className={isPast ? 'text-zinc-500 font-black' : 'text-zinc-950 font-black'}>
                          {event.deadline}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      disabled={isPast}
                      onClick={() => onRegisterClick(event)}
                      className={`flex-1 py-2.5 text-center text-[10px] font-sans font-bold uppercase tracking-wider transition-all duration-200 rounded-[4px] border ${
                        isPast
                          ? 'bg-[#E5E7EB] border-[#E5E7EB] text-zinc-400 cursor-not-allowed'
                          : 'bg-[#FF4400] border-[#FF4400] text-white hover:bg-[#E63D00] hover:border-[#E63D00] cursor-pointer active:scale-98'
                      }`}
                    >
                      REGISTER NOW
                    </button>
                    <button
                      onClick={() => onLearnMoreClick(event)}
                      className={`flex-1 py-2.5 text-center text-[10px] font-sans font-bold uppercase tracking-wider transition-all duration-200 border rounded-[4px] ${
                        isPast
                          ? 'bg-white border-zinc-200 text-zinc-400 hover:bg-zinc-50 hover:text-zinc-500 cursor-pointer active:scale-98'
                          : 'bg-white border-[#FF4400] text-[#FF4400] hover:bg-orange-50/40 cursor-pointer active:scale-98'
                      }`}
                    >
                      LEARN MORE
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default EventsPage;
