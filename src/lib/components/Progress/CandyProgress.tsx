import React from "react";
import { CandyColor } from "../../types";
import "./CandyProgress.css";

export interface CandyProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: CandyColor;
  striped?: boolean;
  showLabel?: boolean | ((val: number, maxVal: number) => string);
  height?: number;
  icon?: React.ReactNode;
  sparkle?: boolean;
}

export const CandyProgress: React.FC<CandyProgressProps> = ({
  value,
  max = 100,
  variant = "green",
  striped = true,
  showLabel = true,
  height = 24,
  icon,
  sparkle = true,
  className = "",
  style,
  ...rest
}) => {
  const percentage =
    max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;

  let labelText = "";
  if (typeof showLabel === "function") {
    labelText = showLabel(value, max);
  } else if (showLabel) {
    labelText = `${Math.round(value)} / ${max}`;
  }

  const containerClasses = [
    "candy-progress",
    `candy-progress-${variant}`,
    striped ? "candy-progress-striped" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={Math.max(0, max)}
      aria-valuenow={Math.max(0, Math.min(Math.max(0, max), value))}
      className={containerClasses}
      style={{
        height,
        ["--candy-progress-height" as any]:
          typeof height === "number" ? `${height}px` : height,
        ...style,
      }}
      {...rest}
    >
      {icon && (
        <div
          style={{
            position: "absolute",
            left: 4,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </div>
      )}

      <div
        className="candy-progress-track"
        style={{
          width: `${percentage}%`,
        }}
      >
        {sparkle && percentage > 5 && percentage < 98 && (
          <div className="candy-progress-marker" />
        )}
      </div>

      {labelText && (
        <div className="candy-progress-label">
          <span>{labelText}</span>
        </div>
      )}
    </div>
  );
};
