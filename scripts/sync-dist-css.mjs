import fs from "node:fs";
import path from "node:path";

function resolveImports(filePath, seen = new Set()) {
  const absolutePath = path.resolve(filePath);
  if (seen.has(absolutePath)) return "";
  seen.add(absolutePath);

  const dir = path.dirname(absolutePath);
  const content = fs.readFileSync(absolutePath, "utf8");

  return content.replace(
    /@import\s+["']([^"']+)["'];/g,
    (match, importPath) => {
      // Keep external URL imports like Google Fonts
      if (
        importPath.startsWith("http://") ||
        importPath.startsWith("https://")
      ) {
        return match;
      }
      const resolvedChild = path.resolve(dir, importPath);
      if (fs.existsSync(resolvedChild)) {
        return resolveImports(resolvedChild, seen);
      }
      return match;
    },
  );
}

function minifyCss(css) {
  // Extract external @import rules to the very top
  const externalImports = [];
  let strippedCss = css.replace(
    /@import\s+["'](https?:\/\/[^"']+)["'];/g,
    (match) => {
      if (!externalImports.includes(match)) {
        externalImports.push(match);
      }
      return "";
    },
  );

  const minified = strippedCss
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>+~])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();

  return (
    (externalImports.length ? externalImports.join("") + "\n" : "") + minified
  );
}

const candyCombined = resolveImports("src/lib/styles/candy.css");
const bundledCss = minifyCss(candyCombined);
fs.writeFileSync("dist/candy-ui.css", bundledCss, "utf8");
console.log("dist/candy-ui.css synced, length:", bundledCss.length);

const docsCssPath = "apps/docs/dist/assets/index-CwIAXgTi.css";
if (fs.existsSync(docsCssPath)) {
  const docsOwnCss = fs.readFileSync("apps/docs/src/styles/docs.css", "utf8");
  const showHeroCss = fs.readFileSync(
    "apps/docs/src/styles/show-hero.css",
    "utf8",
  );
  const fullDocsCss = minifyCss(
    candyCombined + "\n" + docsOwnCss + "\n" + showHeroCss,
  );
  fs.writeFileSync(docsCssPath, fullDocsCss, "utf8");
  console.log(docsCssPath, "synced, length:", fullDocsCss.length);
}
