'use client';
import { useRef, useEffect, useState } from 'react';

interface ScratchCardProps {
  children: React.ReactNode;
}

export default function ScratchCard({ children }: ScratchCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Track if the card has hit the 70% threshold
  const [isCleared, setIsCleared] = useState(false);
  // Track movements so we don't calculate percentages on every single pixel move
  const scratchCount = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    // willReadFrequently optimizes the canvas for heavy getImageData usage
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;

    ctx.fillStyle = '#fdfbf7'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(217, 56, 56, 0.6)'; 
    ctx.font = 'italic 32px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Scratch me', canvas.width / 2, canvas.height / 2);

  }, []);

  const checkCompletion = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Get all pixel data from the canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentPixels = 0;
    
    // Loop through the alpha channel of each pixel (every 4th value in the array)
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparentPixels++;
      }
    }

    const totalPixels = pixels.length / 4;
    const percentage = transparentPixels / totalPixels;

    // If more than 70% is scratched, trigger the auto-clear
    if (percentage > 0.70) {
      setIsCleared(true);
    }
  };

  const handleScratch = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isCleared) return; // Stop drawing if it's already cleared

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2); // Increased brush size slightly to 30 for easier scratching
    ctx.fill();

    // Performance Optimization: Only run the heavy pixel calculation every 10 frames
    scratchCount.current++;
    if (scratchCount.current % 10 === 0) {
      checkCompletion(ctx, canvas);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-[90vw] max-w-[400px] aspect-[1.6/1] rounded-xl overflow-hidden shadow-2xl border border-[#e2dfd8]"
    >
      {/* The Hidden Content */}
      <div className="absolute inset-0 flex items-center justify-center bg-white z-0">
        {children}
      </div>

      {/* The Scratchable Surface */}
      <canvas
        ref={canvasRef}
        // When isCleared becomes true, smoothly fade out the entire canvas over 500ms
        className={`absolute inset-0 cursor-pointer touch-none z-10 transition-opacity duration-500 ease-out ${
          isCleared ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        onPointerDown={handleScratch}
        onPointerMove={(e) => e.buttons === 1 && handleScratch(e)}
      />
    </div>
  );
}