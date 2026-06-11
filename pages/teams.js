import { useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import styles from "../styles/Home.module.css";
import { getWorldCupMatches, getWorldCupTeams } from "../lib/footballData";
import {
  formatMatchDateTime,
  formatMatchScore,
  formatMatchStage,
  formatMatchStatus,
} from "../lib/formatters";

function TeamMatchCard({ match }) {
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

const Teams = ({ teams, fixtures }) => {
  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id || "");
  const selectedTeam =
    teams.find((team) => team.id === selectedTeamId) || teams[0] || null;
  const selectedTeamGame = fixtures.filter(
    ({ homeTeam, awayTeam }) =>
      selectedTeam &&
      (homeTeam === selectedTeam.name || awayTeam === selectedTeam.name)
  );

  return (
    <>
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
          {selectedTeam && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                minWidth: { xs: "100%", sm: "auto" },
              }}
            >
              {selectedTeam.crest && (
                <Avatar
                  src={selectedTeam.crest}
                  alt={selectedTeam.name || "TBD"}
                  sx={{
                    width: 42,
                    height: 42,
                    background: "rgba(232, 237, 245, 0.9)",
                  }}
                />
              )}
              <Box>
                <Typography className="eyebrow">Selected Team</Typography>
                <Typography sx={{ color: "var(--color-gold)", fontWeight: 900 }}>
                  {selectedTeam.name || "TBD"}
                </Typography>
              </Box>
            </Box>
          )}

          <FormControl sx={{ minWidth: 260, marginLeft: { sm: "auto" } }}>
            <InputLabel>Team</InputLabel>
            <Select
              value={selectedTeam?.id || ""}
              label="Team"
              onChange={(e) => setSelectedTeamId(e.target.value)}
            >
              {teams.map((team) => (
                <MenuItem key={team.id} sx={{ minWidth: "260px" }} value={team.id}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {team.crest && (
                      <Avatar
                        src={team.crest}
                        alt={team.name || "TBD"}
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
        </section>

        <h2 className="section-title">
          {selectedTeam ? `${selectedTeam.name} fixtures` : "Team fixtures"}
        </h2>

        {selectedTeamGame.length === 0 ? (
          <div className="empty-state">
            <strong>No matches available for this team.</strong>
            Select another team or check back later.
          </div>
        ) : (
          <div className="match-grid">
            {selectedTeamGame.map((match) => (
              <TeamMatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
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
};

export default Teams;

export async function getServerSideProps() {
  try {
    const [teams, fixtures] = await Promise.all([
      getWorldCupTeams(),
      getWorldCupMatches(),
    ]);

    return {
      props: { teams, fixtures },
    };
  } catch (error) {
    console.error(error);

    return {
      props: { teams: [], fixtures: [] },
    };
  }
}
