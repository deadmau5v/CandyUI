import React, { useRef, useCallback } from "react";
import { CandyColor } from "../../types";
import "./CandySlider.css";

export interface CandySliderProps {
  "aria-label"?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  color?: CandyColor;
  onChange: (val: number) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const CandySlider: React.FC<CandySliderProps> = ({
  value,
  "aria-label": ariaLabel = "Value",
  min = 0,
  max = 100,
  step = 1,
  color = "blue",
  onChange,
  disabled = false,
  className = "",
  style,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const percentage =
    max > min
      ? Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))
      : 0;

  const updateFromPosition = useCallback(
    (clientX: number) => {
      if (!trackRef.current || disabled) return;
      const rect = trackRef.current.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const ratio = Math.max(0, Math.min(1, relativeX / rect.width));
      let rawVal = min + ratio * (max - min);
      if (step > 0) {
        rawVal = min + Math.round((rawVal - min) / step) * step;
      }
      onChange(Math.max(min, Math.min(max, rawVal)));
    },
    [disabled, min, max, step, onChange],
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateFromPosition(e.clientX);

    const onPointerMove = (moveEvt: PointerEvent) => {
      updateFromPosition(moveEvt.clientX);
    };

    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  return (
    <div
      ref={trackRef}
      className={`candy-slider-root candy-slider-${color} ${className}`}
      role="slider"
      aria-label={ariaLabel}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={Math.max(min, Math.min(max, value))}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(event) => {
        if (disabled) return;
        const increment = step > 0 ? step : 1;
        const changes: Record<string, number> = {
          ArrowRight: value + increment,
          ArrowUp: value + increment,
          ArrowLeft: value - increment,
          ArrowDown: value - increment,
          Home: min,
          End: max,
          PageUp: value + increment * 10,
          PageDown: value - increment * 10,
        };
        if (event.key in changes) {
          event.preventDefault();
          onChange(Math.max(min, Math.min(max, changes[event.key])));
        }
      }}
      onPointerDown={handlePointerDown}
      style={style}
    >
      <div className="candy-slider-track">
        <div
          className="candy-slider-range"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
      <div
        className="candy-slider-thumb"
        style={{
          left: `${percentage}%`,
        }}
      />
    </div>
  );
};
