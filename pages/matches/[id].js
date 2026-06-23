import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import moment from "moment/moment";
import SEO from "../../components/SEO";
import {
  formatMatchDateTime,
  formatMatchStage,
  formatMatchStatus,
} from "../../lib/formatters";

const NOT_AVAILABLE = "Not available";

const statisticFields = [
  ["Possession", "ball_possession", "%"],
  ["Shots", "shots"],
  ["Shots on goal", "shots_on_goal"],
  ["Fouls", "fouls"],
  ["Offsides", "offsides"],
  ["Corners", "corner_kicks"],
  ["Saves", "saves"],
  ["Yellow cards", "yellow_cards"],
  ["Yellow-red cards", "yellow_red_cards"],
  ["Red cards", "red_cards"],
];

function displayValue(value, fallback = NOT_AVAILABLE) {
  return value === null || value === undefined || value === ""
    ? fallback
    : value;
}

function hasValue(value) {
  return value !== null && value !== undefined && value !== "";
}

function formatEnum(value) {
  if (!value) {
    return null;
  }

  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value) {
  return value ? moment(value).format("DD MMM YYYY, hh:mm A") : null;
}

function formatSeason(season) {
  if (!season) {
    return null;
  }

  const dates =
    season.startDate && season.endDate
      ? `${moment(season.startDate).format("DD MMM YYYY")} – ${moment(
          season.endDate
        ).format("DD MMM YYYY")}`
      : null;

  return dates || (hasValue(season.id) ? `Season ${season.id}` : null);
}

function formatMinute(minute, injuryTime) {
  if (minute == null) {
    return null;
  }

  return injuryTime ? `${minute}+${injuryTime}′` : `${minute}′`;
}

function formatScore(score) {
  const home = score?.home;
  const away = score?.away;

  return home == null || away == null ? null : `${home} – ${away}`;
}

function PlayerName({ player, fallback = NOT_AVAILABLE }) {
  const name = player?.name || fallback;
  const hasId =
    player?.id !== null &&
    player?.id !== undefined &&
    String(player.id).trim() !== "";

  return hasId ? (
    <Link href={`/persons/${player.id}`} className="player-detail-link">
      {name}
    </Link>
  ) : (
    name
  );
}

