import React, { createContext, useContext, forwardRef } from "react";
import { CandySize } from "../../types";
import { useCandy } from "../../context/CandyProvider";
import { CandySoundType } from "../../sound/audio";
import {
  CandyDivider,
  CandyDividerProps,
  CandyDividerOrientation,
} from "./CandyDivider";
import "./CandyList.css";

export { CandyDivider };
export type { CandyDividerProps, CandyDividerOrientation };

export type CandyListVariant = "plain" | "card" | "ranked";

export interface CandyListContextValue {
  variant: CandyListVariant;
  size: CandySize;
  divided: boolean;
  sound: CandySoundType | boolean;
}

const CandyListContext = createContext<CandyListContextValue>({
  variant: "plain",
  size: "md",
  divided: false,
  sound: "click",
});

/* --------------------------------------------------------------------------
   CandyList Component
   -------------------------------------------------------------------------- */
export interface CandyListProps extends React.HTMLAttributes<HTMLUListElement> {
  /**
   * 列表形态变体：
   * - 'plain': 连续面板卡片容器，内部行由分割线隔开，适合设置或常规列表
   * - 'card': 每个条目为独立圆润泡泡卡片，悬浮投影与点击弹性反馈，适合任务/邮件/背包
   * - 'ranked': 排行榜变体，前三名自动赋予金/银/铜强调色与奖牌徽章（支持通过 rank 属性、data-rank 或子项索引自动推断）
   * @default 'plain'
   */
  variant?: CandyListVariant;
  /**
   * 列表统一尺寸规范
   * @default 'md'
   */
  size?: CandySize;
  /**
   * 是否在条目之间显示分割线
   * @default false
   */
  divided?: boolean;
  /**
   * 点击可交互行时的音效类型，设为 false 关闭音效
   * @default 'click'
   */
  sound?: CandySoundType | boolean;
  /**
   * 子节点
   */
  children?: React.ReactNode;
}

/**
 * CandyList 糖果风格列表容器组件
 * 专为排行榜、游戏任务列表、邮件列表打造，具备厚边与果冻质感。
 */
export const CandyList = forwardRef<HTMLUListElement, CandyListProps>(
  (
    {
      variant = "plain",
      size = "md",
      divided = false,
      sound = "click",
      children,
      className = "",
      style,
      role = "list",
      ...rest
    },
    ref,
  ) => {
    // 在 ranked 变体下，自动为未显式传入 rank 的 CandyListItem 赋予索引名次 (1, 2, 3...)
    let rankIndex = 1;
    const items = React.Children.map(children, (child) => {
      if (React.isValidElement(child) && child.type === CandyListItem) {
        const existingRank = child.props.rank;
        const assignedRank =
          existingRank ?? (variant === "ranked" ? rankIndex++ : undefined);
        return React.cloneElement(
          child as React.ReactElement<CandyListItemProps>,
          {
            rank: assignedRank,
          },
        );
      }
      return child;
    });

    const classes = [
      "candy-list",
      `candy-list-${variant}`,
      `candy-list-${size}`,
      divided ? "candy-list-divided" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <CandyListContext.Provider value={{ variant, size, divided, sound }}>
        <ul ref={ref} role={role} className={classes} style={style} {...rest}>
          {items}
        </ul>
      </CandyListContext.Provider>
    );
  },
);

CandyList.displayName = "CandyList";

/* --------------------------------------------------------------------------
   CandyListItem Component
   -------------------------------------------------------------------------- */
export interface CandyListItemProps extends Omit<
  React.LiHTMLAttributes<HTMLLIElement>,
  "title"
> {
  /**
   * 左侧节点（如头像、图标、自定义节点等）
   */
  leading?: React.ReactNode;
  /**
   * 列表项主标题
   */
  title?: React.ReactNode;
  /**
   * 列表项副标题或说明文字
   */
  description?: React.ReactNode;
  /**
   * 右侧节点（如分数、操作按钮、时间、标签等）
   */
  trailing?: React.ReactNode;
  /**
   * 是否选中状态
   * @default false
   */
  selected?: boolean;
  /**
   * 是否高亮显示（例如排行榜中“我自己”的行，使用主题强调色与微光底色）
   * @default false
   */
  highlight?: boolean;
  /**
   * 是否可点击交互。若传入 onClick 也会自动识别为可交互项，具备 hover/active 按压下沉与 focus-visible
   * @default false
   */
  interactive?: boolean;
  /**
   * 是否在底部显示分割线（在 plain 变体下默认由列表管理，也可显式指定）
   */
  divider?: boolean;
  /**
   * 是否禁用
   * @default false
   */
  disabled?: boolean;
  /**
   * 排行榜名次编号（1 为金牌、2 为银牌、3 为铜牌，4 及之后为常规名次徽章）。
   * 徽章由纯 CSS 绘制，不依赖外部组件。
   */
  rank?: number;
  /**
   * 单项覆盖尺寸，默认继承 CandyList 的 size
   */
  size?: CandySize;
  /**
   * 点击音效，覆盖列表统一配置
   */
  sound?: CandySoundType | boolean;
  /**
   * 自定义内容节点（作为行内主体内容）
   */
  children?: React.ReactNode;
}

