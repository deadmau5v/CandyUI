import React, { forwardRef, useContext, useId, useRef, useState } from "react";
import { useCandy } from "../../context/CandyProvider";
import "./CandyInput.css";

export type CandyInputSize = "sm" | "md" | "lg";

/* -------------------------------------------------------------------------- */
/* CandyFieldContext                                                          */
/* -------------------------------------------------------------------------- */

export interface CandyFieldContextValue {
  id?: string;
  labelId?: string;
  hintId?: string;
  errorId?: string;
  invalid?: boolean;
  disabled?: boolean;
  required?: boolean;
  size?: CandyInputSize;
}

const CandyFieldContext = React.createContext<CandyFieldContextValue | null>(
  null,
);

/* -------------------------------------------------------------------------- */
/* CandyField                                                                 */
/* -------------------------------------------------------------------------- */

export interface CandyFieldProps {
  /** 表单项唯一 ID，未传时自动生成并关联 label 与 input */
  id?: string;
  /** 标签文本或节点 */
  label?: React.ReactNode;
  /** 提示说明文本或节点 */
  hint?: React.ReactNode;
  /** 错误信息，存在时会将子输入控件置为 invalid 态 */
  error?: React.ReactNode;
  /** 是否必填，展示糖果风格星号 */
  required?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 尺寸统一注入 */
  size?: CandyInputSize;
  /** 自定义外层样式类名 */
  className?: string;
  /** 自定义外层样式 */
  style?: React.CSSProperties;
  /** 子组件（如 CandyInput 或 CandyTextarea） */
  children?: React.ReactNode;
}

export const CandyField = forwardRef<HTMLDivElement, CandyFieldProps>(
  (
    {
      id: customId,
      label,
      hint,
      error,
      required = false,
      disabled = false,
      size,
      className = "",
      style,
      children,
    },
    ref,
  ) => {
    const generatedId = useId();
    const fieldId = customId || `candy-field-${generatedId.replace(/:/g, "")}`;

    const labelId = label ? `${fieldId}-label` : undefined;
    const hintId = hint ? `${fieldId}-hint` : undefined;
    const errorId = error ? `${fieldId}-error` : undefined;
    const invalid = Boolean(error);

    const contextValue: CandyFieldContextValue = {
      id: fieldId,
      labelId,
      hintId,
      errorId,
      invalid,
      disabled,
      required,
      size,
    };

    const rootClasses = [
      "candy-field",
      disabled ? "candy-field-disabled" : "",
      invalid ? "candy-field-has-error" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <CandyFieldContext.Provider value={contextValue}>
        <div ref={ref} className={rootClasses} style={style}>
          {label && (
            <label htmlFor={fieldId} id={labelId} className="candy-field-label">
              {label}
              {required && (
                <span className="candy-field-required" aria-hidden="true">
                  *
                </span>
              )}
            </label>
          )}

          <div className="candy-field-control">{children}</div>

          {error ? (
            <div
              id={errorId}
              className="candy-field-error"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          ) : hint ? (
            <div id={hintId} className="candy-field-hint">
              {hint}
            </div>
          ) : null}
        </div>
      </CandyFieldContext.Provider>
    );
  },
);

CandyField.displayName = "CandyField";

/* -------------------------------------------------------------------------- */
/* CandyInput                                                                 */
/* -------------------------------------------------------------------------- */

export interface CandyInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  /** 尺寸：小号 (sm: 36px)、中号 (md: 46px)、大号 (lg: 54px) */
  size?: CandyInputSize;
  /** 是否处于无效/错误状态 */
  invalid?: boolean;
  success?: boolean;
  /** 左侧图标或装饰节点 */
  leftIcon?: React.ReactNode;
  /** 右侧图标或装饰节点 */
  rightIcon?: React.ReactNode;
  /** 是否显示清除按钮（有值时可见，支持受控与非受控） */
  clearable?: boolean;
  /** 点击清除按钮时的回调 */
  onClear?: () => void;
  /** 是否开启音效反馈（默认 true） */
  sound?: boolean;

  /* FormField 快捷包装属性 */
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  fieldClassName?: string;
  fieldStyle?: React.CSSProperties;

  /* 元素类名与样式透传 */
  inputClassName?: string;
  inputStyle?: React.CSSProperties;
}

