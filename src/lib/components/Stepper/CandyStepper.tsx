import React, { forwardRef, useEffect, useId, useRef, useState } from "react";
import { CandySize } from "../../types";
import "./CandyStepper.css";

export interface CandyStepperProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  | "type"
  | "size"
  | "value"
  | "defaultValue"
  | "onChange"
  | "min"
  | "max"
  | "step"
> {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: CandySize;
  label?: React.ReactNode;
  decrementLabel?: string;
  incrementLabel?: string;
  fullWidth?: boolean;
}

export const CandyStepper = forwardRef<HTMLInputElement, CandyStepperProps>(
  (
    {
      value,
      defaultValue = 0,
      onChange,
      min = 0,
      max = Infinity,
      step = 1,
      size = "md",
      label,
      decrementLabel = "Decrease value",
      incrementLabel = "Increase value",
      disabled = false,
      readOnly = false,
      fullWidth = false,
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
    const inputId = id || `candy-stepper-${generatedId.replace(/:/g, "")}`;
    const lower = Number.isFinite(min) ? min : -Infinity;
    const upper = Number.isFinite(max) ? Math.max(lower, max) : Infinity;
    const increment = Number.isFinite(step) && step > 0 ? step : 1;
    const clamp = (next: number) => Math.min(upper, Math.max(lower, next));
    const [internalValue, setInternalValue] = useState(() =>
      clamp(Number.isFinite(defaultValue) ? defaultValue : 0),
    );
    const current = clamp(Number.isFinite(value) ? value! : internalValue);
    const [draft, setDraft] = useState<string | null>(null);
    const emittedValue = useRef<number | undefined>(undefined);
    useEffect(() => {
      if (value !== emittedValue.current) setDraft(null);
    }, [value]);

    function update(next: number) {
      if (disabled || readOnly || !Number.isFinite(next)) return;
      const bounded = clamp(next);
      emittedValue.current = bounded;
      if (value === undefined) setInternalValue(bounded);
      if (bounded !== current) onChange?.(bounded);
      return bounded;
    }

    function move(direction: number) {
      const candidate =
        draft !== null && draft.trim() !== "" ? Number(draft) : current;
      const base = Number.isFinite(candidate) ? clamp(candidate) : current;
      const next = Number((base + increment * direction).toPrecision(15));
      setDraft(null);
      update(next);
    }

    function commit() {
      if (
        draft !== null &&
        draft.trim() !== "" &&
        Number.isFinite(Number(draft))
      ) {
        update(Number(draft));
      }
      setDraft(null);
    }

    return (
      <div
        className={`candy-field candy-stepper-field ${fullWidth ? "candy-stepper-field-full-width" : ""} ${className}`.trim()}
        style={{
          width: fullWidth ? "100%" : undefined,
          ...style,
        }}
      >
        {label && (
          <label className="candy-field-label" htmlFor={inputId}>
            {label}
          </label>
        )}
        <div
          className={`candy-stepper candy-stepper-${size}${fullWidth ? " candy-stepper-full-width" : ""}${disabled ? " candy-stepper-disabled" : ""}`}
        >
          <button
            type="button"
            aria-label={decrementLabel}
            aria-controls={inputId}
            disabled={disabled || readOnly || current <= lower}
            onClick={() => move(-1)}
          >
            <span aria-hidden="true">−</span>
          </button>
          <input
            {...rest}
            ref={ref}
            id={inputId}
            type="number"
            className="candy-stepper-input"
            min={Number.isFinite(lower) ? lower : undefined}
            max={Number.isFinite(upper) ? upper : undefined}
            step={increment}
            value={draft ?? current}
            disabled={disabled}
            readOnly={readOnly}
            aria-label={rest["aria-label"] || (label ? undefined : "Value")}
            onChange={(event) => {
              setDraft(event.target.value);
              const next = event.target.valueAsNumber;
              if (Number.isFinite(next)) update(next);
            }}
            onBlur={(event) => {
              commit();
              onBlur?.(event);
            }}
            onKeyDown={(event) => {
              onKeyDown?.(event);
              if (event.defaultPrevented || disabled || readOnly) return;
              if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                event.preventDefault();
                move(event.key === "ArrowUp" ? 1 : -1);
              } else if (event.key === "Enter") {
                commit();
              } else if (event.key === "Escape") {
                setDraft(null);
              }
            }}
          />
          <button
            type="button"
            aria-label={incrementLabel}
            aria-controls={inputId}
            disabled={disabled || readOnly || current >= upper}
            onClick={() => move(1)}
          >
            <span aria-hidden="true">+</span>
          </button>
        </div>
      </div>
    );
  },
);

CandyStepper.displayName = "CandyStepper";
