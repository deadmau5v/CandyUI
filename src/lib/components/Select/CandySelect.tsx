import React, {
  forwardRef,
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useId,
} from "react";
import { CandyColor, CandySize } from "../../types";
import { useCandy } from "../../context/CandyProvider";
import { CandySoundType } from "../../sound/audio";
import "./CandySelect.css";

export interface CandySelectOption {
  value: string | number;
  label: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface CandySelectProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  /** 选项列表 */
  options: CandySelectOption[];
  /** 当前选中值（受控） */
  value?: string | number;
  /** 默认选中值（非受控） */
  defaultValue?: string | number;
  /** 选中值变化回调 */
  onChange?: (value: string | number, option: CandySelectOption) => void;
  /** 未选择时的占位文本 */
  placeholder?: string;
  /** 尺寸大小 */
  size?: CandySize;
  /** 主题颜色 */
  color?: CandyColor;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否处于无效/错误状态 */
  invalid?: boolean;
  /** 表单提交时的字段名（渲染隐藏 input） */
  name?: string;
  /** 音效反馈，支持具体音效类型或布尔值关闭 */
  sound?: CandySoundType | boolean;
  /** 是否占满容器宽度 */
  fullWidth?: boolean;
  /** 无障碍标签 */
  "aria-label"?: string;
}

/**
 * CandySelect 糖果风格自绘下拉选择器组件
 */
