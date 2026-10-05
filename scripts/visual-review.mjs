import { chromium, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const output = "artifacts/visual";
await mkdir(output, { recursive: true });
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
  "Badges",
  "Panels & ribbons",
  "Dialogs",
  "Progress & sliders",
  "Switches & counters",
  "Avatars & tooltips",
  "Toasts & confetti",
];
const examples = [
  "Game lobby",
  "Leaderboard",
  "Daily rewards",
  "Level select",
  "Settings",
];
const navigate = (name) =>
  page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("button", { name, exact: true })
    .click();
const openCategory = (name) =>
  page
    .getByRole("navigation", { name: "Component categories" })
    .getByRole("button", { name, exact: true })
    .click();
const openExample = (name) =>
  page.getByRole("tab", { name, exact: true }).click();

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
  expect(dimensions.scrollWidth, `No overflow in ${name}`).toBeLessThanOrEqual(
    dimensions.width,
  );
  results.push({ name, ...dimensions });
}

try {
  await page.goto(process.env.PREVIEW_URL || "http://127.0.0.1:5173/", {
    waitUntil: "networkidle",
  });
  await capture("after-desktop");
  await page.setViewportSize({ width: 2092, height: 1120 });
  await capture("after-wide-desktop");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole("button", { name: "Try the demo", exact: true }).click();

  await page.getByRole("button", { name: "Next avatar", exact: true }).click();
  await page.getByLabel("YOUR NICKNAME").fill("Mochi");
  const playButton = page
    .getByRole("button", { name: "Let’s play", exact: true })
    .first();
  await playButton.click();
  await expect(page.getByText("Hey, Mochi!")).toBeVisible();
  await expect(page.getByRole("dialog")).toBeVisible();
  await capture("lobby-dialog-desktop");
  // Last action -> Tab wraps to the close button; Escape restores the trigger.
  await page.getByRole("button", { name: "Ready to go" }).focus();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Close", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(playButton).toBeFocused();

  await navigate("Sandbox");
  await capture("sandbox-desktop");
  await page.getByRole("button", { name: "Lilac club" }).click();
  const primaryButton = page.locator(".theme-stage .candy-btn-blue");
  await expect
    .poll(() =>
      primaryButton.evaluate(
        (element) => getComputedStyle(element).backgroundColor,
      ),
    )
    .toBe("rgb(133, 89, 202)");
  await page.locator("#theme-depth").fill("0");
  await expect
    .poll(() =>
      primaryButton.evaluate((element) => getComputedStyle(element).boxShadow),
    )
    .toContain("0px 0px 0px");
  await page.locator("#theme-radius").fill("24");
  await expect
    .poll(() =>
      page
        .locator(".theme-stage .candy-panel")
        .evaluate((element) => getComputedStyle(element).borderRadius),
    )
    .toBe("36px");
  await expect
    .poll(() =>
      primaryButton.evaluate(
        (element) => getComputedStyle(element).borderRadius,
      ),
    )
    .toBe("9999px");
  await capture("sandbox-custom-desktop");
  await page.locator("#theme-color").fill("#ffd263");
  await expect
    .poll(() =>
      primaryButton.evaluate((element) => getComputedStyle(element).color),
    )
    .toBe("rgb(23, 47, 86)");
  await capture("sandbox-light-desktop");

  await navigate("Components");
  await capture("docs-buttons-desktop");
  await page.getByRole("checkbox", { name: "Disabled" }).check();
  await expect(page.locator(".docs-preview .candy-btn").first()).toBeDisabled();
  await page.getByRole("checkbox", { name: "Disabled" }).uncheck();
  for (const category of categories) {
    await openCategory(category);
    await capture(`docs-${category.split(" ")[0].toLowerCase()}-desktop`);
    if (category === "Dialogs") {
      await page.getByRole("button", { name: "Open a dialog" }).click();
      await capture("docs-modal-desktop");
      await page
        .getByRole("button", { name: "Keep playing", exact: true })
        .click();
      // Regression from the user's screenshot: modal must escape a transformed,
      // stacked parent while retaining the scope's custom theme tokens.
      await page.locator(".page-content").evaluate((element) => {
        element.style.transform = "translateZ(0)";
        element.style.position = "relative";
        element.style.zIndex = "0";
        element.style.setProperty("--candy-outline", "#912c65");
      });
      await page.getByRole("button", { name: "Open a dialog" }).click();
      await expect
        .poll(() =>
          page.locator(".candy-modal-overlay").evaluate((element) => {
            const rect = element.getBoundingClientRect();
            return [
              Math.round(rect.x),
              Math.round(rect.y),
              Math.round(rect.width),
              Math.round(rect.height),
            ];
          }),
        )
        .toEqual([0, 0, 1440, 1000]);
      await expect
        .poll(() =>
          page
            .locator(".candy-modal-overlay")
            .evaluate((element) =>
              getComputedStyle(element)
                .getPropertyValue("--candy-outline")
                .trim(),
            ),
        )
        .toBe("#912c65");
      await expect
        .poll(() =>
          page
            .getByRole("button", { name: "Close", exact: true })
            .evaluate((element) => {
              const rect = element.getBoundingClientRect();
              return element.contains(
                document.elementFromPoint(
                  rect.x + rect.width / 2,
                  rect.y + rect.height / 2,
                ),
              );
            }),
        )
        .toBe(true);
      await capture("modal-stacking-regression");
      await page.keyboard.press("Escape");
      await page
        .locator(".page-content")
        .evaluate((element) => element.removeAttribute("style"));
    }
    if (category === "Progress & sliders") {
      const slider = page.getByRole("slider");
      await slider.focus();
      await slider.press("ArrowRight");
      await expect(slider).toHaveAttribute("aria-valuenow", "66");
      await slider.press("End");
      await expect(slider).toHaveAttribute("aria-valuenow", "100");
      await slider.press("Home");
      await expect(slider).toHaveAttribute("aria-valuenow", "0");
    }
    if (category === "Switches & counters") {
      const toggle = page.getByRole("switch");
      await toggle.focus();
      await toggle.press("Space");
      await expect(toggle).toHaveAttribute("aria-checked", "false");
    }
    if (category === "Toasts & confetti") {
      await page.getByRole("button", { name: "Show a toast" }).click();
      await expect(
        page.getByRole("button", { name: "Dismiss notification: Nice one!" }),
      ).toBeVisible();
      await page
        .getByRole("button", { name: "Dismiss notification: Nice one!" })
        .press("Enter");
      await expect(
        page.getByRole("button", { name: "Dismiss notification: Nice one!" }),
      ).toHaveCount(0);
    }
  }
  await page.getByRole("textbox", { name: "Find a component" }).fill("buttons");
  await expect(
    page
      .getByRole("navigation", { name: "Component categories" })
      .getByRole("button"),
  ).toHaveCount(1);

  await navigate("Examples");
  for (const tab of examples) {
    await openExample(tab);
    await capture(`example-${tab.split(" ")[0].toLowerCase()}-desktop`);
    if (tab === "Daily rewards") {
      await page.getByRole("button", { name: "Claim 150 coins" }).click();
      await expect(
        page.getByRole("button", { name: "All yours!" }),
      ).toBeDisabled();
      await expect(page.locator(".example-topbar")).toContainText("1,400");
    }
    if (tab === "Level select") {
      await expect(
        page.getByRole("button", { name: "Level 5 locked" }),
      ).toBeDisabled();
      await page.getByRole("button", { name: "Level 3", exact: true }).click();
      await expect(
        page.getByRole("button", { name: "Play level 3" }),
      ).toBeVisible();
    }
  }

  for (const width of [390, 320, 768]) {
    await page.setViewportSize({ width, height: 844 });
    await navigate("Overview");
    await capture(`after-mobile-${width}`);
    for (const name of ["Sandbox", "Components", "Examples"]) {
      await navigate(name);
      const suffix = width === 390 ? "mobile" : `mobile-${width}`;
      await capture(`${name.toLowerCase()}-${suffix}`);
      if (name === "Examples") {
        await page
          .getByRole("button", { name: "Let’s play", exact: true })
          .click();
        await expect(page.getByRole("dialog")).toBeVisible();
        await capture(`lobby-dialog-${suffix}`);
        await expect
          .poll(() =>
            page
              .getByRole("button", { name: "Close", exact: true })
              .evaluate((element) => {
                const rect = element.getBoundingClientRect();
                return element.contains(
                  document.elementFromPoint(
                    rect.x + rect.width / 2,
                    rect.y + rect.height / 2,
                  ),
                );
              }),
          )
          .toBe(true);
        await page.keyboard.press("Escape");
        await expect(page.getByRole("dialog")).toHaveCount(0);
      }
      if (name === "Examples" && width !== 768) {
        for (const tab of examples.slice(1)) {
          await openExample(tab);
          await capture(`example-${tab.split(" ")[0].toLowerCase()}-${suffix}`);
        }
      }
    }
  }
  expect(errors).toEqual([]);
  console.log(
    `PASS: ${results.length} screenshot states, no horizontal overflow, no page errors. Lobby, modal focus/Escape, live theme colors/depth/radius/contrast, disabled buttons, slider/switch keyboard, toast dismissal, docs search, rewards and locked levels verified.`,
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
}
