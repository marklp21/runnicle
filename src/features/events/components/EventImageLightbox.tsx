import React, { useEffect, useCallback, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ImageSection {
  id: string;
  title: string;
  subtitle?: string;
  images: string[];
}

interface EventImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  sections: ImageSection[];
  initialSectionId?: string;
  initialImageIndex?: number;
  eventTitle?: string;
}

export const EventImageLightbox: React.FC<EventImageLightboxProps> = ({
  isOpen,
  onClose,
  sections,
  initialSectionId,
  initialImageIndex = 0,
  eventTitle,
}) => {
  // Filter out sections that have no images
  const validSections = sections.filter((s) => s.images && s.images.length > 0);

  const [activeSectionId, setActiveSectionId] = useState<string>(
    initialSectionId || validSections[0]?.id || ''
  );
  const [activeImageIndex, setActiveImageIndex] = useState<number>(initialImageIndex);

  // Tabs scroll state
  const tabsRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);

  const checkTabScroll = useCallback(() => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
      setShowLeftScroll(scrollLeft > 5);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }, []);

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsRef.current) {
      const amount = direction === 'left' ? -200 : 200;
      tabsRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // Sync state when props change or open state changes
  useEffect(() => {
    if (isOpen) {
      if (initialSectionId && validSections.some((s) => s.id === initialSectionId)) {
        setActiveSectionId(initialSectionId);
      } else if (validSections.length > 0) {
        setActiveSectionId(validSections[0].id);
      }
      setActiveImageIndex(initialImageIndex);
      setTimeout(checkTabScroll, 50);
    }
  }, [isOpen, initialSectionId, initialImageIndex, checkTabScroll]);

  useEffect(() => {
    checkTabScroll();
    window.addEventListener('resize', checkTabScroll);
    return () => window.removeEventListener('resize', checkTabScroll);
  }, [checkTabScroll, validSections]);

  // Current active section object
  const currentSection = validSections.find((s) => s.id === activeSectionId) || validSections[0];
  const images = currentSection?.images || [];
  const currentImage = images[activeImageIndex] || images[0];

  const handleNext = useCallback(() => {
    if (images.length === 0) return;
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    if (images.length === 0) return;
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen || !currentSection || images.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col justify-between bg-black/95 backdrop-blur-md p-3 sm:p-5 select-none"
      >
        {/* Top Title & Close Button Bar */}
        <div className="flex items-center justify-between z-20 pb-2.5 border-b border-zinc-800/80">
          <div className="min-w-0 pr-3">
            {eventTitle && (
              <p className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-[#FF4400] truncate">
                {eventTitle}
              </p>
            )}
            <div className="flex items-center gap-2 mt-0.5">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                {currentSection.title}
              </h2>
              {currentSection.subtitle && (
                <span className="text-xs text-zinc-400 font-medium truncate hidden sm:inline">
                  • {currentSection.subtitle}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors flex-shrink-0 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Dedicated Section Tabs Navigation Row with Scroll Arrows */}
        <div className="relative flex items-center gap-1.5 py-2.5 border-b border-zinc-800/60 z-20">
          {/* Left Scroll Arrow */}
          {showLeftScroll && (
            <button
              type="button"
              onClick={() => scrollTabs('left')}
              aria-label="Scroll tabs left"
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white z-10 shadow-lg flex-shrink-0 cursor-pointer border border-zinc-700/60"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Tabs Scroll Container */}
          <div
            ref={tabsRef}
            onScroll={checkTabScroll}
            className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5 scroll-smooth flex-1 min-w-0"
          >
            {validSections.map((sec) => {
              const isActive = sec.id === activeSectionId;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => {
                    setActiveSectionId(sec.id);
                    setActiveImageIndex(0);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex-shrink-0 cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#FF4400] text-white shadow-md shadow-[#FF4400]/25 ring-1 ring-white/20'
                      : 'bg-zinc-900 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                  }`}
                >
                  <span>{sec.title}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                      isActive ? 'bg-black/30 text-white' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {sec.images.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Scroll Arrow */}
          {showRightScroll && (
            <button
              type="button"
              onClick={() => scrollTabs('right')}
              aria-label="Scroll tabs right"
              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white z-10 shadow-lg flex-shrink-0 cursor-pointer border border-zinc-700/60"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Main Content Area: Large Image Display */}
        <div className="relative flex-1 flex items-center justify-center my-3 sm:my-4 overflow-hidden">
          {/* Previous Image Button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-1 sm:left-4 z-20 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/10 backdrop-blur-xs transition-all hover:scale-110 cursor-pointer shadow-xl"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Image Display */}
          <motion.div
            key={`${activeSectionId}-${activeImageIndex}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="relative max-h-[64vh] sm:max-h-[70vh] max-w-full flex items-center justify-center"
          >
            <img
              src={currentImage}
              alt={`${currentSection.title} - Image ${activeImageIndex + 1}`}
              className="max-h-[64vh] sm:max-h-[70vh] max-w-[92vw] sm:max-w-[85vw] object-contain rounded-lg shadow-2xl border border-zinc-800/60"
            />
          </motion.div>

          {/* Next Image Button */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-1 sm:right-4 z-20 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/10 backdrop-blur-xs transition-all hover:scale-110 cursor-pointer shadow-xl"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Image Counter Overlay */}
          {images.length > 1 && (
            <div className="absolute bottom-2 sm:bottom-3 bg-black/80 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider backdrop-blur-xs border border-white/10 shadow-lg flex items-center gap-1.5">
              <ZoomIn className="w-3.5 h-3.5 text-[#FF4400]" />
              <span>
                {activeImageIndex + 1} / {images.length}
              </span>
            </div>
          )}
        </div>

        {/* Bottom Thumbnail Strip */}
        {images.length > 1 ? (
          <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-10 scrollbar-thin max-w-full">
            {images.map((img, idx) => {
              const isSelected = idx === activeImageIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-[#FF4400] ring-2 ring-[#FF4400]/40 scale-105 shadow-md'
                      : 'border-zinc-800 opacity-60 hover:opacity-100 hover:border-zinc-500'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="h-full w-full object-cover"
                  />
                  {isSelected && <div className="absolute inset-0 bg-[#FF4400]/10" />}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-xs text-zinc-500 font-medium py-1">
            Showing image 1 of 1 for {currentSection.title}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default EventImageLightbox;
