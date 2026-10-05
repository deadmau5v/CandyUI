import React, { useState } from "react";
import {
  CandyButton,
  CandyBadge,
  CandyProgress,
  CandySwitch,
  CandySlider,
  CandyPanel,
  CandyGameIcon,
  useCandyToast,
} from "candy-ui";
import { Character } from "./PlayfulArt";

function primaryLabel(hex: string) {
  const channels = hex
    .slice(1)
    .match(/../g)!
    .map((c) => parseInt(c, 16) / 255)
    .map((c) =>
      c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4),
    );
  const luminance =
    channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  return (luminance + 0.05) / 0.078 > 1.05 / (luminance + 0.05)
    ? "#172f56"
    : "#ffffff";
}

const presets = [
  { name: "Classic blue", color: "#1761d1", shadow: "#12427a" },
  { name: "Lilac club", color: "#8559ca", shadow: "#47287d" },
  { name: "Cherry pop", color: "#d74973", shadow: "#8f2652" },
  { name: "Forest friends", color: "#398b56", shadow: "#194a2b" },
];

export function ThemeCustomizer() {
  const [primary, setPrimary] = useState(presets[0].color);
  const [shadow, setShadow] = useState(presets[0].shadow);
  const [radius, setRadius] = useState(18);
  const [depth, setDepth] = useState(5);
  const [enabled, setEnabled] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [copied, setCopied] = useState(false);
  const { showToast } = useCandyToast();

  const primaryText = primaryLabel(primary);
  const variables: Record<string, string> = {
    "--candy-primary-text": primaryText,
    "--candy-primary": primary,
    "--candy-primary-shadow": shadow,
    "--candy-outline": shadow,
    "--candy-btn-depth": `${depth}px`,
    "--candy-radius-md": `${radius}px`,
    "--candy-radius-lg": `${radius + 6}px`,
    "--candy-radius-xl": `${radius + 12}px`,
    "--candy-surface": isDark ? "#1e293b" : "#ffffff",
    "--candy-surface-alt": isDark ? "#0f172a" : "#f8fafc",
    "--candy-text": isDark ? "#f8fafc" : "#173d5d",
    "--candy-text-muted": isDark ? "#94a3b8" : "#536e82",
    "--candy-track": isDark ? "#334155" : "#eaf0f8",
    "--candy-card-shadow": isDark
      ? "0 8px 28px rgba(0, 0, 0, 0.45)"
      : "0 8px 24px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.03)",
  };

  const code = `.my-game {\n  --candy-primary: ${primary};\n  --candy-primary-shadow: ${shadow};\n  --candy-outline: ${shadow};\n  --candy-primary-text: ${primaryText};\n  --candy-btn-depth: ${depth}px;\n  --candy-radius-md: ${radius}px;\n  --candy-radius-lg: ${radius + 6}px;\n  --candy-radius-xl: ${radius + 12}px;\n  --candy-surface: ${variables["--candy-surface"]};\n  --candy-text: ${variables["--candy-text"]};\n}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast({ title: "Clipboard unavailable", variant: "pink" });
    }
  }

  return (
    <section className="content-width page-content">
      <div className="page-heading">
        <span className="eyebrow">A PERSONALITY OF YOUR OWN</span>
        <h1>Same components. Your kind of fun.</h1>
        <p>Pick a palette, dial in the details, and take your theme home.</p>
      </div>

      <div className="studio-grid">
        <CandyPanel theme="frosted" className="studio-controls">
          <h2>Theme studio</h2>

          <label className="field-label">START WITH A PALETTE</label>
          <div className="preset-grid">
            {presets.map((p) => (
              <CandyButton
                key={p.name}
                variant={primary === p.color ? "blue" : "cream"}
                size="sm"
                fullWidth
                onClick={() => {
                  setPrimary(p.color);
                  setShadow(p.shadow);
                }}
                leftIcon={
                  <span
                    className="preset-swatch"
                    style={{ background: p.color, display: "inline-block" }}
                  />
                }
                rightIcon={
                  primary === p.color ? (
                    <CandyGameIcon name="tick" size={14} color="currentColor" />
                  ) : undefined
                }
                style={{ justifyContent: "flex-start", marginBottom: 6 }}
              >
                <span style={{ flex: 1, textAlign: "left", marginLeft: 4 }}>
                  {p.name}
                </span>
              </CandyButton>
            ))}
          </div>

          <div className="color-control">
            <label htmlFor="theme-color">Primary color</label>
            <div className="color-control-inputs">
              <input
                id="theme-color"
                type="color"
                value={primary}
                onChange={(e) => setPrimary(e.target.value)}
              />
              <code>{primary.toUpperCase()}</code>
            </div>
          </div>

          <div className="color-control">
            <label htmlFor="theme-shadow">Shadow color</label>
            <div className="color-control-inputs">
              <input
                id="theme-shadow"
                type="color"
                value={shadow}
                onChange={(e) => setShadow(e.target.value)}
              />
              <code>{shadow.toUpperCase()}</code>
            </div>
          </div>

          <div className="color-control" style={{ margin: "14px 0 10px" }}>
            <span>Dark surface</span>
            <CandySwitch
              aria-label="Toggle dark mode surface"
              checked={isDark}
              onChange={setIsDark}
            />
          </div>

          <label className="range-label">
            Corner radius <span>{radius}px</span>
          </label>
          <CandySlider
            aria-label="Corner radius"
            min={6}
            max={24}
            value={radius}
            onChange={(v) => setRadius(v)}
            color="blue"
          />
          <div className="range-extents">
            <span>Squared off</span>
            <span>Extra friendly</span>
          </div>

          <label className="range-label" style={{ marginTop: 16 }}>
            Button depth <span>{depth}px</span>
          </label>
          <CandySlider
            aria-label="Button depth"
            min={0}
            max={8}
            value={depth}
            onChange={(v) => setDepth(v)}
            color="blue"
          />
          <div className="range-extents">
            <span>Flat</span>
            <span>Chunky</span>
          </div>

          <div style={{ marginTop: 22 }}>
            <CandyButton
              variant="cream"
              size="sm"
              fullWidth
              leftIcon={
                <CandyGameIcon name="change" size={14} color="currentColor" />
              }
              onClick={() => {
                setPrimary(presets[0].color);
                setShadow(presets[0].shadow);
                setRadius(18);
                setDepth(5);
                setIsDark(false);
              }}
            >
              Reset to defaults
            </CandyButton>
          </div>

          <p className="studio-tip">
            Values are pure CSS variables. Drop them on your root element or
            theme container.
          </p>
        </CandyPanel>

        <div className="studio-stage">
          <div className="stage-label">
            <span>LIVE INTERACTIVE PREVIEW</span>
            <span>Go ahead, click around.</span>
          </div>

          <div
            className="theme-stage"
            style={{
              background: isDark ? "#0f172a" : "#edf4ff",
              ...(variables as React.CSSProperties),
            }}
          >
            <CandyPanel theme="frosted" hasRivets={false}>
              <div className="themed-room">
                <div className="themed-title">
                  <h3>The good company club</h3>
                  <CandyBadge variant="blue">3 / 8 PLAYERS</CandyBadge>
                </div>
                <div className="theme-characters">
                  <Character kind="bear" color="#eee4ff" size="sm" />
                  <Character kind="cat" color="#fff0c7" size="sm" />
                  <Character kind="frog" color="#dff3d5" size="sm" />
                </div>
                <h2>Ready when you are.</h2>
                <p>Bring your friends. We’ll bring the fun.</p>
                <CandyButton
                  variant="blue"
                  size="lg"
                  fullWidth
                  rightIcon={
                    <CandyGameIcon
                      name="arrow-right"
                      size={18}
                      color="#ffffff"
                    />
                  }
                  onClick={() =>
                    showToast({
                      title: "Your themed room is ready!",
                      variant: "blue",
                    })
                  }
                >
                  Start a game
                </CandyButton>
                <div className="control-line">
                  <span>Sound effects</span>
                  <CandySwitch
                    aria-label="Preview sound effects"
                    checked={enabled}
                    onChange={setEnabled}
                  />
                </div>
                <div className="meter-label">
                  <span>Room happiness</span>
                  <span>85%</span>
                </div>
                <CandyProgress value={85} variant="blue" showLabel={false} />
              </div>
            </CandyPanel>
          </div>

          <CandyPanel theme="frosted" className="code-export">
            <div className="code-head">
              <span>CSS VARIABLES</span>
              <CandyButton
                variant="blue"
                size="xs"
                onClick={copy}
                leftIcon={
                  copied ? (
                    <CandyGameIcon name="tick" size={12} color="#ffffff" />
                  ) : (
                    <CandyGameIcon name="copy" size={12} color="#ffffff" />
                  )
                }
              >
                {copied ? "Copied" : "Copy CSS"}
              </CandyButton>
            </div>
            <pre>
              <code>{code}</code>
            </pre>
          </CandyPanel>
        </div>
      </div>
    </section>
  );
}

export default ThemeCustomizer;
