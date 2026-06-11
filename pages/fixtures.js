import { useState } from "react";
import {
  Avatar,
  Box,
  Chip,
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
import SEO from "../components/SEO";
import styles from "../styles/Home.module.css";
import { getWorldCupMatches } from "../lib/footballData";
import {
  formatMatchDateTime,
  formatMatchScore,
  formatMatchStage,
  formatMatchStatus,
} from "../lib/formatters";

function StatusChip({ status }) {
  return (
    <Chip
      size="small"
      label={formatMatchStatus(status)}
      sx={{
        color: "var(--color-gold)",
        borderColor: "var(--color-gold)",
        fontWeight: 700,
      }}
      variant="outlined"
    />
  );
}

const Fixtures = ({ fixtures }) => {
  const [statusFilter, setStatusFilter] = useState("All");
  const [stageFilter, setStageFilter] = useState("All");
  const statusOptions = [
    "All",
    "SCHEDULED",
    "LIVE",
    "IN_PLAY",
    "PAUSED",
    "FINISHED",
  ];
  const stageOptions = [
    "All",
    ...new Set(fixtures.map((fixture) => fixture.stage).filter(Boolean)),
  ];
  const filteredFixtures = fixtures.filter((fixture) => {
    const matchesStatus =
      statusFilter === "All" || fixture.status === statusFilter;
    const matchesStage = stageFilter === "All" || fixture.stage === stageFilter;

    return matchesStatus && matchesStage;
  });

  return (
    <>
      <SEO
        title="World Cup Fixtures & Results — World Cup Hub"
        description="Browse World Cup fixtures and results by match status and tournament stage."
      />

      <main className="page-shell">
        <header
          className="page-header image-banner"
          style={{ "--banner-image": "url('/assets/fifa.jpg')" }}
        >
          <h1 className="page-title">Fixtures</h1>
          <p className="page-subtitle">
            Browse every World Cup match by status and stage.
          </p>
        </header>

        <section className="filter-bar">
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>Stage</InputLabel>
            <Select
              value={stageFilter}
              label="Stage"
              onChange={(e) => setStageFilter(e.target.value)}
            >
              {stageOptions.map((stage) => (
                <MenuItem key={stage} value={stage}>
                  {stage}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </section>

        {filteredFixtures.length === 0 ? (
          <div className="empty-state">
            <strong>No matches found for the selected filters.</strong>
            Try a different status or stage.
          </div>
        ) : (
          <Box className="table-card">
            <Table className="dark-table" aria-label="fixtures table">
              <TableHead>
                <TableRow>
                  <TableCell>Match</TableCell>
                  <TableCell>Stage/Group</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Result</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredFixtures.map((fixture) => (
                  <TableRow
                    key={fixture.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>
                      <Box className="fixture-table-match">
                        <Box className="fixture-table-team">
                          {fixture.homeTeamCrest && (
                            <Avatar
                              src={fixture.homeTeamCrest}
                              alt={`${fixture.homeTeam || "Home team"} flag`}
                              className="fixture-table-flag"
                              sx={{ background: "rgba(232, 237, 245, 0.9)" }}
                            />
                          )}
                          <Typography sx={{ fontWeight: 800 }}>
                            {fixture.homeTeam || "TBD"}
                          </Typography>
                        </Box>
                        <span className="fixture-table-versus">VS</span>
                        <Box className="fixture-table-team">
                          {fixture.awayTeamCrest && (
                            <Avatar
                              src={fixture.awayTeamCrest}
                              alt={`${fixture.awayTeam || "Away team"} flag`}
                              className="fixture-table-flag"
                              sx={{ background: "rgba(232, 237, 245, 0.9)" }}
                            />
                          )}
                          <Typography sx={{ fontWeight: 800 }}>
                            {fixture.awayTeam || "TBD"}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {formatMatchStage(fixture.group || fixture.stage)}
                    </TableCell>
                    <TableCell>{formatMatchDateTime(fixture.utcDate)}</TableCell>
                    <TableCell>
                      <StatusChip status={fixture.status} />
                    </TableCell>
                    <TableCell className="score-text">
                      {formatMatchScore(fixture.homeScore, fixture.awayScore)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
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

export default Fixtures;

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
