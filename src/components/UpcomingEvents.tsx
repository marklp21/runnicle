import React from 'react';
import { Compass, Mountain, Droplet, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { type EventItem, mockEvents } from '../data/mockData';

interface UpcomingEventsProps {
  onViewDetailsClick: (event: EventItem) => void;
  onViewAllClick: () => void;
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({
  onViewDetailsClick,
  onViewAllClick,
}) => {
  // Render icon based on type
  const renderIcon = (type: string) => {
    const iconClass = "h-12 w-12 text-white stroke-[1.25]";
    switch (type) {
      case 'compass':
        return <Compass className={iconClass} />;
      case 'mountain':
        return <Mountain className={iconClass} />;
      case 'drop':
        return <Droplet className={iconClass} />;
      default:
        return <Compass className={iconClass} />;
    }
  };

  // Get badge colors/styling based on status
  const getBadgeStyle = (status: string) => {
    switch (status) {
      case 'CLOSING SOON':
        return 'bg-white text-black font-extrabold';
      case 'OPEN':
        return 'bg-white text-black font-extrabold';
      case 'SOLD OUT':
        return 'bg-white text-black font-extrabold';
      default:
        return 'bg-white text-black font-extrabold';
    }
  };

  return (
    <section className="py-16 border-t border-zinc-900 bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
              Upcoming Events
            </h2>
            <p className="mt-2 text-sm text-zinc-500 font-medium">
              Certified courses for PB hunters and weekend warriors.
            </p>
          </div>
          <button
            onClick={onViewAllClick}
            className="mt-4 sm:mt-0 inline-flex items-center text-xs font-bold tracking-wider text-white hover:text-zinc-300 transition-colors uppercase gap-1.5 cursor-pointer group"
          >
            View All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockEvents.map((event) => (
            <div
              key={event.id}
              className="flex flex-col rounded-xl border border-zinc-800 bg-black overflow-hidden hover:border-zinc-700 transition-all duration-300 group"
            >
              {/* Top part: Gray visual Container */}
              <div className="relative flex h-52 items-center justify-center bg-[#3f3f46]/50">
                {/* Outer badge in Top-Right */}
                <span className={`absolute top-4 right-4 rounded-sm px-2 py-0.5 text-[9px] tracking-wider uppercase font-black ${getBadgeStyle(event.badge)}`}>
                  {event.badge}
                </span>
                
                {/* Visual Icon in Center */}
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-transparent border border-white/20">
                  {renderIcon(event.iconType)}
                </div>
              </div>

              {/* Bottom part: Details in Black */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  {/* Distance tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {event.distances.map((dist) => (
                      <span
                        key={dist}
                        className="rounded-sm border border-zinc-800 px-2 py-0.5 text-[9px] font-black tracking-wider text-white uppercase bg-zinc-950/40"
                      >
                        {dist}
                      </span>
                    ))}
                  </div>

                  {/* Event Title */}
                  <h3 className="font-display text-lg font-black tracking-tight text-white mb-4">
                    {event.title}
                  </h3>

                  {/* Info details */}
                  <div className="flex flex-col gap-2.5 text-xs text-zinc-500 font-medium mb-6">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-zinc-600" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-zinc-600" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>

                {/* View Details CTA */}
                <button
                  onClick={() => onViewDetailsClick(event)}
                  className="w-full rounded-md bg-white py-3 text-center text-xs font-bold text-black hover:bg-zinc-200 active:scale-[0.98] transition-all duration-200 cursor-pointer uppercase tracking-wider"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default UpcomingEvents;