const CandyInputBase = forwardRef<HTMLInputElement, CandyInputProps>(
  (
    {
      type = "text",
      success = false,
      size: propSize,
      invalid: propInvalid,
      leftIcon,
      rightIcon,
      clearable = false,
      onClear,
      sound = true,
      disabled: propDisabled,
      required: propRequired,
      id: propId,
      className = "",
      style,
      inputClassName = "",
      inputStyle,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      readOnly,
      ...rest
    },
    ref,
  ) => {
    const fieldContext = useContext(CandyFieldContext);
    const { playSound } = useCandy();

    const size = propSize || fieldContext?.size || "md";
    const invalid = propInvalid ?? fieldContext?.invalid ?? false;
    const disabled = propDisabled ?? fieldContext?.disabled ?? false;
    const required = propRequired ?? fieldContext?.required ?? false;
    const id = propId || fieldContext?.id;

    // Password visibility toggle
    const isPasswordType = type === "password";
    const [showPassword, setShowPassword] = useState(false);
    const effectiveType = isPasswordType && showPassword ? "text" : type;

    // Focus state tracking
    const [isFocused, setIsFocused] = useState(false);

    // Value tracking for clearable button
    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState<string>(() => {
      if (defaultValue !== undefined) return String(defaultValue);
      return "";
    });

    const currentValue = isControlled ? String(value ?? "") : uncontrolledValue;
    const hasValue = currentValue.length > 0;

    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleRef = (el: HTMLInputElement | null) => {
      inputRef.current = el;
      if (typeof ref === "function") {
        ref(el);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setUncontrolledValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled || readOnly) return;

      if (sound) {
        playSound("pop");
      }

      if (!isControlled) {
        setUncontrolledValue("");
      }

      const input = inputRef.current;
      if (input) {
        const nativeSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value",
        )?.set;
        if (nativeSetter) {
          nativeSetter.call(input, "");
        } else {
          input.value = "";
        }

        const inputEv = new Event("input", { bubbles: true });
        input.dispatchEvent(inputEv);

        const changeEv = new Event("change", { bubbles: true });
        input.dispatchEvent(changeEv);

        input.focus();
      }

      onClear?.();
    };

    const handleTogglePassword = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled) return;

      if (sound) {
        playSound("toggle");
      }

      setShowPassword((prev) => !prev);
      inputRef.current?.focus();
    };

    const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest(".candy-input-actions")) {
        return;
      }
      inputRef.current?.focus();
    };

    // Accessibility aria-describedby linkage
    const ariaDescribedBy =
      [rest["aria-describedby"], fieldContext?.errorId, fieldContext?.hintId]
        .filter(Boolean)
        .join(" ") || undefined;

    const wrapperClasses = [
      "candy-input-wrapper",
      `candy-input-${size}`,
      type === "search" ? "candy-input-search" : "",
      invalid ? "candy-input-invalid" : success ? "candy-input-success" : "",
      disabled ? "candy-input-disabled" : "",
      isFocused ? "candy-input-focused" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const inputClasses = ["candy-input-element", inputClassName]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        className={wrapperClasses}
        style={style}
        onClick={handleWrapperClick}
        role="group"
      >
        {leftIcon && (
          <span
            className="candy-input-icon candy-input-icon-left"
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        )}

        <input
          ref={handleRef}
          id={id}
          type={effectiveType}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-invalid={invalid ? true : undefined}
          aria-describedby={ariaDescribedBy}
          className={inputClasses}
          style={inputStyle}
          {...rest}
        />

        <div className="candy-input-actions">
          {(invalid || success) && (
            <span className="candy-input-status" aria-label={invalid ? "Invalid" : "Valid"}>
              {invalid ? "!" : "✓"}
            </span>
          )}
          {clearable && hasValue && !disabled && !readOnly && (
            <button
              type="button"
              className="candy-input-action-btn candy-input-clear-btn"
              aria-label="Clear input"
              onClick={handleClear}
              tabIndex={0}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5" />
              </svg>
            </button>
          )}

          {isPasswordType && (
            <button
              type="button"
              className="candy-input-action-btn candy-input-password-btn"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={handleTogglePassword}
              disabled={disabled}
              tabIndex={0}
            >
              {showPassword ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 19c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          )}

          {rightIcon && (
            <span
              className="candy-input-icon candy-input-icon-right"
              aria-hidden="true"
            >
              {rightIcon}
            </span>
          )}
        </div>
      </div>
    );
  },
);

CandyInputBase.displayName = "CandyInputBase";

export const CandyInput = forwardRef<HTMLInputElement, CandyInputProps>(
  (props, ref) => {
    const { label, hint, error, fieldClassName, fieldStyle, ...inputProps } =
      props;

    if (label || hint || error) {
      return (
        <CandyField
          id={props.id}
          label={label}
          hint={hint}
          error={error}
          required={props.required}
          disabled={props.disabled}
          size={props.size}
          className={fieldClassName}
          style={fieldStyle}
        >
          <CandyInputBase ref={ref} {...inputProps} />
        </CandyField>
      );
    }

    return <CandyInputBase ref={ref} {...props} />;
  },
);

CandyInput.displayName = "CandyInput";

/* -------------------------------------------------------------------------- */
/* CandyTextarea                                                              */
/* -------------------------------------------------------------------------- */

