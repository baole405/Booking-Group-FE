import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: __dirname,
  build: {
    outDir: "../../dist/apps/fe-react-web",
    emptyOutDir: true,
  },
});
