import React, { useState } from 'react';
import { Search, Calendar, Info, ArrowRight } from 'lucide-react';
import { type Article } from '../data/mockData';

interface NewsPageProps {
  articles: Article[];
  onArticleClick: (article: Article) => void;
}

export const NewsPage: React.FC<NewsPageProps> = ({
  articles,
  onArticleClick,
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    'all',
    'Event Updates',
    'Registration',
    'Sponsors',
    'Route Changes',
    'Community',
    'General Announcements'
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesCategory = activeCategory === 'all' || art.category === activeCategory;
    const matchesSearch = art.title.toLowerCase().includes(search.toLowerCase()) || 
                          art.summary.toLowerCase().includes(search.toLowerCase()) ||
                          art.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="border-b border-zinc-900 pb-6 mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <span className="rounded-full bg-white/10 px-4 py-1 text-xs font-extrabold tracking-widest text-white uppercase">
            NEWSROOM
          </span>
          <h1 className="mt-4 font-display text-4xl font-black text-white tracking-tight leading-none">
            Announcements & Updates
          </h1>
          <p className="mt-2.5 text-xs text-zinc-400 font-semibold">
            Follow the latest stories, route detours, athlete bulletins, and partner news.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
          <input
            type="text"
            placeholder="Search news..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded border border-zinc-800 bg-[#0c0c0c] pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-700 focus:border-white focus:outline-none"
          />
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap border-b border-zinc-950 pb-5 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              activeCategory === cat
                ? 'bg-white text-black border-white'
                : 'border-zinc-900 text-zinc-500 hover:border-zinc-700 hover:text-white'
            }`}
          >
            {cat === 'all' ? 'All Updates' : cat}
          </button>
        ))}
      </div>

      {/* Articles loop */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-zinc-900 bg-[#070708]/30 text-zinc-500">
          <Info className="h-10 w-10 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-white font-bold">No announcements found</h3>
          <p className="text-xs mt-1.5 font-medium">Reset your filter chips or try another keyword query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              className="rounded-xl border border-zinc-900 bg-[#0c0c0d]/60 hover:border-zinc-800 transition-colors flex flex-col justify-between overflow-hidden group cursor-pointer"
              onClick={() => onArticleClick(article)}
            >
              <div>
                {/* Visual */}
                <div className="relative aspect-video overflow-hidden bg-zinc-900 border-b border-zinc-950">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="h-full w-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-4 left-4 bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1 text-[9px] font-black uppercase text-zinc-400 tracking-widest">
                    {article.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3.5">
                  <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-zinc-700" />
                    {article.date} • {article.readTime}
                  </span>

                  <h3 className="font-display text-lg font-black text-white group-hover:text-zinc-200 transition-colors tracking-tight leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-zinc-400 font-semibold leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>
                </div>
              </div>

              {/* Author & Read More */}
              <div className="p-6 border-t border-zinc-950 bg-zinc-950/20 flex justify-between items-center text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <img src={article.authorAvatar} alt={article.author} className="h-6 w-6 rounded-full border border-zinc-800 object-cover" />
                  <span className="text-zinc-400">{article.author}</span>
                </div>
                
                <span className="inline-flex items-center text-[10px] font-extrabold tracking-wider text-white uppercase gap-1 hover:text-zinc-300 transition-colors">
                  Read Article
                  <ArrowRight className="h-3.5 w-3.5 text-white" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
export default NewsPage;
