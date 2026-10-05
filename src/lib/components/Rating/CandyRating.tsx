import React, { forwardRef, useState, useId, useCallback } from "react";
import { CandySize } from "../../types";
import { useCandy } from "../../context/CandyProvider";
import { CandySoundType } from "../../sound/audio";
import "./CandyRating.css";

export type CandyRatingSize = "xs" | "sm" | "md" | "lg" | "xl" | CandySize;

export interface CandyRatingIconProps {
  /** 0-based star index */
  index: number;
  /** Current actual rating value */
  value: number;
  /** Current hovered rating value if hovering */
  hoverValue?: number;
  /** Whether this star has active highlight (filled or hovered) */
  active: boolean;
  /** Whether this star is filled (or partially filled) */
  filled: boolean;
  /** Whether this star is half-filled */
  half?: boolean;
  /** Whether the rating is currently in hover state */
  hover: boolean;
  /** Whether the rating component is disabled */
  disabled?: boolean;
  /** Whether the rating component is read-only */
  readOnly?: boolean;
  /** Rating size */
  size?: CandyRatingSize;
}

export interface CandyRatingProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  /** Controlled rating value */
  value?: number;
  /** Initial rating value when uncontrolled */
  defaultValue?: number;
  /** Change callback */
  onChange?: (value: number) => void;
  /** Hover preview change callback */
  onHoverChange?: (hoverValue: number) => void;
  /** Total number of stars (default: 5) */
  max?: number;
  /** Read-only mode */
  readOnly?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Component size: xs, sm, md, lg, xl (default: md) */
  size?: CandyRatingSize;
  /** Allow half star rating (default: false) */
  allowHalf?: boolean;
  /** Allow clearing to 0 by clicking current value (default: true) */
  allowClear?: boolean;
  /** Custom icon node or render function */
  icon?: React.ReactNode | ((props: CandyRatingIconProps) => React.ReactNode);
  /** Sound effect on interaction (default: 'star') */
  sound?: CandySoundType | boolean;
  /** Form field name for native form submission */
  name?: string;
}

export interface CandyStarsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of achieved stars (alias: value) */
  count?: number;
  /** Alias for count */
  value?: number;
  /** Total number of stars (default: 3) */
  max?: number;
  /** Component size (default: sm) */
  size?: CandyRatingSize;
  /** Whether to play celebratory pop-in animation (default: true) */
  animated?: boolean;
  /** Whether to display center star elevated in an arch (default: false) */
  arched?: boolean;
}

/**
 * Rounded 5-pointed star SVG path with friendly curved vertices.
 */
const STAR_PATH =
  "M 15.34 4.66 Q 16.00 3.20 16.66 4.66 L 19.19 10.18 Q 19.64 11.18 20.74 11.31 L 26.77 12.00 Q 28.36 12.18 27.18 13.26 L 22.71 17.37 Q 21.90 18.12 22.12 19.19 L 23.32 25.15 Q 23.64 26.72 22.25 25.93 L 16.96 22.94 Q 16.00 22.40 15.04 22.94 L 9.75 25.93 Q 8.36 26.72 8.68 25.15 L 9.88 19.19 Q 10.10 18.12 9.29 17.37 L 4.82 13.26 Q 3.64 12.18 5.23 12.00 L 11.26 11.31 Q 12.36 11.18 12.81 10.18 Z";

interface CandyStarSvgProps {
  filled: boolean;
  idPrefix: string;
  className?: string;
}

/**
 * High-gloss candy star SVG with deep navy outline and golden inner-shadow gradient.
 */
