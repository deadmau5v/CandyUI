import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { createServer } from "vite";
import { resolve } from "node:path";

const output = "artifacts/visual";
await mkdir(output, { recursive: true });

let server;
let url = process.env.PREVIEW_URL;
if (!url) {
  server = await createServer({
    root: resolve("apps/docs"),
    configFile: resolve("apps/docs/vite.config.ts"),
    server: { port: 5189, host: "127.0.0.1" },
  });
  await server.listen();
  url = "http://127.0.0.1:5189";
}

const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const results = [];
const errors = [];
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
  reducedMotion: "reduce",
});
page.on("pageerror", (error) => errors.push(error.message));
const categories = [
  "Buttons",
  "Badges",
  "Panels & ribbons",
  "Dialogs",
  "Progress",
  "Sliders",
  "Switches",
  "Counters",
  "Avatars",
  "Tooltips",
  "Toasts & confetti",
  "Inputs",
  "Selects",
  "Tabs",
  "Checkboxes",
  "Rating",
  "Tags",
  "Spinners",
  "Lists",
  "Game cards",
  "Theme selection",
  "Theme icons",
  "Status badges",
  "Alerts",
  "Navigation",
  "Breadcrumbs",
  "Pagination",
  "Steps",
  "Dropdown menus",
  "Number stepper",
  "Tag input",
  "File upload",
  "Date & time",
  "Color picker",
  "Empty states",
  "Notifications",
  "Social buttons",
];

const navigate = (name) =>
  page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("tab", { name, exact: true })
    .click();

const openCategory = (name) =>
  page
    .getByRole("navigation", { name: "Component categories" })
    .getByRole("button", { name, exact: true })
    .click();

async function capture(name) {
  // Transient notifications must not obscure unrelated layout review.
  for (const toast of await page
    .getByRole("button", { name: /^Dismiss notification:/ })
    .all())
    await toast.click();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: `${output}/${name}.png`,
    fullPage: !/dialog|modal/.test(name),
  });
  const dimensions = await page.evaluate(() => ({
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  assert(
    dimensions.scrollWidth <= dimensions.width,
    `No overflow in ${name}: scrollWidth ${dimensions.scrollWidth} <= ${dimensions.width}`,
  );
  results.push({ name, ...dimensions });
}

try {
  await page.goto(url, {
    waitUntil: "networkidle",
  });
  await capture("overview-desktop");
  await page.setViewportSize({ width: 2092, height: 1120 });
  await capture("overview-wide-desktop");
  await page.setViewportSize({ width: 1440, height: 1000 });

  // 1. Showcase page tests
  await navigate("Showcase");
  await capture("showcase-desktop");

  // Open modal in Showcase
  const startBtn = page.getByRole("button", { name: "开始游戏", exact: true });
  await startBtn.click();
  await page.waitForTimeout(200);
  assert(await page.getByRole("dialog").isVisible(), "Showcase dialog is visible");
  await capture("showcase-modal-desktop");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
  assert((await page.getByRole("dialog").count()) === 0, "Showcase dialog closed");

  // 2. Components page tests
  await navigate("Components");
  await capture("docs-buttons-desktop");
  const disabledSwitch = page.getByRole("switch", { name: "Toggle disabled" });
  await disabledSwitch.click();
  assert(
    await page.locator(".docs-preview .candy-btn").first().isDisabled(),
    "Button disabled when checked",
  );
  await disabledSwitch.click();

  for (const category of categories) {
    await openCategory(category);
    await capture(`docs-${category.split(" ")[0].toLowerCase()}-desktop`);
    if (category === "Dialogs") {
      await page.getByRole("button", { name: "Open a dialog" }).click();
      await capture("docs-modal-desktop");
      await page
        .getByRole("button", { name: "Keep playing", exact: true })
        .click();
      await page.locator(".page-content").evaluate((element) => {
        element.style.transform = "translateZ(0)";
        element.style.position = "relative";
        element.style.zIndex = "0";
        element.style.setProperty("--candy-outline", "#912c65");
      });
      await page.getByRole("button", { name: "Open a dialog" }).click();
      let rect;
      for (let i = 0; i < 20; i++) {
        rect = await page.locator(".candy-modal-overlay").evaluate((element) => {
          const r = element.getBoundingClientRect();
          return [
            Math.round(r.x),
            Math.round(r.y),
            Math.round(r.width),
            Math.round(r.height),
          ];
        });
        if (rect[0] === 0 && rect[1] === 0 && rect[2] === 1440 && rect[3] === 1000) break;
        await page.waitForTimeout(50);
      }
      assert.deepEqual(rect, [0, 0, 1440, 1000]);
      await capture("modal-stacking-regression");
      await page.keyboard.press("Escape");
      await page
        .locator(".page-content")
        .evaluate((element) => element.removeAttribute("style"));
    }
    if (category === "Sliders") {
      const slider = page.getByRole("slider").first();
      await slider.focus();
      await slider.press("ArrowRight");
      assert.equal(await slider.getAttribute("aria-valuenow"), "76");
      await slider.press("End");
      assert.equal(await slider.getAttribute("aria-valuenow"), "100");
      await slider.press("Home");
      assert.equal(await slider.getAttribute("aria-valuenow"), "0");
    }
    if (category === "Switches") {
      const toggle = page.getByRole("switch").first();
      await toggle.focus();
      await toggle.press("Space");
      assert.equal(await toggle.getAttribute("aria-checked"), "false");
    }
    if (category === "Toasts & confetti") {
      await page.getByRole("button", { name: "Show a toast" }).click();
      const toastBtn = page.getByRole("button", {
        name: "Dismiss notification: Nice one!",
      });
      await toastBtn.waitFor({ state: "visible", timeout: 3000 });
      assert(await toastBtn.isVisible());
      await toastBtn.press("Enter");
      await page.waitForTimeout(200);
      assert((await toastBtn.count()) === 0);
    }
  }

  await page.getByRole("textbox", { name: "Find a component" }).fill("buttons");
  assert.equal(
    await page
      .getByRole("navigation", { name: "Component categories" })
      .getByRole("button")
      .count(),
    2,
  );
  await page.getByRole("textbox", { name: "Find a component" }).fill("");

  // 3. Icons page test
  await navigate("Icons");
  await capture("icons-desktop");

  // 4. Mobile responsive tests across pages
  for (const width of [390, 320, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await navigate("Overview");
    await capture(`overview-mobile-${width}`);
    for (const name of ["Showcase", "Components", "Icons"]) {
      await navigate(name);
      const suffix = width === 390 ? "mobile" : `mobile-${width}`;
      await capture(`${name.toLowerCase()}-${suffix}`);
    }
  }

  assert.deepEqual(errors, []);
  console.log(
    `PASS: ${results.length} screenshot states, no horizontal overflow, no page errors. Showcase, modal focus/Escape, disabled buttons, slider/switch keyboard, toast dismissal, docs search, responsive mobile views verified.`,
  );
} catch (error) {
  errors.push(error.message);
  console.error(error);
  process.exitCode = 1;
} finally {
  await writeFile(
    `${output}/review-results.json`,
    JSON.stringify({ results, errors }, null, 2),
  );
  await browser.close();
  if (server) {
    await server.close();
  }
}
