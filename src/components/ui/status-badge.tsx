import { Badge, BadgeProps } from './badge';

export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: string;
}

export const StatusBadge = ({ status, ...props }: StatusBadgeProps) => {
  const normalized = status.toLowerCase();
  
  let variant: BadgeProps['variant'] = 'default';
  
  if (['active', 'completed', 'success', 'won'].includes(normalized)) variant = 'success';
  else if (['pending', 'processing', 'in_progress'].includes(normalized)) variant = 'warning';
  else if (['failed', 'cancelled', 'lost', 'disputed'].includes(normalized)) variant = 'danger';
  else if (['ready', 'waiting', 'open'].includes(normalized)) variant = 'info';
  else if (['premium', 'vip'].includes(normalized)) variant = 'gold';

  return <Badge variant={variant} {...props}>{status}</Badge>;
};
