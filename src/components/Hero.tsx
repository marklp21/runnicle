import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { type EventItem } from '../data/mockData';

interface HeroProps {
  event: EventItem | null;
  backgroundImage?: string;
  onSecureSlotClick: () => void;
  onViewCalendarClick: () => void;
  targetEventTimestamp: number;
}

export const Hero: React.FC<HeroProps> = ({
  event,
  backgroundImage,
  onSecureSlotClick,
  onViewCalendarClick,
  targetEventTimestamp,
}) => {
  const renderDynamicHeading = (title: string) => {
    const regex = /\bRun\b/i;
    const match = title.match(regex);
    
    if (match && match.index !== undefined) {
      const runWord = match[0];
      const before = title.substring(0, match.index);
      const after = title.substring(match.index + runWord.length);
      
      return (
        <>
          {before}
          <span className="font-serif italic text-[#FF4400] normal-case font-bold tracking-normal">
            {runWord}
          </span>
          {after}
        </>
      );
    }
    
    return title;
  };

  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
  });

  useEffect(() => {
    if (!event) return;

    const tick = () => {
      const now = new Date().getTime();
      const difference = targetEventTimestamp - now;

      if (difference <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00' });
        return;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft({
        days: d.toString().padStart(2, '0'),
        hours: h.toString().padStart(2, '0'),
        minutes: m.toString().padStart(2, '0'),
      });
    };

    tick();
    const interval = setInterval(tick, 1000 * 60);
    return () => clearInterval(interval);
  }, [event, targetEventTimestamp]);

  const bgImg = backgroundImage || '/images/hero-bg.png';

  const getPromoBadgeText = () => {
    if (!event) return null;
    if (event.earlyBirdDeadline && event.earlyBirdDiscountPercent !== undefined) {
      return `EARLY BIRDS ${event.earlyBirdDiscountPercent}% OFF – REGISTER BY ${event.earlyBirdDeadline.toUpperCase()}`;
    }
    return event.title.toUpperCase();
  };

  const promoBadgeText = getPromoBadgeText();

  return (
    <section className="relative overflow-hidden min-h-[75vh] flex items-center justify-center pt-24 pb-20 bg-black select-none">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImg}
          alt="Runner in motion"
          className="w-full h-full object-cover grayscale brightness-150 contrast-125"
        />
        {/* Dark overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">

        {/* Top Race Title / Promo Badge (Only when a race exists) */}
        {event && promoBadgeText && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center rounded-full bg-[#FF4400] px-3.5 sm:px-5 py-1.5 mb-8 max-w-[92vw]"
          >
            <span className="font-mono text-[10px] sm:text-xs font-bold tracking-wider sm:tracking-widest text-white uppercase text-center leading-tight">
              {promoBadgeText}
            </span>
          </motion.div>
        )}

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-sans text-5xl sm:text-6xl md:text-[80px] font-bold leading-[1.1] tracking-tight text-white mb-6"
        >
          {event ? renderDynamicHeading(event.title) : (
            <>
              Every Mile Has a <span className="font-serif italic text-[#FF4400] normal-case font-bold tracking-normal">Story</span><br />
              Write Yours
            </>
          )}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl text-sm sm:text-base text-zinc-300 font-normal leading-relaxed mb-6"
        >
          {event 
            ? `Registration is now open for ${event.title} in ${event.location}! Secure your slot, track your pace, and write your next chapter in the Runnicle archive.`
            : 'Registration closes when the clock hits zero. Secure your slot, track your pace, and write your next chapter in the Runnicle archive.'
          }
        </motion.p>

        {/* Countdown Timer (Only when a race exists) */}
        {event && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center mb-14"
          >
            <span className="font-mono text-xs font-bold tracking-widest text-[#FF4400] uppercase mb-4">
              REGISTRATION CLOSES IN:
            </span>

            <div className="flex items-center gap-4 sm:gap-6 mt-2">
              {/* Days */}
              <div className="flex flex-col items-center justify-center w-24 h-24 sm:w-28 sm:h-28 border border-[#FF4400] rounded-[7px] bg-transparent">
                <span className="font-sans text-4xl sm:text-5xl font-bold text-white leading-none">{timeLeft.days}</span>
                <span className="text-sm font-bold text-[#FF4400] mt-0.5 uppercase tracking-widest font-mono">DAYS</span>
              </div>

              {/* Hours */}
              <div className="flex flex-col items-center justify-center w-24 h-24 sm:w-28 sm:h-28 border border-[#FF4400] rounded-[7px] bg-transparent">
                <span className="font-sans text-4xl sm:text-5xl font-bold text-white leading-none">{timeLeft.hours}</span>
                <span className="text-sm font-bold text-[#FF4400] mt-0.5 uppercase tracking-widest font-mono">HRS</span>
              </div>

              {/* Minutes */}
              <div className="flex flex-col items-center justify-center w-24 h-24 sm:w-28 sm:h-28 border border-[#FF4400] rounded-[7px] bg-transparent">
                <span className="font-sans text-4xl sm:text-5xl font-bold text-white leading-none">{timeLeft.minutes}</span>
                <span className="text-sm font-bold text-[#FF4400] mt-0.5 uppercase tracking-widest font-mono">MINS</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Buttons (Only when a race exists) */}
        {event && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <button
              onClick={onSecureSlotClick}
              className="bg-[#FF4400] hover:bg-[#E63D00] px-8 py-4 text-xs font-semibold tracking-widest uppercase text-white transition-all cursor-pointer min-w-[240px] rounded-[7px]"
            >
              SECURE YOUR SLOT
            </button>

            <button
              onClick={onViewCalendarClick}
              className="bg-transparent border border-[#FF4400] hover:bg-[#FF4400]/10 px-8 py-4 text-xs font-semibold tracking-widest uppercase text-[#FF4400] transition-all cursor-pointer min-w-[240px] rounded-[7px]"
            >
              VIEW EVENT & DETAILS
            </button>
          </motion.div>
        )}

      </div>
    </section>
  );
};
export default Hero;
