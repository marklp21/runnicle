import React from 'react';
import { type EventItem } from '../data/mockData';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

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
  const customEvents = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80',
      badge: 'CLOSING SOON',
      badgeClass: 'bg-white text-[#FF4400]',
      tags: ['3K', '5K', '10K'],
      tagClass: 'border-[#FF4400] text-[#FF4400]',
      title: 'MegaWorld Fun Run',
      date: 'Oct 24, 2026',
      location: 'Bacolod City',
      buttonText: 'VIEW DETAILS',
      buttonClass: 'bg-[#FF4400] text-white hover:bg-[#E63D00]'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=800&q=80',
      badge: 'OPEN',
      badgeClass: 'bg-[#C6F6D5] text-[#22543D]',
      tags: ['10K', 'MARATHON'],
      tagClass: 'border-[#FF4400] text-[#FF4400]',
      title: 'Lasallian Run 2026',
      date: 'Nov 23, 2026',
      location: 'Bacolod City',
      buttonText: 'VIEW DETAILS',
      buttonClass: 'bg-[#FF4400] text-white hover:bg-[#E63D00]'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80',
      badge: 'SOLD OUT',
      badgeClass: 'bg-white text-zinc-400',
      tags: ['3K', '5K', '10K'],
      tagClass: 'border-[#B0B0B0] text-zinc-400',
      title: 'Pawtection Run',
      titleClass: 'text-zinc-400',
      date: 'Sept 20, 2025',
      location: 'Bacolod City',
      buttonText: 'VIEW DETAILS',
      buttonClass: 'bg-zinc-400 text-white cursor-not-allowed',
      grayscale: true
    }
  ];

  return (
    <section className="py-20 bg-[#F9FAFB]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <h2 className="font-sans text-4xl font-bold tracking-tight text-zinc-900 mb-2">
              Race <span className="font-serif italic text-[#FF4400] font-normal">Calendar</span>
            </h2>
            <p className="text-sm text-black font-normal">
              Events designed for every pace. Push your boundaries on the track.
            </p>
          </div>
          <button
            onClick={onViewAllClick}
            className="font-mono mt-4 sm:mt-0 text-xs sm:text-sm font-semibold tracking-widest text-black hover:text-[#FF4400] transition-colors uppercase inline-flex items-center gap-2 cursor-pointer"
          >
            VIEW ALL <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto">
          {customEvents.map((event) => (
            <div
              key={event.id}
              className="flex flex-col bg-white border border-[#B0B0B0] overflow-hidden rounded-[7px] h-full"
            >
              <div className="relative h-48 overflow-hidden bg-zinc-100">
                <img
                  src={event.image}
                  alt={event.title}
                  className={`h-full w-full object-cover ${event.grayscale ? 'grayscale opacity-80' : ''}`}
                  loading="lazy"
                />
                <span className={`font-mono absolute top-4 right-4 rounded-[4px] px-3 py-1 text-[10px] tracking-widest uppercase font-bold ${event.badgeClass}`}>
                  {event.badge}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`font-mono rounded-[4px] border px-3 py-0.5 text-[11px] font-semibold tracking-widest uppercase bg-transparent ${event.tagClass}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className={`text-lg font-semibold mb-3 ${event.titleClass || 'text-zinc-900'}`}>
                  {event.title}
                </h3>

                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-semibold mb-5 tracking-wide">
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
                    onClick={() => {
                      const fullEvent = events?.find(e => e.title === event.title) || (event as unknown as EventItem);
                      onViewDetailsClick(fullEvent);
                    }} 
                    className={`font-mono w-full py-3 text-[10px] font-semibold tracking-widest uppercase transition-colors rounded-[7px] ${event.buttonClass}`}
                  >
                    {event.buttonText}
                  </button>
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
