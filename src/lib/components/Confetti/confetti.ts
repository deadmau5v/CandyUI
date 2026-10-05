import confetti from "canvas-confetti";
import { candySound } from "../../sound/audio";

export interface ConfettiOptions {
  particleCount?: number;
  spread?: number;
  origin?: { x: number; y: number };
  playSound?: boolean;
}

export const triggerCandyConfetti = (options: ConfettiOptions = {}) => {
  const {
    particleCount = 100,
    spread = 70,
    origin = { x: 0.5, y: 0.6 },
    playSound = true,
  } = options;

  if (playSound) {
    candySound.play("fanfare");
  }

  // Colorful candy palette confetti
  confetti({
    particleCount,
    spread,
    origin,
    colors: ["#f56698", "#2879df", "#62ce87", "#ffd45b", "#7955c7", "#ffab62"],
    disableForReducedMotion: true,
    ticks: 250,
    gravity: 0.8,
    scalar: 1.2,
    shapes: ["circle", "square"],
  });
};
