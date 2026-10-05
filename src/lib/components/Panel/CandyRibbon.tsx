import React from "react";
import "./CandyPanel.css";

export type CandyRibbonColor = "gold" | "pink" | "blue" | "green";

export interface CandyRibbonProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: CandyRibbonColor;
  icon?: React.ReactNode;
}

/**
 * Game-style title banner: an arched band with folded tails behind it.
 * The shape is an SVG stretched horizontally (non-scaling strokes keep the
 * outline crisp at every width); text sits on top as real, selectable HTML.
 * The styles in CandyPanel.css (.candy-ribbon-shape ...) depend on this markup.
 */
export const CandyRibbon: React.FC<CandyRibbonProps> = ({
  children,
  color = "blue",
  icon,
  className = "",
  style,
  ...rest
}) => {
  return (
    <div className="candy-ribbon-container">
      <div
        className={["candy-ribbon", `candy-ribbon-${color}`, className]
          .filter(Boolean)
          .join(" ")}
        style={style}
        {...rest}
      >
        <svg
          className="candy-ribbon-shape"
          viewBox="0 0 400 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          {/* Tails (behind the band) */}
          <path
            className="candy-ribbon-tail"
            d="M9 38 L70 30 L70 86 L13 94 Q4 95 4 87 L4 45 Q4 39 9 38 Z"
          />
          <path
            className="candy-ribbon-tail"
            d="M391 38 L330 30 L330 86 L387 94 Q396 95 396 87 L396 45 Q396 39 391 38 Z"
          />
          {/* Folds where the band tucks behind the tails */}
          <path className="candy-ribbon-fold" d="M30 76 L70 92 L70 72 Z" />
          <path className="candy-ribbon-fold" d="M370 76 L330 92 L330 72 Z" />
          {/* Main arched band */}
          <path
            className="candy-ribbon-band"
            d="M28 22 Q200 -12 372 22 L372 80 Q200 46 28 80 Z"
          />
          {/* Top highlight + bottom shade (dual inner light like buttons) */}
          <path
            className="candy-ribbon-highlight"
            d="M30 24 Q200 -9 370 24 L370 40 Q200 7 30 40 Z"
          />
          <path
            className="candy-ribbon-shade"
            d="M30 70 Q200 37 370 70 L370 78 Q200 45 30 78 Z"
          />
          {/* Inner rim line */}
          <path
            className="candy-ribbon-rim"
            d="M38 29 Q200 -3 362 29 L362 71 Q200 39 38 71 Z"
          />
          {/* Crisp outline drawn last so it sits above the inner layers */}
          <path
            className="candy-ribbon-outline"
            d="M28 22 Q200 -12 372 22 L372 80 Q200 46 28 80 Z"
          />
        </svg>
        <span className="candy-ribbon-content">
          {icon && <span className="candy-ribbon-icon">{icon}</span>}
          <span className="candy-ribbon-text">{children}</span>
        </span>
      </div>
    </div>
  );
};
