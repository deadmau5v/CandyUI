import React, { useEffect, useState } from "react";
import { CandyColor, CandySize } from "../../types";
import { CandyGameIcon } from "../GameIcon/CandyGameIcon";
import "./CandyAvatar.css";

export type CandyAvatarCharacter =
  "bear" | "cat" | "fox" | "rabbit" | "frog" | "crown" | "user";

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
  character = "bear",
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
          <CandyGameIcon
            name={character === "user" ? "character" : character}
            size={iconSize}
            color={resolvedColors.fill}
            aria-hidden="true"
          />
        </div>
      )}
      {level !== undefined && <div className="candy-avatar-badge">{level}</div>}
      {status && (
        <span
          className={`candy-avatar-status candy-avatar-status-${status}`}
          role="img"
          aria-label={status}
          title={status}
        />
      )}
      {onEdit && (
        <button
          type="button"
          className="candy-avatar-edit"
          aria-label={editLabel}
          onClick={onEdit}
        >
          <CandyGameIcon
            name="edit"
            size={14}
            color="currentColor"
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
};
