import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, AlertCircle } from 'lucide-react';

interface HeroProps {
  onSecureSlotClick: () => void;
  onViewCalendarClick: () => void;
  targetEventName: string;
  targetEventDate: string;
  targetEventDeadline: string;
  targetEventTimestamp: number;
}

export const Hero: React.FC<HeroProps> = ({
  onSecureSlotClick,
  onViewCalendarClick,
  targetEventName,
  targetEventDate,
  targetEventDeadline,
  targetEventTimestamp,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    const tick = () => {
      const now = new Date().getTime();
      const difference = targetEventTimestamp - now;

      if (difference <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days: d.toString().padStart(2, '0'),
        hours: h.toString().padStart(2, '0'),
        minutes: m.toString().padStart(2, '0'),
        seconds: s.toString().padStart(2, '0'),
      });
    };

    tick(); // Run immediately
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetEventTimestamp]);

  return (
    <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-900/40 blur-[120px]" />

      <div className="mx-auto max-w-5xl px-4 text-center">
        
        {/* Early-Bird Tag showing target event details */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex flex-col items-center gap-2"
        >
          <span className="inline-flex items-center rounded-full bg-white px-5 py-1.5 text-xs font-black tracking-[0.15em] text-black">
            NEXT UPCOMING EVENT
          </span>
          <span className="text-zinc-400 text-xs font-bold mt-1.5 flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-zinc-500" />
            {targetEventName} • {targetEventDate}
          </span>
        </motion.div>

        {/* Big Bold Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 font-display text-5xl font-black leading-[1.08] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[80px]"
        >
          Melt the Asphalt.<br className="hidden sm:inline" />
          Rule the Road.
        </motion.h1>

        {/* Countdown Grid (4 columns: Days, Hours, Minutes, Seconds) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mx-auto mt-12 grid max-w-xl grid-cols-4 gap-3 sm:gap-4"
        >
          {/* Days */}
          <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-800 bg-[#0f0f0f]/90 py-4 px-2 sm:py-6 sm:px-6 shadow-inner">
            <span className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
              {timeLeft.days}
            </span>
            <span className="mt-2 text-[9px] sm:text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
              Days
            </span>
          </div>

          {/* Hours */}
          <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-800 bg-[#0f0f0f]/90 py-4 px-2 sm:py-6 sm:px-6 shadow-inner">
            <span className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
              {timeLeft.hours}
            </span>
            <span className="mt-2 text-[9px] sm:text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
              Hrs
            </span>
          </div>

          {/* Minutes */}
          <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-800 bg-[#0f0f0f]/90 py-4 px-2 sm:py-6 sm:px-6 shadow-inner">
            <span className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
              {timeLeft.minutes}
            </span>
            <span className="mt-2 text-[9px] sm:text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
              Mins
            </span>
          </div>

          {/* Seconds */}
          <div className="flex flex-col items-center justify-center rounded-lg border border-zinc-850 bg-[#0f0f0f]/90 py-4 px-2 sm:py-6 sm:px-6 shadow-inner border-dashed">
            <span className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl animate-pulse">
              {timeLeft.seconds}
            </span>
            <span className="mt-2 text-[9px] sm:text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
              Secs
            </span>
          </div>
        </motion.div>

        {/* Deadline Notice */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-[10px] text-zinc-500 font-semibold flex items-center justify-center gap-1"
        >
          <AlertCircle className="h-3.5 w-3.5 text-zinc-650" />
          Registration System closes on {targetEventDeadline}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <button
            onClick={onSecureSlotClick}
            className="w-full sm:w-auto rounded-md bg-white px-8 py-4 text-xs font-black tracking-wider text-black hover:bg-zinc-200 active:scale-98 transition-all duration-200 cursor-pointer shadow-lg shadow-white/5 uppercase"
          >
            Register for Race
          </button>
          
          <button
            onClick={onViewCalendarClick}
            className="w-full sm:w-auto rounded-md border border-zinc-800 bg-[#080808]/40 px-8 py-4 text-xs font-black tracking-wider text-white hover:bg-zinc-900 hover:border-zinc-700 active:scale-98 transition-all duration-200 cursor-pointer uppercase"
          >
            View Season Calendar
          </button>
        </motion.div>
      </div>
    </section>
  );
};
export default Hero;
