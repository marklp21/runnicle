import React, { useState } from 'react';
import { Mail, Phone, CheckCircle2, AlertCircle, Send, Share2, Camera, Users } from 'lucide-react';

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

    // Simulate API submission
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
      
      {/* Title */}
      <div className="border-b border-zinc-900 pb-6 mb-8 text-center max-w-3xl mx-auto">
        <span className="rounded-full bg-white/10 px-4 py-1 text-xs font-extrabold tracking-widest text-white uppercase">
          CONTACT US
        </span>
        <h1 className="mt-6 font-display text-4xl font-black leading-tight text-white sm:text-5xl">
          Get in Touch.
        </h1>
        <p className="mt-4 text-zinc-400 text-sm leading-relaxed">
          Have queries about race BIB pickup times, sponsor collaborations, coaching webinar plans, or e-commerce orders? Drop us a line.
        </p>
      </div>

      {/* Grid structure */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Column: Contact details and Map placeholder */}
        <div className="space-y-8">
          
          {/* Details list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Box 1 */}
            <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-5 space-y-3">
              <Mail className="h-5 w-5 text-zinc-500" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Email Address</h4>
                <a href="mailto:support@athlerun.com" className="text-zinc-400 text-xs font-semibold hover:text-white mt-1.5 block">
                  support@athlerun.com
                </a>
              </div>
            </div>

            {/* Box 2 */}
            <div className="rounded-xl border border-zinc-900 bg-zinc-950/20 p-5 space-y-3">
              <Phone className="h-5 w-5 text-zinc-500" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Phone Lines</h4>
                <a href="tel:+15550000000" className="text-zinc-400 text-xs font-semibold hover:text-white mt-1.5 block">
                  +1 (555) 000-0000
                </a>
              </div>
            </div>

          </div>


          {/* Social connections */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Social Channels</h4>
            <div className="flex gap-4">
              <a
                href="https://twitter.com/athlerun"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-900 bg-[#0c0c0d] hover:border-zinc-500 transition-colors text-white"
              >
                <Share2 className="h-4.5 w-4.5" />
              </a>
              <a
                href="https://instagram.com/athlerun"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-900 bg-[#0c0c0d] hover:border-zinc-500 transition-colors text-white"
              >
                <Camera className="h-4.5 w-4.5" />
              </a>
              <a
                href="https://strava.com/clubs/athlerun"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-900 bg-[#0c0c0d] hover:border-zinc-500 transition-colors text-white"
              >
                <Users className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Right Column: Inquiry Form */}
        <div className="rounded-xl border border-zinc-850 bg-[#0c0c0d]/60 p-6 md:p-8 shadow-2xl">
          
          <h3 className="font-display text-base font-black text-white uppercase tracking-wider border-b border-zinc-900 pb-3 mb-6">
            Send Inquiry
          </h3>

          {status === 'success' ? (
            <div className="text-center py-10 space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h4 className="text-white font-bold">Inquiry Sent!</h4>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed font-semibold">
                Thank you for contacting AthleRun. Our race organizers or coaching partners will respond directly within 24 business hours.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="rounded-md bg-white px-6 py-2.5 text-xs font-bold text-black hover:bg-zinc-200 transition-colors uppercase tracking-wider cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black text-white uppercase tracking-wider mb-2">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full rounded border border-zinc-800 bg-[#0c0c0c] px-4 py-3 text-xs text-white placeholder-zinc-700 focus:border-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-white uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="runner@example.com"
                    className="w-full rounded border border-zinc-800 bg-[#0c0c0c] px-4 py-3 text-xs text-white placeholder-zinc-700 focus:border-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-black text-white uppercase tracking-wider mb-2">Phone Number (Optional)</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full rounded border border-zinc-800 bg-[#0c0c0c] px-4 py-3 text-xs text-white placeholder-zinc-700 focus:border-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-black text-white uppercase tracking-wider mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Jersey sizing questions, bib claims..."
                  className="w-full rounded border border-zinc-800 bg-[#0c0c0c] px-4 py-3 text-xs text-white placeholder-zinc-700 focus:border-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-black text-white uppercase tracking-wider mb-2">Message</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message details here..."
                  className="w-full rounded border border-zinc-800 bg-[#0c0c0c] px-4 py-3 text-xs text-white placeholder-zinc-700 focus:border-white focus:outline-none resize-none"
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
                className="w-full rounded-md bg-white py-3.5 text-xs font-bold text-black hover:bg-zinc-200 active:scale-98 transition-all duration-200 uppercase tracking-wider cursor-pointer inline-flex items-center justify-center gap-2"
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
