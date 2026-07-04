import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { type CommunityPost, mockCommunityPosts } from '../data/mockData';
import { motion } from 'framer-motion';

interface CommunityPulseProps {
  onPostClick: (post: CommunityPost) => void;
}

export const CommunityPulse: React.FC<CommunityPulseProps> = ({ onPostClick }) => {
  return (
    <section className="py-24 bg-zinc-50/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl uppercase">
            Community inspired
          </h2>
          <p className="mt-2 text-xs text-zinc-500 font-semibold uppercase tracking-wider">
            Highlights and stories from our runners on the road
          </p>
        </div>

        {}
        <div className="flex flex-wrap gap-4 justify-center">
          {mockCommunityPosts.slice(0, 12).map((post) => (
            <motion.div
              key={post.id}
              onClick={() => onPostClick(post)}
              className="relative w-[calc(50%-8px)] sm:w-44 md:w-48 aspect-square bg-zinc-100 flex items-center justify-center cursor-pointer overflow-hidden group select-none rounded-2xl border border-zinc-100 shadow-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {}
              <img
                src={post.image}
                alt={post.caption}
                className="absolute inset-0 h-full w-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500 rounded-2xl"
                loading="lazy"
              />

              {}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5 z-10 rounded-2xl">
                <span className="text-[10px] font-bold text-white tracking-wider truncate">
                  @{post.username}
                </span>
                
                <div className="flex items-center gap-3 text-xs text-white font-bold">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3.5 w-3.5 fill-red-500 stroke-red-500" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5 fill-white stroke-none" />
                    {post.commentsCount}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default CommunityPulse;
