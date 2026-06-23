import {
  Avatar,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Link from "next/link";
import SEO from "../components/SEO";
import styles from "../styles/Home.module.css";
import { getWorldCupScorers } from "../lib/footballData";

const Scorers = ({ scorers }) => {
  return (
    <>
      <SEO
        title="World Cup Top Scorers — World Cup Hub"
        description="Track the leading World Cup goal scorers, teams, nationalities, assists, and penalties."
      />

      <main className="page-shell">
        <header
          className="page-header image-banner"
          style={{ "--banner-image": "url('/assets/fifa.jpg')" }}
        >
          <h1 className="page-title">Top Scorers</h1>
          <p className="page-subtitle">
            Track the leading goal scorers of the tournament.
          </p>
        </header>

        {scorers.length === 0 ? (
          <div className="empty-state">
            <strong>No scorer data available yet.</strong>
            Top scorers will appear after matches are played.
          </div>
        ) : (
          <Box className="table-card">
            <Table className="dark-table" aria-label="World Cup top scorers">
              <TableHead>
                <TableRow>
                  <TableCell>Rank</TableCell>
                  <TableCell>Player</TableCell>
                  <TableCell>Team</TableCell>
                  <TableCell>Nationality</TableCell>
                  <TableCell>Goals</TableCell>
                  <TableCell>Assists</TableCell>
                  <TableCell>Penalties</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scorers.map((scorer, index) => (
                  <TableRow
                    key={`${scorer.playerId || scorer.playerName}-${index}`}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: 900 }}>
                        {scorer.playerId ? (
                          <Link
                            href={`/persons/${scorer.playerId}`}
                            className="player-detail-link"
                          >
                            {scorer.playerName || "Unknown Player"}
                          </Link>
                        ) : (
                          scorer.playerName || "Unknown Player"
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          minWidth: "170px",
                        }}
                      >
                        {scorer.teamCrest && (
                          <Avatar
                            src={scorer.teamCrest}
                            alt={`${scorer.teamName || "Team"} crest`}
                            sx={{
                              width: 26,
                              height: 26,
                              background: "rgba(232, 237, 245, 0.9)",
                            }}
                          />
                        )}
                        {scorer.teamName || "TBD"}
                      </Box>
                    </TableCell>
                    <TableCell>{scorer.playerNationality || "Unknown"}</TableCell>
                    <TableCell sx={{ color: "var(--color-gold)", fontWeight: 900 }}>
                      {scorer.goals ?? "-"}
                    </TableCell>
                    <TableCell>{scorer.assists ?? "-"}</TableCell>
                    <TableCell>{scorer.penalties ?? "-"}</TableCell>
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

export default Scorers;

export async function getServerSideProps() {
  try {
    const scorers = await getWorldCupScorers();

    return {
      props: { scorers },
    };
  } catch (error) {
    console.error(error);

    return {
      props: { scorers: [] },
    };
  }
}
