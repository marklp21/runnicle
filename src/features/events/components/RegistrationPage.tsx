import React, { useState, useMemo } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { type EventItem } from '@/types';
import { getNextBibNumber } from '@/utils/bibHelper';

interface RegistrationPageProps {
  event: EventItem | null;
  allEvents: EventItem[];
  defaultTitle?: string;
  onBack: () => void;
  onRegisterComplete?: (registration: any) => void;
  registrations?: any[];
}

const getBaseDistanceFee = (distance: string): { fee: number; inclusions: string[] } => {
  const normalized = distance.toUpperCase();
  if (normalized.includes('3K')) {
    return { fee: 500, inclusions: ['Runnicle Dry-Fity Singlet', 'Race Bib'] };
  }
  if (normalized.includes('5K')) {
    return { fee: 750, inclusions: ['Runnicle Dry-Fity Singlet', 'Race Bib', 'RFID Timing Tag'] };
  }
  if (normalized.includes('10K')) {
    return { fee: 1000, inclusions: ['Runnicle Dry-Fity Singlet', 'Race Bib', 'RFID Timing Tag', 'Finisher Medal'] };
  }
  if (normalized.includes('21K') || normalized.includes('HALF')) {
    return { fee: 1500, inclusions: ['Runnicle Premium Singlet', 'Race Bib', 'RFID Timing Tag', 'Finisher Medal', 'Finisher Shirt'] };
  }
  if (normalized.includes('42K') || normalized.includes('MARATHON')) {
    return { fee: 2500, inclusions: ['Runnicle Elite Singlet', 'Race Bib', 'RFID Timing Tag', 'Finisher Medal', 'Finisher Shirt', 'Finisher Trophy'] };
  }
  return { fee: 500, inclusions: ['Runnicle Dry-Fity Singlet', 'Race Bib'] };
};

