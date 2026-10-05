import React, { useState, useEffect, useMemo } from "react";
import { CandyGameIcon } from "candy-ui";

// Rich curated pool of 45 casual game icons from CandyUI
const POOL = [
  "controller",
  "controller-02",
  "crown",
  "trophy",
  "star",
  "heart",
  "sword",
  "broadsword",
  "shield",
  "shield-02",
  "potion",
  "potion-02",
  "dice-04",
  "dice-02",
  "bomb",
  "diamond",
  "diamond-02",
  "key",
  "rocket",
  "ghost",
  "demon",
  "chest",
  "lightning",
  "apple",
  "bread",
  "meat",
  "beer",
  "drink",
  "clock",
  "compass",
  "cards",
  "club-card",
  "target",
  "skull",
  "anchor",
  "flag-02",
  "hammer",
  "light",
  "map",
  "backpack",
  "binoculars",
  "fishhook",
  "bullhorn",
  "carrot",
  "peach",
];

// Deterministic pseudo-random number generator based on grid coords and seed
function pseudoRandom(x: number, y: number, seed: number) {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) * 43758.5453;
  return n - Math.floor(n);
}

export function GameIconWallpaper() {
  const [dimensions, setDimensions] = useState({
    w: typeof window !== "undefined" ? window.innerWidth : 1920,
    h: typeof window !== "undefined" ? window.innerHeight : 1080,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        w: window.innerWidth,
        h: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const items = useMemo(() => {
    // Honeycomb/brick-like staggered layout with loose irregular spacing
    const stepX = 108;
    const stepY = 100;
    const cols = Math.ceil(dimensions.w / stepX) + 2;
    const rows = Math.ceil(dimensions.h / stepY) + 2;
    const result = [];

    for (let r = -1; r < rows; r++) {
      // Offset every other row to break the rectangular grid
      const rowOffset = r % 2 !== 0 ? stepX / 2 : 0;

      for (let c = -1; c < cols; c++) {
        const seed1 = pseudoRandom(c, r, 1);
        const seed2 = pseudoRandom(c, r, 2);
        const seed3 = pseudoRandom(c, r, 3);
        const seed4 = pseudoRandom(c, r, 4);
        const seed5 = pseudoRandom(c, r, 5);

        // Position with irregular natural jitter (offset +/- 22px)
        const posX = c * stepX + rowOffset + (seed1 - 0.5) * 44;
        const posY = r * stepY + (seed2 - 0.5) * 36;

        // Size: significantly larger (52px to 68px) for high game-doodle impact
        const size = Math.round(52 + seed3 * 16);

        // Rotation: natural hand-drawn doodle tilt (-28deg to +28deg)
        const rot = Math.round((seed4 - 0.5) * 56);

        // Opacity: subtle depth variation (0.16 to 0.24)
        const opacity = +(0.16 + seed5 * 0.08).toFixed(2);

        // Icon picker: evenly distributed across all 45 game icons
        const iconIdx =
          Math.floor(seed1 * 1000 + seed2 * 100 + c * 3 + r * 7) % POOL.length;
        const iconName = POOL[(iconIdx + POOL.length) % POOL.length];

        result.push({
          key: `${c}_${r}`,
          x: Math.round(posX),
          y: Math.round(posY),
          size,
          rot,
          opacity,
          iconName,
        });
      }
    }
    return result;
  }, [dimensions.w, dimensions.h]);

  return (
    <div className="game-wallpaper" aria-hidden="true">
      {items.map((item) => (
        <div
          key={item.key}
          className="wallpaper-icon-scatter"
          style={{
            position: "absolute",
            left: item.x,
            top: item.y,
            width: item.size,
            height: item.size,
            transform: `rotate(${item.rot}deg)`,
            opacity: item.opacity,
          }}
        >
          <CandyGameIcon
            name={item.iconName}
            size={item.size}
            color="currentColor"
          />
        </div>
      ))}
    </div>
  );
}

export default GameIconWallpaper;
