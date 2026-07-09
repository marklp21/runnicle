import React from 'react';
import { Mail } from 'lucide-react';

interface FooterProps {
  onPlatformClick: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onPlatformClick }) => {
  return (
    <footer className="relative bg-[#FF4400] text-white pt-16 pb-8 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

          {/* Left Column */}
          <div>
            <img src="/logo-white.png" alt="RUNNICLE" className="h-6 w-auto mb-4 block" />
            <p className="text-sm font-normal mb-2 tracking-wide">Unfolding your running story.</p>
            <p className="text-xs text-white/90 leading-relaxed max-w-xs">
              Founded for those who never stop moving.
            </p>
          </div>

          {/* Middle Column */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white mb-6">
              NAVIGATION
            </h4>
            <ul className="space-y-3 text-xs font-normal text-white/80">
              {['Dashboard', 'Events', 'Gallery', 'Contact'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => onPlatformClick(item)}
                    className="hover:text-white transition-colors duration-200 cursor-pointer text-left"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white mb-6">
              SOCIAL
            </h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                aria-label="Instagram"
              >
                <img src="/social-instagram.png" alt="Instagram" className="h-5 w-5 object-contain" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                aria-label="Facebook"
              >
                <img src="/social-facebook.png" alt="Facebook" className="h-5 w-5 object-contain" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center text-white/80 hover:text-white transition-colors duration-200 cursor-pointer"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

        </div>

        {/* Mobile only logo */}
        <div className="flex justify-center md:hidden mb-8">
          <img src="/logo-running-white.png" alt="Runnicle Running Logo" className="h-24 w-auto" />
        </div>

        {/* Bottom copyright section */}
        <div className="border-t border-white/10 pt-8 mt-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-white/85">
            <span>&copy;</span>
            <img src="/logo-white.png" alt="RUNNICLE" className="h-3 w-auto inline-block" />
            <span>All rights reserved.</span>
          </div>
        </div>

      </div>

      {/* Desktop only absolutely positioned logo in lower right */}
      <img 
        src="/logo-running-white.png" 
        alt="Runnicle Running Logo" 
        className="absolute bottom-6 right-8 md:right-16 h-36 w-auto hidden md:block pointer-events-none" 
      />
    </footer>
  );
};
export default Footer;
