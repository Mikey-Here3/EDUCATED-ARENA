import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-text-muted)]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-primary)] rounded-md px-3 py-2 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]',
              'focus:outline-none focus:border-[var(--color-purple-primary)] focus:ring-1 focus:ring-[var(--color-purple-primary)]',
              'disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
              leftIcon && 'pl-10',
              error && 'border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-[var(--color-danger)]">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-[var(--color-text-muted)]">{helperText}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
