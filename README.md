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

## Netlify

This repository includes `netlify.toml` so Netlify builds the static app with:

- Build command: `npm ci && npm run build`
- Publish directory: `dist`
- Rewrite rule: `/*` to `/index.html` for React Router

The Netlify config sets:

- `VITE_API_URL=https://squashcode-studio-backend.onrender.com/api`
- `VITE_AUTH_REDIRECT_URL=https://squashcode-studio.netlify.app/creative-generator`

The repository also keeps `render.yaml` updated for static-site deployments on Render.

## Supabase Auth Redirects

In Supabase Dashboard, set Authentication URL Configuration to:

- Site URL: `https://squashcode-studio.netlify.app`
- Redirect URLs:
  - `https://squashcode-studio.netlify.app/creative-generator`
  - `https://squashcode-studio.netlify.app/*`
  - `http://localhost:5173/creative-generator`

If the Supabase Site URL is left as `http://localhost:3000`, email confirmation links can redirect there before the app receives the session.

For local development, keep `.env` pointed at your local backend:

```env
VITE_API_URL=http://localhost:4000/api
VITE_AUTH_REDIRECT_URL=http://localhost:5173/creative-generator
```
