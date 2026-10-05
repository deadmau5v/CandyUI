# CandyUI

Friendly React UI for web games, with Fredoka typography, rounded toy-like buttons, navy outlines, thin inner highlights, configurable physical depth, and optional synthesized sound.

The visual direction takes inspiration from Gartic.io’s game controls and Gartic Show’s centered cyan introduction. Per visual review feedback, the Hero deliberately leaves illustration space empty: no handmade SVG avatars or assembled workbench. This is an independent component library, not a reproduction of Gartic assets or a multiplayer game service.

[DESIGN.md](DESIGN.md) records the design decisions; [tokens.json](tokens.json) exports the DTCG design tokens.

## Projects

- `src/lib` — reusable React component library; ESM, CommonJS, CSS, and TypeScript declarations.
- `apps/docs` — documentation app: Overview, Showcase (interactive game board), Components (API catalog & playground), and Icons (Game Icon Pack).

## Installation

Install directly from GitHub into any React project:

```sh
# bun (recommended)
bun add github:deadmau5v/CandyUI

# pnpm
pnpm add github:deadmau5v/CandyUI

# npm
npm install github:deadmau5v/CandyUI
```

## Quick Start

```tsx
import { CandyProvider, CandyToastProvider, CandyButton } from "candy-ui";
import "candy-ui/style.css";

export function Game() {
  return (
    <CandyProvider defaultSoundEnabled={false}>
      <CandyToastProvider>
        <CandyButton variant="green" onClick={() => console.log("Ready!")}>
          Let’s play
        </CandyButton>
      </CandyToastProvider>
    </CandyProvider>
  );
}
```

## Development

```sh
bun install
bun run dev                         # Start documentation app
bun run typecheck                   # TypeScript check (lib + docs)
bun run build                       # Build library + docs production bundle
bun run build:lib                   # Build component library dist/
bun run build:docs                  # Build docs site
bun run test:lib                    # Smoke checks
bun run test:visual                 # Visual review Playwright suite
bun run lint                        # Lint with Oxlint
```

React 18/19 are supported by the peer dependency declaration. Fredoka is loaded from Google Fonts by default; self-host and override `--candy-font-family` for offline or privacy-sensitive deployments. Audio stays off by default in the showcase; users can enable it in the header or Settings example.

## Components

| Component                          | Purpose                                                             |
| ---------------------------------- | ------------------------------------------------------------------- |
| CandyButton / CandyIconButton      | Color variants, five sizes, four shapes, optional sound             |
| CandyBadge                         | Status label with optional icon                                     |
| CandyGameIcon                      | 815+ rounded vector game icons from Nieobie/Game-Icon-Pack          |
| CandyPanel / CandyRibbon           | White or tinted surfaces and simple title banners                   |
| CandyModal                         | Responsive overlay, Escape, focus trap and restoration              |
| CandyProgress                      | Clamped progress, optional stripes and formatted labels             |
| CandySlider                        | Controlled range; pointer and Arrow/Home/End/Page keyboard controls |
| CandySwitch                        | Controlled keyboard-accessible toggle; provide an aria-label        |
| CandyCounter                       | HUD value, icon and optional plus action                            |
| CandyAvatar                        | Image, semantic border and optional level badge                     |
| CandyTooltip                       | Hover/focus hint with accessible description                        |
| CandyToastProvider / useCandyToast | Dismissible feedback notifications                                  |
| useFloatingText                    | Transient score/combat text                                         |
| triggerCandyConfetti               | Optional celebration; honors reduced-motion preference              |

See the Components page for live controls, usage snippets, and key props. Palette variants: `pink`, `blue`, `green`, `yellow`, `orange`, `purple`, `choco`, `cream`, `dark`, `ghost`.

## Theme tokens

Scope tokens to the game root, not to the whole browser page:

```css
.my-game {
  --candy-primary: #8559ca;
  --candy-primary-shadow: #603ba0;
  --candy-primary-text: #ffffff;
  --candy-btn-depth: 5px;
  --candy-radius-md: 18px;
  --candy-radius-lg: 24px;
  --candy-radius-xl: 30px;
  --candy-outline: #082b4b;
  --candy-surface: #ffffff;
}
```

Default buttons and `variant="blue"` consume primary tokens. Other color variants remain semantic; override their `--candy-{color}`, `--candy-{color}-shadow`, and `--candy-{color}-text` tokens independently. The Sandbox provides four starter palettes, live colors, radius/depth controls, and CSS export. Label color follows the chosen primary color’s luminance.

Legacy panel names (`cookie`, `bubblegum`, `cyber`, `frosted`) remain accepted, but now use clean white/tinted surfaces. Rivets are visually retired and off by default. Buttons default to blue and pill-shaped, with size-scaled navy frames, pale inner edges, and a 5px configurable base. Explicit `rounded` consumes the radius token; pill/circle stay fully round. Modal panels use a body portal and copy scoped theme tokens; Escape, focus restoration and body scroll locking are preserved. Concurrent/nested modals closed out of order are not yet supported by a shared scroll-lock manager. These are intentional visual changes for the pre-release 0.1.0 library.

## License

MIT.
