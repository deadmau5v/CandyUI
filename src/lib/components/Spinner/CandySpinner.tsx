import React, { forwardRef } from "react";
import { CandyColor, CandySize } from "../../types";
import "./CandySpinner.css";

/* --------------------------------------------------------------------------
   CandySpinner
   -------------------------------------------------------------------------- */
export type CandySpinnerVariant = "dots" | "ring";

export interface CandySpinnerProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "color"
> {
  /** Spinner display style: bouncy 3-color candy dots or chunky ring swirl */
  variant?: CandySpinnerVariant;
  /** Size tier of the spinner: 'xs' | 'sm' | 'md' | 'lg' | 'xl' */
  size?: CandySize;
  /** Candy color theme */
  color?: CandyColor;
  /** Accessible label announced by screen readers */
  label?: string;
}

/**
 * CandySpinner - 糖果风加载转圈组件
 * 支持三色弹跳点 (dots) 与厚实糖果圆环 (ring)，具有糖果内阴影与多尺寸支持。
 */
export const CandySpinner = forwardRef<HTMLDivElement, CandySpinnerProps>(
  (
    {
      variant = "ring",
      size = "md",
      color,
      label = "加载中...",
      className = "",
      style,
      ...rest
    },
    ref,
  ) => {
    const isColored = Boolean(color);
    const colorClass = color ? `candy-spinner-${color}` : "";
    const sizeClass = `candy-spinner-${size}`;
    const variantClass =
      variant === "dots" ? "candy-spinner-dots" : "candy-spinner-ring";

    const classes = [
      "candy-spinner",
      variantClass,
      sizeClass,
      colorClass,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        aria-label={label || undefined}
        className={classes}
        style={style}
        {...(variant === "dots"
          ? { "data-colored": isColored ? "true" : "false" }
          : {})}
        {...rest}
      >
        {variant === "dots" ? (
          <>
            <span
              className="candy-spinner-dot candy-spinner-dot-1"
              aria-hidden="true"
            />
            <span
              className="candy-spinner-dot candy-spinner-dot-2"
              aria-hidden="true"
            />
            <span
              className="candy-spinner-dot candy-spinner-dot-3"
              aria-hidden="true"
            />
          </>
        ) : null}
        {label ? <span className="candy-spinner-sr-only">{label}</span> : null}
      </div>
    );
  },
);

CandySpinner.displayName = "CandySpinner";

/* --------------------------------------------------------------------------
   CandySkeleton
   -------------------------------------------------------------------------- */
export interface CandySkeletonProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "color"
> {
  /** Width of the skeleton block or multiline container */
  width?: string | number;
  /** Height of the skeleton block or each line in multiline mode */
  height?: string | number;
  /** Whether to render as a circle placeholder */
  circle?: boolean;
  /** Number of text placeholder lines; if > 1, renders paragraph layout with shorter last line */
  lines?: number;
  /** Whether shimmer wave animation is active */
  animated?: boolean;
  /** Color theme for the skeleton */
  variant?: CandyColor;
}

const formatDimension = (val?: string | number): string | undefined => {
  if (val === undefined) return undefined;
  return typeof val === "number" ? `${val}px` : val;
};

/**
 * CandySkeleton - 圆角糖果风骨架屏占位块
 * 支持单块、圆形、多行文本段落骨架与流畅的糖霜流光 shimmer 动画。
 */
