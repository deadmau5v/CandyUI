import React, { forwardRef } from "react";
import "./CandyAlert.css";

export type CandyAlertTone = "success" | "info" | "warning" | "error";

export interface CandyAlertProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  tone?: CandyAlertTone;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  dismissible?: boolean;
  onClose?: () => void;
  closeLabel?: string;
}

function AlertIcon({ tone }: { tone: CandyAlertTone }) {
  if (tone === "warning") {
    return (
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M10.3 3.8a2 2 0 0 1 3.4 0l9 15.5a2 2 0 0 1-1.7 3H3a2 2 0 0 1-1.7-3Z"
          fill="currentColor"
        />
        <path
          d="M12 9v5m0 3v.5"
          stroke="var(--candy-surface, white)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      {tone === "success" ? (
        <path
          d="m7 12 3 3 7-7"
          stroke="var(--candy-surface, white)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : tone === "error" ? (
        <path
          d="m8 8 8 8m0-8-8 8"
          stroke="var(--candy-surface, white)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M12 11v6m0-10v.5"
          stroke="var(--candy-surface, white)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export const CandyAlert = forwardRef<HTMLDivElement, CandyAlertProps>(
  (
    {
      tone = "info",
      title,
      children,
      icon,
      action,
      onClose,
      dismissible = Boolean(onClose),
      closeLabel = "Dismiss alert",
      role,
      className = "",
      ...rest
    },
    ref,
  ) => (
    <div
      ref={ref}
      role={
        role ?? (tone === "error" || tone === "warning" ? "alert" : "status")
      }
      className={`candy-alert candy-alert-${tone} ${className}`.trim()}
      {...rest}
    >
      {icon !== null && (
        <span className="candy-alert-icon" aria-hidden="true">
          {icon ?? <AlertIcon tone={tone} />}
        </span>
      )}
      <div className="candy-alert-content">
        {title && <div className="candy-alert-title">{title}</div>}
        {children && <div className="candy-alert-description">{children}</div>}
      </div>
      {action && <div className="candy-alert-action">{action}</div>}
      {dismissible && onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="candy-alert-close"
        >
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="m4 4 8 8m0-8-8 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  ),
);

CandyAlert.displayName = "CandyAlert";
