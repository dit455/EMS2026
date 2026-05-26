import React, { useState, useCallback, createContext, useContext } from 'react';
import { Icon } from '../components';

/**
 * Toast notification system — extracted from 3 separate dashboard implementations
 * into a single shared context + component. Usage:
 *
 *   const { showToast } = useToast();
 *   showToast('Request approved!', 'success');
 *   showToast('Something failed.', 'error');
 */

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((msg, type = 'success', duration = 3500) => {
    const id = crypto.randomUUID ? crypto.randomUUID() : `t${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container" aria-live="polite" aria-atomic="true">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            className={`toast-item toast-${toast.type}`}
            style={{ '--toast-index': index }}
            role="alert"
          >
            <div className="toast-icon">
              <Icon
                name={toast.type === 'error' ? 'x' : toast.type === 'warning' ? 'clock' : 'check'}
                size={16}
              />
            </div>
            <span className="toast-msg">{toast.msg}</span>
            <button
              className="toast-dismiss"
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
            >
              <Icon name="x" size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Fallback for components rendered outside ToastProvider
    return {
      showToast: (msg, type) => {
        console.warn('[Toast] No ToastProvider found — message:', msg, type);
      },
    };
  }
  return ctx;
}
