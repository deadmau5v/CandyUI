import React from "react";
import { CandyColor } from "../../types";
import "./CandyFloatingText.css";

export interface FloatingItem {
  id: string;
  text: string;
  x: number;
  y: number;
  color?: CandyColor;
}

export interface CandyFloatingTextProps {
  item: FloatingItem;
  onComplete?: (id: string) => void;
}

export const CandyFloatingText: React.FC<CandyFloatingTextProps> = ({
  item,
  onComplete,
}) => {
  const color = item.color || "yellow";
  const currentTheme = {
    color:
      color === "blue"
        ? "var(--candy-primary, var(--candy-blue))"
        : color === "ghost"
          ? "var(--candy-surface)"
          : `var(--candy-${color})`,
    stroke: "var(--candy-outline)",
  };

  return (
    <div
      className="candy-floating-text"
      style={{
        left: item.x,
        top: item.y,
        color: currentTheme.color,
        textShadow: `
          -1px -1px 0 ${currentTheme.stroke},
           1px -1px 0 ${currentTheme.stroke},
          -1px  1px 0 ${currentTheme.stroke},
           1px  1px 0 ${currentTheme.stroke},
           0 1px 0 var(--candy-outline)
        `,
      }}
      onAnimationEnd={() => onComplete?.(item.id)}
    >
      {item.text}
    </div>
  );
};
