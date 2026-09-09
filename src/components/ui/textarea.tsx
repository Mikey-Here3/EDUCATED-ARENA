import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            'w-full bg-[var(--color-bg-elevated)] border border-[var(--color-border-primary)] rounded-md px-3 py-2 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]',
            'focus:outline-none focus:border-[var(--color-purple-primary)] focus:ring-1 focus:ring-[var(--color-purple-primary)]',
            'disabled:opacity-50 disabled:cursor-not-allowed transition-colors resize-y min-h-[80px]',
            error && 'border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-[var(--color-danger)]">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-[var(--color-text-muted)]">{helperText}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