const CandyStarSvg: React.FC<CandyStarSvgProps> = ({
  filled,
  idPrefix,
  className = "",
}) => {
  const goldGradId = `${idPrefix}-gold`;
  const emptyGradId = `${idPrefix}-empty`;

  return (
    <svg
      viewBox="0 0 32 32"
      className={`candy-rating-svg ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Golden inner-shadow gradient for lit stars */}
        <linearGradient id={goldGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF8A0" />
          <stop offset="28%" stopColor="#FFCB05" />
          <stop offset="72%" stopColor="#FFA000" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        {/* Empty star track gradient */}
        <linearGradient id={emptyGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="var(--candy-track, #eaf0f8)" />
          <stop offset="100%" stopColor="var(--candy-panel-shadow, #cbdde9)" />
        </linearGradient>
      </defs>

      {/* 3D bottom drop shadow layer (Navy outline depth) */}
      <path
        d={STAR_PATH}
        transform="translate(0, 1.8)"
        fill="var(--candy-outline, #12427a)"
        stroke="var(--candy-outline, #12427a)"
        strokeWidth="2.4"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity={filled ? 0.95 : 0.45}
      />

      {/* Main star body */}
      <path
        d={STAR_PATH}
        fill={filled ? `url(#${goldGradId})` : `url(#${emptyGradId})`}
        stroke="var(--candy-outline, #12427a)"
        strokeWidth="2.4"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Golden star juicy highlights & inner bottom shadow */}
      {filled ? (
        <>
          {/* Inner bottom shadow rim */}
          <path
            d="M 9.75 25.93 Q 16.00 22.40 22.25 25.93 L 23.32 25.15 Q 16.00 21.00 8.68 25.15 Z"
            fill="rgba(180, 83, 9, 0.4)"
            pointerEvents="none"
          />
          {/* Top-left jelly gloss highlight */}
          <ellipse
            cx="14"
            cy="11.5"
            rx="3.6"
            ry="1.6"
            transform="rotate(-28 14 11.5)"
            fill="#FFFFFF"
            fillOpacity="0.82"
            pointerEvents="none"
          />
          {/* Micro sparkle dot */}
          <circle
            cx="19.2"
            cy="11.8"
            r="1.1"
            fill="#FFFFFF"
            fillOpacity="0.75"
            pointerEvents="none"
          />
        </>
      ) : (
        /* Empty star subtle top gloss */
        <ellipse
          cx="14"
          cy="11.5"
          rx="3.2"
          ry="1.4"
          transform="rotate(-28 14 11.5)"
          fill="#FFFFFF"
          fillOpacity="0.45"
          pointerEvents="none"
        />
      )}
    </svg>
  );
};

/**
 * CandyRating - Interactive star rating component with candy game aesthetics.
 */
export const CandyRating = forwardRef<HTMLDivElement, CandyRatingProps>(
  (
    {
      value,
      defaultValue = 0,
      onChange,
      onHoverChange,
      max = 5,
      readOnly = false,
      disabled = false,
      size = "md",
      allowHalf = false,
      allowClear = true,
      icon,
      sound = true,
      name,
      className = "",
      style,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) => {
    const componentId = useId().replace(/:/g, "");
    const { playSound } = useCandy();

    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState<number>(defaultValue);
    const currentValue = isControlled ? (value ?? 0) : internalValue;

    const [hoverValue, setHoverValue] = useState<number | null>(null);
    const displayValue = hoverValue !== null ? hoverValue : currentValue;

    // Track bounce animation keys for newly lit stars
    const [bouncingIndices, setBouncingIndices] = useState<
      Record<number, number>
    >({});

    const triggerBounce = useCallback((fromVal: number, toVal: number) => {
      if (toVal > fromVal) {
        const start = Math.floor(fromVal);
        const end = Math.ceil(toVal);
        setBouncingIndices((prev) => {
          const next = { ...prev };
          for (let i = start; i < end; i++) {
            next[i] = (next[i] || 0) + 1;
          }
          return next;
        });
      } else if (toVal > 0) {
        const target = Math.ceil(toVal) - 1;
        setBouncingIndices((prev) => ({
          ...prev,
          [target]: (prev[target] || 0) + 1,
        }));
      }
    }, []);

    const handleStarClick = (
      index: number,
      e: React.MouseEvent<HTMLDivElement>,
    ) => {
      if (disabled || readOnly) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const isLeftHalf = e.clientX - rect.left < rect.width / 2;
      const targetVal = allowHalf && isLeftHalf ? index + 0.5 : index + 1;
      const nextVal = allowClear && targetVal === currentValue ? 0 : targetVal;

      if (sound) {
        playSound(typeof sound === "string" ? sound : "star");
      }

      triggerBounce(currentValue, nextVal);

      if (!isControlled) {
        setInternalValue(nextVal);
      }
      onChange?.(nextVal);
    };

    const handleStarMouseMove = (
      index: number,
      e: React.MouseEvent<HTMLDivElement>,
    ) => {
      if (disabled || readOnly) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const isLeftHalf = e.clientX - rect.left < rect.width / 2;
      const newHover = allowHalf && isLeftHalf ? index + 0.5 : index + 1;
      if (hoverValue !== newHover) {
        setHoverValue(newHover);
        onHoverChange?.(newHover);
      }
    };

    const handleMouseLeave = () => {
      if (disabled || readOnly) return;
      if (hoverValue !== null) {
        setHoverValue(null);
        onHoverChange?.(0);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled || readOnly) return;
      const step = allowHalf ? 0.5 : 1;
      const minVal = allowClear ? 0 : step;
      let nextVal: number | null = null;

      switch (e.key) {
        case "ArrowRight":
        case "ArrowUp":
          e.preventDefault();
          nextVal = Math.min(max, currentValue + step);
          break;
        case "ArrowLeft":
        case "ArrowDown":
          e.preventDefault();
          nextVal = Math.max(minVal, currentValue - step);
          break;
        case "Home":
          e.preventDefault();
          nextVal = minVal;
          break;
        case "End":
          e.preventDefault();
          nextVal = max;
          break;
        default:
          break;
      }

      if (nextVal !== null && nextVal !== currentValue) {
        if (sound) {
          playSound(typeof sound === "string" ? sound : "star");
        }
        triggerBounce(currentValue, nextVal);
        if (!isControlled) {
          setInternalValue(nextVal);
        }
        onChange?.(nextVal);
      }
    };

    const renderStarIcon = (
      index: number,
      filled: boolean,
      half: boolean,
      active: boolean,
    ) => {
      const iconState: CandyRatingIconProps = {
        index,
        value: currentValue,
        hoverValue: hoverValue ?? undefined,
        active,
        filled,
        half,
        hover: hoverValue !== null,
        disabled,
        readOnly,
        size,
      };

      if (typeof icon === "function") {
        return icon(iconState);
      }
      if (icon) {
        return icon;
      }

      return (
        <CandyStarSvg
          filled={filled}
          idPrefix={`${componentId}-${index}-${filled ? "f" : "e"}`}
        />
      );
    };

    const classes = [
      "candy-rating",
      `candy-rating-${size}`,
      disabled ? "candy-rating-disabled" : "",
      readOnly ? "candy-rating-readonly" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-valuenow={currentValue}
        aria-valuemin={allowClear ? 0 : allowHalf ? 0.5 : 1}
        aria-valuemax={max}
        aria-valuetext={`${currentValue} of ${max} stars`}
        aria-label={ariaLabel || "Rating"}
        aria-disabled={disabled || undefined}
        aria-readonly={readOnly || undefined}
        className={classes}
        style={style}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {Array.from({ length: max }, (_, index) => {
          const diff = displayValue - index;
          let fillPercentage = 0;
          if (diff >= 1) {
            fillPercentage = 100;
          } else if (diff >= 0.5 && allowHalf) {
            fillPercentage = 50;
          } else if (diff > 0 && allowHalf) {
            fillPercentage = Math.round(diff * 100);
          }

          const isFilled = fillPercentage > 0;
          const isHalf = fillPercentage > 0 && fillPercentage < 100;
          const bounceKey = bouncingIndices[index];

          return (
            <div
              key={`${index}-${bounceKey || 0}`}
              className={`candy-rating-star ${
                bounceKey ? "candy-rating-star-bounce" : ""
              }`}
              onClick={(e) => handleStarClick(index, e)}
              onMouseMove={(e) => handleStarMouseMove(index, e)}
              aria-hidden="true"
            >
              <div className="candy-rating-star-box">
                {/* Background unfilled star */}
                <div className="candy-rating-star-empty">
                  {renderStarIcon(index, false, false, false)}
                </div>

                {/* Foreground filled/half star overlay */}
                {fillPercentage > 0 && (
                  <div
                    className="candy-rating-star-fill"
                    style={{ width: `${fillPercentage}%` }}
                  >
                    <div className="candy-rating-star-fill-inner">
                      {renderStarIcon(index, true, isHalf, isFilled)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {name && (
          <input
            type="hidden"
            name={name}
            value={currentValue}
            disabled={disabled}
          />
        )}
      </div>
    );
  },
);

CandyRating.displayName = "CandyRating";

/**
 * CandyStars - Read-only 0-3 star display for game level victory/settlement banners.
 */
export const CandyStars = forwardRef<HTMLDivElement, CandyStarsProps>(
  (
    {
      count,
      value,
      max = 3,
      size = "sm",
      animated = true,
      arched = false,
      className = "",
      style,
      "aria-label": ariaLabel,
      ...rest
    },
    ref,
  ) => {
    const componentId = useId().replace(/:/g, "");
    const activeCount = count ?? value ?? 0;

    const classes = [
      "candy-stars",
      `candy-stars-${size}`,
      arched ? "candy-stars-arched" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        role="img"
        aria-label={ariaLabel || `${activeCount} of ${max} stars`}
        className={classes}
        style={style}
        {...rest}
      >
        {Array.from({ length: max }, (_, index) => {
          const isFilled = index < activeCount;
          return (
            <div
              key={index}
              className={`candy-stars-star ${
                isFilled ? "candy-stars-star-active" : "candy-stars-star-empty"
              } ${animated ? "candy-stars-star-animated" : ""}`}
              style={
                {
                  "--candy-star-delay": index,
                } as React.CSSProperties
              }
            >
              <CandyStarSvg
                filled={isFilled}
                idPrefix={`${componentId}-settle-${index}-${isFilled ? "f" : "e"}`}
              />
            </div>
          );
        })}
      </div>
    );
  },
);

CandyStars.displayName = "CandyStars";
