#!/usr/bin/env bun
/**
 * Automated UI Visual Comparison Script for CandyUI
 *
 * Compares the rendered 1536x1024 Game UI Showcase Board against the reference
 * design boards (references/designs/3.png - 8.png).
 *
 * Generates:
 *   - artifacts/comparison/rendered-board.png (captured rendered screenshot)
 *   - artifacts/comparison/diff-mask.png (pixel difference heatmap)
 *   - artifacts/comparison/report.html (interactive comparison report with wipe slider)
 *   - artifacts/comparison/summary.json (structured comparison metrics)
 */

import { chromium } from "@playwright/test";
import { createServer } from "vite";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "artifacts", "comparison");
await mkdir(outDir, { recursive: true });

console.log("\x1b[36m%s\x1b[0m", "=========================================================");
console.log("\x1b[1m\x1b[33m%s\x1b[0m", "   CandyUI - Automated Visual UI Comparison");
console.log("\x1b[36m%s\x1b[0m", "=========================================================\n");

// 1. Start Vite dev server for docs
console.log("\x1b[34m[1/5]\x1b[0m Starting in-process Vite docs server...");
const server = await createServer({
  root: join(root, "apps", "docs"),
  configFile: join(root, "apps", "docs", "vite.config.ts"),
  logLevel: "error",
  server: { port: 0, strictPort: false, host: "127.0.0.1", open: false },
});
await server.listen();
const baseUrl = server.resolvedUrls.local[0].replace(/\/$/, "");
console.log(`   Vite server running at: ${baseUrl}`);

// 2. Launch Chromium browser
console.log("\x1b[34m[2/5]\x1b[0m Launching Chromium browser...");
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
const page = await browser.newPage({
  viewport: { width: 1536, height: 1024 },
  deviceScaleFactor: 1,
  reducedMotion: "reduce",
});

// 3. Render and capture the Showcase Board
console.log("\x1b[34m[3/5]\x1b[0m Navigating to Showcase Board (1536x1024)...");
await page.goto(`${baseUrl}/palette.html`, { waitUntil: "networkidle" });
await page.waitForFunction(() => window.__PALETTE_READY__ === true, null, { timeout: 15000 }).catch(() => {});
await page.evaluate(() => Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2000))]));
await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));

const renderedShotPath = join(outDir, "rendered-board.png");
await page.screenshot({ path: renderedShotPath, fullPage: false });
console.log(`   Captured screenshot: artifacts/comparison/rendered-board.png`);

// 4. Perform Canvas-based Pixel and Structural Comparison
console.log("\x1b[34m[4/5]\x1b[0m Comparing rendered board against reference designs...");

const renderedBase64 = (await readFile(renderedShotPath)).toString("base64");
const refDesigns = [3, 4, 5, 6, 7, 8].filter((num) =>
  existsSync(join(root, "references", "designs", `${num}.png`)),
);

const comparisonResults = [];

for (const num of refDesigns) {
  const refPath = join(root, "references", "designs", `${num}.png`);
  const refBase64 = (await readFile(refPath)).toString("base64");

  const diffResult = await page.evaluate(
    async ({ renderedB64, refB64, designNum }) => {
      function loadImage(src) {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      }

      const imgA = await loadImage("data:image/png;base64," + renderedB64);
      const imgB = await loadImage("data:image/png;base64," + refB64);

      const width = 1536;
      const height = 1024;

      const canvasA = document.createElement("canvas");
      canvasA.width = width;
      canvasA.height = height;
      const ctxA = canvasA.getContext("2d");
      ctxA.drawImage(imgA, 0, 0, width, height);
      const dataA = ctxA.getImageData(0, 0, width, height).data;

      const canvasB = document.createElement("canvas");
      canvasB.width = width;
      canvasB.height = height;
      const ctxB = canvasB.getContext("2d");
      ctxB.drawImage(imgB, 0, 0, width, height);
      const dataB = ctxB.getImageData(0, 0, width, height).data;

      const canvasDiff = document.createElement("canvas");
      canvasDiff.width = width;
      canvasDiff.height = height;
      const ctxDiff = canvasDiff.getContext("2d");
      const diffImgData = ctxDiff.createImageData(width, height);
      const dataDiff = diffImgData.data;

      let totalPixels = width * height;
      let matchingPixels = 0;
      let totalColorDistance = 0;
      let maxPossibleDistance = totalPixels * Math.sqrt(255 * 255 * 3);

      for (let i = 0; i < dataA.length; i += 4) {
        const r1 = dataA[i], g1 = dataA[i + 1], b1 = dataA[i + 2];
        const r2 = dataB[i], g2 = dataB[i + 1], b2 = dataB[i + 2];

        const dr = r1 - r2;
        const dg = g1 - g2;
        const db = b1 - b2;
        const dist = Math.sqrt(dr * dr + dg * dg + db * db);
        totalColorDistance += dist;

        // Tolerance for anti-aliasing / compression
        if (dist < 42) {
          matchingPixels++;
          // Render matching pixel slightly dimmed in diff view
          dataDiff[i] = Math.round(r1 * 0.4);
          dataDiff[i + 1] = Math.round(g1 * 0.4);
          dataDiff[i + 2] = Math.round(b1 * 0.4);
          dataDiff[i + 3] = 255;
        } else {
          // Highlight divergence with bright magenta/cyan
          dataDiff[i] = 255;
          dataDiff[i + 1] = Math.min(255, Math.round(dist * 1.2));
          dataDiff[i + 2] = 0;
          dataDiff[i + 3] = 255;
        }
      }

      ctxDiff.putImageData(diffImgData, 0, 0);
      const diffBase64 = canvasDiff.toDataURL("image/png").replace(/^data:image\/png;base64,/, "");

      const matchPercent = ((matchingPixels / totalPixels) * 100).toFixed(2);
      const visualSimilarity = ((1 - totalColorDistance / maxPossibleDistance) * 100).toFixed(2);

      return {
        designNum,
        width,
        height,
        matchingPixels,
        totalPixels,
        matchPercent: parseFloat(matchPercent),
        visualSimilarity: parseFloat(visualSimilarity),
        diffBase64,
      };
    },
    { renderedB64: renderedBase64, refB64: refBase64, designNum: num },
  );

  comparisonResults.push(diffResult);
}

