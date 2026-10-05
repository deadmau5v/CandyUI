import React, { useState } from "react";
import { CandyButton, CandyGameIcon, useCandy, useCandyToast } from "candy-ui";

export interface ShowHeroProps {
  onExplore?: () => void;
  onCustomize?: () => void;
  onPlayScenarios?: () => void;
}

export function ShowHero({
  onExplore,
  onCustomize,
  onPlayScenarios,
}: ShowHeroProps) {
  const [copied, setCopied] = useState(false);
  const { showToast } = useCandyToast();
  const { playSound } = useCandy();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("pnpm add candy-ui");
      setCopied(true);
      playSound("pop");
      showToast({
        title: "Copied to clipboard: pnpm add candy-ui",
        variant: "green",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast({
        title: "Could not copy. Use pnpm add candy-ui",
        variant: "pink",
      });
    }
  };

  return (
    <section className="card-hero-section" aria-label="CandyUI introduction">
      <div className="card-hero-container">
        <p className="card-hero-kicker">REACT UI FOR WEB GAMES</p>

        <h1 className="card-hero-title">
          Serious components.
          <br />
          <span>Not-so-serious UI.</span>
        </h1>

        <p className="card-hero-desc">
          Friendly, playful React components built for your next web game.
        </p>

        <div className="card-hero-actions">
          <CandyButton
            variant="blue"
            size="lg"
            shape="pill"
            onClick={onExplore}
            rightIcon={
              <CandyGameIcon name="arrow-right" size={20} color="#ffffff" />
            }
          >
            Explore components
          </CandyButton>

          <CandyButton
            variant="ghost"
            size="lg"
            shape="pill"
            onClick={onCustomize}
            leftIcon={
              <CandyGameIcon name="paint-bucket" size={18} color="#1761d1" />
            }
          >
            Make it yours
          </CandyButton>

          <CandyButton
            variant="blue"
            size="lg"
            shape="pill"
            onClick={onPlayScenarios}
            leftIcon={
              <CandyGameIcon name="controller" size={18} color="#ffffff" />
            }
          >
            Try the demo
          </CandyButton>
        </div>

        <div className="card-hero-meta">
          <div
            className="card-hero-install"
            onClick={handleCopy}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCopy();
              }
            }}
            aria-label="Copy install command: pnpm add candy-ui"
          >
            <div className="card-hero-install-cmd">
              <span className="card-hero-terminal-dollar" aria-hidden="true">
                $
              </span>
              <code>pnpm add candy-ui</code>
            </div>
            <CandyButton
              variant={copied ? "green" : "blue"}
              size="sm"
              shape="pill"
              className="card-hero-copy-btn"
              tabIndex={-1}
              leftIcon={
                <CandyGameIcon
                  name={copied ? "tick" : "copy"}
                  size={14}
                  color="#ffffff"
                />
              }
            >
              {copied ? "Copied" : "Copy"}
            </CandyButton>
          </div>

          <div className="card-hero-badges">
            <span>
              <CandyGameIcon name="tick" size={14} color="#10b981" /> TypeScript
              ready
            </span>
            <span>
              <CandyGameIcon name="tick" size={14} color="#10b981" /> Themeable
            </span>
            <span>
              <CandyGameIcon name="tick" size={14} color="#10b981" /> 815 Game
              Icons
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ShowHero;
