import React, { useState } from "react";
import {
  CandyButton,
  CandyIconButton,
  CandyBadge,
  CandyPanel,
  CandyModal,
  CandyProgress,
  CandySlider,
  CandySwitch,
  CandyCounter,
  CandyAvatar,
  CandyTooltip,
  CandyFloatingText,
  useFloatingText,
  useCandyToast,
  triggerCandyConfetti,
  CandyColor,
  CandySize,
  CandyGameIcon,
  CandyInput,
  CandyTextarea,
  CandyField,
  CandySelect,
  CandySelectOption,
  CandyTabs,
  CandyTabList,
  CandyTab,
  CandyTabPanel,
  CandyCheckbox,
  CandyRadio,
  CandyRadioGroup,
  CandyItemSlot,
  CandyLevelTile,
  CandyRating,
  CandyStars,
  CandyTag,
  CandyTagGroup,
  CandySpinner,
  CandySkeleton,
  CandyLoadingOverlay,
  CandyList,
  CandyListItem,
  CandyDivider,
} from "candy-ui";

import { Character } from "./PlayfulArt";

const catalog = [
  {
    id: "buttons",
    name: "Buttons",
    component: "CandyButton",
    description: "Clear actions, friendly corners, and a little push-back.",
    props: [
      [
        "variant",
        "CandyColor",
        "'blue'",
        "Semantic color; blue uses your primary theme.",
      ],
      ["size", "CandySize", "'md'", "Five sizes from xs to xl."],
      [
        "shape",
        "CandyShape",
        "'pill'",
        "Pill by default; rounded honors theme radius, plus square or circle.",
      ],
      [
        "sound",
        "CandySoundType | false",
        "'pop'",
        "Optional synthesized click feedback.",
      ],
      ["disabled", "boolean", "false", "Disables the action."],
      ["fullWidth", "boolean", "false", "Fills the available width."],
    ],
  },
  {
    id: "badges",
    name: "Badges",
    component: "CandyBadge",
    description: "A small status with just enough personality.",
    props: [
      ["variant", "CandyColor", "'pink'", "Badge color."],
      ["size", "'sm' | 'md' | 'lg'", "'md'", "Label size."],
      ["icon", "ReactNode", "—", "Optional leading icon."],
    ],
  },
  {
    id: "panels",
    name: "Panels & ribbons",
    component: "CandyPanel",
    description:
      "A clean home for your game UI, not another layer of decoration.",
    props: [
      [
        "theme",
        "CandyPanelTheme",
        "'cookie'",
        "Surface theme: cookie, bubblegum, cyber, frosted.",
      ],
      ["ribbon", "ReactNode", "—", "Optional title banner."],
      ["hasRivets", "boolean", "false", "Optional corner detail."],
      ["innerWell", "boolean", "false", "Inset content surface."],
    ],
  },
  {
    id: "modals",
    name: "Dialogs",
    component: "CandyModal",
    description:
      "Pause the action for the moments that need a little attention.",
    props: [
      ["isOpen", "boolean", "required", "Controls visibility."],
      ["onClose", "() => void", "required", "Close callback."],
      ["title", "ReactNode", "—", "Dialog title."],
      ["width", "string | number", "'480px'", "Responsive dialog width."],
    ],
  },
  {
    id: "progress",
    name: "Progress",
    component: "CandyProgress",
    description:
      "A little closer to the next level. Animated candy stripes and sparkle markers.",
    props: [
      ["value", "number", "required", "Current progress value."],
      ["max", "number", "100", "Upper bound."],
      [
        "variant",
        "CandyColor",
        "'blue'",
        "Color theme: blue, green, yellow, pink, purple, orange.",
      ],
      ["striped", "boolean", "true", "Animated diagonal candy stripes."],
      ["sparkle", "boolean", "true", "Leading sparkle circle marker."],
      ["height", "number", "24", "Height of the progress bar in pixels."],
      [
        "showLabel",
        "boolean | function",
        "true",
        "Show percentage or custom formatted text.",
      ],
      ["icon", "ReactNode", "—", "Optional leading status icon."],
    ],
  },
  {
    id: "sliders",
    name: "Sliders",
    component: "CandySlider",
    description: "Smooth dragging, crisp thumb, and playful game controls.",
    props: [
      ["value", "number", "required", "Current slider value."],
      [
        "onChange",
        "(val: number) => void",
        "required",
        "Change event callback.",
      ],
      ["min", "number", "0", "Minimum bound."],
      ["max", "number", "100", "Maximum bound."],
      ["color", "CandyColor", "'blue'", "Track accent color."],
      ["disabled", "boolean", "false", "Disables interaction."],
    ],
  },
  {
    id: "switches",
    name: "Switches",
    component: "CandySwitch",
    description: "Toy-like toggle switch for game settings and sound toggles.",
    props: [
      ["checked", "boolean", "required", "Controlled switch state."],
      [
        "onChange",
        "(checked: boolean) => void",
        "required",
        "State change callback.",
      ],
      ["disabled", "boolean", "false", "Disables interaction."],
      ["color", "CandyColor", "'green'", "Accent color when active."],
    ],
  },
  {
    id: "counters",
    name: "Counters",
    component: "CandyCounter",
    description:
      "Animated number display with optional coin/heart/star icon badges.",
    props: [
      ["value", "number", "required", "Numeric value to display."],
      ["icon", "ReactNode", "—", "Icon element displayed in badge."],
      [
        "iconBg",
        "CandyColor",
        "'yellow'",
        "Background color for the icon bubble.",
      ],
      ["size", "CandySize", "'md'", "Counter size."],
    ],
  },
  {
    id: "avatars",
    name: "Avatars",
    component: "CandyAvatar",
    description: "Put a face to a name, and help at their fingertips.",
    props: [
      ["src", "string", "required", "Avatar image URL."],
      ["alt", "string", "'Player Avatar'", "Accessible description."],
      ["level", "number | string", "—", "Optional level label."],
      ["size", "CandySize", "'md'", "Avatar dimensions."],
    ],
  },
  {
    id: "tooltips",
    name: "Tooltips",
    component: "CandyTooltip",
    description: "Playful contextual hints and popovers at your fingertips.",
    props: [
      ["content", "ReactNode", "required", "Tooltip text or element."],
      [
        "position",
        "'top' | 'bottom' | 'left' | 'right'",
        "'top'",
        "Placement relative to target.",
      ],
      ["delay", "number", "200", "Show delay in milliseconds."],
    ],
  },
  {
    id: "floating-text",
    name: "Floating text",
    component: "CandyFloatingText",
    description:
      "Floating game damage, XP, and combo numbers that animate and fade.",
    props: [
      ["text", "string | number", "required", "Text or score to display."],
      ["variant", "CandyColor", "'yellow'", "Text color theme."],
      ["size", "CandySize", "'md'", "Text scale."],
      ["duration", "number", "1000", "Animation duration in ms."],
    ],
  },
  {
    id: "feedback",
    name: "Toasts & confetti",
    component: "useCandyToast",
    description: "Celebrate the wins. Keep the feedback helpful.",
    props: [
      ["title", "string", "required", "Toast heading."],
      ["description", "string", "—", "Optional detail."],
      ["variant", "CandyColor", "'yellow'", "Feedback color."],
    ],
  },
  {
    id: "inputs",
    name: "Inputs",
    component: "CandyInput",
    description:
      "Sunken game groove slot inputs, password toggles, and form field wrappers.",
    props: [
      ["value", "string", "—", "Controlled input value."],
      ["onChange", "(e) => void", "—", "Change event handler."],
      ["size", "CandyInputSize", "'md'", "'sm' | 'md' | 'lg'."],
      ["clearable", "boolean", "false", "Show clear button when filled."],
      ["label", "ReactNode", "—", "Accessible field label."],
      ["hint", "ReactNode", "—", "Helper text below the input."],
      ["error", "ReactNode", "—", "Error feedback message."],
    ],
  },
  {
    id: "selects",
    name: "Selects",
    component: "CandySelect",
    description:
      "Accessible candy dropdown with pop-down listbox and audio feedback.",
    props: [
      ["options", "CandySelectOption[]", "[]", "Selectable options array."],
      ["value", "string | number", "—", "Selected option value."],
      ["onChange", "(val, opt) => void", "—", "Change callback."],
      ["placeholder", "string", "—", "Placeholder text."],
      ["size", "CandySize", "'md'", "Control size."],
      ["color", "CandyColor", "'blue'", "Theme accent color."],
      ["disabled", "boolean", "false", "Disable user interaction."],
    ],
  },
  {
    id: "tabs",
    name: "Tabs",
    component: "CandyTabs",
    description:
      "Playful tabbed navigation with jelly pill and underline indicators.",
    props: [
      ["value", "string", "—", "Active tab identifier."],
      ["onChange", "(val: string) => void", "—", "Tab switch callback."],
      ["variant", "'pill' | 'underline'", "'pill'", "Visual slider style."],
      ["color", "CandyColor", "'pink'", "Tab accent color."],
      ["size", "'sm' | 'md' | 'lg'", "'md'", "Tab button size."],
    ],
  },
  {
    id: "checkboxes",
    name: "Checkboxes",
    component: "CandyCheckbox",
    description:
      "Bouncy tactile checkboxes and radio groups with springy SVG checkmarks.",
    props: [
      ["checked", "boolean", "false", "Checked state."],
      ["onChange", "(checked) => void", "—", "Toggle callback."],
      ["label", "ReactNode", "—", "Inline label text."],
      ["color", "CandyColor", "'pink'", "Theme accent color."],
      ["size", "'sm' | 'md' | 'lg'", "'md'", "Control scale."],
      ["indeterminate", "boolean", "false", "Half-checked state."],
    ],
  },
  {
    id: "item-slots",
    name: "Item slots",
    component: "CandyItemSlot",
    description:
      "RPG inventory slots with 5 rarity tiers, shimmering legendaries, and level map tiles.",
    props: [
      [
        "rarity",
        "CandyItemRarity",
        "'common'",
        "Tier: common, rare, epic, legendary, mythic.",
      ],
      ["count", "number", "—", "Item stack count."],
      ["badge", "string", "—", "Corner highlight badge."],
      ["selected", "boolean", "false", "Slot selection highlight."],
      ["locked", "boolean", "false", "Slot locked mask."],
      ["size", "'sm' | 'md' | 'lg' | 'xl'", "'md'", "Slot dimensions."],
    ],
  },
  {
    id: "ratings",
    name: "Rating",
    component: "CandyRating",
    description:
      "Interactive star ratings with half-star precision and celebratory level-cleared stars.",
    props: [
      ["value", "number", "0", "Rating score."],
      ["onChange", "(score: number) => void", "—", "Score change callback."],
      ["count", "number", "5", "Total star count."],
      ["allowHalf", "boolean", "false", "Permit 0.5 step increments."],
      [
        "allowClear",
        "boolean",
        "true",
        "Reset to 0 when clicking current value.",
      ],
      ["size", "CandyRatingSize", "'md'", "Star scale."],
    ],
  },
  {
    id: "tags",
    name: "Tags",
    component: "CandyTag",
    description:
      "Candy-tinted filter chips and badges with removable tags and checkable states.",
    props: [
      ["color", "CandyTagColor", "'blue'", "Theme palette color."],
      ["variant", "'solid' | 'soft' | 'outline'", "'solid'", "Surface style."],
      ["size", "'sm' | 'md' | 'lg'", "'md'", "Tag sizing."],
      ["checkable", "boolean", "false", "Enables toggle chip behavior."],
      ["checked", "boolean", "false", "Checkable toggle state."],
      ["closable", "boolean", "false", "Shows bouncy remove button."],
    ],
  },
  {
    id: "spinners",
    name: "Spinners",
    component: "CandySpinner",
    description:
      "Chunky ring spinners, bouncy dots, shimmering skeletons, and full-cover loading overlays.",
    props: [
      ["variant", "'dots' | 'ring'", "'dots'", "Spinner animation style."],
      ["size", "CandySize", "'md'", "Spinner dimensions."],
      ["color", "CandyColor", "'blue'", "Theme accent color."],
    ],
  },
  {
    id: "lists",
    name: "Lists",
    component: "CandyList",
    description:
      "Plain, card, and ranked game leaderboard lists with shiny gold/silver/bronze podium badges.",
    props: [
      [
        "variant",
        "'plain' | 'card' | 'ranked'",
        "'plain'",
        "List layout style.",
      ],
      ["size", "'sm' | 'md' | 'lg'", "'md'", "Row padding and font size."],
    ],
  },
];

