import React, { forwardRef, useId } from "react";
import { useCandy } from "../../context/CandyProvider";
import { CandyColor } from "../../types";
import "./CandySwitch.css";

export interface CandySwitchProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "color"
> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  color?: CandyColor;
  label?: React.ReactNode;
  sound?: boolean;
  iconOn?: React.ReactNode;
  iconOff?: React.ReactNode;
}

export const CandySwitch = forwardRef<HTMLButtonElement, CandySwitchProps>(
  ({ checked, onChange, color = "blue", label, disabled = false, sound = true,
    iconOn, iconOff, className = "", style, onClick, "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy, ...rest }, ref) => {
    const { playSound } = useCandy();
    const labelId = useId();
    const accent = color === "blue" ? "var(--candy-primary)" : color === "ghost" ? "var(--candy-text-muted)" : `var(--candy-${color})`;
    const toggle = (
      <button
        {...rest}
        ref={ref}
        type="button"
        role="switch"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy || (!ariaLabel && label ? labelId : undefined)}
        aria-checked={checked}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        className={["candy-switch", checked ? "candy-switch-checked" : "", className].filter(Boolean).join(" ")}
        style={{ "--candy-switch-accent": accent, ...style } as React.CSSProperties}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented || disabled) return;
          if (sound) playSound("toggle");
          onChange(!checked);
        }}
      >
        <span className="candy-switch-thumb" aria-hidden="true">{checked ? iconOn : iconOff}</span>
      </button>
    );
    return label ? <span className="candy-switch-control">{toggle}<span id={labelId}>{label}</span></span> : toggle;
  },
);
CandySwitch.displayName = "CandySwitch";
