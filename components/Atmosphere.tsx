'use client';
import { useEffect, useRef } from 'react';

export default function Atmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Ginkgo Leaf Particle System
    const leaves = Array.from({ length: 25 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height, // Start slightly offscreen
      size: Math.random() * 8 + 12, // Ginkgo leaves are a bit larger
      speed: Math.random() * 1 + 0.3,
      sway: Math.random() * 1.5,
      angle: Math.random() * Math.PI * 2,
      spinSpeed: (Math.random() - 0.5) * 0.02, // Subtle tumbling effect
    }));

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      leaves.forEach((leaf) => {
        // Update physics
        leaf.y += leaf.speed;
        leaf.angle += leaf.spinSpeed;
        leaf.x += Math.sin(leaf.y * 0.01) * leaf.sway;

        // Reset to top if it falls off screen
        if (leaf.y > canvas.height + 30) {
          leaf.y = -30;
          leaf.x = Math.random() * canvas.width;
        }

        // Draw Ginkgo Leaf
        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.angle);
        ctx.scale(leaf.size / 20, leaf.size / 20);

        ctx.beginPath();
        // Stem
        ctx.moveTo(0, 15);
        ctx.lineTo(0, 8);
        // Left lobe
        ctx.bezierCurveTo(-20, 5, -25, -15, -15, -20);
        // Top cleft
        ctx.quadraticCurveTo(-5, -25, 0, -12); 
        ctx.quadraticCurveTo(5, -25, 15, -20);
        // Right lobe
        ctx.bezierCurveTo(25, -15, 20, 5, 0, 8);

        // Styling the leaf (Golden yellow)
        ctx.fillStyle = 'rgba(235, 185, 55, 0.85)';
        ctx.fill();
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'rgba(200, 150, 40, 0.5)';
        ctx.stroke();

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 bg-[#FAF8F5]">
      {/* CSS-based Cream Oxford Paper Texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
      {/* Falling Ginkgo Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
    </div>
  );
}

