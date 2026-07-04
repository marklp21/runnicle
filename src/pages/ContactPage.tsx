import React, { useState } from 'react';
import { Mail, Phone, CheckCircle2, AlertCircle, Send } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      
      const cleaned = value.replace(/(?!^\+)\D/g, '');
      const hasPlus = cleaned.startsWith('+');
      const digits = cleaned.replace(/\D/g, '');
      
      const maxDigits = digits.startsWith('63') ? 12 : digits.startsWith('09') ? 11 : 12;
      const capped = digits.slice(0, maxDigits);
      setFormData({ ...formData, [name]: hasPlus ? '+' + capped : capped });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (status === 'error') setStatus('idle');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;

    if (!name || !email || !subject || !message) {
      setStatus('error');
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');

    
    setTimeout(() => {
      setStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 1200);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {}
      <div className="border-b border-zinc-200 pb-6 mb-8 text-center max-w-3xl mx-auto">
        <span className="rounded-full bg-orange-50 px-4 py-1 text-xs font-extrabold tracking-widest text-orange-600 border border-orange-200 uppercase">
          CONTACT US
        </span>
        <h1 className="mt-6 font-display text-4xl font-black leading-tight text-zinc-900 sm:text-5xl">
          Get in Touch.
        </h1>
        <p className="mt-4 text-zinc-500 text-sm leading-relaxed">
          Have queries about race BIB pickup times, sponsor collaborations, coaching webinar plans, or e-commerce orders? Drop us a line.
        </p>
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {}
        <div className="space-y-8">
          
          {}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {}
            <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-3 shadow-sm">
              <Mail className="h-5 w-5 text-orange-500" />
              <div>
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Email Address</h4>
                <a href="mailto:support@runnicle.com" className="text-zinc-600 text-xs font-semibold hover:text-orange-500 mt-1.5 block">
                  support@runnicle.com
                </a>
              </div>
            </div>

            {}
            <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-3 shadow-sm">
              <Phone className="h-5 w-5 text-brand" />
              <div>
                <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Phone Lines</h4>
                <a href="tel:+63344350000" className="text-zinc-600 text-xs font-semibold hover:text-brand mt-1.5 block">
                  +63 (34) 435-0000
                </a>
              </div>
            </div>

          </div>

          {}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Social Channels</h4>
            <div className="flex gap-4">
              <a
                href="https://facebook.com/runnicle"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white hover:border-brand hover:text-brand transition-colors text-zinc-600 shadow-sm"
                aria-label="Facebook"
              >
                <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com/runnicle"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white hover:border-brand hover:text-brand transition-colors text-zinc-600 shadow-sm"
                aria-label="Instagram"
              >
                <svg className="h-4.5 w-4.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="mailto:contact@runnicle.ph"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white hover:border-brand hover:text-brand transition-colors text-zinc-600 shadow-sm"
                aria-label="Gmail"
              >
                <svg className="h-4.5 w-4.5 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </a>
            </div>
          </div>

        </div>

        {}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 md:p-8 shadow-sm">
          
          <h3 className="font-sans text-base font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-200 pb-3 mb-6">
            Send Inquiry
          </h3>

          {status === 'success' ? (
            <div className="text-center py-10 space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 border border-emerald-250 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h4 className="text-zinc-900 font-bold">Inquiry Sent!</h4>
              <p className="text-xs text-zinc-600 max-w-sm mx-auto leading-relaxed font-semibold">
                Thank you for contacting Runnicle. Our race organizers or coaching partners will respond directly within 24 business hours.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="rounded-md bg-orange-500 px-6 py-2.5 text-xs font-bold text-white hover:bg-orange-600 transition-colors uppercase tracking-wider cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black text-zinc-700 uppercase tracking-wider mb-2">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full rounded border border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-zinc-700 uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="runner@example.com"
                    className="w-full rounded border border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black text-zinc-700 uppercase tracking-wider mb-2">Phone Number (Optional)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="09171234567 or +639171234567"
                  maxLength={13}
                  className="w-full rounded border border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-900 placeholder-zinc-400 focus:border-brand focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-black text-zinc-700 uppercase tracking-wider mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Jersey sizing questions, bib claims..."
                  className="w-full rounded border border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-black text-zinc-700 uppercase tracking-wider mb-2">Message</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message details here..."
                  className="w-full rounded border border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none resize-none"
                />
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 text-xs font-bold text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full rounded-md bg-orange-500 py-3.5 text-xs font-bold text-white hover:bg-orange-600 active:scale-98 transition-all duration-200 uppercase tracking-wider cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-orange-500/10"
              >
                <Send className="h-4 w-4" />
                {status === 'loading' ? 'Sending...' : 'Send Inquiry'}
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
};
export default ContactPage;
