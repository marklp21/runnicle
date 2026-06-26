import React, { useState } from 'react';
import { Share2, Camera, Users, ChevronDown } from 'lucide-react';


interface FooterProps {
  onPlatformClick: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onPlatformClick }) => {
  const [region, setRegion] = useState('United States');
  const [language, setLanguage] = useState('English');
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const regions = ['United States', 'United Kingdom', 'Germany', 'Japan', 'Philippines'];
  const languages = ['English', 'Español', 'Deutsch', '日本語', 'Filipino'];

  return (
    <footer className="bg-black text-zinc-500 pt-16 pb-8 border-t border-zinc-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 sm:grid-cols-2 mb-16">
          
          {/* Brand Info */}
          <div className="md:col-span-1">
            <span className="font-display text-2xl font-black tracking-tight text-white block">
              Athle<span className="text-zinc-400">Run</span>
            </span>
            <p className="mt-4 text-xs font-semibold text-zinc-500 leading-relaxed max-w-[240px]">
              Elevating the human pace through technical precision and community focus. Founded for those who never stop moving.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-5">
              Platform
            </h4>
            <ul className="space-y-3 text-xs font-bold text-zinc-500">
              {['Event Calendar', 'Leaderboards'].map((item) => (
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

          {/* Legal Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-5">
              Legal
            </h4>
            <ul className="space-y-3 text-xs font-bold text-zinc-500">
              {['Privacy Policy', 'Terms of Service', 'Cookie Settings', 'Contact Us'].map((item) => (
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

          {/* Social Icons & Localization */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-5">
              Social
            </h4>
            
            {/* Social Icons Row */}
            <div className="flex gap-4 mb-8">
              <a
                href="https://twitter.com/athlerun"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-[#0d0d0d] hover:border-zinc-500 hover:bg-zinc-900 transition-all duration-200 text-white cursor-pointer"
                aria-label="Share"
              >
                <Share2 className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com/athlerun"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-[#0d0d0d] hover:border-zinc-500 hover:bg-zinc-900 transition-all duration-200 text-white cursor-pointer"
                aria-label="Instagram"
              >
                <Camera className="h-4 w-4" />
              </a>
              <a
                href="https://strava.com/clubs/athlerun"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-800 bg-[#0d0d0d] hover:border-zinc-500 hover:bg-zinc-900 transition-all duration-200 text-white cursor-pointer"
                aria-label="Community"
              >
                <Users className="h-4 w-4" />
              </a>
            </div>

            {/* Region / Language Dropdowns */}
            <div className="space-y-3.5 text-[11px] font-bold">
              {/* Region Selector */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowRegionDropdown(!showRegionDropdown);
                    setShowLanguageDropdown(false);
                  }}
                  className="flex items-center gap-1.5 hover:text-white transition-colors duration-200 cursor-pointer text-left"
                >
                  <span>Region: {region}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
                {showRegionDropdown && (
                  <div className="absolute bottom-6 left-0 z-30 w-36 rounded-md border border-zinc-800 bg-[#0d0d0d] p-1.5 shadow-xl">
                    {regions.map((reg) => (
                      <button
                        key={reg}
                        onClick={() => {
                          setRegion(reg);
                          setShowRegionDropdown(false);
                        }}
                        className={`block w-full rounded px-2.5 py-1.5 text-left hover:bg-zinc-900 hover:text-white ${
                          region === reg ? 'text-white bg-zinc-900/50' : 'text-zinc-500'
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
                  className="flex items-center gap-1.5 hover:text-white transition-colors duration-200 cursor-pointer text-left"
                >
                  <span>Language: {language}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
                {showLanguageDropdown && (
                  <div className="absolute bottom-6 left-0 z-30 w-32 rounded-md border border-zinc-800 bg-[#0d0d0d] p-1.5 shadow-xl">
                    {languages.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          setLanguage(lang);
                          setShowLanguageDropdown(false);
                        }}
                        className={`block w-full rounded px-2.5 py-1.5 text-left hover:bg-zinc-900 hover:text-white ${
                          language === lang ? 'text-white bg-zinc-900/50' : 'text-zinc-500'
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
        <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-zinc-600">
          <span>&copy; {new Date().getFullYear()} AthleRun Performance. All rights reserved.</span>
          <div className="flex gap-6">
            <button className="hover:text-zinc-400 cursor-pointer">Sitemap</button>
            <button className="hover:text-zinc-400 cursor-pointer">Security</button>
          </div>
        </div>

      </div>
    </footer>
  );
};
export default Footer;
