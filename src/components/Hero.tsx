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

    tick(); 
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetEventTimestamp]);

  return (
    <section className="relative overflow-hidden pt-16 pb-20 bg-white border-b border-zinc-200 select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center relative">
          
          {}
          <div className="md:col-span-7 flex flex-col items-center md:items-start text-center md:text-left">
            
            {}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex flex-col items-center lg:items-start gap-2"
            >
              <span className="font-mono text-[9px] font-black tracking-widest text-brand uppercase">
                [ TARGET PROTOCOL 
              </span>
              <span className="text-zinc-500 font-mono text-[10px] font-bold mt-1 flex items-center gap-1.5 uppercase">
                <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                {targetEventName} • {targetEventDate}
              </span>
            </motion.div>

            {}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 font-display text-5xl sm:text-6xl md:text-7xl font-black leading-[0.95] tracking-tight text-zinc-900 uppercase"
            >
              Bacolod Speed<br className="hidden sm:inline" />
              System.
            </motion.h1>

            {}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-5 max-w-md font-mono text-[10px] tracking-wide text-zinc-500 leading-relaxed uppercase"
            >
              
            </motion.p>

            {}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center md:justify-start items-center gap-4 sm:gap-6 mt-8 w-full font-mono"
            >
              {}
              <div className="w-14 sm:w-16">
                <span className="font-display text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 block">
                  {timeLeft.days}
                </span>
                <span className="mt-1 text-[8px] sm:text-[9px] font-bold tracking-widest text-brand uppercase block">
                  [DAYS]
                </span>
              </div>

              <div className="text-xl text-zinc-300 font-light select-none pb-3.5">:</div>

              {}
              <div className="w-14 sm:w-16">
                <span className="font-display text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 block">
                  {timeLeft.hours}
                </span>
                <span className="mt-1 text-[8px] sm:text-[9px] font-bold tracking-widest text-brand uppercase block">
                  [HRS]
                </span>
              </div>

              <div className="text-xl text-zinc-300 font-light select-none pb-3.5">:</div>

              {}
              <div className="w-14 sm:w-16">
                <span className="font-display text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 block">
                  {timeLeft.minutes}
                </span>
                <span className="mt-1 text-[8px] sm:text-[9px] font-bold tracking-widest text-brand uppercase block">
                  [MINS]
                </span>
              </div>

              <div className="text-xl text-zinc-300 font-light select-none pb-3.5">:</div>

              {}
              <div className="w-14 sm:w-16">
                <span className="font-display text-4xl sm:text-5xl font-black tracking-tight text-brand block animate-pulse">
                  {timeLeft.seconds}
                </span>
                <span className="mt-1 text-[8px] sm:text-[9px] font-bold tracking-widest text-brand uppercase block">
                  [SECS]
                </span>
              </div>
            </motion.div>

            {}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 font-mono text-[9px] text-zinc-400 font-bold uppercase flex items-center justify-center md:justify-start gap-1.5"
            >
              <AlertCircle className="h-3.5 w-3.5 text-zinc-400" />
              REGISTRATION TERMINAL DEACTIVATION ON {targetEventDeadline}
            </motion.p>            {}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row gap-3 w-full justify-center md:justify-start"
            >
              <button
                onClick={onSecureSlotClick}
                className="w-full sm:w-auto bg-brand hover:bg-brand-hover px-8 py-3.5 text-[10px] font-mono font-black tracking-widest uppercase text-white transition-all cursor-pointer shadow-lg shadow-brand/5 flex items-center justify-center gap-1.5 group"
              >
                <span>REGISTER NOW</span>
                <span className="group-hover:translate-x-1 transition-transform duration-200">{"[>]"}</span>
              </button>
              
              <button
                onClick={onViewCalendarClick}
                className="w-full sm:w-auto border border-zinc-300 hover:border-zinc-400 bg-white px-8 py-3.5 text-[10px] font-mono font-black tracking-widest uppercase text-zinc-900 transition-all cursor-pointer flex items-center justify-center gap-1.5 group"
              >
                <span>VIEW CALENDAR</span>
                <span className="group-hover:translate-x-1 transition-transform duration-200">{"[>]"}</span>
              </button>
            </motion.div>
          </div>

          {}
          <div className="hidden md:block md:col-span-5 relative w-full aspect-[4/5] bg-zinc-50 border border-zinc-200/80 p-2">
            
            {}
            <span className="absolute top-1.5 left-1.5 text-[9px] font-light text-zinc-400/60 select-none">+</span>
            <span className="absolute top-1.5 right-1.5 text-[9px] font-light text-zinc-400/60 select-none">+</span>
            <span className="absolute bottom-1.5 left-1.5 text-[9px] font-light text-zinc-400/60 select-none">+</span>
            <span className="absolute bottom-1.5 right-1.5 text-[9px] font-light text-zinc-400/60 select-none">+</span>

            <div className="relative w-full h-full overflow-hidden border border-zinc-200">
              <img
                src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80"
                alt="Elite athlete training"
                className="h-full w-full object-cover opacity-90 filter grayscale contrast-110"
              />
              {}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              
              {}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2.5 border border-zinc-200 shadow-md flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
                <div className="font-mono">
                  <div className="text-[7.5px] font-black text-zinc-400 uppercase tracking-widest">PROTOCOL ACTIVE</div>
                  <div className="text-[10px] font-black text-zinc-900 uppercase tracking-wide">1,840 ACTIVE RUNNERS</div>
                </div>
              </div>

              {}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 border border-zinc-200 shadow-lg flex items-center justify-between font-mono">
                <div>
                  <div className="text-[7px] font-black text-brand uppercase tracking-widest">WEEKLY TARGET PROTOCOL</div>
                  <div className="text-[11px] font-black text-zinc-900 mt-0.5 uppercase tracking-wide">Bacolod Coastal Run</div>
                </div>
                <div className="text-right">
                  <div className="text-[7.5px] font-black text-zinc-400 uppercase tracking-widest">PB LOG</div>
                  <div className="text-[10px] font-black text-brand mt-0.5 tracking-wide">38:45 [10K]</div>
                </div>
              </div>
            </div>
          </div>

          {}
          <div className="absolute right-[-135px] top-1/2 -translate-y-1/2 rotate-90 select-none pointer-events-none hidden 2xl:block">
            <span className="font-display text-[95px] font-black tracking-[0.18em] uppercase whitespace-nowrap block" style={{ WebkitTextStroke: '1px var(--color-brand-glow)', color: 'transparent' }}>
              RUNNICLE
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};
export default Hero;
