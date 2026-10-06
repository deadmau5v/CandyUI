import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "candy-ui": resolve(__dirname, "../../src/lib/index.ts"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    open: false,
    // Atomic edits create transient files; watching them on Windows can throw EBUSY.
    watch: { ignored: ["**/*.tmpdir/**", "**/*.tmp"] },
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
  },
});
