import path from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./apps/fe-react-web/src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["apps/**/src/**/*.test.{ts,tsx}"],
    coverage: {
      reporter: ["text", "lcov"],
      reportsDirectory: "./coverage",
    },
  },
});
