import React, { useState } from "react";
import { CandyButton, CandyGameIcon, useCandy, useCandyToast } from "candy-ui";

export interface ShowHeroProps {
  onExplore?: () => void;
  onShowcase?: () => void;
}

const PM_COMMANDS = {
  bun: "bun add github:deadmau5v/CandyUI",
  pnpm: "pnpm add github:deadmau5v/CandyUI",
  npm: "npm i github:deadmau5v/CandyUI",
} as const;

type PMType = keyof typeof PM_COMMANDS;

export function ShowHero({
  onExplore,
  onShowcase,
}: ShowHeroProps) {
  const [pm, setPm] = useState<PMType>("bun");
  const [copied, setCopied] = useState(false);
  const { showToast } = useCandyToast();
  const { playSound } = useCandy();

  const currentCmd = PM_COMMANDS[pm];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCmd);
      setCopied(true);
      playSound("pop");
      showToast({
        title: `Copied: ${currentCmd}`,
        variant: "green",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast({
        title: `Could not copy. Use: ${currentCmd}`,
        variant: "pink",
      });
    }
  };

  return (
    <section className="card-hero-section" aria-label="CandyUI introduction">
      <div className="card-hero-container">
        <img src="/assets/badges/turtle-wave.png" alt="" aria-hidden="true" className="hero-sticker hero-sticker-top-left" />
        <img src="/assets/items/trophy.png" alt="" aria-hidden="true" className="hero-sticker hero-sticker-top-right" />
        <img src="/assets/items/chest.png" alt="" aria-hidden="true" className="hero-sticker hero-sticker-bottom-left" />
        <img src="/assets/badges/sparkles.png" alt="" aria-hidden="true" className="hero-sticker hero-sticker-bottom-right" />

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
            variant="yellow"
            size="lg"
            shape="pill"
            onClick={onShowcase}
            leftIcon={
              <CandyGameIcon name="controller" size={20} color="#10234b" />
            }
          >
            Game showcase
          </CandyButton>
        </div>

        <div className="card-hero-meta">
          <div className="card-hero-pm-selector" role="tablist" aria-label="Package manager">
            {(["bun", "pnpm", "npm"] as const).map((key) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={pm === key}
                className={`card-hero-pm-tab ${pm === key ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setPm(key);
                  playSound("click");
                }}
              >
                {key}
              </button>
            ))}
          </div>

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
            aria-label={`Copy install command: ${currentCmd}`}
          >
            <div className="card-hero-install-cmd">
              <span className="card-hero-terminal-dollar" aria-hidden="true">
                $
              </span>
              <code>{currentCmd}</code>
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
