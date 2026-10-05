import React from "react";
import { CandyGameIcon, CandyThemeIcon, CandyTheme, CandyThemeOption } from "candy-ui";

export const themeDefinitions: { value: CandyTheme; label: string; description: string }[] = [
  { value: "robot", label: "综合", description: "每一局都有新惊喜" },
  { value: "fox", label: "动物", description: "可爱的动物朋友" },
  { value: "anime", label: "动漫", description: "开启想象力冒险" },
  { value: "burger", label: "食物", description: "美味灵感，等你来画" },
  { value: "briefcase", label: "职业", description: "今天你想成为谁？" },
  { value: "crystal", label: "奇幻", description: "走进魔法世界" },
  { value: "cube", label: "方块世界", description: "一起搭建新世界" },
  { value: "camera", label: "物体", description: "发现生活的小乐趣" },
];

export function themeOptions(size = 54): CandyThemeOption[] {
  return themeDefinitions.map(({ value, label }) => ({
    value, label, icon: <CandyThemeIcon theme={value} size={size} />,
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
  const themes: CandyTheme[] = ["fox", "anime", "burger", "cube", "robot", "camera"];
  const titles = ["快乐涂鸦房", "动漫爱好者", "美食俱乐部", "方块冒险", "灵感实验室", "发现生活"];
  return {
    id: index + 1,
    title: `${titles[index % titles.length]}${index < titles.length ? "" : ` ${Math.floor(index / titles.length) + 1}`}`,
    theme: themes[index % themes.length],
    players: [8, 12, 6, 4, 10, 15][index % 6],
    capacity: 15,
  };
});
