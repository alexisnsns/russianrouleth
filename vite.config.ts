import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

export default defineConfig({
  plugins: [
    NodeGlobalsPolyfillPlugin({
      buffer: true,
    }),
    react(),
    viteTsconfigPaths(),
    svgr({
      include: "**/*.svg?react",
    }),
  ],
});
