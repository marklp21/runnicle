import React from 'react';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { type EventItem } from '../data/mockData';

interface UpcomingEventsProps {
  events: EventItem[];
  onViewDetailsClick: (event: EventItem) => void;
  onViewAllClick: () => void;
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({
  events,
  onViewDetailsClick,
  onViewAllClick,
}) => {
  // Sort events: upcoming first (sorted by date), then past events
  const sortedEvents = [...events].sort((a, b) => {
    const isPastA = a.badge === 'PAST EVENT' || a.badge === 'SOLD OUT';
    const isPastB = b.badge === 'PAST EVENT' || b.badge === 'SOLD OUT';
    if (isPastA && !isPastB) return 1;
    if (!isPastA && isPastB) return -1;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const displayEvents = sortedEvents.slice(0, 3);

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <h2 className="font-sans text-4xl font-bold tracking-tight text-zinc-900 mb-2">
              Race <span className="font-serif italic text-[#FF4400] font-bold">Calendar</span>
            </h2>
            <p className="text-sm text-black font-normal">
              Events designed for every pace. Push your boundaries on the track.
            </p>
          </div>
          <button
            onClick={onViewAllClick}
            className="font-sans mt-4 sm:mt-0 text-sm sm:text-base font-bold tracking-wider text-black hover:text-[#FF4400] transition-colors uppercase inline-flex items-center gap-2 cursor-pointer"
          >
            VIEW ALL <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Event Cards: Horizontal Swipe Carousel on Mobile (< sm), Standard Grid on Desktop (sm+) */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 md:grid-cols-3 sm:overflow-visible max-w-5xl mx-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {displayEvents.map((event) => {
            const isPast = event.badge === 'SOLD OUT' || event.badge === 'PAST EVENT';
            const badgeClass = event.badge === 'CLOSING SOON'
              ? 'bg-white text-[#FF4400]'
              : event.badge === 'OPEN'
              ? 'bg-[#C6F6D5] text-[#22543D]'
              : 'bg-white text-zinc-400';
              
            const tagClass = isPast
              ? 'border-[#B0B0B0] text-zinc-400'
              : 'border-[#FF4400] text-[#FF4400]';

            const titleClass = isPast ? 'text-zinc-400' : 'text-zinc-900';

            const buttonClass = isPast
              ? 'bg-zinc-400 text-white cursor-not-allowed'
              : 'bg-[#FF4400] text-white hover:bg-[#E63D00]';

            return (
              <div
                key={event.id}
                className="flex flex-col bg-white border border-[#B0B0B0] overflow-hidden rounded-[7px] h-full shrink-0 snap-center w-[270px] xs:w-[290px] sm:w-auto sm:shrink shadow-xs"
              >
                <div className="relative h-44 sm:h-48 overflow-hidden bg-zinc-100">
                  <img
                    src={event.image}
                    alt={event.title}
                    className={`h-full w-full object-cover ${isPast ? 'grayscale opacity-80' : ''}`}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 z-10 pointer-events-auto" />
                  <span className={`font-sans absolute top-3.5 right-3.5 sm:top-4 sm:right-4 rounded-[4px] px-3 py-1 sm:px-3.5 sm:py-1.5 text-[10px] sm:text-[11px] tracking-wider uppercase font-bold z-20 ${badgeClass}`}>
                    {event.badge}
                  </span>
                </div>

                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                    {event.distances.map((tag) => (
                      <span
                        key={tag}
                        className={`font-sans rounded-[4px] border px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase bg-transparent ${tagClass}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className={`text-base sm:text-lg font-semibold mb-3 ${titleClass}`}>
                    {event.title}
                  </h3>

                  <div className="flex items-center justify-between text-[11px] text-zinc-400 font-semibold mb-4 sm:mb-5 tracking-wide">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <button 
                      onClick={() => onViewDetailsClick(event)} 
                      className={`font-sans w-full py-3 sm:py-3.5 text-[12px] font-bold tracking-wider uppercase transition-colors rounded-[7px] cursor-pointer ${buttonClass}`}
                    >
                      VIEW DETAILS
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
