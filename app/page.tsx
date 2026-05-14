'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Atmosphere from '../components/Atmosphere';
import Envelope from '../components/Envelope';
import ScratchCard from '../components/ScratchCard';

export default function Home() {
  const [activeGift, setActiveGift] = useState<number | null>(null);

  // Carefully plotted coordinates to scatter 23 envelopes around the center
  // X maxes out at 75% so envelopes don't get pushed off the right edge of mobile screens
  const scatterPositions = [
    { x: '5%', y: '3%' }, { x: '38%', y: '5%' }, { x: '68%', y: '9%' },
    { x: '12%', y: '14%' }, { x: '45%', y: '18%' }, { x: '72%', y: '22%' },
    { x: '2%', y: '26%' }, { x: '28%', y: '30%' }, { x: '65%', y: '35%' },
    { x: '8%', y: '42%' }, { x: '75%', y: '46%' }, { x: '3%', y: '56%' },
    { x: '72%', y: '60%' }, { x: '22%', y: '65%' }, { x: '55%', y: '70%' },
    { x: '5%', y: '76%' }, { x: '75%', y: '80%' }, { x: '38%', y: '85%' },
    { x: '15%', y: '90%' }, { x: '62%', y: '92%' }, { x: '32%', y: '96%' },
    { x: '25%', y: '10%' }, { x: '58%', y: '40%' }
  ];

  const rotates = [-8, 12, -6, 9, -12, 10, -5, 14, 4, -9];

  const envelopes = Array.from({ length: 23 }).map((_, i) => ({
    id: i + 1,
    delay: (i % 6) * 0.1, // Faster stagger so they all pop in quickly
    rotate: rotates[i % rotates.length],
    x: scatterPositions[i].x,
    y: scatterPositions[i].y,
    message: `This is the placeholder note for envelope #${i + 1}.`,
  }));

  return (
    // Locked to 100dvh (viewport height) with hidden overflow to keep it on one screen
    <main className="relative h-[100dvh] w-full overflow-hidden">
      <Atmosphere />

      {/* The Center Tag - Absolutely positioned in the dead center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-[#FAF8F5] p-4 sm:p-5 shadow-xl rotate-[-2deg] border border-[#e2dfd8]">
        <p className="font-serif text-gray-800 text-sm sm:text-base tracking-wide whitespace-nowrap">from <span className="italic">Yours Truly</span></p>
        <p className="font-serif text-gray-800 text-sm sm:text-base tracking-wide mt-1 whitespace-nowrap">to <span className="italic">Rida Ayub</span></p>
      </div>

      {/* The Scattered Envelopes */}
      <div className="absolute inset-0 z-10 w-full h-full max-w-3xl mx-auto">
        {envelopes.map((env) => (
          <Envelope 
            key={env.id}
            initialX={env.x}
            initialY={env.y}
            delay={env.delay} 
            rotate={env.rotate} 
            onClick={() => setActiveGift(env.id)} 
          />
        ))}
      </div>

      {/* The Reveal Modal Overlay */}
      <AnimatePresence>
        {activeGift && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md touch-none px-4"
          >
            <ScratchCard>
              <div className="flex flex-col items-center p-4 text-center bg-white w-full h-full">
                <div className="w-full h-40 bg-gray-100 rounded border border-gray-200 flex items-center justify-center mb-4 overflow-hidden relative shadow-inner">
                   <span className="text-gray-400 font-serif italic text-sm">Image {activeGift}</span>
                </div>
                <p className="text-gray-700 font-serif leading-snug text-sm px-2">
                  {envelopes.find(e => e.id === activeGift)?.message}
                </p>
              </div>
            </ScratchCard>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => setActiveGift(null)}
              className="mt-8 px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full backdrop-blur-md border border-white/40 transition-colors shadow-lg"
            >
              Close
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}