# AGENTS.md

Guidance for coding agents working in this repository.

## Project Overview

This is a small Next.js pages-router app that displays FIFA World Cup 2022 fixtures from a public JSON feed. Keep changes simple and local to the existing structure unless the user asks for a larger refactor.

## Commands

- `npm install` installs dependencies.
- `npm run dev` starts the local app at `http://localhost:3000`.
- `npm run build` verifies the production build.
- `npm run lint` runs Next.js linting.

## Code Conventions

- Use the existing `pages/` router. Do not migrate to the `app/` router unless explicitly requested.
- Keep page-level data loading in `getServerSideProps` when matching current behavior.
- Use Material UI components for UI changes because the current pages already use MUI.
- Use `moment` for date formatting unless replacing date handling is part of the requested work.
- Keep public images in `public/assets/`.
- Preserve the existing routes: `/`, `/teams`, and `/fixtures`.

## Safety Notes

- The fixture data comes from football-data.org: `https://api.football-data.org/v4`.
- Avoid hardcoding new fixture data unless the user asks for a static/offline version.
- Do not remove the navbar from `_app.js` without replacing global navigation.
- Before deleting files or components, search for imports and route usage.

## Verification

For source changes, run the smallest useful check:

```bash
npm run lint
```

For page, dependency, or build-related changes, also run:

```bash
npm run build
```