export interface CandyTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  showCount?: boolean;
  /** 尺寸：小号 (sm)、中号 (md)、大号 (lg) */
  size?: CandyInputSize;
  /** 是否处于无效/错误状态 */
  invalid?: boolean;
  /** 是否显示清除按钮（有值时可见，支持受控与非受控） */
  clearable?: boolean;
  /** 点击清除按钮时的回调 */
  onClear?: () => void;
  /** 是否开启音效反馈（默认 true） */
  sound?: boolean;

  /* FormField 快捷包装属性 */
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  fieldClassName?: string;
  fieldStyle?: React.CSSProperties;

  /* 元素类名与样式透传 */
  textareaClassName?: string;
  textareaStyle?: React.CSSProperties;
}

const CandyTextareaBase = forwardRef<HTMLTextAreaElement, CandyTextareaProps>(
  (
    {
      size: propSize,
      invalid: propInvalid,
      clearable = false,
      onClear,
      sound = true,
      disabled: propDisabled,
      required: propRequired,
      id: propId,
      className = "",
      style,
      textareaClassName = "",
      textareaStyle,
      showCount = false,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      readOnly,
      ...rest
    },
    ref,
  ) => {
    const fieldContext = useContext(CandyFieldContext);
    const { playSound } = useCandy();

    const size = propSize || fieldContext?.size || "md";
    const invalid = propInvalid ?? fieldContext?.invalid ?? false;
    const disabled = propDisabled ?? fieldContext?.disabled ?? false;
    const required = propRequired ?? fieldContext?.required ?? false;
    const id = propId || fieldContext?.id;

    const [isFocused, setIsFocused] = useState(false);

    const isControlled = value !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState<string>(() => {
      if (defaultValue !== undefined) return String(defaultValue);
      return "";
    });

    const currentValue = isControlled ? String(value ?? "") : uncontrolledValue;
    const hasValue = currentValue.length > 0;

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const handleRef = (el: HTMLTextAreaElement | null) => {
      textareaRef.current = el;
      if (typeof ref === "function") {
        ref(el);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current =
          el;
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!isControlled) {
        setUncontrolledValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled || readOnly) return;

      if (sound) {
        playSound("pop");
      }

      if (!isControlled) {
        setUncontrolledValue("");
      }

      const textarea = textareaRef.current;
      if (textarea) {
        const nativeSetter = Object.getOwnPropertyDescriptor(
          window.HTMLTextAreaElement.prototype,
          "value",
        )?.set;
        if (nativeSetter) {
          nativeSetter.call(textarea, "");
        } else {
          textarea.value = "";
        }

        const inputEv = new Event("input", { bubbles: true });
        textarea.dispatchEvent(inputEv);

        const changeEv = new Event("change", { bubbles: true });
        textarea.dispatchEvent(changeEv);

        textarea.focus();
      }

      onClear?.();
    };

    const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest(".candy-textarea-clear-btn")) {
        return;
      }
      textareaRef.current?.focus();
    };

    const ariaDescribedBy =
      [rest["aria-describedby"], fieldContext?.errorId, fieldContext?.hintId]
        .filter(Boolean)
        .join(" ") || undefined;

    const wrapperClasses = [
      "candy-textarea-wrapper",
      `candy-textarea-${size}`,
      showCount ? "candy-textarea-counted" : "",
      invalid ? "candy-textarea-invalid" : "",
      disabled ? "candy-textarea-disabled" : "",
      isFocused ? "candy-textarea-focused" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const textareaClasses = ["candy-textarea-element", textareaClassName]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        className={wrapperClasses}
        style={style}
        onClick={handleWrapperClick}
        role="group"
      >
        <textarea
          ref={handleRef}
          id={id}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          aria-invalid={invalid ? true : undefined}
          aria-describedby={ariaDescribedBy}
          className={textareaClasses}
          style={textareaStyle}
          {...rest}
        />

        {showCount && (
          <span className="candy-textarea-count">
            {currentValue.length}{rest.maxLength !== undefined ? `/${rest.maxLength}` : ""}
          </span>
        )}
        {clearable && hasValue && !disabled && !readOnly && (
          <button
            type="button"
            className="candy-input-action-btn candy-textarea-clear-btn"
            aria-label="Clear text"
            onClick={handleClear}
            tabIndex={0}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5" />
            </svg>
          </button>
        )}
      </div>
    );
  },
);

CandyTextareaBase.displayName = "CandyTextareaBase";

export const CandyTextarea = forwardRef<
  HTMLTextAreaElement,
  CandyTextareaProps
>((props, ref) => {
  const { label, hint, error, fieldClassName, fieldStyle, ...textareaProps } =
    props;

  if (label || hint || error) {
    return (
      <CandyField
        id={props.id}
        label={label}
        hint={hint}
        error={error}
        required={props.required}
        disabled={props.disabled}
        size={props.size}
        className={fieldClassName}
        style={fieldStyle}
      >
        <CandyTextareaBase ref={ref} {...textareaProps} />
      </CandyField>
    );
  }

  return <CandyTextareaBase ref={ref} {...props} />;
});

CandyTextarea.displayName = "CandyTextarea";
