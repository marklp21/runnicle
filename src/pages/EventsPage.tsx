import React, { useState } from 'react';
import { Calendar, MapPin, ChevronRight, History } from 'lucide-react';
import { type EventItem } from '../data/mockData';

interface EventsPageProps {
  events: EventItem[];
  onRegisterClick: (event: EventItem) => void;
  onLearnMoreClick: (event: EventItem) => void;
  onViewResultsClick: (event: EventItem) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({
  events,
  onRegisterClick,
  onLearnMoreClick,
  onViewResultsClick,
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const upcomingEvents = events.filter((e) => e.badge !== 'PAST EVENT');
  const pastEvents = events.filter((e) => e.badge === 'PAST EVENT');

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {}
      <div className="border-b border-zinc-200 pb-6 mb-8 text-center max-w-3xl mx-auto">
        <span className="rounded-full bg-orange-50 px-4 py-1 text-xs font-extrabold tracking-widest text-orange-600 border border-orange-200 uppercase">
          RUNNICLE EVENTS
        </span>
        <h1 className="mt-6 font-display text-4xl font-black leading-tight text-zinc-900 sm:text-5xl">
          Conquer the Streets.
        </h1>
        <p className="mt-4 text-zinc-500 text-sm leading-relaxed">
          From competitive marathons to lively evening neon fun runs, choose your race challenges and rule the road.
        </p>
      </div>

      {}
      <div className="flex justify-center border-b border-zinc-200 pb-5 mb-8 gap-2">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`rounded-full px-5 py-2 text-xs font-mono font-black uppercase tracking-widest transition-all cursor-pointer border ${
            activeTab === 'upcoming'
              ? 'bg-brand text-white border-brand shadow-md shadow-brand/10'
              : 'border-zinc-200 text-zinc-600 hover:border-zinc-350 hover:text-brand bg-white'
          }`}
        >
          Upcoming Races ({upcomingEvents.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`rounded-full px-5 py-2 text-xs font-mono font-black uppercase tracking-widest transition-all cursor-pointer border ${
            activeTab === 'past'
              ? 'bg-brand text-white border-brand shadow-md shadow-brand/10'
              : 'border-zinc-200 text-zinc-600 hover:border-zinc-350 hover:text-brand bg-white'
          }`}
        >
          Past Events ({pastEvents.length})
        </button>
      </div>

      {}
      <div className="space-y-6 max-w-4xl mx-auto">
        {activeTab === 'upcoming' ? (
          upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="rounded-3xl border border-zinc-200 bg-white overflow-hidden shadow-sm flex flex-col md:flex-row hover:border-brand transition-all duration-300 group"
            >
              {}
              <div className="md:w-1/3 aspect-video md:aspect-auto min-h-[160px] md:min-h-full relative bg-zinc-150">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover scale-100 group-hover:scale-102 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-4 left-4 rounded-sm bg-zinc-900 px-2 py-0.5 text-[8px] font-mono font-black tracking-widest text-white uppercase">
                  {event.badge}
                </span>
              </div>

              {}
              <div className="md:w-2/3 p-5 md:p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {event.distances.map((dist) => (
                      <span
                        key={dist}
                        className="rounded-sm border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[8px] font-mono font-black text-zinc-500 uppercase tracking-widest"
                      >
                        {dist}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-sans text-xl font-bold text-zinc-900 tracking-tight leading-snug group-hover:text-brand transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-xs text-zinc-500 font-semibold leading-relaxed line-clamp-2">
                    {event.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-zinc-500 pt-1 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>

                  <p className="text-[9px] text-zinc-400 font-mono font-bold uppercase pt-1">
                    Registration Deadline: <span className="text-zinc-800">{event.deadline}</span>
                  </p>
                </div>

                {}
                <div className="flex flex-col sm:flex-row gap-2.5 pt-3.5 border-t border-zinc-150">
                  <button
                    disabled={event.badge === 'SOLD OUT'}
                    onClick={() => onRegisterClick(event)}
                    className="flex-1 rounded-full bg-brand hover:bg-brand-hover py-2 text-center text-[10px] font-mono font-black text-white active:scale-98 transition-all duration-200 cursor-pointer uppercase tracking-widest disabled:opacity-30 shadow-sm shadow-brand/10"
                  >
                    {event.badge === 'SOLD OUT' ? 'Sold Out' : 'Register Now'}
                  </button>
                  <button
                    onClick={() => onLearnMoreClick(event)}
                    className="flex-1 rounded-full border border-zinc-200 bg-white py-2 text-center text-[10px] font-mono font-black text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 active:scale-98 transition-all duration-200 cursor-pointer uppercase tracking-widest"
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          pastEvents.map((event) => (
            <div
              key={event.id}
              className="rounded-3xl border border-zinc-200 bg-zinc-50/50 overflow-hidden flex flex-col md:flex-row hover:border-brand/40 transition-all duration-300 group"
            >
              {}
              <div className="md:w-1/3 aspect-video md:aspect-auto min-h-[160px] md:min-h-full relative bg-zinc-150">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover filter grayscale scale-100 group-hover:scale-102 transition-transform duration-500"
                  loading="lazy"
                />
                <span className="absolute top-4 left-4 rounded-sm bg-zinc-900/80 border border-zinc-850 px-2 py-0.5 text-[8px] font-mono font-black tracking-widest text-zinc-400 uppercase">
                  Past Event
                </span>
              </div>

              {}
              <div className="md:w-2/3 p-5 md:p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex gap-1.5">
                    {event.distances.map((dist) => (
                      <span
                        key={dist}
                        className="rounded-sm border border-zinc-200 px-2 py-0.5 text-[8px] font-mono font-black text-zinc-500 uppercase tracking-widest"
                      >
                        {dist}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-sans text-lg font-bold text-zinc-800 leading-snug group-hover:text-brand transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-xs text-zinc-500 font-medium leading-relaxed line-clamp-2">
                    {event.description}
                  </p>

                  <div className="flex gap-4 text-xs font-semibold text-zinc-500 font-mono">
                    <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-zinc-400" /> {event.date}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-zinc-400" /> {event.location}</span>
                  </div>
                </div>

                {}
                <div className="flex flex-col sm:flex-row gap-2.5 pt-3.5 border-t border-zinc-150">
                  {event.results && event.results.length > 0 ? (
                    <button
                      onClick={() => onViewResultsClick(event)}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-brand hover:bg-brand-hover text-[10px] font-mono font-black text-white py-2 transition-colors cursor-pointer uppercase tracking-widest shadow-sm shadow-brand/10"
                    >
                      <History className="h-3.5 w-3.5 text-white/80" />
                      View Race Results
                      <ChevronRight className="h-3.5 w-3.5 text-white/80" />
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase italic py-2">Results table unavailable</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
export default EventsPage;
