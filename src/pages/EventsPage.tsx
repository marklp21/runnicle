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
      
      {/* Title */}
      <div className="border-b border-zinc-900 pb-6 mb-8 text-center max-w-3xl mx-auto">
        <span className="rounded-full bg-white/10 px-4 py-1 text-xs font-extrabold tracking-widest text-white uppercase">
          ATHLERUN EVENTS
        </span>
        <h1 className="mt-6 font-display text-4xl font-black leading-tight text-white sm:text-5xl">
          Conquer the Streets.
        </h1>
        <p className="mt-4 text-zinc-400 text-sm leading-relaxed">
          From competitive marathons to lively evening neon fun runs, choose your race challenges and rule the road.
        </p>
      </div>

      {/* Tab selectors */}
      <div className="flex justify-center border-b border-zinc-950 pb-5 mb-10 gap-2">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
            activeTab === 'upcoming'
              ? 'bg-white text-black border-white'
              : 'border-zinc-900 text-zinc-500 hover:border-zinc-700 hover:text-white'
          }`}
        >
          Upcoming Races ({upcomingEvents.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
            activeTab === 'past'
              ? 'bg-white text-black border-white'
              : 'border-zinc-900 text-zinc-500 hover:border-zinc-700 hover:text-white'
          }`}
        >
          Past Events ({pastEvents.length})
        </button>
      </div>

      {/* Events loop */}
      <div className="space-y-12">
        {activeTab === 'upcoming' ? (
          upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="rounded-2xl border border-zinc-800 bg-[#0c0c0d]/60 overflow-hidden shadow-2xl flex flex-col lg:flex-row hover:border-zinc-700 transition-colors"
            >
              {/* Event image */}
              <div className="lg:w-2/5 aspect-video lg:aspect-auto min-h-[250px] relative bg-zinc-900">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover"
                />
                <span className="absolute top-4 left-4 rounded-sm bg-white px-2 py-0.5 text-[9px] font-black tracking-widest text-black uppercase">
                  {event.badge}
                </span>
              </div>

              {/* Event Info content */}
              <div className="lg:w-3/5 p-6 md:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {event.distances.map((dist) => (
                      <span
                        key={dist}
                        className="rounded-sm border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[9px] font-black text-white uppercase tracking-wider"
                      >
                        {dist}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-display text-2xl font-black text-white tracking-tight leading-tight">
                    {event.title}
                  </h3>

                  <p className="text-xs text-zinc-400 font-semibold leading-relaxed line-clamp-3">
                    {event.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-zinc-400 pt-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-zinc-600 flex-shrink-0" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-zinc-600 flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-zinc-500 font-semibold">
                    Registration Deadline: <span className="text-zinc-300 font-bold">{event.deadline}</span>
                  </p>
                </div>

                {/* Actions row */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-900/60">
                  <button
                    disabled={event.badge === 'SOLD OUT'}
                    onClick={() => onRegisterClick(event)}
                    className="flex-1 rounded-md bg-white py-3 text-center text-xs font-bold text-black hover:bg-zinc-200 active:scale-98 transition-all duration-200 cursor-pointer uppercase tracking-wider disabled:opacity-30"
                  >
                    {event.badge === 'SOLD OUT' ? 'Sold Out' : 'Register Now'}
                  </button>
                  <button
                    onClick={() => onLearnMoreClick(event)}
                    className="flex-1 rounded-md border border-zinc-800 bg-zinc-950/20 py-3 text-center text-xs font-bold text-white hover:bg-zinc-900 hover:border-zinc-700 active:scale-98 transition-all duration-200 cursor-pointer uppercase tracking-wider"
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
              className="rounded-2xl border border-zinc-900 bg-[#070708]/40 overflow-hidden flex flex-col lg:flex-row hover:border-zinc-800 transition-colors"
            >
              {/* Event image */}
              <div className="lg:w-2/5 aspect-video lg:aspect-auto min-h-[220px] relative bg-zinc-900">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover filter grayscale"
                />
                <span className="absolute top-4 left-4 rounded-sm bg-zinc-900/80 border border-zinc-800 px-2 py-0.5 text-[9px] font-black tracking-widest text-zinc-500 uppercase">
                  Past Event
                </span>
              </div>

              {/* Event Info content */}
              <div className="lg:w-3/5 p-6 md:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-3.5">
                  <div className="flex gap-2">
                    {event.distances.map((dist) => (
                      <span
                        key={dist}
                        className="rounded-sm border border-zinc-900 px-2 py-0.5 text-[9px] font-black text-zinc-500 uppercase tracking-wider"
                      >
                        {dist}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-display text-xl font-black text-zinc-300 tracking-tight leading-tight">
                    {event.title}
                  </h3>

                  <p className="text-xs text-zinc-500 font-medium leading-relaxed line-clamp-2">
                    {event.description}
                  </p>

                  <div className="flex gap-4 text-xs font-semibold text-zinc-500">
                    <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-zinc-700" /> {event.date}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-zinc-700" /> {event.location}</span>
                  </div>
                </div>

                {/* Results triggers */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-900/40">
                  {event.results && event.results.length > 0 ? (
                    <button
                      onClick={() => onViewResultsClick(event)}
                      className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-white py-3 transition-colors cursor-pointer uppercase tracking-wider"
                    >
                      <History className="h-4 w-4 text-zinc-400" />
                      View Race Results
                      <ChevronRight className="h-4 w-4 text-zinc-400" />
                    </button>
                  ) : (
                    <span className="text-xs text-zinc-600 font-semibold italic py-2">Results table unavailable</span>
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
