# Base44 Dev Environment

## Stack
- Vite 6 + React 19 + TypeScript + Tailwind v4 (`@tailwindcss/vite`)
- Package manager: **bun** (repo ships `bun.lock`). Dependencies install at container startup via `bun install`.
- Pure client-side app — no backend, no database, no external API calls at runtime.

## Running
```
docker compose -f docker-compose.base44.yml up -d
```
- Web entry point on host port **3000** (`vite --port=3000 --host=0.0.0.0`).
- Source is bind-mounted at `/app`; HMR is enabled (`DISABLE_HMR=false`), so edits hot-reload without a rebuild.
- `node_modules` lives in a named volume so installs persist across restarts.

## Notes / Quirks
- `vite.config.ts` sets `server.host: true` and `allowedHosts: true` so the preview's external hostname is accepted (Vite blocks unknown hosts by default).
- `.env.example` references `GEMINI_API_KEY` / `APP_URL`, but **no code reads them** — the app runs without any secrets. No `set_secrets` needed.
- Healthcheck: `wget --spider http://localhost:3000/`.

## Verify
- `curl -sf -H "Host: external-preview.example.com" http://localhost:3000/` returns the HTML document.
- `/src/main.tsx` resolves to live (un-hashed) source, confirming the dev server (not a prebuilt bundle) is serving.
