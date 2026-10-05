import React, { forwardRef, useId, useState } from "react";
import { CandySize } from "../../types";
import "./CandyPicker.css";

export interface CandyColorPickerProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "size" | "value" | "defaultValue" | "onChange"
> {
  value?: string;
  defaultValue?: string;
  onChange?: (color: string) => void;
  label?: React.ReactNode;
  size?: CandySize;
  hexLabel?: string;
}

function normalizeHex(value: string) {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value.trim());
  if (!match) return null;
  const hex = match[1].toLowerCase();
  return `#${
    hex.length === 3
      ? hex
          .split("")
          .map((digit) => digit + digit)
          .join("")
      : hex
  }`;
}

export const CandyColorPicker = forwardRef<
  HTMLInputElement,
  CandyColorPickerProps
>(
  (
    {
      value,
      defaultValue = "#0068f0",
      onChange,
      label,
      size = "md",
      hexLabel = "Hex color",
      disabled = false,
      readOnly = false,
      id,
      className = "",
      style,
      onBlur,
      onKeyDown,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || `candy-color-picker-${generatedId.replace(/:/g, "")}`;
    const [internalColor, setInternalColor] = useState(
      () => normalizeHex(defaultValue) || "#0068f0",
    );
    const current =
      value === undefined ? internalColor : normalizeHex(value) || "#0068f0";
    const [draft, setDraft] = useState<string | null>(null);
    const [invalid, setInvalid] = useState(false);

    function update(next: string) {
      if (disabled || readOnly) return;
      const normalized = normalizeHex(next);
      if (!normalized) return;
      if (value === undefined) setInternalColor(normalized);
      onChange?.(normalized);
      setInvalid(false);
    }

    function commit() {
      if (draft === null) return;
      const normalized = normalizeHex(draft);
      if (normalized) {
        update(normalized);
        setDraft(null);
      } else {
        setInvalid(true);
      }
    }

    return (
      <div
        className={`candy-field candy-color-picker-field ${className}`}
        style={style}
      >
        {label && (
          <label
            id={`${inputId}-label`}
            className="candy-field-label"
            htmlFor={inputId}
          >
            {label}
          </label>
        )}
        <div
          className={`candy-color-picker candy-color-picker-${size}${disabled ? " candy-color-picker-disabled" : ""}${invalid ? " candy-color-picker-invalid" : ""}`}
        >
          <input
            {...rest}
            ref={ref}
            id={inputId}
            className="candy-color-picker-swatch"
            type="color"
            value={current}
            disabled={disabled || readOnly}
            name={readOnly ? undefined : rest.name}
            aria-label={rest["aria-label"] || (label ? undefined : "Color")}
            aria-labelledby={
              label && !rest["aria-label"]
                ? `${inputId}-label`
                : rest["aria-labelledby"]
            }
            onChange={(event) => {
              setDraft(null);
              update(event.target.value);
            }}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
          />
          {readOnly && rest.name && (
            <input
              type="hidden"
              name={rest.name}
              value={current}
              disabled={disabled}
            />
          )}
          <input
            className="candy-color-picker-hex"
            id={`${inputId}-hex`}
            type="text"
            value={draft ?? current.toUpperCase()}
            aria-label={hexLabel}
            aria-invalid={invalid || undefined}
            aria-describedby={invalid ? `${inputId}-error` : undefined}
            disabled={disabled}
            readOnly={readOnly}
            spellCheck={false}
            autoComplete="off"
            maxLength={7}
            onChange={(event) => {
              setDraft(event.target.value);
              setInvalid(false);
              const normalized = normalizeHex(event.target.value);
              if (normalized) update(normalized);
            }}
            onBlur={commit}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                commit();
              } else if (event.key === "Escape") {
                setDraft(null);
                setInvalid(false);
              }
            }}
          />
          <svg
            className="candy-color-picker-chevron"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m4 6 4 4 4-4" />
          </svg>
        </div>
        {invalid && (
          <div
            id={`${inputId}-error`}
            className="candy-field-error"
            role="status"
          >
            Enter a valid hex color, such as #0068F0.
          </div>
        )}
      </div>
    );
  },
);

CandyColorPicker.displayName = "CandyColorPicker";
