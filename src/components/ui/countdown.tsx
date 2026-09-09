'use client';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface CountdownProps {
  targetDate: Date | string;
  onExpire?: () => void;
  className?: string;
}

export const Countdown = ({ targetDate, onExpire, className }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      if (difference <= 0) {
        setExpired(true);
        if (onExpire) onExpire();
        return null;
      }
      return {
        hours: Math.floor((difference / (1000 * 60 * 60))),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
      if (!remaining) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onExpire]);

  if (expired) {
    return <span className={cn('text-[var(--color-danger)] font-mono font-medium', className)}>Expired</span>;
  }

  if (!timeLeft) return null;

  return (
    <span className={cn('font-mono font-medium text-[var(--color-text-primary)]', className)}>
      {String(timeLeft.hours).padStart(2, '0')}:
      {String(timeLeft.minutes).padStart(2, '0')}:
      {String(timeLeft.seconds).padStart(2, '0')}
    </span>
  );
};
