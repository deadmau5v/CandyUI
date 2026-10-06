import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 }, reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${process.env.PREVIEW_URL || "http://127.0.0.1:5173"}/components`);
  const reference = page.getByRole("region", { name: "按钮样式参考" });
  await reference.waitFor();
  const button = reference.getByRole("button", { name: "开始游戏", exact: true }).first();
  const surface = () => button.evaluate((element) => {
    const css = getComputedStyle(element);
    return { color: css.backgroundColor, image: css.backgroundImage, backgroundSize: css.backgroundSize, transform: css.transform, shadow: css.boxShadow, radius: css.borderRadius };
  });
  await page.mouse.move(0, 0);
  const normal = await surface();
  assert.match(normal.image, /radial-gradient/);
  assert.equal(normal.backgroundSize, "100% 4px, 100% 100%", "Highlight must be limited to the top four pixels");
  await button.hover();
  await page.waitForTimeout(160);
  const hover = await surface();
  assert.notEqual(hover.color, normal.color, "Hover must visibly change the face color");
  assert.equal(hover.transform, "none", "Hover must not move or scale the button");
  assert.equal(hover.shadow, normal.shadow, "Hover must not add a large outer ring");
  await page.mouse.down();
  await page.waitForTimeout(160);
  const active = await surface();
  assert.notEqual(active.color, hover.color);
  assert.equal(active.transform, "none", "Press must not move or scale the button");
  await page.mouse.up();
  const disabled = reference.getByRole("button", { name: "开始游戏", exact: true }).last();
  assert.equal(await disabled.isDisabled(), true);
  await button.focus();
  // Explicit keyboard navigation enables :focus-visible even after mouse interaction.
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  const keyboardFocus = await button.evaluate((element) => ({ width: getComputedStyle(element).outlineWidth, offset: getComputedStyle(element).outlineOffset }));
  assert.equal(keyboardFocus.width, "2px");
  assert.equal(keyboardFocus.offset, "2px");
  await button.evaluate((element) => element.blur());
  await page.mouse.move(0, 0);
  await mkdir("artifacts/buttons", { recursive: true });
  await reference.screenshot({ path: "artifacts/buttons/button-reference-desktop.png" });
  await page.setViewportSize({ width: 390, height: 1100 });
  await page.waitForTimeout(100);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, "Mobile must not overflow horizontally");
  await reference.screenshot({ path: "artifacts/buttons/button-reference-mobile.png" });
  assert.deepEqual(errors, []);
  console.log("PASS: radial highlight, color-only hover/press, stable position and shadow, compact keyboard focus, disabled state, mobile layout, no runtime errors.");
} finally {
  await browser.close();
}
