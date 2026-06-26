import React, { useState } from 'react';
import { ArrowLeft, Printer, ClipboardCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import { type EventItem } from '../data/mockData';

interface RegistrationPageProps {
  event: EventItem | null;
  defaultTitle?: string;
  onBack: () => void;
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({
  event,
  defaultTitle = 'Early-Bird Registration',
  onBack,
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'Male',
    distance: event ? event.distances[0] : '10K',
    size: 'Unisex - Medium (M)',
    emergencyContact: '',
    emergencyPhone: '',
    waiver: false,
  });

  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeredBib, setRegisteredBib] = useState('');
  const [registeredName, setRegisteredName] = useState('');

  const eventTitle = event ? event.title : defaultTitle;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.waiver) return;

    // Generate random BIB
    const randomBib = Math.floor(100 + Math.random() * 900).toString();
    setRegisteredName(`${formData.firstName} ${formData.lastName}`);
    setRegisteredBib(randomBib);
    setRegistrationSuccess(true);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Mock Printing
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Dynamic Render based on success */}
      {registrationSuccess ? (
        <div className="max-w-3xl mx-auto text-center py-10 space-y-8 animate-fade-in">
          
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-950/40 border border-emerald-500 text-emerald-400">
            <ShieldCheck className="h-8 w-8" />
          </div>
          
          <div>
            <h1 className="font-display text-4xl font-black text-white tracking-tight">
              Registration Confirmed!
            </h1>
            <p className="mt-3 text-zinc-400 text-sm max-w-md mx-auto leading-relaxed font-semibold">
              You are officially registered. Your race packet details and training links have been sent to <span className="text-white">{formData.email}</span>.
            </p>
          </div>

          {/* Graphic Ticket BIB Display */}
          <div className="relative mx-auto max-w-md rounded-2xl border border-zinc-800 bg-[#0d0d0d] p-8 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-white/2 blur-[50px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-white/2 blur-[50px] pointer-events-none" />
            
            {/* Header logos */}
            <div className="flex justify-between items-center border-b border-zinc-900 pb-5 mb-5 text-left">
              <div>
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">AthleRun Race Pass</span>
                <span className="text-sm font-bold text-white mt-1 block truncate max-w-[200px]">{eventTitle}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Race Date</span>
                <span className="text-xs font-bold text-zinc-300 mt-1 block">{event ? event.date : 'Upcoming Season'}</span>
              </div>
            </div>

            {/* Athlete Bio details */}
            <div className="grid grid-cols-2 gap-4 text-left border-b border-zinc-900 pb-5 mb-5 text-xs font-semibold text-zinc-400">
              <div>
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-0.5">Athlete</span>
                <span className="text-white text-sm font-bold">{registeredName}</span>
              </div>
              <div>
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-0.5">Category</span>
                <span className="text-white">{formData.distance} Run</span>
              </div>
              <div>
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-0.5">Jersey Size</span>
                <span className="text-white">{formData.size}</span>
              </div>
              <div>
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-0.5">Emergency Contact</span>
                <span className="text-white truncate block max-w-[140px]">{formData.emergencyContact || 'Not Specified'}</span>
              </div>
            </div>

            {/* Large BIB Number Box */}
            <div className="py-6 px-4 bg-zinc-950 rounded-xl border border-zinc-900 shadow-inner text-center">
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-wider block">Official Runner Bib</span>
              <span className="font-display text-6xl font-black text-white tracking-widest mt-1 block">
                #{registeredBib}
              </span>
            </div>

            {/* Decorative cutouts */}
            <div className="absolute top-1/2 -left-2.5 h-5 w-5 rounded-full bg-[#080808] border-r border-zinc-800" />
            <div className="absolute top-1/2 -right-2.5 h-5 w-5 rounded-full bg-[#080808] border-l border-zinc-800" />
            
            {/* Barcode Graphic */}
            <div className="mt-6 border-t border-dashed border-zinc-800 pt-6 flex flex-col items-center">
              <div className="h-10 w-full max-w-[200px] flex gap-[2px] items-center justify-center opacity-40">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white h-full"
                    style={{ width: `${Math.random() > 0.4 ? (Math.random() > 0.7 ? 4 : 2) : 1}px` }}
                  />
                ))}
              </div>
              <span className="text-[9px] font-black tracking-widest text-zinc-600 uppercase mt-2.5">
                ATH-R-TKT-{registeredBib}-{formData.distance}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-sm mx-auto pt-4">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md border border-zinc-800 bg-zinc-950 px-6 py-3 text-xs font-bold text-white hover:bg-zinc-900 transition-colors uppercase tracking-wider cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              Print Pass
            </button>
            
            <button
              onClick={onBack}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-white px-8 py-3 text-xs font-bold text-black hover:bg-zinc-200 transition-colors uppercase tracking-wider cursor-pointer"
            >
              Return Home
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      ) : (
        <div className="space-y-8">
          {/* Header */}
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors cursor-pointer group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Cancel Registration
          </button>

          <div className="border-b border-zinc-900 pb-5">
            <h1 className="font-display text-4xl font-black text-white tracking-tight">
              Athlete Registration
            </h1>
            <p className="mt-2 text-sm text-zinc-500 font-medium">
              Complete your profile info to verify timing chips and jersey prints for the <span className="text-zinc-300 font-semibold">{eventTitle}</span>.
            </p>
          </div>

          {/* Checkout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            
            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
              
              {/* Personal Details */}
              <div className="space-y-4">
                <h3 className="font-display text-base font-black text-white uppercase tracking-wider border-b border-zinc-900 pb-2">1. Athlete Profile</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-white uppercase tracking-wider mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Jane"
                      className="w-full rounded border border-zinc-800 bg-[#0c0c0c] px-4 py-3.5 text-xs text-white placeholder-zinc-700 focus:border-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-white uppercase tracking-wider mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="w-full rounded border border-zinc-800 bg-[#0c0c0c] px-4 py-3.5 text-xs text-white placeholder-zinc-700 focus:border-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-white uppercase tracking-wider mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="runner@example.com"
                      className="w-full rounded border border-zinc-800 bg-[#0c0c0c] px-4 py-3.5 text-xs text-white placeholder-zinc-700 focus:border-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-white uppercase tracking-wider mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded border border-zinc-800 bg-[#0c0c0c] px-4 py-3.5 text-xs text-white placeholder-zinc-700 focus:border-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-white uppercase tracking-wider mb-2">Gender Identification</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full rounded border border-zinc-800 bg-[#0c0c0c] px-4 py-3.5 text-xs text-zinc-400 focus:border-white focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Race Specifications */}
              <div className="space-y-4 pt-4">
                <h3 className="font-display text-base font-black text-white uppercase tracking-wider border-b border-zinc-900 pb-2">2. Event Details</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-white uppercase tracking-wider mb-2">Distance Category</label>
                    <select
                      name="distance"
                      value={formData.distance}
                      onChange={handleChange}
                      className="w-full rounded border border-zinc-800 bg-[#0c0c0c] px-4 py-3.5 text-xs text-zinc-400 focus:border-white focus:outline-none"
                    >
                      {event ? (
                        event.distances.map((dist) => (
                          <option key={dist} value={dist}>{dist} Challenge</option>
                        ))
                      ) : (
                        <>
                          <option value="5K">5K Fun Run</option>
                          <option value="10K">10K Standard</option>
                          <option value="Half Marathon">21K Half Marathon</option>
                          <option value="Full Marathon">42K Full Marathon</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-white uppercase tracking-wider mb-2">Jersey Size (Tech Singlet)</label>
                    <select
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      className="w-full rounded border border-zinc-800 bg-[#0c0c0c] px-4 py-3.5 text-xs text-zinc-400 focus:border-white focus:outline-none"
                    >
                      <option value="Unisex - Small (S)">Unisex - Small (S)</option>
                      <option value="Unisex - Medium (M)">Unisex - Medium (M)</option>
                      <option value="Unisex - Large (L)">Unisex - Large (L)</option>
                      <option value="Unisex - Extra Large (XL)">Unisex - Extra Large (XL)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-4 pt-4">
                <h3 className="font-display text-base font-black text-white uppercase tracking-wider border-b border-zinc-900 pb-2">3. Emergency Contact</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-white uppercase tracking-wider mb-2">Emergency Name</label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      placeholder="Jane Doe Sr."
                      className="w-full rounded border border-zinc-800 bg-[#0c0c0c] px-4 py-3.5 text-xs text-white placeholder-zinc-700 focus:border-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-white uppercase tracking-wider mb-2">Emergency Phone</label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleChange}
                      placeholder="+1 (555) 999-9999"
                      className="w-full rounded border border-zinc-800 bg-[#0c0c0c] px-4 py-3.5 text-xs text-white placeholder-zinc-700 focus:border-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Waiver Agreement */}
              <div className="pt-4 space-y-4">
                <label className="flex items-start gap-3 cursor-pointer text-zinc-500 hover:text-zinc-400 transition-colors">
                  <input
                    type="checkbox"
                    name="waiver"
                    required
                    checked={formData.waiver}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 rounded border-zinc-800 bg-[#0c0c0c] text-white focus:ring-0 cursor-pointer"
                  />
                  <span className="text-[11px] font-medium leading-relaxed">
                    I agree to the official AthleRun safety requirements, release waiver forms, and rules of conduct. I confirm that I am fit and sufficiently trained to perform in this competitive category.
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full rounded-md bg-white py-4 text-sm font-black text-black hover:bg-zinc-200 active:scale-98 transition-all duration-200 uppercase tracking-wider cursor-pointer mt-4"
              >
                Confirm Registration
              </button>
            </form>

            {/* Right Column: Order Details */}
            <div className="rounded-xl border border-zinc-800 bg-[#0c0c0c] p-6 shadow-2xl space-y-6 lg:sticky lg:top-24">
              <h3 className="font-display text-base font-black text-white tracking-tight uppercase border-b border-zinc-950 pb-4">
                Registration Summary
              </h3>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Selected Event</span>
                  <span className="text-sm font-bold text-white mt-1.5 block">{eventTitle}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div>
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Location</span>
                    <span className="text-zinc-300 mt-1 block">{event ? event.location : 'Bacolod City'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Race Date</span>
                    <span className="text-zinc-300 mt-1 block">{event ? event.date : 'Upcoming Season'}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-900 pt-6 space-y-3 text-xs font-semibold text-zinc-400">
                <div className="flex justify-between">
                  <span>Standard Entry Fee</span>
                  <span className="text-white">{event ? event.details.fee : '₱1,250.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Athlete Insurance</span>
                  <span className="text-white">Included</span>
                </div>
                <div className="flex justify-between">
                  <span>RFID Timing Tag</span>
                  <span className="text-white">Included</span>
                </div>
                <div className="border-t border-zinc-900 pt-4 flex justify-between text-sm font-bold">
                  <span className="text-white">Total Charge</span>
                  <span className="text-white">{event ? event.details.fee : '₱1,250.00'}</span>
                </div>
              </div>

              <div className="rounded border border-zinc-800 bg-zinc-950 p-4 flex gap-2.5 text-[10px] text-zinc-500 leading-relaxed font-semibold">
                <ClipboardCheck className="h-4 w-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                <span>You will receive an invoice packet and event countdown schedules directly to your registered email address immediately.</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
export default RegistrationPage;
