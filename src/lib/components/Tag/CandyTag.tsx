import React, { forwardRef } from "react";
import { CandyColor } from "../../types";
import { useCandy } from "../../context/CandyProvider";
import "./CandyTag.css";

export type CandyTagColor = CandyColor | "gray";
export type CandyTagVariant = "solid" | "soft" | "outline";
export type CandyTagSize = "sm" | "md" | "lg";

export interface CandyTagProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "color"
> {
  /** 标签颜色，支持项目预设糖果色及 gray */
  color?: CandyTagColor;
  /** 标签变体：实心、柔和底色、描边 */
  variant?: CandyTagVariant;
  /** 尺寸大小 */
  size?: CandyTagSize;
  /** 左侧图标 */
  icon?: React.ReactNode;
  /** 是否支持关闭 */
  closable?: boolean;
  /** 点击或按键关闭回调 */
  onClose?: (
    e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
  ) => void;
  /** 关闭按钮的无障碍标签 */
  closeAriaLabel?: string;
  /** 是否为可切换筛选 Chip */
  checkable?: boolean;
  /** 筛选 Chip 选中状态 */
  checked?: boolean;
  /** 筛选 Chip 状态变更回调 */
  onCheckedChange?: (checked: boolean) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否启用糖果音效反馈 */
  sound?: boolean;
}

export const CandyTag = forwardRef<HTMLSpanElement, CandyTagProps>(
  (
    {
      children,
      color = "blue",
      variant = "solid",
      size = "md",
      icon,
      closable = false,
      onClose,
      closeAriaLabel = "关闭标签",
      checkable = false,
      checked = false,
      onCheckedChange,
      disabled = false,
      sound = true,
      className = "",
      style,
      onClick,
      onKeyDown,
      tabIndex,
      ...rest
    },
    ref,
  ) => {
    const { playSound } = useCandy();

    // 处理 Chip 切换
    const handleToggle = () => {
      if (disabled) return;
      if (sound) {
        playSound("pop");
      }
      onCheckedChange?.(!checked);
    };

    // 处理关闭行为
    const handleClose = (
      e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    ) => {
      if (disabled) return;
      e.stopPropagation();
      if (sound) {
        playSound("bubble");
      }
      onClose?.(e);
    };

    // 点击事件分发
    const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
      if (disabled) return;
      if (checkable) {
        handleToggle();
      }
      onClick?.(e);
    };

    // 键盘无障碍交互
    const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
      if (disabled) return;

      // checkable 支持 Space / Enter 触发
      if (checkable && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        handleToggle();
      }

      // closable 支持聚焦时 Backspace / Delete 快捷关闭
      if (closable && (e.key === "Backspace" || e.key === "Delete")) {
        e.preventDefault();
        handleClose(e);
      }

      onKeyDown?.(e);
    };

    // 可交互状态决定 tabIndex
    const isInteractive = checkable || closable;
    const computedTabIndex = disabled
      ? -1
      : tabIndex !== undefined
        ? tabIndex
        : isInteractive
          ? 0
          : undefined;

    const classes = [
      "candy-tag",
      `candy-tag-${color}`,
      `candy-tag-${variant}`,
      `candy-tag-${size}`,
      checkable ? "candy-tag-checkable" : "",
      checkable && checked ? "candy-tag-checked" : "",
      closable ? "candy-tag-closable" : "",
      disabled ? "candy-tag-disabled" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span
        ref={ref}
        role={checkable ? "button" : undefined}
        aria-pressed={checkable ? checked : undefined}
        aria-disabled={disabled ? true : undefined}
        tabIndex={computedTabIndex}
        className={classes}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        style={style}
        {...rest}
      >
        {icon && (
          <span className="candy-tag-icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="candy-tag-content">{children}</span>
        {closable && (
          <span
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-label={closeAriaLabel}
            className="candy-tag-close-btn"
            onClick={handleClose}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClose(e);
              }
            }}
          >
            <svg
              className="candy-tag-close-icon"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M2.5 2.5L9.5 9.5M9.5 2.5L2.5 9.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </span>
    );
  },
);

CandyTag.displayName = "CandyTag";

export interface CandyTagGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 标签间距 */
  gap?: "xs" | "sm" | "md" | "lg" | number | string;
  /** 对齐方式 */
  align?: "start" | "center" | "end" | "baseline";
  /** 是否自动换行，默认 true */
  wrap?: boolean;
}

export const CandyTagGroup = forwardRef<HTMLDivElement, CandyTagGroupProps>(
  (
    {
      children,
      gap = "sm",
      align = "center",
      wrap = true,
      className = "",
      style,
      ...rest
    },
    ref,
  ) => {
    const isNamedGap =
      typeof gap === "string" && ["xs", "sm", "md", "lg"].includes(gap);
    const classes = [
      "candy-tag-group",
      isNamedGap ? `candy-tag-group-gap-${gap}` : "",
      `candy-tag-group-align-${align}`,
      wrap ? "candy-tag-group-wrap" : "candy-tag-group-nowrap",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const computedStyle: React.CSSProperties = {
      ...style,
      ...(isNamedGap
        ? {}
        : { gap: typeof gap === "number" ? `${gap}px` : gap }),
    };

    return (
      <div ref={ref} className={classes} style={computedStyle} {...rest}>
        {children}
      </div>
    );
  },
);

CandyTagGroup.displayName = "CandyTagGroup";
