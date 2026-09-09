'use client';
import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      asChild,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary:
        'bg-[var(--color-purple-primary)] hover:bg-[var(--color-purple-secondary)] text-white shadow-lg glow-purple-sm border border-purple-500/50',
      secondary:
        'bg-transparent border border-[var(--color-border-secondary)] hover:border-[var(--color-purple-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]',
      danger:
        'bg-danger/10 text-[var(--color-danger)] border border-[var(--color-danger)] hover:bg-[var(--color-danger)] hover:text-white',
      ghost:
        'bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]',
      gold: 'gradient-gold text-[var(--color-bg-primary)] font-semibold shadow-lg shadow-gold/20 hover:opacity-90',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg font-medium',
    };

    const classes = cn(
      'inline-flex items-center justify-center rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-purple-primary)]/50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
      variants[variant],
      sizes[size],
      className
    );

    const content = (
      <>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </>
    );

    if (asChild) {
      return (
        <button
          ref={ref}
          className={classes}
          disabled={disabled || isLoading}
          {...props}
        >
          {content}
        </button>
      );
    }

    return (
      <motion.button
        ref={ref}
        whileTap={disabled || isLoading ? undefined : { scale: 0.97 }}
        className={classes}
        disabled={disabled || isLoading}
        {...(props as any)}
      >
        {content}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
