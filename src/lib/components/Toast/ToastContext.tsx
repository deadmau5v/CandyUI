import React, { createContext, useContext, useState, useCallback } from "react";
import { ToastItem, CandyToast } from "./CandyToast";
import { CandyColor } from "../../types";
import { useCandy } from "../../context/CandyProvider";

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

export const CandyToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const { playSound } = useCandy();

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
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

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          dismissToast(id);
        }, duration);
      }
    },
    [playSound, dismissToast],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        aria-relevant="additions"
        style={{
          position: "fixed",
          top: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => (
          <CandyToast key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useCandyToast = () => useContext(ToastContext);
