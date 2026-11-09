# vAPI Chat

Simple chat website for the [vAPI Router](https://router.vapinetwork.ai/v1) — set your API key and chat with any model (default: `venice/deepseek-v4-flash`).

## How it works

- `public/index.html` — the chat UI. Your API key is stored only in your browser's localStorage, never on the server.
- `api/chat.js` — a Vercel serverless function that forwards your messages to the router with the key you provide per request. The key is never logged or stored server-side.

## Deploy (Vercel)

Import this repo in Vercel (Framework: Other, no build command, no env vars) and deploy.

## Use

1. Open the deployed site.
2. Paste your vAPI router key, pick a model, click **Save**.
3. Chat.
