# CLAUDE.md

hackerchat, a project for the Applied cryptography course. This repo holds the websocket server in `websocket/` (TypeScript, Docker image `matejbasic/websocket`) next to `auth/`, `frontend/`, `k8s/` and `terraform/`.

## Commands

From `websocket/`:

```bash
npm run build   # tsc
npm start       # node ./dist/index.js
npm run prod    # build, then start
```

## Deployment and domains

The websocket server runs on Railway, project `hackerchat`, service `websocket`. Since the domain migration of 2026-10-11 it has the custom domain chat-ws.matejbasic.com (Cloudflare zone `matejbasic.com`, DNS-only record). The old `websocket-production-1be1.up.railway.app` still serves directly, because Railway service domains cannot redirect.

The client is the hackerchat-next front end (Vercel project `hackerchat-tirp`, https://hackerchat.matejbasic.com; old hackerchat.vercel.app 301-redirects). It reaches this server at `wss://chat-ws.matejbasic.com/api/websocket/connect` through `NEXT_PUBLIC_WEBSOCKET_CONNECT`, baked in at build time.