const SINGLET_SIZES = ['None', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

export const RegistrationPage: React.FC<RegistrationPageProps> = ({
  event,
  allEvents,
  defaultTitle = 'MegaWorld Fun Run',
  onBack,
  onRegisterComplete,
  registrations = []
}) => {
  const selectedEventItem = useMemo(() => {
    if (event) {
      return allEvents.find(e => e.id === event.id) || event;
    }
    const upcoming = allEvents.filter(e => new Date(e.date).getTime() >= new Date().getTime());
    return upcoming.length > 0 ? upcoming[0] : null;
  }, [event, allEvents]);

  const eventTitle = selectedEventItem ? selectedEventItem.title : defaultTitle;
  const eventDate = selectedEventItem ? selectedEventItem.date : 'Oct 24, 2026';
  const eventLocation = selectedEventItem ? selectedEventItem.location : 'Bacolod City';

  const distanceOptions = selectedEventItem?.distances || ['3K', '5K', '10K'];

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    sex: 'Male',
    distance: distanceOptions[0] || '3K',
    singletSize: 'None',
    emergencyName: '',
    emergencyPhone: '',
    waiver: true,
  });

  const [paymentMethod, setPaymentMethod] = useState<'GCash' | 'Maya' | 'Bank'>('GCash');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [paymentProof, setPaymentProof] = useState<string>('');
  const [paymentProofName, setPaymentProofName] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Dynamic Pricing & Inclusions Resolvers
  const getDynamicPricing = (distance: string) => {
    if (selectedEventItem?.distanceFees && selectedEventItem.distanceFees[distance] !== undefined) {
      const fee = selectedEventItem.distanceFees[distance];
      return { 
        fee, 
        inclusions: selectedEventItem.inclusions || ['Dry-Fit Singlet', 'Race Bib']
      };
    }
    return getBaseDistanceFee(distance);
  };

  const isEarlyBirdActive = (() => {
    if (!selectedEventItem?.earlyBirdDeadline) return false;
    const deadlineTime = new Date(selectedEventItem.earlyBirdDeadline).getTime();
    if (isNaN(deadlineTime)) return false;
    const now = new Date().getTime();
    return now <= deadlineTime;
  })();

  const discountPercent = isEarlyBirdActive 
    ? (selectedEventItem?.earlyBirdDiscountPercent !== undefined ? selectedEventItem.earlyBirdDiscountPercent : 20) 
    : 0;

  // Pricing calculations
  const baseDetails = getDynamicPricing(formData.distance);
  const discountAmount = Math.round(baseDetails.fee * (discountPercent / 100));
  const baseFeeAfterDiscount = baseDetails.fee - discountAmount;
  const jerseyAddonFee = formData.singletSize && formData.singletSize !== 'None' 
    ? (selectedEventItem?.jerseyFee !== undefined ? selectedEventItem.jerseyFee : 250) 
    : 0;
  const totalFee = baseFeeAfterDiscount + jerseyAddonFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked } as any));
    } else if (name === 'phone' || name === 'emergencyPhone') {
      const cleaned = value.replace(/(?!^\+)\D/g, '');
      const hasPlus = cleaned.startsWith('+');
      const digits = cleaned.replace(/\D/g, '');
      const maxDigits = digits.startsWith('63') ? 12 : 11;
      const capped = digits.slice(0, maxDigits);
      setFormData(prev => ({ ...prev, [name]: hasPlus ? '+' + capped : capped } as any));
    } else {
      setFormData(prev => ({ ...prev, [name]: value } as any));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name] : '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.emergencyName.trim()) newErrors.emergencyName = 'Emergency name is required';
    if (!formData.emergencyPhone.trim()) newErrors.emergencyPhone = 'Emergency phone is required';
    if (!formData.waiver) newErrors.waiver = 'You must agree to safety requirements';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!referenceNumber.trim()) newErrors.referenceNumber = 'Reference number is required';
    if (!paymentProof) newErrors.paymentProof = 'Proof of payment is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = () => {
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const handlePayAndComplete = () => {
    if (validateStep2()) {
      const nextBib = getNextBibNumber(formData.distance, eventTitle || '', registrations);

      if (onRegisterComplete) {
        onRegisterComplete({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          sex: formData.sex,
          distance: formData.distance,
          size: formData.singletSize,
          singletSize: formData.singletSize,
          emergencyName: formData.emergencyName,
          emergencyPhone: formData.emergencyPhone,
          eventTitle: eventTitle,
          paymentMethod: paymentMethod,
          referenceNumber: referenceNumber,
          paymentProof: paymentProof,
          registeredBib: nextBib,
          totalAmount: totalFee,
        });
      }
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 pb-10 min-h-screen bg-white">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden !important;
          }
          #print-pass-card-container, #print-pass-card-container * {
            visibility: visible !important;
          }
          #print-pass-card-container {
            position: absolute !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 450px !important;
            border: 1px solid #e4e4e7 !important;
            border-radius: 24px !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 24px !important;
            background-color: white !important;
          }
        }
      `}} />

      {step < 3 ? (
        <>
          {/* Back Button Navigation - Static */}
          <div className="mb-6">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-zinc-555 hover:text-brand transition-colors cursor-pointer uppercase font-sans"
            >
              <ArrowLeft className="h-4.5 w-4.5" /> BACK TO HOME
            </button>
          </div>

          {/* Stepper Header - Sticky right below the Navbar */}
          <div className="lg:sticky lg:top-20 lg:z-30 bg-white py-4 border-b border-zinc-100 select-none">
            <div className="max-w-xl w-full mx-auto px-4">
              <div className="flex items-center justify-between relative">
                {/* Background Connecting Line */}
                <div className="absolute top-[16px] left-[16.6%] right-[16.6%] h-[1.5px] bg-zinc-200 z-0" />
                
                {/* Active Orange Line Fill */}
                <div 
                  className="absolute top-[16px] left-[16.6%] h-[1.5px] bg-brand transition-all duration-300 z-0" 
                  style={{ 
                    width: step === 2 ? '33.3%' : step === 3 ? '66.6%' : '0%' 
                  }}
                />
                
                {/* Step 1 */}
                <div className="flex flex-col items-center relative z-10 w-1/3 bg-transparent">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center font-sans text-xs font-bold border transition-colors ${
                    step >= 1 
                      ? 'bg-brand border-brand text-white shadow-sm' 
                      : 'bg-white border-zinc-200 text-zinc-400'
                  }`}>
                    1
                  </div>
                  <span className={`mt-2 text-[10px] tracking-wider font-extrabold uppercase transition-colors ${
                    step >= 1 ? 'text-brand' : 'text-zinc-400'
                  }`}>
                    REGISTRATION
                  </span>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center relative z-10 w-1/3 bg-transparent">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center font-sans text-xs font-bold border transition-colors ${
                    step >= 2 
                      ? 'bg-brand border-brand text-white shadow-sm' 
                      : 'bg-white border-zinc-200 text-zinc-400'
                  }`}>
                    2
                  </div>
                  <span className={`mt-2 text-[10px] tracking-wider font-extrabold uppercase transition-colors ${
                    step >= 2 ? 'text-brand' : 'text-zinc-400'
                  }`}>
                    PAYMENT
                  </span>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center relative z-10 w-1/3 bg-transparent">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center font-sans text-xs font-bold border transition-colors ${
                    step === 3 
                      ? 'bg-brand border-brand text-white shadow-sm' 
                      : 'bg-white border-zinc-200 text-zinc-400'
                  }`}>
                    3
                  </div>
                  <span className={`mt-2 text-[10px] tracking-wider font-extrabold uppercase transition-colors ${
                    step === 3 ? 'text-brand' : 'text-zinc-400'
                  }`}>
                    FINISH
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 1 Main Content Container */}
          {step === 1 && (
            <div className="space-y-6 mt-8">
              
              {/* Title block */}
              <div className="border-b border-zinc-200 pb-5">
                <h1 className="font-sans text-4xl font-extrabold tracking-tight text-zinc-900">
                  Runner <span className="font-serif italic font-bold text-brand">Registration</span>
                </h1>
                <p className="mt-2 text-sm text-zinc-500 font-medium">
                  Complete your profile information to verify your slot for the <span className="text-zinc-800 font-bold">{eventTitle}</span>.
                </p>
              </div>

              {/* Grid Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Form Column */}
                <div className="lg:col-span-2 space-y-8">
                  
                  {/* Personal Data */}
                  <div className="space-y-5">
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-900">
                      PERSONAL DATA
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-900 mb-1.5 block">
                          FIRST NAME
                        </label>
                        <input 
                          type="text" 
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Juan" 
                          className={`w-full rounded-md border bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none transition-colors ${
                            errors.firstName ? 'border-red-500 focus:border-red-500' : 'border-zinc-200 focus:border-brand'
                          }`}
                        />
                        {errors.firstName && <p className="text-[10px] text-red-500 font-bold mt-1 font-sans">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-900 mb-1.5 block">
                          LAST NAME
                        </label>
                        <input 
                          type="text" 
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="De la Cruz" 
                          className={`w-full rounded-md border bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none transition-colors ${
                            errors.lastName ? 'border-red-500 focus:border-red-500' : 'border-zinc-200 focus:border-brand'
                          }`}
                        />
                        {errors.lastName && <p className="text-[10px] text-red-500 font-bold mt-1 font-sans">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-900 mb-1.5 block">
                          EMAIL ADDRESS
                        </label>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="jundelacruz@gmail.com" 
                          className={`w-full rounded-md border bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none transition-colors ${
                            errors.email ? 'border-red-500 focus:border-red-500' : 'border-zinc-200 focus:border-brand'
                          }`}
                        />
                        {errors.email && <p className="text-[10px] text-red-500 font-bold mt-1 font-sans">{errors.email}</p>}
                      </div>
                      <div>
                        <label className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-900 mb-1.5 block">
                          PHONE NUMBER
                        </label>
                        <input 
                          type="tel" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="09123456789" 
                          className={`w-full rounded-md border bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none transition-colors ${
                            errors.phone ? 'border-red-500 focus:border-red-500' : 'border-zinc-200 focus:border-brand'
                          }`}
                        />
                        {errors.phone && <p className="text-[10px] text-red-500 font-bold mt-1 font-sans">{errors.phone}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-900 mb-1.5 block">
                        GENDER IDENTIFICATION
                      </label>
                      <div className="relative">
                        <select 
                          name="sex"
                          value={formData.sex}
                          onChange={handleInputChange}
                          className="w-full rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 focus:outline-none focus:border-brand transition-colors appearance-none cursor-pointer"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Non-binary">Non-binary</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Event Selection */}
                  <div className="space-y-5 pt-2">
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-900">
                      EVENT SELECTION
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-900 mb-1.5 block">
                          SELECTED DISTANCE
                        </label>
                        <div className="relative">
                          <select 
                            name="distance"
                            value={formData.distance}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 focus:outline-none focus:border-brand transition-colors appearance-none cursor-pointer"
                          >
                            {distanceOptions.map(dist => (
                              <option key={dist} value={dist}>{dist}</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-900 mb-1.5 block">
                          JERSEY SIZE (OPTIONAL)
                        </label>
                        <div className="relative">
                          <select 
                            name="singletSize"
                            value={formData.singletSize}
                            onChange={handleInputChange}
                            className="w-full rounded-md border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800 focus:outline-none focus:border-brand transition-colors appearance-none cursor-pointer"
                          >
                            {SINGLET_SIZES.map(sz => (
                              <option key={sz} value={sz}>{sz}</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-5 pt-2">
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-900">
                      EMERGENCY CONTACT
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-900 mb-1.5 block">
                          EMERGENCY NAME
                        </label>
                        <input 
                          type="text" 
                          name="emergencyName"
                          value={formData.emergencyName}
                          onChange={handleInputChange}
                          placeholder="Maria De la Cruz" 
                          className={`w-full rounded-md border bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none transition-colors ${
                            errors.emergencyName ? 'border-red-500 focus:border-red-500' : 'border-zinc-200 focus:border-brand'
                          }`}
                        />
                        {errors.emergencyName && <p className="text-[10px] text-red-500 font-bold mt-1 font-sans">{errors.emergencyName}</p>}
                      </div>
                      <div>
                        <label className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-900 mb-1.5 block">
                          EMERGENCY PHONE NUMBER
                        </label>
                        <input 
                          type="tel" 
                          name="emergencyPhone"
                          value={formData.emergencyPhone}
                          onChange={handleInputChange}
                          placeholder="09123456789" 
                          className={`w-full rounded-md border bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none transition-colors ${
                            errors.emergencyPhone ? 'border-red-500 focus:border-red-500' : 'border-zinc-200 focus:border-brand'
                          }`}
                        />
                        {errors.emergencyPhone && <p className="text-[10px] text-red-500 font-bold mt-1 font-sans">{errors.emergencyPhone}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Consent Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start gap-3.5 cursor-pointer select-none">
                      <div className="relative mt-1">
                        <input 
                          type="checkbox" 
                          name="waiver"
                          checked={formData.waiver}
                          onChange={handleInputChange}
                          className="sr-only" 
                        />
                        <div className={`w-4.5 h-4.5 rounded border flex items-center justify-center transition-colors ${
                          formData.waiver ? 'bg-brand border-brand' : 'bg-white border-zinc-300'
                        }`}>
                          {formData.waiver && (
                            <svg className="w-3.5 h-3.5 text-white fill-current animate-fade-in" viewBox="0 0 20 20">
                              <path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/>
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="text-[11.5px] font-semibold leading-relaxed text-zinc-550">
                        I agree to the official Runnicle safety requirements and rules of conduct. I confirm that I am fit and sufficiently trained to perform in this competitive category.
                      </span>
                    </label>
                    {errors.waiver && <p className="text-[10px] text-red-500 font-bold mt-1.5">{errors.waiver}</p>}
                  </div>

                  {/* Proceed Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleProceedToPayment}
                      className="w-full bg-brand text-white font-bold py-4 rounded-[6px] tracking-widest text-xs uppercase hover:bg-brand-hover active:scale-[0.99] transition-all duration-150 cursor-pointer shadow-sm shadow-brand/10"
                    >
                      PROCEED TO PAYMENT
                    </button>
                  </div>
                </div>

                {/* Sidebar Column - Sticky below stepper */}
                <div className="lg:col-span-1 lg:sticky lg:top-[170px] z-20">
                  <RegistrationSummaryCard 
                    eventTitle={eventTitle}
                    eventLocation={eventLocation}
                    eventDate={eventDate}
                    distance={formData.distance}
                    baseFee={baseDetails.fee}
                    jerseyFee={jerseyAddonFee}
                    totalFee={totalFee}
                    inclusions={baseDetails.inclusions}
                    discountAmount={discountAmount}
                    discountPercent={discountPercent}
                  />
                </div>

              </div>
            </div>
          )}

          {/* Step 2 Main Content Container */}
          {step === 2 && (
            <div className="space-y-6 mt-8">
              
              {/* Title block */}
              <div className="border-b border-zinc-200 pb-5">
                <h1 className="font-sans text-4xl font-extrabold tracking-tight text-zinc-900">
                  Registration <span className="font-serif italic font-bold text-brand">Payment</span>
                </h1>
                <p className="mt-2 text-sm text-zinc-500 font-medium">
                  Complete your payment to verify your slot for the <span className="text-zinc-800 font-bold">{eventTitle}</span>.
                </p>
              </div>

              {/* Grid Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Form Column */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Payment Method */}
                  <div className="space-y-5">
                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-950">
                      PAYMENT METHOD
                    </h3>

                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* GCash Box */}
                      <div
                        onClick={() => setPaymentMethod('GCash')}
                        className={`flex-1 rounded-xl border p-4.5 flex items-center gap-3.5 cursor-pointer transition-all select-none ${
                          paymentMethod === 'GCash' 
                            ? 'border-brand bg-brand-glow/40 text-brand font-bold' 
                            : 'border-zinc-200 bg-white hover:border-zinc-300 text-zinc-500'
                        }`}
                      >
                        <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'GCash' ? 'border-brand' : 'border-zinc-300'
                        }`}>
                          {paymentMethod === 'GCash' && <div className="h-2.5 w-2.5 rounded-full bg-brand" />}
                        </div>
                        <span className="text-xs font-extrabold uppercase tracking-wider">
                          GCASH (MOBILE WALLET)
                        </span>
                      </div>

                      {/* Maya Box */}
                      <div
                        onClick={() => setPaymentMethod('Maya')}
                        className={`flex-1 rounded-xl border p-4.5 flex items-center gap-3.5 cursor-pointer transition-all select-none ${
                          paymentMethod === 'Maya' 
                            ? 'border-brand bg-brand-glow/40 text-brand font-bold' 
                            : 'border-zinc-200 bg-white hover:border-zinc-300 text-zinc-500'
                        }`}
                      >
                        <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'Maya' ? 'border-brand' : 'border-zinc-300'
                        }`}>
                          {paymentMethod === 'Maya' && <div className="h-2.5 w-2.5 rounded-full bg-brand" />}
                        </div>
                        <span className="text-xs font-extrabold uppercase tracking-wider">
                          MAYA (MOBILE WALLET)
                        </span>
                      </div>

                      {/* Bank Transfer Box */}
                      <div
                        onClick={() => setPaymentMethod('Bank')}
                        className={`flex-1 rounded-xl border p-4.5 flex items-center gap-3.5 cursor-pointer transition-all select-none ${
                          paymentMethod === 'Bank' 
                            ? 'border-brand bg-brand-glow/40 text-brand font-bold' 
                            : 'border-zinc-200 bg-white hover:border-zinc-300 text-zinc-500'
                        }`}
                      >
                        <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${
                          paymentMethod === 'Bank' ? 'border-brand' : 'border-zinc-300'
                        }`}>
                          {paymentMethod === 'Bank' && <div className="h-2.5 w-2.5 rounded-full bg-brand" />}
                        </div>
                        <span className="text-xs font-extrabold uppercase tracking-wider">
                          BANK TRANSFER (BDO/BPI)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Instructions text */}
                  <div className="space-y-3 font-sans text-xs text-zinc-550 border-t border-zinc-150 pt-6">
                    {paymentMethod === 'GCash' && (
                      <>
                        <h4 className="font-extrabold uppercase text-zinc-950 mb-3 tracking-wider">
                          GCASH PAYMENT INSTRUCTIONS:
                        </h4>
                        <p className="leading-relaxed font-semibold">
                          1. SEND YOUR TOTAL CHARGE TO GCASH NUMBER: <span className="text-brand font-extrabold">0917 123 4567</span> ( RUNNICLE GCASH ) .
                        </p>
                        <p className="leading-relaxed font-semibold">
                          2. ENTER YOUR 13-DIGIT GCASH TRANSACTION REFERENCE NUMBER BELOW TO VERIFY YOUR ENTRY SLOT.
                        </p>
                      </>
                    )}
                    {paymentMethod === 'Maya' && (
                      <>
                        <h4 className="font-extrabold uppercase text-zinc-950 mb-3 tracking-wider">
                          MAYA PAYMENT INSTRUCTIONS:
                        </h4>
                        <p className="leading-relaxed font-semibold">
                          1. SEND YOUR TOTAL CHARGE TO MERCHANT CODE: <span className="text-brand font-extrabold">@runnicle.ph</span> or via QR code scanning.
                        </p>
                        <p className="leading-relaxed font-semibold">
                          2. ENTER YOUR TRANSACTION REFERENCE NUMBER BELOW TO VERIFY YOUR ENTRY SLOT.
                        </p>
                      </>
                    )}
                    {paymentMethod === 'Bank' && (
                      <>
                        <h4 className="font-extrabold uppercase text-zinc-950 mb-3 tracking-wider">
                          BANK DEPOSIT INSTRUCTIONS:
                        </h4>
                        <p className="leading-relaxed font-semibold">
                          1. DEPOSIT AMOUNT TO BDO Account: <span className="text-brand font-extrabold">0012-3456-7890</span> (RUNNICLE ATHLETICS CORP).
                        </p>
                        <p className="leading-relaxed font-semibold">
                          2. ENTER YOUR TRANSACTION REFERENCE NUMBER BELOW TO VERIFY YOUR ENTRY SLOT.
                        </p>
                      </>
                    )}
                  </div>

                  {/* Form Input Group */}
                  <div className="space-y-6 pt-2">
                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-950 mb-1.5 block">
                        REFERENCE NUMBER
                      </label>
                      <input 
                        type="text" 
                        name="referenceNumber"
                        value={referenceNumber}
                        onChange={(e) => {
                          setReferenceNumber(e.target.value.replace(/\D/g, ''));
                          if (errors.referenceNumber) {
                            setErrors(prev => ({ ...prev, referenceNumber: '' }));
                          }
                        }}
                        placeholder="e.g. 1234567890123" 
                        className={`w-full rounded-md border bg-white px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none transition-colors ${
                          errors.referenceNumber ? 'border-red-500 focus:border-red-500' : 'border-zinc-200 focus:border-brand'
                        }`}
                      />
                      {errors.referenceNumber && <p className="text-[10px] text-red-500 font-bold mt-1 font-sans">{errors.referenceNumber}</p>}
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-950 mb-1.5 block">
                        UPLOAD PROOF OF PAYMENT
                      </label>
                      
                      {paymentProof ? (
                        <div className="relative rounded-xl border border-zinc-200 bg-white p-4 flex items-center justify-between shadow-sm">
                          <div className="flex items-center gap-3 truncate">
                            <svg className="w-8 h-8 text-zinc-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <div className="truncate">
                              <span className="text-xs font-bold text-zinc-900 block truncate">
                                {paymentProofName || 'screenshot.png'}
                              </span>
                              <span className="text-[10px] text-zinc-400 block mt-0.5">
                                Uploaded successfully
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setPaymentProof('');
                              setPaymentProofName('');
                            }}
                            className="text-xs font-extrabold text-red-500 hover:text-red-700 transition-colors uppercase px-3 py-1 cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className={`border-2 border-dashed rounded-xl bg-white p-8 text-center transition-colors cursor-pointer hover:border-brand relative h-40 flex flex-col justify-center items-center ${
                          errors.paymentProof ? 'border-red-500 bg-red-50/10' : 'border-zinc-200'
                        }`}>
                          <input 
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setPaymentProofName(file.name);
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === 'string') {
                                    setPaymentProof(reader.result);
                                    if (errors.paymentProof) {
                                      setErrors(prev => ({ ...prev, paymentProof: '' }));
                                    }
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <span className="text-zinc-700 text-sm font-bold block">
                            Browse or Upload Screenshot
                          </span>
                          <span className="text-zinc-400 text-xs mt-1 block">
                            PNG, JPEG, OR WEBP
                          </span>
                        </div>
                      )}
                      {errors.paymentProof && <p className="text-[10px] text-red-500 font-bold mt-1.5 font-sans">{errors.paymentProof}</p>}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setErrors({});
                      }}
                      className="flex-1 rounded-[6px] border border-brand text-brand bg-white hover:bg-brand/5 py-4 text-center text-xs font-bold uppercase tracking-wider cursor-pointer transition-all active:scale-[0.99]"
                    >
                      BACK TO FORM
                    </button>
                    <button
                      type="button"
                      onClick={handlePayAndComplete}
                      className="flex-1 rounded-[6px] bg-brand hover:bg-brand-hover text-white py-4 text-center text-xs font-bold uppercase tracking-wider cursor-pointer transition-all active:scale-[0.99] shadow-sm shadow-brand/10"
                    >
                      PAY AND COMPLETE
                    </button>
                  </div>
                </div>

                {/* Sidebar Column - Sticky below stepper */}
                <div className="lg:col-span-1 lg:sticky lg:top-[170px] z-20">
                  <RegistrationSummaryCard 
                    eventTitle={eventTitle}
                    eventLocation={eventLocation}
                    eventDate={eventDate}
                    distance={formData.distance}
                    baseFee={baseDetails.fee}
                    jerseyFee={jerseyAddonFee}
                    totalFee={totalFee}
                    inclusions={baseDetails.inclusions}
                    discountAmount={discountAmount}
                    discountPercent={discountPercent}
                  />
                </div>

              </div>
            </div>
          )}
        </>
      ) : (
        /* Pending screen (Step 3) */
        <div className="max-w-xl mx-auto text-center space-y-6 pt-4 animate-fade-in">
          
          <div>
            <div className="mx-auto w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-4 select-none animate-pulse">
              <Clock className="h-8 w-8" />
            </div>
            <h1 className="font-sans text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-955">
              Registration <span className="font-serif italic font-bold text-amber-600">Pending!</span>
            </h1>
            <p className="mt-4 text-sm text-zinc-550 font-semibold max-w-md mx-auto leading-relaxed">
              We'll be confirming your registration within the week. Once our admin team verifies your payment, your official race pass and bib number will be sent to <span className="text-zinc-955 font-bold">{formData.email || 'johnpol@gmail.com'}</span>.
            </p>
            <p className="mt-3 text-amber-600 text-[10.5px] font-black uppercase tracking-wider font-sans px-4">
              Your payment is under review. We will notify you once confirmed.
            </p>
          </div>

          {/* Timing Pass Ticket Card (Watermarked as PENDING) */}
          <div 
            id="print-pass-card-container"
            className="bg-white rounded-2xl border border-zinc-200 shadow-md p-6 max-w-md w-full mx-auto relative overflow-hidden text-left font-sans"
          >
            {/* Upper Section */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-zinc-150">
              <div>
                <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest block">
                  RUNNICLE RACE PASS
                </span>
                <span className="text-zinc-955 text-sm font-bold mt-1 block truncate">
                  {eventTitle}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest block">
                  RACE DATE
                </span>
                <span className="text-zinc-955 text-xs font-bold mt-1 block">
                  {eventDate}
                </span>
              </div>
            </div>

            {/* Details Fields */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-4 py-4.5">
              <div>
                <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest block">
                  RUNNER NAME
                </span>
                <span className="text-zinc-955 text-xs font-bold mt-1 block truncate">
                  {formData.firstName || 'Jero Niko'} {formData.lastName || 'Palenge'}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest block">
                  CATEGORY
                </span>
                <span className="text-zinc-955 text-xs font-bold mt-1 block">
                  {formData.distance}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest block">
                  SINGLET SIZE
                </span>
                <span className="text-zinc-955 text-xs font-bold mt-1 block">
                  {formData.singletSize}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest block">
                  EMERGENCY CONTACT
                </span>
                <span className="text-zinc-955 text-xs font-bold mt-1 block truncate">
                  {formData.emergencyPhone || '091231233123'}
                </span>
              </div>
            </div>

            {/* Ticket Present Banner (Modified for Pending status) */}
            <div className="border border-amber-300 rounded-md p-3.5 bg-amber-50/50 text-center mb-5 select-none">
              <span className="text-[9px] font-black text-amber-600 uppercase tracking-wider block">
                PENDING PAYMENT VERIFICATION
              </span>
            </div>

            {/* Runner Bib Box (Shows Pending) */}
            <div className="border border-amber-100 rounded-md p-5 bg-amber-50/10 text-center relative border-dashed">
              <span className="text-[9px] font-extrabold text-amber-500 uppercase tracking-widest block">
                OFFICIAL RUNNER BIB
              </span>
              <span className="font-sans text-base font-bold text-amber-600 mt-1.5 block uppercase tracking-wider">
                Assigning on confirmation
              </span>
            </div>

            {/* Ticket notched circles on the sides */}
            <div className="absolute top-[48%] -left-3 h-6 w-6 rounded-full bg-white border-r border-zinc-200" />
            <div className="absolute top-[48%] -right-3 h-6 w-6 rounded-full bg-white border-l border-zinc-200" />

          </div>

          {/* Bottom Action Buttons */}
          <div className="flex justify-center items-center max-w-xs mx-auto pt-4">
            <button
              onClick={onBack}
              className="w-full rounded-[6px] bg-brand hover:bg-brand-hover text-white py-3.5 text-center text-xs font-bold uppercase tracking-wider cursor-pointer transition-all active:scale-[0.99] shadow-sm shadow-brand/10"
            >
              RETURN HOME
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

/* Internal Component: Registration Summary Sidebar */
interface SummaryProps {
  eventTitle: string;
  eventLocation: string;
  eventDate: string;
  distance: string;
  baseFee: number;
  jerseyFee: number;
  totalFee: number;
  inclusions: string[];
  discountAmount?: number;
  discountPercent?: number;
}

const RegistrationSummaryCard: React.FC<SummaryProps> = ({
  eventTitle,
  eventLocation,
  eventDate,
  distance,
  baseFee,
  jerseyFee,
  totalFee,
  inclusions,
  discountAmount,
  discountPercent,
}) => {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-5 text-left font-sans">
      <h3 className="text-xs font-extrabold uppercase tracking-widest text-zinc-900">
        REGISTRATION SUMMARY
      </h3>

      <div className="border-t border-zinc-150 pt-4 space-y-4">
        <div>
          <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest block">
            SELECTED EVENT
          </span>
          <span className="text-sm font-bold text-zinc-900 mt-1 block">
            {eventTitle}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest block">
              LOCATION
            </span>
            <span className="text-xs font-semibold text-zinc-750 mt-1 block">
              {eventLocation}
            </span>
          </div>
          <div>
            <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest block">
              RACE DATE
            </span>
            <span className="text-xs font-semibold text-zinc-750 mt-1 block">
              {eventDate}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-150 pt-4">
        <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest block">
          INCLUSIONS FOR {distance} EARLY BIRD
        </span>
        <ul className="mt-2.5 space-y-1.5 text-xs text-zinc-550 font-semibold list-none pl-0">
          {inclusions.map((inclusion, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 flex-shrink-0" />
              {inclusion}
            </li>
          ))}
        </ul>
      </div>

      {/* Charge Breakdown */}
      <div className="border-t border-zinc-150 pt-4 space-y-2">
        <div className="flex justify-between items-center text-xs text-zinc-550 font-semibold">
          <span>Base Fee ({distance})</span>
          <span>P {baseFee.toLocaleString()}</span>
        </div>
        {discountAmount !== undefined && discountAmount > 0 ? (
          <div className="flex justify-between items-center text-xs text-emerald-600 font-extrabold font-mono">
            <span>Early Bird Discount ({discountPercent}%)</span>
            <span>- P {discountAmount.toLocaleString()}</span>
          </div>
        ) : null}
        {jerseyFee > 0 && (
          <div className="flex justify-between items-center text-xs text-zinc-550 font-semibold">
            <span>Jersey Size Add-on</span>
            <span>P {jerseyFee.toLocaleString()}</span>
          </div>
        )}
      </div>

      <div className="border-t border-zinc-150 pt-4 flex justify-between items-center">
        <span className="text-sm font-bold text-zinc-900">
          Total Charge
        </span>
        <span className="text-sm font-extrabold text-brand">
          P {totalFee.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default RegistrationPage;