export const CandySelect = forwardRef<HTMLDivElement, CandySelectProps>(
  (
    {
      options = [],
      value: controlledValue,
      defaultValue,
      onChange,
      placeholder = "请选择...",
      size = "md",
      color = "blue",
      disabled = false,
      invalid = false,
      name,
      sound = "pop",
      fullWidth = false,
      "aria-label": ariaLabel,
      className = "",
      style,
      ...rest
    },
    ref,
  ) => {
    const { playSound } = useCandy();
    const generatedId = useId();
    const listboxId = `${generatedId}-listbox`;

    const isControlled = controlledValue !== undefined;
    const [uncontrolledValue, setUncontrolledValue] = useState<
      string | number | undefined
    >(defaultValue);
    const selectedValue = isControlled ? controlledValue : uncontrolledValue;

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [placement, setPlacement] = useState<"bottom" | "top">("bottom");
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchBufferRef = useRef<string>("");
    const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // 选中的 Option 对象
    const selectedOption = useMemo(
      () => options.find((opt) => opt.value === selectedValue),
      [options, selectedValue],
    );

    // 音效触发辅助
    const triggerSound = useCallback(
      (defaultType: CandySoundType) => {
        if (sound === false) return;
        const soundType = typeof sound === "string" ? sound : defaultType;
        playSound(soundType);
      },
      [playSound, sound],
    );

    // 检查并计算面板翻转（上方/下方）
    const checkPlacement = useCallback(() => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const estimatedDropdownHeight = 240;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      if (spaceBelow < estimatedDropdownHeight && spaceAbove > spaceBelow) {
        setPlacement("top");
      } else {
        setPlacement("bottom");
      }
    }, []);

    // 开启/关闭下拉列表
    const handleToggleOpen = useCallback(() => {
      if (disabled) return;
      if (!isOpen) {
        checkPlacement();
        triggerSound("click");
        setIsOpen(true);
      } else {
        triggerSound("pop");
        setIsOpen(false);
      }
    }, [disabled, isOpen, checkPlacement, triggerSound]);

    // 选中某个选项
    const handleSelectOption = useCallback(
      (option: CandySelectOption) => {
        if (option.disabled || disabled) return;
        if (!isControlled) {
          setUncontrolledValue(option.value);
        }
        onChange?.(option.value, option);
        triggerSound("pop");
        setIsOpen(false);
        triggerRef.current?.focus();
      },
      [disabled, isControlled, onChange, triggerSound],
    );

    // 打开时初始化高亮项
    useEffect(() => {
      if (isOpen) {
        const curIndex = options.findIndex(
          (opt) => opt.value === selectedValue,
        );
        if (curIndex !== -1 && !options[curIndex].disabled) {
          setHighlightedIndex(curIndex);
        } else {
          const firstAvailable = options.findIndex((opt) => !opt.disabled);
          setHighlightedIndex(firstAvailable);
        }
      } else {
        setHighlightedIndex(-1);
      }
    }, [isOpen, options, selectedValue]);

    // 高亮项随上下键滚动到视野内
    useEffect(() => {
      if (!isOpen || highlightedIndex < 0 || !dropdownRef.current) return;
      const items =
        dropdownRef.current.querySelectorAll<HTMLElement>('[role="option"]');
      const target = items[highlightedIndex];
      if (target) {
        target.scrollIntoView({ block: "nearest" });
      }
    }, [highlightedIndex, isOpen]);

    // 点击外部关闭下拉列表
    useEffect(() => {
      if (!isOpen) return;

      const handlePointerDown = (event: MouseEvent | TouchEvent) => {
        const target = event.target as Node;
        if (
          containerRef.current &&
          !containerRef.current.contains(target) &&
          (!dropdownRef.current || !dropdownRef.current.contains(target))
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handlePointerDown);
      document.addEventListener("touchstart", handlePointerDown);
      return () => {
        document.removeEventListener("mousedown", handlePointerDown);
        document.removeEventListener("touchstart", handlePointerDown);
      };
    }, [isOpen]);

    // 获取上一个/下一个可用选项索引
    const findNextIndex = useCallback(
      (currentIndex: number, direction: 1 | -1): number => {
        const total = options.length;
        if (total === 0) return -1;
        let next = currentIndex;
        for (let i = 0; i < total; i++) {
          next = (next + direction + total) % total;
          if (!options[next].disabled) {
            return next;
          }
        }
        return currentIndex;
      },
      [options],
    );

    // 字符预选（Typeahead）处理
    const handleTypeahead = useCallback(
      (char: string) => {
        if (searchTimerRef.current) {
          clearTimeout(searchTimerRef.current);
        }
        searchBufferRef.current += char.toLowerCase();
        searchTimerRef.current = setTimeout(() => {
          searchBufferRef.current = "";
        }, 600);

        const searchStr = searchBufferRef.current;
        const matchIndex = options.findIndex((opt) => {
          if (opt.disabled) return false;
          const labelText =
            typeof opt.label === "string" || typeof opt.label === "number"
              ? String(opt.label).toLowerCase()
              : String(opt.value).toLowerCase();
          return labelText.startsWith(searchStr);
        });

        if (matchIndex !== -1) {
          setHighlightedIndex(matchIndex);
          if (!isOpen) {
            checkPlacement();
            setIsOpen(true);
          }
        }
      },
      [options, isOpen, checkPlacement],
    );

    // 键盘导航处理
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (disabled) return;

        switch (e.key) {
          case "ArrowDown": {
            e.preventDefault();
            if (!isOpen) {
              checkPlacement();
              setIsOpen(true);
            } else {
              setHighlightedIndex((prev) => findNextIndex(prev, 1));
            }
            break;
          }
          case "ArrowUp": {
            e.preventDefault();
            if (!isOpen) {
              checkPlacement();
              setIsOpen(true);
            } else {
              setHighlightedIndex((prev) => findNextIndex(prev, -1));
            }
            break;
          }
          case "Home": {
            e.preventDefault();
            if (!isOpen) {
              checkPlacement();
              setIsOpen(true);
            }
            const firstIdx = options.findIndex((opt) => !opt.disabled);
            if (firstIdx !== -1) setHighlightedIndex(firstIdx);
            break;
          }
          case "End": {
            e.preventDefault();
            if (!isOpen) {
              checkPlacement();
              setIsOpen(true);
            }
            for (let i = options.length - 1; i >= 0; i--) {
              if (!options[i].disabled) {
                setHighlightedIndex(i);
                break;
              }
            }
            break;
          }
          case "Enter":
          case " ": {
            e.preventDefault();
            if (!isOpen) {
              checkPlacement();
              triggerSound("click");
              setIsOpen(true);
            } else if (highlightedIndex >= 0 && options[highlightedIndex]) {
              const optionToSelect = options[highlightedIndex];
              if (!optionToSelect.disabled) {
                handleSelectOption(optionToSelect);
              }
            }
            break;
          }
          case "Escape": {
            if (isOpen) {
              e.preventDefault();
              setIsOpen(false);
              triggerSound("pop");
            }
            break;
          }
          case "Tab": {
            if (isOpen) {
              setIsOpen(false);
            }
            break;
          }
          default: {
            if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
              handleTypeahead(e.key);
            }
            break;
          }
        }
      },
      [
        disabled,
        isOpen,
        checkPlacement,
        findNextIndex,
        options,
        highlightedIndex,
        handleSelectOption,
        triggerSound,
        handleTypeahead,
      ],
    );

    const rootClasses = [
      "candy-select",
      `candy-select-${size}`,
      `candy-select-${color}`,
      isOpen ? "candy-select-open" : "",
      disabled ? "candy-select-disabled" : "",
      invalid ? "candy-select-invalid" : "",
      fullWidth ? "candy-select-full-width" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const activeDescendantId =
      isOpen && highlightedIndex >= 0
        ? `${generatedId}-opt-${highlightedIndex}`
        : undefined;

    return (
      <div
        ref={(node) => {
          (
            containerRef as React.MutableRefObject<HTMLDivElement | null>
          ).current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLDivElement | null>).current =
              node;
          }
        }}
        className={rootClasses}
        style={{
          width: fullWidth ? "100%" : undefined,
          ...style,
        }}
        {...rest}
      >
        {/* 表单提交时隐藏的原生 input */}
        {name && (
          <input
            type="hidden"
            name={name}
            value={selectedValue ?? ""}
            disabled={disabled}
          />
        )}

        {/* 下拉触发器按钮槽 */}
        <button
          ref={triggerRef}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={activeDescendantId}
          aria-disabled={disabled}
          aria-invalid={invalid}
          aria-label={ariaLabel}
          disabled={disabled}
          className="candy-select-trigger"
          onClick={handleToggleOpen}
          onKeyDown={handleKeyDown}
        >
          <span className="candy-select-value">
            {selectedOption ? (
              <>
                {selectedOption.icon && (
                  <span className="candy-select-icon" aria-hidden="true">
                    {selectedOption.icon}
                  </span>
                )}
                <span>{selectedOption.label}</span>
              </>
            ) : (
              <span className="candy-select-placeholder">{placeholder}</span>
            )}
          </span>

          {/* 糖果箭头指示器 */}
          <span className="candy-select-arrow" aria-hidden="true">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="4 6 8 10 12 6" />
            </svg>
          </span>
        </button>

        {/* 展开的下拉选项面板 */}
        {isOpen && (
          <div
            ref={dropdownRef}
            id={listboxId}
            role="listbox"
            tabIndex={-1}
            aria-label={ariaLabel}
            className={`candy-select-dropdown candy-select-dropdown-${placement}`}
          >
            <div className="candy-select-options-list">
              {options.length === 0 ? (
                <div className="candy-select-empty">暂无选项</div>
              ) : (
                options.map((option, index) => {
                  const isSelected = option.value === selectedValue;
                  const isHighlighted = index === highlightedIndex;
                  const optionId = `${generatedId}-opt-${index}`;

                  const optionClasses = [
                    "candy-select-option",
                    isSelected ? "candy-select-option-selected" : "",
                    isHighlighted ? "candy-select-option-highlighted" : "",
                    option.disabled ? "candy-select-option-disabled" : "",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <div
                      key={option.value}
                      id={optionId}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={option.disabled}
                      className={optionClasses}
                      onClick={() => handleSelectOption(option)}
                      onMouseEnter={() => {
                        if (!option.disabled) {
                          setHighlightedIndex(index);
                        }
                      }}
                    >
                      <span className="candy-select-option-content">
                        {option.icon && (
                          <span
                            className="candy-select-icon"
                            aria-hidden="true"
                          >
                            {option.icon}
                          </span>
                        )}
                        <span>{option.label}</span>
                      </span>

                      {/* 选中打勾标记 */}
                      {isSelected && (
                        <span
                          className="candy-select-check-icon"
                          aria-hidden="true"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 8.5 6.5 12 13 4" />
                          </svg>
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);

CandySelect.displayName = "CandySelect";
