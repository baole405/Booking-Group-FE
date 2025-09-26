import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4200",
    specPattern: "src/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "src/support/e2e.ts",
    video: false,
    screenshotOnRunFailure: true,
  },
});
