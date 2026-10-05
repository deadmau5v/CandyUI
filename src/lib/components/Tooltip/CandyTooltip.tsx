import React, { useEffect, useId, useRef, useState } from "react";
import "./CandyTooltip.css";

export interface CandyTooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: "top" | "bottom";
  className?: string;
}

export const CandyTooltip: React.FC<CandyTooltipProps> = ({
  content,
  children,
  position = "top",
  className = "",
}) => {
  const [visible, setVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState<"top" | "bottom">(
    position,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    setActualPosition(position);
  }, [position]);

  const showTooltip = () => {
    if (typeof window !== "undefined" && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (position === "top" && rect.top < 48) {
        setActualPosition("bottom");
      } else if (
        position === "bottom" &&
        window.innerHeight - rect.bottom < 48
      ) {
        setActualPosition("top");
      } else {
        setActualPosition(position);
      }
    } else {
      setActualPosition(position);
    }
    setVisible(true);
  };

  const hideTooltip = () => {
    setVisible(false);
  };

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      onKeyDown={(event) => {
        if (event.key === "Escape") setVisible(false);
      }}
    >
      {React.cloneElement(children, {
        "aria-describedby":
          [children.props["aria-describedby"], visible ? id : undefined]
            .filter(Boolean)
            .join(" ") || undefined,
      })}
      {visible && (
        <div
          id={id}
          role="tooltip"
          className={`candy-tooltip ${className}`}
          style={
            actualPosition === "top"
              ? { bottom: "calc(100% + 8px)" }
              : { top: "calc(100% + 8px)" }
          }
        >
          {content}
        </div>
      )}
    </div>
  );
};
