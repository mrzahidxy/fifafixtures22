import { useState } from "react";
import Link from "next/link";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import SEO from "../components/SEO";
import { usePreferredTeam } from "../components/PreferredTeamContext";
import styles from "../styles/Home.module.css";
import { getWorldCupTeams } from "../lib/footballData";

function displayValue(value) {
  return value === null || value === undefined || value === ""
    ? "Not available"
    : value;
}

export default function Teams({ teams }) {
  const { preferredTeam, setPreferredTeam } = usePreferredTeam();
  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id || "");
  const [teamToConfirm, setTeamToConfirm] = useState(null);
  const selectedTeam =
    teams.find((team) => String(team.id) === String(selectedTeamId)) ||
    teams[0] ||
    null;
  const isMyTeam =
    selectedTeam && String(preferredTeam?.id) === String(selectedTeam.id);

  const handleSetMyTeam = () => {
    if (selectedTeam) {
      setTeamToConfirm({
        id: selectedTeam.id,
        name: selectedTeam.name,
        shortName: selectedTeam.shortName,
        crest: selectedTeam.crest,
      });
    }
  };

  const handleConfirmMyTeam = () => {
    if (teamToConfirm) {
      setPreferredTeam(teamToConfirm);
    }

    setTeamToConfirm(null);
  };

  return (
    <>
      <SEO
        title="World Cup Teams — World Cup Hub"
        description="Explore World Cup teams and open team profiles, squads, competitions, and fixtures."
      />

      <main className="page-shell">
        <header
          className="page-header image-banner"
          style={{ "--banner-image": "url('/assets/fifa.jpg')" }}
        >
          <h1 className="page-title">Teams</h1>
          <p className="page-subtitle">
            Search for a team, preview it, or open its full profile.
          </p>
        </header>

        <section className="teams-page-section" aria-labelledby="my-team-heading">
          <h2 className="section-title" id="my-team-heading">
            My Team
          </h2>
          {preferredTeam?.id ? (
            <Link
              href={`/teams/${preferredTeam.id}`}
              className="favourite-team-link"
              aria-label={`View ${preferredTeam.name || "my team"} details`}
            >
              <div className="preferred-team-panel">
                <div className="preferred-team-crest-wrap">
                  {preferredTeam.crest ? (
                    <Avatar
                      src={preferredTeam.crest}
                      alt={`${preferredTeam.name || "My team"} crest`}
                      className="preferred-team-crest"
                      sx={{ background: "rgba(232, 237, 245, 0.9)" }}
                    />
                  ) : (
                    <StarIcon className="preferred-team-fallback" />
                  )}
                </div>
                <Box className="my-team-copy">
                  <Typography className="eyebrow">Saved team</Typography>
                  <Typography className="preferred-team-name">
                    {displayValue(preferredTeam.name)}
                  </Typography>
                  <Typography className="muted-text">
                    Your shortcut to the full team profile.
                  </Typography>
                </Box>
                <span className="my-team-cta">View Details</span>
              </div>
            </Link>
          ) : (
            <div className="empty-state favourite-team-empty">
              <strong>No team saved yet.</strong>
              Find a team below and choose Set as My Team.
            </div>
          )}
        </section>

        <section className="filter-bar teams-filter-bar" aria-label="Find a team">
          <Autocomplete
            options={teams}
            value={selectedTeam}
            onChange={(_, team) => setSelectedTeamId(team?.id || "")}
            getOptionLabel={(team) =>
              team?.name || team?.shortName || team?.tla || "Unknown team"
            }
            isOptionEqualToValue={(option, value) =>
              String(option?.id) === String(value?.id)
            }
            noOptionsText="No teams found"
            sx={{ minWidth: 280, flex: "1 1 340px" }}
            renderOption={(props, team) => (
              <Box component="li" {...props} key={team.id || team.name}>
                <Avatar
                  src={team.crest || ""}
                  alt=""
                  sx={{
                    width: 28,
                    height: 28,
                    marginRight: "10px",
                    background: "rgba(232, 237, 245, 0.9)",
                  }}
                />
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 800 }}>
                    {displayValue(team.name)}
                  </Typography>
                  <Typography className="muted-text">
                    {team.tla || team.shortName || "Team"}
                  </Typography>
                </Box>
              </Box>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search teams"
                placeholder="Type a team name"
              />
            )}
          />

          {selectedTeam && (
            <Chip
              icon={<StarIcon />}
              label={isMyTeam ? "My Team" : "Set as My Team"}
              onClick={handleSetMyTeam}
              disabled={isMyTeam}
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

        <h2 className="section-title">Team Preview</h2>
        {selectedTeam ? (
          <section className="card team-selection-summary">
            {selectedTeam.crest ? (
              <Avatar
                src={selectedTeam.crest}
                alt={`${selectedTeam.name || "Team"} crest`}
                className="team-detail-crest"
                sx={{ background: "rgba(232, 237, 245, 0.9)" }}
              />
            ) : (
              <div className="team-preview-fallback" aria-hidden="true">
                {selectedTeam.tla || "?"}
              </div>
            )}
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography className="eyebrow">
                {displayValue(selectedTeam.tla)}
              </Typography>
              <h3 className="match-title">
                {displayValue(selectedTeam.name)}
              </h3>
              <Typography className="muted-text">
                {[selectedTeam.shortName, selectedTeam.venue]
                  .filter(Boolean)
                  .join(" · ") || "No additional team information available."}
              </Typography>
              <Typography className="team-preview-meta">
                Founded: {displayValue(selectedTeam.founded)}
              </Typography>
            </Box>
            {selectedTeam.id && (
              <div className="team-preview-actions">
                <Button
                  component={Link}
                  href={`/teams/${selectedTeam.id}`}
                  variant="contained"
                >
                  View Details
                </Button>
                <Button
                  component={Link}
                  href={`/teams/${selectedTeam.id}#squad`}
                  variant="outlined"
                >
                  Squad
                </Button>
                <Button
                  component={Link}
                  href={`/teams/${selectedTeam.id}#matches`}
                  variant="outlined"
                >
                  Matches
                </Button>
              </div>
            )}
          </section>
        ) : (
          <div className="empty-state">
            <strong>No team selected.</strong>
            Search for a team to see its preview.
          </div>
        )}

        <Dialog
          open={Boolean(teamToConfirm)}
          onClose={() => setTeamToConfirm(null)}
          PaperProps={{ className: "confirm-dialog" }}
        >
          <DialogTitle>Set as My Team?</DialogTitle>
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
                <Typography className="eyebrow">My Team</Typography>
                <Typography className="preferred-team-name">
                  {displayValue(teamToConfirm?.name)}
                </Typography>
                <Typography className="muted-text">
                  This team will be highlighted across the app.
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTeamToConfirm(null)}>Cancel</Button>
            <Button
              onClick={handleConfirmMyTeam}
              variant="contained"
              sx={{
                background: "var(--color-gold)",
                color: "var(--color-bg)",
                fontWeight: 800,
                "&:hover": { background: "#efc66e" },
              }}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
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

export async function getServerSideProps({ query }) {
  if (query.team) {
    const teamId = Array.isArray(query.team) ? query.team[0] : query.team;

    return {
      redirect: {
        destination: /^[1-9]\d*$/.test(String(teamId))
          ? `/teams/${teamId}`
          : "/teams",
        permanent: false,
      },
    };
  }

  try {
    const teams = await getWorldCupTeams();

    return { props: { teams } };
  } catch (error) {
    console.error(error);

    return { props: { teams: [] } };
  }
}
