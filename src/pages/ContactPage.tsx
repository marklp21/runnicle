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
      
      <div className="pb-2 mb-12 text-center max-w-3xl mx-auto">
        <span className="inline-block rounded-full border border-[#FF4400] px-4 py-1 text-[10px] font-mono font-bold tracking-widest text-[#FF4400] uppercase bg-transparent">
          CONTACT US
        </span>
        <h1 className="mt-6 font-sans text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          Get In <span className="font-serif italic text-[#FF4400] font-black">Touch</span>
        </h1>
        <p className="mt-4 text-black text-sm sm:text-base leading-relaxed">
          Have any questions for us? Drop us a line.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
        
        {/* Left Column - Form Card */}
        <div className="bg-white border border-[#B0B0B0] rounded-[7px] p-6 sm:p-8">
          <h3 className="text-lg font-bold text-zinc-900 mb-8">SEND INQUIRY</h3>
          
          {status === 'success' ? (
            <div className="text-center py-10 space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 border border-emerald-250 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h4 className="text-zinc-900 font-bold">Inquiry Sent!</h4>
              <p className="text-xs text-zinc-650 max-w-sm mx-auto leading-relaxed font-semibold">
                Thank you for contacting Runnicle. Our race organizers or coaching partners will respond directly within 24 business hours.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="font-mono rounded-[4px] bg-[#FF4400] hover:bg-[#E63D00] px-6 py-2.5 text-xs font-bold text-white transition-colors uppercase tracking-wider cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold tracking-widest text-zinc-900 uppercase mb-2">FULL NAME</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Juan De la Cruz" 
                    className="w-full bg-transparent border border-[#B0B0B0] rounded-[4px] py-3 px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#FF4400] focus:ring-1 focus:ring-[#FF4400] focus:outline-none transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest text-zinc-900 uppercase mb-2">EMAIL ADDRESS</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jundelacruz@gmail.com" 
                    className="w-full bg-transparent border border-[#B0B0B0] rounded-[4px] py-3 px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#FF4400] focus:ring-1 focus:ring-[#FF4400] focus:outline-none transition-colors" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-zinc-900 uppercase mb-2">PHONE NUMBER</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="091234567891 or +639171234567" 
                  className="w-full bg-transparent border border-[#B0B0B0] rounded-[4px] py-3 px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#FF4400] focus:ring-1 focus:ring-[#FF4400] focus:outline-none transition-colors" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-zinc-900 uppercase mb-2">SUBJECT</label>
                <input 
                  type="text" 
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g Singlets sizing questions, racing details, bib claims..." 
                  className="w-full bg-transparent border border-[#B0B0B0] rounded-[4px] py-3 px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#FF4400] focus:ring-1 focus:ring-[#FF4400] focus:outline-none transition-colors" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-zinc-900 uppercase mb-2">MESSAGE</label>
                <textarea 
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message details here..." 
                  rows={5} 
                  className="w-full bg-transparent border border-[#B0B0B0] rounded-[4px] py-3 px-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#FF4400] focus:ring-1 focus:ring-[#FF4400] focus:outline-none transition-colors resize-none"
                ></textarea>
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
                className="w-full bg-[#FF4400] hover:bg-[#E63D00] text-white text-[10px] font-mono font-semibold tracking-widest uppercase py-4 transition-colors flex items-center justify-center gap-2 rounded-[4px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" /> {status === 'loading' ? 'SENDING...' : 'SEND INQUIRY'}
              </button>
            </form>
          )}
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

          <div className="pt-2 text-left">
            <h4 className="text-xs font-bold tracking-widest text-zinc-900 uppercase mb-4">SOCIAL CHANNELS</h4>
            <div className="flex items-center gap-4 text-zinc-600">
              <a href="https://instagram.com/runnicle" target="_blank" rel="noreferrer" className="hover:text-[#FF4400] transition-colors p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://facebook.com/runnicle" target="_blank" rel="noreferrer" className="hover:text-[#FF4400] transition-colors p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactPage;
