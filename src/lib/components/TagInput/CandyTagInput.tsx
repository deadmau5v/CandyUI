import React, { forwardRef, useId, useRef, useState } from "react";
import { CandyColor, CandySize } from "../../types";
import "./CandyTagInput.css";

export interface CandyTagInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "value" | "defaultValue" | "onChange" | "type" | "maxLength"
> {
  value?: string[];
  defaultValue?: string[];
  onChange?: (tags: string[]) => void;
  label?: React.ReactNode;
  size?: CandySize;
  color?: CandyColor;
  maxTags?: number;
  maxTagLength?: number;
  allowDuplicates?: boolean;
  addLabel?: string;
  removeLabel?: (tag: string) => string;
}

export const CandyTagInput = forwardRef<HTMLInputElement, CandyTagInputProps>(
  (
    {
      value,
      defaultValue = [],
      onChange,
      label,
      size = "md",
      color = "blue",
      maxTags = Infinity,
      maxTagLength = 40,
      allowDuplicates = false,
      addLabel = "Add tag",
      removeLabel = (tag) => `Remove ${tag}`,
      disabled = false,
      readOnly = false,
      placeholder = "Add a tag…",
      id,
      name,
      className = "",
      style,
      onKeyDown,
      ...rest
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || `candy-tag-input-${generatedId.replace(/:/g, "")}`;
    const [internalTags, setInternalTags] = useState(defaultValue);
    const tags = value ?? internalTags;
    const [draft, setDraft] = useState("");
    const [error, setError] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);
    const limit = Number.isFinite(maxTags)
      ? Math.max(0, Math.floor(maxTags))
      : Infinity;
    const lengthLimit = Number.isFinite(maxTagLength)
      ? Math.max(1, Math.floor(maxTagLength))
      : Infinity;
    const atLimit = tags.length >= limit;

    function update(next: string[]) {
      if (disabled || readOnly) return;
      if (value === undefined) setInternalTags(next);
      onChange?.(next);
      setError("");
    }

    function add() {
      if (disabled || readOnly) return;
      const tag = draft.trim();
      if (!tag) return;
      if (atLimit) {
        setError(`You can add up to ${limit} tags.`);
      } else if (tag.length > lengthLimit) {
        setError(`Tags must be ${lengthLimit} characters or fewer.`);
      } else if (!allowDuplicates && tags.includes(tag)) {
        setError("This tag has already been added.");
      } else {
        update([...tags, tag]);
        setDraft("");
      }
      inputRef.current?.focus();
    }

    function remove(index: number) {
      update(tags.filter((_, tagIndex) => tagIndex !== index));
      inputRef.current?.focus();
    }

    const describedBy =
      [rest["aria-describedby"], error ? `${inputId}-error` : undefined]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
      <div
        className={`candy-field candy-tag-input-field ${className}`}
        style={style}
      >
        {label && (
          <label className="candy-field-label" htmlFor={inputId}>
            {label}
          </label>
        )}
        <div
          className={`candy-tag-input candy-tag-input-${size}${disabled ? " candy-tag-input-disabled" : ""}${error ? " candy-tag-input-invalid" : ""}`}
        >
          <ul className="candy-tag-input-tags" aria-label="Tags">
            {tags.map((tag, index) => (
              <li
                key={`${tag}-${index}`}
                className={`candy-tag-input-tag candy-tag-input-tag-${color}`}
              >
                <span>{tag}</span>
                {!readOnly && (
                  <button
                    type="button"
                    aria-label={removeLabel(tag)}
                    disabled={disabled}
                    onClick={() => remove(index)}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                )}
                {name && (
                  <input
                    type="hidden"
                    name={name}
                    value={tag}
                    disabled={disabled}
                  />
                )}
              </li>
            ))}
          </ul>
          <input
            {...rest}
            ref={(element) => {
              inputRef.current = element;
              if (typeof ref === "function") ref(element);
              else if (ref) ref.current = element;
            }}
            id={inputId}
            type="text"
            className="candy-tag-input-element"
            value={draft}
            disabled={disabled}
            readOnly={readOnly || atLimit}
            placeholder={atLimit ? "Tag limit reached" : placeholder}
            aria-label={rest["aria-label"] || (label ? undefined : "Add a tag")}
            aria-describedby={describedBy}
            aria-invalid={error ? true : rest["aria-invalid"]}
            required={rest.required && tags.length === 0}
            onChange={(event) => {
              setDraft(event.target.value);
              setError("");
            }}
            onKeyDown={(event) => {
              onKeyDown?.(event);
              if (
                event.defaultPrevented ||
                event.nativeEvent.isComposing ||
                disabled ||
                readOnly
              )
                return;
              if (event.key === "Enter") {
                event.preventDefault();
                add();
              } else if (event.key === "Backspace" && !draft && tags.length) {
                event.preventDefault();
                remove(tags.length - 1);
              }
            }}
          />
          {!readOnly && (
            <button
              className="candy-tag-input-add"
              type="button"
              aria-label={addLabel}
              disabled={disabled || atLimit || !draft.trim()}
              onClick={add}
            >
              <span aria-hidden="true">+</span>
            </button>
          )}
        </div>
        {error && (
          <div
            id={`${inputId}-error`}
            className="candy-field-error"
            role="status"
          >
            {error}
          </div>
        )}
      </div>
    );
  },
);

CandyTagInput.displayName = "CandyTagInput";
