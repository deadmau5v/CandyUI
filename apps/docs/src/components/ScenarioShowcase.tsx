import React, { useState } from "react";
import {
  CandyButton,
  CandyBadge,
  CandyCounter,
  CandySwitch,
  CandySlider,
  CandyPanel,
  CandyGameIcon,
  CandyTabs,
  CandyTabList,
  CandyTab,
  useCandy,
  useCandyToast,
  triggerCandyConfetti,
} from "candy-ui";
import { Character } from "./PlayfulArt";
import { GameLobby } from "./GameLobby";

const tabs = [
  "Game lobby",
  "Leaderboard",
  "Daily rewards",
  "Level select",
  "Settings",
];
const playerColors = ["#fff0c7", "#eee4ff", "#dff3d5", "#ffe1e8"];

export function ScenarioShowcase() {
  const [tab, setTab] = useState(0);
  const [claimed, setClaimed] = useState(false);
  const [coins, setCoins] = useState(1250);
  const [level, setLevel] = useState(1);
  const [notifications, setNotifications] = useState(true);
  const { soundEnabled, setSoundEnabled, soundVolume, setSoundVolume } =
    useCandy();
  const { showToast } = useCandyToast();

  return (
    <section className="content-width page-content">
      <div className="page-heading">
        <span className="eyebrow">PUT THE PIECES TOGETHER</span>
        <h1>A few ways to play.</h1>
        <p>
          Real little flows built with the same CandyUI components. Click
          around.
        </p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <CandyTabs
          value={String(tab)}
          onChange={(val) => setTab(Number(val))}
          variant="pill"
          color="blue"
          size="sm"
        >
          <CandyTabList aria-label="Game examples">
            {tabs.map((t, i) => (
              <CandyTab key={t} value={String(i)}>
                {t}
              </CandyTab>
            ))}
          </CandyTabList>
        </CandyTabs>
      </div>

      <div className="example-stage">
        <div className="example-topbar">
          <span>
            <span className="online-dot" /> LOCAL INTERACTIVE DEMO
          </span>
          <CandyCounter
            value={coins}
            icon={<CandyGameIcon name="coin" size={18} color="#8a5700" />}
            iconBg="yellow"
          />
        </div>

        <div className="example-body">
          {tab === 0 && <GameLobby compact />}

          {tab === 1 && (
            <CandyPanel
              theme="frosted"
              hasRivets={false}
              className="scenario-panel"
            >
              <div className="scenario-heading">
                <div className="scenario-icon-bubble">
                  <CandyGameIcon name="trophy" size={44} color="#f59e0b" />
                </div>
                <h2>The good sport board.</h2>
                <p>A little friendly competition.</p>
              </div>

              <div className="leaderboard">
                {[
                  ["Luna", "2,450", "cat"],
                  ["Mochi", "2,180", "bear"],
                  ["You", "1,920", "frog"],
                  ["Pip", "1,640", "bunny"],
                ].map(([name, score, kind], i) => (
                  <div key={name} className={name === "You" ? "is-you" : ""}>
                    <span className="rank">{i + 1}</span>
                    <Character
                      kind={kind as "cat"}
                      color={playerColors[i]}
                      size="sm"
                    />
                    <b>{name}</b>
                    {name === "You" && (
                      <CandyBadge variant="blue" size="sm">
                        YOU
                      </CandyBadge>
                    )}
                    <strong
                      style={{
                        marginLeft: "auto",
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      {score}
                      <CandyGameIcon name="star" size={16} color="#f59e0b" />
                    </strong>
                  </div>
                ))}
              </div>

              <CandyButton
                variant="blue"
                size="lg"
                fullWidth
                rightIcon={
                  <CandyGameIcon name="arrow-right" size={18} color="#ffffff" />
                }
                onClick={() => {
                  setTab(0);
                  showToast({
                    title: "New round, new possibilities!",
                    variant: "blue",
                  });
                }}
              >
                One more round
              </CandyButton>
            </CandyPanel>
          )}

          {tab === 2 && (
            <CandyPanel
              theme="frosted"
              hasRivets={false}
              className="scenario-panel"
            >
              <div className="scenario-heading">
                <div className="scenario-icon-bubble">
                  <CandyGameIcon name="chest" size={44} color="#f59e0b" />
                </div>
                <div style={{ marginBottom: 10 }}>
                  <CandyBadge variant="yellow" size="sm">
                    DAY 3 STREAK
                  </CandyBadge>
                </div>
                <h2>A little something for you.</h2>
                <p>Thanks for coming back. Your daily bonus is ready.</p>
              </div>

              <div className="daily-days">
                {[1, 2, 3, 4, 5].map((d) => (
                  <div key={d} className={d === 3 ? "today" : ""}>
                    <span>Day {d}</span>
                    <span
                      style={{
                        margin: "6px 0",
                        height: 26,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {d < 3 ? (
                        <CandyGameIcon name="tick" size={20} color="#10b981" />
                      ) : d === 3 ? (
                        <CandyGameIcon name="coin" size={24} color="#f59e0b" />
                      ) : (
                        <CandyGameIcon name="chest" size={22} color="#94a3b8" />
                      )}
                    </span>
                    <b>{d * 50}</b>
                  </div>
                ))}
              </div>

              <CandyButton
                variant={claimed ? "cream" : "green"}
                fullWidth
                size="lg"
                disabled={claimed}
                onClick={() => {
                  setClaimed(true);
                  setCoins((c) => c + 150);
                  triggerCandyConfetti();
                  showToast({
                    title: "+150 coins. Nice to see you!",
                    variant: "green",
                  });
                }}
              >
                {claimed ? "All yours! Come back tomorrow" : "Claim 150 coins"}
              </CandyButton>
            </CandyPanel>
          )}

          {tab === 3 && (
            <CandyPanel
              theme="frosted"
              hasRivets={false}
              className="scenario-panel"
            >
              <div className="scenario-heading">
                <div className="scenario-icon-bubble">
                  <CandyGameIcon name="compass" size={44} color="#1761d1" />
                </div>
                <h2>A little adventure awaits.</h2>
                <p>Pick a level. Make some memories.</p>
              </div>

              <div className="level-grid">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <CandyButton
                    key={n}
                    disabled={n > 4}
                    aria-label={`Level ${n}${n > 4 ? " locked" : ""}`}
                    variant={level === n ? "blue" : "cream"}
                    size="lg"
                    shape="rounded"
                    onClick={() => setLevel(n)}
                    style={{
                      minHeight: 68,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: 18, fontWeight: 700 }}>
                      {n > 4 ? (
                        <CandyGameIcon
                          name="lock"
                          size={18}
                          color="currentColor"
                        />
                      ) : (
                        n
                      )}
                    </span>
                    <span
                      style={{ fontSize: 10, color: "#f59e0b", marginTop: 2 }}
                    >
                      {n < 4 ? "★★★" : n === 4 ? "☆☆☆" : "—"}
                    </span>
                  </CandyButton>
                ))}
              </div>

              <CandyButton
                variant="green"
                size="lg"
                fullWidth
                rightIcon={
                  <CandyGameIcon name="arrow-right" size={18} color="#12427a" />
                }
                onClick={() =>
                  showToast({
                    title: `Level ${level} selected!`,
                    description: "Connect this action to your game engine.",
                    variant: "green",
                  })
                }
              >
                Play level {level}
              </CandyButton>
            </CandyPanel>
          )}

          {tab === 4 && (
            <CandyPanel
              theme="frosted"
              hasRivets={false}
              className="scenario-panel"
            >
              <div className="scenario-heading">
                <div className="scenario-icon-bubble">
                  <CandyGameIcon name="settings" size={44} color="#1761d1" />
                </div>
                <h2>Just the way you like it.</h2>
                <p>Fine-tune your little corner of the game.</p>
              </div>

              <div className="settings-list">
                <div className="control-line">
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <CandyGameIcon name="volume" size={18} color="#1761d1" />
                    Sound effects
                  </span>
                  <CandySwitch
                    aria-label="Sound effects"
                    checked={soundEnabled}
                    onChange={setSoundEnabled}
                  />
                </div>

                <label className="range-label">
                  Master volume <span>{Math.round(soundVolume * 100)}%</span>
                </label>
                <CandySlider
                  aria-label="Master volume"
                  value={Math.round(soundVolume * 100)}
                  onChange={(v) => setSoundVolume(v / 100)}
                  color="blue"
                />

                <div className="control-line">
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <CandyGameIcon name="heart" size={18} color="#ec4899" />
                    Game reminders
                  </span>
                  <CandySwitch
                    aria-label="Game reminders"
                    checked={notifications}
                    onChange={setNotifications}
                  />
                </div>

                <CandyButton
                  variant="blue"
                  size="lg"
                  fullWidth
                  onClick={() =>
                    showToast({
                      title: "Settings saved for this session.",
                      variant: "green",
                    })
                  }
                >
                  Looks good
                </CandyButton>
              </div>
            </CandyPanel>
          )}
        </div>
      </div>

      <p className="example-footnote">
        These examples run locally. No account, backend, or real-money
        purchases.
      </p>
    </section>
  );
}
export default ScenarioShowcase;
