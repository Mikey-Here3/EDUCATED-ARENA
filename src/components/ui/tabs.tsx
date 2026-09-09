'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export const Tabs = ({ defaultValue, children, className }: { defaultValue: string; children: ReactNode; className?: string }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabList = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <div className={cn('flex items-center gap-4 border-b border-[var(--color-border-primary)]', className)}>
      {children}
    </div>
  );
};

export const Tab = ({ value, children, className }: { value: string; children: ReactNode; className?: string }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tab must be used within Tabs');
  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(
        'relative px-4 py-3 text-sm font-medium transition-colors focus:outline-none',
        isActive ? 'text-[var(--color-purple-primary)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
        className
      )}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="activeTabIndicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-purple-primary)]"
          initial={false}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </button>
  );
};

export const TabPanel = ({ value, children, className }: { value: string; children: ReactNode; className?: string }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabPanel must be used within Tabs');
  if (context.activeTab !== value) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn('py-4', className)}
    >
      {children}
    </motion.div>
  );
};
