import React, { useState } from 'react';
import { Calendar as CalendarIcon, ArrowLeft, Search, MapPin, ChevronRight, Activity, CalendarClock } from 'lucide-react';
import { mockCalendarEvents } from '../data/mockData';

interface CalendarPageProps {
  onBack: () => void;
  onNavigateToEvent: (eventTitle: string) => void;
}

export const CalendarPage: React.FC<CalendarPageProps> = ({
  onBack,
  onNavigateToEvent,
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');

  const filteredEvents = mockCalendarEvents.filter((ev) => {
    const matchesFilter = filter === 'all' || ev.type === filter;
    const matchesSearch = ev.title.toLowerCase().includes(search.toLowerCase()) || 
                          ev.date.toLowerCase().includes(search.toLowerCase()) ||
                          ev.type.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors mb-8 cursor-pointer group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Home
      </button>

      {/* Title */}
      <div className="border-b border-zinc-900 pb-6 mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-black text-white tracking-tight">
            Season Calendar
          </h1>
          <p className="mt-2 text-sm text-zinc-500 font-medium">
            Schedule of athletic programs, community races, gear drops, and live coaching seminars.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
          <input
            type="text"
            placeholder="Search calendar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded border border-zinc-800 bg-[#0c0c0c] pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-700 focus:border-white focus:outline-none"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap border-b border-zinc-950 pb-5 mb-8">
        {['all', 'race', 'training', 'coaching', 'equipment'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              filter === tab
                ? 'bg-white text-black border-white'
                : 'border-zinc-900 text-zinc-500 hover:border-zinc-700 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main timeline listing */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-zinc-900 bg-[#070708]/30">
          <CalendarClock className="h-10 w-10 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-white font-bold">No events found</h3>
          <p className="text-zinc-500 text-xs mt-1.5 font-medium">Try broadening your search or choosing another filter category.</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl mx-auto">
          {filteredEvents.map((ev, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-xl border border-zinc-900 bg-zinc-950/20 hover:border-zinc-800 hover:bg-zinc-950/40 transition-all gap-4"
            >
              <div className="flex items-start gap-4">
                {/* Event type icon indicator */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 flex-shrink-0 text-white shadow-inner">
                  {ev.type === 'race' ? <Activity className="h-5 w-5" /> : <CalendarIcon className="h-5 w-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">{ev.title}</h3>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-zinc-500 mt-2 font-medium">
                    <span>{ev.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-zinc-600" /> Bacolod City</span>
                  </div>
                </div>
              </div>

              {/* Actions row */}
              <div className="flex items-center gap-3 w-full sm:w-auto border-t border-zinc-950 pt-3 sm:pt-0 sm:border-0 justify-between sm:justify-end">
                <span className="text-[9px] font-black text-zinc-400 bg-zinc-900 rounded px-2.5 py-1 tracking-widest uppercase border border-zinc-800">
                  {ev.type}
                </span>

                <button
                  onClick={() => onNavigateToEvent(ev.title)}
                  className="inline-flex items-center gap-1 rounded bg-white text-black px-4 py-2 text-[10px] font-black uppercase tracking-wider hover:bg-zinc-200 transition-colors cursor-pointer"
                >
                  Go to Program
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
export default CalendarPage;
