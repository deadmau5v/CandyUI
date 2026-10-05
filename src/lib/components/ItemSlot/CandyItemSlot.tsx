import React, { forwardRef } from "react";
import { useCandy } from "../../context/CandyProvider";
import { CandySoundType } from "../../sound/audio";
import "./CandyItemSlot.css";

export type CandyItemRarity =
  "common" | "rare" | "epic" | "legendary" | "mythic";
export type CandyItemSlotSize = "sm" | "md" | "lg" | "xl";

export interface CandyItemSlotProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "onClick"
> {
  /** 稀有度，对应不同底色、高光与流光动画 */
  rarity?: CandyItemRarity;
  /** 道具图标 */
  icon?: React.ReactNode;
  /** 槽位内部主体内容，优先级与 icon 组合使用 */
  children?: React.ReactNode;
  /** 右下角数量角标，若为数值且 >999 则展示 '999+' */
  count?: number | string;
  /** 底部文字标签 */
  label?: React.ReactNode;
  /** 是否选中，选中态有发光描边与轻微上浮 */
  selected?: boolean;
  /** 是否锁定，显示半透明遮罩与锁图标 */
  locked?: boolean;
  /** 是否禁用，降低饱和度并阻止交互 */
  disabled?: boolean;
  /** 右上角角标，true 展示红点，字符串或数字展示徽章 */
  badge?: React.ReactNode | boolean;
  /** 尺寸大小 */
  size?: CandyItemSlotSize;
  /** 交互音效，默认 'click'，设为 false 禁用 */
  sound?: CandySoundType | false;
  /** 点击回调。提供时渲染为 button 元素，否则渲染为 div 元素 */
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  /** 当渲染为 button 时的原生按钮类型 */
  type?: "button" | "submit" | "reset";
}

/** 内联锁图标，圆润游戏糖果风格 */
const LockSvg: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    className={className || "candy-item-slot-lock-svg"}
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 10V7a5 5 0 0 1 10 0v3h1a2 2 0 0 1 2 2v8a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-8a2 2 0 0 1 2-2h1zm3-3a2 2 0 1 1 4 0v3h-4V7zm2 5a2 2 0 0 0-1 1.732V17a1 1 0 1 0 2 0v-2.268A2 2 0 0 0 12 12z"
    />
  </svg>
);

/**
 * CandyItemSlot - 糖果风格游戏道具格 / 签到格通用瓷砖
 */
export const CandyItemSlot = forwardRef<HTMLElement, CandyItemSlotProps>(
  (
    {
      rarity = "common",
      icon,
      children,
      count,
      label,
      selected = false,
      locked = false,
      disabled = false,
      badge,
      size = "md",
      sound = "click",
      onClick,
      type = "button",
      className = "",
      style,
      tabIndex,
      onKeyDown,
      ...rest
    },
    ref,
  ) => {
    const { playSound } = useCandy();
    const isInteractive = Boolean(onClick);
    const isClickDisabled = disabled || locked;

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      if (isClickDisabled) return;
      if (sound) {
        playSound(sound);
      }
      onClick?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(e);
      if (
        !isClickDisabled &&
        isInteractive &&
        (e.key === "Enter" || e.key === " ")
      ) {
        e.preventDefault();
        if (sound) {
          playSound(sound);
        }
        onClick?.(e as unknown as React.MouseEvent<HTMLElement>);
      }
    };

    // 格式化数量角标（>999 显示 999+）
    const renderCount = () => {
      if (count === undefined || count === null || count === "") return null;
      const formatted =
        typeof count === "number" && count > 999 ? "999+" : count;
      return (
        <span
          className="candy-item-slot-count"
          aria-label={`数量: ${formatted}`}
        >
          {formatted}
        </span>
      );
    };

    // 格式化右上角 Badge（红点或文本胶囊）
    const renderBadge = () => {
      if (!badge && badge !== 0) return null;
      if (badge === true) {
        return (
          <span
            className="candy-item-slot-badge candy-item-slot-badge-dot"
            aria-label="提醒"
          />
        );
      }
      return (
        <span className="candy-item-slot-badge candy-item-slot-badge-pill">
          {badge}
        </span>
      );
    };

    const hasShimmer = rarity === "legendary" || rarity === "mythic";

    const rootClasses = [
      "candy-item-slot",
      `candy-item-slot-${size}`,
      `candy-item-slot-${rarity}`,
      isInteractive ? "candy-item-slot-interactive" : "",
      selected ? "candy-item-slot-selected" : "",
      locked ? "candy-item-slot-locked" : "",
      disabled ? "candy-item-slot-disabled" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const commonTileContent = (
      <>
        <div className="candy-item-slot-tile">
          {hasShimmer && (
            <div className="candy-item-slot-shimmer" aria-hidden="true" />
          )}
          <div className="candy-item-slot-content">
            {icon}
            {children}
          </div>
          {locked && (
            <div className="candy-item-slot-locked-overlay" aria-hidden="true">
              <LockSvg />
            </div>
          )}
          {!locked && renderCount()}
          {renderBadge()}
        </div>
        {label && <span className="candy-item-slot-label">{label}</span>}
      </>
    );

    if (isInteractive) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type={type}
          disabled={disabled}
          aria-disabled={isClickDisabled}
          aria-selected={selected}
          className={rootClasses}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : tabIndex}
          style={style}
          {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {commonTileContent}
        </button>
      );
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        role="group"
        aria-disabled={disabled || locked}
        aria-selected={selected}
        className={rootClasses}
        tabIndex={tabIndex}
        style={style}
        {...rest}
      >
        {commonTileContent}
      </div>
    );
  },
);

