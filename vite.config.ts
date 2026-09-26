import funstackStatic from "@funstack/static";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    funstackStatic({
      ssr: true,
      fsRoutes: {
        dir: "./src/pages",
        root: "./src/root.tsx",
        adapter: "@funstack/static/fs-routes/next-adapter",
      },
    }),
    react(),
    tailwindcss(),
  ],
});