function DetailItem({ label, value }) {
  if (!hasValue(value)) {
    return null;
  }

  return (
    <div className="match-detail-item">
      <span className="eyebrow">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function TeamSummary({ team, side }) {
  return (
    <Paper className="match-detail-team card" elevation={0}>
      <Box className="match-detail-team-heading">
        {team?.crest && (
          <Avatar
            src={team.crest}
            alt={`${team?.name || side} crest`}
            className="match-detail-team-crest"
            sx={{ background: "rgba(232, 237, 245, 0.9)" }}
          />
        )}
        <Box>
          <Typography className="eyebrow">{side}</Typography>
          <Typography component="h2" className="match-title">
            {team?.id ? (
              <Link
                href={`/teams/${team.id}`}
                className="team-detail-link"
              >
                {displayValue(team?.name)}
              </Link>
            ) : (
              displayValue(team?.name)
            )}
          </Typography>
          {team?.shortName && (
            <Typography className="muted-text">{team.shortName}</Typography>
          )}
        </Box>
      </Box>
      <div className="match-detail-meta-grid compact">
        <DetailItem label="Coach" value={team?.coach?.name} />
        <DetailItem label="Formation" value={team?.formation} />
        <DetailItem label="League rank" value={team?.leagueRank} />
      </div>
    </Paper>
  );
}

function Overview({ match }) {
  const odds = match?.odds;
  const hasOdds =
    odds &&
    [odds.homeWin, odds.draw, odds.awayWin].some(
      (value) => value !== null && value !== undefined
    );

  return (
    <div className="match-detail-section-stack">
      <div className="match-detail-team-grid">
        <TeamSummary team={match?.homeTeam} side="Home team" />
        <TeamSummary team={match?.awayTeam} side="Away team" />
      </div>

      <Paper className="card match-detail-panel" elevation={0}>
        <h2 className="section-title match-detail-section-title">
          Match information
        </h2>
        <div className="match-detail-meta-grid">
          <DetailItem
            label="Kickoff"
            value={match?.utcDate ? formatMatchDateTime(match.utcDate) : null}
          />
          <DetailItem
            label="Status"
            value={match?.status ? formatMatchStatus(match.status) : null}
          />
          <DetailItem label="Minute" value={match?.minute} />
          <DetailItem label="Injury time" value={match?.injuryTime} />
          <DetailItem label="Venue" value={match?.venue} />
          <DetailItem label="Attendance" value={match?.attendance} />
          <DetailItem label="Matchday" value={match?.matchday} />
          <DetailItem
            label="Stage"
            value={match?.stage ? formatMatchStage(match.stage) : null}
          />
          <DetailItem
            label="Group"
            value={match?.group ? formatMatchStage(match.group) : null}
          />
          <DetailItem label="Last updated" value={formatDate(match?.lastUpdated)} />
        </div>
      </Paper>

      <Paper className="card match-detail-panel" elevation={0}>
        <h2 className="section-title match-detail-section-title">
          Competition
        </h2>
        <Box className="match-detail-competition">
          {match?.competition?.emblem && (
            <Avatar
              src={match.competition.emblem}
              alt={`${match?.competition?.name || "Competition"} emblem`}
              className="match-detail-competition-emblem"
              sx={{ background: "rgba(232, 237, 245, 0.9)" }}
            />
          )}
          <div className="match-detail-meta-grid">
            <DetailItem label="Name" value={match?.competition?.name} />
            <DetailItem label="Code" value={match?.competition?.code} />
            <DetailItem label="Area" value={match?.area?.name} />
            <DetailItem label="Season" value={formatSeason(match?.season)} />
          </div>
        </Box>
      </Paper>

      <Paper className="card match-detail-panel" elevation={0}>
        <h2 className="section-title match-detail-section-title">
          Score details
        </h2>
        <div className="match-detail-meta-grid">
          <DetailItem label="Full time" value={formatScore(match?.score?.fullTime)} />
          <DetailItem label="Half time" value={formatScore(match?.score?.halfTime)} />
          <DetailItem label="Winner" value={formatEnum(match?.score?.winner)} />
          <DetailItem label="Duration" value={formatEnum(match?.score?.duration)} />
        </div>
      </Paper>

      {hasOdds && (
        <Paper className="card match-detail-panel" elevation={0}>
          <h2 className="section-title match-detail-section-title">Odds</h2>
          <>
            <div className="match-detail-meta-grid">
              <DetailItem label="Home win" value={odds?.homeWin} />
              <DetailItem label="Draw" value={odds?.draw} />
              <DetailItem label="Away win" value={odds?.awayWin} />
            </div>
            <Typography className="muted-text match-detail-note">
              Odds are shown for informational purposes only.
            </Typography>
          </>
        </Paper>
      )}
    </div>
  );
}

function TimelineEvent({ event }) {
  return (
    <Paper className="match-detail-event" elevation={0}>
      <span className="match-detail-event-minute">
        {formatMinute(event.minute, event.injuryTime)}
      </span>
      <div>
        <Typography className="eyebrow">{event.label}</Typography>
        <Typography className="match-detail-event-title">
          {event.title}
        </Typography>
        <Typography className="muted-text">{event.detail}</Typography>
      </div>
    </Paper>
  );
}

function Timeline({ match }) {
  const events = useMemo(() => {
    const goals = (match?.goals || []).map((goal, index) => ({
      key: `goal-${index}`,
      minute: goal?.minute,
      injuryTime: goal?.injuryTime,
      label: "Goal",
      title: (
        <>
          <PlayerName player={goal?.scorer} />
          {goal?.team?.name ? ` · ${goal.team.name}` : ""}
        </>
      ),
      detail: (
        <>
          {goal?.assist?.name && (
            <>
              Assist: <PlayerName player={goal.assist} />
            </>
          )}
          {goal?.type && (
            <>
              {goal?.assist?.name ? " · " : ""}
              Type: {formatEnum(goal.type)}
            </>
          )}
          {formatScore(goal?.score) && (
            <>
              {goal?.assist?.name || goal?.type ? " · " : ""}
              Score: {formatScore(goal.score)}
            </>
          )}
        </>
      ),
    }));
    const bookings = (match?.bookings || []).map((booking, index) => ({
      key: `booking-${index}`,
      minute: booking?.minute,
      injuryTime: booking?.injuryTime,
      label: "Booking",
      title: (
        <>
          <PlayerName player={booking?.player} />
          {booking?.team?.name ? ` · ${booking.team.name}` : ""}
        </>
      ),
      detail: formatEnum(booking?.card),
    }));
    const substitutions = (match?.substitutions || []).map(
      (substitution, index) => ({
        key: `substitution-${index}`,
        minute: substitution?.minute,
        injuryTime: substitution?.injuryTime,
        label: "Substitution",
        title: substitution?.team?.name || "",
        detail: (
          <>
            {substitution?.playerIn?.name && (
              <>
                <PlayerName player={substitution.playerIn} /> in
              </>
            )}
            {substitution?.playerOut?.name && (
              <>
                {substitution?.playerIn?.name ? " · " : ""}
                <PlayerName player={substitution.playerOut} /> out
              </>
            )}
          </>
        ),
      })
    );

    return [...goals, ...bookings, ...substitutions].sort(
      (first, second) =>
        (first.minute ?? Number.MAX_SAFE_INTEGER) -
        (second.minute ?? Number.MAX_SAFE_INTEGER)
    );
  }, [match]);

  return (
    <div className="match-detail-section-stack">
      <div className="match-detail-timeline">
        {events.map((event) => (
          <TimelineEvent key={event.key} event={event} />
        ))}
      </div>

      {match?.penalties?.length > 0 && (
        <Paper className="card match-detail-panel" elevation={0}>
          <h2 className="section-title match-detail-section-title">Penalties</h2>
          <div className="match-detail-list">
            {match.penalties.map((penalty, index) => (
              <div
                className="match-detail-list-row"
                key={`${penalty?.player?.id || "penalty"}-${index}`}
              >
                <strong>
                  <PlayerName player={penalty?.player} />
                </strong>
                <span className="muted-text">
                  {[
                    penalty?.team?.name,
                    penalty?.scored === true
                      ? "Scored"
                      : penalty?.scored === false
                      ? "Missed"
                      : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </div>
            ))}
          </div>
        </Paper>
      )}
    </div>
  );
}

function PlayerList({ title, players }) {
  if (!players?.length) {
    return null;
  }

  return (
    <div>
      <h3 className="match-title match-detail-list-title">{title}</h3>
      <div className="match-detail-list">
        {players.map((player, index) => (
          <div
            className="match-detail-list-row"
            key={`${player?.id || player?.name || "player"}-${index}`}
          >
            <strong>
              {player?.shirtNumber != null ? `${player.shirtNumber}. ` : ""}
              <PlayerName player={player} />
            </strong>
            {player?.position && (
              <span className="muted-text">
                {player.position}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamLineup({ team, side }) {
  return (
    <Paper className="card match-detail-panel" elevation={0}>
      <Box className="match-detail-lineup-heading">
        {team?.crest && (
          <Avatar
            src={team.crest}
            alt={`${team?.name || side} crest`}
            sx={{ background: "rgba(232, 237, 245, 0.9)" }}
          />
        )}
        <Box>
          <Typography className="eyebrow">{side}</Typography>
          <Typography className="match-title">
            {displayValue(team?.name)}
          </Typography>
          {team?.formation && (
            <Typography className="muted-text">
              Formation: {team.formation}
            </Typography>
          )}
        </Box>
      </Box>
      <Divider className="match-detail-divider" />
      <div className="match-detail-lineup-lists">
        <PlayerList title="Starting lineup" players={team?.lineup} />
        <PlayerList title="Bench" players={team?.bench} />
      </div>
    </Paper>
  );
}

function Lineups({ match }) {
  return (
    <div className="match-detail-team-grid">
      {(match?.homeTeam?.lineup?.length > 0 ||
        match?.homeTeam?.bench?.length > 0) && (
        <TeamLineup team={match.homeTeam} side="Home team" />
      )}
      {(match?.awayTeam?.lineup?.length > 0 ||
        match?.awayTeam?.bench?.length > 0) && (
        <TeamLineup team={match.awayTeam} side="Away team" />
      )}
    </div>
  );
}

function hasTimelineData(match) {
  return ["goals", "bookings", "substitutions", "penalties"].some(
    (key) => match?.[key]?.length > 0
  );
}

function hasLineupData(match) {
  return ["homeTeam", "awayTeam"].some(
    (teamKey) =>
      match?.[teamKey]?.lineup?.length > 0 ||
      match?.[teamKey]?.bench?.length > 0
  );
}

function hasStatisticsData(match) {
  return statisticFields.some(
    ([, key]) =>
      hasValue(match?.homeTeam?.statistics?.[key]) &&
      hasValue(match?.awayTeam?.statistics?.[key])
  );
}

function Statistics({ match }) {
  const homeStatistics = match?.homeTeam?.statistics;
  const awayStatistics = match?.awayTeam?.statistics;

  return (
    <Paper className="card match-detail-panel" elevation={0}>
      <div className="match-detail-stat-header">
        <strong>{displayValue(match?.homeTeam?.shortName || match?.homeTeam?.name)}</strong>
        <span className="eyebrow">Statistic</span>
        <strong>{displayValue(match?.awayTeam?.shortName || match?.awayTeam?.name)}</strong>
      </div>
      <div className="match-detail-stat-list">
        {statisticFields
          .filter(
            ([, key]) =>
              hasValue(homeStatistics?.[key]) &&
              hasValue(awayStatistics?.[key])
          )
          .map(([label, key, suffix = ""]) => (
            <div className="match-detail-stat-row" key={key}>
              <strong>{`${homeStatistics[key]}${suffix}`}</strong>
              <span>{label}</span>
              <strong>{`${awayStatistics[key]}${suffix}`}</strong>
            </div>
          ))}
      </div>
    </Paper>
  );
}

function Officials({ match }) {
  return (
    <Paper className="card match-detail-panel" elevation={0}>
      <h2 className="section-title match-detail-section-title">Referees</h2>
      <div className="match-detail-list">
        {match.referees.map((referee, index) => (
          <div
            className="match-detail-list-row"
            key={`${referee?.id || referee?.name || "referee"}-${index}`}
          >
            <strong>{referee?.name}</strong>
            <span className="muted-text">
              {[formatEnum(referee?.type), referee?.nationality]
                .filter(Boolean)
                .join(" · ")}
            </span>
          </div>
        ))}
      </div>
    </Paper>
  );
}

function MatchHeader({ match }) {
  return (
    <header className="page-header match-detail-header">
      <span className="eyebrow">
        {[match?.competition?.name, match?.stage && formatMatchStage(match.stage)]
          .filter(Boolean)
          .join(" · ")}
      </span>
      <div className="match-detail-scoreboard">
        <div className="match-detail-score-team">
          <Avatar
            src={match?.homeTeam?.crest || ""}
            alt={`${match?.homeTeam?.name || "Home team"} crest`}
            className="match-detail-score-crest"
            sx={{ background: "rgba(232, 237, 245, 0.9)" }}
          />
          <strong>
            {match?.homeTeam?.id ? (
              <Link
                href={`/teams/${match.homeTeam.id}`}
                className="team-detail-link"
              >
                {displayValue(match?.homeTeam?.name)}
              </Link>
            ) : (
              displayValue(match?.homeTeam?.name)
            )}
          </strong>
        </div>
        <div className="match-detail-score">
          <Chip
            label={formatMatchStatus(match?.status)}
            size="small"
            variant="outlined"
            sx={{
              color: "var(--color-gold)",
              borderColor: "var(--color-gold)",
              fontWeight: 800,
            }}
          />
          <span>{formatScore(match?.score?.fullTime)}</span>
        </div>
        <div className="match-detail-score-team away">
          <Avatar
            src={match?.awayTeam?.crest || ""}
            alt={`${match?.awayTeam?.name || "Away team"} crest`}
            className="match-detail-score-crest"
            sx={{ background: "rgba(232, 237, 245, 0.9)" }}
          />
          <strong>
            {match?.awayTeam?.id ? (
              <Link
                href={`/teams/${match.awayTeam.id}`}
                className="team-detail-link"
              >
                {displayValue(match?.awayTeam?.name)}
              </Link>
            ) : (
              displayValue(match?.awayTeam?.name)
            )}
          </strong>
        </div>
      </div>
      <Typography className="page-subtitle">
        {[
          match?.utcDate && formatMatchDateTime(match.utcDate),
          match?.venue,
        ]
          .filter(Boolean)
          .join(" · ")}
      </Typography>
    </header>
  );
}

export default function MatchDetails() {
  const router = useRouter();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const rawId = router.query.id;
  const matchId = Array.isArray(rawId) ? rawId[0] : rawId;
  const availableTabs = useMemo(() => {
    const tabs = [{ id: "overview", label: "Overview" }];

    if (hasTimelineData(match)) {
      tabs.push({ id: "timeline", label: "Timeline" });
    }

    if (hasLineupData(match)) {
      tabs.push({ id: "lineups", label: "Lineups" });
    }

    if (hasStatisticsData(match)) {
      tabs.push({ id: "statistics", label: "Statistics" });
    }

    if (match?.referees?.length > 0) {
      tabs.push({ id: "officials", label: "Officials" });
    }

    return tabs;
  }, [match]);
  const activeSection = availableTabs[activeTab]?.id || "overview";

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (!matchId || !/^[1-9]\d*$/.test(matchId)) {
      setError("A valid positive match ID is required.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadMatch() {
      setLoading(true);
      setError("");
      setMatch(null);
      setActiveTab(0);

      try {
        const response = await fetch(`/api/matches/${matchId}`, {
          signal: controller.signal,
        });
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.error ||
              (response.status === 404
                ? "Match not found."
                : "Unable to load match details.")
          );
        }

        if (!data || typeof data !== "object") {
          throw new Error("No match details were returned.");
        }

        setMatch(data);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message || "Unable to load match details.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadMatch();

    return () => controller.abort();
  }, [matchId, router.isReady]);

  const pageTitle = match
    ? `${displayValue(match?.homeTeam?.shortName || match?.homeTeam?.name)} vs ${displayValue(
        match?.awayTeam?.shortName || match?.awayTeam?.name
      )} — World Cup Hub`
    : "Match Details — World Cup Hub";

  return (
    <>
      <SEO
        title={pageTitle}
        description="View match score, timeline, lineups, statistics, and officials."
      />

      <main className="page-shell">
        <Link href="/fixtures" className="back-link">
          ← Back to Matches
        </Link>

        {loading ? (
          <div className="empty-state match-detail-loading">
            <CircularProgress
              size={32}
              sx={{ color: "var(--color-gold)", marginBottom: "12px" }}
            />
            <strong>Loading match details…</strong>
            Fetching the latest available match information.
          </div>
        ) : error ? (
          <div className="empty-state">
            <strong>{error}</strong>
            Check the match link or try again later.
          </div>
        ) : !match ? (
          <div className="empty-state">
            <strong>No match details available.</strong>
            Football-Data did not return information for this match.
          </div>
        ) : (
          <>
            <MatchHeader match={match} />

            <Paper className="match-detail-tabs-card" elevation={0}>
              <Tabs
                value={activeTab}
                onChange={(_, nextTab) => setActiveTab(nextTab)}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="Match details sections"
              >
                {availableTabs.map((tab) => (
                  <Tab key={tab.id} label={tab.label} />
                ))}
              </Tabs>
            </Paper>

            <section className="match-detail-tab-panel" role="tabpanel">
              {activeSection === "overview" && <Overview match={match} />}
              {activeSection === "timeline" && <Timeline match={match} />}
              {activeSection === "lineups" && <Lineups match={match} />}
              {activeSection === "statistics" && <Statistics match={match} />}
              {activeSection === "officials" && <Officials match={match} />}
            </section>
          </>
        )}
      </main>
    </>
  );
}
