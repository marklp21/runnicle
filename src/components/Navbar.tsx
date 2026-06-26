import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onJoinClick: () => void;
}

const navItems = ['Community', 'Events', 'Gallery', 'Contact'];

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onJoinClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-zinc-900 bg-black/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => setActiveTab('Community')}>
            <span className="font-display text-2xl font-black tracking-tight text-white animate-pulse">
              Athle<span className="text-zinc-400">Run</span>
            </span>
          </div>

          {/* Center Links (Desktop) */}
          <div className="hidden xl:block">
            <div className="flex items-center space-x-6 lg:space-x-8">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveTab(item)}
                  className="relative px-1 py-2 text-xs lg:text-sm font-bold tracking-wide transition-colors duration-200 cursor-pointer text-zinc-450 hover:text-white"
                >
                  <span className="relative z-10">{item}</span>
                  {activeTab === item && (
                    <motion.div
                      layoutId="activeUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button (Desktop) */}
          <div className="hidden xl:block">
            <button
              onClick={onJoinClick}
              className="rounded-full bg-white px-6 py-2.5 text-sm font-bold text-black transition-all hover:bg-zinc-200 active:scale-95 duration-200 shadow-md shadow-white/5 cursor-pointer"
            >
              Join Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white focus:outline-none transition-colors"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden border-t border-zinc-900 bg-black px-4 pt-2 pb-6 space-y-4"
          >
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setActiveTab(item);
                    setIsOpen(false);
                  }}
                  className={`block rounded-lg px-4 py-3 text-base font-semibold transition-colors ${
                    activeTab === item
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-400 hover:bg-zinc-950 hover:text-white'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="pt-2 border-t border-zinc-900">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onJoinClick();
                }}
                className="w-full rounded-full bg-white py-3 text-center text-base font-bold text-black hover:bg-zinc-200 transition-colors"
              >
                Join Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
export default Navbar;
