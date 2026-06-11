import {
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import Head from "next/head";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
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
  return (
    <article className="match-card">
      <span className="eyebrow">
        {formatMatchStage(match.group || match.stage)}
      </span>
      <h3 className="match-title">
        {match.homeTeam || "TBD"} VS {match.awayTeam || "TBD"}
      </h3>
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
}

function MatchSection({ title, matches, emptyMessage }) {
  return (
    <section>
      <h2 className="section-title">{title}</h2>
      {matches.length === 0 ? (
        <div className="empty-state">
          <strong>{emptyMessage}</strong>
          Match information will appear here when available.
        </div>
      ) : (
        <div className="match-grid">
          {matches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function Home({ fixtures }) {
  const liveMatches = fixtures.filter((fixture) =>
    ["LIVE", "IN_PLAY", "PAUSED"].includes(fixture.status)
  );
  const upcomingMatches = fixtures
    .filter((fixture) => fixture.status === "SCHEDULED")
    .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate))
    .slice(0, 5);
  const recentResults = fixtures
    .filter((fixture) => fixture.status === "FINISHED")
    .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate))
    .slice(0, 5);
  const statCards = [
    { label: "Total Matches", value: fixtures.length },
    { label: "Live", value: liveMatches.length },
    { label: "Upcoming", value: upcomingMatches.length },
    {
      label: "Finished",
      value: fixtures.filter((fixture) => fixture.status === "FINISHED").length,
    },
  ];

  return (
    <>
      <Head>
        <title>World Cup Hub</title>
        <meta
          name="description"
          content="World Cup fixtures, results, standings, and scorers"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="page-shell">
        <section
          className="hero-card image-banner"
          style={{ "--banner-image": "url('/assets/fifa.jpg')" }}
        >
          <span className="eyebrow">Football-data.org dashboard</span>
          <h1 className="page-title">World Cup 2026 Fixtures & Results</h1>
          <p className="page-subtitle">
            Track live matches, upcoming fixtures, recent results, standings,
            and top scorers.
          </p>

          <div className="stats-grid">
            {statCards.map((stat) => (
              <Card className="card stat-card" key={stat.label}>
                <CardContent sx={{ padding: 0, "&:last-child": { paddingBottom: 0 } }}>
                  <Typography className="muted-text">{stat.label}</Typography>
                  <Typography
                    sx={{
                      color: "var(--color-text)",
                      fontSize: "2rem",
                      fontWeight: 900,
                    }}
                  >
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <MatchSection
          title="Live Matches"
          matches={liveMatches}
          emptyMessage="No live matches right now."
        />
        <MatchSection
          title="Upcoming Matches"
          matches={upcomingMatches}
          emptyMessage="No upcoming matches right now."
        />
        <MatchSection
          title="Recent Results"
          matches={recentResults}
          emptyMessage="No recent results yet."
        />
      </main>

      <footer className={styles.footer}>
        <a
          href="https://www.linkedin.com/in/mrzahidxy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by <span>Zahid Hasan</span>
        </a>
      </footer>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const fixtures = await getWorldCupMatches();

    return {
      props: { fixtures },
    };
  } catch (error) {
    console.error(error);

    return {
      props: { fixtures: [] },
    };
  }
}
