import React, {
  createContext,
  useContext,
  forwardRef,
  useState,
  useId,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { CandyColor } from "../../types";
import { useCandy } from "../../context/CandyProvider";
import { CandySoundType } from "../../sound/audio";
import "./CandyTabs.css";

export type CandyTabsVariant = "pill" | "underline";
export type CandyTabsSize = "sm" | "md" | "lg";

export interface CandyTabItem {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode | boolean;
  disabled?: boolean;
  children?: React.ReactNode;
  keepMounted?: boolean;
}

export interface CandyTabsProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange"
> {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: CandyTabsVariant;
  size?: CandyTabsSize;
  color?: CandyColor;
  sound?: CandySoundType | boolean;
  keepMounted?: boolean;
  items?: CandyTabItem[];
  fullWidth?: boolean;
}

export interface CandyTabListProps extends React.HTMLAttributes<HTMLDivElement> {
  "aria-label"?: string;
}

export interface CandyTabProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "value"
> {
  value: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode | boolean;
  disabled?: boolean;
}

export interface CandyTabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  keepMounted?: boolean;
}

interface CandyTabsContextValue {
  activeValue: string;
  onValueChange: (val: string) => void;
  variant: CandyTabsVariant;
  size: CandyTabsSize;
  color: CandyColor;
  sound: CandySoundType | boolean;
  keepMounted: boolean;
  baseId: string;
  fullWidth: boolean;
  registerFirstValue: (val: string) => void;
}

const CandyTabsContext = createContext<CandyTabsContextValue | null>(null);

const useCandyTabsContext = () => {
  const context = useContext(CandyTabsContext);
  if (!context) {
    throw new Error(
      "CandyTabs compound components must be used within a CandyTabs container.",
    );
  }
  return context;
};

/**
 * CandyTabs - 糖果/休闲游戏风格选项卡容器组件
 */
export const CandyTabs = forwardRef<HTMLDivElement, CandyTabsProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      variant = "pill",
      size = "md",
      color = "blue",
      sound = "pop",
      keepMounted = false,
      items,
      fullWidth = false,
      children,
      className = "",
      style,
      ...rest
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [firstAvailableValue, setFirstAvailableValue] = useState<
      string | null
    >(null);
    const [internalValue, setInternalValue] = useState<string>(() => {
      if (defaultValue !== undefined) return defaultValue;
      if (items && items.length > 0) return items[0].value;
      return "";
    });

    const activeValue = isControlled
      ? value!
      : internalValue || (firstAvailableValue ?? "");

    const handleValueChange = useCallback(
      (newVal: string) => {
        if (!isControlled) {
          setInternalValue(newVal);
        }
        onChange?.(newVal);
      },
      [isControlled, onChange],
    );

    const registerFirstValue = useCallback((val: string) => {
      setFirstAvailableValue((prev) => prev ?? val);
    }, []);

    const generatedId = useId();
    const baseId = useMemo(
      () => `candy-tabs-${generatedId.replace(/:/g, "")}`,
      [generatedId],
    );

    const contextValue = useMemo<CandyTabsContextValue>(
      () => ({
        activeValue,
        onValueChange: handleValueChange,
        variant,
        size,
        color,
        sound,
        keepMounted,
        baseId,
        fullWidth,
        registerFirstValue,
      }),
      [
        activeValue,
        handleValueChange,
        variant,
        size,
        color,
        sound,
        keepMounted,
        baseId,
        fullWidth,
        registerFirstValue,
      ],
    );

    const rootClasses = [
      "candy-tabs",
      `candy-tabs-${variant}`,
      `candy-tabs-${size}`,
      `candy-tabs-${color}`,
      fullWidth ? "candy-tabs-full-width" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // 单组件 items 数组语法糖
    const renderContent = () => {
      if (items && items.length > 0 && !children) {
        return (
          <>
            <CandyTabList>
              {items.map((item) => (
                <CandyTab
                  key={item.value}
                  value={item.value}
                  icon={item.icon}
                  badge={item.badge}
                  disabled={item.disabled}
                >
                  {item.label}
                </CandyTab>
              ))}
            </CandyTabList>
            {items.map((item) => (
              <CandyTabPanel
                key={item.value}
                value={item.value}
                keepMounted={item.keepMounted}
              >
                {item.children}
              </CandyTabPanel>
            ))}
          </>
        );
      }
      return children;
    };

    return (
      <CandyTabsContext.Provider value={contextValue}>
        <div ref={ref} className={rootClasses} style={style} {...rest}>
          {renderContent()}
        </div>
      </CandyTabsContext.Provider>
    );
  },
);

