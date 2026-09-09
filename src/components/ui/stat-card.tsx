'use client';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './card';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: number; // percentage
  trendLabel?: string;
}

export const StatCard = ({ label, value, icon, trend, trendLabel }: StatCardProps) => {
  return (
    <Card variant="elevated" hoverable>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">{label}</p>
          {icon && <div className="text-[var(--color-purple-primary)]">{icon}</div>}
        </div>
        <div className="mt-4">
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-[var(--color-text-primary)]"
          >
            {value}
          </motion.h3>
          {trend !== undefined && (
            <div className="mt-2 flex items-center gap-1.5 text-sm">
              {trend >= 0 ? (
                <TrendingUp className="w-4 h-4 text-[var(--color-success)]" />
              ) : (
                <TrendingDown className="w-4 h-4 text-[var(--color-danger)]" />
              )}
              <span className={trend >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}>
                {Math.abs(trend)}%
              </span>
              {trendLabel && <span className="text-[var(--color-text-muted)]">{trendLabel}</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
