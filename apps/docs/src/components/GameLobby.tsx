import React, { useState } from "react";
import {
  CandyButton,
  CandyBadge,
  CandyModal,
  CandyPanel,
  CandyIconButton,
  CandyGameIcon,
  CandyInput,
  CandySelect,
  useCandyToast,
} from "candy-ui";
import { Character } from "./PlayfulArt";

const characters = ["bear", "frog", "cat", "bunny"] as const;
const colors = ["#eee4ff", "#dff3d5", "#fff0c7", "#ffe1e8"];

export function GameLobby({ compact = false }: { compact?: boolean }) {
  const [avatar, setAvatar] = useState(0);
  const [name, setName] = useState("Player one");
  const [language, setLanguage] = useState("English");
  const [room, setRoom] = useState(false);
  const [privateRoom, setPrivateRoom] = useState(false);
  const { showToast } = useCandyToast();

  return (
    <CandyPanel
      theme="frosted"
      hasRivets={false}
      className={`scenario-panel ${compact ? "compact" : ""}`}
    >
      <div className="scenario-heading lobby-heading">
        <div className="scenario-icon-bubble">
          <CandyGameIcon name="controller" size={44} color="#1761d1" />
        </div>
        <h2>Everybody’s invited.</h2>
        <p>Your next game starts here.</p>
        <div style={{ marginTop: 8 }}>
          <CandyBadge variant="green" size="sm">
            LIVE DEMO
          </CandyBadge>
        </div>
      </div>

      <div className="avatar-picker">
        <CandyIconButton
          aria-label="Previous avatar"
          variant="cream"
          shape="circle"
          size="sm"
          icon={<CandyGameIcon name="arrow-left" size={16} color="#12427a" />}
          onClick={() => setAvatar((avatar + 3) % 4)}
        />
        <div className="avatar-choice">
          <Character
            kind={characters[avatar]}
            color={colors[avatar]}
            size="lg"
          />
          <span>That’s you!</span>
        </div>
        <CandyIconButton
          aria-label="Next avatar"
          variant="cream"
          shape="circle"
          size="sm"
          icon={<CandyGameIcon name="arrow-right" size={16} color="#12427a" />}
          onClick={() => setAvatar((avatar + 1) % 4)}
        />
      </div>

      <div className="form-group" style={{ marginBottom: 14 }}>
        <label
          className="field-label"
          htmlFor={compact ? "scenario-name" : "player-name"}
        >
          YOUR NICKNAME
        </label>
        <CandyInput
          id={compact ? "scenario-name" : "player-name"}
          value={name}
          maxLength={20}
          placeholder="Pick a fun name"
          onChange={(e) => setName(e.target.value)}
          clearable
        />
      </div>

      <div className="form-group" style={{ marginBottom: 20 }}>
        <label
          className="field-label"
          htmlFor={compact ? "scenario-language" : "player-language"}
        >
          LANGUAGE
        </label>
        <CandySelect
          id={compact ? "scenario-language" : "player-language"}
          value={language}
          onChange={(val) => setLanguage(String(val))}
          options={[
            { value: "English", label: "English" },
            { value: "简体中文", label: "简体中文" },
            { value: "Español", label: "Español" },
            { value: "Português", label: "Português" },
          ]}
          color="blue"
          fullWidth
        />
      </div>

      <CandyButton
        variant="green"
        size="lg"
        fullWidth
        rightIcon={
          <CandyGameIcon name="arrow-right" size={18} color="#12427a" />
        }
        onClick={() => {
          if (!name.trim()) {
            showToast({ title: "Pick a nickname first", variant: "pink" });
            return;
          }
          setPrivateRoom(false);
          setRoom(true);
        }}
      >
        Let’s play
      </CandyButton>

      <div style={{ marginTop: 8 }}>
        <CandyButton
          variant="ghost"
          size="sm"
          fullWidth
          onClick={() => {
            setPrivateRoom(true);
            setRoom(true);
          }}
        >
          Or create a private room →
        </CandyButton>
      </div>

      <div className="lobby-friends">
        <div className="mini-avatars">
          {characters.slice(1).map((c, i) => (
            <Character key={c} kind={c} color={colors[i + 1]} size="xs" />
          ))}
        </div>
        <span>More friends. More fun.</span>
        <span className="online-dot" />
      </div>

      <CandyModal
        isOpen={room}
        onClose={() => setRoom(false)}
        theme="frosted"
        ribbonColor="blue"
        title={privateRoom ? "Your private room" : "You’re in!"}
        width={480}
      >
        <div className="room-dialog">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <Character
              kind={characters[avatar]}
              color={colors[avatar]}
              size="lg"
            />
          </div>
          <h2>Hey, {name.trim() || "Player one"}!</h2>
          <p>
            {privateRoom
              ? "Invite your friends to the party."
              : "The lobby is ready. This is a local UI demo, not a multiplayer server."}
          </p>
          <div className="room-code">
            <span>ROOM · CANDY42</span>
            <CandyButton
              variant="cream"
              size="xs"
              aria-label="Copy room code"
              onClick={async () => {
                await navigator.clipboard.writeText("CANDY42");
                showToast({ title: "Room code copied", variant: "green" });
              }}
            >
              Copy
            </CandyButton>
          </div>
          <CandyButton variant="green" fullWidth onClick={() => setRoom(false)}>
            Ready to go
          </CandyButton>
        </div>
      </CandyModal>
    </CandyPanel>
  );
}
export default GameLobby;
