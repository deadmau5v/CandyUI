import React, { useState } from "react";
import {
  CandyProvider,
  CandyToastProvider,
  CandyButton,
  CandyIconButton,
  CandyBadge,
  CandyProgress,
  CandySwitch,
  CandyCounter,
  CandyTooltip,
  CandyGameIcon,
  CandyTabs,
  CandyTabList,
  CandyTab,
  useCandy,
  useCandyToast,
} from "candy-ui";
import { CandyMark, Character } from "./components/PlayfulArt";
import { GameIconWallpaper } from "./components/GameIconWallpaper";
import { ShowHero } from "./components/ShowHero";
import { ThemeCustomizer } from "./components/ThemeCustomizer";
import { ComponentDocs } from "./components/ComponentDocs";
import { ScenarioShowcase } from "./components/ScenarioShowcase";
import { GameIconGallery } from "./components/GameIconGallery";
import "./styles/docs.css";

type Page = "home" | "components" | "icons" | "sandbox" | "examples";
const navigation: { id: Page; label: string }[] = [
  { id: "home", label: "Overview" },
  { id: "components", label: "Components" },
  { id: "icons", label: "Icons" },
  { id: "sandbox", label: "Sandbox" },
  { id: "examples", label: "Examples" },
];

function getInitialPage(): Page {
  if (typeof window === "undefined") return "home";
  const path = window.location.pathname.replace(/^\/+|\/+$/g, "").toLowerCase();
  const hash = window.location.hash.replace(/^#\/?/, "").toLowerCase();
  const target = path || hash;
  if (target === "components") return "components";
  if (target === "icons") return "icons";
  if (target === "sandbox") return "sandbox";
  if (target === "examples") return "examples";
  return "home";
}

function Site() {
  const [page, setPage] = useState<Page>(getInitialPage);
  const { soundEnabled, setSoundEnabled } = useCandy();

  React.useEffect(() => {
    const handlePopState = () => {
      setPage(getInitialPage());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function navigate(next: Page) {
    setPage(next);
    const newPath = next === "home" ? "/" : `/${next}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, "", newPath);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  return (
    <div className="site-shell">
      <GameIconWallpaper />
      <header className="site-header">
        <div className="header-inner">
          <button
            className="brand"
            onClick={() => navigate("home")}
            aria-label="CandyUI home"
          >
            <CandyMark />
            <span>
              Candy<span className="brand-ui">UI</span>
            </span>
            <span className="version">0.1</span>
          </button>
          <nav className="site-header-nav-wrap" aria-label="Main navigation">
            <CandyTabs
              value={page}
              onChange={(val) => navigate(val as Page)}
              variant="pill"
              color="blue"
              size="sm"
            >
              <CandyTabList aria-label="Main navigation">
                {navigation.map((n) => (
                  <CandyTab key={n.id} value={n.id}>
                    {n.label}
                  </CandyTab>
                ))}
              </CandyTabList>
            </CandyTabs>
          </nav>
          <div className="header-actions">
            <CandyTooltip
              position="bottom"
              content={soundEnabled ? "Mute sound" : "Enable sound"}
            >
              <CandyIconButton
                aria-label="Toggle sound"
                variant="cream"
                size="sm"
                icon={
                  <CandyGameIcon
                    name={soundEnabled ? "volume" : "volume-off"}
                    size={16}
                    color="#12427a"
                  />
                }
                sound={false}
                onClick={() => setSoundEnabled(!soundEnabled)}
              />
            </CandyTooltip>
            <span className="react-label">
              <span className="online-dot" /> Made for React
            </span>
          </div>
        </div>
      </header>
      <main className="site-main">
        {page === "home" ? (
          <div className="stage-card-wrapper">
            <div className="site-stage-card">
              <ShowHero
                onExplore={() => navigate("components")}
                onCustomize={() => navigate("sandbox")}
                onPlayScenarios={() => navigate("examples")}
              />
              <div className="feature-strip">
                <div>
                  <CandyGameIcon
                    name="puzzle-01"
                    size={18}
                    color="#1761d1"
                    style={{ marginRight: 6 }}
                  />
                  <span>Composable by nature</span>
                </div>
                <div>
                  <CandyGameIcon
                    name="mouse"
                    size={18}
                    color="#1761d1"
                    style={{ marginRight: 6 }}
                  />
                  <span>Made to be clicked</span>
                </div>
                <div>
                  <CandyGameIcon
                    name="paint-bucket"
                    size={18}
                    color="#1761d1"
                    style={{ marginRight: 6 }}
                  />
                  <span>Your game. Your theme.</span>
                </div>
                <div>
                  <CandyGameIcon
                    name="code"
                    size={18}
                    color="#1761d1"
                    style={{ marginRight: 6 }}
                  />
                  <span>React + TypeScript</span>
                </div>
              </div>
              <ComponentGallery onExplore={() => navigate("components")} />
              <section className="examples-teaser">
                <div>
                  <span className="eyebrow">LESS BOILERPLATE. MORE PLAY.</span>
                  <h2>A whole game’s worth of UI.</h2>
                  <p>
                    Lobbies, leaderboards, rewards, and the little things in
                    between.
                    <br />
                    See how the pieces play together.
                  </p>
                  <CandyButton
                    variant="blue"
                    onClick={() => navigate("examples")}
                    rightIcon={
                      <CandyGameIcon
                        name="arrow-right"
                        size={18}
                        color="#ffffff"
                      />
                    }
                  >
                    Play with the examples
                  </CandyButton>
                </div>
              </section>
            </div>
          </div>
        ) : (
          <div className="stage-card-wrapper">
            <div className="site-stage-card">
              {page === "sandbox" ? (
                <ThemeCustomizer />
              ) : page === "components" ? (
                <ComponentDocs />
              ) : page === "icons" ? (
                <GameIconGallery />
              ) : (
                <ScenarioShowcase />
              )}
            </div>
          </div>
        )}
      </main>
      <footer className="site-footer">
        <div className="footer-brand">
          <CandyMark />
          <strong>CandyUI</strong>
          <span>A little more fun on the web.</span>
        </div>
        <div
          className="footer-links"
          style={{ display: "flex", alignItems: "center", gap: 16 }}
        >
          <span>Fredoka · React · MIT</span>
          <button
            type="button"
            className="footer-link-btn"
            onClick={() => navigate("components")}
          >
            Read the docs{" "}
            <CandyGameIcon name="arrow-right" size={14} color="currentColor" />
          </button>
        </div>
      </footer>
    </div>
  );
}

function ComponentGallery({ onExplore }: { onExplore: () => void }) {
  const [music, setMusic] = useState(true);
  const [score, setScore] = useState(1250);
  const { showToast } = useCandyToast();

  return (
    <section className="component-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">YOUR NEW TOY BOX</span>
          <h2>Small pieces. Big personality.</h2>
          <p>The essentials, with a playful little twist.</p>
        </div>
        <CandyButton variant="ghost" size="sm" onClick={onExplore}>
          Meet every component →
        </CandyButton>
      </div>
      <div className="component-grid">
        <article className="component-tile">
          <div className="tile-preview preview-buttons">
            <CandyButton
              variant="green"
              rightIcon={
                <CandyGameIcon name="arrow-right" size={16} color="#12427a" />
              }
              onClick={() =>
                showToast({ title: "You’re ready to play!", variant: "green" })
              }
            >
              Let’s play
            </CandyButton>
            <div className="button-pair">
              <CandyButton
                variant="blue"
                size="sm"
                onClick={() =>
                  showToast({ title: "Room created", variant: "blue" })
                }
              >
                Create room
              </CandyButton>
              <CandyIconButton
                aria-label="Favorite"
                variant="yellow"
                size="sm"
                icon={<CandyGameIcon name="star" size={16} color="#12427a" />}
                onClick={() =>
                  showToast({ title: "Added to favorites", variant: "yellow" })
                }
              />
            </div>
          </div>
          <div className="tile-caption">
            <div>
              <h3>Buttons</h3>
              <p>A satisfying little push.</p>
            </div>
            <span>01</span>
          </div>
        </article>
        <article className="component-tile">
          <div className="tile-preview preview-players">
            <div className="player-stack">
              <Character kind="bear" color="#eee4ff" />
              <Character kind="frog" color="#dff3d5" />
              <Character kind="cat" color="#fff0c7" />
            </div>
            <CandyBadge variant="green">READY TO PLAY</CandyBadge>
          </div>
          <div className="tile-caption">
            <div>
              <h3>Avatars & badges</h3>
              <p>Give every player a personality.</p>
            </div>
            <span>02</span>
          </div>
        </article>
        <article className="component-tile">
          <div className="tile-preview preview-controls">
            <div className="control-line">
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <CandyGameIcon name="volume" size={16} color="#1761d1" />
                Sound effects
              </span>
              <CandySwitch
                aria-label="Preview sound effects"
                checked={music}
                onChange={setMusic}
              />
            </div>
            <div className="meter-label">
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <CandyGameIcon name="lightning" size={15} color="#eab308" />
                Next level
              </span>
              <b>750 / 1,000</b>
            </div>
            <CandyProgress
              value={75}
              variant="blue"
              height={16}
              showLabel={false}
            />
            <div className="control-hint">
              Just the right amount of feedback.
            </div>
          </div>
          <div className="tile-caption">
            <div>
              <h3>Game controls</h3>
              <p>All the knobs. None of the fuss.</p>
            </div>
            <span>03</span>
          </div>
        </article>
        <article className="component-tile">
          <div className="tile-preview preview-rewards">
            <div className="reward-star">
              <CandyGameIcon name="star" size={42} color="#f59e0b" />
              <span style={{ marginLeft: 6 }}>+100</span>
            </div>
            <CandyCounter
              value={score}
              icon={<CandyGameIcon name="coin" size={18} color="#8a5700" />}
              iconBg="yellow"
            />
            <div style={{ marginTop: 8 }}>
              <CandyButton
                variant="ghost"
                size="xs"
                onClick={() => setScore((s) => s + 100)}
              >
                Claim your daily bonus →
              </CandyButton>
            </div>
          </div>
          <div className="tile-caption">
            <div>
              <h3>Rewards & feedback</h3>
              <p>Make the good moments count.</p>
            </div>
            <span>04</span>
          </div>
        </article>
      </div>
    </section>
  );
}

export const App = () => (
  <CandyProvider defaultSoundEnabled={false} defaultVolume={0.35}>
    <CandyToastProvider>
      <Site />
    </CandyToastProvider>
  </CandyProvider>
);

export default App;
