# World Cup Hub

A responsive World Cup dashboard built with Next.js and football-data.org.

## Features

- Fixtures and results.
- Live, upcoming, and recent match sections.
- Teams and team details.
- Squad/player table.
- Group standings.
- Top scorers.
- Shared navigation with route progress loading.
- Match, team, standings, and scorer data loaded from football-data.org.
- Responsive dark dashboard UI.

## Available Pages

- Home: live, upcoming, and recent World Cup matches
- Fixtures: all matches with status and stage filters
- Teams: official teams, team profile, coach, squad/player list, and team-wise fixtures
- Standings: group standings
- Scorers: top scorers

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
FOOTBALL_DATA_API_TOKEN=your_api_token_here
```

Get the token from football-data.org, add it to `.env.local`, and restart the dev server after adding it.

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
  Navbar.js            # Main navigation
pages/
  _app.js              # Global app wrapper, navbar, route progress
  index.js             # Home page with live, upcoming, and recent matches
  fixtures.js          # Full fixtures and results table
  teams.js             # Team selector and team-specific fixtures
  standings.js         # World Cup standings
  scorers.js           # World Cup top scorers
public/assets/         # Optional static image assets
styles/                # Global and module styles
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

`FOOTBALL_DATA_API_TOKEN` is required in `.env.local`. If the API is unavailable, pages show empty states instead of crashing.

## Deployment

Build the app before deployment:

```bash
npm run build
```

This project can be deployed to any host that supports Next.js applications, including Vercel.
