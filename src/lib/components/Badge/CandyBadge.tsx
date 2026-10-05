import React from "react";
import { CandyColor } from "../../types";
import "./CandyBadge.css";

export interface CandyBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: CandyColor;
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  pulse?: boolean;
}

export const CandyBadge: React.FC<CandyBadgeProps> = ({
  children,
  variant = "pink",
  size = "md",
  icon,
  pulse = false,
  className = "",
  style,
  ...rest
}) => {
  const classes = [
    "candy-badge",
    `candy-badge-${variant}`,
    `candy-badge-${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      className={classes}
      style={{
        animation: pulse
          ? "candyBadgePulse 1.5s infinite ease-in-out"
          : undefined,
        ...style,
      }}
      {...rest}
    >
      {icon && <span style={{ display: "inline-flex" }}>{icon}</span>}
      {children}
    </span>
  );
};
