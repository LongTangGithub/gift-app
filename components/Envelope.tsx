'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface EnvelopeProps {
  delay?: number;
  rotate?: number;
  initialX: string;
  initialY: string;
  onClick: () => void;
}

export default function Envelope({ delay = 0, rotate = 0, initialX, initialY, onClick }: EnvelopeProps) {
  // We add local state to track if THIS specific envelope has been cracked open yet
  const [isOpen, setIsOpen] = useState(false);

  const handleTap = () => {
    if (isOpen) {
      // If she already opened it previously, just show the modal instantly
      onClick();
      return;
    }
    
    // 1. Trigger the opening animation
    setIsOpen(true);
    
    // 2. Wait for the flap to visually open (600ms), THEN trigger the scratch card
    setTimeout(() => {
      onClick();
    }, 600);
  };

  return (
    <motion.div
      className="absolute cursor-pointer touch-manipulation"
      // Bump the z-index when opened so the flap doesn't clip under other envelopes
      style={{ 
        left: initialX, 
        top: initialY,
        zIndex: isOpen ? 40 : 10 
      }}
      initial={{ opacity: 0, scale: 0.5, y: 80, rotate: rotate }}
      animate={{ 
        opacity: 1, 
        scale: [0.75, 1, 0.75], 
        y: [0, -15, 0], 
        rotate: rotate 
      }}
      transition={{
        opacity: { duration: 0.5, delay },
        scale: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: delay },
        y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: delay },
      }}
      whileHover={{ scale: 1.05, zIndex: 30 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleTap}
    >
      {/* 3D Perspective Container */}
      <div className="w-20 h-14 sm:w-28 sm:h-20 relative [perspective:1000px]">
        
        {/* Layer 1: Inside Back of Envelope */}
        <div className="absolute inset-0 bg-[#e8e4db] rounded-sm shadow-lg border border-[#d3cec4]" />

        {/* Layer 2: The Letter Inside (Slides up slightly when opened) */}
        <motion.div 
          className="absolute inset-x-2 top-2 bottom-0 bg-white rounded-t-sm border border-gray-200"
          initial={{ y: 0 }}
          animate={{ y: isOpen ? -15 : 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        >
           {/* A tiny detail: A small red heart printed on the top of the hidden card */}
           <div className="absolute top-2 left-1/2 -translate-x-1/2 text-red-400 text-[6px] sm:text-[8px]">♥</div>
        </motion.div>

        {/* Layer 3: Bottom & Side Flaps (Static front layer) */}
        <svg className="absolute inset-0 w-full h-full text-[#e2dfd8] drop-shadow-sm pointer-events-none" viewBox="0 0 100 60" preserveAspectRatio="none">
          <path d="M0,0 L50,35 L100,0 L100,60 L0,60 Z" fill="#fdfbf7" stroke="currentColor" strokeWidth="1.5" />
        </svg>

        {/* Layer 4: Top Flap (The Animated Hinge) */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-[60%] origin-top pointer-events-none"
          initial={{ rotateX: 0 }}
          animate={{ rotateX: isOpen ? 180 : 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front side of the flap (Sealed) */}
          <div className="absolute inset-0 [backface-visibility:hidden]">
            <svg className="w-full h-full text-[#e2dfd8]" viewBox="0 0 100 35" preserveAspectRatio="none">
              <path d="M0,0 L50,35 L100,0 Z" fill="#fdfbf7" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            {/* The Red Heart Seal (Fades out as it opens) */}
            <motion.div 
              className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-4 h-4 sm:w-5 sm:h-5 bg-[#d93838] rounded-full flex items-center justify-center shadow-sm"
              animate={{ opacity: isOpen ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            >
               <span className="text-white text-[8px] sm:text-[10px] leading-none mb-[1px]">♥</span>
            </motion.div>
          </div>

          {/* Back side of the flap (Visible when opened and folded back) */}
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateX(180deg)]">
            <svg className="w-full h-full text-[#e2dfd8]" viewBox="0 0 100 35" preserveAspectRatio="none">
              <path d="M0,35 L50,0 L100,35 Z" fill="#f4f1ea" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}