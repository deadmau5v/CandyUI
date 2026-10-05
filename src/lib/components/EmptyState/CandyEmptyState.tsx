import React, { forwardRef } from "react";
import "./CandyEmptyState.css";

export interface CandyEmptyStateProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "title"
> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

function EmptyIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none">
      <path
        d="m11 28 10-10h22l10 10v24H11Z"
        fill="var(--candy-blue-light, #eaf2ff)"
        stroke="var(--candy-outline, #10234b)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M11 28h13l4 7h8l4-7h13M21 18l5 10m17-10-5 10"
        stroke="var(--candy-outline, #10234b)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M21 46h22"
        stroke="var(--candy-border, #c1cfdf)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M32 7v4m-14 1 3 3m25-3-3 3"
        stroke="var(--candy-primary, #0068f0)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const CandyEmptyState = forwardRef<HTMLDivElement, CandyEmptyStateProps>(
  (
    {
      title = "Nothing here yet",
      description,
      icon,
      action,
      children,
      className = "",
      ...rest
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={`candy-empty-state ${className}`.trim()}
      {...rest}
    >
      {icon !== null && (
        <span className="candy-empty-state-icon" aria-hidden="true">
          {icon ?? <EmptyIcon />}
        </span>
      )}
      <h3 className="candy-empty-state-title">{title}</h3>
      {description && (
        <p className="candy-empty-state-description">{description}</p>
      )}
      {children && <div className="candy-empty-state-content">{children}</div>}
      {action && <div className="candy-empty-state-action">{action}</div>}
    </div>
  ),
);

CandyEmptyState.displayName = "CandyEmptyState";
