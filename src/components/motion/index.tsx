'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

const EASING: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Reveal: Fade-in + slide-up on scroll ───
interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number;
}

export function Reveal({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  direction = 'up',
  distance = 25,
}: RevealProps) {
  const prefersReduced = useReducedMotion();

  const directionMap = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 },
  };

  const offset = directionMap[direction];

  return (
    <motion.div
      className={className}
      initial={prefersReduced ? { opacity: 1 } : { opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: prefersReduced ? 0 : duration,
        delay: prefersReduced ? 0 : delay,
        ease: EASING,
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Stagger: Container that staggers children ───
interface StaggerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  delay?: number;
}

export function Stagger({
  children,
  className = '',
  staggerDelay = 0.08,
  delay = 0,
}: StaggerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── StaggerItem: Child of Stagger ───
interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

export function StaggerItem({ children, className = '' }: StaggerItemProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={{
        hidden: prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: EASING,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── PageTransition: Wrap page content ───
interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className = '' }: PageTransitionProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: prefersReduced ? 0 : 0.35,
        ease: EASING,
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── AnimatedCounter: Smooth number count-up ───
interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  className = '',
}: AnimatedCounterProps) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      {prefix}
      <span>{value.toLocaleString()}</span>
      {suffix}
    </motion.span>
  );
}

// ─── LiveIndicator: Esports pulsing live indicator ───
interface LiveIndicatorProps {
  label?: string;
  className?: string;
  color?: 'red' | 'green' | 'cyan' | 'amber';
}

export function LiveIndicator({
  label = 'LIVE',
  className = '',
  color = 'red',
}: LiveIndicatorProps) {
  const colorMap = {
    red: {
      dot: 'bg-red-500',
      ring: 'bg-red-500/50',
      text: 'text-red-400',
    },
    green: {
      dot: 'bg-[#00ff88]',
      ring: 'bg-[#00ff88]/50',
      text: 'text-[#00ff88]',
    },
    cyan: {
      dot: 'bg-[#00f0ff]',
      ring: 'bg-[#00f0ff]/50',
      text: 'text-[#00f0ff]',
    },
    amber: {
      dot: 'bg-[#ffbe1b]',
      ring: 'bg-[#ffbe1b]/50',
      text: 'text-[#ffbe1b]',
    },
  };

  const c = colorMap[color] || colorMap.red;

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="relative flex h-2.5 w-2.5">
        <span
          className={`absolute inset-0 rounded-full ${c.ring} animate-ping`}
          style={{ animationDuration: '1.8s' }}
        />
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${c.dot}`} />
      </span>
      {label && (
        <span className={`text-[10px] font-black uppercase tracking-widest ${c.text}`}>
          {label}
        </span>
      )}
    </span>
  );
}

// ─── GlowButton: Esports CTA with interactive light sweep ───
interface GlowButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  variant?: 'cyan' | 'green' | 'gold' | 'purple' | 'secondary';
}

export function GlowButton({
  children,
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  variant = 'cyan',
}: GlowButtonProps) {
  const variantStyles = {
    cyan: 'battle-btn-cyan',
    green: 'battle-btn-green',
    gold: 'battle-btn-gold',
    purple: 'battle-btn-purple',
    secondary: 'bg-black/60 border border-white/20 text-slate-300 hover:text-white hover:border-[#00f0ff]/40',
  };

  const base = variantStyles[variant] || variantStyles.cyan;

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-xl font-black text-xs uppercase tracking-wider
        cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
        ${base} ${className}
      `}
      whileHover={disabled ? {} : { scale: 1.02, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}
