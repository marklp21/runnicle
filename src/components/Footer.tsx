import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';


interface FooterProps {
  onPlatformClick: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onPlatformClick }) => {
  const [region, setRegion] = useState('Negros Occidental');
  const [language, setLanguage] = useState('English');
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const regions = ['Negros Occidental', 'Iloilo', 'Cebu', 'Metro Manila'];
  const languages = ['English', 'Filipino', 'Hiligaynon'];

  return (
    <footer className="bg-zinc-50 text-zinc-600 pt-16 pb-8 border-t border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 sm:grid-cols-2 mb-16">
          
          {/* Brand Info */}
          <div className="md:col-span-1">
            <span className="font-display text-lg font-black tracking-[0.25em] text-zinc-900 block uppercase">
              RUNNICLE
            </span>
            <p className="mt-4 text-xs font-semibold text-zinc-500 leading-relaxed max-w-[240px]">
              Elevating the human pace through technical precision and community focus. Founded for those who never stop moving.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-5">
              Platform
            </h4>
            <ul className="space-y-3 text-xs font-bold text-zinc-500">
              {['Event Calendar'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => onPlatformClick(item)}
                    className="hover:text-brand transition-colors duration-200 cursor-pointer text-left"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-5">
              Legal
            </h4>
            <ul className="space-y-3 text-xs font-bold text-zinc-500">
              {['Privacy Policy', 'Terms of Service', 'Cookie Settings', 'Contact Us'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => onPlatformClick(item)}
                    className="hover:text-brand transition-colors duration-200 cursor-pointer text-left"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Icons & Localization */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 mb-5">
              Social
            </h4>
            
            {/* Social Icons Row */}
            <div className="flex gap-4 mb-8">
              <a
                href="https://facebook.com/runnicle"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white hover:border-brand hover:bg-brand/5 transition-all duration-200 text-zinc-700 hover:text-brand-hover cursor-pointer shadow-sm"
                aria-label="Facebook"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com/runnicle"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white hover:border-brand hover:bg-brand/5 transition-all duration-200 text-zinc-700 hover:text-brand-hover cursor-pointer shadow-sm"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="mailto:contact@runnicle.ph"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white hover:border-brand hover:bg-brand/5 transition-all duration-200 text-zinc-700 hover:text-brand-hover cursor-pointer shadow-sm"
                aria-label="Gmail"
              >
                <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </a>
            </div>

            {/* Region / Language Dropdowns */}
            <div className="space-y-3.5 text-[11px] font-bold text-zinc-500 font-mono">
              {/* Region Selector */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowRegionDropdown(!showRegionDropdown);
                    setShowLanguageDropdown(false);
                  }}
                  className="flex items-center gap-1.5 hover:text-brand transition-colors duration-200 cursor-pointer text-left uppercase"
                >
                  <span>Region: {region}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
                {showRegionDropdown && (
                  <div className="absolute bottom-6 left-0 z-30 w-40 rounded-md border border-zinc-250 bg-white p-1.5 shadow-xl">
                    {regions.map((reg) => (
                      <button
                        key={reg}
                        onClick={() => {
                          setRegion(reg);
                          setShowRegionDropdown(false);
                        }}
                        className={`block w-full rounded px-2.5 py-1.5 text-left hover:bg-zinc-50 hover:text-zinc-900 ${
                          region === reg ? 'text-brand bg-brand/5 font-extrabold' : 'text-zinc-500'
                        }`}
                      >
                        {reg}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowLanguageDropdown(!showLanguageDropdown);
                    setShowRegionDropdown(false);
                  }}
                  className="flex items-center gap-1.5 hover:text-brand transition-colors duration-200 cursor-pointer text-left uppercase"
                >
                  <span>Language: {language}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
                {showLanguageDropdown && (
                  <div className="absolute bottom-6 left-0 z-30 w-32 rounded-md border border-zinc-250 bg-white p-1.5 shadow-xl">
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang);
                          setShowLanguageDropdown(false);
                        }}
                        className={`block w-full rounded px-2.5 py-1.5 text-left hover:bg-zinc-50 hover:text-zinc-900 ${
                          language === lang ? 'text-brand bg-brand/5 font-extrabold' : 'text-zinc-500'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Divider line */}
        <div className="border-t border-zinc-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-zinc-500">
          <span>&copy; {new Date().getFullYear()} Runnicle Performance. All rights reserved.</span>
          <div className="flex gap-6">
            <button className="hover:text-zinc-800 cursor-pointer">Sitemap</button>
            <button className="hover:text-zinc-800 cursor-pointer">Security</button>
          </div>
        </div>

      </div>
    </footer>
  );
};
export default Footer;
