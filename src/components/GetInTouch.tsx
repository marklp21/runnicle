import React from 'react';
import { Mail, Phone, Send } from 'lucide-react';

export const GetInTouch: React.FC = () => {
  return (
    <section className="py-20 bg-[#F9FAFB]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
          
          {/* Left Column - Form Card */}
          <div className="bg-white border border-[#B0B0B0] rounded-[7px] p-6 sm:p-8">
            <h3 className="text-lg font-bold text-zinc-900 mb-8">SEND INQUIRY</h3>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold tracking-widest text-zinc-900 uppercase mb-2">FULL NAME</label>
                  <input 
                    type="text" 
                    placeholder="Juan De la Cruz" 
                    className="w-full bg-transparent border border-[#B0B0B0] rounded-[4px] py-3 px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#FF4400] focus:ring-1 focus:ring-[#FF4400] focus:outline-none transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest text-zinc-900 uppercase mb-2">EMAIL ADDRESS</label>
                  <input 
                    type="email" 
                    placeholder="jundelacruz@gmail.com" 
                    className="w-full bg-transparent border border-[#B0B0B0] rounded-[4px] py-3 px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#FF4400] focus:ring-1 focus:ring-[#FF4400] focus:outline-none transition-colors" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-zinc-900 uppercase mb-2">PHONE NUMBER</label>
                <input 
                  type="tel" 
                  placeholder="091234567891 or +639171234567" 
                  className="w-full bg-transparent border border-[#B0B0B0] rounded-[4px] py-3 px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#FF4400] focus:ring-1 focus:ring-[#FF4400] focus:outline-none transition-colors" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-zinc-900 uppercase mb-2">SUBJECT</label>
                <input 
                  type="text" 
                  placeholder="e.g Singlets sizing questions, racing details, bib claims..." 
                  className="w-full bg-transparent border border-[#B0B0B0] rounded-[4px] py-3 px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#FF4400] focus:ring-1 focus:ring-[#FF4400] focus:outline-none transition-colors" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-zinc-900 uppercase mb-2">MESSAGE</label>
                <textarea 
                  placeholder="Type your message details here..." 
                  rows={5} 
                  className="w-full bg-transparent border border-[#B0B0B0] rounded-[4px] py-3 px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#FF4400] focus:ring-1 focus:ring-[#FF4400] focus:outline-none transition-colors resize-none"
                ></textarea>
              </div>

              <button 
                type="button" 
                className="w-full bg-[#FF4400] hover:bg-[#E63D00] text-white text-[10px] font-semibold tracking-widest uppercase py-4 transition-colors flex items-center justify-center gap-2 rounded-[4px]"
              >
                <Send className="w-4 h-4" /> SEND INQUIRY
              </button>
            </form>
          </div>

          {/* Right Column - Contact Info */}
          <div className="flex flex-col gap-6">
            
            <div className="bg-white border border-[#B0B0B0] rounded-[7px] p-6">
              <Mail className="text-[#FF4400] w-6 h-6 mb-4" />
              <h4 className="text-xs font-bold tracking-widest text-zinc-900 uppercase mb-2">EMAIL ADDRESS</h4>
              <p className="text-sm text-zinc-500">runnicle@gmail.com</p>
            </div>

            <div className="bg-white border border-[#B0B0B0] rounded-[7px] p-6">
              <Phone className="text-[#FF4400] w-6 h-6 mb-4" />
              <h4 className="text-xs font-bold tracking-widest text-zinc-900 uppercase mb-2">PHONE NUMBER</h4>
              <p className="text-sm text-zinc-500">+63 (34) 435-0000</p>
            </div>

            <div className="pt-2">
              <h4 className="text-xs font-bold tracking-widest text-zinc-900 uppercase mb-4">SOCIAL CHANNELS</h4>
              <div className="flex items-center gap-4 text-zinc-600">
                <a href="#" className="hover:text-[#FF4400] transition-colors p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a href="#" className="hover:text-[#FF4400] transition-colors p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default GetInTouch;
