import React from 'react';
import { motion } from 'framer-motion';
import { type EventItem } from '../types';

interface EarlyBirdPricingProps {
  event: EventItem | null;
  onRegisterClick?: (distance?: string) => void;
}

export const EarlyBirdPricing: React.FC<EarlyBirdPricingProps> = ({ event, onRegisterClick }) => {
  if (!event) return null;

  const discountPercent = event.earlyBirdDiscountPercent ?? 20;
  const jerseyFee = event.jerseyFee ?? 250;

  // Default distances if none specified
  const distances = event.distances && event.distances.length > 0
    ? event.distances
    : ['3K', '5K', '10K', 'MARATHON'];

  // Default base price map if not explicitly set in event.distanceFees
  const defaultBasePrices: Record<string, number> = {
    '3K': 500,
    '5K': 700,
    '10K': 900,
    '16K': 1000,
    '21K': 1200,
    '32K': 1400,
    '42K': 1500,
    'MARATHON': 1200,
  };

  const getBaseFee = (dist: string): number => {
    if (event.distanceFees && event.distanceFees[dist]) {
      return event.distanceFees[dist];
    }
    const parsedFee = parseInt(event.details?.fee?.replace(/[^0-9]/g, '') || '');
    if (!isNaN(parsedFee) && parsedFee > 0) {
      return parsedFee;
    }
    return defaultBasePrices[dist.toUpperCase()] || 800;
  };

  return (
    <section className="relative bg-[#F8F9FA] py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
      <div className="max-w-5xl mx-auto text-center">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 sm:mb-12"
        >
          <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-3">
            {discountPercent}% Off Early Bird <span className="font-serif italic text-[#FF4400] font-bold">Active</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 font-medium max-w-xl mx-auto">
            {event.earlyBirdDeadline 
              ? `What is included: Lock in your Early Bird rate before ${event.earlyBirdDeadline}.`
              : 'What is included: Lock in your Early Bird rate before slots fill up.'
            }
          </p>
        </motion.div>

        {/* Pricing Table Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative max-w-3xl mx-auto bg-white rounded-2xl sm:rounded-3xl border border-zinc-200/90 p-6 sm:p-10 shadow-xl shadow-zinc-200/50 text-left overflow-hidden"
        >
          {/* Subtle Orange Glow at Bottom */}
          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-[#FF4400]/15 blur-3xl rounded-full pointer-events-none" />

          {/* Table Header */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pb-5 border-b border-zinc-200 text-xs sm:text-sm font-sans font-bold text-zinc-900 tracking-wide uppercase">
            <div>Distance</div>
            <div className="text-center">Ticket Only</div>
            <div className="text-center">Ticket & Singlet</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-zinc-100">
            {distances.map((dist) => {
              const baseFee = getBaseFee(dist);
              const earlyBirdTicketOnly = Math.round(baseFee * (1 - discountPercent / 100));

              const origTicketWithSinglet = baseFee + jerseyFee;
              const earlyBirdWithSinglet = Math.round(origTicketWithSinglet * (1 - discountPercent / 100));

              return (
                <div
                  key={dist}
                  onClick={() => onRegisterClick && onRegisterClick(dist)}
                  className="grid grid-cols-3 gap-2 sm:gap-4 py-4 sm:py-5 items-center hover:bg-zinc-50/80 rounded-lg transition-colors cursor-pointer group"
                >
                  {/* Distance Column */}
                  <div className="font-sans font-bold text-sm sm:text-base text-[#FF4400] group-hover:scale-105 transition-transform origin-left">
                    {dist}
                  </div>

                  {/* Ticket Only Column */}
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <span className="text-xs sm:text-sm text-zinc-400 line-through font-mono">
                      ₱ {baseFee.toLocaleString()}
                    </span>
                    <span className="inline-flex items-center justify-center rounded-full border border-[#FF4400] text-[#FF4400] bg-white px-3 sm:px-4 py-1 text-xs sm:text-sm font-bold font-mono shadow-sm group-hover:bg-[#FF4400] group-hover:text-white transition-all">
                      ₱ {earlyBirdTicketOnly.toLocaleString()}
                    </span>
                  </div>

                  {/* Ticket & Singlet Column */}
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <span className="text-xs sm:text-sm text-zinc-400 line-through font-mono">
                      ₱ {origTicketWithSinglet.toLocaleString()}
                    </span>
                    <span className="inline-flex items-center justify-center rounded-full border border-[#FF4400] text-[#FF4400] bg-white px-3 sm:px-4 py-1 text-xs sm:text-sm font-bold font-mono shadow-sm group-hover:bg-[#FF4400] group-hover:text-white transition-all">
                      ₱ {earlyBirdWithSinglet.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default EarlyBirdPricing;
