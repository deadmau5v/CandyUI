import React, { forwardRef } from "react";
import "./CandyBreadcrumb.css";

export interface CandyBreadcrumbItem {
  label: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
}

export interface CandyBreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: CandyBreadcrumbItem[];
  separator?: React.ReactNode;
}

export const CandyBreadcrumb = forwardRef<HTMLElement, CandyBreadcrumbProps>(
  (
    {
      items,
      separator,
      className = "",
      "aria-label": ariaLabel = "Breadcrumb",
      ...rest
    },
    ref,
  ) => (
    <nav
      {...rest}
      ref={ref}
      aria-label={ariaLabel}
      className={`candy-breadcrumb ${className}`.trim()}
    >
      <ol className="candy-breadcrumb-list">
        {items.map((item, index) => {
          const current = index === items.length - 1;
          const content = (
            <>
              {item.icon && (
                <span className="candy-breadcrumb-icon" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              <span>{item.label}</span>
            </>
          );
          return (
            <li key={index} className="candy-breadcrumb-item">
              {index > 0 && (
                <span className="candy-breadcrumb-separator" aria-hidden="true">
                  {separator ?? (
                    <svg viewBox="0 0 16 16" width="16" height="16" fill="none">
                      <path
                        d="m6 3 5 5-5 5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
              )}
              {current ? (
                <span className="candy-breadcrumb-current" aria-current="page">
                  {content}
                </span>
              ) : item.href ? (
                <a
                  className="candy-breadcrumb-link"
                  href={item.href}
                  onClick={item.onClick}
                >
                  {content}
                </a>
              ) : item.onClick ? (
                <button
                  type="button"
                  className="candy-breadcrumb-link"
                  onClick={item.onClick}
                >
                  {content}
                </button>
              ) : (
                <span className="candy-breadcrumb-label">{content}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  ),
);

CandyBreadcrumb.displayName = "CandyBreadcrumb";
