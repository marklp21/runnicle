import React from 'react';
import { motion } from 'framer-motion';
import { type EventItem } from '../types';

interface EarlyBirdPricingProps {
  event: EventItem | null;
  onRegisterClick?: (distance?: string, singletSize?: string) => void;
}

export const EarlyBirdPricing: React.FC<EarlyBirdPricingProps> = ({ event }) => {
  if (!event) return null;

  const discountPercent = event.earlyBirdDiscountPercent ?? 20;

  // Fixed 1:1 reference rows matching target screenshot exactly
  const referenceRows = [
    { label: '3K', distKey: '3K', origTicket: 'P 600', earlyTicket: 'P 480', origSinglet: 'P 880', earlySinglet: 'P 760' },
    { label: '5K', distKey: '5K', origTicket: 'P 700', earlyTicket: 'P 560', origSinglet: 'P 980', earlySinglet: 'P 840' },
    { label: '10K', distKey: '10K', origTicket: 'P 800', earlyTicket: 'P 560', origSinglet: 'P 1,080', earlySinglet: 'P 920' },
    { label: 'Marathon', distKey: '42K', origTicket: 'P 900', earlyTicket: 'P 560', origSinglet: 'P 1,180', earlySinglet: 'P 1,000' },
  ];

  return (
    <section className="relative bg-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 select-none font-sans slashed-zero [font-variant-numeric:slashed-zero]">
      
      {/* Orange Glow positioned higher (top-[155px]) for rich, non-faint top visibility */}
      <div 
        className="absolute top-[155px] left-1/2 -translate-x-1/2 w-[720px] max-w-[92vw] h-[600px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255, 68, 0, 0.55) 0%, rgba(255, 68, 0, 0.28) 45%, rgba(255, 68, 0, 0.06) 75%, rgba(255, 68, 0, 0) 90%)',
          filter: 'blur(50px)'
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 sm:mb-10"
        >
          <h2 className="font-sans text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-black mb-2">
            <span className="font-mono slashed-zero">{discountPercent}%</span> Off Early Bird <span className="font-serif italic text-[#FF4400] font-bold">Active</span>
          </h2>
          <p className="text-xs sm:text-sm text-black font-normal max-w-lg mx-auto">
            Timer is ticking. Lock in your Early Bird slot before rates go up.
          </p>
        </motion.div>

        {/* Pricing Table Card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative max-w-2xl mx-auto bg-white/95 backdrop-blur-xs rounded-2xl border border-zinc-300 p-6 sm:p-8 text-left overflow-hidden shadow-xs z-10"
        >
          {/* Table Header */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pb-2 text-xs sm:text-sm font-sans font-semibold text-zinc-900">
            <div>Distance</div>
            <div className="text-center">Ticket Only</div>
            <div className="text-center">Ticket & Singlet</div>
          </div>

          {/* Table Rows */}
          <div>
            {referenceRows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-3 gap-2 sm:gap-4 py-4 sm:py-4.5 items-center"
              >
                {/* Distance Column */}
                <span className="font-sans font-bold text-xs sm:text-sm text-[#FF4400] tracking-wide text-left">
                  {row.label}
                </span>

                {/* Ticket Only Column */}
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <span className="font-mono text-xs sm:text-sm text-zinc-500 line-through font-medium slashed-zero">
                    {row.origTicket}
                  </span>
                  <span className="inline-flex items-center justify-center rounded-full border border-[#FF4400] text-[#FF4400] bg-[#FFF3EB] px-3 sm:px-4 py-0.5 sm:py-1 text-xs sm:text-sm font-bold font-mono tracking-wider slashed-zero">
                    {row.earlyTicket}
                  </span>
                </div>

                {/* Ticket & Singlet Column */}
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  <span className="font-mono text-xs sm:text-sm text-zinc-500 line-through font-medium slashed-zero">
                    {row.origSinglet}
                  </span>
                  <span className="inline-flex items-center justify-center rounded-full border border-[#FF4400] text-[#FF4400] bg-[#FFF3EB] px-3 sm:px-4 py-1 text-xs sm:text-sm font-bold font-mono tracking-wider slashed-zero">
                    {row.earlySinglet}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default EarlyBirdPricing;
