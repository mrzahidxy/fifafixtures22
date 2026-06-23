# World Cup Hub

A responsive World Cup dashboard built with Next.js and football-data.org.

## Features

- View World Cup fixtures, live matches, upcoming matches, and recent results.
- Filter fixtures by match status and tournament stage.
- Explore teams with profiles, squads, fixtures, and recent results.
- Save a favourite team and see its matches highlighted.
- View group standings and top scorers.
- Switch between Dark and Normal theme modes.
- Use a responsive dashboard across desktop and mobile.

## Available Pages

- Home: live, upcoming, and recent World Cup matches
- Fixtures: all matches with flags, status, result, and stage filters
- Teams: team selector, favourite team action, team profile, coach, squad, fixtures, and recent results
- Standings: group standings
- Scorers: top scorers with team crests

## Tech Stack

- Next.js 13
- React 18
- Material UI
- Moment.js
- NProgress

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Environment Variables

Required environment variable:

```bash
FOOTBALL_DATA_API_KEY=your_api_key_here
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Get the token from football-data.org, add it to `.env.local`, and restart the dev server after adding it.
Set `NEXT_PUBLIC_SITE_URL` to the deployed site URL so LinkedIn, Facebook, and other social previews can fetch the card image reliably.

## Scripts

```bash
npm run dev      # Start the local development server
npm run build    # Build the production app
npm run start    # Start the production server after build
npm run lint     # Run Next.js linting
```

## Project Structure

```text
components/
  Navbar.js            # Main navigation and theme toggle
  PreferredTeamContext.js
                       # Favourite team localStorage state
  ThemeContext.js      # Dark/Normal theme state
pages/
  _app.js              # Global providers, navbar, route progress
  index.js             # Home page with live, upcoming, and recent matches
  fixtures.js          # Full fixtures and results table
  teams.js             # Team selector, favourite team, details, fixtures
  standings.js         # World Cup standings
  scorers.js           # World Cup top scorers
public/assets/         # Optional static image assets
styles/                # Global and module styles
.github/workflows/     # Vercel deployment workflow
```

## Data Source

The app fetches data server-side in each page using `getServerSideProps`. Phase 3 uses football-data.org endpoints for matches, teams, standings, and scorers:

## API Endpoints Used

```text
/competitions/WC/matches
/competitions/WC/teams
/teams/{teamId}
/competitions/WC/standings
/competitions/WC/scorers
```

Base URL: `https://api.football-data.org/v4`

`FOOTBALL_DATA_API_KEY` is required in `.env.local`. If the API is unavailable, pages show empty states instead of crashing.

## Deployment

Build the app before deployment:

```bash
npm run build
```

This project can be deployed to any host that supports Next.js applications, including Vercel.

The included GitHub Actions workflow deploys preview builds for pull requests and production builds for pushes to `main` or `master`. Add these repository secrets before using it:

```text
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```
