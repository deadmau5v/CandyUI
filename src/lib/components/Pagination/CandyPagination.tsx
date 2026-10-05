import React, { forwardRef } from "react";
import "./CandyPagination.css";

export interface CandyPaginationProps extends React.HTMLAttributes<HTMLElement> {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

function positiveInteger(value: number, fallback: number) {
  return Number.isFinite(value)
    ? Math.max(1, Math.min(Number.MAX_SAFE_INTEGER, Math.floor(value)))
    : fallback;
}

export const CandyPagination = forwardRef<HTMLElement, CandyPaginationProps>(
  (
    {
      page,
      totalPages,
      onPageChange,
      siblingCount = 1,
      disabled = false,
      size = "md",
      className = "",
      "aria-label": ariaLabel = "Pagination",
      ...rest
    },
    ref,
  ) => {
    const total = positiveInteger(totalPages, 1);
    const current = Math.min(total, positiveInteger(page, 1));
    const siblings = Number.isFinite(siblingCount)
      ? Math.max(0, Math.min(10, Math.floor(siblingCount)))
      : 1;
    const start = Math.max(2, current - siblings);
    const end = Math.min(total - 1, current + siblings);
    const pages: (number | "start-gap" | "end-gap")[] = [1];

    if (start === 3) pages.push(2);
    else if (start > 3) pages.push("start-gap");

    for (let number = start; number <= end; number++) pages.push(number);

    if (end === total - 2 && total > 2) pages.push(total - 1);
    else if (end < total - 2) pages.push("end-gap");

    if (total > 1) pages.push(total);

    function changePage(next: number) {
      const clamped = Math.max(1, Math.min(total, next));
      if (!disabled && clamped !== current) onPageChange(clamped);
    }

    return (
      <nav
        {...rest}
        ref={ref}
        aria-label={ariaLabel}
        className={`candy-pagination candy-pagination-${size} ${className}`.trim()}
      >
        <button
          type="button"
          className="candy-pagination-button"
          aria-label="Previous page"
          disabled={disabled || current === 1}
          onClick={() => changePage(current - 1)}
        >
          <svg
            viewBox="0 0 20 20"
            width="18"
            height="18"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="m12 5-5 5 5 5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {pages.map((number) =>
          typeof number === "number" ? (
            <button
              key={number}
              type="button"
              className="candy-pagination-button"
              aria-label={`Go to page ${number}`}
              aria-current={number === current ? "page" : undefined}
              disabled={disabled}
              onClick={() => changePage(number)}
            >
              {number}
            </button>
          ) : (
            <span
              key={number}
              className="candy-pagination-gap"
              aria-hidden="true"
            >
              …
            </span>
          ),
        )}
        <button
          type="button"
          className="candy-pagination-button"
          aria-label="Next page"
          disabled={disabled || current === total}
          onClick={() => changePage(current + 1)}
        >
          <svg
            viewBox="0 0 20 20"
            width="18"
            height="18"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="m8 5 5 5-5 5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </nav>
    );
  },
);

CandyPagination.displayName = "CandyPagination";
