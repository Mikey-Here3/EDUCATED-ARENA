'use client';

import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, Swords, Trash2, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

export interface BattleConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  subtitle?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'battle' | 'warning' | 'info';
  loading?: boolean;
  children?: ReactNode;
}

export function BattleConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  subtitle,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'battle',
  loading = false,
  children,
}: BattleConfirmModalProps) {
  if (!isOpen) return null;

  const variantStyles = {
    battle: {
      border: 'border-red-500/40',
      shadow: 'shadow-[0_0_50px_rgba(255,32,64,0.25)]',
      glow: 'text-red-400',
      badgeBg: 'bg-red-500/10 border-red-500/30 text-red-400',
      btn: 'battle-btn-red text-white shadow-[0_0_20px_rgba(255,32,64,0.4)]',
      icon: Swords,
    },
    danger: {
      border: 'border-rose-500/40',
      shadow: 'shadow-[0_0_50px_rgba(244,63,94,0.25)]',
      glow: 'text-rose-400',
      badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      btn: 'bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold',
      icon: Trash2,
    },
    warning: {
      border: 'border-amber-500/40',
      shadow: 'shadow-[0_0_50px_rgba(245,158,11,0.25)]',
      glow: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      btn: 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:opacity-90 text-black font-black',
      icon: AlertCircle,
    },
    info: {
      border: 'border-[#00f0ff]/40',
      shadow: 'shadow-[0_0_50px_rgba(0,240,255,0.2)]',
      glow: 'text-[#00f0ff]',
      badgeBg: 'bg-[#00f0ff]/10 border-[#00f0ff]/30 text-[#00f0ff]',
      btn: 'bg-gradient-to-r from-[#00f0ff] to-[#00a8ff] text-black font-black',
      icon: ShieldCheck,
    },
  };

  const currentVariant = variantStyles[variant];
  const IconComponent = currentVariant.icon;

  const modalNode = (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={loading ? undefined : onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ type: 'spring', damping: 24, stiffness: 320 }}
          className={cn(
            'relative w-full max-w-md rounded-3xl bg-[#090514]/98 border p-6 sm:p-7 overflow-hidden z-10 flex flex-col',
            currentVariant.border,
            currentVariant.shadow
          )}
        >
          {/* Top ambient glow accent */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-gradient-to-b from-white/10 to-transparent blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={loading ? undefined : onClose}
            disabled={loading}
            className="absolute top-5 right-5 p-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-40"
          >
            <X size={18} />
          </button>

          {/* Header Icon + Title */}
          <div className="flex items-start gap-4 mb-4">
            <div className={cn('w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0', currentVariant.badgeBg)}>
              <IconComponent size={24} />
            </div>
            <div className="pr-6">
              <h3 className="text-lg sm:text-xl font-black text-white font-heading tracking-wide uppercase">
                {title}
              </h3>
              {subtitle && (
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Custom Body / Specs Container */}
          {children && (
            <div className="my-2">
              {children}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 px-4 rounded-xl border border-white/15 hover:border-white/30 text-xs font-bold text-slate-300 hover:text-white transition-all disabled:opacity-40"
            >
              {cancelText}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className={cn(
                'flex-1 py-3 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-50',
                currentVariant.btn
              )}
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{confirmText}</span>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return typeof document !== 'undefined' ? createPortal(modalNode, document.body) : null;
}
