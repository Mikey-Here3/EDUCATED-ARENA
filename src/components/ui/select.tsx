import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, id, children, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={cn(
              'w-full appearance-none bg-[var(--color-bg-elevated)] border border-[var(--color-border-primary)] rounded-md px-3 py-2 pr-10 text-[var(--color-text-primary)]',
              'focus:outline-none focus:border-[var(--color-purple-primary)] focus:ring-1 focus:ring-[var(--color-purple-primary)]',
              'disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
              error && 'border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]',
              className
            )}
            {...props}
          >
            {children}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-[var(--color-text-muted)]">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        {error && <p className="mt-1 text-sm text-[var(--color-danger)]">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-[var(--color-text-muted)]">{helperText}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
