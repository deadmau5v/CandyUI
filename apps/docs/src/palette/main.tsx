import React, { useLayoutEffect } from "react";
import ReactDOM from "react-dom/client";
import { CandyProvider, CandyToastProvider } from "candy-ui";
import { GameShowcaseBoard } from "../components/GameShowcaseBoard";
import "../styles/docs.css";
import "../styles/game-board.css";

 declare global {
  interface Window {
    __PALETTE_READY__?: boolean;
    __PALETTE_SECTIONS__?: string[];
  }
}

const query = new URLSearchParams(window.location.search);
const backgrounds: Record<string, string> = {
  white: "#ffffff", soft: "#f2f7fd", cream: "#fff8dd", sky: "#e5f5ff",
  dots: "#f1f7fd", blue: "#0068f0", navy: "#10234b",
};
const backdrop = query.get("backdrop") || "sky";

function Palette() {
  useLayoutEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-section]"));
    window.__PALETTE_SECTIONS__ = sections.map((section) => section.dataset.section!);
    const selected = (query.get("section") || "all").split(",");
    if (!selected.includes("all")) {
      sections.forEach((section) => { section.hidden = !selected.includes(section.dataset.section!); });
    }
    window.__PALETTE_READY__ = true;
  }, []);
  return <div id="palette-stage" className="palette-canvas" data-backdrop={backdrop} style={{ "--palette-backdrop": backgrounds[backdrop] || backgrounds.sky } as React.CSSProperties}>
    <style>{`.palette-canvas .game-board-container { background: var(--palette-backdrop); max-width: none; }
      .palette-canvas [data-section][hidden] { display: none; }
      .palette-canvas[data-backdrop="blue"] .gb-intro, .palette-canvas[data-backdrop="navy"] .gb-intro { color: white; }
      .palette-canvas:is([data-backdrop="blue"],[data-backdrop="navy"]) .gb-intro :is(p,.gb-eyebrow,h1 > span) { color: white; }
      .palette-canvas[data-backdrop="dots"] { --palette-backdrop: radial-gradient(#bfd3eb 1px,transparent 1px) 0 0 / 18px 18px #f1f7fd; }`}</style>
    <CandyProvider defaultSoundEnabled={false}><CandyToastProvider><GameShowcaseBoard /></CandyToastProvider></CandyProvider>
  </div>;
}
const root = document.getElementById("root");
if (root) ReactDOM.createRoot(root).render(<React.StrictMode><Palette /></React.StrictMode>);
