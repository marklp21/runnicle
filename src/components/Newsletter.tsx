import React, { useState } from 'react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <section className="bg-[#0B0B0B] py-16 sm:py-20 select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 max-w-6xl mx-auto">
          
          {/* Left Column: Heading and Subtitle */}
          <div className="text-left max-w-md">
            <h2 className="font-sans text-3xl sm:text-[38px] font-semibold tracking-tight text-white leading-none">
              Never Miss an <span className="font-serif italic text-[#FF4400] font-bold tracking-normal text-[1.15em] inline-block">Event</span>
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-white font-normal leading-relaxed opacity-90">
              Receive news, updates, and announcements on<br className="hidden sm:inline" /> upcoming events straight to your inbox.
            </p>
          </div>

          {/* Right Column: Input and Button */}
          <form 
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 w-full sm:max-w-md lg:max-w-[480px]"
          >
            <div className="relative flex-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="runner@example.com"
                className="w-full bg-transparent rounded-[6px] border border-zinc-700 px-4 py-3.5 text-xs text-white placeholder-zinc-500 focus:border-[#FF4400] focus:ring-1 focus:ring-[#FF4400] focus:outline-none transition-colors font-sans"
              />
              {status === 'success' && (
                <span className="absolute -bottom-5 left-1 text-[10px] text-emerald-500 font-bold font-sans">
                  Subscribed successfully!
                </span>
              )}
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="rounded-[6px] bg-[#FF4400] hover:bg-[#E63D00] text-white px-8 py-3.5 text-xs font-bold tracking-wider transition-all duration-150 active:scale-[0.98] cursor-pointer whitespace-nowrap select-none font-sans disabled:opacity-50"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>

        </div>
      </div>
    </section>
  );
};

export default Newsletter;
