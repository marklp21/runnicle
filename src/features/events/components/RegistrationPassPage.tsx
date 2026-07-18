import React from 'react';
import { ArrowLeft, Clock, XCircle, CheckCircle, Printer, ShieldAlert } from 'lucide-react';
import { type EventItem } from '@/types';

interface RegistrationPassPageProps {
  registrationId: string | null;
  registrations: any[];
  allEvents: EventItem[];
  onGoHome: () => void;
}

export const RegistrationPassPage: React.FC<RegistrationPassPageProps> = ({
  registrationId,
  registrations,
  allEvents,
  onGoHome
}) => {
  const registration = registrations.find(r => r.id === registrationId);

  // Find matching event
  const matchedEvent = registration
    ? allEvents.find(e => e.title.toLowerCase() === (registration.eventTitle || '').toLowerCase())
    : null;

  const eventTitle = registration ? registration.eventTitle : '';
  const eventDate = matchedEvent ? matchedEvent.date : (registration ? registration.eventDate || 'Oct 24, 2026' : '');

  const handlePrint = () => {
    window.print();
  };

  const renderContent = () => {
    if (!registrationId) {
      return (
        <div className="max-w-md mx-auto text-center py-12 px-4 bg-white rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-zinc-900">Missing Registration ID</h2>
            <p className="text-sm text-zinc-500 leading-relaxed">
              No registration code was provided. Please check your email link or contact support.
            </p>
          </div>
          <button
            onClick={onGoHome}
            className="w-full rounded-[6px] bg-brand hover:bg-brand-hover text-white py-3.5 text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.99] cursor-pointer"
          >
            Go to Home
          </button>
        </div>
      );
    }

    if (!registration) {
      return (
        <div className="max-w-md mx-auto text-center py-12 px-4 bg-white rounded-3xl border border-zinc-200 shadow-sm space-y-6">
          <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-zinc-900">Registration Not Found</h2>
            <p className="text-sm text-zinc-500 leading-relaxed">
              We couldn't locate a registration with ID <span className="font-mono text-zinc-700 font-bold">{registrationId}</span>.
            </p>
          </div>
          <button
            onClick={onGoHome}
            className="w-full rounded-[6px] bg-brand hover:bg-brand-hover text-white py-3.5 text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.99] cursor-pointer"
          >
            Go to Home
          </button>
        </div>
      );
    }

    const status = (registration.status || 'Pending').toLowerCase();

    if (status === 'cancelled') {
      return (
        <div className="max-w-md mx-auto text-center py-12 px-4 bg-white rounded-3xl border border-zinc-200 shadow-sm space-y-6 animate-fade-in">
          <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500">
            <XCircle className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-zinc-900">Registration Cancelled</h2>
            <p className="text-sm text-zinc-500 leading-relaxed">
              This registration for <strong>{eventTitle}</strong> has been cancelled. If you believe this is an error, please reach out to our event organizers.
            </p>
          </div>
          <div className="border border-zinc-150 rounded-xl p-4 bg-zinc-50/50 text-left space-y-2 text-xs text-zinc-500 font-sans">
            <div><strong>Runner:</strong> {registration.firstName} {registration.lastName}</div>
            <div><strong>Reference #:</strong> {registration.referenceNumber || 'N/A'}</div>
          </div>
          <button
            onClick={onGoHome}
            className="w-full rounded-[6px] bg-brand hover:bg-brand-hover text-white py-3.5 text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.99] cursor-pointer"
          >
            Return Home
          </button>
        </div>
      );
    }

    if (status === 'pending') {
      return (
        <div className="max-w-md mx-auto text-center py-12 px-4 bg-white rounded-3xl border border-zinc-200 shadow-sm space-y-6 animate-fade-in">
          <div className="mx-auto w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-500">
            <Clock className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-zinc-900">Verification Pending</h2>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Your registration for <strong>{eventTitle}</strong> is currently pending verification. We are confirming your payment (Ref: <span className="font-mono font-bold text-zinc-700">{registration.referenceNumber}</span>) and will update it within the week.
            </p>
            <p className="text-xs text-zinc-400">
              Once verified, your official bib number will be generated and you will receive a confirmation email.
            </p>
          </div>
          <div className="border border-amber-100 rounded-xl p-4 bg-amber-50/30 text-left space-y-2 text-xs text-zinc-650 font-sans border-dashed">
            <div><strong>Runner:</strong> {registration.firstName} {registration.lastName}</div>
            <div><strong>Category:</strong> {registration.distance}</div>
            <div><strong>Singlet Size:</strong> {registration.size || registration.singletSize}</div>
            <div className="flex items-center gap-1.5 text-amber-600 font-bold mt-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              Status: Pending Payment Verification
            </div>
          </div>
          <button
            onClick={onGoHome}
            className="w-full rounded-[6px] bg-brand hover:bg-brand-hover text-white py-3.5 text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.99] cursor-pointer"
          >
            Return Home
          </button>
        </div>
      );
    }

    // Otherwise verified / confirmed status
    return (
      <div className="max-w-xl mx-auto text-center space-y-6 pt-4 animate-fade-in">
        <div>
          <div className="mx-auto w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-3 select-none">
            <CheckCircle className="h-6 w-6" />
          </div>
          <h1 className="font-sans text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-955">
            Registration <span className="font-serif italic font-bold text-brand">Confirmed!</span>
          </h1>
          <p className="mt-4 text-sm text-zinc-550 font-semibold max-w-md mx-auto leading-relaxed">
            Your payment is verified! Below is your official race pass for <strong>{eventTitle}</strong>.
          </p>
          <p className="mt-3 text-brand text-[10.5px] font-black uppercase tracking-wider font-sans px-4">
            SAVE OR PRINT THIS PASS. YOU MUST PRESENT THIS TO CLAIM YOUR RACE KIT.
          </p>
        </div>

        {/* Timing Pass Ticket Card */}
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
                {registration.firstName} {registration.lastName}
              </span>
            </div>
            <div>
              <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest block">
                CATEGORY
              </span>
              <span className="text-zinc-955 text-xs font-bold mt-1 block">
                {registration.distance}
              </span>
            </div>
            <div>
              <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest block">
                SINGLET SIZE
              </span>
              <span className="text-zinc-955 text-xs font-bold mt-1 block">
                {registration.size || registration.singletSize || 'None'}
              </span>
            </div>
            <div>
              <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest block">
                EMERGENCY CONTACT
              </span>
              <span className="text-zinc-955 text-xs font-bold mt-1 block truncate">
                {registration.emergencyPhone || 'N/A'}
              </span>
            </div>
          </div>

          {/* Ticket Present Banner */}
          <div className="border border-brand rounded-md p-3.5 bg-orange-50/50 text-center mb-5 select-none">
            <span className="text-[9px] font-black text-brand uppercase tracking-wider block">
              PRESENT THIS TICKET TO CLAIM YOUR RACE KIT
            </span>
          </div>

          {/* Runner Bib Box */}
          <div className="border border-zinc-200 rounded-md p-5 bg-zinc-50/50 text-center relative">
            <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest block">
              OFFICIAL RUNNER BIB
            </span>
            <span className="font-sans text-5xl font-black text-zinc-955 tracking-tight mt-1.5 block">
              #{registration.registeredBib || 'N/A'}
            </span>
          </div>

          {/* Ticket notched circles on the sides */}
          <div className="absolute top-[48%] -left-3 h-6 w-6 rounded-full bg-white border-r border-zinc-200" />
          <div className="absolute top-[48%] -right-3 h-6 w-6 rounded-full bg-white border-l border-zinc-200" />
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-sm mx-auto pt-4 print:hidden">
          <button
            onClick={handlePrint}
            className="w-full sm:w-1/2 rounded-[6px] border border-brand text-brand bg-white hover:bg-brand/5 py-3.5 text-center text-xs font-bold uppercase tracking-wider cursor-pointer transition-all active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <Printer className="h-4 w-4" /> PRINT PASS
          </button>
          <button
            onClick={onGoHome}
            className="w-full sm:w-1/2 rounded-[6px] bg-brand hover:bg-brand-hover text-white py-3.5 text-center text-xs font-bold uppercase tracking-wider cursor-pointer transition-all active:scale-[0.99] shadow-sm shadow-brand/10"
          >
            RETURN HOME
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-12 min-h-[80vh] bg-white">
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

      {/* Back to Home Navigation (Hidden during print) */}
      <div className="mb-6 print:hidden">
        <button
          onClick={onGoHome}
          className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-zinc-555 hover:text-brand transition-colors cursor-pointer uppercase font-sans"
        >
          <ArrowLeft className="h-4.5 w-4.5" /> BACK TO HOME
        </button>
      </div>

      <div className="py-4">
        {renderContent()}
      </div>
    </div>
  );
};
