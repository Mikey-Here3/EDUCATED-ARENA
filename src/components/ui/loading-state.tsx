import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoadingStateProps {
  message?: string;
  fullPage?: boolean;
  className?: string;
}

export const LoadingState = ({ message = 'Loading...', fullPage, className }: LoadingStateProps) => {
  const containerClasses = fullPage
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--color-bg-primary)]/80 backdrop-blur-sm'
    : 'flex flex-col items-center justify-center p-8';

  return (
    <div className={cn(containerClasses, className)}>
      <Loader2 className="w-8 h-8 text-[var(--color-purple-primary)] animate-spin" />
      {message && <p className="mt-4 text-sm text-[var(--color-text-secondary)]">{message}</p>}
    </div>
  );
};
