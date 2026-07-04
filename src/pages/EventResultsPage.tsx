import React, { useState } from 'react';
import { ArrowLeft, Search, Trophy, Medal, User } from 'lucide-react';
import { type EventItem } from '../data/mockData';

interface EventResultsPageProps {
  event: EventItem;
  onBack: () => void;
}

export const EventResultsPage: React.FC<EventResultsPageProps> = ({
  event,
  onBack,
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const results = event.results || [];
  
  
  const categories = ['all', ...Array.from(new Set(results.map(r => r.category)))];

  const filteredResults = results.filter((res) => {
    const matchesCategory = activeCategory === 'all' || res.category === activeCategory;
    const matchesSearch = res.name.toLowerCase().includes(search.toLowerCase()) || 
                          res.bib.includes(search);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-orange-500 uppercase tracking-wider transition-colors mb-8 cursor-pointer group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Events
      </button>

      {}
      <div className="border-b border-zinc-200 pb-6 mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <span className="text-[10px] font-black text-zinc-450 uppercase tracking-widest block">Race Leaderboards</span>
          <h1 className="font-display text-3xl font-black text-zinc-900 tracking-tight mt-1">
            {event.title} Results
          </h1>
          <p className="mt-2 text-xs text-zinc-500 font-semibold">
            Official timed ranks verified by Runnicle timing loops on {event.date}.
          </p>
        </div>

        {}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search BIB or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded border border-zinc-200 bg-white pl-10 pr-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none"
          />
        </div>
      </div>

      {}
      <div className="flex gap-2 flex-wrap border-b border-zinc-200 pb-5 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer border ${
              activeCategory === cat
                ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/10'
                : 'border-zinc-200 text-zinc-600 hover:border-zinc-350 hover:text-orange-500 bg-white'
            }`}
          >
            {cat === 'all' ? 'All Divisions' : `${cat} Division`}
          </button>
        ))}
      </div>

      {}
      {filteredResults.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-500">
          <User className="h-10 w-10 text-zinc-400 mx-auto mb-4" />
          <h3 className="text-zinc-800 font-bold">No results found</h3>
          <p className="text-xs mt-1.5 font-medium">Verify your spelling or select a different division filter.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-zinc-200 text-left text-xs font-semibold text-zinc-600">
            <thead className="bg-zinc-55 text-zinc-850 font-black tracking-wider uppercase text-[10px] border-b border-zinc-200">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">BIB</th>
                <th className="px-6 py-4">Athlete Name</th>
                <th className="px-6 py-4">Division</th>
                <th className="px-6 py-4 text-right">Finish Time</th>
                <th className="px-6 py-4 text-right">Avg Pace</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 bg-white">
              {filteredResults.map((res) => (
                <tr
                  key={res.bib}
                  className="hover:bg-zinc-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-bold">
                    {res.rank === 1 ? (
                      <span className="flex items-center gap-1 text-yellow-600"><Trophy className="h-4 w-4" /> 1</span>
                    ) : res.rank === 2 ? (
                      <span className="flex items-center gap-1 text-zinc-400"><Medal className="h-4 w-4" /> 2</span>
                    ) : res.rank === 3 ? (
                      <span className="flex items-center gap-1 text-amber-600"><Medal className="h-4 w-4" /> 3</span>
                    ) : (
                      res.rank
                    )}
                  </td>
                  <td className="px-6 py-4 text-zinc-400">#{res.bib}</td>
                  <td className="px-6 py-4 text-zinc-900 font-bold">{res.name}</td>
                  <td className="px-6 py-4">
                    <span className="rounded bg-orange-50 border border-orange-100 text-[9px] px-2 py-0.5 text-orange-600 uppercase tracking-widest">
                      {res.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-zinc-900 font-bold">{res.finishTime}</td>
                  <td className="px-6 py-4 text-right text-zinc-500 font-medium">{res.pace}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
export default EventResultsPage;
