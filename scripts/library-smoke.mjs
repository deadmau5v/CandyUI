import assert from "node:assert/strict";
import { createRequire } from "node:module";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as library from "../dist/candy-ui.js";

const render = (component, props, children) =>
  renderToStaticMarkup(React.createElement(component, props, children));
const button = render(library.CandyButton, {}, "Play");
assert.match(button, /candy-btn-rounded/);
assert.match(button, /candy-btn-blue/);
assert.match(button, /type="button"/);
assert.match(render(library.CandyButton, { shape: "pill" }, "Play"), /candy-btn-pill/);
for (const variant of ["cyan", "red", "gray"]) {
  assert.match(render(library.CandyButton, { variant }, "Play"), new RegExp(`candy-btn-${variant}`));
}
const pending = render(library.CandyButton, { loading: true, loadingLabel: "Loading" }, "Play");
assert.match(pending, /disabled=""/);
assert.match(pending, /aria-busy="true"/);
assert.match(pending, /candy-btn-spinner/);
assert.match(pending, /Loading/);
assert.match(
  render(library.CandyButton, { shape: "rounded", disabled: true }, "Later"),
  /disabled=""/,
);
assert.doesNotMatch(
  render(library.CandyButton, { shape: "rounded" }, "Later"),
  /candy-btn-pill/,
);
assert.match(
  render(library.CandyIconButton, {
    "aria-label": "Close",
    icon: React.createElement("span", null, "×"),
  }),
  /aria-label="Close"/,
);
assert.match(
  render(library.CandySwitch, {
    "aria-label": "Sound",
    checked: true,
    onChange() {},
  }),
  /aria-label="Sound"/,
);
assert.match(
  render(library.CandySlider, {
    "aria-label": "Volume",
    value: 40,
    min: 0,
    max: 100,
    onChange() {},
  }),
  /aria-valuenow="40"/,
);
assert.match(
  render(library.CandyStepper, {
    label: "Round duration",
    value: 180,
    fullWidth: true,
  }),
  /candy-stepper-full-width/,
);
assert.match(
  render(library.CandyStepper, {
    label: "Round duration",
    value: 180,
  }),
  /candy-stepper-field/,
);
assert.doesNotMatch(
  render(library.CandyStepper, {
    label: "Round duration",
    value: 180,
  }),
  /candy-stepper-full-width/,
);
assert.match(
  render(library.CandyProgress, { value: 150, max: 100 }),
  /aria-valuenow="100"/,
);
assert.match(
  render(library.CandyProgress, { value: 10, max: 0 }),
  /aria-valuenow="0"/,
);
assert.doesNotMatch(
  render(library.CandyPanel, {}, "Panel"),
  /candy-panel-rivet/,
);
assert.equal(
  render(library.CandyModal, {
    isOpen: false,
    onClose() {},
    children: "Dialog",
  }),
  "",
);
const require = createRequire(import.meta.url);
const commonjs = require("../dist/candy-ui.cjs");
assert.equal(typeof commonjs.CandyProvider, "function");
assert.equal(typeof commonjs.CandySlider, "function");
console.log(
  "PASS: built ESM/CJS imports, button shapes/native props, accessible controls, clamped progress, panel defaults, closed modal.",
);
