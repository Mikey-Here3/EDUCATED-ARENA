'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useReducedMotion, AnimatePresence, type Variants } from 'framer-motion';

// ─── Hero Mouse Parallax: Desktop only ───
export function useMouseParallax(sensitivity: number = 15) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    if (window.innerWidth < 1024) return;

    const handler = (e: MouseEvent) => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        setOffset({
          x: ((e.clientX - cx) / cx) * sensitivity,
          y: ((e.clientY - cy) / cy) * sensitivity,
        });
      });
    };

    window.addEventListener('mousemove', handler, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handler);
      cancelAnimationFrame(rafId.current);
    };
  }, [sensitivity]);

  return offset;
}

// ─── Hero Entrance: Staggered cinematic sequence ───
const heroStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const heroFade: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

const heroScale: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

// ─── Animated Navbar (transparent → blur on scroll) ───
interface AnimatedNavWrapperProps {
  children: React.ReactNode;
}

export function AnimatedNavWrapper({ children }: AnimatedNavWrapperProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`transition-all duration-500 ${
        scrolled
          ? 'bg-[#030014]/90 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)] border-b border-white/10'
          : 'bg-transparent border-b border-transparent'
      }`}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}
    >
      {children}
    </motion.div>
  );
}

// ─── Export animation variants for page usage ───
export { heroStagger, heroFade, heroScale };
