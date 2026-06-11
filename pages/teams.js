import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SEO from "../components/SEO";
import { usePreferredTeam } from "../components/PreferredTeamContext";
import styles from "../styles/Home.module.css";
import {
  getTeamDetails,
  getWorldCupMatches,
  getWorldCupTeams,
} from "../lib/footballData";
import {
  formatMatchDateTime,
  formatMatchScore,
  formatMatchStage,
  formatMatchStatus,
} from "../lib/formatters";

function displayValue(value) {
  return value || "Not available";
}

const upcomingMatchStatuses = ["SCHEDULED", "TIMED"];

function isUpcomingMatch(match, now = Date.now()) {
  if (!upcomingMatchStatuses.includes(match.status) || !match.utcDate) {
    return false;
  }

  const matchDate = new Date(match.utcDate).getTime();

  return Number.isFinite(matchDate) && matchDate >= now;
}

function TeamMatchCard({ match }) {
  return (
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
}

const Teams = ({
  teams,
  fixtures,
  teamDetails,
  selectedTeamId,
  hasSelectedTeamQuery,
}) => {
  const router = useRouter();
  const { preferredTeam, setPreferredTeam } = usePreferredTeam();
  const [teamToConfirm, setTeamToConfirm] = useState(null);
  const selectedTeam =
    teamDetails ||
    teams.find((team) => String(team.id) === String(selectedTeamId)) ||
    teams[0] ||
    null;
  const selectedTeamGame = fixtures.filter(
    ({ homeTeam, awayTeam }) =>
      selectedTeam &&
      (homeTeam === selectedTeam.name ||
        awayTeam === selectedTeam.name ||
        homeTeam === selectedTeam.shortName ||
        awayTeam === selectedTeam.shortName),
  );
  const recentTeamResults = selectedTeamGame
    .filter((match) => match.status === "FINISHED")
    .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate))
    .slice(0, 5);
  const upcomingTeamMatches = selectedTeamGame
    .filter((match) => isUpcomingMatch(match))
    .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate));
  const squad = teamDetails?.squad || [];
  const seoTitle =
    hasSelectedTeamQuery && selectedTeam?.name
      ? `${selectedTeam.name} Team Details & Squad — World Cup Hub`
      : "World Cup Teams — World Cup Hub";
  const seoDescription =
    hasSelectedTeamQuery && selectedTeam?.name
      ? `View ${selectedTeam.name} team details, coach information, squad players, and World Cup matches.`
      : "Explore World Cup teams, team profiles, crests, and team-wise fixtures.";

  useEffect(() => {
    if (
      router.isReady &&
      !hasSelectedTeamQuery &&
      preferredTeam?.id &&
      String(preferredTeam.id) !== String(selectedTeamId)
    ) {
      router.replace(`/teams?team=${preferredTeam.id}`);
    }
  }, [hasSelectedTeamQuery, preferredTeam, router, selectedTeamId]);

  const handleTeamChange = (event) => {
    router.push(`/teams?team=${event.target.value}`);
  };

  const handleSetPreferredTeam = () => {
    if (selectedTeam) {
      setTeamToConfirm({
        id: selectedTeam.id,
        name: selectedTeam.name,
        shortName: selectedTeam.shortName,
        crest: selectedTeam.crest,
      });
    }
  };

  const handleConfirmPreferredTeam = () => {
    if (teamToConfirm) {
      setPreferredTeam({
        id: teamToConfirm.id,
        name: teamToConfirm.name,
        shortName: teamToConfirm.shortName,
        crest: teamToConfirm.crest,
      });
    }

    setTeamToConfirm(null);
  };

  const isPreferredTeam =
    selectedTeam && String(preferredTeam?.id) === String(selectedTeam.id);

  return (
    <>
      <SEO title={seoTitle} description={seoDescription} />

      <main className="page-shell">
        <header
          className="page-header image-banner"
          style={{ "--banner-image": "url('/assets/fifa.jpg')" }}
        >
          <h1 className="page-title">Teams</h1>
          <p className="page-subtitle">
            Select a team to view its World Cup fixtures.
          </p>
        </header>

        <section className="filter-bar">
          <FormControl sx={{ minWidth: 260, marginLeft: { sm: "auto" } }}>
            <InputLabel>Team</InputLabel>
            <Select
              value={selectedTeam?.id || ""}
              label="Team"
              onChange={handleTeamChange}
            >
              {teams.map((team) => (
                <MenuItem
                  key={team.id}
                  sx={{ minWidth: "260px" }}
                  value={team.id}
                >
                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: "8px" }}
                  >
                    {team.crest && (
                      <Avatar
                        src={team.crest}
                        alt={`${team.name || "Team"} crest`}
                        sx={{
                          width: 24,
                          height: 24,
                          background: "rgba(232, 237, 245, 0.9)",
                        }}
                      />
                    )}
                    {team.name || "TBD"}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedTeam && (
            <Chip
              icon={<StarIcon />}
              label={isPreferredTeam ? "Favourite team" : "Set favourite"}
              onClick={handleSetPreferredTeam}
              disabled={isPreferredTeam}
              sx={{
                alignSelf: "center",
                color: "var(--color-gold)",
                borderColor: "var(--color-gold)",
                fontWeight: 800,
              }}
              variant="outlined"
            />
          )}
        </section>

        <Dialog
          open={Boolean(teamToConfirm)}
          onClose={() => setTeamToConfirm(null)}
          PaperProps={{ className: "confirm-dialog" }}
        >
          <DialogTitle>Set favourite team?</DialogTitle>
          <DialogContent>
            <Box className="confirm-team-preview">
              {teamToConfirm?.crest && (
                <Avatar
                  src={teamToConfirm.crest}
                  alt={`${teamToConfirm.name || "Team"} crest`}
                  sx={{
                    width: 58,
                    height: 58,
                    background: "rgba(232, 237, 245, 0.9)",
                  }}
                />
              )}
              <Box sx={{ minWidth: 0 }}>
                <Typography className="eyebrow">Favourite team</Typography>
                <Typography className="preferred-team-name">
                  {teamToConfirm?.name || "Selected team"}
                </Typography>
                <Typography className="muted-text">
                  This team will be highlighted on the home page.
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTeamToConfirm(null)}>Cancel</Button>
            <Button
              onClick={handleConfirmPreferredTeam}
              variant="contained"
              sx={{
                background: "var(--color-gold)",
                color: "var(--color-bg)",
                fontWeight: 800,
                "&:hover": {
                  background: "#efc66e",
                },
              }}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {teamDetails ? (
          <>
            <h2 className="section-title">Team Details</h2>

            <section className="card team-detail-hero">
              {teamDetails.crest && (
                <Avatar
                  src={teamDetails.crest}
                  alt={`${teamDetails.name || "Team"} crest`}
                  className="team-detail-crest"
                  sx={{ background: "rgba(232, 237, 245, 0.9)" }}
                />
              )}
              <Box sx={{ minWidth: 0 }}>
                <Typography className="eyebrow">
                  {displayValue(teamDetails.tla)}
                </Typography>
                <h3 className="match-title">
                  {displayValue(teamDetails.name)}
                </h3>
                <Typography className="muted-text">
                  {displayValue(teamDetails.shortName)}
                </Typography>
              </Box>
            </section>

            <section className="card team-meta-grid" aria-label="Team metadata">
              <div>
                <span className="eyebrow">Short Name</span>
                <strong>{displayValue(teamDetails.shortName)}</strong>
              </div>
              <div>
                <span className="eyebrow">Team Code</span>
                <strong>{displayValue(teamDetails.tla)}</strong>
              </div>
              <div>
                <span className="eyebrow">Founded</span>
                <strong>{displayValue(teamDetails.founded)}</strong>
              </div>
              <div>
                <span className="eyebrow">Venue</span>
                <strong>{displayValue(teamDetails.venue)}</strong>
              </div>
              <div>
                <span className="eyebrow">Coach</span>
                <strong>{displayValue(teamDetails.coach?.name)}</strong>
              </div>
              <div>
                <span className="eyebrow">Squad Size</span>
                <strong>{squad.length || "Not available"}</strong>
              </div>
            </section>

            <h2 className="section-title">Upcoming Matches</h2>

            {upcomingTeamMatches.length === 0 ? (
              <div className="empty-state">
                <strong>No upcoming matches for this team.</strong>
                Select another team or check back later.
              </div>
            ) : (
              <div className="match-grid">
                {upcomingTeamMatches.map((match) => (
                  <TeamMatchCard key={match.id} match={match} />
                ))}
              </div>
            )}

            <h2 className="section-title">Recent Results</h2>

            {recentTeamResults.length === 0 ? (
              <div className="empty-state">
                <strong>No recent results for this team.</strong>
                Finished matches will appear here when available.
              </div>
            ) : (
              <div className="match-grid">
                {recentTeamResults.map((match) => (
                  <TeamMatchCard key={match.id} match={match} />
                ))}
              </div>
            )}

            <h2 className="section-title">Squad</h2>

            {squad.length === 0 ? (
              <div className="empty-state">
                <strong>No squad data available yet.</strong>
              </div>
            ) : (
              <Box className="table-card table-scroll">
                <Table className="dark-table" aria-label="team squad table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Player</TableCell>
                      <TableCell>Position</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {squad.map((player) => (
                      <TableRow
                        key={player.id || player.name}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>
                          <Typography sx={{ fontWeight: 900 }}>
                            {displayValue(player.name)}
                          </Typography>
                        </TableCell>
                        <TableCell>{displayValue(player.position)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </>
        ) : (
          selectedTeam && (
            <div className="empty-state">
              <strong>Team details are not available.</strong>
              Fixtures can still be shown for the selected team.
            </div>
          )
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
};

export default Teams;

export async function getServerSideProps({ query }) {
  try {
    const [teams, fixtures] = await Promise.all([
      getWorldCupTeams(),
      getWorldCupMatches(),
    ]);
    const selectedTeamId = query.team || teams[0]?.id || "";
    let teamDetails = null;

    if (selectedTeamId) {
      try {
        teamDetails = await getTeamDetails(selectedTeamId);
      } catch (error) {
        console.error(error);
      }
    }

    return {
      props: {
        teams,
        fixtures,
        teamDetails,
        selectedTeamId,
        hasSelectedTeamQuery: Boolean(query.team),
      },
    };
  } catch (error) {
    console.error(error);

    return {
      props: {
        teams: [],
        fixtures: [],
        teamDetails: null,
        selectedTeamId: "",
        hasSelectedTeamQuery: Boolean(query.team),
      },
    };
  }
}
