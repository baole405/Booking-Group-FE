import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const workspaceRoot = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(workspaceRoot, "apps/fe-react-web");

export default defineConfig({
  root: appRoot,
  resolve: {
    alias: {
      "@": path.resolve(appRoot, "src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: [path.resolve(workspaceRoot, "vitest.setup.ts")],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    reporters: ["default"],
    css: true,
    coverage: {
      reporter: ["text", "lcov"],
      reportsDirectory: path.resolve(workspaceRoot, "coverage/apps/fe-react-web"),
    },
  },
});
