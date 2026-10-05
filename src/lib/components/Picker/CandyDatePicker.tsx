import React, { forwardRef } from "react";
import { CandyInput, CandyInputProps } from "../Input/CandyInput";
import "./CandyPicker.css";

export interface CandyDatePickerProps extends Omit<
  CandyInputProps,
  "type" | "leftIcon" | "rightIcon" | "clearable"
> {}

export const CandyDatePicker = forwardRef<
  HTMLInputElement,
  CandyDatePickerProps
>(({ className = "", label, ...rest }, ref) => (
  <CandyInput
    {...rest}
    ref={ref}
    type="date"
    label={label}
    aria-label={rest["aria-label"] || (label ? undefined : "Date")}
    className={`candy-picker candy-date-picker ${className}`}
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
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 11h18M8 15h.01M12 15h.01M16 15h.01M8 18h.01M12 18h.01" />
      </svg>
    }
  />
));

CandyDatePicker.displayName = "CandyDatePicker";
