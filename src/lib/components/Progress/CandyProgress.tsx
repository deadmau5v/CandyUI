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
  variant = "blue",
  striped = false,
  showLabel = true,
  height = 24,
  icon,
  sparkle = false,
  className = "",
  style,
  ...rest
}) => {
  const safeMax = Number.isFinite(max) && max > 0 ? max : 0;
  const safeValue = Number.isFinite(value) ? Math.max(0, Math.min(safeMax, value)) : 0;
  const percentage = safeMax > 0 ? (safeValue / safeMax) * 100 : 0;

  let labelText = "";
  if (typeof showLabel === "function") {
    labelText = showLabel(safeValue, safeMax);
  } else if (showLabel) {
    labelText = `${Math.round(safeValue)} / ${safeMax}`;
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
      aria-valuemax={safeMax}
      aria-valuenow={safeValue}
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
          <span aria-hidden="true">{icon}</span>
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
