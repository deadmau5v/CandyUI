import React from "react";
import { CandyRibbon, CandyRibbonColor } from "./CandyRibbon";
import "./CandyPanel.css";

export type CandyPanelTheme = "cookie" | "bubblegum" | "cyber" | "frosted";

export interface CandyPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  theme?: CandyPanelTheme;
  ribbon?: React.ReactNode;
  ribbonColor?: CandyRibbonColor;
  ribbonIcon?: React.ReactNode;
  hasRivets?: boolean;
  innerWell?: boolean;
}

export const CandyPanel: React.FC<CandyPanelProps> = ({
  children,
  theme = "cookie",
  ribbon,
  ribbonColor = "blue",
  ribbonIcon,
  hasRivets = false,
  innerWell = false,
  className = "",
  style,
  ...rest
}) => {
  const panelClasses = ["candy-panel", `candy-panel-${theme}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={panelClasses}
      style={{ padding: ribbon ? "24px 20px 20px 20px" : "20px", ...style }}
      {...rest}
    >
      {hasRivets && (
        <>
          <div className="candy-panel-rivet candy-panel-rivet-tl" />
          <div className="candy-panel-rivet candy-panel-rivet-tr" />
          <div className="candy-panel-rivet candy-panel-rivet-bl" />
          <div className="candy-panel-rivet candy-panel-rivet-br" />
        </>
      )}

      {ribbon && (
        <CandyRibbon color={ribbonColor} icon={ribbonIcon}>
          {ribbon}
        </CandyRibbon>
      )}

      {innerWell ? (
        <div className="candy-panel-inner">{children}</div>
      ) : (
        children
      )}
    </div>
  );
};
