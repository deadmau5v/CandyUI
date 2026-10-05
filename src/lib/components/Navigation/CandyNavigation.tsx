import React, { forwardRef } from "react";
import "./CandyNavigation.css";

export interface CandyNavigationItem {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  href?: string;
}

export interface CandyNavigationProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "onChange"
> {
  items: CandyNavigationItem[];
  value?: string;
  onChange?: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  brand?: React.ReactNode;
  footer?: React.ReactNode;
}

export const CandyNavigation = forwardRef<HTMLElement, CandyNavigationProps>(
  (
    {
      items,
      value,
      onChange,
      orientation = "horizontal",
      brand,
      footer,
      className = "",
      "aria-label": ariaLabel = "Navigation",
      ...rest
    },
    ref,
  ) => (
    <nav
      {...rest}
      ref={ref}
      aria-label={ariaLabel}
      className={`candy-navigation candy-navigation-${orientation} ${className}`.trim()}
    >
      {brand && <div className="candy-navigation-brand">{brand}</div>}
      <ul className="candy-navigation-list">
        {items.map((item) => {
          const current = item.value === value;
          const content = (
            <>
              {item.icon && (
                <span className="candy-navigation-icon" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              <span>{item.label}</span>
            </>
          );
          return (
            <li key={item.value} className="candy-navigation-item">
              {item.href && !item.disabled ? (
                <a
                  className="candy-navigation-link"
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  onClick={() => onChange?.(item.value)}
                >
                  {content}
                </a>
              ) : (
                <button
                  type="button"
                  className="candy-navigation-link"
                  disabled={item.disabled}
                  aria-current={current ? "page" : undefined}
                  onClick={() => onChange?.(item.value)}
                >
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {footer && <div className="candy-navigation-footer">{footer}</div>}
    </nav>
  ),
);

CandyNavigation.displayName = "CandyNavigation";
