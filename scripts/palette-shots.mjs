#!/usr/bin/env bun
/**
 * One-click palette renders for CandyUI.
 *
 * Tiles EVERY component (plus colour tokens) on a set of backdrops and writes PNGs:
 *
 *   artifacts/palette/<backdrop>.png               full sheet, all components tiled
 *   artifacts/palette/sections/<backdrop>/<id>.png one PNG per component section (--split)
 *
 * Usage:
 *   bun run palette                       # all backdrops, full sheets
 *   bun run palette -- --split            # + one PNG per component per backdrop
 *   bun run palette -- --backdrop white,navy
 *   bun run palette -- --section buttons,badges,toasts
 *   bun run palette -- --css my-theme.css # inject a theme override to test colours
 *   bun run palette -- --var --candy-blue=#e11d48 --var --candy-blue-shadow=#7f1033
 *   bun run palette -- --out artifacts/palette-red --scale 2
 *   bun run palette -- --url http://127.0.0.1:5173   # reuse a running dev server
 *
 * Env: CHROME_PATH (browser executable), PALETTE_URL (same as --url).
 */
import { chromium } from "@playwright/test";
import { createServer } from "vite";
import { mkdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ALL_BACKDROPS = ["white", "soft", "cream", "sky", "dots", "blue", "navy"];

/* ------------------------------ args ------------------------------ */
const argv = process.argv.slice(2);
const opts = {
  backdrop: ALL_BACKDROPS,
  section: ["all"],
  split: false,
  css: [],
  vars: [],
  out: join(root, "artifacts", "palette"),
  scale: 1,
  url: process.env.PALETTE_URL || "",
  width: 1600,
};
const take = (i) => {
  if (i + 1 >= argv.length) throw new Error(`Missing value for ${argv[i]}`);
  return argv[i + 1];
};
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--split") opts.split = true;
  else if (a === "--backdrop") opts.backdrop = take(i++).split(",");
  else if (a === "--section") opts.section = take(i++).split(",");
  else if (a === "--css") opts.css.push(take(i++));
  else if (a === "--var") opts.vars.push(take(i++));
  else if (a === "--out") opts.out = resolve(take(i++));
  else if (a === "--scale") opts.scale = Number(take(i++)) || 1;
  else if (a === "--url") opts.url = take(i++);
  else if (a === "--width") opts.width = Number(take(i++)) || 1600;
  else if (a === "-h" || a === "--help") {
    console.log(
      (await readFile(new URL(import.meta.url), "utf8")).split("*/")[0],
    );
    process.exit(0);
  } else throw new Error(`Unknown argument: ${a}`);
}
if (opts.backdrop.includes("all")) opts.backdrop = ALL_BACKDROPS;

let injectedCss = "";
for (const file of opts.css)
  injectedCss += (await readFile(resolve(file), "utf8")) + "\n";
if (opts.vars.length) {
  const decls = opts.vars.map((v) => {
    const eq = v.indexOf("=");
    if (eq < 1) throw new Error(`--var expects --name=value, got "${v}"`);
    return `${v.slice(0, eq)}: ${v.slice(eq + 1)};`;
  });
  injectedCss += `:root, .candy-ui-root, .candy-modal-overlay { ${decls.join(" ")} }\n`;
}

/* --------------------------- infrastructure --------------------------- */
let server;
let baseUrl = opts.url.replace(/\/$/, "");
if (!baseUrl) {
  server = await createServer({
    root: join(root, "apps", "docs"),
    configFile: join(root, "apps", "docs", "vite.config.ts"),
    logLevel: "error",
    server: { port: 0, strictPort: false, host: "127.0.0.1", open: false },
  });
  await server.listen();
  baseUrl = server.resolvedUrls.local[0].replace(/\/$/, "");
}

const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
].filter(Boolean);
const executablePath = chromeCandidates.find((p) => existsSync(p));
const browser = await chromium.launch({ executablePath, headless: true });

const written = [];
const problems = [];
try {
  await mkdir(opts.out, { recursive: true });
  const context = await browser.newContext({
    viewport: { width: opts.width, height: 1000 },
    deviceScaleFactor: opts.scale,
    reducedMotion: "reduce",
  });

  async function open(backdrop, sections) {
    const page = await context.newPage();
    page.on("pageerror", (e) => problems.push(`[${backdrop}] ${e.message}`));
    const qs = new URLSearchParams({ backdrop, section: sections.join(",") });
    await page.goto(`${baseUrl}/palette.html?${qs}`, { waitUntil: "load" });
    if (injectedCss) await page.addStyleTag({ content: injectedCss });
    // Webfonts can be unreachable offline; never hang on them.
    await page.waitForFunction(() => window.__PALETTE_READY__ === true, null, {
      timeout: 20000,
    });
    await page.evaluate(() =>
      Promise.race([
        document.fonts.ready,
        new Promise((r) => setTimeout(r, 4000)),
      ]),
    );
    // Let token labels re-read computed values after theme overrides.
    await page.evaluate(() =>
      window.dispatchEvent(new Event("palette:refresh")),
    );
    await page.evaluate(
      () =>
        new Promise((r) =>
          requestAnimationFrame(() => requestAnimationFrame(r)),
        ),
    );
    return page;
  }

  // Discover the section ids once from the app itself (single source of truth).
  const probe = await open(opts.backdrop[0], ["none"]);
  const sectionIds = await probe.evaluate(() => window.__PALETTE_SECTIONS__);
  await probe.close();
  if (!opts.section.includes("all")) {
    const unknown = opts.section.filter((s) => !sectionIds.includes(s));
    if (unknown.length)
      throw new Error(
        `Unknown section(s): ${unknown.join(", ")}. Available: ${sectionIds.join(", ")}`,
      );
  }

  for (const backdrop of opts.backdrop) {
    if (!ALL_BACKDROPS.includes(backdrop))
      throw new Error(
        `Unknown backdrop "${backdrop}". Available: ${ALL_BACKDROPS.join(", ")}`,
      );

    const page = await open(backdrop, opts.section);
    const full = join(opts.out, `${backdrop}.png`);
    await page.locator("#palette-stage").screenshot({ path: full });
    written.push(full);

    if (opts.split) {
      const dir = join(opts.out, "sections", backdrop);
      await mkdir(dir, { recursive: true });
      const ids = opts.section.includes("all") ? sectionIds : opts.section;
      for (const id of ids) {
        const file = join(dir, `${id}.png`);
        await page.locator(`[data-section="${id}"]`).screenshot({ path: file });
        written.push(file);
      }
    }
    await page.close();
    console.log(`✔ ${backdrop}`);
  }
} finally {
  await browser.close();
  await server?.close();
}

console.log(`\n${written.length} PNG(s) written to ${opts.out}`);
if (problems.length) {
  console.error(`\nPage errors:\n${problems.join("\n")}`);
  process.exitCode = 1;
}
