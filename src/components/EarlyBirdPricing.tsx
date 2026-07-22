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
  const rawDistances = event.distances && event.distances.length > 0
    ? event.distances
    : ['3K', '5K', '10K', 'Marathon'];

  // Format distance label nicely (e.g., MARATHON -> Marathon)
  const formatDistanceLabel = (dist: string): string => {
    const upper = dist.toUpperCase();
    if (upper === 'MARATHON' || upper === '42K') return 'Marathon';
    return upper;
  };

  // Default base price map if not explicitly set in event.distanceFees
  const defaultBasePrices: Record<string, number> = {
    '3K': 500,
    '5K': 700,
    '10K': 900,
    '16K': 1000,
    '21K': 1200,
    '32K': 1400,
    '42K': 1200,
    'MARATHON': 1200,
  };

  const getBaseFee = (dist: string): number => {
    if (event.distanceFees && event.distanceFees[dist]) {
      return event.distanceFees[dist];
    }
    const upper = dist.toUpperCase();
    if (event.distanceFees && event.distanceFees[upper]) {
      return event.distanceFees[upper];
    }
    const parsedFee = parseInt(event.details?.fee?.replace(/[^0-9]/g, '') || '');
    if (!isNaN(parsedFee) && parsedFee > 0) {
      return parsedFee;
    }
    return defaultBasePrices[upper] || 800;
  };

  return (
    <section className="relative bg-[#F5F5F5] py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden select-none font-sans">
      <div className="max-w-4xl mx-auto text-center">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 sm:mb-10"
        >
          <h2 className="font-sans text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 mb-2">
            {discountPercent}% Off Early Bird <span className="font-serif italic text-[#FF4400] font-bold">Active</span>
          </h2>
          <p className="text-xs text-zinc-500 font-normal tracking-wide max-w-lg mx-auto">
            {event.earlyBirdDeadline 
              ? `What is included: Lock in your Early Bird rate before ${event.earlyBirdDeadline}.`
              : 'What is included: Lock in your Early Bird rate before slots fill up.'
            }
          </p>
        </motion.div>

        {/* Pricing Table Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative max-w-2xl mx-auto bg-white rounded-2xl border border-zinc-200/90 p-6 sm:p-8 shadow-sm text-left overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pb-4 border-b border-zinc-200/80 text-xs sm:text-sm font-sans font-semibold text-zinc-900">
            <div>Distance</div>
            <div className="text-center">Ticket Only</div>
            <div className="text-center">Ticket & Singlet</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-zinc-100/80">
            {rawDistances.map((dist) => {
              const displayLabel = formatDistanceLabel(dist);
              const baseFee = getBaseFee(dist);
              const earlyBirdTicketOnly = Math.round(baseFee * (1 - discountPercent / 100));

              const origTicketWithSinglet = baseFee + jerseyFee;
              const earlyBirdWithSinglet = Math.round(origTicketWithSinglet * (1 - discountPercent / 100));

              return (
                <div
                  key={dist}
                  onClick={() => onRegisterClick && onRegisterClick(dist)}
                  className="grid grid-cols-3 gap-2 sm:gap-4 py-4 sm:py-4.5 items-center hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                >
                  {/* Distance Column */}
                  <div className="font-sans font-bold text-xs sm:text-sm text-[#FF4400] tracking-wide">
                    {displayLabel}
                  </div>

                  {/* Ticket Only Column */}
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <span className="text-xs sm:text-sm text-zinc-400 font-medium line-through">
                      ₱ {baseFee.toLocaleString()}
                    </span>
                    <span className="inline-flex items-center justify-center rounded-full border border-[#FF4400] text-[#FF4400] bg-white px-3 sm:px-4 py-0.5 sm:py-1 text-xs sm:text-sm font-bold font-sans shadow-2xs group-hover:bg-[#FF4400] group-hover:text-white transition-all">
                      ₱ {earlyBirdTicketOnly.toLocaleString()}
                    </span>
                  </div>

                  {/* Ticket & Singlet Column */}
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <span className="text-xs sm:text-sm text-zinc-400 font-medium line-through">
                      ₱ {origTicketWithSinglet.toLocaleString()}
                    </span>
                    <span className="inline-flex items-center justify-center rounded-full border border-[#FF4400] text-[#FF4400] bg-white px-3 sm:px-4 py-1 text-xs sm:text-sm font-bold font-sans shadow-2xs group-hover:bg-[#FF4400] group-hover:text-white transition-all">
                      ₱ {earlyBirdWithSinglet.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Soft glowing orange gradient underneath */}
        <div className="relative max-w-2xl mx-auto h-12 -mt-6 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-24 bg-[#FF4400]/20 blur-2xl rounded-full" />
        </div>

      </div>
    </section>
  );
};

export default EarlyBirdPricing;
