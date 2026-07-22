import React from 'react';
import { motion } from 'framer-motion';
import { type EventItem } from '../types';

interface EarlyBirdPricingProps {
  event: EventItem | null;
  onRegisterClick?: (distance?: string, singletSize?: string) => void;
}

export const EarlyBirdPricing: React.FC<EarlyBirdPricingProps> = ({ event, onRegisterClick }) => {
  if (!event) return null;

  const discountPercent = event.earlyBirdDiscountPercent ?? 20;
  const jerseyFee = event.jerseyFee ?? 250;

  // Default distances matching reference 1:1
  const rawDistances = event.distances && event.distances.length > 0
    ? event.distances
    : ['3K', '5K', '10K', 'Marathon'];

  // Format distance label nicely (e.g., MARATHON -> Marathon)
  const formatDistanceLabel = (dist: string): string => {
    const upper = dist.toUpperCase();
    if (upper === 'MARATHON' || upper === '42K') return 'Marathon';
    return upper;
  };

  // Exact 1:1 reference price data matching user screenshot
  const defaultRowPricing: Record<string, { origTicket: number; earlyTicket: number; origSinglet: number; earlySinglet: number }> = {
    '3K': { origTicket: 600, earlyTicket: 480, origSinglet: 880, earlySinglet: 760 },
    '5K': { origTicket: 700, earlyTicket: 560, origSinglet: 980, earlySinglet: 840 },
    '10K': { origTicket: 800, earlyTicket: 560, origSinglet: 1080, earlySinglet: 920 },
    'MARATHON': { origTicket: 900, earlyTicket: 560, origSinglet: 1180, earlySinglet: 1000 },
    '42K': { origTicket: 900, earlyTicket: 560, origSinglet: 1180, earlySinglet: 1000 },
  };

  const getRowPrices = (dist: string) => {
    const upper = dist.toUpperCase();
    
    // Check if custom distance fees exist on event object
    if (event.distanceFees && (event.distanceFees[dist] !== undefined || event.distanceFees[upper] !== undefined)) {
      const baseFee = event.distanceFees[dist] ?? event.distanceFees[upper] ?? 800;
      const earlyTicket = Math.round(baseFee * (1 - discountPercent / 100));
      const origSinglet = baseFee + jerseyFee;
      const earlySinglet = Math.round(origSinglet * (1 - discountPercent / 100));
      return { origTicket: baseFee, earlyTicket, origSinglet, earlySinglet };
    }

    // Default 1:1 exact matching pricing
    if (defaultRowPricing[upper]) {
      return defaultRowPricing[upper];
    }

    // Fallback calculation
    const baseFee = 800;
    const earlyTicket = Math.round(baseFee * (1 - discountPercent / 100));
    const origSinglet = baseFee + jerseyFee;
    const earlySinglet = Math.round(origSinglet * (1 - discountPercent / 100));
    return { origTicket: baseFee, earlyTicket, origSinglet, earlySinglet };
  };

  return (
    <section className="relative bg-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden select-none font-sans">
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
              const prices = getRowPrices(dist);

              return (
                <div
                  key={dist}
                  className="grid grid-cols-3 gap-2 sm:gap-4 py-4 sm:py-4.5 items-center hover:bg-zinc-50/80 transition-colors"
                >
                  {/* Distance Column (Clickable) */}
                  <button
                    type="button"
                    onClick={() => onRegisterClick && onRegisterClick(dist)}
                    className="font-sans font-bold text-xs sm:text-sm text-[#FF4400] tracking-wide text-left hover:underline cursor-pointer"
                  >
                    {displayLabel}
                  </button>

                  {/* Ticket Only Column (Clickable Pill) */}
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <span className="font-mono text-xs sm:text-sm text-zinc-500 line-through">
                      P {prices.origTicket.toLocaleString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRegisterClick && onRegisterClick(dist, 'None')}
                      className="inline-flex items-center justify-center rounded-full border border-[#FF4400] text-[#FF4400] bg-white px-3 sm:px-4 py-0.5 sm:py-1 text-xs sm:text-sm font-bold font-mono tracking-wider shadow-2xs hover:bg-[#FF4400] hover:text-white transition-all cursor-pointer active:scale-95"
                      title={`Register for ${displayLabel} Ticket Only`}
                    >
                      P {prices.earlyTicket.toLocaleString()}
                    </button>
                  </div>

                  {/* Ticket & Singlet Column (Clickable Pill) */}
                  <div className="flex items-center justify-center gap-2 sm:gap-3">
                    <span className="font-mono text-xs sm:text-sm text-zinc-500 line-through">
                      P {prices.origSinglet.toLocaleString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRegisterClick && onRegisterClick(dist, 'M')}
                      className="inline-flex items-center justify-center rounded-full border border-[#FF4400] text-[#FF4400] bg-white px-3 sm:px-4 py-1 text-xs sm:text-sm font-bold font-mono tracking-wider shadow-2xs hover:bg-[#FF4400] hover:text-white transition-all cursor-pointer active:scale-95"
                      title={`Register for ${displayLabel} Ticket & Singlet`}
                    >
                      P {prices.earlySinglet.toLocaleString()}
                    </button>
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
