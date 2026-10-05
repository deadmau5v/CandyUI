import React, { useState } from "react";
import {
  CandyButton,
  CandySlider,
  CandySwitch,
  CandyProgress,
  CandyBadge,
  CandyPanel,
  CandyGameIcon,
  useCandy,
  useCandyToast,
} from "candy-ui";
import { Character } from "./PlayfulArt";

interface CandyColorPickerProps {
  id: string;
  label: string;
  value: string;
  onChange: (hex: string) => void;
  presets?: string[];
}

function CandyColorPicker({
  id,
  label,
  value,
  onChange,
  presets = [],
}: CandyColorPickerProps) {
  const { playSound } = useCandy();

  return (
    <div className="candy-color-control">
      <div className="candy-color-control-header">
        <label htmlFor={id}>{label}</label>
      </div>
      <div className="candy-color-control-body">
        <div
          className="candy-color-trigger"
          title="Click to pick a custom color"
        >
          <input
            id={id}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="candy-color-hidden-input"
            aria-label={`${label} color picker`}
          />
          <span
            className="candy-color-swatch-disc"
            style={{ backgroundColor: value }}
          >
            <span className="candy-color-swatch-shine" />
          </span>
          <code className="candy-color-code">{value.toUpperCase()}</code>
          <span className="candy-color-icon-wrap" aria-hidden="true">
            <CandyGameIcon name="paint-bucket" size={14} color="#64748b" />
          </span>
        </div>

        {presets.length > 0 && (
          <div className="candy-color-presets" aria-label={`${label} presets`}>
            {presets.map((preset) => {
              const isActive = value.toLowerCase() === preset.toLowerCase();
              return (
                <button
                  key={preset}
                  type="button"
                  className={`candy-color-preset-dot ${isActive ? "is-active" : ""}`}
                  style={{ backgroundColor: preset }}
                  onClick={() => {
                    playSound("pop");
                    onChange(preset);
                  }}
                  title={`Preset: ${preset}`}
                  aria-label={`Select ${preset}`}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const presets = [
  { name: "Ocean Breeze", color: "#2164d9", shadow: "#12427a" },
  { name: "Cherry Pop", color: "#e84376", shadow: "#8f2652" },
  { name: "Forest Run", color: "#28a745", shadow: "#194a2b" },
  { name: "Golden Star", color: "#f59e0b", shadow: "#8a5700" },
  { name: "Grape Soda", color: "#8b5cf6", shadow: "#4c1d95" },
];

export function ThemeCustomizer() {
  const [primary, setPrimary] = useState("#2164d9");
  const [shadow, setShadow] = useState("#12427a");
  const [radius, setRadius] = useState(16);
  const [depth, setDepth] = useState(4);
  const [isDark, setIsDark] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [copied, setCopied] = useState(false);
  const { showToast } = useCandyToast();

  const primaryText = ["#f59e0b", "#ffcb05"].includes(primary)
    ? "#172f56"
    : "#ffffff";

  const variables: Record<string, string> = {
    "--candy-primary": primary,
    "--candy-primary-shadow": shadow,
    "--candy-outline": shadow,
    "--candy-primary-text": primaryText,
    "--candy-btn-depth": `${depth}px`,
    "--candy-radius-sm": `${Math.max(6, radius - 4)}px`,
    "--candy-radius-md": `${radius}px`,
    "--candy-radius-lg": `${radius + 6}px`,
    "--candy-radius-xl": `${radius + 12}px`,
    "--candy-surface": isDark ? "#1e293b" : "#ffffff",
    "--candy-surface-alt": isDark ? "#0f172a" : "#f8fafc",
    "--candy-text": isDark ? "#f8fafc" : "#082b4b",
    "--candy-text-muted": isDark ? "#94a3b8" : "#64748b",
    "--candy-track": isDark ? "#334155" : "#eaf0f8",
    "--candy-card-shadow": isDark
      ? "0 8px 28px rgba(0, 0, 0, 0.45)"
      : "0 8px 24px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.03)",
  };

  const code = `.my-game {
  --candy-primary: ${primary};
  --candy-primary-shadow: ${shadow};
  --candy-outline: ${shadow};
  --candy-primary-text: ${primaryText};
  --candy-btn-depth: ${depth}px;
  --candy-radius-md: ${radius}px;
  --candy-radius-lg: ${radius + 6}px;
  --candy-radius-xl: ${radius + 12}px;
  --candy-surface: ${variables["--candy-surface"]};
  --candy-surface-alt: ${variables["--candy-surface-alt"]};
  --candy-text: ${variables["--candy-text"]};
  --candy-text-muted: ${variables["--candy-text-muted"]};
  --candy-track: ${variables["--candy-track"]};
}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      showToast({ title: "Theme CSS copied to clipboard!", variant: "green" });
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
            {presets.map((p) => {
              const isSelected = primary === p.color;
              return (
                <button
                  key={p.name}
                  type="button"
                  className={`preset-btn ${isSelected ? "selected" : ""}`}
                  onClick={() => {
                    setPrimary(p.color);
                    setShadow(p.shadow);
                  }}
                >
                  <span
                    className="preset-swatch"
                    style={{ background: p.color }}
                  />
                  <span className="preset-name">{p.name}</span>
                  {isSelected && (
                    <CandyGameIcon name="tick" size={16} color="currentColor" />
                  )}
                </button>
              );
            })}
          </div>

          <CandyColorPicker
            id="theme-color"
            label="Primary color"
            value={primary}
            onChange={setPrimary}
            presets={["#2164d9", "#e84376", "#28a745", "#f59e0b", "#8b5cf6"]}
          />

          <CandyColorPicker
            id="theme-shadow"
            label="Shadow color"
            value={shadow}
            onChange={setShadow}
            presets={["#12427a", "#8f2652", "#194a2b", "#8a5700", "#4c1d95"]}
          />

          <div className="color-control" style={{ margin: "14px 0 10px" }}>
            <span>Dark surface</span>
            <div style={{ marginLeft: "auto" }}>
              <CandySwitch
                aria-label="Toggle dark surface preview"
                checked={isDark}
                onChange={setIsDark}
              />
            </div>
          </div>

          <div className="range-label">
            <label htmlFor="radius-slider">Corner radius</label>
            <span>{radius}px</span>
          </div>
          <CandySlider
            aria-label="Corner radius"
            min={6}
            max={24}
            value={radius}
            onChange={setRadius}
            color="blue"
          />
          <div className="range-extents">
            <span>Squared off</span>
            <span>Extra friendly</span>
          </div>

          <div className="range-label">
            <label htmlFor="depth-slider">Button depth</label>
            <span>{depth}px</span>
          </div>
          <CandySlider
            aria-label="Button depth"
            min={0}
            max={8}
            value={depth}
            onChange={setDepth}
            color="blue"
          />
          <div className="range-extents">
            <span>Flat</span>
            <span>Chunky</span>
          </div>

          <div style={{ marginTop: 24 }}>
            <CandyButton
              variant="cream"
              size="sm"
              shape="rounded"
              fullWidth
              onClick={() => {
                setPrimary("#2164d9");
                setShadow("#12427a");
                setRadius(16);
                setDepth(4);
                setIsDark(false);
              }}
            >
              Reset to default
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
              borderColor: isDark ? "#334155" : "#dae6fa",
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
                  shape="rounded"
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

          <div className="code-export">
            <div className="code-head">
              <span>CSS VARIABLES</span>
              <CandyButton
                variant={copied ? "green" : "blue"}
                size="xs"
                onClick={copy}
                leftIcon={
                  copied ? (
                    <CandyGameIcon name="tick" size={12} color="currentColor" />
                  ) : (
                    <CandyGameIcon name="copy" size={12} color="currentColor" />
                  )
                }
              >
                {copied ? "Copied" : "Copy"}
              </CandyButton>
            </div>
            <pre>
              <code>{code}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ThemeCustomizer;
