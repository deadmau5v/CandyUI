import React, { useState, useMemo } from "react";
import {
  CandyGameIcon,
  CandyButton,
  CandySlider,
  CandyPanel,
  CandyInput,
  CandyTabs,
  CandyTabList,
  CandyTab,
  useCandyToast,
} from "candy-ui";
import metaRaw from "../../../../src/lib/components/GameIcon/game-icons-meta.json";

const meta = metaRaw as {
  total: number;
  items: Array<{ name: string; category: string; file: string; url: string }>;
};

const categoryNames: Record<string, string> = {
  "1-game": "Game",
  "2-items": "Items",
  "3-gear": "Gear",
  "4-nature": "Nature",
  "5-food": "Food",
  "6-buildings": "Buildings",
  "7-vehicles": "Vehicles",
  "8-ui": "UI",
  "9-media": "Media",
  "10-editing": "Editing",
  "11-symbols": "Symbols",
  "12-misc": "Misc",
};

const PRESET_COLORS = [
  { name: "Blue", value: "#1761d1" },
  { name: "Pink", value: "#f43f5e" },
  { name: "Green", value: "#10b981" },
  { name: "Yellow", value: "#f59e0b" },
  { name: "Orange", value: "#ea580c" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Dark", value: "#1e293b" },
];

export const GameIconGallery: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [iconSize, setIconSize] = useState<number>(36);
  const [iconColor, setIconColor] = useState<string>("#1761d1");
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const { showToast } = useCandyToast();

  const categories = useMemo(() => {
    const set = new Set<string>();
    meta.items.forEach((item) => set.add(item.category));
    return ["all", ...Array.from(set)];
  }, []);

  const filteredIcons = useMemo(() => {
    const q = search.toLowerCase().trim();
    return meta.items.filter((item) => {
      const matchCat =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchQ =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [search, selectedCategory]);

  const copyCode = (name: string) => {
    const code = `<CandyGameIcon name="${name}" size={${iconSize}} />`;
    navigator.clipboard.writeText(code);
    setCopiedName(name);
    setTimeout(() => setCopiedName(null), 1500);
    showToast({
      title: `Copied: ${code}`,
      variant: "green",
    });
  };

  return (
    <section className="content-width page-content">
      <div className="page-heading">
        <span className="eyebrow">815 ROUNDED GAME ICONS</span>
        <h1>Game Icon Pack</h1>
        <p>
          Derived from the curated rounded game icon collection. Click any icon
          to copy its component code.
        </p>
      </div>

      {/* Source Repository Attribution Banner */}
      <CandyPanel theme="frosted" className="icon-source-banner">
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              background: "var(--candy-surface-alt, #eaf2ff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <CandyGameIcon
              name="controller"
              size={24}
              color="var(--candy-primary, #1761d1)"
            />
          </div>
          <div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "var(--candy-text, #082b4b)",
              }}
            >
              Source Repository:{" "}
              <a
                href="https://github.com/Nieobie/Game-Icon-Pack"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--candy-primary, #1761d1)",
                  textDecoration: "none",
                }}
              >
                Nieobie / Game-Icon-Pack
              </a>
            </div>
            <div
              style={{
                fontSize: 13,
                color: "var(--candy-text-muted, #64748b)",
                marginTop: 3,
              }}
            >
              Open-source collection of 815+ rounded vector game icons.
              Integrated into CandyUI as <code>&lt;CandyGameIcon /&gt;</code>.
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a
            href="https://github.com/Nieobie/Game-Icon-Pack"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <CandyButton
              variant="ghost"
              size="sm"
              shape="rounded"
              leftIcon={
                <CandyGameIcon name="code" size={14} color="currentColor" />
              }
            >
              GitHub Repository
            </CandyButton>
          </a>

          <a
            href="https://nieobie.github.io/game-icon-pack/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <CandyButton
              variant="blue"
              size="sm"
              shape="rounded"
              leftIcon={
                <CandyGameIcon name="earth" size={14} color="#ffffff" />
              }
            >
              Official Site
            </CandyButton>
          </a>
        </div>
      </CandyPanel>

      {/* Controls Bar: Search, Size, Color */}
      <CandyPanel theme="frosted" className="icon-gallery-controls">
        <div style={{ flex: "1 1 260px", minWidth: 220 }}>
          <CandyInput
            placeholder="Search 815 icons (e.g. trophy, sword, potion, heart)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            clearable
            leftIcon={
              <CandyGameIcon name="search" size={16} color="currentColor" />
            }
          />
        </div>

        <div className="icon-config-group">
          <div className="icon-size-control">
            <span style={{ fontSize: 13, color: "var(--candy-text-muted)" }}>
              Size:
            </span>
            <div style={{ width: 110 }}>
              <CandySlider
                min={20}
                max={64}
                value={iconSize}
                onChange={(v) => setIconSize(v)}
                color="blue"
              />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, minWidth: 28 }}>
              {iconSize}px
            </span>
          </div>

          <div className="icon-color-control">
            <span style={{ fontSize: 13, color: "var(--candy-text-muted)" }}>
              Color:
            </span>
            <div className="icon-color-palette">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  aria-label={c.name}
                  className={`icon-color-swatch ${iconColor === c.value ? "active" : ""}`}
                  style={{ background: c.value }}
                  onClick={() => setIconColor(c.value)}
                />
              ))}
              <input
                type="color"
                aria-label="Custom Color"
                className="icon-color-picker-input"
                value={iconColor}
                onChange={(e) => setIconColor(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CandyPanel>

      {/* Category Tabs using official CandyTabs */}
      <div className="icon-tabs-wrapper">
        <CandyTabs
          value={selectedCategory}
          onChange={setSelectedCategory}
          variant="pill"
          size="sm"
          color="blue"
        >
          <CandyTabList aria-label="Icon categories">
            {categories.map((cat) => (
              <CandyTab key={cat} value={cat}>
                {categoryNames[cat] || (cat === "all" ? "All Icons" : cat)}
              </CandyTab>
            ))}
          </CandyTabList>
        </CandyTabs>
      </div>

      {/* Icons Grid or Empty State */}
      {filteredIcons.length === 0 ? (
        <div className="icon-empty-state">
          <CandyGameIcon
            name="search"
            size={48}
            color="var(--candy-text-muted)"
          />
          <h3
            style={{
              fontSize: 18,
              margin: "14px 0 6px",
              color: "var(--candy-text)",
            }}
          >
            No icons found
          </h3>
          <p
            style={{
              fontSize: 13,
              color: "var(--candy-text-muted)",
              margin: "0 0 16px",
            }}
          >
            No matches for "{search}". Try searching for something else.
          </p>
          <CandyButton variant="cream" size="sm" onClick={() => setSearch("")}>
            Clear search
          </CandyButton>
        </div>
      ) : (
        <div className="icon-grid">
          {filteredIcons.map((item) => {
            const isCopied = copiedName === item.name;
            return (
              <CandyPanel
                key={`${item.category}/${item.name}`}
                theme="frosted"
                className={`icon-card ${isCopied ? "copied" : ""}`}
                onClick={() => copyCode(item.name)}
              >
                <div className="icon-card-glyph">
                  {isCopied ? (
                    <CandyGameIcon
                      name="tick"
                      size={iconSize}
                      color="#10b981"
                    />
                  ) : (
                    <CandyGameIcon
                      name={item.name}
                      size={iconSize}
                      color={iconColor}
                    />
                  )}
                </div>
                <span className="icon-card-name">{item.name}</span>
              </CandyPanel>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default GameIconGallery;
