import React, {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { CandySize } from "../../types";
import { useCandy } from "../../context/CandyProvider";
import "./CandyPicker.css";

export const CANDY_THEME_COLOR_PRESETS: string[] = [
  "#0068f0", // Blue 经典糖果蓝
  "#00b8ef", // Cyan 糖果青
  "#58d13f", // Green 薄荷绿
  "#ffd51c", // Yellow 柠檬黄
  "#ff9f43", // Orange 暖阳橙
  "#df1645", // Red 浆果红
  "#f780ae", // Pink 蜜桃粉
  "#7955c7", // Purple 葡萄紫
  "#8d5b3e", // Choco 浓情巧克
  "#10234b", // Dark 深墨蓝
  "#b2bfce", // Gray 柔和灰
  "#fff5db", // Cream 香草奶油
];

const PRESET_COLOR_NAMES: Record<string, string> = {
  "#0068f0": "经典蓝",
  "#00b8ef": "糖果青",
  "#58d13f": "薄荷绿",
  "#ffd51c": "柠檬黄",
  "#ff9f43": "暖阳橙",
  "#df1645": "浆果红",
  "#f780ae": "蜜桃粉",
  "#7955c7": "葡萄紫",
  "#8d5b3e": "浓情巧克",
  "#10234b": "深墨蓝",
  "#b2bfce": "柔和灰",
  "#fff5db": "香草奶油",
};

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
  presets?: string[] | false;
  defaultOpen?: boolean;
  sound?: boolean;
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

function getContrastColor(hexColor: string): string {
  const cleanHex = hexColor.replace("#", "");
  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split("")
          .map((c) => c + c)
          .join("")
      : cleanHex;
  const r = parseInt(fullHex.substring(0, 2), 16) || 0;
  const g = parseInt(fullHex.substring(2, 4), 16) || 0;
  const b = parseInt(fullHex.substring(4, 6), 16) || 0;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 160 ? "#10234b" : "#ffffff";
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
      presets,
      defaultOpen = false,
      sound = true,
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
    const { playSound } = useCandy();
    const generatedId = useId();
    const inputId = id || `candy-color-picker-${generatedId.replace(/:/g, "")}`;
    const [internalColor, setInternalColor] = useState(
      () => normalizeHex(defaultValue) || "#0068f0",
    );
    const current =
      value === undefined ? internalColor : normalizeHex(value) || "#0068f0";
    const [draft, setDraft] = useState<string | null>(null);
    const [invalid, setInvalid] = useState(false);
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [placement, setPlacement] = useState<"bottom" | "top">("bottom");

    const containerRef = useRef<HTMLDivElement | null>(null);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
    const internalInputRef = useRef<HTMLInputElement | null>(null);

    const setInputRef = useCallback(
      (node: HTMLInputElement | null) => {
        internalInputRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLInputElement | null>).current =
            node;
        }
      },
      [ref],
    );

    const hasPresets = presets !== false;
    const activePresets = useMemo(() => {
      if (presets === false) return [];
      if (Array.isArray(presets)) return presets;
      return CANDY_THEME_COLOR_PRESETS;
    }, [presets]);

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

    function openNativePicker() {
      if (disabled || readOnly) return;
      const el = internalInputRef.current;
      if (!el) return;
      if (typeof el.showPicker === "function") {
        try {
          el.showPicker();
          return;
        } catch {
          // Fallback
        }
      }
      el.click();
    }

    function toggleDropdown(e?: React.MouseEvent) {
      e?.stopPropagation();
      if (disabled || readOnly) return;
      if (!hasPresets) {
        openNativePicker();
        return;
      }
      setIsOpen((prev) => !prev);
    }

    function selectPreset(presetColor: string) {
      if (disabled || readOnly) return;
      update(presetColor);
      if (sound) {
        playSound("pop");
      }
      setIsOpen(false);
      toggleBtnRef.current?.focus();
    }

    function handleCustomColorClick(e: React.MouseEvent) {
      e.stopPropagation();
      setIsOpen(false);
      setTimeout(() => {
        openNativePicker();
      }, 50);
    }

    useEffect(() => {
      if (!isOpen) return;
      function handlePointerDown(e: PointerEvent | MouseEvent) {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      }
      function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") {
          setIsOpen(false);
          toggleBtnRef.current?.focus();
        }
      }
      document.addEventListener("pointerdown", handlePointerDown);
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("pointerdown", handlePointerDown);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [isOpen]);

    useEffect(() => {
      if (!isOpen) return;
      function updatePosition() {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const belowSpace = window.innerHeight - rect.bottom - 8;
        const aboveSpace = rect.top - 8;
        const neededHeight = dropdownRef.current?.offsetHeight ?? 160;
        if (belowSpace < neededHeight && aboveSpace > belowSpace) {
          setPlacement("top");
        } else {
          setPlacement("bottom");
        }
      }
      updatePosition();
      window.addEventListener("resize", updatePosition);
      window.addEventListener("scroll", updatePosition, true);
      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, true);
      };
    }, [isOpen]);

    return (
      <div
        ref={containerRef}
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
          className={`candy-color-picker candy-color-picker-${size}${disabled ? " candy-color-picker-disabled" : ""}${invalid ? " candy-color-picker-invalid" : ""}${isOpen ? " candy-color-picker-open" : ""}`}
        >
          <input
            {...rest}
            ref={setInputRef}
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
          <button
            ref={toggleBtnRef}
            type="button"
            className="candy-color-picker-toggle"
            aria-label={isOpen ? "收起颜色下拉框" : "展开颜色下拉框"}
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            disabled={disabled || readOnly}
            onClick={toggleDropdown}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown" && !isOpen && hasPresets) {
                e.preventDefault();
                setIsOpen(true);
              }
            }}
          >
            <svg
              className={`candy-color-picker-chevron ${isOpen ? "candy-color-picker-chevron-open" : ""}`}
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
          </button>
        </div>

        {isOpen && hasPresets && (
          <div
            ref={dropdownRef}
            className={`candy-color-picker-dropdown candy-color-picker-dropdown-${placement}`}
            role="dialog"
            aria-label="颜色预设选择"
          >
            {activePresets.length > 0 && (
              <>
                <div className="candy-color-picker-dropdown-title">
                  预设颜色
                </div>
                <div
                  className="candy-color-picker-presets"
                  role="listbox"
                  aria-label="预设颜色列表"
                >
                  {activePresets.map((preset) => {
                    const normalized =
                      normalizeHex(preset) || preset.toLowerCase();
                    const isActive =
                      normalized.toLowerCase() === current.toLowerCase();
                    const checkColor = getContrastColor(normalized);
                    const name =
                      PRESET_COLOR_NAMES[normalized.toLowerCase()] ||
                      preset.toUpperCase();
                    return (
                      <button
                        key={preset}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        className={`candy-color-preset-item ${isActive ? "is-active" : ""}`}
                        style={{ backgroundColor: normalized }}
                        onClick={() => selectPreset(normalized)}
                        title={`${name} (${normalized.toUpperCase()})`}
                        aria-label={`选择颜色 ${name} ${normalized.toUpperCase()}`}
                      >
                        {isActive && (
                          <svg
                            viewBox="0 0 16 16"
                            width="14"
                            height="14"
                            fill="none"
                            stroke={checkColor}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <polyline points="3 8.5 6.5 12 13 4" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="candy-color-picker-divider" />
              </>
            )}
            <button
              type="button"
              className="candy-color-picker-custom-btn"
              onClick={handleCustomColorClick}
            >
              <span
                className="candy-color-picker-custom-icon"
                aria-hidden="true"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
                  <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
                  <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
                  <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
                </svg>
              </span>
              <span>自定义颜色...</span>
            </button>
          </div>
        )}

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