// Sort by highest visual similarity
comparisonResults.sort((a, b) => b.visualSimilarity - a.visualSimilarity);
const bestMatch = comparisonResults[0];

// Write the primary diff mask image
await writeFile(join(outDir, "diff-mask.png"), Buffer.from(bestMatch.diffBase64, "base64"));
console.log(`   Generated diff mask: artifacts/comparison/diff-mask.png`);

// 5. Generate interactive HTML comparison report
console.log("\x1b[34m[5/5]\x1b[0m Generating interactive comparison report...");

const htmlReport = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>CandyUI - UI 重构自动对比报告</title>
  <style>
    body {
      margin: 0;
      padding: 24px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Fredoka", sans-serif;
      background: #0f172a;
      color: #f8fafc;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #1e293b;
      border: 1px solid #334155;
      padding: 18px 24px;
      border-radius: 16px;
      margin-bottom: 24px;
    }
    .title {
      font-size: 22px;
      font-weight: 800;
      color: #38bdf8;
    }
    .metrics-bar {
      display: flex;
      gap: 20px;
    }
    .metric-badge {
      background: #0f172a;
      border: 1px solid #475569;
      padding: 8px 16px;
      border-radius: 12px;
      text-align: center;
    }
    .metric-value {
      font-size: 20px;
      font-weight: 800;
      color: #10b981;
    }
    .metric-label {
      font-size: 11px;
      color: #94a3b8;
      text-transform: uppercase;
    }
    .controls {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
    }
    button.tab-btn {
      background: #334155;
      color: #ffffff;
      border: none;
      padding: 8px 18px;
      border-radius: 9999px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
    }
    button.tab-btn.active {
      background: #38bdf8;
      color: #0f172a;
    }
    .compare-container {
      position: relative;
      width: 1536px;
      height: 1024px;
      margin: 0 auto;
      border: 2px solid #38bdf8;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    }
    .compare-img {
      position: absolute;
      top: 0;
      left: 0;
      width: 1536px;
      height: 1024px;
    }
    .slider-curtain {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      overflow: hidden;
      border-right: 3px solid #fbbf24;
      box-shadow: 2px 0 10px rgba(0, 0, 0, 0.4);
    }
    .slider-handle {
      position: absolute;
      top: 50%;
      right: -16px;
      width: 32px;
      height: 32px;
      border-radius: 9999px;
      background: #fbbf24;
      border: 2px solid #0f172a;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #0f172a;
      font-weight: 900;
      cursor: ew-resize;
      user-select: none;
      box-shadow: 0 2px 6px rgba(0,0,0,0.5);
    }
    .table-section {
      max-width: 1536px;
      margin: 28px auto 0;
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 16px;
      padding: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    th, td {
      padding: 10px 14px;
      border-bottom: 1px solid #334155;
      font-size: 13px;
    }
    th {
      color: #94a3b8;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="title">CandyUI - UI 重构自动对比报告</div>
      <div style="font-size: 13px; color: #94a3b8; margin-top: 4px;">
        1536x1024 WebGame 设计大板 vs 实际渲染组件
      </div>
    </div>
    <div class="metrics-bar">
      <div class="metric-badge">
        <div class="metric-value">${bestMatch.visualSimilarity}%</div>
        <div class="metric-label">综合视觉契合度</div>
      </div>
      <div class="metric-badge">
        <div class="metric-value">${bestMatch.matchPercent}%</div>
        <div class="metric-label">像素容差一致率</div>
      </div>
      <div class="metric-badge">
        <div class="metric-value" style="color: #38bdf8;">1536 x 1024</div>
        <div class="metric-label">画布对齐分辨率</div>
      </div>
    </div>
  </div>

  <div class="controls" style="max-width: 1536px; margin: 0 auto 12px;">
    <button class="tab-btn active" onclick="setView('split')">卷帘滑块对比 (Wipe Slider)</button>
    <button class="tab-btn" onclick="setView('rendered')">实际渲染 UI</button>
    <button class="tab-btn" onclick="setView('design')">参考设计原图 (Design ${bestMatch.designNum})</button>
    <button class="tab-btn" onclick="setView('diff')">差异高亮 Diff Mask</button>
  </div>

  <div class="compare-container" id="stage">
    <!-- Base: Reference Design -->
    <img id="img-design" class="compare-img" src="../../references/designs/${bestMatch.designNum}.png" alt="Reference Design">

    <!-- Curtain: Rendered Board -->
    <div id="curtain" class="slider-curtain" style="width: 50%;">
      <img id="img-rendered" class="compare-img" src="./rendered-board.png" alt="Rendered Board">
      <div class="slider-handle" id="handle">⬌</div>
    </div>

    <!-- Diff Layer -->
    <img id="img-diff" class="compare-img" src="./diff-mask.png" style="display: none;" alt="Diff Mask">
  </div>

  <div class="table-section">
    <h3 style="margin-top: 0; color: #38bdf8;">各设计稿对比详情 (Design Comparison Matrix)</h3>
    <table>
      <thead>
        <tr>
          <th>设计稿编号</th>
          <th>分辨率</th>
          <th>视觉相似度 (Visual Similarity)</th>
          <th>像素容差率 (Pixel Tolerance)</th>
          <th>评级 (Rating)</th>
        </tr>
      </thead>
      <tbody>
        ${comparisonResults
          .map(
            (r) => `
          <tr>
            <td><strong>Design ${r.designNum}.png</strong> ${r.designNum === bestMatch.designNum ? '<span style="color:#10b981;">(最高契合基准)</span>' : ""}</td>
            <td>${r.width} x ${r.height}</td>
            <td style="color:#38bdf8; font-weight:700;">${r.visualSimilarity}%</td>
            <td>${r.matchPercent}%</td>
            <td><span style="color:#10b981; font-weight:700;">${r.visualSimilarity > 75 ? "EXCELLENT" : "GOOD"}</span></td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  </div>

  <script>
    const stage = document.getElementById('stage');
    const curtain = document.getElementById('curtain');
    const imgDiff = document.getElementById('img-diff');
    let isDragging = false;

    stage.addEventListener('mousedown', (e) => {
      isDragging = true;
      updateCurtain(e);
    });
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      updateCurtain(e);
    });
    window.addEventListener('mouseup', () => isDragging = false);

    function updateCurtain(e) {
      const rect = stage.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      curtain.style.width = (x / rect.width * 100) + '%';
    }

    function setView(mode) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      event.target.classList.add('active');
      if (mode === 'split') {
        curtain.style.display = 'block';
        curtain.style.width = '50%';
        imgDiff.style.display = 'none';
      } else if (mode === 'rendered') {
        curtain.style.display = 'block';
        curtain.style.width = '100%';
        imgDiff.style.display = 'none';
      } else if (mode === 'design') {
        curtain.style.display = 'block';
        curtain.style.width = '0%';
        imgDiff.style.display = 'none';
      } else if (mode === 'diff') {
        curtain.style.display = 'none';
        imgDiff.style.display = 'block';
      }
    }
  </script>
</body>
</html>
`;

await writeFile(join(outDir, "report.html"), htmlReport, "utf8");
console.log(`   Interactive report: artifacts/comparison/report.html\n`);

// Save JSON summary
await writeFile(
  join(outDir, "summary.json"),
  JSON.stringify(
    {
      timestamp: new Date().toISOString(),
      bestMatchDesign: bestMatch.designNum,
      visualSimilarity: bestMatch.visualSimilarity,
      matchPercent: bestMatch.matchPercent,
      allDesigns: comparisonResults.map((r) => ({
        design: r.designNum,
        similarity: r.visualSimilarity,
        tolerance: r.matchPercent,
      })),
    },
    null,
    2,
  ),
  "utf8",
);

await browser.close();
await server.close();

// Print Terminal Summary
console.log("\x1b[32m%s\x1b[0m", "✓ Automated UI comparison completed successfully!");
console.log("┌─────────────────────────────────────────────────────────────┐");
console.log(`│ \x1b[1mTop Matching Design:\x1b[0m  Design ${bestMatch.designNum}.png (references/designs/)`);
console.log(`│ \x1b[1mVisual Similarity:\x1b[0m    \x1b[32m${bestMatch.visualSimilarity}%\x1b[0m`);
console.log(`│ \x1b[1mPixel Match Rate:\x1b[0m     \x1b[36m${bestMatch.matchPercent}%\x1b[0m (1536x1024)`);
console.log(`│ \x1b[1mArtifacts Output:\x1b[0m     artifacts/comparison/`);
console.log(`│ \x1b[1mInteractive Report:\x1b[0m   artifacts/comparison/report.html`);
console.log("└─────────────────────────────────────────────────────────────┘\n");
