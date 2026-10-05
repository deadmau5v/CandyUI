import React from "react";
import { CandyGameIcon } from "candy-ui";

export type CharacterSize = "xs" | "sm" | "md" | "lg";

const iconMap: Record<string, string> = {
  bear: "bear",
  cat: "cat",
  bunny: "rabbit",
  frog: "fox",
};

/** Circular toy-like player token powered by Nieobie game-icon-pack */
export function Character({
  kind = "bear",
  color = "#ffd263",
  size = "md",
  className = "",
}: {
  kind?: "bear" | "frog" | "cat" | "bunny";
  color?: string;
  size?: CharacterSize;
  className?: string;
}) {
  const iconName = iconMap[kind] || "bear";
  const sizeMap: Record<
    CharacterSize,
    { dim: number; iconSize: number; border: number; shadow: number }
  > = {
    xs: { dim: 26, iconSize: 15, border: 1.5, shadow: 1.5 },
    sm: { dim: 34, iconSize: 20, border: 2, shadow: 2 },
    md: { dim: 48, iconSize: 28, border: 2.5, shadow: 2.5 },
    lg: { dim: 72, iconSize: 42, border: 3, shadow: 3.5 },
  };

  const config = sizeMap[size] || sizeMap.md;

  return (
    <div
      className={`candy-player-token candy-player-token-${size} ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: config.dim,
        height: config.dim,
        borderRadius: "50%",
        backgroundColor: color,
        border: `${config.border}px solid #12427a`,
        boxShadow: `inset 0 2px 0 rgba(255, 255, 255, 0.5), 0 ${config.shadow}px 0 #12427a`,
        flexShrink: 0,
        userSelect: "none",
      }}
    >
      <CandyGameIcon name={iconName} size={config.iconSize} color="#12427a" />
    </div>
  );
}

/** CandyUI brand mark featuring a vibrant, playful wrapped candy */
export function CandyMark({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const clipId = React.useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`candy-mark-icon ${className}`}
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        flexShrink: 0,
      }}
      aria-label="CandyUI logo"
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="9" y="9" width="18" height="18" rx="9" />
        </clipPath>
      </defs>

      <g transform="rotate(-15 18 18)">
        {/* Left Wrapper Fan */}
        <path
          d="M11 13.5L3 8C3 8 4.5 14.5 3 18C1.5 21.5 3 28 3 28L11 22.5"
          fill="#ffb3c1"
          stroke="#082b4b"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.8 18H9.5"
          stroke="#082b4b"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Right Wrapper Fan */}
        <path
          d="M25 13.5L33 8C33 8 31.5 14.5 33 18C34.5 21.5 33 28 33 28L25 22.5"
          fill="#ffb3c1"
          stroke="#082b4b"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M32.2 18H26.5"
          stroke="#082b4b"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Cinch Ribbon Ties */}
        <ellipse
          cx="10.5"
          cy="18"
          rx="1.8"
          ry="5.5"
          fill="#ffcb05"
          stroke="#082b4b"
          strokeWidth="2"
        />
        <ellipse
          cx="25.5"
          cy="18"
          rx="1.8"
          ry="5.5"
          fill="#ffcb05"
          stroke="#082b4b"
          strokeWidth="2"
        />

        {/* Candy Body Base */}
        <rect x="9" y="9" width="18" height="18" rx="9" fill="#ff4f79" />

        {/* Diagonal Candy Stripes */}
        <g clipPath={`url(#${clipId})`}>
          <path
            d="M11 5L6 31"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M18 5L13 31"
            stroke="#ffffff"
            strokeWidth="3.2"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M25 5L20 31"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.85"
          />
        </g>

        {/* Top Gloss Highlight */}
        <path
          d="M12.5 12C14.5 10.8 17.5 10.5 21 11.2"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.95"
        />

        {/* Candy Body Outline */}
        <rect
          x="9"
          y="9"
          width="18"
          height="18"
          rx="9"
          fill="none"
          stroke="#082b4b"
          strokeWidth="2.4"
        />
      </g>
    </svg>
  );
}

export function DoodleBackdrop() {
  return null;
}
