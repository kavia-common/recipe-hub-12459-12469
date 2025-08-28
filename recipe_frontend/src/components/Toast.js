import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import "./toast.css";

const ToastContext = createContext(null);

// PUBLIC_INTERFACE
export function useToast() {
  /** Hook to display toast messages. */
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}

/**
 * ToastProvider manages a queue of toasts and renders them in bottom-right.
 * Usage:
 *  const { notify } = useToast();
 *  notify({ type: "success", message: "Saved!" });
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const remove = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback(({ type = "info", message = "", duration = 3000 } = {}) => {
    const id = ++idRef.current;
    const toast = { id, type, message, duration };
    setToasts((list) => [...list, toast]);
    return id;
  }, []);

  // Auto-dismiss
  useEffect(() => {
    const timers = toasts.map((t) =>
      setTimeout(() => {
        remove(t.id);
      }, t.duration)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, remove]);

  const value = useMemo(() => ({ notify, remove }), [notify, remove]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span className="toast-message">{t.message}</span>
            <button className="toast-close" onClick={() => remove(t.id)} aria-label="Dismiss">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
