import React from "react";
import { useCandy } from "../../context/CandyProvider";
import "./CandySwitch.css";

export interface CandySwitchProps {
  "aria-label"?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  sound?: boolean;
  iconOn?: React.ReactNode;
  iconOff?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const CandySwitch: React.FC<CandySwitchProps> = ({
  checked,
  "aria-label": ariaLabel,
  onChange,
  disabled = false,
  sound = true,
  iconOn,
  iconOff,
  className = "",
  style,
}) => {
  const { playSound } = useCandy();

  const handleToggle = () => {
    if (disabled) return;
    if (sound) {
      playSound("toggle");
    }
    onChange(!checked);
  };

  const classes = [
    "candy-switch",
    checked ? "candy-switch-checked" : "",
    disabled ? "opacity-50 cursor-not-allowed" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      role="switch"
      aria-label={ariaLabel}
      aria-checked={checked}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      className={classes}
      onClick={handleToggle}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          handleToggle();
        }
      }}
      style={style}
    >
      <div className="candy-switch-thumb">{checked ? iconOn : iconOff}</div>
    </div>
  );
};
