import React, { forwardRef } from "react";
import { CandyButton, CandyButtonProps } from "./CandyButton";

export interface CandyIconButtonProps extends Omit<
  CandyButtonProps,
  "leftIcon" | "rightIcon"
> {
  icon: React.ReactNode;
  "aria-label": string;
}

export const CandyIconButton = forwardRef<
  HTMLButtonElement,
  CandyIconButtonProps
>(
  (
    { icon, shape = "circle", size = "md", sound = "click", style, ...rest },
    ref,
  ) => {
    const sizeMap = {
      xs: { width: 32, height: 32, minWidth: 32, minHeight: 32, padding: 0 },
      sm: { width: 40, height: 40, minWidth: 40, minHeight: 40, padding: 0 },
      md: { width: 52, height: 52, minWidth: 52, minHeight: 52, padding: 0 },
      lg: { width: 64, height: 64, minWidth: 64, minHeight: 64, padding: 0 },
      xl: { width: 76, height: 76, minWidth: 76, minHeight: 76, padding: 0 },
    };

    const dimensions = sizeMap[size] || sizeMap.md;

    return (
      <CandyButton
        ref={ref}
        shape={shape}
        size={size}
        sound={sound}
        style={{
          ...dimensions,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          ...style,
        }}
        {...rest}
      >
        {icon}
      </CandyButton>
    );
  },
);

CandyIconButton.displayName = "CandyIconButton";
