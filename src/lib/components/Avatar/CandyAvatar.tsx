import React, { useEffect, useState } from "react";
import { CandyColor, CandySize } from "../../types";
import { CandyGameIcon } from "../GameIcon/CandyGameIcon";
import "./CandyAvatar.css";

export type CandyAvatarCharacter =
  "smile" | "bear" | "cat" | "fox" | "rabbit" | "frog" | "crown" | "user";

export interface CandyAvatarProps {
  src?: string;
  alt?: string;
  size?: CandySize;
  level?: number | string;
  borderColor?: CandyColor;
  character?: CandyAvatarCharacter;
  icon?: React.ReactNode;
  fallbackBg?: string;
  status?: "online" | "offline" | "away" | "playing";
  onEdit?: () => void;
  editLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const CandyAvatar: React.FC<CandyAvatarProps> = ({
  src,
  alt = "Player Avatar",
  size = "md",
  level,
  borderColor = "yellow",
  character = "smile",
  icon,
  fallbackBg,
  status,
  onEdit,
  editLabel = "Edit avatar",
  className = "",
  style,
}) => {
  const [imgError, setImgError] = useState(false);
  useEffect(() => setImgError(false), [src]);

  const sizeMap: Record<CandySize, number> = {
    xs: 32,
    sm: 44,
    md: 56,
    lg: 72,
    xl: 96,
  };

  const dim = sizeMap[size] || 56;
  const iconSize = Math.round(dim * 0.58);

  const accent =
    borderColor === "blue"
      ? "var(--candy-primary, var(--candy-blue))"
      : borderColor === "ghost"
        ? "var(--candy-panel-shadow)"
        : `var(--candy-${borderColor})`;

  const charColors: Record<CandyAvatarCharacter, { bg: string; fill: string }> =
    {
      smile: { bg: "#ffdf57", fill: "#10234b" },
      bear: { bg: "#fee2e2", fill: "#991b1b" },
      cat: { bg: "#e0e7ff", fill: "#3730a3" },
      fox: { bg: "#ffedd5", fill: "#9a3412" },
      rabbit: { bg: "#fce7f3", fill: "#831843" },
      frog: { bg: "#dcfce7", fill: "#166534" },
      crown: { bg: "#fef3c7", fill: "#854d0e" },
      user: { bg: "#e0f2fe", fill: "#0369a1" },
    };

  const resolvedColors = charColors[character] || charColors.bear;

  return (
    <div
      className={`candy-avatar ${className}`}
      style={{
        width: dim,
        height: dim,
        borderColor: accent,
        ...style,
      }}
    >
      {src && !imgError ? (
        <img src={src} alt={alt} onError={() => setImgError(true)} />
      ) : icon ? (
        <div
          className="candy-avatar-fallback"
          role="img"
          aria-label={alt}
          style={{ background: fallbackBg || resolvedColors.bg }}
        >
          <span aria-hidden="true">{icon}</span>
        </div>
      ) : (
        <div
          className="candy-avatar-fallback"
          role="img"
          aria-label={alt}
          style={{ background: fallbackBg || resolvedColors.bg }}
        >
          {character === "smile" ? (
            <svg viewBox="0 0 80 80" width="100%" height="100%" aria-hidden="true" fill="none" stroke="#10234b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 81v-9c0-16 12-25 27-25s27 9 27 25v9" fill="#ffb833" />
              <path d="m22 55 10 10v15m26-25L48 65v15" />
              <path d="M14 29C14 10 24 4 40 4s26 6 26 25v6c0 16-11 25-26 25S14 51 14 35Z" fill="#ffdf57" />
              <path d="M39 4q-6 5-1 9" />
              <ellipse cx="29" cy="31" rx="2.5" ry="3.5" fill="#10234b" stroke="none" />
              <ellipse cx="51" cy="31" rx="2.5" ry="3.5" fill="#10234b" stroke="none" />
              <path d="M27 41q13 20 26 0Z" fill="#ffffff" />
              <circle cx="19" cy="40" r="3" fill="#ffb14b" stroke="none" />
              <circle cx="61" cy="40" r="3" fill="#ffb14b" stroke="none" />
            </svg>
          ) : (
            <CandyGameIcon name={character === "user" ? "character" : character} size={iconSize} color={resolvedColors.fill} aria-hidden="true" />
          )}
        </div>
      )}
      {level !== undefined && <div className="candy-avatar-badge">{level}</div>}
      {status && <span className={`candy-avatar-status candy-avatar-status-${status}`} role="img" aria-label={status} title={status} />}
      {onEdit && <button type="button" className="candy-avatar-edit" aria-label={editLabel} onClick={onEdit}>
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m4 12 8-8 4 4-8 8-5 1Z" strokeLinejoin="round" /></svg>
      </button>}
    </div>
  );
};
