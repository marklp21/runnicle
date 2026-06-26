import React from 'react';
import { Camera, Heart, MessageCircle } from 'lucide-react';
import { type CommunityPost, mockCommunityPosts } from '../data/mockData';
import { motion } from 'framer-motion';

interface CommunityPulseProps {
  onPostClick: (post: CommunityPost) => void;
}

export const CommunityPulse: React.FC<CommunityPulseProps> = ({ onPostClick }) => {
  return (
    <section className="py-16 border-t border-zinc-900 bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
            Community Pulse
          </h2>
          <p className="mt-2 text-sm text-zinc-500 font-medium">
            Tag <span className="text-white">#AthleRunPro</span> to be featured.
          </p>
        </div>

        {/* 12-Item Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 border border-zinc-900 bg-zinc-950/20 rounded-xl overflow-hidden divide-x divide-y divide-zinc-900">
          {mockCommunityPosts.slice(0, 12).map((post) => (
            <motion.div
              key={post.id}
              onClick={() => onPostClick(post)}
              className="relative aspect-square bg-[#0b0b0b] flex items-center justify-center cursor-pointer overflow-hidden group select-none"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {/* Default State: Camera Icon */}
              <div className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 group-hover:opacity-0 group-hover:scale-90 z-10">
                <Camera className="h-6 w-6 text-zinc-700 stroke-[1.5]" />
              </div>

              {/* Hover State: Image and stats overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                <img
                  src={post.image}
                  alt={post.caption}
                  className="h-full w-full object-cover scale-110 group-hover:scale-100 transition-transform duration-500"
                  loading="lazy"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-3.5" />

                {/* Content on hover overlay */}
                <div className="absolute inset-0 p-3.5 flex flex-col justify-between z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-[10px] font-bold text-white tracking-wider truncate">
                    @{post.username}
                  </span>
                  
                  <div className="flex items-center gap-3 text-xs text-white">
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
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default CommunityPulse;
