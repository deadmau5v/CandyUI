import React from "react";
import { CandyGameIcon, CandyThemeOption } from "candy-ui";

export const themeDefinitions = [
  {
    value: "all",
    label: "综合",
    description: "每一局都有新惊喜",
    assetSrc: "/assets/items/dice.png",
    iconName: "controller",
  },
  {
    value: "animals",
    label: "动物",
    description: "可爱的动物朋友",
    assetSrc: "/assets/avatars/player-corgi.png",
    iconName: "fox",
  },
  {
    value: "anime",
    label: "动漫",
    description: "开启想象力冒险",
    assetSrc: "/assets/avatars/player-anime.png",
    iconName: "crown",
  },
  {
    value: "food",
    label: "美食",
    description: "美味灵感，等你来画",
    assetSrc: "/assets/avatars/player-burger.png",
    iconName: "star",
  },
  {
    value: "detective",
    label: "侦探",
    description: "线索就在细微之处",
    assetSrc: "/assets/items/magnifier.png",
    iconName: "search",
  },
  {
    value: "fantasy",
    label: "奇幻",
    description: "走进魔法奇遇世界",
    assetSrc: "/assets/items/crystal-ball.png",
    iconName: "diamond",
  },
  {
    value: "glory",
    label: "荣耀",
    description: "登顶排行的专属勋章",
    assetSrc: "/assets/items/crown.png",
    iconName: "trophy",
  },
  {
    value: "adventure",
    label: "冒险",
    description: "一起探索神秘宝藏",
    assetSrc: "/assets/items/map.png",
    iconName: "compass",
  },
] as const;

export type GameTheme = (typeof themeDefinitions)[number]["value"];

export function themeOptions(size = 44): CandyThemeOption[] {
  return themeDefinitions.map(({ value, label, description, assetSrc }) => ({
    value,
    label,
    description,
    icon: (
      <img
        src={assetSrc}
        alt={label}
        className="gb-theme-badge-asset"
        style={{
          width: size,
          height: size,
          objectFit: "contain",
          filter: "drop-shadow(0 3px 6px rgba(16, 35, 75, 0.14))",
        }}
      />
    ),
  }));
}

export const gameNavigation = [
  { value: "home", label: "首页", icon: <CandyGameIcon name="home" size={22} /> },
  { value: "rooms", label: "房间", icon: <CandyGameIcon name="controller" size={22} /> },
  { value: "ranking", label: "排行榜", icon: <CandyGameIcon name="trophy" size={22} /> },
  { value: "shop", label: "商店", icon: <CandyGameIcon name="diamond" size={22} /> },
  { value: "settings", label: "设置", icon: <CandyGameIcon name="settings" size={22} /> },
];

export const demoRooms = Array.from({ length: 30 }, (_, index) => {
  const roomMeta = [
    { title: "快乐涂鸦房", theme: "food" as GameTheme, icon: "/assets/items/cake.png" },
    { title: "动漫爱好者", theme: "anime" as GameTheme, icon: "/assets/avatars/player-anime.png" },
    { title: "柯基侦探社", theme: "animals" as GameTheme, icon: "/assets/avatars/player-corgi.png" },
    { title: "探秘寻宝队", theme: "adventure" as GameTheme, icon: "/assets/items/chest.png" },
    { title: "灵感实验室", theme: "all" as GameTheme, icon: "/assets/items/bulb.png" },
    { title: "魔法学院房", theme: "fantasy" as GameTheme, icon: "/assets/items/potion.png" },
  ];
  const meta = roomMeta[index % roomMeta.length];
  return {
    id: index + 1,
    title: `${meta.title}${index < roomMeta.length ? "" : ` ${Math.floor(index / roomMeta.length) + 1}`}`,
    theme: meta.theme,
    iconSrc: meta.icon,
    players: [8, 12, 6, 4, 10, 15][index % 6],
    capacity: 15,
  };
});
