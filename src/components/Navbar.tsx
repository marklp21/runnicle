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
    <nav className="sticky top-0 z-50 w-full h-16 bg-white border-b border-zinc-200 select-none">
      <div className="w-full h-full flex items-center justify-between pl-0 pr-0">
        
        {}
        <div 
          onClick={() => setActiveTab('Community')}
          className="flex-shrink-0 h-full bg-brand text-white px-6 flex items-center justify-center cursor-pointer hover:bg-brand-hover transition-colors"
        >
          <span className="font-mono text-sm font-extrabold tracking-[0.25em] uppercase">
            [R]
          </span>
        </div>

        {}
        <div className="hidden xl:flex items-center space-x-6">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`font-mono text-[10px] font-black tracking-widest uppercase transition-colors duration-200 cursor-pointer flex items-center gap-1.5 group ${
                activeTab === item ? 'text-zinc-900 font-extrabold' : 'text-zinc-550 hover:text-zinc-900'
              }`}
            >
              <span>{item}</span>
              <span className="text-brand font-light text-[9px] opacity-75 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150 inline-block">
                [{activeTab === item ? '=' : '>'}]
              </span>
            </button>
          ))}
        </div>

        {}
        <div className="hidden xl:flex items-center h-full gap-6">
          <div className="flex items-center gap-4 text-zinc-400 hover:text-zinc-900 font-mono text-[9px] font-black tracking-widest transition-colors">
            <a href="#" className="hover:text-zinc-900 transition-colors">DIS</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">IG</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">X</a>
          </div>

          <button
            onClick={onJoinClick}
            className="h-full bg-brand hover:bg-brand-hover text-white text-[10px] font-mono font-black tracking-widest px-8 flex items-center justify-center transition-colors uppercase cursor-pointer"
          >
            REGISTER NOW
          </button>
        </div>

        {}
        <div className="flex xl:hidden pr-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 focus:outline-none transition-colors"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden border-t border-zinc-200 bg-white px-4 pt-2 pb-6 space-y-4"
          >
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setActiveTab(item);
                    setIsOpen(false);
                  }}
                  className={`block rounded-lg px-4 py-3 text-left font-mono text-xs font-bold tracking-widest uppercase transition-colors ${
                    activeTab === item
                      ? 'bg-zinc-50 text-zinc-900'
                      : 'text-zinc-550 hover:bg-zinc-50/50 hover:text-zinc-900'
                  }`}
                >
                  {item} <span className="text-brand font-light text-[9px]">[{activeTab === item ? '=' : '>'}]</span>
                </button>
              ))}
            </div>
            <div className="pt-2 border-t border-zinc-200">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onJoinClick();
                }}
                className="w-full bg-brand py-3 text-center text-xs font-mono font-black tracking-widest uppercase text-white hover:bg-brand-hover transition-colors"
              >
                REGISTER NOW
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
export default Navbar;
