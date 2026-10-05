import { chromium } from "@playwright/test";
import { createServer } from "vite";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const outDir = resolve("artifacts/review");
await mkdir(outDir, { recursive: true });

console.log("Starting in-process Vite server...");
const server = await createServer({
  root: resolve("apps/docs"),
  configFile: resolve("apps/docs/vite.config.ts"),
  server: { port: 5188, host: "127.0.0.1" },
});
await server.listen();
const url = "http://127.0.0.1:5188";
console.log("Server ready at", url);

const browser = await chromium.launch({
  headless: true,
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
});

const page = await browser.newPage({
  viewport: { width: 1536, height: 1024 },
  deviceScaleFactor: 1,
  reducedMotion: "reduce",
});

try {
  // 1. Showcase page
  console.log("Capturing Showcase page...");
  await page.goto(`${url}/showcase`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${outDir}/01-showcase-full.png`, fullPage: true });

  // 2. Open Modal in Showcase
  console.log("Capturing Showcase Modal...");
  await page.getByRole("button", { name: "开始游戏", exact: true }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${outDir}/02-showcase-modal.png`, fullPage: false });
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // 3. Overview page
  console.log("Capturing Overview page...");
  await page.goto(`${url}/`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${outDir}/03-overview-full.png`, fullPage: true });

  // 4. Components page
  console.log("Capturing Components page...");
  await page.goto(`${url}/components`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${outDir}/04-components-full.png`, fullPage: true });

  // 5. Select some newly added reference components in Components page
  const selectCategory = async (name) => {
    const btn = page.getByRole("navigation", { name: "Component categories" }).getByRole("button", { name, exact: true });
    if (await btn.isVisible()) {
      await btn.click();
      await page.waitForTimeout(200);
    }
  };
  await selectCategory("Game cards");
  await page.screenshot({ path: `${outDir}/04b-component-game-cards.png`, fullPage: false });
  await selectCategory("Theme selection");
  await page.screenshot({ path: `${outDir}/04c-component-theme-selection.png`, fullPage: false });
  await selectCategory("Pagination");
  await page.screenshot({ path: `${outDir}/04d-component-pagination.png`, fullPage: false });

  // 6. Icons page
  console.log("Capturing Icons page...");
  await page.goto(`${url}/icons`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${outDir}/05-icons-full.png`, fullPage: true });

  // 7. Mobile Showcase (width 390)
  console.log("Capturing Mobile Showcase...");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${url}/showcase`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${outDir}/06-showcase-mobile.png`, fullPage: true });

  console.log("All screenshots captured successfully into", outDir);
} finally {
  await browser.close();
  await server.close();
}
