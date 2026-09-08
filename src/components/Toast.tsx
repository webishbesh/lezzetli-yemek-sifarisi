import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-18 sm:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-1.5 max-w-[280px] sm:max-w-xs w-auto pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          id={`toast-${toast.id}`}
          className="pointer-events-auto bg-[#18181b] text-white px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl shadow-lg flex items-center justify-between gap-2 border border-neutral-800 transition-all transform translate-y-0 opacity-100 animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          <div className="flex items-center gap-2 min-w-0">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : toast.type === 'warning' ? (
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            ) : (
              <Info className="w-3.5 h-3.5 text-red-400 shrink-0" />
            )}
            <span className="text-[11px] sm:text-xs font-medium leading-tight truncate">
              {toast.message}
            </span>
          </div>
          <button
            id={`dismiss-toast-${toast.id}`}
            onClick={() => onDismiss(toast.id)}
            className="text-neutral-400 hover:text-white p-0.5 transition-colors cursor-pointer shrink-0"
            aria-label="Bağla"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
};
