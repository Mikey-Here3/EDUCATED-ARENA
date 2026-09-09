import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';
import { Button } from './button';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState = ({ icon, title, description, action, className }: EmptyStateProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center glass rounded-xl', className)}>
      <div className="w-12 h-12 mb-4 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center text-[var(--color-text-muted)]">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h3>
      {description && <p className="mt-2 text-sm text-[var(--color-text-secondary)] max-w-md">{description}</p>}
      {action && (
        <Button onClick={action.onClick} className="mt-6" variant="secondary">
          {action.label}
        </Button>
      )}
    </div>
  );
};
