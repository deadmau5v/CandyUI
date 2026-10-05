import React, { useMemo, useCallback, useSyncExternalStore } from "react";
import { FloatingItem, CandyFloatingText } from "./CandyFloatingText";
import { CandyColor } from "../../types";

export interface SpawnTextOptions {
  text: string;
  x: number;
  y: number;
  color?: CandyColor;
}

export interface FloatingTextContainerProps {
  className?: string;
  style?: React.CSSProperties;
}

export const useFloatingText = () => {
  const store = useMemo(() => {
    let items: FloatingItem[] = [];
    const listeners = new Set<() => void>();

    const notify = () => {
      listeners.forEach((listener) => listener());
    };

    return {
      getItems: () => items,
      addItem: (item: FloatingItem) => {
        items = [...items, item];
        notify();
      },
      removeItem: (id: string) => {
        items = items.filter((it) => it.id !== id);
        notify();
      },
      subscribe: (listener: () => void) => {
        listeners.add(listener);
        return () => {
          listeners.delete(listener);
        };
      },
    };
  }, []);

  const spawnText = useCallback(
    ({ text, x, y, color = "yellow" }: SpawnTextOptions) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      store.addItem({ id, text, x, y, color });
    },
    [store],
  );

  const FloatingTextContainer: React.FC<FloatingTextContainerProps> = useMemo(() => {
    const Container: React.FC<FloatingTextContainerProps> = ({
      className,
      style,
    }) => {
      const items = useSyncExternalStore(
        store.subscribe,
        store.getItems,
        store.getItems,
      );

      return (
        <div
          className={
            className
              ? `candy-floating-text-container ${className}`
              : "candy-floating-text-container"
          }
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: 0,
            height: 0,
            pointerEvents: "none",
            zIndex: 9999,
            ...style,
          }}
        >
          {items.map((item) => (
            <CandyFloatingText
              key={item.id}
              item={item}
              onComplete={store.removeItem}
            />
          ))}
        </div>
      );
    };
    Container.displayName = "FloatingTextContainer";
    return Container;
  }, [store]);

  return {
    spawnText,
    FloatingTextContainer,
  };
};
