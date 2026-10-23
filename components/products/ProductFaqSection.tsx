'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface ProductFaqSectionProps {
  title?: string;
  faqs?: FaqItem[];
  className?: string;
}

const DEFAULT_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'What is The Lawn Mower® Ultra Gen 6?',
    answer:
      'The Lawn Mower® Ultra Gen 6 is our most advanced groin and body hair trimmer yet. Engineered with next-generation SkinSafe™ ceramic blade technology, interchangeable trimmer and foil blade heads, a dual-speed motor (up to 7,200 RPM), smart LED digital display, dual-temperature spotlight, and IPX7 waterproof rating, it delivers the ultimate precision grooming experience from head to toe.',
  },
  {
    id: 'faq-2',
    question: 'What is included in the box?',
    answer:
      'Inside the box, you’ll find: The Lawn Mower® Ultra Gen 6 Trimmer body, SkinSafe™ Trimmer Blade, SkinSafe™ Foil Blade for an ultra-close finish, 2 adjustable guard combs (2mm, 4mm, 6mm, 8mm), magnetic wireless charging dock with USB-C cable, premium cleaning brush, and the quick start guide & safety manual.',
  },
  {
    id: 'faq-3',
    question:
      'How do I replace The Lawn Mower® Ultra Gen 6 Replacement Trimmer Blade and The Lawn Mower® Ultra Gen 6 Replacement Foil Blade?',
    answer:
      'To replace the blade, first ensure the trimmer is powered off. Hold the trimmer firmly in one hand and gently push the blade head forward and upward with your thumb to pop it out of the socket. To attach a new blade (either the Trimmer Blade or Foil Blade), align the bottom locking tabs of the blade module with the slot on the trimmer body, and press down firmly until you hear a solid click.',
  },
  {
    id: 'faq-4',
    question: 'How do I charge The Lawn Mower® Ultra Gen 6 and how long does the battery last?',
    answer:
      'The Lawn Mower® Ultra Gen 6 features a premium high-capacity 800mAh Li-ion battery providing up to 90 minutes of continuous runtime on a single charge. You can charge it wirelessly using the included magnetic charging dock or directly via the universal USB-C port. A full charge takes approximately 90 minutes, and the LED screen displays real-time battery percentage so you never get caught mid-trim.',
  },
  {
    id: 'faq-5',
    question: 'What information is shown on the display screen?',
    answer:
      'The high-contrast smart LED screen displays real-time battery percentage (0–100%), active motor speed mode (Standard vs. Turbo Boost), travel lock status indicator (locked/unlocked), cleaning and maintenance reminder icon, and charging status animation.',
  },
  {
    id: 'faq-6',
    question: 'How do I prevent the device from turning on while traveling?',
    answer:
      'The trimmer features an intelligent Travel Lock. To engage the Travel Lock, press and hold the power button for 3 seconds. The lock icon will blink and remain solid on the display, preventing any accidental activation in your luggage or dopp kit. To unlock, simply press and hold the power button again for 3 seconds.',
  },
  {
    id: 'faq-7',
    question: 'What is the dual-temperature spotlight and how do I use it?',
    answer:
      'The built-in 4000K LED spotlight illuminates tricky crevices and low-light areas for maximum visibility. Ultra Gen 6 introduces dual-temperature lighting (Warm Glow and Cool Daylight), allowing you to toggle the light tone to best contrast against your skin tone and hair color by double-clicking the light control button.',
  },
  {
    id: 'faq-8',
    question: 'What makes it better for sensitive areas?',
    answer:
      'The Ultra Gen 6 incorporates our proprietary SkinSafe™ ceramic blade design with rounded micro-teeth set back 0.5mm from the cutting edge. This prevents delicate skin from snagging, pulling, or getting pinched between blades. Additionally, the low-vibration motor and ergonomic non-slip grip give you total maneuverability and confidence in sensitive zones.',
  },
  {
    id: 'faq-9',
    question: 'How close of a shave can I get with The Lawn Mower® Ultra Gen 6 Groin & Body Hair Trimmer?',
    answer:
      'With the ceramic trimmer blade alone, you achieve a comfortable, zero-gap 0.2mm trim that prevents ingrown hairs and razor burn. For an ultra-smooth, skin-level finish, switch to the included SkinSafe™ Foil Blade, which lifts and cuts hair cleanly down to the skin without irritation.',
  },
  {
    id: 'faq-10',
    question: 'How often should the blade be replaced?',
    answer:
      'We recommend replacing your SkinSafe™ Trimmer Blade and Foil Blade every 3 months for optimal hygiene, sharpness, and peak performance. Over time, dull blades can cause irritation or pulling. With a VIP subscription, fresh replacement blades are delivered conveniently to your door right when you need them.',
  },
  {
    id: 'faq-11',
    question: 'How do I clean The Lawn Mower® Ultra Gen 6?',
    answer:
      'Cleaning is effortless thanks to its 100% waterproof construction. After each use, detach the blade head and use the included brush to sweep away loose hairs from the blade and motor cavity. You can then rinse the entire trimmer and blade heads directly under warm running tap water. Allow them to air-dry thoroughly before reassembling.',
  },
  {
    id: 'faq-12',
    question: 'Is The Lawn Mower® Ultra Gen 6 waterproof and okay to use in the shower?',
    answer:
      'Yes! The Lawn Mower® Ultra Gen 6 is IPX7 waterproof certified, meaning it can withstand immersion in water up to 1 meter deep for up to 30 minutes. It is fully safe and optimized for wet or dry trimming in the shower, tub, or over the sink, allowing for easy cleanup.',
  },
];

export default function ProductFaqSection({
  title = 'You have questions. We have answers.',
  faqs = DEFAULT_FAQS,
  className = '',
}: ProductFaqSectionProps) {
  // Support toggling single FAQ item (or closing if already open)
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faqs"
      aria-label="Frequently Asked Questions"
      className={`w-full py-16 sm:py-20 md:py-24 bg-[#f8f7f2] border-t border-neutral-200/60 scroll-mt-20 ${className}`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Section Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-[44px] font-serif font-bold text-neutral-900 tracking-tight leading-tight mb-8 sm:mb-12">
          {title}
        </h2>

        {/* Accordion List */}
        <div className="border-t border-neutral-300">
          {faqs.map((item) => {
            const isOpen = openId === item.id;

            return (
              <div
                key={item.id}
                className="border-b border-neutral-300 transition-colors duration-150"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(item.id)}
                  aria-expanded={isOpen}
                  className="w-full py-5 sm:py-6 flex items-center justify-between text-left group gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="text-sm sm:text-base font-semibold text-neutral-900 tracking-normal group-hover:text-amber-800 transition-colors duration-150 leading-relaxed pr-2">
                    {item.question}
                  </span>
                  <div
                    className={`flex-shrink-0 text-neutral-600 transition-transform duration-300 ease-out ${
                      isOpen ? 'rotate-180 text-neutral-900' : 'group-hover:text-neutral-900'
                    }`}
                  >
                    <ChevronDown className="w-5 h-5 stroke-[1.75]" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: 'auto',
                        opacity: 1,
                        transition: {
                          height: { duration: 0.28, ease: [0.04, 0.62, 0.23, 0.98] },
                          opacity: { duration: 0.22, delay: 0.05 },
                        },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.22, ease: [0.04, 0.62, 0.23, 0.98] },
                          opacity: { duration: 0.15 },
                        },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 text-sm sm:text-base text-neutral-700 leading-relaxed max-w-3xl font-normal">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
