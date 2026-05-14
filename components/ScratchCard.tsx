'use client';
import { useRef, useState, useEffect } from 'react';

export default function ScratchCard({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratched, setIsScratched] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill the canvas with a "frosted glass" color or solid envelope color
    ctx.fillStyle = '#fdfbf7'; // Elegant off-white
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const handleScratch = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // This makes the drawing "erase" the canvas
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2); // 25 is the brush size
    ctx.fill();
  };

  return (
    <div className="relative w-72 h-72 rounded-xl overflow-hidden shadow-2xl">
      {/* The Hidden Content (Photo/Video) */}
      <div className="absolute inset-0 flex items-center justify-center bg-black">
        {children}
      </div>

      {/* The Scratchable Surface */}
      <canvas
        ref={canvasRef}
        width={288} // Matches w-72 (288px)
        height={288}
        className="absolute inset-0 cursor-pointer touch-none"
        onPointerDown={handleScratch}
        onPointerMove={(e) => e.buttons === 1 && handleScratch(e)}
      />
    </div>
  );
}