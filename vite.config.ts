import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";

export default defineConfig(({ command, mode }) => {
  // Inline VITE_* env vars so they are available in both client and SSR bundles.
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const define: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    define[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  return {
    define,
    // Use Lightning CSS in dev and build so the preview matches the built output
    // (PostCSS-only dev can mask build-time CSS transforms).
    css: { transformer: "lightningcss" },
    build: {
      // This is an SSR app: the main client entry legitimately bundles the
      // framework runtime (React, TanStack Router/Query) together with
      // framer-motion. Splitting those into separate chunks (React especially)
      // risks client/SSR duplication and load waterfalls, so we set an explicit,
      // intentional chunk-size limit rather than force manual chunks. This keeps
      // `npm run build` free of the advisory "chunks larger than 500 kB" warning.
      chunkSizeWarningLimit: 900,
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    plugins: [
      tailwindcss(),
      tanstackStart({
        importProtection: {
          behavior: "error",
          client: {
            files: ["**/server/**"],
            specifiers: ["server-only"],
          },
        },
        // Route the bundled server entry through src/server.ts (SSR error wrapper).
        server: { entry: "server" },
      }),
      // Nitro emits the standalone Node server (.output/server/index.mjs) on build.
      ...(command === "build" ? [nitro({ preset: "node-server" })] : []),
      viteReact(),
    ],
    server: {
      host: "0.0.0.0",
      port: 5000,
      allowedHosts: true,
      watch: {
        ignored: ["**/node_modules/**", "**/.git/**", "**/.cache/**", "**/.output/**"],
        awaitWriteFinish: { stabilityThreshold: 1000, pollInterval: 100 },
      },
    },
  };
});
