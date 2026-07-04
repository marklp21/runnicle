import React, { useState } from 'react';
import { ArrowLeft, Printer, ClipboardCheck, ArrowRight, ShieldCheck } from 'lucide-react';
import { type EventItem } from '../data/mockData';

interface RegistrationPageProps {
  event: EventItem | null;
  defaultTitle?: string;
  onBack: () => void;
  onRegisterComplete?: (registration: any) => void;
}

export const RegistrationPage: React.FC<RegistrationPageProps> = ({
  event,
  defaultTitle = 'Early-Bird Registration',
  onBack,
  onRegisterComplete,
}) => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('GCash');
  const [referenceNumber, setReferenceNumber] = useState('');

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

  const [registeredBib, setRegisteredBib] = useState('');
  const [registeredName, setRegisteredName] = useState('');

  const eventTitle = event ? event.title : defaultTitle;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'phone' || name === 'emergencyPhone') {
      
      const cleaned = value.replace(/(?!^\+)\D/g, '');
      
      const hasPlus = cleaned.startsWith('+');
      const digits = cleaned.replace(/\D/g, '');
      
      const maxDigits = digits.startsWith('63') ? 12 : digits.startsWith('09') ? 11 : 12;
      const capped = digits.slice(0, maxDigits);
      setFormData((prev) => ({ ...prev, [name]: hasPlus ? '+' + capped : capped }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.waiver) return;

    
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {}
      <div className="max-w-md w-full mx-auto mb-10 font-mono text-[10px] sm:text-xs font-black tracking-widest text-zinc-500 uppercase select-none px-4">
        <div className="flex justify-between items-center relative">
          
          {}
          <div className="absolute top-[13px] left-6 right-6 h-[1px] bg-zinc-200 -z-0" />
          <div className="absolute top-[13px] left-6 h-[1px] bg-orange-500 transition-all duration-300 -z-0" style={{ width: step === 2 ? '50%' : step === 3 ? '100%' : '0%' }} />

          {}
          <div className={`flex flex-col items-center gap-1.5 z-10 transition-colors duration-200 ${step >= 1 ? 'text-orange-600 font-extrabold' : 'text-zinc-550'}`}>
            <div className={`h-6.5 w-6.5 rounded-full border flex items-center justify-center transition-all ${
              step === 1 ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/10' : step > 1 ? 'bg-zinc-100 border-zinc-300 text-zinc-900' : 'bg-white border-zinc-200 text-zinc-400'
            }`}>
              1
            </div>
            <span>REGISTRATION</span>
          </div>

          {}
          <div className={`flex flex-col items-center gap-1.5 z-10 transition-colors duration-200 ${step >= 2 ? 'text-orange-600 font-extrabold' : 'text-zinc-550'}`}>
            <div className={`h-6.5 w-6.5 rounded-full border flex items-center justify-center transition-all ${
              step === 2 ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/10' : step > 2 ? 'bg-zinc-100 border-zinc-300 text-zinc-900' : 'bg-white border-zinc-200 text-zinc-400'
            }`}>
              2
            </div>
            <span>PAYMENT</span>
          </div>

          {}
          <div className={`flex flex-col items-center gap-1.5 z-10 transition-colors duration-200 ${step >= 3 ? 'text-orange-600 font-extrabold' : 'text-zinc-550'}`}>
            <div className={`h-6.5 w-6.5 rounded-full border flex items-center justify-center transition-all ${
              step === 3 ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/10' : 'bg-white border-zinc-200 text-zinc-400'
            }`}>
              3
            </div>
            <span>FINISH</span>
          </div>

        </div>
      </div>

      {}
      {step === 3 ? (
        <div className="max-w-3xl mx-auto text-center py-10 space-y-8 animate-fade-in">
          
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-950/40 border border-emerald-500 text-emerald-400">
            <ShieldCheck className="h-8 w-8" />
          </div>
          
          <div>
            <h1 className="font-display text-4xl font-black text-white tracking-tight">
              Registration Confirmed!
            </h1>
            <p className="mt-3 text-zinc-500 text-sm max-w-md mx-auto leading-relaxed font-semibold">
              You are officially registered. Your race packet details and training links have been sent to <span className="text-zinc-900">{formData.email}</span>.
            </p>
          </div>

          {}
          <div className="relative mx-auto max-w-md rounded-2xl border border-zinc-200 bg-zinc-50 p-8 shadow-md overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-orange-500/5 blur-[50px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-orange-500/5 blur-[50px] pointer-events-none" />
            
            {}
            <div className="flex justify-between items-center border-b border-zinc-200 pb-5 mb-5 text-left">
              <div>
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Runnicle Race Pass</span>
                <span className="text-sm font-bold text-zinc-900 mt-1 block truncate max-w-[200px]">{eventTitle}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">Race Date</span>
                <span className="text-xs font-bold text-zinc-700 mt-1 block">{event ? event.date : 'Upcoming Season'}</span>
              </div>
            </div>

            {}
            <div className="grid grid-cols-2 gap-4 text-left border-b border-zinc-200 pb-5 mb-5 text-xs font-semibold text-zinc-500">
              <div>
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-0.5">Athlete</span>
                <span className="text-zinc-900 text-sm font-bold">{registeredName}</span>
              </div>
              <div>
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-0.5">Category</span>
                <span className="text-zinc-900">{formData.distance} Run</span>
              </div>
              <div>
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-0.5">Jersey Size</span>
                <span className="text-zinc-900">{formData.size}</span>
              </div>
              <div>
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-0.5">Emergency Contact</span>
                <span className="text-zinc-900 truncate block max-w-[140px]">{formData.emergencyContact || 'Not Specified'}</span>
              </div>
            </div>

            {}
            <div className="py-6 px-4 bg-white rounded-xl border border-zinc-200 shadow-sm text-center">
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider block">Official Runner Bib</span>
              <span className="font-display text-6xl font-black text-zinc-900 tracking-widest mt-1 block">
                #{registeredBib}
              </span>
            </div>

            {}
            <div className="absolute top-1/2 -left-2.5 h-5 w-5 rounded-full bg-white border-r border-zinc-200" />
            <div className="absolute top-1/2 -right-2.5 h-5 w-5 rounded-full bg-white border-l border-zinc-200" />
            
            {}
            <div className="mt-6 border-t border-dashed border-zinc-200 pt-6 flex flex-col items-center">
              <div className="h-10 w-full max-w-[200px] flex gap-[2px] items-center justify-center opacity-70">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-zinc-800 h-full"
                    style={{ width: `${Math.random() > 0.4 ? (Math.random() > 0.7 ? 4 : 2) : 1}px` }}
                  />
                ))}
              </div>
              <span className="text-[9px] font-black tracking-widest text-zinc-500 uppercase mt-2.5">
                RUN-R-TKT-{registeredBib}-{formData.distance}
              </span>
            </div>
          </div>

          {}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-sm mx-auto pt-4">
            <button
              onClick={handlePrint}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-6 py-3 text-xs font-bold text-zinc-700 hover:bg-zinc-50 transition-colors uppercase tracking-wider cursor-pointer shadow-sm"
            >
              <Printer className="h-4 w-4" />
              Print Pass
            </button>
            
            <button
              onClick={onBack}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-brand px-8 py-3 text-xs font-bold text-white hover:bg-brand-hover transition-colors uppercase tracking-wider cursor-pointer"
            >
              Return Home
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>
      ) : (
        <div className="space-y-8">
          {}
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-brand uppercase tracking-wider transition-colors cursor-pointer group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Cancel Registration
          </button>

          <div className="border-b border-zinc-200 pb-5">
            <h1 className="font-display text-4xl font-black text-zinc-900 tracking-tight">
              Athlete Registration
            </h1>
            <p className="mt-2 text-sm text-zinc-500 font-medium">
              Complete your profile info to verify timing chips and jersey prints for the <span className="text-zinc-800 font-semibold">{eventTitle}</span>.
            </p>
          </div>

          {}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            
            {step === 1 ? (
              
              <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
                
                {}
                <div className="space-y-4">
                  <h3 className="font-sans text-base font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-200 pb-2">1. Athlete Profile</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold text-zinc-700 uppercase tracking-wider mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Jane"
                        className="w-full rounded border border-zinc-200 bg-white px-4 py-3.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-brand focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-zinc-700 uppercase tracking-wider mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        className="w-full rounded border border-zinc-200 bg-white px-4 py-3.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-brand focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold text-zinc-700 uppercase tracking-wider mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="runner@example.com"
                        className="w-full rounded border border-zinc-200 bg-white px-4 py-3.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-brand focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-zinc-700 uppercase tracking-wider mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="09171234567 or +639171234567"
                        maxLength={13}
                        className="w-full rounded border border-zinc-200 bg-white px-4 py-3.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-brand focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-zinc-700 uppercase tracking-wider mb-2">Gender Identification</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full rounded border border-zinc-200 bg-white px-4 py-3.5 text-xs text-zinc-700 focus:border-brand focus:outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-Binary">Non-Binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                {}
                <div className="space-y-4 pt-4">
                  <h3 className="font-sans text-base font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-200 pb-2">2. Event Logistics</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold text-zinc-700 uppercase tracking-wider mb-2">Selected Distance</label>
                      <select
                        name="distance"
                        value={formData.distance}
                        onChange={handleChange}
                        className="w-full rounded border border-zinc-200 bg-white px-4 py-3.5 text-xs text-zinc-700 focus:border-brand focus:outline-none animate-none"
                      >
                        {event ? (
                          event.distances.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))
                        ) : (
                          <>
                            <option value="5K">5K Run</option>
                            <option value="10K">10K Run</option>
                            <option value="21K">Half Marathon (21K)</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-zinc-700 uppercase tracking-wider mb-2">Jersey Size (Tech Singlet)</label>
                      <select
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                        className="w-full rounded border border-zinc-200 bg-white px-4 py-3.5 text-xs text-zinc-700 focus:border-brand focus:outline-none"
                      >
                        <option value="Unisex - Small (S)">Unisex - Small (S)</option>
                        <option value="Unisex - Medium (M)">Unisex - Medium (M)</option>
                        <option value="Unisex - Large (L)">Unisex - Large (L)</option>
                        <option value="Unisex - Extra Large (XL)">Unisex - Extra Large (XL)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {}
                <div className="space-y-4 pt-4">
                  <h3 className="font-sans text-base font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-200 pb-2">3. Emergency Contact</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold text-zinc-700 uppercase tracking-wider mb-2">Emergency Name</label>
                      <input
                        type="text"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleChange}
                        placeholder="Jane Doe Sr."
                        className="w-full rounded border border-zinc-200 bg-white px-4 py-3.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-brand focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-zinc-700 uppercase tracking-wider mb-2">Emergency Phone</label>
                      <input
                        type="tel"
                        name="emergencyPhone"
                        value={formData.emergencyPhone}
                        onChange={handleChange}
                        placeholder="09187654321 or +639187654321"
                        maxLength={13}
                        className="w-full rounded border border-zinc-200 bg-white px-4 py-3.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-brand focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {}
                <div className="pt-4 space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer text-zinc-500 hover:text-brand transition-colors">
                    <input
                      type="checkbox"
                      name="waiver"
                      required
                      checked={formData.waiver}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 rounded border-zinc-300 bg-white text-brand focus:ring-0 cursor-pointer"
                    />
                    <span className="text-[11px] font-medium leading-relaxed">
                      I agree to the official Runnicle safety requirements, release waiver forms, and rules of conduct. I confirm that I am fit and sufficiently trained to perform in this competitive category.
                    </span>
                  </label>
                </div>

                {}
                <button
                  type="submit"
                  className="w-full rounded-md bg-brand py-4 text-sm font-mono font-black text-white hover:bg-brand-hover active:scale-98 transition-all duration-200 uppercase tracking-wider cursor-pointer mt-4 shadow-md shadow-brand/10"
                >
                  PROCEED TO PAYMENT {"[>]"}
                </button>
              </form>
            ) : (
              
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-sans text-base font-bold text-zinc-900 uppercase tracking-wider border-b border-zinc-200 pb-2">
                    2. Select Payment Method
                  </h3>
                  
                  {}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {}
                    <div
                      onClick={() => setPaymentMethod('GCash')}
                      className={`rounded-xl border p-4 flex items-center justify-between cursor-pointer select-none transition-all ${
                        paymentMethod === 'GCash' ? 'border-brand bg-brand/5' : 'border-zinc-200 bg-white hover:border-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-4 w-4 rounded-full border-4 flex items-center justify-center ${
                          paymentMethod === 'GCash' ? 'border-brand bg-brand' : 'border-zinc-300 bg-white'
                        }`} />
                        <span className="text-xs font-mono font-bold text-zinc-800 uppercase">GCASH (MOBILE WALLET)</span>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-zinc-400">₱0.00 FEE</span>
                    </div>

                    {}
                    <div
                      onClick={() => setPaymentMethod('Maya')}
                      className={`rounded-xl border p-4 flex items-center justify-between cursor-pointer select-none transition-all ${
                        paymentMethod === 'Maya' ? 'border-brand bg-brand/5' : 'border-zinc-200 bg-white hover:border-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-4 w-4 rounded-full border-4 flex items-center justify-center ${
                          paymentMethod === 'Maya' ? 'border-brand bg-brand' : 'border-zinc-300 bg-white'
                        }`} />
                        <span className="text-xs font-mono font-bold text-zinc-800 uppercase">MAYA (MOBILE WALLET)</span>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-zinc-400">₱0.00 FEE</span>
                    </div>

                    {}
                    <div
                      onClick={() => setPaymentMethod('Bank')}
                      className={`rounded-xl border p-4 flex items-center justify-between cursor-pointer select-none transition-all ${
                        paymentMethod === 'Bank' ? 'border-brand bg-brand/5' : 'border-zinc-200 bg-white hover:border-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-4 w-4 rounded-full border-4 flex items-center justify-center ${
                          paymentMethod === 'Bank' ? 'border-brand bg-brand' : 'border-zinc-300 bg-white'
                        }`} />
                        <span className="text-xs font-mono font-bold text-zinc-800 uppercase">BANK TRANSFER (BDO/BPI)</span>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-zinc-400">₱0.00 FEE</span>
                    </div>

                    {}
                    <div
                      onClick={() => setPaymentMethod('Card')}
                      className={`rounded-xl border p-4 flex items-center justify-between cursor-pointer select-none transition-all ${
                        paymentMethod === 'Card' ? 'border-brand bg-brand/5' : 'border-zinc-200 bg-white hover:border-zinc-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-4 w-4 rounded-full border-4 flex items-center justify-center ${
                          paymentMethod === 'Card' ? 'border-brand bg-brand' : 'border-zinc-300 bg-white'
                        }`} />
                        <span className="text-xs font-mono font-bold text-zinc-800 uppercase">CREDIT / DEBIT CARD</span>
                      </div>
                      <span className="text-[9px] font-mono font-bold text-zinc-400">₱0.00 FEE</span>
                    </div>
                  </div>

                  {}
                  <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 space-y-4 mt-6">
                    {paymentMethod === 'GCash' && (
                      <div className="space-y-3 font-mono text-xs text-zinc-600 leading-relaxed uppercase">
                        <p className="font-extrabold text-zinc-950">GCash Payment Instructions:</p>
                        <p>1. Send amount {event ? event.details.fee : '₱1,250.00'} to GCash number: <span className="text-brand font-black">0917 123 4567</span> (Runnicle timing Corp).</p>
                        <p>2. Enter your 13-digit GCash Transaction Reference number below to verify your entry slot.</p>
                      </div>
                    )}

                    {paymentMethod === 'Maya' && (
                      <div className="space-y-3 font-mono text-xs text-zinc-600 leading-relaxed uppercase">
                        <p className="font-extrabold text-zinc-950">Maya Payment Instructions:</p>
                        <p>1. Send amount {event ? event.details.fee : '₱1,250.00'} to merchant code: <span className="text-brand font-black">@runnicle.ph</span> or via QR code scanning.</p>
                        <p>2. Enter your transaction reference number below to verify your entry slot.</p>
                      </div>
                    )}

                    {paymentMethod === 'Bank' && (
                      <div className="space-y-3 font-mono text-xs text-zinc-600 leading-relaxed uppercase">
                        <p className="font-extrabold text-zinc-950">Bank Deposit Instructions:</p>
                        <p>1. Deposit amount {event ? event.details.fee : '₱1,250.00'} to BDO Account: <span className="text-brand font-black">0012-3456-7890</span> (Runnicle Athletics Corp).</p>
                        <p>2. Enter your deposit transaction reference ID below.</p>
                      </div>
                    )}

                    {paymentMethod === 'Card' && (
                      <div className="space-y-4">
                        <p className="font-mono text-xs font-extrabold text-zinc-950 uppercase">Credit / Debit Card details:</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 font-mono">Card Number</label>
                            <input
                              type="text"
                              maxLength={16}
                              placeholder="4111 2222 3333 4444"
                              className="w-full rounded border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:border-brand focus:outline-none font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 font-mono">Expiry Date</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              maxLength={5}
                              className="w-full rounded border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:border-brand focus:outline-none font-mono text-center"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {}
                    {paymentMethod !== 'Card' && (
                      <div className="mt-4 pt-2">
                        <label className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 font-mono">Reference Number</label>
                        <input
                          type="text"
                          required
                          value={referenceNumber}
                          onChange={(e) => setReferenceNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder="Reference Number (e.g. 1234567890123)"
                          className="w-full rounded border border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-900 placeholder-zinc-400 focus:border-brand focus:outline-none font-mono"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 rounded-full border border-zinc-300 bg-white py-3 text-center text-[10px] font-mono font-black text-zinc-800 hover:bg-zinc-50 transition-colors uppercase tracking-widest cursor-pointer"
                  >
                    {"[ Back to Form ]"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const randomBib = Math.floor(100 + Math.random() * 900).toString();
                      setRegisteredName(`${formData.firstName} ${formData.lastName}`);
                      setRegisteredBib(randomBib);
                      
                      if (onRegisterComplete) {
                        onRegisterComplete({
                          firstName: formData.firstName,
                          lastName: formData.lastName,
                          email: formData.email,
                          phone: formData.phone,
                          gender: formData.gender,
                          distance: formData.distance,
                          size: formData.size,
                          emergencyContact: formData.emergencyContact,
                          emergencyPhone: formData.emergencyPhone,
                          eventTitle: eventTitle,
                          paymentMethod: paymentMethod,
                          referenceNumber: referenceNumber || 'CARD-PAID',
                          registeredBib: randomBib
                        });
                      }

                      setStep(3);
                      window.scrollTo({ top: 0, behavior: 'instant' });
                    }}
                    className="flex-1 rounded-full bg-brand hover:bg-brand-hover py-3 text-center text-[10px] font-mono font-black text-white transition-colors uppercase tracking-widest cursor-pointer shadow-md shadow-brand/10"
                  >
                    Pay & Complete {"[>]"}
                  </button>
                </div>
              </div>
            )}

            {}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm space-y-6 lg:sticky lg:top-24">
              <h3 className="font-sans text-base font-bold text-zinc-900 tracking-tight uppercase border-b border-zinc-200 pb-4">
                Registration Summary
              </h3>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Selected Event</span>
                  <span className="text-sm font-bold text-zinc-900 mt-1.5 block">{eventTitle}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Location</span>
                    <span className="text-zinc-700 mt-1 block">{event ? event.location : 'Bacolod City'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Race Date</span>
                    <span className="text-zinc-700 mt-1 block">{event ? event.date : 'Upcoming Season'}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-200 pt-6 space-y-3 text-xs font-semibold text-zinc-500">
                <div className="flex justify-between">
                  <span>Standard Entry Fee</span>
                  <span className="text-zinc-900">{event ? event.details.fee : '₱1,250.00'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Athlete Insurance</span>
                  <span className="text-zinc-900">Included</span>
                </div>
                <div className="flex justify-between">
                  <span>RFID Timing Tag</span>
                  <span className="text-zinc-900">Included</span>
                </div>
                <div className="border-t border-zinc-200 pt-4 flex justify-between text-sm font-bold">
                  <span className="text-zinc-900">Total Charge</span>
                  <span className="text-brand">{event ? event.details.fee : '₱1,250.00'}</span>
                </div>
              </div>

              <div className="rounded border border-zinc-200 bg-zinc-50 p-4 flex gap-2.5 text-[10px] text-zinc-500 leading-relaxed font-semibold">
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
