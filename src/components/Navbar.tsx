import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onJoinClick: () => void;
}

const navItems = ['Dashboard', 'Events', 'Gallery', 'Contact'];

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onJoinClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-white shadow-xs select-none border-b border-zinc-100/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('Dashboard')}
            className="flex-shrink-0 flex items-center cursor-pointer"
          >
            <img src="/logo-orange.png" alt="RUNNICLE" className="h-6 w-auto" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden xl:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`text-sm font-medium transition-colors duration-200 cursor-pointer ${
                  activeTab === item ? 'text-[#FF4400] font-semibold' : 'text-zinc-500 hover:text-[#FF4400]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Register Button */}
          <div className="hidden xl:flex items-center">
            <button
              onClick={onJoinClick}
              className="bg-[#FF4400] hover:bg-[#E63D00] text-white text-xs font-semibold px-6 py-2 transition-colors cursor-pointer rounded-[7px]"
            >
              Register Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 text-zinc-500 hover:text-zinc-900 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden border-t border-zinc-100 bg-white px-4 py-4 space-y-4 shadow-lg absolute w-full"
          >
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setActiveTab(item);
                    setIsOpen(false);
                  }}
                  className={`block rounded-md px-4 py-3 text-left text-sm font-normal transition-colors ${
                    activeTab === item
                      ? 'bg-orange-50 text-orange-500'
                      : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="pt-4 border-t border-zinc-100">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onJoinClick();
                }}
                className="w-full bg-[#FF4400] py-3 text-center text-[10px] font-bold tracking-widest uppercase text-white hover:bg-[#E63D00] rounded-[7px]"
              >
                Register Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
export default Navbar;