/**
 * CandyListItem 糖果风格列表项行容器
 * 支持 leading、title、description、trailing、名次徽章、交互下沉及无障碍焦点。
 */
export const CandyListItem = forwardRef<HTMLLIElement, CandyListItemProps>(
  (
    {
      leading,
      title,
      description,
      trailing,
      selected = false,
      highlight = false,
      interactive,
      divider,
      disabled = false,
      rank,
      size,
      sound,
      className = "",
      style,
      onClick,
      onKeyDown,
      children,
      tabIndex,
      ...rest
    },
    ref,
  ) => {
    const listContext = useContext(CandyListContext);
    const { playSound } = useCandy();

    const isInteractive = interactive ?? Boolean(onClick);
    const effectiveSize = size ?? listContext?.size ?? "md";
    const effectiveSound = sound ?? listContext?.sound ?? "click";
    const effectiveDivider =
      divider ?? (listContext?.divided && listContext?.variant === "plain");

    // 名次推断：优先从 rank prop 获取，其次从 rest['data-rank'] 获取
    const rawDataRank = (rest as Record<string, unknown>)["data-rank"];
    const itemRank =
      rank ?? (rawDataRank !== undefined ? Number(rawDataRank) : undefined);

    const handleClick = (e: React.MouseEvent<HTMLLIElement>) => {
      if (disabled) return;
      if (isInteractive && effectiveSound) {
        const soundType =
          typeof effectiveSound === "string" ? effectiveSound : "click";
        playSound(soundType);
      }
      onClick?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLLIElement>) => {
      if (disabled) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleClick(e as unknown as React.MouseEvent<HTMLLIElement>);
      } else if (isInteractive) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          const next = e.currentTarget.nextElementSibling as HTMLElement | null;
          if (next && typeof next.focus === "function") {
            next.focus();
          }
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          const prev = e.currentTarget
            .previousElementSibling as HTMLElement | null;
          if (prev && typeof prev.focus === "function") {
            prev.focus();
          }
        }
      }
      onKeyDown?.(e);
    };

    const classes = [
      "candy-list-item",
      `candy-list-item-${effectiveSize}`,
      isInteractive ? "candy-list-item-interactive" : "",
      selected ? "candy-list-item-selected" : "",
      highlight ? "candy-list-item-highlight" : "",
      effectiveDivider ? "candy-list-item-divider" : "",
      disabled ? "candy-list-item-disabled" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const computedTabIndex = disabled
      ? -1
      : (tabIndex ?? (isInteractive ? 0 : undefined));

    return (
      <li
        ref={ref}
        role="listitem"
        aria-selected={selected ? true : undefined}
        aria-disabled={disabled ? true : undefined}
        data-rank={itemRank}
        tabIndex={computedTabIndex}
        className={classes}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        style={style}
        {...rest}
      >
        {/* Leading 区域：渲染 CSS 绘制的名次徽章或自定义 leading 节点 */}
        {(itemRank !== undefined || leading) && (
          <div className="candy-list-item-leading">
            {itemRank !== undefined && (
              <span
                className="candy-list-item-rank-badge"
                aria-label={`第 ${itemRank} 名`}
              >
                {itemRank}
              </span>
            )}
            {leading}
          </div>
        )}

        {/* 内容区域：主标题与描述文字 */}
        {(title !== undefined || description !== undefined || children) && (
          <div className="candy-list-item-content">
            {title !== undefined && (
              <div className="candy-list-item-title">{title}</div>
            )}
            {description !== undefined && (
              <div className="candy-list-item-desc">{description}</div>
            )}
            {children}
          </div>
        )}

        {/* Trailing 区域：右侧操作、分数、标签等 */}
        {trailing !== undefined && (
          <div className="candy-list-item-trailing">{trailing}</div>
        )}
      </li>
    );
  },
);

CandyListItem.displayName = "CandyListItem";
