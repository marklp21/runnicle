import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email) {
      setStatus('error');
      setMessage('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');

    // Simulate API request
    setTimeout(() => {
      setStatus('success');
      setMessage(`Welcome to the tribe! We've sent a starter kit to ${email}.`);
      setEmail('');
    }, 1200);
  };

  return (
    <section className="py-16 bg-zinc-50 text-zinc-800 border-y border-zinc-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          
          {/* Left side text */}
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
              Never Miss a Start Gun
            </h2>
            <p className="mt-3 text-sm text-zinc-500 font-medium leading-relaxed">
              Get early access to registrations, exclusive training plans, and gear drops straight to your inbox.
            </p>
          </div>

          {/* Right side form */}
          <div className="w-full lg:max-w-md">
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 text-emerald-800"
                >
                  <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0 text-emerald-600" />
                  <div>
                    <span className="text-sm font-bold text-emerald-900 block">Successfully Subscribed!</span>
                    <span className="text-xs text-emerald-700 mt-1 block">{message}</span>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  onSubmit={handleSubmit}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                  noValidate
                >
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (status === 'error') setStatus('idle');
                        }}
                        disabled={status === 'loading'}
                        placeholder="runner@example.com"
                        className="w-full rounded-full border border-zinc-200 bg-white px-5 py-3.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none shadow-sm transition-all duration-200"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="rounded-full bg-black px-8 py-3.5 text-xs font-black tracking-widest text-white hover:bg-zinc-900 active:scale-[0.98] transition-all duration-200 cursor-pointer uppercase flex-shrink-0 disabled:opacity-50"
                    >
                      {status === 'loading' ? 'Joining...' : 'Join Tribe'}
                    </button>
                  </div>

                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-xs font-bold text-red-500"
                    >
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span>{message}</span>
                    </motion.div>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
          
        </div>
      </div>
    </section>
  );
};
export default Newsletter;
