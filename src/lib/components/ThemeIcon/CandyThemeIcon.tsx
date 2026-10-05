import React, { forwardRef, useId } from "react";
import "./CandyThemeIcon.css";

export type CandyTheme =
  | "robot"
  | "fox"
  | "anime"
  | "burger"
  | "briefcase"
  | "crystal"
  | "cube"
  | "camera";

export interface CandyThemeIconProps extends Omit<
  React.SVGAttributes<SVGSVGElement>,
  "children"
> {
  theme?: CandyTheme;
  size?: number;
  label?: string;
}

function ThemeArtwork({ theme }: { theme: CandyTheme }) {
  switch (theme) {
    case "robot":
      return (
        <>
          <path d="M32 19v-5" />
          <circle cx="32" cy="12" r="3" fill="#ffdc35" />
          <rect x="15" y="20" width="34" height="30" rx="6" fill="#cad8e8" />
          <rect x="11" y="29" width="5" height="12" rx="2" fill="#ff5656" />
          <rect x="48" y="29" width="5" height="12" rx="2" fill="#ff5656" />
          <rect x="20" y="25" width="24" height="13" rx="3" fill="#10234b" />
          <rect
            x="24"
            y="28"
            width="5"
            height="6"
            rx="1"
            fill="#ffdc35"
            stroke="none"
          />
          <rect
            x="35"
            y="28"
            width="5"
            height="6"
            rx="1"
            fill="#35ddae"
            stroke="none"
          />
          <path d="M24 44h16" />
          <path d="M27 41v6m5-6v6m5-6v6" strokeWidth="1.5" />
        </>
      );
    case "fox":
      return (
        <>
          <path
            d="M17 32 13 15q10 0 16 8h6q6-8 16-8l-4 17q4 17-15 23Q13 49 17 32Z"
            fill="#ff9937"
          />
          <path d="m18 19 3 12 6-5Zm28 0-3 12-6-5Z" fill="#4b2c45" />
          <path
            d="M17 35q8 0 15 10 7-10 15-10-1 15-15 20-14-5-15-20Z"
            fill="#fff8e8"
          />
          <ellipse
            cx="24"
            cy="34"
            rx="2.2"
            ry="3"
            fill="#10234b"
            stroke="none"
          />
          <ellipse
            cx="40"
            cy="34"
            rx="2.2"
            ry="3"
            fill="#10234b"
            stroke="none"
          />
          <path d="m28 43 4-2 4 2-4 4Z" fill="#10234b" />
          <path d="M32 47v3" />
          <path d="M29 51q3 4 6 0" fill="#ff6478" />
        </>
      );
    case "anime":
      return (
        <>
          <path d="M21 49q11-9 22 0l4 7H17Z" fill="#ffb642" />
          <ellipse cx="32" cy="35" rx="15" ry="17" fill="#ffd096" />
          <path
            d="m15 33 2-10-3-4 10 1 3-8 5 6 9-6-1 9 10-1-5 7 5 7-9-3-5 7-4-10-6 8-3-7-8 7Z"
            fill="#c87aff"
          />
          <path d="m25 19 5 4m8-4-3 5" stroke="#963fcc" />
          <ellipse
            cx="25"
            cy="37"
            rx="2.3"
            ry="3.4"
            fill="#10234b"
            stroke="none"
          />
          <ellipse
            cx="39"
            cy="37"
            rx="2.3"
            ry="3.4"
            fill="#10234b"
            stroke="none"
          />
          <path d="M28 45q4 4 8 0" fill="none" />
        </>
      );
    case "burger":
      return (
        <>
          <path d="M13 29q1-15 19-15t19 15Z" fill="#ffad36" />
          <path
            d="m23 21 2-1m8-2 2 1m7 4 2 1"
            stroke="#fff1b9"
            strokeWidth="2.5"
          />
          <path d="M13 31h38v5H13Z" fill="#ed5650" />
          <path d="m12 37 7-2 6 3 7-3 6 3 7-3 7 2-3 5H15Z" fill="#66d259" />
          <rect x="13" y="42" width="38" height="6" rx="3" fill="#704030" />
          <path d="m20 41 10 8 9-8" fill="#ffdf42" />
          <path d="M13 49h38q-1 7-9 7H22q-8 0-9-7Z" fill="#ffad36" />
        </>
      );
    case "briefcase":
      return (
        <>
          <path d="M25 21v-6h14v6" fill="none" />
          <rect x="13" y="21" width="38" height="31" rx="4" fill="#f7a643" />
          <path d="M13 32q19 9 38 0" fill="#ffbd65" />
          <path d="M22 21v31m20-31v31" stroke="#ad642c" />
          <rect x="28" y="33" width="8" height="9" rx="1" fill="#ffdf55" />
          <path d="M15 25h3m28 0h3" stroke="#fff0b7" />
        </>
      );
    case "crystal":
      return (
        <>
          <path d="m32 12 15 12-3 22-12 10-12-10-3-22Z" fill="#66dfd2" />
          <path d="m32 12 7 20-7 24-7-24Z" fill="#b3fff0" />
          <path
            d="m17 24 8 8 7-20m15 12-8 8 5 14m-24 0 5-14m7 24 7-24"
            fill="none"
            stroke="#148a92"
          />
          <path
            d="m45 13 2 4 4 2-4 2-2 4-2-4-4-2 4-2Z"
            fill="#ffdf42"
            strokeWidth="1.5"
          />
        </>
      );
    case "cube":
      return (
        <>
          <path d="m32 14 21 12-21 12-21-12Z" fill="#91df54" />
          <path d="m11 26 21 12v21L11 47Z" fill="#c88a40" />
          <path d="m32 38 21-12v21L32 59Z" fill="#9f6839" />
          <path
            d="m11 26 21 12 21-12v8l-5 3v4l-6 3v-4l-5 3-5-3-5-3v4l-6-3v-4l-10-6Z"
            fill="#68b747"
          />
          <path
            d="m21 24 4-2m11 5 4-2m-22 19 4 2m15 5 4-2"
            stroke="#72532d"
            strokeWidth="2"
          />
          <path d="M32 38v21" fill="none" />
        </>
      );
    case "camera":
      return (
        <>
          <path d="m21 24 3-7h16l3 7" fill="#d7e2ed" />
          <rect x="11" y="24" width="42" height="28" rx="5" fill="#536982" />
          <path d="M12 33h40" stroke="#263b58" />
          <rect
            x="15"
            y="27"
            width="8"
            height="4"
            rx="1"
            fill="#ffdc35"
            strokeWidth="1.5"
          />
          <circle cx="34" cy="39" r="12" fill="#dce6ed" />
          <circle cx="34" cy="39" r="8" fill="#203954" />
          <path d="M31 35q3-3 6 0" stroke="#8ae1ff" fill="none" />
          <path d="M48 28v3" stroke="#fff" />
        </>
      );
  }
}

export const CandyThemeIcon = forwardRef<SVGSVGElement, CandyThemeIconProps>(
  ({ theme = "fox", size = 64, label, className = "", ...rest }, ref) => {
    const id = `candy-theme-${useId().replace(/:/g, "")}`;

    return (
      <svg
        ref={ref}
        viewBox="0 0 72 72"
        width={size}
        height={size}
        className={`candy-theme-icon ${className}`.trim()}
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        focusable="false"
        {...rest}
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#22c4ff" />
            <stop offset="1" stopColor="#0068f0" />
          </linearGradient>
        </defs>
        <circle
          cx="36"
          cy="36"
          r="34.5"
          fill="#fff"
          stroke="#a2bacd"
          strokeWidth="1.5"
        />
        <circle
          cx="36"
          cy="36"
          r="30.5"
          fill={`url(#${id})`}
          stroke="#10234b"
          strokeWidth="2.5"
        />
        <path
          d="M17 22q9-14 26-9"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          opacity=".65"
        />
        <g
          transform="translate(4 3)"
          stroke="#10234b"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          <ThemeArtwork theme={theme} />
        </g>
      </svg>
    );
  },
);

CandyThemeIcon.displayName = "CandyThemeIcon";
