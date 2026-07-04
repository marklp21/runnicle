import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Alex Rivera',
    role: 'Marathon Finisher',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
    quote: "Runnicle's custom marathon training blocks completely transformed my running. I went from struggling to finish a 10K to crossing my first marathon finish line with a smile. The community keeps me accountable every single day!",
    rating: 5
  },
  {
    id: 'test-2',
    name: 'Marcus Chen',
    role: 'Sub-45 10K Runner',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
    quote: "The strategic video calls with coaching partners on Runnicle are a game-changer. Dan corrected my running posture and stride frequency, allowing me to crush my 10K PB by over 4 minutes without any knee pain.",
    rating: 5
  },
  {
    id: 'test-3',
    name: 'Clara Santos',
    role: 'Community Captain',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
    quote: "Runnicle is more than just a training portal; it's a home for Bacolod's running community. The seamless event registrations, official maps, and live updates make participating in races a breeze.",
    rating: 5
  }
];

interface CommunityPulseProps {
  onPostClick?: (post: any) => void;
}

export const CommunityPulse: React.FC<CommunityPulseProps> = () => {
  return (
    <section className="py-24 bg-zinc-50/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <span className="rounded-full bg-orange-50 px-4 py-1 text-xs font-extrabold tracking-widest text-orange-600 border border-orange-200 uppercase">
            TESTIMONIALS
          </span>
          <h2 className="mt-6 font-display text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl uppercase">
            What Our Runners Say
          </h2>
          <p className="mt-2 text-zinc-500 text-sm font-semibold max-w-xl mx-auto">
            Real stories of transformation, consistency, and community from the road.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <motion.div
              key={test.id}
              className="rounded-2xl border border-zinc-200 bg-white p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 relative group"
              whileHover={{ y: -4 }}
            >
              <div className="space-y-4">
                <div className="flex gap-1 text-orange-500">
                  {Array.from({ length: test.rating }).map((_, i) => (
                    <Star key={i} className="h-4.5 w-4.5 fill-orange-500 stroke-none" />
                  ))}
                </div>
                <p className="text-zinc-600 text-sm leading-relaxed font-medium">
                  "{test.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3.5 mt-8 pt-6 border-t border-zinc-100">
                <img
                  src={test.avatar}
                  alt={test.name}
                  className="h-10 w-10 rounded-full object-cover border border-zinc-200 shadow-sm"
                  loading="lazy"
                />
                <div>
                  <span className="text-xs font-bold text-zinc-900 block leading-tight">
                    {test.name}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider block mt-1">
                    {test.role}
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
