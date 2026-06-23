import {
  Avatar,
  Box,
  Chip,
  Typography,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Link from "next/link";
import SEO from "../components/SEO";
import PageState from "../components/PageState";
import styles from "../styles/Home.module.css";
import { getWorldCupMatches } from "../lib/footballData";
import {
  formatMatchDateTime,
  formatMatchScore,
  formatMatchStage,
  formatMatchStatus,
} from "../lib/formatters";

function StatusChip({ status }) {
  const label = formatMatchStatus(status);
  const color =
    label === "Live"
      ? "var(--color-success)"
      : label === "Finished"
      ? "var(--color-gold)"
      : "var(--color-info)";

  return (
    <Chip
      size="small"
      label={label}
      sx={{
        color,
        borderColor: color,
        background: "rgba(232, 237, 245, 0.05)",
        fontWeight: 700,
      }}
      variant="outlined"
    />
  );
}

function MatchCard({ match }) {
  const card = (
    <article className="match-card">
        <span className="eyebrow">
          {formatMatchStage(match.group || match.stage)}
        </span>
        <div className="match-teams">
          <div className="match-team">
            {match.homeTeamCrest && (
              <Avatar
                src={match.homeTeamCrest}
                alt={`${match.homeTeam || "Home team"} flag`}
                className="match-team-flag"
                sx={{ background: "rgba(232, 237, 245, 0.9)" }}
              />
            )}
            <span>{match.homeTeam || "TBD"}</span>
          </div>
          <span className="match-versus">VS</span>
          <div className="match-team">
            {match.awayTeamCrest && (
              <Avatar
                src={match.awayTeamCrest}
                alt={`${match.awayTeam || "Away team"} flag`}
                className="match-team-flag"
                sx={{ background: "rgba(232, 237, 245, 0.9)" }}
              />
            )}
            <span>{match.awayTeam || "TBD"}</span>
          </div>
        </div>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <StatusChip status={match.status} />
          <Typography className="score-text">
            {formatMatchScore(match.homeScore, match.awayScore)}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <AccessTimeIcon sx={{ color: "var(--color-gold)", fontSize: 18 }} />
          <Typography className="muted-text">
            {formatMatchDateTime(match.utcDate)}
          </Typography>
        </Box>
    </article>
  );

  return match.id ? (
    <Link
      href={`/matches/${match.id}`}
      className="match-card-link"
      aria-label={`${match.homeTeam || "Home team"} vs ${
        match.awayTeam || "Away team"
      } match details`}
    >
      {card}
    </Link>
  ) : (
    card
  );
}

function MatchSection({ title, matches, emptyMessage }) {
  return (
    <section>
      <h2 className="section-title">{title}</h2>
      {matches.length === 0 ? (
        <PageState
          title={emptyMessage}
          message="Match information will appear here when available."
        />
      ) : (
        <div className="match-grid">
          {matches.map((match, index) => (
            <MatchCard
              key={match.id || `${match.homeTeam}-${match.awayTeam}-${index}`}
              match={match}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default function Home({ fixtures, dataError }) {
  const liveMatches = fixtures.filter((fixture) =>
    ["LIVE", "IN_PLAY", "PAUSED"].includes(fixture.status)
  );
  const upcomingStatuses = ["SCHEDULED", "TIMED"];
  const upcomingMatches = fixtures
    .filter((fixture) => upcomingStatuses.includes(fixture.status))
    .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate))
    .slice(0, 5);
  const recentResults = fixtures
    .filter((fixture) => fixture.status === "FINISHED")
    .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate))
    .slice(0, 5);
  return (
    <>
      <SEO
        title="World Cup Hub — Fixtures, Results, Teams & Standings"
        description="Track World Cup fixtures, live match status, recent results, teams, standings, and top scorers in one clean football dashboard."
      />

      <main className="page-shell">
        <section
          className="hero-card image-banner"
          style={{ "--banner-image": "url('/assets/fifa.jpg')" }}
        >
          <span className="eyebrow">Football-data.org dashboard</span>
          <h1 className="page-title">World Cup Hub</h1>
          <p className="page-subtitle">
            Track live matches, upcoming fixtures, recent results, standings,
            and top scorers.
          </p>
        </section>

        {dataError ? (
          <PageState
            type="error"
            title="Matches could not be loaded."
            message={dataError}
            actionLabel="Try again"
            onAction={() => window.location.reload()}
          />
        ) : (
          <>
            <MatchSection
              title="Live Matches"
              matches={liveMatches}
              emptyMessage="No live matches right now."
            />
            <MatchSection
              title="Recent Results"
              matches={recentResults}
              emptyMessage="No recent results yet."
            />
            <MatchSection
              title="Upcoming Matches"
              matches={upcomingMatches}
              emptyMessage="No upcoming matches right now."
            />
          </>
        )}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://www.linkedin.com/in/mrzahidxy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Built by <span>Zahid Hasan</span> with football-data.org
        </a>
      </footer>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const fixtures = await getWorldCupMatches();

    return {
      props: { fixtures, dataError: null },
    };
  } catch (error) {
    console.error(error);

    return {
      props: {
        fixtures: [],
        dataError: "Please check your connection and try again.",
      },
    };
  }
}
