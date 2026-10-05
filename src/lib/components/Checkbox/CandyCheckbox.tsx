import React, {
  forwardRef,
  useRef,
  useEffect,
  useState,
  useId,
  createContext,
  useContext,
  useMemo,
} from "react";
import { CandyColor } from "../../types";
import { useCandy } from "../../context/CandyProvider";
import "./CandyCheckbox.css";

/* ==========================================================================
   Types
   ========================================================================== */

export type CandyCheckboxSize = "sm" | "md" | "lg";

export interface CandyCheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "onChange"
> {
  /** 尺寸大小 (sm: 18px, md: 22px, lg: 28px) */
  size?: CandyCheckboxSize;
  /** 糖果主题颜色 */
  color?: CandyColor;
  /** 不确定状态 (横条图标) */
  indeterminate?: boolean;
  /** 声音反馈 (默认开启) */
  sound?: boolean;
  /** 标签文本或节点 (也可直接通过 children 传递) */
  label?: React.ReactNode;
  /** 勾选状态变化回调 */
  onChange?: (
    checked: boolean,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
}

export interface CandyRadioProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size" | "onChange"
> {
  /** 尺寸大小 (sm: 18px, md: 22px, lg: 28px) */
  size?: CandyCheckboxSize;
  /** 糖果主题颜色 */
  color?: CandyColor;
  /** 声音反馈 (默认开启) */
  sound?: boolean;
  /** 标签文本或节点 (也可直接通过 children 传递) */
  label?: React.ReactNode;
  /** 选中状态变化回调 */
  onChange?: (
    checked: boolean,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
}

export interface CandyRadioGroupProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  /** 原生 name 属性 (未提供时自动生成) */
  name?: string;
  /** 受控值 */
  value?: string;
  /** 默认非受控值 */
  defaultValue?: string;
  /** 选中值变化回调 */
  onChange?: (value: string) => void;
  /** 是否整组禁用 */
  disabled?: boolean;
  /** 尺寸大小 */
  size?: CandyCheckboxSize;
  /** 糖果颜色 */
  color?: CandyColor;
  /** 排列方向：水平或垂直 */
  orientation?: "horizontal" | "vertical";
  /** 子元素 */
  children?: React.ReactNode;
}

/* ==========================================================================
   Radio Group Context
   ========================================================================== */

interface RadioGroupContextValue {
  name: string;
  value?: string;
  onChange: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  size?: CandyCheckboxSize;
  color?: CandyColor;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

/* ==========================================================================
   CandyCheckbox Component
   ========================================================================== */

/**
 * 糖果风格复选框组件。
 * 厚实圆润的糖果方块外形，选中时带有 SVG 描边动画与弹性弹出，支持半选 indeterminate 状态。
 */
export const CandyCheckbox = forwardRef<HTMLInputElement, CandyCheckboxProps>(
  (
    {
      checked,
      defaultChecked,
      indeterminate = false,
      onChange,
      disabled = false,
      size = "md",
      color = "blue",
      label,
      children,
      sound = true,
      className = "",
      style,
      id,
      ...rest
    },
    forwardedRef,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { playSound } = useCandy();

    const isControlled = checked !== undefined;
    const [internalChecked, setInternalChecked] = useState(
      Boolean(defaultChecked),
    );
    const isChecked = isControlled ? Boolean(checked) : internalChecked;

    // 同步 native input 的 indeterminate 属性
    useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = Boolean(indeterminate);
      }
    }, [indeterminate]);

    // 合并 ref
    const setRef = (node: HTMLInputElement | null) => {
      (inputRef as React.MutableRefObject<HTMLInputElement | null>).current =
        node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        (
          forwardedRef as React.MutableRefObject<HTMLInputElement | null>
        ).current = node;
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      const newChecked = e.target.checked;
      if (!isControlled) {
        setInternalChecked(newChecked);
      }
      if (sound) {
        playSound("toggle");
      }
      onChange?.(newChecked, e);
    };

    const labelContent = label ?? children;

    const wrapperClasses = [
      "candy-checkbox",
      `candy-checkbox-${size}`,
      `candy-checkbox-${color}`,
      isChecked ? "candy-checkbox-checked" : "",
      indeterminate ? "candy-checkbox-indeterminate" : "",
      disabled ? "candy-checkbox-disabled" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <label className={wrapperClasses} style={style}>
        <input
          ref={setRef}
          type="checkbox"
          id={id}
          className="candy-checkbox-input"
          checked={isChecked}
          disabled={disabled}
          aria-checked={indeterminate ? "mixed" : isChecked}
          onChange={handleChange}
          {...rest}
        />
        <span className="candy-checkbox-box" aria-hidden="true">
          <svg
            className="candy-checkbox-icon"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {indeterminate ? (
              <rect
                className="candy-checkbox-dash"
                x="3"
                y="6.5"
                width="10"
                height="3"
                rx="1.5"
                fill="currentColor"
              />
            ) : (
              <path
                className="candy-checkbox-mark"
                d="M3.2 8.2L6.4 11.4L12.8 4.6"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </span>
        {labelContent !== undefined && labelContent !== null && (
          <span className="candy-checkbox-label">{labelContent}</span>
        )}
      </label>
    );
  },
);

CandyCheckbox.displayName = "CandyCheckbox";

/* ==========================================================================
   CandyRadio Component
   ========================================================================== */

/**
 * 糖果风格单选框组件。
 * 圆形糖果外形，选中时中心糖果圆点弹跳出现。支持独立使用或配合 CandyRadioGroup 使用。
 */
export const CandyRadio = forwardRef<HTMLInputElement, CandyRadioProps>(
  (
    {
      checked,
      defaultChecked,
      onChange,
      disabled,
      size,
      color,
      label,
      children,
      sound = true,
      className = "",
      style,
      value,
      name,
      id,
      ...rest
    },
    forwardedRef,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { playSound } = useCandy();
    const group = useContext(RadioGroupContext);

    const resolvedName = name ?? group?.name;
    const resolvedDisabled =
      disabled !== undefined ? disabled : (group?.disabled ?? false);
    const resolvedSize = size ?? group?.size ?? "md";
    const resolvedColor = color ?? group?.color ?? "blue";

    const [internalChecked, setInternalChecked] = useState(
      Boolean(defaultChecked),
    );

    const isGroupControlled = group !== null;
    const isControlled = isGroupControlled || checked !== undefined;

    let isChecked: boolean;
    if (group) {
      isChecked =
        group.value !== undefined && value !== undefined
          ? String(group.value) === String(value)
          : checked !== undefined
            ? Boolean(checked)
            : internalChecked;
    } else {
      isChecked = isControlled ? Boolean(checked) : internalChecked;
    }

    const setRef = (node: HTMLInputElement | null) => {
      (inputRef as React.MutableRefObject<HTMLInputElement | null>).current =
        node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        (
          forwardedRef as React.MutableRefObject<HTMLInputElement | null>
        ).current = node;
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (resolvedDisabled) return;
      const newChecked = e.target.checked;
      if (!isControlled) {
        setInternalChecked(newChecked);
      }
      if (sound) {
        playSound("pop");
      }
      if (group && value !== undefined) {
        group.onChange(String(value), e);
      }
      onChange?.(newChecked, e);
    };

    const labelContent = label ?? children;

    const wrapperClasses = [
      "candy-radio",
      `candy-radio-${resolvedSize}`,
      `candy-radio-${resolvedColor}`,
      isChecked ? "candy-radio-checked" : "",
      resolvedDisabled ? "candy-radio-disabled" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <label className={wrapperClasses} style={style}>
        <input
          ref={setRef}
          type="radio"
          id={id}
          className="candy-radio-input"
          name={resolvedName}
          value={value}
          checked={isChecked}
          disabled={resolvedDisabled}
          onChange={handleChange}
          {...rest}
        />
        <span className="candy-radio-box" aria-hidden="true">
          <span className="candy-radio-dot" />
        </span>
        {labelContent !== undefined && labelContent !== null && (
          <span className="candy-radio-label">{labelContent}</span>
        )}
      </label>
    );
  },
);

CandyRadio.displayName = "CandyRadio";

/* ==========================================================================
   CandyRadioGroup Component
   ========================================================================== */

/**
 * 糖果风格单选按钮组。
 * 统一管理子 Radio 的 name/value/onChange/disabled/size/color，支持水平与垂直方向，支持键盘方向键切换。
 */
export const CandyRadioGroup = forwardRef<HTMLDivElement, CandyRadioGroupProps>(
  (
    {
      name,
      value,
      defaultValue,
      onChange,
      disabled = false,
      size = "md",
      color = "blue",
      orientation = "vertical",
      className = "",
      style,
      children,
      onKeyDown,
      ...rest
    },
    forwardedRef,
  ) => {
    const groupRef = useRef<HTMLDivElement>(null);
    const generatedId = useId();
    const groupName = name || `candy-radio-group-${generatedId}`;

    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState<string | undefined>(
      defaultValue,
    );
    const currentValue = isControlled ? value : internalValue;

    const setGroupRef = (node: HTMLDivElement | null) => {
      (groupRef as React.MutableRefObject<HTMLDivElement | null>).current =
        node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        (
          forwardedRef as React.MutableRefObject<HTMLDivElement | null>
        ).current = node;
      }
    };

    const handleGroupChange = (val: string) => {
      if (!isControlled) {
        setInternalValue(val);
      }
      onChange?.(val);
    };

    // 键盘方向键无障碍导航
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;

      if (
        e.key !== "ArrowDown" &&
        e.key !== "ArrowRight" &&
        e.key !== "ArrowUp" &&
        e.key !== "ArrowLeft"
      ) {
        return;
      }

      const container = groupRef.current;
      if (!container) return;

      const inputs = Array.from(
        container.querySelectorAll<HTMLInputElement>(
          'input[type="radio"]:not(:disabled)',
        ),
      );
      if (inputs.length <= 1) return;

      const activeElement = document.activeElement;
      let currentIndex = inputs.findIndex((input) => input === activeElement);

      if (currentIndex === -1) {
        currentIndex = inputs.findIndex((input) => input.checked);
      }
      if (currentIndex === -1) {
        currentIndex = 0;
      }

      let nextIndex = currentIndex;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        nextIndex = (currentIndex + 1) % inputs.length;
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        nextIndex = (currentIndex - 1 + inputs.length) % inputs.length;
      }

      const targetInput = inputs[nextIndex];
      if (targetInput) {
        targetInput.focus();
        targetInput.click();
      }
    };

    const contextValue = useMemo<RadioGroupContextValue>(
      () => ({
        name: groupName,
        value: currentValue,
        onChange: handleGroupChange,
        disabled,
        size,
        color,
      }),
      [groupName, currentValue, disabled, size, color, handleGroupChange],
    );

    const groupClasses = [
      "candy-radio-group",
      `candy-radio-group-${orientation}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <RadioGroupContext.Provider value={contextValue}>
        <div
          ref={setGroupRef}
          role="radiogroup"
          aria-orientation={orientation}
          aria-disabled={disabled}
          className={groupClasses}
          style={style}
          onKeyDown={handleKeyDown}
          {...rest}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  },
);

CandyRadioGroup.displayName = "CandyRadioGroup";
