'use client';
import { ReactNode, useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmptyState } from './empty-state';
import { Skeleton } from './skeleton';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  sortable?: boolean;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyState?: ReactNode;
  onSort?: (accessor: keyof T, direction: 'asc' | 'desc') => void;
  className?: string;
}

export function DataTable<T extends { id: string | number }>({ columns, data, isLoading, emptyState, onSort, className }: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (accessor: any) => {
    if (typeof accessor !== 'string' && typeof accessor !== 'number' && typeof accessor !== 'symbol') return;
    
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === accessor && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: accessor as keyof T, direction });
    if (onSort) onSort(accessor as keyof T, direction);
  };

  if (isLoading) {
    return (
      <div className={cn('w-full space-y-4', className)}>
        <div className="flex gap-4 p-4 border-b border-[var(--color-border-primary)]">
          {columns.map((_, i) => <Skeleton key={i} className="h-6 flex-1" />)}
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 p-4">
            {columns.map((_, j) => <Skeleton key={j} className="h-4 flex-1" />)}
          </div>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return emptyState ? <>{emptyState}</> : <EmptyState title="No data found" />;
  }

  return (
    <div className={cn('w-full overflow-x-auto rounded-xl border border-[var(--color-border-primary)]', className)}>
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-[var(--color-text-secondary)] uppercase bg-[var(--color-bg-elevated)] border-b border-[var(--color-border-primary)]">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className={cn('px-6 py-4 font-medium', col.sortable && 'cursor-pointer hover:text-[var(--color-text-primary)]', col.className)}
                onClick={() => col.sortable && handleSort(col.accessor)}
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && sortConfig?.key === col.accessor && (
                    sortConfig.direction === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b border-[var(--color-border-primary)] bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-hover)] transition-colors">
              {columns.map((col, i) => (
                <td key={i} className={cn('px-6 py-4', col.className)}>
                  {typeof col.accessor === 'function' ? col.accessor(row) : (row[col.accessor] as ReactNode)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
