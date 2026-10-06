import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import { ToastItem, CandyToast } from "./CandyToast";
import { CandyColor } from "../../types";
import { useCandy } from "../../context/CandyProvider";

const MAX_TOASTS = 4;
const EXIT_DURATION = 100;

const isReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

interface ToastContextValue {
  showToast: (options: {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    variant?: CandyColor;
    duration?: number;
  }) => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

export const CandyToastProvider: React.FC<{ children: React.ReactNode; maxToasts?: number }> = ({
  children,
  maxToasts = MAX_TOASTS,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const { playSound } = useCandy();
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismissToast = useCallback((id: string) => {
    // Clear pending auto-dismiss timer if present
    const timer = timeoutsRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timeoutsRef.current.delete(id);
    }

    if (isReducedMotion()) {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      return;
    }

    // Mark as leaving for smooth exit animation, then remove
    setToasts((prev) => {
      const exists = prev.find((t) => t.id === id);
      if (!exists || exists.isLeaving) return prev;
      return prev.map((t) => (t.id === id ? { ...t, isLeaving: true } : t));
    });

    const exitTimer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timeoutsRef.current.delete(`exit-${id}`);
    }, EXIT_DURATION);
    timeoutsRef.current.set(`exit-${id}`, exitTimer);
  }, []);

  const showToast = useCallback(
    ({
      title,
      description,
      icon,
      variant = "yellow",
      duration = 3500,
    }: {
      title: string;
      description?: string;
      icon?: React.ReactNode;
      variant?: CandyColor;
      duration?: number;
    }) => {
      playSound("star");
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast: ToastItem = { id, title, description, icon, variant };

      setToasts((prev) => {
        const active = prev.filter((t) => !t.isLeaving);
        if (active.length >= maxToasts) {
          const overflowCount = active.length - maxToasts + 1;
          const toRemoveIds = new Set(active.slice(0, overflowCount).map((t) => t.id));

          if (isReducedMotion()) {
            return [...prev.filter((t) => !toRemoveIds.has(t.id)), newToast];
          }

          const updated = prev.map((t) =>
            toRemoveIds.has(t.id) ? { ...t, isLeaving: true } : t,
          );
          setTimeout(() => {
            setToasts((current) => current.filter((t) => !toRemoveIds.has(t.id)));
          }, EXIT_DURATION);
          return [...updated, newToast];
        }
        return [...prev, newToast];
      });

      if (duration > 0) {
        const autoDismissTimer = setTimeout(() => {
          dismissToast(id);
        }, duration);
        timeoutsRef.current.set(id, autoDismissTimer);
      }
    },
    [playSound, dismissToast, maxToasts],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="candy-toast-container"
        aria-live="polite"
        aria-relevant="additions"
      >
        {toasts.map((toast) => (
          <CandyToast key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useCandyToast = () => useContext(ToastContext);
