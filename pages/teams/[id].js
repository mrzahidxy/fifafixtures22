import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SEO from "../../components/SEO";
import PageState from "../../components/PageState";
import { usePreferredTeam } from "../../components/PreferredTeamContext";
import {
  formatMatchDateTime,
  formatMatchScore,
  formatMatchStage,
  formatMatchStatus,
} from "../../lib/formatters";

const NOT_AVAILABLE = "Not available";
const upcomingStatuses = ["SCHEDULED", "TIMED"];

function displayValue(value) {
  return value === null || value === undefined || value === ""
    ? NOT_AVAILABLE
    : value;
}

function TeamMatchCard({ match }) {
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
              alt={`${match.homeTeam || "Home team"} crest`}
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
              alt={`${match.awayTeam || "Away team"} crest`}
              className="match-team-flag"
              sx={{ background: "rgba(232, 237, 245, 0.9)" }}
            />
          )}
          <span>{match.awayTeam || "TBD"}</span>
        </div>
      </div>
      <Box sx={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <Chip
          size="small"
          label={formatMatchStatus(match.status)}
          sx={{
            color: "var(--color-gold)",
            borderColor: "var(--color-gold)",
            fontWeight: 700,
          }}
          variant="outlined"
        />
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
      {!matches.length ? (
        <PageState
          title={emptyMessage}
          message="Match information will appear here when available."
        />
      ) : (
        <div className="match-grid">
          {matches.map((match, index) => (
            <TeamMatchCard
              key={match.id || `${match.homeTeam}-${match.awayTeam}-${index}`}
              match={match}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function CompetitionList({ competitions }) {
  return (
    <Paper className="card match-detail-panel" elevation={0}>
      <h2 className="section-title match-detail-section-title">
        Competitions
      </h2>
      {!competitions?.length ? (
        <PageState
          title="No competition data available."
          message="Competition information was not included for this team."
        />
      ) : (
        <div className="person-competition-grid">
          {competitions.map((competition, index) => (
            <article
              className="person-competition-card"
              key={`${competition.id || competition.code || "competition"}-${index}`}
            >
              {competition.emblem && (
                <Avatar
                  src={competition.emblem}
                  alt={`${competition.name || "Competition"} emblem`}
                  className="person-competition-emblem"
                  sx={{ background: "rgba(232, 237, 245, 0.9)" }}
                />
              )}
              <Box>
                <Typography className="match-title">
                  {displayValue(competition.name)}
                </Typography>
                <Typography className="muted-text">
                  {[competition.code, competition.type]
                    .filter(Boolean)
                    .join(" · ") || NOT_AVAILABLE}
                </Typography>
              </Box>
            </article>
          ))}
        </div>
      )}
    </Paper>
  );
}

export default function TeamDetails() {
  const router = useRouter();
  const { preferredTeam, setPreferredTeam } = usePreferredTeam();
  const [team, setTeam] = useState(null);
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const rawId = router.query.id;
  const teamId = Array.isArray(rawId) ? rawId[0] : rawId;

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (!teamId || !/^[1-9]\d*$/.test(teamId)) {
      setError("A valid positive team ID is required.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadTeam() {
      setLoading(true);
      setError("");
      setNotFound(false);
      setTeam(null);

      try {
        const response = await fetch(`/api/teams/${teamId}`, {
          signal: controller.signal,
        });
        const data = await response.json().catch(() => null);

        if (response.status === 404) {
          setNotFound(true);
          return;
        }

        if (!response.ok) {
          throw new Error(data?.error || "Unable to load team details.");
        }

        setTeam(data?.team || null);
        setFixtures(Array.isArray(data?.fixtures) ? data.fixtures : []);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message || "Unable to load team details.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadTeam();

    return () => controller.abort();
  }, [router.isReady, teamId]);

  useEffect(() => {
    if (loading || !team || typeof window === "undefined") {
      return;
    }

    const sectionId = window.location.hash.slice(1);

    if (!["squad", "matches"].includes(sectionId)) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [loading, router.asPath, team]);

  const teamMatches = useMemo(
    () =>
      fixtures.filter(
        (match) =>
          String(match.homeTeamId) === String(team?.id) ||
          String(match.awayTeamId) === String(team?.id) ||
          match.homeTeam === team?.name ||
          match.awayTeam === team?.name
      ),
    [fixtures, team]
  );
  const upcomingMatches = teamMatches
    .filter((match) => upcomingStatuses.includes(match.status))
    .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate));
  const recentMatches = teamMatches
    .filter((match) => match.status === "FINISHED")
    .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate))
    .slice(0, 5);
  const isPreferred = String(preferredTeam?.id) === String(team?.id);

  return (
    <>
      <SEO
        title={
          team?.name
            ? `${team.name} Team Details — World Cup Hub`
            : "Team Details — World Cup Hub"
        }
        description="View team overview, coach, squad, competitions, and World Cup matches."
      />

      <main className="page-shell">
        <Link href="/teams" className="back-link">
          ← Back to Teams
        </Link>

        {loading ? (
          <PageState
            type="loading"
            title="Loading team details..."
            message="Fetching the latest available team information."
          />
        ) : notFound ? (
          <PageState
            type="not-found"
            title="Team not found."
            message="Check the team link or return to the teams page."
            actionLabel="View teams"
            actionHref="/teams"
          />
        ) : error ? (
          <PageState
            type="error"
            title="Team details could not be loaded."
            message={error}
            actionLabel="Try again"
            onAction={() => window.location.reload()}
          />
        ) : !team ? (
          <PageState
            title="No team details available."
            message="Football-Data did not return information for this team."
          />
        ) : (
          <>
            <header className="page-header team-detail-header">
              <Box className="team-detail-heading">
                {team.crest && (
                  <Avatar
                    src={team.crest}
                    alt={`${team.name || "Team"} crest`}
                    className="team-detail-page-crest"
                    sx={{ background: "rgba(232, 237, 245, 0.9)" }}
                  />
                )}
                <Box sx={{ minWidth: 0 }}>
                  <span className="eyebrow">
                    {displayValue(team.tla)}
                  </span>
                  <h1 className="page-title">{displayValue(team.name)}</h1>
                  <Typography className="page-subtitle">
                    {[team.area?.name, team.venue].filter(Boolean).join(" · ") ||
                      NOT_AVAILABLE}
                  </Typography>
                </Box>
                <Button
                  startIcon={<StarIcon />}
                  variant="outlined"
                  disabled={isPreferred}
                  onClick={() =>
                    setPreferredTeam({
                      id: team.id,
                      name: team.name,
                      shortName: team.shortName,
                      crest: team.crest,
                    })
                  }
                  aria-label={
                    isPreferred
                      ? `${team.name || "This team"} is your favourite team`
                      : `Set ${team.name || "this team"} as favourite`
                  }
                  sx={{
                    marginLeft: { md: "auto" },
                    color: "var(--color-gold)",
                    borderColor: "var(--color-gold)",
                    fontWeight: 800,
                    "&.Mui-disabled": {
                      color: "var(--color-gold)",
                      borderColor: "rgba(214, 168, 79, 0.5)",
                      background: "rgba(214, 168, 79, 0.08)",
                      opacity: 1,
                    },
                  }}
                >
                  {isPreferred ? "Favourite team" : "Set favourite"}
                </Button>
              </Box>
            </header>

            <div className="match-detail-section-stack">
              <Paper className="card match-detail-panel" elevation={0}>
                <h2 className="section-title match-detail-section-title">
                  Team overview
                </h2>
                <div className="match-detail-meta-grid">
                  <div className="match-detail-item">
                    <span className="eyebrow">Short name</span>
                    <strong>{displayValue(team.shortName)}</strong>
                  </div>
                  <div className="match-detail-item">
                    <span className="eyebrow">Area</span>
                    <strong>{displayValue(team.area?.name)}</strong>
                  </div>
                  <div className="match-detail-item">
                    <span className="eyebrow">Venue</span>
                    <strong>{displayValue(team.venue)}</strong>
                  </div>
                  <div className="match-detail-item">
                    <span className="eyebrow">Founded</span>
                    <strong>{displayValue(team.founded)}</strong>
                  </div>
                  <div className="match-detail-item">
                    <span className="eyebrow">Colors</span>
                    <strong>{displayValue(team.clubColors)}</strong>
                  </div>
                  <div className="match-detail-item">
                    <span className="eyebrow">Coach</span>
                    <strong>{displayValue(team.coach?.name)}</strong>
                  </div>
                </div>
              </Paper>

              {team.area && (
                <Paper className="card match-detail-panel" elevation={0}>
                  <h2 className="section-title match-detail-section-title">
                    Area
                  </h2>
                  <Box className="match-detail-competition">
                    {team.area.flag && (
                      <Avatar
                        src={team.area.flag}
                        alt={`${team.area.name || "Team area"} flag`}
                        className="match-detail-competition-emblem"
                        sx={{ background: "rgba(232, 237, 245, 0.9)" }}
                      />
                    )}
                    <div className="match-detail-meta-grid">
                      <div className="match-detail-item">
                        <span className="eyebrow">Name</span>
                        <strong>{displayValue(team.area.name)}</strong>
                      </div>
                      <div className="match-detail-item">
                        <span className="eyebrow">Code</span>
                        <strong>{displayValue(team.area.code)}</strong>
                      </div>
                    </div>
                  </Box>
                </Paper>
              )}

              <CompetitionList competitions={team.runningCompetitions} />

              <div id="matches" className="team-detail-anchor">
                <MatchSection
                  title="Upcoming Matches"
                  matches={upcomingMatches}
                  emptyMessage="No upcoming matches for this team."
                />
                <MatchSection
                  title="Recent Results"
                  matches={recentMatches}
                  emptyMessage="No recent results for this team."
                />
              </div>

              <section id="squad" className="team-detail-anchor">
                <h2 className="section-title">Squad</h2>
                {!team.squad?.length ? (
                  <PageState
                    title="No squad data available."
                    message="Player information was not included for this team."
                  />
                ) : (
                  <>
                    <p className="table-scroll-hint">
                      Swipe horizontally to view all columns.
                    </p>
                    <Box
                      className="table-card"
                      tabIndex={0}
                      aria-label={`Scrollable ${
                        team.name || "team"
                      } squad table`}
                    >
                    <Table className="dark-table" aria-label={`${team.name} squad`}>
                      <TableHead>
                        <TableRow>
                          <TableCell>Player</TableCell>
                          <TableCell>Position</TableCell>
                          <TableCell>Nationality</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {team.squad.map((player) => (
                          <TableRow key={player.id || player.name}>
                            <TableCell>
                              <Typography sx={{ fontWeight: 900 }}>
                                {player.id ? (
                                  <Link
                                    href={`/persons/${player.id}`}
                                    className="player-detail-link"
                                  >
                                    {displayValue(player.name)}
                                  </Link>
                                ) : (
                                  displayValue(player.name)
                                )}
                              </Typography>
                            </TableCell>
                            <TableCell>{displayValue(player.position)}</TableCell>
                            <TableCell>{displayValue(player.nationality)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    </Box>
                  </>
                )}
              </section>
            </div>
          </>
        )}
      </main>
    </>
  );
}
