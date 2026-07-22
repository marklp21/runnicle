import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "When is the MegaWorld Fun Run 2026?",
    answer: "The MegaWorld Fun Run 2026 is scheduled for October 18, 2026. Gun start times vary by category: 21K starts at 4:30 AM, 10K at 5:15 AM, 5K at 5:45 AM, and 3K at 6:00 AM."
  },
  {
    question: "How do I receive my race kit/packet?",
    answer: "You can choose either home delivery (processed within 10-15 days before the event to your registered address) or pick it up in person during the Race Expo collection dates."
  },
  {
    question: "Can I change my singlet size after registering?",
    answer: "No, singlet sizes are finalized upon registration to ensure manufacturing schedules. Please check the size chart carefully before completing your registration."
  },
  {
    question: "What payment methods are supported?",
    answer: "We support GCash, Maya, Bank Transfer (BPI/BDO deposit), and Credit/Debit cards. All bank/wallet payments require uploading your transaction screenshot for verification."
  },
  {
    question: "Are registrations refundable or transferable?",
    answer: "Registrations are non-refundable but can be transferred to another participant up to 30 days before the event. Please contact support@runnicle.ph with your registration details."
  },
  {
    question: "Is there a baggage deposit at the event venue?",
    answer: "Yes, a secure baggage deposit area is available near the gun start line for all registered runners starting at 3:30 AM. Please do not leave valuable items."
  },
  {
    question: "What is included in the registration fee?",
    answer: "Each registration includes an official Runnicle Dry-Fit Singlet, an official race bib, a finisher medal, and sponsor goodie vouchers."
  },
  {
    question: "How do I check my race timing results?",
    answer: "Real-time timing results will be published on results.runnicle.ph and sent to your registered email address within 2 hours of crossing the finish line."
  }
];

export const FAQ: React.FC = () => {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  const toggleIndex = (index: number) => {
    if (openIndexes.includes(index)) {
      setOpenIndexes(openIndexes.filter(i => i !== index));
    } else {
      setOpenIndexes([...openIndexes, index]);
    }
  };

  const renderCard = (item: FAQItem, globalIndex: number) => {
    const isOpen = openIndexes.includes(globalIndex);
    return (
      <motion.div 
        layout
        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
        key={globalIndex}
        className={`rounded-xl border transition-all duration-200 ${
          isOpen 
            ? 'border-zinc-200 bg-[#F9FAFB] shadow-sm h-full flex flex-col self-stretch' 
            : 'border-zinc-200 bg-white hover:bg-zinc-50/50 self-start w-full'
        }`}
      >
        <button
          onClick={() => toggleIndex(globalIndex)}
          className="w-full flex items-center gap-4 py-4 px-6 text-left transition-colors cursor-pointer select-none min-h-[80px]"
        >
          <div className={`flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'text-[#FF4400] rotate-45' : 'text-zinc-400 rotate-0'
          }`}>
            <Plus className="h-4 w-4 stroke-[3px]" />
          </div>
          <div className="flex-1">
            <span className={`font-sans text-base font-normal transition-colors ${
              isOpen ? 'text-[#FF4400]' : 'text-zinc-800'
            }`}>
              {item.question}
            </span>
          </div>
        </button>
        
        {/* Expandable Answer */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="content"
              initial="collapsed"
              animate="open"
              exit="collapsed"
              variants={{
                open: { opacity: 1, height: "auto" },
                collapsed: { opacity: 0, height: 0 }
              }}
              transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
              className="overflow-hidden flex-1"
            >
              <div className="pl-14 pr-6 pb-4 text-[13px] text-zinc-650 font-normal leading-relaxed font-sans normal-case">
                {item.answer}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-sans text-4xl font-bold tracking-tight text-zinc-900 mb-3">
            Frequently Asked <span className="font-serif italic text-[#FF4400] font-bold">Questions</span>
          </h2>
          <p className="text-sm text-black font-normal">
            Everything you need to know about Runnicle
          </p>
        </div>

        {/* 2-Column Grid with Smart Row Alignment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {FAQ_ITEMS.map((item, index) => renderCard(item, index))}
        </div>


      </div>
    </section>
  );
};

export default FAQ;
