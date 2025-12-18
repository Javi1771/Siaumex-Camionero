'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, XCircle, Info, AlertCircle, X } from 'lucide-react';
import { useTheme } from '@/src/contexts/ThemeContext';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { theme } = useTheme();

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, type, message }]);

    //! Auto remove después de 5 segundos
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const styles = {
    light: {
      success: {
        container: 'bg-white border border-green-200 shadow-lg',
        icon: 'text-green-600',
        text: 'text-black',
        closeButton: 'text-neutral-400 hover:text-black'
      },
      error: {
        container: 'bg-white border border-red-200 shadow-lg',
        icon: 'text-red-600',
        text: 'text-black',
        closeButton: 'text-neutral-400 hover:text-black'
      },
      info: {
        container: 'bg-white border border-blue-200 shadow-lg',
        icon: 'text-blue-600',
        text: 'text-black',
        closeButton: 'text-neutral-400 hover:text-black'
      },
      warning: {
        container: 'bg-white border border-yellow-200 shadow-lg',
        icon: 'text-yellow-600',
        text: 'text-black',
        closeButton: 'text-neutral-400 hover:text-black'
      }
    },
    dark: {
      success: {
        container: 'bg-neutral-900 border border-green-900/50 shadow-lg',
        icon: 'text-green-400',
        text: 'text-white',
        closeButton: 'text-neutral-500 hover:text-white'
      },
      error: {
        container: 'bg-neutral-900 border border-red-900/50 shadow-lg',
        icon: 'text-red-400',
        text: 'text-white',
        closeButton: 'text-neutral-500 hover:text-white'
      },
      info: {
        container: 'bg-neutral-900 border border-blue-900/50 shadow-lg',
        icon: 'text-blue-400',
        text: 'text-white',
        closeButton: 'text-neutral-500 hover:text-white'
      },
      warning: {
        container: 'bg-neutral-900 border border-yellow-900/50 shadow-lg',
        icon: 'text-yellow-400',
        text: 'text-white',
        closeButton: 'text-neutral-500 hover:text-white'
      }
    }
  };

  const getIcon = (type: ToastType) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'success':
        return <CheckCircle2 className={iconClass} />;
      case 'error':
        return <XCircle className={iconClass} />;
      case 'info':
        return <Info className={iconClass} />;
      case 'warning':
        return <AlertCircle className={iconClass} />;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => {
          const currentStyles = styles[theme][toast.type];
          
          return (
            <div
              key={toast.id}
              className={`${currentStyles.container} rounded-2xl p-4 pr-12 min-w-[320px] max-w-md pointer-events-auto transition-all duration-300 animate-[slideIn_0.3s_ease-out]`}
            >
              <div className="flex items-start gap-3">
                <div className={currentStyles.icon}>
                  {getIcon(toast.type)}
                </div>
                <p className={`${currentStyles.text} text-sm font-medium flex-1`}>
                  {toast.message}
                </p>
                <button
                  onClick={() => removeToast(toast.id)}
                  className={`${currentStyles.closeButton} transition-colors absolute top-4 right-4`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

//* Helper hooks para uso más fácil
export function useToastHelpers() {
  const { showToast } = useToast();

  return {
    success: (message: string) => showToast('success', message),
    error: (message: string) => showToast('error', message),
    info: (message: string) => showToast('info', message),
    warning: (message: string) => showToast('warning', message),
  };
}