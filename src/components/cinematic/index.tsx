'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Particle Field: Subtle floating red/violet particles ───
export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 18 : 40;

    let w = (canvas.width = canvas.offsetWidth);
    let h = (canvas.height = canvas.offsetHeight);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      color: string;
      alpha: number;
    }

    const particles: Particle[] = [];
    const colors = [
      'rgba(220, 38, 38, ',  // crimson
      'rgba(239, 68, 68, ',  // red
      'rgba(139, 92, 246, ', // violet
      'rgba(255, 255, 255, ', // white
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.25 - 0.1,
        r: Math.random() * 1.8 + 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.4 + 0.08,
      });
    }

    function animate() {
      ctx!.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = `${p.color}${p.alpha})`;
        ctx!.fill();
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [reduceMotion]);

  if (reduceMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
      style={{ opacity: 0.7 }}
      aria-hidden="true"
    />
  );
}

// ─── Scanlines: CRT scanline overlay ───
export function ScanlineOverlay() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-[2]"
      style={{
        backgroundImage:
          'linear-gradient(rgba(220, 38, 38, 0.018) 1px, transparent 1px)',
        backgroundSize: '100% 3px',
      }}
      aria-hidden="true"
    />
  );
}

// ─── Perspective Grid: Fading futuristic grid ───
export function PerspectiveGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-[1]"
      style={{
        backgroundImage:
          'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        maskImage:
          'radial-gradient(ellipse 70% 50% at 50% 20%, rgba(0,0,0,0.6) 0%, transparent 100%)',
        WebkitMaskImage:
          'radial-gradient(ellipse 70% 50% at 50% 20%, rgba(0,0,0,0.6) 0%, transparent 100%)',
      }}
      aria-hidden="true"
    />
  );
}

// ─── Ambient Glow: Top-area crimson/violet radial glow ───
export function AmbientGlow() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Primary crimson glow top-center */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#DC2626]/15 via-[#DC2626]/6 to-transparent rounded-full blur-[120px]" />
      {/* Secondary violet glow top-right */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[400px] bg-gradient-to-bl from-[#7C3AED]/10 to-transparent rounded-full blur-[100px]" />
      {/* Subtle bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#030014] to-transparent" />
    </div>
  );
}

// ─── Vignette: Edge darkening ───
export function Vignette() {
  return (
    <div
      className="absolute inset-0 pointer-events-none z-[3]"
      style={{
        boxShadow: 'inset 0 0 150px 40px rgba(3, 0, 20, 0.7)',
      }}
      aria-hidden="true"
    />
  );
}

// ─── CinematicBackground: Full layered atmosphere ───
interface CinematicBackgroundProps {
  showParticles?: boolean;
  showGrid?: boolean;
  intensity?: 'low' | 'medium' | 'high';
}

export function CinematicBackground({
  showParticles = true,
  showGrid = true,
  intensity = 'medium',
}: CinematicBackgroundProps) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <AmbientGlow />
      {showGrid && <PerspectiveGrid />}
      <ScanlineOverlay />
      {showParticles && <ParticleField />}
      <Vignette />
    </div>
  );
}
