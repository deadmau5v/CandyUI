import React, { forwardRef } from "react";
import "./CandyStatusBadge.css";

export type CandyStatus =
  "online" | "playing" | "offline" | "away" | "host" | "admin" | "full";

export interface CandyStatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: CandyStatus;
  label?: React.ReactNode;
  icon?: React.ReactNode;
  size?: "sm" | "md";
}

const labels: Record<CandyStatus, string> = {
  online: "Online",
  playing: "In game",
  offline: "Offline",
  away: "Away",
  host: "Host",
  admin: "Admin",
  full: "Full",
};

function StatusIcon({ status }: { status: CandyStatus }) {
  switch (status) {
    case "online":
      return <circle cx="8" cy="8" r="5" fill="currentColor" />;
    case "playing":
      return <path d="m5 3 8 5-8 5Z" fill="currentColor" />;
    case "offline":
      return (
        <>
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" />
          <path d="m5 5 6 6m0-6-6 6" stroke="currentColor" strokeWidth="1.5" />
        </>
      );
    case "away":
      return (
        <path d="M10 2a6 6 0 1 0 4 8 6 6 0 0 1-4-8Z" fill="currentColor" />
      );
    case "host":
      return <path d="m2 5 4 3 2-6 2 6 4-3-1 9H3Z" fill="currentColor" />;
    case "admin":
      return (
        <>
          <path d="m8 1 6 3v4q-1 5-6 7-5-2-6-7V4Z" fill="currentColor" />
          <path
            d="m5 8 2 2 4-4"
            stroke="var(--candy-surface, white)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      );
    case "full":
      return (
        <>
          <circle cx="8" cy="8" r="6" fill="currentColor" />
          <path
            d="m4.5 8 2.5 2.5L11.5 6"
            stroke="var(--candy-surface, white)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      );
  }
}

export const CandyStatusBadge = forwardRef<
  HTMLSpanElement,
  CandyStatusBadgeProps
>(
  (
    {
      status = "online",
      label,
      icon,
      size = "md",
      children,
      className = "",
      ...rest
    },
    ref,
  ) => (
    <span
      ref={ref}
      className={`candy-status-badge candy-status-badge-${status} candy-status-badge-${size} ${className}`.trim()}
      {...rest}
    >
      <span className="candy-status-badge-icon" aria-hidden="true">
        {icon ?? (
          <svg viewBox="0 0 16 16" fill="none">
            <StatusIcon status={status} />
          </svg>
        )}
      </span>
      <span>{children ?? label ?? labels[status]}</span>
    </span>
  ),
);

CandyStatusBadge.displayName = "CandyStatusBadge";
