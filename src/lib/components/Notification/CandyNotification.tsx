import React, { forwardRef } from "react";
import "./CandyNotification.css";

export interface CandyNotificationProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "title"
> {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  onClose?: () => void;
  closeLabel?: string;
}

function NotificationIcon() {
  return (
    <svg viewBox="0 0 28 28" fill="none">
      <path
        d="M7 12a7 7 0 0 1 14 0v5l3 4H4l3-4Z"
        fill="var(--candy-yellow, #ffd51c)"
        stroke="var(--candy-outline, #10234b)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M11 24q3 3 6 0M14 3V1"
        stroke="var(--candy-outline, #10234b)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10 12q0-4 4-4"
        stroke="#fff7bf"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const CandyNotification = forwardRef<
  HTMLElement,
  CandyNotificationProps
>(
  (
    {
      title,
      description,
      icon,
      action,
      onClose,
      closeLabel = "Dismiss notification",
      children,
      className = "",
      role = "status",
      ...rest
    },
    ref,
  ) => (
    <article
      ref={ref}
      role={role}
      className={`candy-notification ${className}`.trim()}
      {...rest}
    >
      {icon !== null && (
        <span className="candy-notification-icon" aria-hidden="true">
          {icon ?? <NotificationIcon />}
        </span>
      )}
      <div className="candy-notification-content">
        <h3 className="candy-notification-title">{title}</h3>
        {description && (
          <p className="candy-notification-description">{description}</p>
        )}
        {children}
        {action && <div className="candy-notification-action">{action}</div>}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="candy-notification-close"
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
    </article>
  ),
);

CandyNotification.displayName = "CandyNotification";