CandyTabs.displayName = "CandyTabs";

/**
 * CandyTabList - 选项卡头部列表，包含键盘 roving tabindex 导航
 */
export const CandyTabList = forwardRef<HTMLDivElement, CandyTabListProps>(
  ({ children, className = "", onKeyDown, ...rest }, ref) => {
    const { variant, fullWidth } = useCandyTabsContext();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;

      const tabs = Array.from(
        e.currentTarget.querySelectorAll<HTMLButtonElement>(
          'button[role="tab"]:not([disabled]):not([aria-disabled="true"])',
        ),
      );
      if (!tabs.length) return;

      const currentTab = document.activeElement as HTMLButtonElement | null;
      const currentIndex = currentTab ? tabs.indexOf(currentTab) : -1;
      if (currentIndex === -1) return;

      let nextIndex = -1;
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault();
          nextIndex = (currentIndex + 1) % tabs.length;
          break;
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault();
          nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
          break;
        case "Home":
          e.preventDefault();
          nextIndex = 0;
          break;
        case "End":
          e.preventDefault();
          nextIndex = tabs.length - 1;
          break;
        default:
          break;
      }

      if (nextIndex !== -1 && tabs[nextIndex]) {
        tabs[nextIndex].focus();
        tabs[nextIndex].click();
      }
    };

    const classes = [
      "candy-tabs-list",
      `candy-tabs-list-${variant}`,
      fullWidth ? "candy-tabs-full-width" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        role="tablist"
        aria-orientation="horizontal"
        className={classes}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

CandyTabList.displayName = "CandyTabList";

/**
 * CandyTab - 选项卡单个 Tab 按钮
 */
export const CandyTab = forwardRef<HTMLButtonElement, CandyTabProps>(
  (
    {
      value,
      icon,
      badge,
      disabled = false,
      children,
      className = "",
      onClick,
      ...rest
    },
    ref,
  ) => {
    const { activeValue, onValueChange, sound, baseId, registerFirstValue } =
      useCandyTabsContext();
    const { playSound } = useCandy();

    useEffect(() => {
      if (!disabled) {
        registerFirstValue(value);
      }
    }, [disabled, registerFirstValue, value]);

    const isSelected = activeValue === value;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      if (sound !== false) {
        const soundType = typeof sound === "string" ? sound : "pop";
        playSound(soundType);
      }
      onValueChange(value);
      onClick?.(e);
    };

    const classes = [
      "candy-tabs-tab",
      isSelected ? "candy-tabs-tab-selected" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const renderBadge = () => {
      if (badge === true) {
        return <span className="candy-tabs-badge-dot" aria-hidden="true" />;
      }
      if (typeof badge === "number" || typeof badge === "string") {
        return <span className="candy-tabs-badge-count">{badge}</span>;
      }
      if (badge) {
        return <span className="candy-tabs-badge">{badge}</span>;
      }
      return null;
    };

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        id={`${baseId}-tab-${value}`}
        aria-controls={`${baseId}-panel-${value}`}
        aria-selected={isSelected}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        tabIndex={disabled ? -1 : isSelected ? 0 : -1}
        className={classes}
        onClick={handleClick}
        {...rest}
      >
        {icon && (
          <span className="candy-tabs-icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <span>{children}</span>
        {renderBadge()}
      </button>
    );
  },
);

CandyTab.displayName = "CandyTab";

/**
 * CandyTabPanel - 选项卡内容面板
 */
export const CandyTabPanel = forwardRef<HTMLDivElement, CandyTabPanelProps>(
  (
    {
      value,
      keepMounted: propKeepMounted,
      children,
      className = "",
      style,
      ...rest
    },
    ref,
  ) => {
    const {
      activeValue,
      baseId,
      keepMounted: contextKeepMounted,
    } = useCandyTabsContext();

    const isSelected = activeValue === value;
    const shouldMount = isSelected || (propKeepMounted ?? contextKeepMounted);

    if (!shouldMount) {
      return null;
    }

    const classes = ["candy-tabs-panel", className].filter(Boolean).join(" ");

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={`${baseId}-panel-${value}`}
        aria-labelledby={`${baseId}-tab-${value}`}
        tabIndex={0}
        hidden={!isSelected}
        className={classes}
        style={{
          ...style,
          display: isSelected ? style?.display : "none",
        }}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

CandyTabPanel.displayName = "CandyTabPanel";
