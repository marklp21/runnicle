import React from 'react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { type EventItem, mockEvents } from '../data/mockData';

interface UpcomingEventsProps {
  onViewDetailsClick: (event: EventItem) => void;
  onViewAllClick: () => void;
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({
  onViewDetailsClick,
  onViewAllClick,
}) => {

  // Get badge colors/styling based on status
  const getBadgeStyle = (status: string) => {
    switch (status) {
      case 'CLOSING SOON':
        return 'bg-orange-50 text-orange-600 border-orange-100/80';
      case 'OPEN':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'SOLD OUT':
        return 'bg-zinc-100 text-zinc-500 border-zinc-200';
      default:
        return 'bg-zinc-900 text-white border-zinc-950';
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
              Upcoming Events
            </h2>
            <p className="mt-2 text-sm text-zinc-505 font-medium">
              Certified courses for PB hunters and weekend warriors.
            </p>
          </div>
          <button
            onClick={onViewAllClick}
            className="mt-4 sm:mt-0 inline-flex items-center text-xs font-bold tracking-wider text-zinc-705 hover:text-orange-505 transition-colors uppercase gap-1.5 cursor-pointer group"
          >
            View All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockEvents.slice(0, 3).map((event) => (
            <div
              key={event.id}
              onClick={() => onViewDetailsClick(event)}
              className="flex flex-col rounded-3xl border border-zinc-200 bg-white overflow-hidden hover:border-orange-200 hover:shadow-xl transition-all duration-300 group cursor-pointer shadow-sm hover:-translate-y-1"
            >
              {/* Top part: Cover Image Container */}
              <div className="relative h-40 overflow-hidden bg-zinc-50">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-full w-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500 rounded-t-3xl"
                  loading="lazy"
                />
                {/* Outer badge in Top-Right */}
                <span className={`absolute top-4 right-4 rounded-full border px-3 py-1 text-[9px] tracking-wider uppercase font-extrabold ${getBadgeStyle(event.badge)}`}>
                  {event.badge}
                </span>
              </div>

              {/* Bottom part: Details in Light Mode */}
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                  {/* Distance tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {event.distances.map((dist) => (
                      <span
                        key={dist}
                        className="rounded-full border border-zinc-200 px-2.5 py-0.5 text-[9px] font-extrabold tracking-wider text-zinc-600 uppercase bg-zinc-50"
                      >
                        {dist}
                      </span>
                    ))}
                  </div>

                  {/* Event Title */}
                  <h3 className="font-display text-base font-bold text-zinc-900 mb-3 group-hover:text-brand transition-colors">
                    {event.title}
                  </h3>

                  {/* Info details */}
                  <div className="flex flex-col gap-2 text-xs text-zinc-500 font-medium mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-zinc-400" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-zinc-400" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>

                {/* View Details bottom action */}
                <div className="pt-3.5 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-[10px] font-black text-zinc-800 uppercase tracking-widest group-hover:text-brand transition-colors">
                    View Details
                  </span>
                  <span className="h-8 w-8 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-700 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all shadow-sm">
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default UpcomingEvents;
