import React from 'react';
import { Mail } from 'lucide-react';

interface FooterProps {
  onPlatformClick: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onPlatformClick }) => {
  return (
    <footer className="bg-[#FF4400] text-white pt-16 pb-8">
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
              {['Dashboard', 'Events', 'Gallery', 'Merch', 'Contact'].map((item) => (
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
                className="flex items-center justify-center text-white/80 hover:text-white transition-colors duration-200 cursor-pointer"
                aria-label="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
              </a>
              <a
                href="#"
                className="flex items-center justify-center text-white/80 hover:text-white transition-colors duration-200 cursor-pointer"
                aria-label="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
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

        {/* Bottom copyright section */}
        <div className="border-t border-white/10 pt-8 mt-8 flex items-center justify-between">
          <p className="text-xs text-white/85">
            &copy; Runnicle. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};
export default Footer;
