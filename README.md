# SquashCode Studio Frontend

Vite, React, and TypeScript frontend for SquashCode Creative Studio.

## Local Setup

```bash
npm install
cp .env.example .env
npm run dev
```

## Scripts

- `npm run dev` starts Vite locally.
- `npm run lint` runs ESLint.
- `npm run build` type-checks and builds the static app into `dist/`.
- `npm run preview` serves the built app locally.

## Render

This repository includes `render.yaml` so Render creates a Static Site with:

- Build command: `npm ci && npm run build`
- Publish directory: `dist`
- Rewrite rule: `/*` to `/index.html` for React Router

The Render config sets:

- `VITE_API_URL=https://squashcode-studio-backend.onrender.com/api`

For local development, keep `.env` pointed at your local backend:

```env
VITE_API_URL=http://localhost:4000/api
```
