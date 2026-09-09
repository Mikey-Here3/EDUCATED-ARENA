import { AlertTriangle } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState = ({ title = 'Something went wrong', description = 'There was an error loading this content. Please try again.', onRetry, className }: ErrorStateProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center border border-[var(--color-danger)]/20 bg-[var(--color-danger)]/5 rounded-xl', className)}>
      <AlertTriangle className="w-12 h-12 text-[var(--color-danger)] mb-4" />
      <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h3>
      <p className="mt-2 text-sm text-[var(--color-text-secondary)] max-w-md">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="danger" className="mt-6">
          Retry
        </Button>
      )}
    </div>
  );
};
