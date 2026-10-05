import React, { forwardRef } from "react";
import "./CandySteps.css";

export interface CandyStepItem {
  label: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface CandyStepsProps extends React.HTMLAttributes<HTMLOListElement> {
  items: CandyStepItem[];
  current: number;
  onStepChange?: (step: number) => void;
  orientation?: "horizontal" | "vertical";
}

export const CandySteps = forwardRef<HTMLOListElement, CandyStepsProps>(
  (
    {
      items,
      current,
      onStepChange,
      orientation = "horizontal",
      className = "",
      "aria-label": ariaLabel = "Progress steps",
      ...rest
    },
    ref,
  ) => {
    const active = Number.isFinite(current)
      ? Math.max(0, Math.min(items.length, Math.floor(current)))
      : 0;
    return (
      <ol
        {...rest}
        ref={ref}
        aria-label={ariaLabel}
        className={`candy-steps candy-steps-${orientation} ${className}`.trim()}
      >
        {items.map((item, index) => {
          const completed = index < active;
          const status = completed
            ? "completed"
            : index === active
              ? "current"
              : "upcoming";
          const content = (
            <>
              <span className="candy-step-marker" aria-hidden="true">
                {completed ? (
                  <svg viewBox="0 0 18 18" width="18" height="18" fill="none">
                    <path
                      d="m4 9 3.5 3.5 6.5-7"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  (item.icon ?? index + 1)
                )}
              </span>
              <span className="candy-step-content">
                <span className="candy-step-label">{item.label}</span>
                {item.description && (
                  <span className="candy-step-description">
                    {item.description}
                  </span>
                )}
                <span className="candy-step-sr-only">
                  {status === "completed"
                    ? "Completed"
                    : status === "current"
                      ? "Current step"
                      : "Upcoming step"}
                </span>
              </span>
            </>
          );
          return (
            <li
              key={index}
              className={`candy-step candy-step-${status}`}
              aria-current={status === "current" ? "step" : undefined}
            >
              {onStepChange ? (
                <button
                  type="button"
                  className="candy-step-inner"
                  disabled={item.disabled}
                  onClick={() => onStepChange(index)}
                >
                  {content}
                </button>
              ) : (
                <div className="candy-step-inner">{content}</div>
              )}
            </li>
          );
        })}
      </ol>
    );
  },
);

CandySteps.displayName = "CandySteps";
