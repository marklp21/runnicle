import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Smile, BookOpen } from 'lucide-react';

interface CoachBookingPageProps {
  coachName: string | null;
  onBack: () => void;
}

export const CoachBookingPage: React.FC<CoachBookingPageProps> = ({
  coachName,
  onBack,
}) => {
  const selectedCoach = coachName || 'Coach Dan';
  
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [goals, setGoals] = useState('');
  const [mileage, setMileage] = useState('0-15 km/week');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate || !bookingTime) return;
    setBookingSuccess(true);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const timeSlots = [
    '09:00 AM - 09:30 AM',
    '11:00 AM - 11:30 AM',
    '02:00 PM - 02:30 PM',
    '04:30 PM - 05:00 PM',
    '06:00 PM - 06:30 PM'
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Dynamic Content */}
      {bookingSuccess ? (
        <div className="max-w-2xl mx-auto text-center py-16 space-y-8 animate-fade-in">
          
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div>
            <h1 className="font-display text-4xl font-black text-zinc-900 tracking-tight">
              Consultation Booked!
            </h1>
            <p className="mt-3 text-zinc-500 text-sm max-w-md mx-auto leading-relaxed font-semibold">
              Your coaching session with <span className="text-zinc-900 font-bold">{selectedCoach}</span> has been confirmed.
            </p>
          </div>

          {/* Details Dashboard Card */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 text-left max-w-md mx-auto space-y-4 shadow-sm">
            <div className="flex justify-between items-center border-b border-zinc-200 pb-3 text-xs font-semibold">
              <span className="text-zinc-450">Coach Partner</span>
              <span className="text-zinc-900 font-bold">{selectedCoach}</span>
            </div>
            
            <div className="flex justify-between items-center border-b border-zinc-200 pb-3 text-xs font-semibold">
              <span className="text-zinc-450">Scheduled Date</span>
              <span className="text-zinc-900 font-bold">{bookingDate}</span>
            </div>

            <div className="flex justify-between items-center border-b border-zinc-200 pb-3 text-xs font-semibold">
              <span className="text-zinc-450">Time Slot</span>
              <span className="text-zinc-900 font-bold">{bookingTime}</span>
            </div>

            <div className="text-[10px] text-zinc-500 font-semibold leading-relaxed pt-2">
              ⚠️ A Zoom calendar invite containing video conference details has been dispatched to your email. Please review your training logs and bring your current athletic plan.
            </div>
          </div>

          <button
            onClick={onBack}
            className="rounded-md bg-orange-500 px-8 py-3 text-xs font-bold text-white hover:bg-orange-605 transition-colors uppercase tracking-wider cursor-pointer shadow-md shadow-orange-500/10"
          >
            Return to Portal
          </button>

        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Back Button */}
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-505 hover:text-orange-505 uppercase tracking-wider cursor-pointer group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Cancel Session
          </button>

          {/* Heading */}
          <div className="border-b border-zinc-200 pb-5">
            <h1 className="font-display text-4xl font-black text-zinc-900 tracking-tight">
              Book Consultation
            </h1>
            <p className="mt-2 text-sm text-zinc-500 font-medium">
              Schedule a 30-minute introductory strategic session with <span className="text-zinc-800 font-bold">{selectedCoach}</span> to analyze your potential.
            </p>
          </div>

          {/* Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            
            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
              
              {/* Step 1: Calendar slots */}
              <div className="space-y-4">
                <h3 className="font-display text-base font-black text-zinc-900 uppercase tracking-wider border-b border-zinc-200 pb-2">1. Select Date & Time</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-zinc-705 uppercase tracking-wider mb-2">Consultation Date</label>
                    <input
                      type="date"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full rounded border border-zinc-200 bg-white px-4 py-3.5 text-xs text-zinc-905 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-zinc-750 uppercase tracking-wider mb-2">Available Time slots</label>
                    <select
                      required
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full rounded border border-zinc-200 bg-white px-4 py-3.5 text-xs text-zinc-750 focus:border-orange-500 focus:outline-none"
                    >
                      <option value="">Select a time slot</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2: Background questionnaire */}
              <div className="space-y-4 pt-4">
                <h3 className="font-display text-base font-black text-zinc-900 uppercase tracking-wider border-b border-zinc-200 pb-2">2. Running Background</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-zinc-750 uppercase tracking-wider mb-2">Current Weekly Mileage</label>
                    <select
                      value={mileage}
                      onChange={(e) => setMileage(e.target.value)}
                      className="w-full rounded border border-zinc-200 bg-white px-4 py-3.5 text-xs text-zinc-750 focus:border-orange-500 focus:outline-none"
                    >
                      <option>0-15 km/week</option>
                      <option>15-40 km/week</option>
                      <option>40-80 km/week</option>
                      <option>80+ km/week</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold text-zinc-750 uppercase tracking-wider mb-2">Running Goals & Concerns</label>
                    <textarea
                      required
                      rows={4}
                      value={goals}
                      onChange={(e) => setGoals(e.target.value)}
                      placeholder="Share your goals (e.g., breaking 45 mins in a 10K, recovering from shin splints, marathon breathing tips)..."
                      className="w-full rounded border border-zinc-200 bg-white px-4 py-3.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Booking CTA */}
              <button
                type="submit"
                className="w-full rounded-md bg-orange-500 py-4 text-sm font-black text-white hover:bg-orange-606 active:scale-98 transition-all duration-200 uppercase tracking-wider cursor-pointer mt-4 shadow-md shadow-orange-500/10"
              >
                Schedule session
              </button>

            </form>

            {/* Right Column: Coach info summary */}
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm space-y-6">
              <h3 className="font-display text-base font-black text-zinc-900 tracking-tight uppercase border-b border-zinc-200 pb-4">
                Session Outline
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-900 block">30-Min Strategic Video Call</span>
                    <span className="text-[10px] text-zinc-505 font-medium block">Personalized, 1-on-1 advice</span>
                  </div>
                </div>

                <div className="text-xs font-semibold text-zinc-550 space-y-2 pt-2 leading-relaxed">
                  <p>✅ Analysis of your current pacing, strides, and form logs.</p>
                  <p>✅ Advice on target heart rate zones and dynamic warmups.</p>
                  <p>✅ Direct alignment on customized week-by-week calendar mileage.</p>
                </div>
              </div>

              <div className="rounded border border-zinc-200 bg-zinc-50 p-4 flex gap-2.5 text-[10px] text-zinc-500 leading-relaxed font-semibold">
                <Smile className="h-4 w-4 text-zinc-400 flex-shrink-0 mt-0.5" />
                <span>Consultation slots are limited. Sessions cancelled with less than 24 hours notice may lose priority scheduling.</span>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
export default CoachBookingPage;
