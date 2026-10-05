import React from "react";
import { CandyColor } from "../../types";
import { CandyIconButton } from "../Button/CandyIconButton";
import { CandyGameIcon } from "../GameIcon/CandyGameIcon";
import "./CandyCounter.css";

export interface CandyCounterProps {
  value: number | string;
  icon: React.ReactNode;
  iconBg?: CandyColor;
  onPlusClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const CandyCounter: React.FC<CandyCounterProps> = ({
  value,
  icon,
  iconBg = "yellow",
  onPlusClick,
  className = "",
  style,
}) => {
  const background =
    iconBg === "blue"
      ? "var(--candy-primary, var(--candy-blue))"
      : iconBg === "ghost"
        ? "var(--candy-track)"
        : `var(--candy-${iconBg})`;
  const iconColor =
    iconBg === "blue"
      ? "var(--candy-primary-text, var(--candy-blue-text))"
      : iconBg === "ghost"
        ? "var(--candy-text)"
        : `var(--candy-${iconBg}-text)`;

  return (
    <div className={`candy-counter ${className}`} style={style}>
      <div
        className="candy-counter-icon"
        style={{
          background,
          color: iconColor,
        }}
      >
        {icon}
      </div>

      <span className="candy-counter-value">
        {typeof value === "number" ? value.toLocaleString() : value}
      </span>

      {onPlusClick && (
        <CandyIconButton
          aria-label="Add"
          size="xs"
          variant="green"
          shape="circle"
          sound="coin"
          onClick={onPlusClick}
          icon={<CandyGameIcon name="plus" size={12} color="#194a2b" />}
        />
      )}
    </div>
  );
};
