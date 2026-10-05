import React, { forwardRef, useId, useState } from "react";
import { CandyButton } from "../Button/CandyButton";
import { CandyTag } from "../Tag/CandyTag";
import { CandyStatusBadge } from "../StatusBadge/CandyStatusBadge";
import "./CandyCard.css";

export interface CandyCardProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "title"
> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
}

export const CandyCard = forwardRef<HTMLElement, CandyCardProps>(
  (
    { title, description, icon, footer, children, className = "", ...rest },
    ref,
  ) => (
    <article ref={ref} className={`candy-card ${className}`.trim()} {...rest}>
      {(icon || title || description) && (
        <header className="candy-card-header">
          {icon && (
            <span className="candy-card-icon" aria-hidden="true">
              {icon}
            </span>
          )}
          <div className="candy-card-heading">
            {title && <h3 className="candy-card-title">{title}</h3>}
            {description && (
              <p className="candy-card-description">{description}</p>
            )}
          </div>
        </header>
      )}
      {children && <div className="candy-card-body">{children}</div>}
      {footer && <footer className="candy-card-footer">{footer}</footer>}
    </article>
  ),
);

CandyCard.displayName = "CandyCard";

export interface CandyThemeCardProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "title" | "onSelect" | "children"
> {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  selected?: boolean;
  onSelect?: () => void;
}

export const CandyThemeCard = forwardRef<
  HTMLButtonElement,
  CandyThemeCardProps
