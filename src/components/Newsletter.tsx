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
    <section className="py-12 bg-[#1b1b1c] border-t border-zinc-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 py-6">
          
          {/* Left side text */}
          <div className="max-w-xl">
            <h2 className="font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
              Never Miss a Start Gun
            </h2>
            <p className="mt-3 text-sm text-zinc-400 font-medium leading-relaxed">
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
                  className="flex items-start gap-3 rounded-lg border border-emerald-950 bg-emerald-950/20 p-4 text-emerald-400"
                >
                  <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-bold text-white block">Successfully Subscribed!</span>
                    <span className="text-xs text-zinc-400 mt-1 block">{message}</span>
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
                        className="w-full rounded-md border border-zinc-800 bg-[#121212]/80 px-4 py-3.5 text-sm text-white placeholder-zinc-600 focus:border-white focus:outline-none transition-colors duration-200"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="rounded-md bg-white px-6 py-3.5 text-xs font-bold text-black hover:bg-zinc-200 active:scale-[0.98] transition-all duration-200 cursor-pointer uppercase tracking-wider flex-shrink-0 disabled:opacity-50"
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
                      <AlertCircle className="h-4 w-4" />
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
