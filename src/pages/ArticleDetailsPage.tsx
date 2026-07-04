import React from 'react';
import { ArrowLeft, Calendar, Clock, BookOpen, Quote } from 'lucide-react';
import { type Article, mockArticles } from '../data/mockData';

interface ArticleDetailsPageProps {
  article: Article;
  onBack: () => void;
  onNavigateToArticle: (article: Article) => void;
}

export const ArticleDetailsPage: React.FC<ArticleDetailsPageProps> = ({
  article,
  onBack,
  onNavigateToArticle,
}) => {
  
  
  const relatedArticles = mockArticles.filter(art => art.id !== article.id).slice(0, 2);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-orange-500 uppercase tracking-wider transition-colors mb-8 cursor-pointer group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to News
      </button>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {}
        <div className="lg:col-span-2 space-y-8">
          
          {}
          <div className="space-y-4">
            <span className="text-[9px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 border border-orange-100 rounded px-2.5 py-1">
              {article.category}
            </span>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 leading-tight tracking-tight">
              {article.title}
            </h1>

            {}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-3 border-y border-zinc-200 py-4 text-xs font-semibold text-zinc-500">
              <div className="flex items-center gap-2">
                <img src={article.authorAvatar} alt={article.author} className="h-7 w-7 rounded-full border border-zinc-200 object-cover" />
                <span className="text-zinc-900 font-bold">{article.author}</span>
              </div>
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-orange-500" /> Published {article.date}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-orange-500" /> {article.readTime}</span>
            </div>
          </div>

          {}
          <div className="aspect-video rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-200 shadow-sm">
            <img src={article.image} alt={article.title} className="h-full w-full object-cover" />
          </div>

          {}
          <div className="space-y-6 text-sm text-zinc-700 font-semibold leading-relaxed">
            {article.content.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 flex gap-4">
            <Quote className="h-8 w-8 text-orange-500 flex-shrink-0" />
            <p className="text-zinc-600 font-display italic font-semibold leading-relaxed">
              "Running teaches us that we are capable of so much more than we ever imagined. Rules of form, training miles, and recovery build the engine, but community builds the spirit."
            </p>
          </div>

        </div>

        {}
        <div className="space-y-6 lg:sticky lg:top-24">
          <h3 className="font-display text-base font-black text-zinc-900 tracking-tight uppercase border-b border-zinc-200 pb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-orange-500" />
            Related Articles
          </h3>

          <div className="space-y-6">
            {relatedArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => onNavigateToArticle(art)}
                className="rounded-xl border border-zinc-200 hover:border-orange-200 hover:shadow-sm bg-white p-4 transition-colors cursor-pointer group flex gap-4 shadow-sm"
              >
                <div className="h-16 w-20 rounded bg-zinc-50 border border-zinc-100 overflow-hidden flex-shrink-0">
                  <img src={art.image} alt={art.title} className="h-full w-full object-cover" />
                </div>
                <div>
                  <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest block">{art.category}</span>
                  <h4 className="text-xs font-bold text-zinc-900 group-hover:text-orange-600 mt-1 line-clamp-2 leading-snug">
                    {art.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
export default ArticleDetailsPage;