>(
  (
    {
      title,
      description,
      icon,
      selected = false,
      onSelect,
      onClick,
      disabled,
      type = "button",
      className = "",
      "aria-describedby": describedBy,
      ...rest
    },
    ref,
  ) => {
    const descriptionId = useId();

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        aria-pressed={selected}
        aria-describedby={
          describedBy ?? (description ? descriptionId : undefined)
        }
        className={`candy-theme-card ${selected ? "candy-theme-card-selected" : ""} ${className}`.trim()}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) onSelect?.();
        }}
        {...rest}
      >
        {icon && (
          <span className="candy-theme-card-icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <span className="candy-theme-card-title">{title}</span>
        {description && (
          <span id={descriptionId} className="candy-theme-card-description">
            {description}
          </span>
        )}
        {selected && (
          <span className="candy-theme-card-check" aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none">
              <path
                d="m4 8 2.5 2.5L12 5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </button>
    );
  },
);

CandyThemeCard.displayName = "CandyThemeCard";

export interface CandyThemeOption {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface CandyThemeGridProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange" | "defaultValue"
> {
  options: CandyThemeOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  columns?: number;
}

export const CandyThemeGrid = forwardRef<HTMLDivElement, CandyThemeGridProps>(
  (
    {
      options,
      value,
      defaultValue,
      onChange,
      disabled = false,
      columns,
      className = "",
      style,
      "aria-label": label = "Choose a theme",
      ...rest
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const selectedValue = value !== undefined ? value : internalValue;
    const columnCount =
      columns && Number.isFinite(columns)
        ? Math.max(1, Math.floor(columns))
        : undefined;

    return (
      <div
        ref={ref}
        role="group"
        aria-label={label}
        className={`candy-theme-grid ${className}`.trim()}
        style={{
          gridTemplateColumns: columnCount
            ? `repeat(${columnCount}, minmax(0, 1fr))`
            : undefined,
          ...style,
        }}
        {...rest}
      >
        {options.map((option) => (
          <CandyThemeCard
            key={option.value}
            title={option.label}
            description={option.description}
            icon={option.icon}
            selected={selectedValue === option.value}
            disabled={disabled || option.disabled}
            onSelect={() => {
              if (value === undefined) setInternalValue(option.value);
              onChange?.(option.value);
            }}
          />
        ))}
      </div>
    );
  },
);

CandyThemeGrid.displayName = "CandyThemeGrid";

export type CandyConnection = "good" | "fair" | "poor" | "offline";
export type CandyRoomStatus = "waiting" | "playing" | "full" | "closed";

export interface CandyRoomCardProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "title"
> {
  title: React.ReactNode;
  icon?: React.ReactNode;
  theme?: React.ReactNode;
  players: number;
  capacity: number;
  connection?: CandyConnection;
  connectionLabel?: string;
  status?: CandyRoomStatus;
  compact?: boolean;
  joinLabel?: React.ReactNode;
  onJoin?: () => void;
  disabled?: boolean;
}

const connectionLabels: Record<CandyConnection, string> = {
  good: "Good connection",
  fair: "Fair connection",
  poor: "Poor connection",
  offline: "Offline",
};

const roomLabels: Record<CandyRoomStatus, string> = {
  waiting: "Waiting",
  playing: "In game",
  full: "Full",
  closed: "Closed",
};

export const CandyRoomCard = forwardRef<HTMLElement, CandyRoomCardProps>(
  (
    {
      title,
      icon,
      theme,
      players,
      capacity,
      connection = "good",
      connectionLabel,
      status = "waiting",
      compact = false,
      joinLabel = "Join room",
      onJoin,
      disabled = false,
      className = "",
      ...rest
    },
    ref,
  ) => {
    const occupied = Number.isFinite(players)
      ? Math.max(0, Math.floor(players))
      : 0;
    const limit = Number.isFinite(capacity)
      ? Math.max(0, Math.floor(capacity))
      : 0;
    const full = occupied >= limit || status === "full";
    const effectiveStatus =
      status === "closed" ? "closed" : full ? "full" : status;
    const blocked =
      disabled || full || status === "closed" || connection === "offline";
    const bars = { good: 4, fair: 3, poor: 1, offline: 0 }[connection];

    return (
      <article
        ref={ref}
        className={`candy-card candy-room-card ${compact ? "candy-room-card-compact" : ""} ${className}`.trim()}
        {...rest}
      >
        {icon && (
          <span className="candy-room-card-icon" aria-hidden="true">
            {icon}
          </span>
        )}
        <div className="candy-room-card-details">
          <h3 className="candy-card-title">{title}</h3>
          <div className="candy-room-card-tags">
            {theme && (
              <CandyTag size="sm" variant="soft" color="yellow">
                {theme}
              </CandyTag>
            )}
            {effectiveStatus !== "waiting" && (
              <CandyStatusBadge
                status={
                  effectiveStatus === "playing"
                    ? "playing"
                    : effectiveStatus === "full"
                      ? "full"
                      : "offline"
                }
                label={roomLabels[effectiveStatus]}
                size="sm"
              />
            )}
          </div>
          <span
            className="candy-room-card-players"
            aria-label={`${occupied} of ${limit} players`}
          >
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="10" cy="6" r="3" />
              <path d="M4 17v-2a6 6 0 0 1 12 0v2Z" />
            </svg>
            {occupied} / {limit}
          </span>
        </div>
        <span
          className={`candy-room-connection candy-room-connection-${connection}`}
          role="img"
          aria-label={connectionLabel ?? connectionLabels[connection]}
          title={connectionLabel ?? connectionLabels[connection]}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {[0, 1, 2, 3].map((bar) => (
              <rect
                key={bar}
                x={2 + bar * 6}
                y={18 - bar * 4}
                width="4"
                height={5 + bar * 4}
                rx="1"
                opacity={bar < bars ? 1 : 0.18}
              />
            ))}
          </svg>
          <span className="candy-room-connection-label" aria-hidden="true">
            {connectionLabel ?? connectionLabels[connection]}
          </span>
        </span>
        <CandyButton
          size="sm"
          variant="blue"
          disabled={blocked}
          onClick={onJoin}
          className="candy-room-card-join"
        >
          {joinLabel}
        </CandyButton>
      </article>
    );
  },
);

CandyRoomCard.displayName = "CandyRoomCard";
