'use client';
import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface TooltipProps {
  content: string;
  children: ReactNode;
}

export const Tooltip = ({ content, children }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute z-50 px-2 py-1 mb-2 text-xs font-medium text-white bg-black rounded whitespace-nowrap bottom-full left-1/2 -translate-x-1/2 pointer-events-none"
          >
            {content}
            <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 border-4 border-transparent border-t-black" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
