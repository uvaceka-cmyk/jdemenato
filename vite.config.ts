import vinext from "vinext";
import { defineConfig } from "vite";

// macOS Seatbelt blocks FSEvents, so sandboxed environments need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

const localBindingConfig = {
  main: "./worker/index.ts",
  compatibility_flags: ["nodejs_compat"],
  d1_databases: [
    {
      binding: "DB",
      database_name: "jdemnato-d1",
      // Lokální vývoj (`pnpm dev` / `wrangler dev`) používá tuto emulovanou D1 automaticky.
      // Skutečné ID produkční databáze se nastavuje ve wrangler.jsonc po `wrangler d1 create`.
      database_id: "local-dev",
    },
  ],
};

export default defineConfig(async () => {
  // Wrangler a Miniflare state necháváme lokální pro projekt.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  const { cloudflare } = await import("@cloudflare/vite-plugin");

  return {
    server: isCodexSeatbeltSandbox
      ? { watch: { useFsEvents: false, usePolling: true } }
      : undefined,
    plugins: [
      vinext(),
      cloudflare({
        viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
        config: localBindingConfig,
      }),
    ],
  };
});
