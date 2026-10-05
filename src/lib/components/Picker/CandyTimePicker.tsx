import React, { forwardRef } from "react";
import { CandyInput, CandyInputProps } from "../Input/CandyInput";
import "./CandyPicker.css";

export interface CandyTimePickerProps extends Omit<
  CandyInputProps,
  "type" | "leftIcon" | "rightIcon" | "clearable"
> {}

export const CandyTimePicker = forwardRef<
  HTMLInputElement,
  CandyTimePickerProps
>(({ className = "", label, ...rest }, ref) => (
  <CandyInput
    {...rest}
    ref={ref}
    type="time"
    label={label}
    aria-label={rest["aria-label"] || (label ? undefined : "Time")}
    className={`candy-picker candy-time-picker ${className}`}
    leftIcon={
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    }
  />
));

CandyTimePicker.displayName = "CandyTimePicker";