CandyItemSlot.displayName = "CandyItemSlot";

/* ==========================================================================
   CandyLevelTile
   ========================================================================== */

export interface CandyLevelTileProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "onClick"
> {
  /** 关卡序号或名称 */
  level: number | string;
  /** 获得的星数 (0 - 3) */
  stars?: 0 | 1 | 2 | 3 | number;
  /** 是否锁定关卡 */
  locked?: boolean;
  /** 是否为当前可挑战关卡（带有高亮呼吸光晕） */
  current?: boolean;
  /** 是否被选中 */
  selected?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 尺寸大小 */
  size?: CandyItemSlotSize;
  /** 交互音效，默认 'click'，设为 false 禁用 */
  sound?: CandySoundType | false;
  /** 点击回调。若提供则渲染为 button，否则为 div */
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  /** 原生按钮类型 */
  type?: "button" | "submit" | "reset";
}

/** 5角胖圆星星 SVG */
const StarSvg: React.FC<{ filled?: boolean }> = ({ filled = false }) => (
  <svg
    viewBox="0 0 24 24"
    className={`candy-level-tile-star ${filled ? "candy-level-tile-star-filled" : "candy-level-tile-star-empty"}`}
    aria-hidden="true"
  >
    <path
      stroke="var(--candy-outline, #12427a)"
      strokeWidth="1.5"
      strokeLinejoin="round"
      d="M12 2.5l2.84 5.76 6.36.92-4.6 4.49 1.09 6.33L12 17l-5.69 2.99 1.09-6.33-4.6-4.49 6.36-.92L12 2.5z"
    />
  </svg>
);

/**
 * CandyLevelTile - 糖果风格关卡地图瓷砖
 */
export const CandyLevelTile = forwardRef<HTMLElement, CandyLevelTileProps>(
  (
    {
      level,
      stars = 0,
      locked = false,
      current = false,
      selected = false,
      disabled = false,
      size = "md",
      sound = "click",
      onClick,
      type = "button",
      className = "",
      style,
      tabIndex,
      onKeyDown,
      ...rest
    },
    ref,
  ) => {
    const { playSound } = useCandy();
    const isInteractive = Boolean(onClick);
    const isClickDisabled = disabled || locked;

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      if (isClickDisabled) return;
      if (sound) {
        playSound(sound);
      }
      onClick?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(e);
      if (
        !isClickDisabled &&
        isInteractive &&
        (e.key === "Enter" || e.key === " ")
      ) {
        e.preventDefault();
        if (sound) {
          playSound(sound);
        }
        onClick?.(e as unknown as React.MouseEvent<HTMLElement>);
      }
    };

    const clampedStars = Math.max(0, Math.min(3, Math.round(stars)));

    const rootClasses = [
      "candy-level-tile",
      `candy-level-tile-${size}`,
      current ? "candy-level-tile-current" : "",
      locked ? "candy-level-tile-locked" : "",
      selected ? "candy-level-tile-selected" : "",
      disabled ? "candy-level-tile-disabled" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const tileContent = (
      <div className="candy-level-tile-tile">
        {locked ? (
          <div className="candy-item-slot-locked-overlay" aria-hidden="true">
            <LockSvg />
          </div>
        ) : (
          <span className="candy-level-tile-number">{level}</span>
        )}
        {!locked && (
          <div
            className="candy-level-tile-stars"
            aria-label={`获得 ${clampedStars} 颗星`}
          >
            <StarSvg filled={clampedStars >= 1} />
            <StarSvg filled={clampedStars >= 2} />
            <StarSvg filled={clampedStars >= 3} />
          </div>
        )}
      </div>
    );

    if (isInteractive) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type={type}
          disabled={disabled}
          aria-disabled={isClickDisabled}
          aria-label={`关卡 ${level}${locked ? " (已锁定)" : ""}${!locked ? ` (${clampedStars}星)` : ""}`}
          className={rootClasses}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : tabIndex}
          style={style}
          {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {tileContent}
        </button>
      );
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        aria-label={`关卡 ${level}${locked ? " (已锁定)" : ""}${!locked ? ` (${clampedStars}星)` : ""}`}
        aria-disabled={disabled || locked}
        className={rootClasses}
        tabIndex={tabIndex}
        style={style}
        {...rest}
      >
        {tileContent}
      </div>
    );
  },
);

CandyLevelTile.displayName = "CandyLevelTile";
