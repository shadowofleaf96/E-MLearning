import React, { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
};

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = '2xl',
}: ModalProps) {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 bg-on-surface/40 backdrop-blur-sm overflow-y-auto">
      <div
        className={`bg-surface-container-lowest w-full ${maxWidthClasses[maxWidth]} rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden transform transition-all flex flex-col max-h-[90vh]`}
      >
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-border-subtle flex justify-between items-center bg-surface-container-low/50 shrink-0">
          <div>
            <h3 className="font-headline-md text-xl md:text-2xl font-bold text-on-surface">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm font-medium text-on-surface-variant mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-surface-container-highest flex items-center justify-center text-on-surface-variant transition-colors focus:outline-none shrink-0 ml-4"
            type="button"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar flex-1">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 sm:px-8 py-4 border-t border-border-subtle bg-surface-bg shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
