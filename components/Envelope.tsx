'use client';
import { motion } from 'framer-motion';

interface EnvelopeProps {
  delay?: number;
  rotate?: number;
  initialX: string;
  initialY: string;
  onClick: () => void;
}

export default function Envelope({ delay = 0, rotate = 0, initialX, initialY, onClick }: EnvelopeProps) {
  return (
    <motion.div
      // We position it absolutely on the screen using the coordinates we pass in
      className="absolute cursor-pointer touch-manipulation z-10"
      style={{ left: initialX, top: initialY }}
      initial={{ opacity: 0, scale: 0.5, y: 80, rotate: rotate }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: [0, -10, 0], 
        rotate: rotate 
      }}
      transition={{
        opacity: { duration: 0.5, delay },
        scale: { type: 'spring', stiffness: 260, damping: 20, delay },
        y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: delay },
      }}
      whileHover={{ scale: 1.05, zIndex: 30 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {/* Notice the responsive sizing: w-20 on mobile, sm:w-28 on iPad/Desktop */}
      <div className="w-20 h-14 sm:w-28 sm:h-20 bg-[#fdfbf7] rounded-sm shadow-lg relative overflow-hidden flex items-center justify-center border border-[#e2dfd8]">
        <svg className="absolute inset-0 w-full h-full text-[#e2dfd8]" viewBox="0 0 100 60" preserveAspectRatio="none">
          <path d="M0,0 L50,35 L100,0" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M0,60 L40,30 M100,60 L60,30" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-[#d93838] rounded-full flex items-center justify-center z-10 shadow-sm mt-2 sm:mt-3">
           <span className="text-white text-[8px] sm:text-[10px] leading-none mb-[1px]">♥</span>
        </div>
      </div>
    </motion.div>
  );
}