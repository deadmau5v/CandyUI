import React from "react";
import allIconsRaw from "./all-icons.json";

export type GameIconName = string;

interface IconData {
  body: string;
  viewBox: string;
}

const allIcons = allIconsRaw as Record<string, IconData>;

// Friendly aliases for high-frequency UI/game concepts
const aliases: Record<string, string> = {
  coins: "coin",
  gold: "coin",
  money: "coin",
  gem: "diamond",
  crystal: "diamond-02",
  sparkles: "star",
  zap: "lightning",
  thunder: "lightning",
  flame: "fire",
  check: "tick",
  cross: "cross",
  users: "user-group",
  people: "user-group",
  globe: "earth",
  world: "earth",
  close: "cross",
  cancel: "cross",
  settings: "settings",
  gear: "settings",
  trophy: "trophy",
  cup: "trophy",
  controller: "controller",
  gamepad: "controller",
  heart: "heart",
  life: "heart",
  copy: "copy",
  play: "play",
  refresh: "change",
  reload: "change",
  arrowright: "arrow-right",
  arrowleft: "arrow-left",
  arrowup: "arrow-up",
  arrowdown: "arrow-down",
  sound: "volume",
  volume: "volume",
  mute: "volume-off",
};

export interface CandyGameIconProps extends React.SVGAttributes<SVGElement> {
  name: GameIconName;
  size?: number | string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const CandyGameIcon: React.FC<CandyGameIconProps> = ({
  name,
  size = 24,
  color = "currentColor",
  className = "",
  style,
  ...rest
}) => {
  const clean = name
    .toLowerCase()
    .trim()
    .replace(/\.svg$/, "");
  const targetKey = aliases[clean] || clean;
  const iconData = allIcons[targetKey] || allIcons["controller"] || null;

  if (!iconData) {
    return null;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={iconData.viewBox || "0 0 10 10"}
      width={size}
      height={size}
      fill={color}
      className={`candy-game-icon ${className}`}
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        flexShrink: 0,
        ...style,
      }}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: iconData.body }}
      {...rest}
    />
  );
};

export default CandyGameIcon;
