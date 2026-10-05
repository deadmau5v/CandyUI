import React, { forwardRef } from "react";
import { CandyColor, CandySize, CandyShape } from "../../types";
import { useCandy } from "../../context/CandyProvider";
import { CandySoundType } from "../../sound/audio";
import "./CandyButton.css";

export interface CandyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: CandyColor;
  size?: CandySize;
  shape?: CandyShape;
  sound?: CandySoundType | false;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const CandyButton = forwardRef<HTMLButtonElement, CandyButtonProps>(
  (
    {
      children,
      variant = "blue",
      size = "md",
      shape = "pill",
      sound = "pop",
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = "",
      onClick,
      disabled,
      style,
      type = "button",
      ...rest
    },
    ref,
  ) => {
    const { playSound } = useCandy();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      if (sound) {
        playSound(sound);
      }
      onClick?.(e);
    };

    const classes = [
      "candy-btn",
      `candy-btn-${variant}`,
      `candy-btn-${size}`,
      `candy-btn-${shape}`,
      fullWidth ? "w-full" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={disabled}
        onClick={handleClick}
        style={{
          width: fullWidth ? "100%" : undefined,
          ...style,
        }}
        {...rest}
      >
        {leftIcon && (
          <span
            className="candy-btn-icon candy-btn-icon-left"
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        )}
        {children}
        {rightIcon && (
          <span
            className="candy-btn-icon candy-btn-icon-right"
            aria-hidden="true"
          >
            {rightIcon}
          </span>
        )}
      </button>
    );
  },
);

CandyButton.displayName = "CandyButton";