export function ComponentDocs() {
  const [selected, setSelected] = useState("buttons");
  const [query, setQuery] = useState("");
  const [variant, setVariant] = useState<CandyColor>("blue");
  const [size, setSize] = useState<CandySize>("md");
  const [disabled, setDisabled] = useState(false);
  const [value, setValue] = useState(75);
  const [progressVariant, setProgressVariant] = useState<CandyColor>("blue");
  const [progressStriped, setProgressStriped] = useState(true);
  const [progressSparkle, setProgressSparkle] = useState(true);
  const [progressHeight, setProgressHeight] = useState(16);
  const [enabled, setEnabled] = useState(true);
  const [modal, setModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inputVal, setInputVal] = useState("SweetPlayer99");
  const [selectVal, setSelectVal] = useState<string | number>("strawberry");
  const [activeTab, setActiveTab] = useState("inventory");
  const [chkVal, setChkVal] = useState(true);
  const [radioVal, setRadioVal] = useState("strawberry");
  const [slotSelected, setSlotSelected] = useState("potion");
  const [ratingScore, setRatingScore] = useState(3.5);
  const [tagChecked, setTagChecked] = useState(true);
  const [demoTags, setDemoTags] = useState(["薄荷糖", "跳跳糖", "棉花糖"]);
  const [overlayLoading, setOverlayLoading] = useState(false);
  const { showToast } = useCandyToast();
  const { spawnText, FloatingTextContainer } = useFloatingText();

  const doc = catalog.find((d) => d.id === selected) || catalog[0];

  const code =
    selected === "buttons"
      ? `import { CandyButton } from 'candy-ui';\nimport 'candy-ui/style.css';\n\n<CandyButton variant="${variant}" size="${size}"${disabled ? " disabled" : ""}\n  onClick={() => startGame()}>\n  Let’s play\n</CandyButton>`
      : selected === "badges"
        ? `<CandyBadge variant="green">Ready to play</CandyBadge>`
        : selected === "panels"
          ? `<CandyPanel theme="frosted" ribbon="The clubhouse">\n  <p>Everyone is welcome.</p>\n</CandyPanel>`
          : selected === "modals"
            ? `<CandyModal isOpen={open} onClose={() => setOpen(false)}\n  title="Take a breather" theme="frosted">\n  <CandyButton onClick={() => setOpen(false)}>Keep playing</CandyButton>\n</CandyModal>`
            : selected === "progress"
              ? `<div className="meter-label">\n  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>\n    <CandyGameIcon name="lightning" size={15} color="#eab308" />\n    Next level\n  </span>\n  <b>${Math.round(value * 10)} / 1,000</b>\n</div>\n<CandyProgress\n  value={${value}}\n  variant="${progressVariant}"\n  height={${progressHeight}}\n  striped={${progressStriped}}\n  sparkle={${progressSparkle}}\n  showLabel={false}\n/>`
              : selected === "sliders"
                ? `<CandySlider value={${value}} onChange={setValue} color="blue" />`
                : selected === "switches"
                  ? `<CandySwitch checked={enabled} onChange={setEnabled} />`
                  : selected === "counters"
                    ? `<CandyCounter value={1250} icon={<CandyGameIcon name="coin" size={18} />} iconBg="yellow" />`
                    : selected === "avatars"
                      ? `<CandyAvatar character="bear" level={12} size="lg" borderColor="yellow" />`
                      : selected === "tooltips"
                        ? `<CandyTooltip content="Game settings">\n  <CandyIconButton aria-label="Settings" icon={<CandyGameIcon name="settings" size={22} />} />\n</CandyTooltip>`
                        : selected === "floating-text"
                          ? `const { spawnText, FloatingTextContainer } = useFloatingText();\n\n// Trigger floating numbers in games:\nspawnText({ text: "+100 EXP!", x: e.clientX, y: e.clientY, color: "yellow" });`
                          : selected === "feedback"
                            ? `// Inside CandyToastProvider\nconst { showToast } = useCandyToast();\nshowToast({ title: 'Nice one!', variant: 'green' });\ntriggerCandyConfetti();`
                            : selected === "inputs"
                              ? `<CandyInput\n  label="Player Name"\n  placeholder="Enter your name..."\n  value={name}\n  onChange={(e) => setName(e.target.value)}\n  clearable\n  hint="Up to 16 characters"\n/>`
                              : selected === "selects"
                                ? `<CandySelect\n  value={flavor}\n  onChange={(val) => setFlavor(val)}\n  options={[\n    { value: 'strawberry', label: '🍓 草莓软糖' },\n    { value: 'blueberry', label: '🫐 蓝莓泡泡糖' },\n    { value: 'lemon', label: '🍋 柠檬硬糖' },\n  ]}\n  color="pink"\n/>`
                                : selected === "tabs"
                                  ? `<CandyTabs value={tab} onChange={setTab} variant="pill" color="pink">\n  <CandyTabList aria-label="Game tabs">\n    <CandyTab value="inventory" icon="🎒" badge={12}>背包</CandyTab>\n    <CandyTab value="quests" icon="📜" badge>任务</CandyTab>\n    <CandyTab value="shop" icon="💎">商店</CandyTab>\n  </CandyTabList>\n</CandyTabs>`
                                  : selected === "checkboxes"
                                    ? `<CandyCheckbox\n  checked={agreed}\n  onChange={setAgreed}\n  color="pink"\n  label="开启糖果音效与触感反馈"\n/>\n\n<CandyRadioGroup value={flavor} onChange={setFlavor} orientation="horizontal">\n  <CandyRadio value="strawberry" label="草莓味" />\n  <CandyRadio value="blueberry" label="蓝莓味" />\n</CandyRadioGroup>`
                                    : selected === "item-slots"
                                      ? `<CandyItemSlot rarity="legendary" label="生命药水" count={1250} badge="UP">\n  <span>🧪</span>\n</CandyItemSlot>\n\n<CandyLevelTile level={8} stars={3} current />`
                                      : selected === "ratings"
                                        ? `<CandyRating value={score} onChange={setScore} allowHalf allowClear size="md" />\n<CandyStars count={3} max={3} animated arched />`
                                        : selected === "tags"
                                          ? `<CandyTagGroup gap="sm">\n  <CandyTag checkable checked={selected} color="pink" onCheckedChange={setSelected}>休闲游戏</CandyTag>\n  <CandyTag closable color="blue" variant="soft" onClose={handleClose}>薄荷糖</CandyTag>\n</CandyTagGroup>`
                                          : selected === "spinners"
                                            ? `<CandySpinner variant="ring" size="md" color="blue" />\n<CandySpinner variant="dots" size="lg" />\n<CandySkeleton lines={3} width={260} />`
                                            : `<CandyList variant="ranked">\n  <CandyListItem rank={1} title="糖果大师" description="总积分: 99,999" trailing="👑 冠军" interactive />\n  <CandyListItem rank={2} title="果冻布丁" description="总积分: 88,400" trailing="🥈 亚军" />\n  <CandyDivider as="li">我的名次</CandyDivider>\n  <CandyListItem rank={12} highlight title="玩家本尊" description="总积分: 52,100" interactive />\n</CandyList>`;

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="content-width page-content">
      <FloatingTextContainer />
      <div className="page-heading">
        <span className="eyebrow">BUILD YOUR NEXT GOOD TIME</span>
        <h1>The component clubhouse.</h1>
        <p>Real previews. Useful props. Small, composable building blocks.</p>
      </div>
      <div className="docs-layout">
        <aside className="docs-sidebar">
          <div className="docs-search-wrapper" style={{ marginBottom: 12 }}>
            <CandyInput
              leftIcon={<CandyGameIcon name="search" size={16} color="currentColor" />}
              aria-label="Find a component"
              placeholder="Find a component…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              size="sm"
              clearable
            />
          </div>
          <span className="field-label">COMPONENTS</span>
          <nav aria-label="Component categories">
            {catalog
              .filter(
                (d) =>
                  d.name.toLowerCase().includes(query.toLowerCase()) ||
                  d.component.toLowerCase().includes(query.toLowerCase()),
              )
              .map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className={d.id === selected ? "selected" : ""}
                  onClick={() => setSelected(d.id)}
                >
                  <span>{d.name}</span>
                  {d.id === selected && (
                    <CandyGameIcon
                      name="arrow-right"
                      size={14}
                      color="currentColor"
                    />
                  )}
                </button>
              ))}
          </nav>
          {query &&
            !catalog.some(
              (d) =>
                d.name.toLowerCase().includes(query.toLowerCase()) ||
                d.component.toLowerCase().includes(query.toLowerCase()),
            ) && <p>No matching components.</p>}
          <div className="sidebar-tip">
            <Character kind="frog" color="#dff3d5" />
            <p>
              Big ideas start with
              <br />
              small components.
            </p>
          </div>
        </aside>
        <article className="docs-article">
          <div className="docs-title">
            <h2>{doc.component}</h2>
            <CandyBadge variant="green">REACT</CandyBadge>
          </div>
          <p className="docs-description">{doc.description}</p>
          <div className="docs-preview">
            <span className="preview-caption">INTERACTIVE PREVIEW</span>
            {selected === "buttons" && (
              <div className="button-examples">
                <CandyButton
                  variant={variant}
                  size={size}
                  disabled={disabled}
                  rightIcon={
                    <CandyGameIcon
                      name="arrow-right"
                      size={16}
                      color="currentColor"
                    />
                  }
                  onClick={() =>
                    showToast({ title: "Let’s get playing!", variant: "green" })
                  }
                >
                  Let’s play
                </CandyButton>
                <CandyButton variant="cream" size={size} disabled={disabled}>
                  Maybe later
                </CandyButton>
                <CandyIconButton
                  aria-label="Star button"
                  variant="yellow"
                  size={size}
                  disabled={disabled}
                  icon={
                    <CandyGameIcon name="star" size={20} color="currentColor" />
                  }
                />
              </div>
            )}
            {selected === "badges" && (
              <div className="button-examples">
                <CandyBadge variant="green">Ready to play</CandyBadge>
                <CandyBadge variant="pink" size="lg">
                  Level 14
                </CandyBadge>
                <CandyBadge
                  variant="yellow"
                  icon={
                    <CandyGameIcon name="star" size={14} color="currentColor" />
                  }
                >
                  Top player
                </CandyBadge>
                <CandyBadge variant="blue">New round</CandyBadge>
              </div>
            )}
            {selected === "panels" && (
              <CandyPanel theme="frosted" ribbon="The clubhouse">
                <div className="panel-demo">
                  <Character kind="bear" color="#ffd263" />
                  <h3>Everyone is welcome.</h3>
                  <p>A simple panel for a little company.</p>
                  <CandyButton variant="green" size="sm">
                    Come on in
                  </CandyButton>
                </div>
              </CandyPanel>
            )}
            {selected === "modals" && (
              <CandyButton
                variant="blue"
                size="lg"
                onClick={() => setModal(true)}
              >
                Open a dialog{" "}
                <CandyGameIcon
                  name="arrow-right"
                  size={16}
                  color="currentColor"
                  style={{ marginLeft: 6 }}
                />
              </CandyButton>
            )}
            {selected === "progress" && (
              <div
                className="progress-demo"
                style={{ width: "100%", maxWidth: 440 }}
              >
                <div
                  className="meter-label"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontWeight: 500,
                    }}
                  >
                    <CandyGameIcon name="lightning" size={16} color="#eab308" />
                    Next level
                  </span>
                  <b style={{ fontWeight: 600 }}>
                    {Math.round(value * 10)} / 1,000
                  </b>
                </div>
                <CandyProgress
                  value={value}
                  variant={progressVariant}
                  height={progressHeight}
                  striped={progressStriped}
                  sparkle={progressSparkle}
                  showLabel={false}
                />
                <div
                  style={{
                    textAlign: "center",
                    marginTop: 10,
                    fontSize: 13,
                    color: "var(--muted)",
                  }}
                >
                  Just the right amount of feedback.
                </div>

                <div
                  style={{
                    marginTop: 24,
                    paddingTop: 16,
                    borderTop: "1px dashed var(--line)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                      fontSize: 13,
                      color: "var(--muted)",
                    }}
                  >
                    <span>Drag to adjust progress</span>
                    <b>{value}%</b>
                  </div>
                  <CandySlider
                    aria-label="Level progress"
                    value={value}
                    onChange={setValue}
                    color={progressVariant}
                  />
                </div>
              </div>
            )}
            {selected === "sliders" && (
              <div
                className="progress-demo"
                style={{ width: "100%", maxWidth: 440 }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 12,
                    fontSize: 14,
                    fontWeight: 500,
                  }}
                >
                  <span>Volume level</span>
                  <b>{value}%</b>
                </div>
                <CandySlider
                  aria-label="Game volume slider"
                  value={value}
                  onChange={setValue}
                  color="blue"
                />
              </div>
            )}
            {selected === "switches" && (
              <div
                className="progress-demo"
                style={{ width: "100%", maxWidth: 360 }}
              >
                <div className="control-line">
                  <span>
                    <CandyGameIcon
                      name="volume"
                      size={18}
                      color="currentColor"
                      style={{ marginRight: 6 }}
                    />{" "}
                    Sound effects
                  </span>
                  <CandySwitch
                    aria-label="Sound effects"
                    checked={enabled}
                    onChange={setEnabled}
                  />
                </div>
              </div>
            )}
            {selected === "counters" && (
              <div className="button-examples">
                <CandyCounter
                  value={1250}
                  icon={
                    <CandyGameIcon name="coin" size={18} color="currentColor" />
                  }
                  iconBg="yellow"
                />
                <CandyCounter
                  value={5}
                  icon={
                    <CandyGameIcon
                      name="heart"
                      size={18}
                      color="currentColor"
                    />
                  }
                  iconBg="pink"
                />
              </div>
            )}
            {selected === "avatars" && (
              <div className="button-examples" style={{ gap: 20 }}>
                <CandyAvatar
                  character="bear"
                  alt="Bear player"
                  level={12}
                  size="lg"
                  borderColor="yellow"
                />
                <CandyAvatar
                  character="cat"
                  alt="Cat player"
                  level={8}
                  size="md"
                  borderColor="blue"
                />
                <CandyAvatar
                  character="fox"
                  alt="Fox player"
                  level={25}
                  size="md"
                  borderColor="pink"
                />
                <CandyAvatar
                  character="rabbit"
                  alt="Rabbit player"
                  level={1}
                  size="sm"
                  borderColor="green"
                />
              </div>
            )}
            {selected === "tooltips" && (
              <div className="button-examples">
                <CandyTooltip content="Game settings">
                  <CandyIconButton
                    aria-label="Game settings"
                    icon={
                      <CandyGameIcon
                        name="settings"
                        size={22}
                        color="currentColor"
                      />
                    }
                    variant="cream"
                  />
                </CandyTooltip>
                <CandyTooltip content="Ready to fight!">
                  <CandyButton variant="green">Hover me</CandyButton>
                </CandyTooltip>
              </div>
            )}
            {selected === "floating-text" && (
              <div className="button-examples">
                <CandyButton
                  variant="yellow"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    spawnText({
                      text: "+100 EXP!",
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                      color: "yellow",
                    });
                  }}
                >
                  Hit for +100 EXP!
                </CandyButton>
                <CandyButton
                  variant="pink"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    spawnText({
                      text: "CRITICAL HIT!",
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                      color: "pink",
                    });
                  }}
                >
                  Critical Hit!
                </CandyButton>
              </div>
            )}
            {selected === "feedback" && (
              <div className="button-examples">
                <CandyButton
                  variant="green"
                  onClick={() =>
                    showToast({
                      title: "Nice one!",
                      description: "Your changes are saved.",
                      variant: "green",
                    })
                  }
                >
                  Show a toast
                </CandyButton>
                <CandyButton
                  variant="yellow"
                  leftIcon={
                    <CandyGameIcon name="horn" size={18} color="currentColor" />
                  }
                  onClick={() => triggerCandyConfetti()}
                >
                  Celebrate
                </CandyButton>
              </div>
            )}
            {selected === "inputs" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  width: "100%",
                  maxWidth: 380,
                }}
              >
                <CandyInput
                  label="Player Nickname"
                  placeholder="Enter a candy name..."
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  clearable
                  hint="Clearable input with candy groove"
                />
                <CandyInput
                  type="password"
                  label="Secret Vault Code"
                  placeholder="Enter secret..."
                  defaultValue="candypass"
                  clearable
                />
                <CandyField
                  label="Player Bio"
                  hint="Introduce yourself to other candy adventurers"
                >
                  <CandyTextarea
                    placeholder="Type something sweet..."
                    rows={3}
                  />
                </CandyField>
              </div>
            )}
            {selected === "selects" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  width: "100%",
                  maxWidth: 360,
                }}
              >
                <CandySelect
                  color="pink"
                  size="md"
                  options={[
                    { value: "strawberry", label: "🍓 Strawberry Gummy" },
                    { value: "blueberry", label: "🫐 Blueberry Bubble" },
                    { value: "lemon", label: "🍋 Lemon Drop" },
                    {
                      value: "mint",
                      label: "🍃 Cool Mint (Sold Out)",
                      disabled: true,
                    },
                  ]}
                  value={selectVal}
                  onChange={(val) => setSelectVal(val)}
                  placeholder="Pick a flavor..."
                  fullWidth
                />
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--candy-text-muted)",
                  }}
                >
                  Selected value: <b>{selectVal}</b>
                </div>
              </div>
            )}
            {selected === "tabs" && (
              <div style={{ width: "100%", maxWidth: 460 }}>
                <CandyTabs
                  value={activeTab}
                  onChange={setActiveTab}
                  variant="pill"
                  color="pink"
                  size="md"
                >
                  <CandyTabList aria-label="Game Panel">
                    <CandyTab
                      value="inventory"
                      icon={
                        <CandyGameIcon
                          name="backpack"
                          size={16}
                          color="currentColor"
                        />
                      }
                      badge={12}
                    >
                      Backpack
                    </CandyTab>
                    <CandyTab
                      value="quests"
                      icon={
                        <CandyGameIcon
                          name="cards"
                          size={16}
                          color="currentColor"
                        />
                      }
                      badge
                    >
                      Quests
                    </CandyTab>
                    <CandyTab
                      value="shop"
                      icon={
                        <CandyGameIcon
                          name="diamond"
                          size={16}
                          color="currentColor"
                        />
                      }
                    >
                      Shop
                    </CandyTab>
                  </CandyTabList>
                  <CandyTabPanel value="inventory">
                    <div
                      style={{
                        padding: 16,
                        background: "rgba(255,255,255,0.7)",
                        borderRadius: 12,
                        marginTop: 8,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <CandyGameIcon
                        name="backpack"
                        size={18}
                        color="#e11d48"
                      />
                      <div>
                        <b>Backpack items:</b> 999 Gold Coins, 5 Sugar Candies
                      </div>
                    </div>
                  </CandyTabPanel>
                  <CandyTabPanel value="quests">
                    <div
                      style={{
                        padding: 16,
                        background: "rgba(255,255,255,0.7)",
                        borderRadius: 12,
                        marginTop: 8,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <CandyGameIcon name="cards" size={18} color="#e11d48" />
                      <div>
                        <b>Daily quest:</b> Clear Candy Forest 3 times (1/3)
                      </div>
                    </div>
                  </CandyTabPanel>
                  <CandyTabPanel value="shop">
                    <div
                      style={{
                        padding: 16,
                        background: "rgba(255,255,255,0.7)",
                        borderRadius: 12,
                        marginTop: 8,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <CandyGameIcon name="diamond" size={18} color="#e11d48" />
                      <div>
                        <b>Candy Shop:</b> Legendary Frost Wand is on sale!
                      </div>
                    </div>
                  </CandyTabPanel>
                </CandyTabs>
              </div>
            )}
            {selected === "checkboxes" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
              >
                <CandyCheckbox
                  checked={chkVal}
                  onChange={(checked) => setChkVal(checked)}
                  color="pink"
                  size="md"
                  label="Enable tactile candy sound and haptics"
                />
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "var(--candy-text)",
                    }}
                  >
                    Select flavor:
                  </span>
                  <CandyRadioGroup
                    value={radioVal}
                    onChange={(val) => setRadioVal(val)}
                    orientation="horizontal"
                    color="purple"
                    size="md"
                  >
                    <CandyRadio value="strawberry" label="Strawberry" />
                    <CandyRadio value="blueberry" label="Blueberry" />
                    <CandyRadio value="grape" label="Grape" />
                  </CandyRadioGroup>
                </div>
              </div>
            )}
            {selected === "item-slots" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <CandyItemSlot
                    rarity="common"
                    label="Iron Key"
                    count={1}
                    selected={slotSelected === "key"}
                    onClick={() => setSlotSelected("key")}
                  >
                    <CandyGameIcon name="key" size={26} color="#eab308" />
                  </CandyItemSlot>
                  <CandyItemSlot
                    rarity="epic"
                    label="Magic Scroll"
                    count={8}
                    badge="HOT"
                    selected={slotSelected === "scroll"}
                    onClick={() => setSlotSelected("scroll")}
                  >
                    <CandyGameIcon name="cards" size={26} color="#a855f7" />
                  </CandyItemSlot>
                  <CandyItemSlot
                    rarity="legendary"
                    label="Health Potion"
                    count={1250}
                    badge="UP"
                    selected={slotSelected === "potion"}
                    onClick={() => setSlotSelected("potion")}
                  >
                    <CandyGameIcon name="potion" size={26} color="#10b981" />
                  </CandyItemSlot>
                  <CandyItemSlot
                    rarity="mythic"
                    label="Dragon Egg"
                    count={1}
                    locked
                    selected={slotSelected === "egg"}
                    onClick={() => setSlotSelected("egg")}
                  >
                    <CandyGameIcon name="diamond" size={26} color="#3b82f6" />
                  </CandyItemSlot>
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <CandyLevelTile
                    level={1}
                    stars={3}
                    onClick={() =>
                      showToast({ title: "Level 1 Cleared!", variant: "green" })
                    }
                  />
                  <CandyLevelTile
                    level={2}
                    stars={2}
                    current
                    onClick={() =>
                      showToast({
                        title: "Starting Level 2...",
                        variant: "blue",
                      })
                    }
                  />
                  <CandyLevelTile level={3} stars={0} locked />
                </div>
              </div>
            )}
            {selected === "ratings" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <div
                    style={{
                      marginBottom: 8,
                      fontSize: "0.875rem",
                      fontWeight: 600,
                    }}
                  >
                    Interactive 5-Star Rating (Score: {ratingScore})
                  </div>
                  <CandyRating
                    value={ratingScore}
                    onChange={setRatingScore}
                    allowHalf
                    allowClear
                    size="lg"
                    aria-label="Level evaluation"
                  />
                </div>
                <div>
                  <div
                    style={{
                      marginBottom: 8,
                      fontSize: "0.875rem",
                      fontWeight: 600,
                    }}
                  >
                    Victory Celebration Stars (Arched)
                  </div>
                  <CandyStars
                    count={Math.min(3, Math.ceil(ratingScore / (5 / 3)))}
                    max={3}
                    size="md"
                    animated
                    arched
                  />
                </div>
              </div>
            )}
            {selected === "tags" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                <CandyTagGroup gap="sm">
                  <CandyTag
                    checkable
                    checked={tagChecked}
                    color="pink"
                    onCheckedChange={setTagChecked}
                  >
                    {tagChecked ? "✓ Active Filter" : "Filter Off"}
                  </CandyTag>
                  {demoTags.map((t) => (
                    <CandyTag
                      key={t}
                      closable
                      color="blue"
                      variant="soft"
                      onClose={() =>
                        setDemoTags((prev) => prev.filter((item) => item !== t))
                      }
                    >
                      {t}
                    </CandyTag>
                  ))}
                  {demoTags.length === 0 && (
                    <CandyButton
                      variant="ghost"
                      size="xs"
                      onClick={() =>
                        setDemoTags(["薄荷糖", "跳跳糖", "棉花糖"])
                      }
                    >
                      Reset tags
                    </CandyButton>
                  )}
                </CandyTagGroup>
              </div>
            )}
            {selected === "spinners" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 24,
                  width: "100%",
                  maxWidth: 400,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <CandySpinner variant="ring" size="md" color="blue" />
                  <CandySpinner variant="dots" size="lg" />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <CandySkeleton circle width={44} height={44} />
                  <CandySkeleton lines={2} width={240} />
                </div>
                <CandyLoadingOverlay
                  loading={overlayLoading}
                  text="Loading sweet level..."
                >
                  <div
                    style={{
                      padding: 18,
                      border: "2px solid #cbdde9",
                      borderRadius: 16,
                      background: "rgba(255,255,255,0.7)",
                    }}
                  >
                    <h4 style={{ margin: "0 0 6px" }}>Candy Forest Stage</h4>
                    <p style={{ margin: "0 0 12px", fontSize: "0.875rem" }}>
                      Ready to explore Chapter 5?
                    </p>
                    <CandyButton
                      variant="blue"
                      size="xs"
                      onClick={() => {
                        setOverlayLoading(true);
                        setTimeout(() => setOverlayLoading(false), 1500);
                      }}
                    >
                      Simulate Load
                    </CandyButton>
                  </div>
                </CandyLoadingOverlay>
              </div>
            )}
            {selected === "lists" && (
              <div style={{ width: "100%", maxWidth: 440 }}>
                <CandyList variant="ranked" size="md">
                  <CandyListItem
                    rank={1}
                    title="Sugar King"
                    description="Score: 99,999"
                    trailing={
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <CandyGameIcon name="crown" size={15} color="#eab308" />{" "}
                        Champion
                      </span>
                    }
                    interactive
                    onClick={() =>
                      showToast({
                        title: "Rank #1: Sugar King",
                        variant: "yellow",
                      })
                    }
                  />
                  <CandyListItem
                    rank={2}
                    title="Jelly Pudding"
                    description="Score: 88,400"
                    trailing={
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <CandyGameIcon
                          name="trophy"
                          size={15}
                          color="#94a3b8"
                        />{" "}
                        2nd
                      </span>
                    }
                    interactive
                  />
                  <CandyListItem
                    rank={3}
                    title="Choco Hero"
                    description="Score: 76,200"
                    trailing={
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <CandyGameIcon
                          name="trophy"
                          size={15}
                          color="#d97706"
                        />{" "}
                        3rd
                      </span>
                    }
                  />
                  <CandyDivider as="li">Your ranking</CandyDivider>
                  <CandyListItem
                    rank={12}
                    highlight
                    title="Candy Adventurer (You)"
                    description="Score: 52,100"
                    trailing={
                      <CandyBadge variant="green" size="sm">
                        Active
                      </CandyBadge>
                    }
                    interactive
                  />
                </CandyList>
              </div>
            )}
          </div>
          {selected === "buttons" && (
            <div className="props-controls">
              <div style={{ flex: "1 1 140px" }}>
                <span className="control-label" style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "var(--candy-text, #082b4b)" }}>Color</span>
                <CandySelect
                  placeholder="Color"
                  value={variant}
                  onChange={(val) => setVariant(val as CandyColor)}
                  options={[
                    "blue",
                    "green",
                    "yellow",
                    "pink",
                    "purple",
                    "orange",
                    "cream",
                    "dark",
                    "ghost",
                  ].map((c) => ({ value: c, label: c }))}
                  size="sm"
                />
              </div>
              <div style={{ flex: "1 1 120px" }}>
                <span className="control-label" style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "var(--candy-text, #082b4b)" }}>Size</span>
                <CandySelect
                  placeholder="Size"
                  value={size}
                  onChange={(val) => setSize(val as CandySize)}
                  options={["xs", "sm", "md", "lg", "xl"].map((c) => ({ value: c, label: c }))}
                  size="sm"
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 18 }}>
                <CandySwitch
                  aria-label="Toggle disabled"
                  checked={disabled}
                  onChange={setDisabled}
                />
                <span style={{ fontSize: 13, fontWeight: 500, color: "var(--candy-text, #082b4b)" }}>Disabled</span>
              </div>
            </div>
          )}
          {selected === "progress" && (
            <div className="props-controls">
              <div style={{ flex: "1 1 140px" }}>
                <span className="control-label" style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "var(--candy-text, #082b4b)" }}>Color</span>
                <CandySelect
                  placeholder="Color"
                  value={progressVariant}
                  onChange={(val) =>
                    setProgressVariant(val as CandyColor)
                  }
                  options={["blue", "green", "yellow", "pink", "purple", "orange"].map(
                    (c) => ({ value: c, label: c }),
                  )}
                  size="sm"
                />
              </div>
              <div style={{ flex: "1 1 120px" }}>
                <span className="control-label" style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 600, color: "var(--candy-text, #082b4b)" }}>Height</span>
                <CandySelect
                  placeholder="Height"
                  value={String(progressHeight)}
                  onChange={(val) => setProgressHeight(Number(val))}
                  options={[14, 16, 18, 20, 24, 28, 32].map((h) => ({
                    value: String(h),
                    label: `${h}px`,
                  }))}
                  size="sm"
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 18 }}>
                <CandySwitch
                  aria-label="Toggle striped"
                  checked={progressStriped}
                  onChange={setProgressStriped}
                />
                <span style={{ fontSize: 13, fontWeight: 500, color: "var(--candy-text, #082b4b)" }}>Striped</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 18 }}>
                <CandySwitch
                  aria-label="Toggle sparkle"
                  checked={progressSparkle}
                  onChange={setProgressSparkle}
                />
                <span style={{ fontSize: 13, fontWeight: 500, color: "var(--candy-text, #082b4b)" }}>Sparkle</span>
              </div>
            </div>
          )}
          <div className="code-box">
            <div className="code-heading">
              <span>Usage · TSX</span>
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
                {copied ? "Copied" : "Copy code"}
              </CandyButton>
            </div>
            <pre>
              <code>{code}</code>
            </pre>
          </div>
          <h3 className="api-heading">Props & API</h3>
          <div className="table-scroll">
            <table className="api-table">
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Type</th>
                  <th>Default</th>
                  <th>What it does</th>
                </tr>
              </thead>
              <tbody>
                {doc.props.map((p) => (
                  <tr key={p[0]}>
                    <td>
                      <code>{p[0]}</code>
                    </td>
                    <td>
                      <code>{p[1]}</code>
                    </td>
                    <td>{p[2]}</td>
                    <td>{p[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="code-note">
            Wrap interactive components in <code>CandyProvider</code>; toasts
            also need <code>CandyToastProvider</code>.
          </p>
        </article>
      </div>
      <CandyModal
        isOpen={modal}
        onClose={() => setModal(false)}
        title="Take a breather"
        theme="frosted"
        ribbonColor="blue"
      >
        <div className="room-dialog">
          <Character kind="bunny" color="#ffe1e8" />
          <h2>Good games need little breaks.</h2>
          <p>Your friends will still be here.</p>
          <CandyButton
            variant="green"
            fullWidth
            onClick={() => setModal(false)}
          >
            Keep playing
          </CandyButton>
        </div>
      </CandyModal>
    </section>
  );
}
export default ComponentDocs;