export const CandySkeleton = forwardRef<HTMLDivElement, CandySkeletonProps>(
  (
    {
      width,
      height,
      circle = false,
      lines = 1,
      animated = true,
      variant,
      className = "",
      style,
      ...rest
    },
    ref,
  ) => {
    const colorClass = variant ? `candy-spinner-${variant}` : "";
    const animatedClass = animated ? "candy-skeleton-animated" : "";
    const circleClass = circle ? "candy-skeleton-circle" : "";

    // Multiple lines paragraph skeleton
    if (lines > 1) {
      const containerClasses = [
        "candy-skeleton-multiline",
        colorClass,
        className,
      ]
        .filter(Boolean)
        .join(" ");

      const containerStyle: React.CSSProperties = {
        width: formatDimension(width) || "100%",
        ...style,
      };

      const lineElements = Array.from({ length: lines }, (_, idx) => {
        const isLastLine = idx === lines - 1;
        const lineClasses = [
          "candy-skeleton-line",
          animatedClass,
          isLastLine ? "candy-skeleton-line-last" : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div
            key={idx}
            className={lineClasses}
            style={{
              height: formatDimension(height) || "14px",
            }}
            aria-hidden="true"
          />
        );
      });

      return (
        <div
          ref={ref}
          role="status"
          aria-live="polite"
          aria-busy="true"
          className={containerClasses}
          style={containerStyle}
          {...rest}
        >
          {lineElements}
          <span className="candy-spinner-sr-only">正在载入内容...</span>
        </div>
      );
    }

    // Single block or circle skeleton
    const classes = [
      "candy-skeleton",
      circleClass,
      animatedClass,
      colorClass,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const computedStyle: React.CSSProperties = {
      width: circle
        ? formatDimension(width || height || 40)
        : formatDimension(width),
      height: circle
        ? formatDimension(height || width || 40)
        : formatDimension(height),
      ...style,
    };

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        aria-busy="true"
        className={classes}
        style={computedStyle}
        {...rest}
      >
        <span className="candy-spinner-sr-only">正在载入内容...</span>
      </div>
    );
  },
);

CandySkeleton.displayName = "CandySkeleton";

/* --------------------------------------------------------------------------
   CandyLoadingOverlay
   -------------------------------------------------------------------------- */
export interface CandyLoadingOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Whether the loading overlay is active and blocking interaction */
  loading: boolean;
  /** Content to be wrapped */
  children?: React.ReactNode;
  /** Optional message displayed below the spinner */
  text?: React.ReactNode;
  /** Custom spinner element (defaults to CandySpinner) */
  spinner?: React.ReactNode;
  /** Props forwarded to default CandySpinner */
  spinnerProps?: CandySpinnerProps;
  /** Whether to apply backdrop blur filter to wrapped content */
  blur?: boolean;
  /** Whether to wrap the spinner and text in a solid candy panel */
  panel?: boolean;
}

/**
 * CandyLoadingOverlay - 糖果风加载遮罩层
 * 包裹任意子内容，在 loading 为 true 时叠加半透明遮罩与居中 Spinner，阻止底层交互。
 */
export const CandyLoadingOverlay = forwardRef<
  HTMLDivElement,
  CandyLoadingOverlayProps
>(
  (
    {
      loading,
      children,
      text,
      spinner,
      spinnerProps,
      blur = true,
      panel = true,
      className = "",
      style,
      ...rest
    },
    ref,
  ) => {
    const containerClasses = ["candy-loading-overlay", className]
      .filter(Boolean)
      .join(" ");

    const contentClasses = [
      "candy-loading-overlay-content",
      loading ? "candy-loading-overlay-content-blocked" : "",
      loading && blur ? "candy-loading-overlay-content-blur" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const spinnerNode =
      spinner !== undefined ? (
        spinner
      ) : (
        <CandySpinner size="lg" {...spinnerProps} />
      );

    return (
      <div ref={ref} className={containerClasses} style={style} {...rest}>
        <div
          className={contentClasses}
          aria-hidden={loading ? true : undefined}
          tabIndex={loading ? -1 : undefined}
        >
          {children}
        </div>

        {loading ? (
          <div
            className="candy-loading-overlay-mask"
            role="status"
            aria-live="polite"
            aria-busy="true"
          >
            {panel ? (
              <div className="candy-loading-overlay-box">
                {spinnerNode}
                {text ? (
                  <div className="candy-loading-overlay-text">{text}</div>
                ) : null}
              </div>
            ) : (
              <div className="candy-loading-overlay-raw">
                {spinnerNode}
                {text ? (
                  <div className="candy-loading-overlay-text">{text}</div>
                ) : null}
              </div>
            )}
          </div>
        ) : null}
      </div>
    );
  },
);

CandyLoadingOverlay.displayName = "CandyLoadingOverlay";
