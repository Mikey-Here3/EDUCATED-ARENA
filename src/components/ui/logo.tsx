'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  href?: string;
  glow?: boolean;
}

export function Logo({
  className,
  size = 'md',
  showText = true,
  href = '/',
  glow = true,
}: LogoProps) {
  const iconSizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const titleSizeMap = {
    sm: 'text-sm tracking-wider',
    md: 'text-base sm:text-lg tracking-wider',
    lg: 'text-xl tracking-wide',
    xl: 'text-2xl tracking-wide',
  };

  const badgeSizeMap = {
    sm: 'text-[7px] px-1 py-0.2',
    md: 'text-[8px] sm:text-[9px] px-1.5 py-0.5',
    lg: 'text-[10px] px-2 py-0.5',
    xl: 'text-xs px-2.5 py-1',
  };

  const content = (
    <div className={cn("inline-flex items-center gap-2.5 group select-none cursor-pointer", className)}>
      {/* Dynamic Cyber Emblem Badge */}
      <div
        className={cn(
          iconSizeMap[size],
          "relative shrink-0 rounded-xl bg-gradient-to-br from-[#00f0ff] via-[#7928ca] to-[#ff0055] p-[1.5px] transition-all duration-300 group-hover:scale-105",
          glow && "shadow-[0_0_20px_rgba(0,240,255,0.45)] group-hover:shadow-[0_0_28px_rgba(0,240,255,0.7)]"
        )}
      >
        <div className="w-full h-full rounded-[10px] bg-[#070412] flex items-center justify-center overflow-hidden relative">
          {/* Subtle Cyber Grid Background in Icon */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:6px_6px]" />
          
          {/* High-Impact Vector Emblem SVG */}
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[78%] h-[78%] relative z-10">
            <defs>
              <linearGradient id="logo-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
              <linearGradient id="logo-fire" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff0055" />
                <stop offset="100%" stopColor="#ffbe1a" />
              </linearGradient>
            </defs>

            {/* Shield Outline */}
            <polygon
              points="50,6 88,24 80,72 50,94 20,72 12,24"
              fill="#0d0822"
              stroke="url(#logo-cyan)"
              strokeWidth="4"
            />

            {/* Crossed Katana Blades */}
            <line x1="22" y1="18" x2="78" y2="82" stroke="url(#logo-fire)" strokeWidth="3.5" strokeLinecap="round" opacity="0.85" />
            <line x1="78" y1="18" x2="22" y2="82" stroke="url(#logo-cyan)" strokeWidth="3.5" strokeLinecap="round" opacity="0.85" />

            {/* Center Core Shield */}
            <polygon points="50,22 72,36 72,64 50,78 28,64 28,36" fill="#05020c" stroke="#00f0ff" strokeWidth="2.5" />

            {/* Stylized "EG" Marks */}
            {/* E */}
            <path d="M 36 40 L 48 40 L 48 44 L 40 44 L 40 48 L 47 48 L 47 52 L 40 52 L 40 56 L 48 56 L 48 60 L 36 60 Z" fill="#00f0ff" />
            {/* G */}
            <path d="M 64 42 L 64 40 L 52 40 L 52 60 L 64 60 L 64 50 L 58 50 L 58 54 L 60 54 L 60 56 L 56 56 L 56 44 L 64 44 Z" fill="#ffffff" />

            {/* Core Target Center Dot */}
            <circle cx="50" cy="50" r="2" fill="#00ff88" />
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={cn(
                "font-heading font-black text-white tracking-wider uppercase transition-colors group-hover:text-[#00f0ff]",
                titleSizeMap[size]
              )}
              style={{ textShadow: glow ? '0 0 16px rgba(0,240,255,0.4)' : 'none' }}
            >
              EDUCATED GAMER
            </span>
            <span
              className={cn(
                "rounded bg-gradient-to-r from-[#ff0055] to-[#ff4500] text-white font-heading font-black tracking-widest uppercase shadow-[0_0_12px_rgba(255,0,85,0.5)]",
                badgeSizeMap[size]
              )}
            >
              ARENA
            </span>
          </div>
          {size !== 'sm' && (
            <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase mt-0.5 group-hover:text-slate-300">
              PAKISTAN PRO ESPORTS
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
