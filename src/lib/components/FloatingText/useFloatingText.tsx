import React, { useState, useCallback } from "react";
import { FloatingItem, CandyFloatingText } from "./CandyFloatingText";
import { CandyColor } from "../../types";

export const useFloatingText = () => {
  const [items, setItems] = useState<FloatingItem[]>([]);

  const spawnText = useCallback(
    ({
      text,
      x,
      y,
      color = "yellow",
    }: {
      text: string;
      x: number;
      y: number;
      color?: CandyColor;
    }) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setItems((prev) => [...prev, { id, text, x, y, color }]);
    },
    [],
  );

  const removeText = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const FloatingTextContainer: React.FC = useCallback(() => {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          pointerEvents: "none",
          zIndex: 9999,
        }}
      >
        {items.map((item) => (
          <CandyFloatingText
            key={item.id}
            item={item}
            onComplete={removeText}
          />
        ))}
      </div>
    );
  }, [items, removeText]);

  return {
    spawnText,
    FloatingTextContainer,
  };
};
