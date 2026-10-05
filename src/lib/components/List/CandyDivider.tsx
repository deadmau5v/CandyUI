import React, { forwardRef } from "react";
import "./CandyList.css";

export type CandyDividerOrientation = "horizontal" | "vertical";

export interface CandyDividerProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * 分割线方向，默认为水平
   */
  orientation?: CandyDividerOrientation;
  /**
   * 是否为虚线样式
   */
  dashed?: boolean;
  /**
   * 渲染的原生标签，在 ul/ol 中使用时可指定为 'li' 以保证语义合法
   */
  as?: "div" | "li";
  /**
   * 分割线中间展示的内容或文字（如“或”、“VS”）
   */
  children?: React.ReactNode;
}

/**
 * CandyDivider 糖果风格水平/垂直分隔线
 * 支持纯分隔线与居中文字徽章（如“或”、“VS”），游戏风格圆润厚边。
 */
export const CandyDivider = forwardRef<HTMLElement, CandyDividerProps>(
  (
    {
      orientation = "horizontal",
      dashed = false,
      as = "div",
      children,
      className = "",
      style,
      role = "separator",
      ...rest
    },
    ref,
  ) => {
    const Component = as as keyof JSX.IntrinsicElements;

    const classes = [
      "candy-divider",
      `candy-divider-${orientation}`,
      dashed ? "candy-divider-dashed" : "",
      children ? "candy-divider-with-text" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return React.createElement(
      Component,
      {
        ref,
        role,
        "aria-orientation": orientation,
        className: classes,
        style,
        ...rest,
      },
      children ? (
        <>
          <span
            className="candy-divider-line candy-divider-line-before"
            aria-hidden="true"
          />
          <span className="candy-divider-content">{children}</span>
          <span
            className="candy-divider-line candy-divider-line-after"
            aria-hidden="true"
          />
        </>
      ) : (
        <span className="candy-divider-line" aria-hidden="true" />
      ),
    );
  },
);

CandyDivider.displayName = "CandyDivider";
