import React, { useState } from "react";
import { CandyButton, CandyGameIcon, useCandyToast } from "candy-ui";

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("pnpm add candy-ui");
      setCopied(true);
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
            variant="yellow"
            size="lg"
            shape="pill"
            onClick={onExplore}
            rightIcon={
              <CandyGameIcon name="arrow-right" size={20} color="#12427a" />
            }
          >
            Explore components
          </CandyButton>

          <CandyButton
            variant="blue"
            size="lg"
            shape="pill"
            onClick={onCustomize}
            leftIcon={
              <CandyGameIcon name="paint-bucket" size={18} color="#ffffff" />
            }
          >
            Make it yours
          </CandyButton>

          <CandyButton
            variant="cream"
            size="lg"
            shape="pill"
            onClick={onPlayScenarios}
            leftIcon={
              <CandyGameIcon name="controller" size={18} color="#1761d1" />
            }
          >
            Try the demo
          </CandyButton>
        </div>

        <div className="card-hero-meta">
          <button
            type="button"
            className="card-hero-install"
            onClick={handleCopy}
            aria-label="Copy install command: pnpm add candy-ui"
          >
            <span className="card-hero-terminal-dollar" aria-hidden="true">
              $
            </span>
            <code>pnpm add candy-ui</code>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                marginLeft: 8,
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {copied ? (
                <>
                  <CandyGameIcon name="tick" size={14} color="#10b981" /> Copied
                </>
              ) : (
                <>
                  <CandyGameIcon name="copy" size={14} color="#64748b" /> Copy
                </>
              )}
            </span>
          </button>

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
