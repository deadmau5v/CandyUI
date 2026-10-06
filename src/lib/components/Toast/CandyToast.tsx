import React from "react";
import { CandyColor } from "../../types";
import "./CandyToast.css";
import { CandyGameIcon } from "../GameIcon/CandyGameIcon";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  variant?: CandyColor;
  isLeaving?: boolean;
}

export interface CandyToastProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

export const CandyToast: React.FC<CandyToastProps> = ({ toast, onDismiss }) => {
  const hasDesc = Boolean(toast.description);

  return (
    <div
      className={`candy-toast candy-toast-${toast.variant || "blue"}${hasDesc ? " candy-toast-has-desc" : ""}${toast.isLeaving ? " candy-toast-leaving" : ""}`}
      role="alert"
      tabIndex={0}
      aria-label={`Notification: ${toast.title}`}
      onClick={() => onDismiss(toast.id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onDismiss(toast.id);
        }
      }}
    >
      <div className="candy-toast-indicator">
        {toast.icon ? (
          <div className="candy-toast-icon">{toast.icon}</div>
        ) : (
          <span className="candy-toast-dot" aria-hidden="true" />
        )}
      </div>
      <div className="candy-toast-content">
        <div className="candy-toast-title">{toast.title}</div>
        {toast.description && (
          <div className="candy-toast-description">{toast.description}</div>
        )}
      </div>
      <button
        type="button"
        className="candy-toast-close"
        aria-label={`Dismiss notification: ${toast.title}`}
        onClick={(e) => {
          e.stopPropagation();
          onDismiss(toast.id);
        }}
      >
        <CandyGameIcon name="cross" size={10} color="currentColor" />
      </button>
    </div>
  );
};
