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
import PageState from "../components/PageState";
import styles from "../styles/Home.module.css";
import { getWorldCupStandings } from "../lib/footballData";

const Standings = ({ standings, dataError }) => {
  return (
    <>
      <SEO
        title="World Cup Standings — World Cup Hub"
        description="Follow World Cup group standings with points, wins, draws, losses, goals, and goal difference."
      />

      <main className="page-shell">
        <header
          className="page-header image-banner"
          style={{ "--banner-image": "url('/assets/fifa.jpg')" }}
        >
          <h1 className="page-title">Standings</h1>
          <p className="page-subtitle">
            Follow group standings throughout the tournament.
          </p>
        </header>

        {dataError ? (
          <PageState
            type="error"
            title="Standings could not be loaded."
            message={dataError}
            actionLabel="Try again"
            onAction={() => window.location.reload()}
          />
        ) : standings.length === 0 ? (
          <PageState
            title="No standings data available yet."
            message="Group tables will appear when football-data.org provides them."
          />
        ) : (
          standings.map((standing, standingIndex) => (
            <div key={`${standing.groupName}-${standingIndex}`}>
              <p className="table-scroll-hint">
                Swipe horizontally to view all columns.
              </p>
              <section
                className="table-card"
                style={{ marginBottom: "22px" }}
                tabIndex={0}
                aria-label={`Scrollable ${
                  standing.groupName || "group"
                } standings table`}
              >
                <Box sx={{ padding: "18px 18px 0" }}>
                <Typography
                  variant="h6"
                  sx={{ color: "var(--color-gold)", fontWeight: 900 }}
                >
                  {standing.groupName || "Standings"}
                </Typography>
                </Box>

                {!standing.table?.length ? (
                  <PageState
                    title={`No rows available for ${
                      standing.groupName || "this group"
                    }.`}
                    message="Standings will appear when the table is published."
                  />
                ) : (
                <Table
                  className="dark-table standings-table"
                  aria-label={`${standing.groupName || "Group"} standings`}
                >
                <TableHead>
                  <TableRow>
                    <TableCell>Pos</TableCell>
                    <TableCell>Team</TableCell>
                    <TableCell>PG</TableCell>
                    <TableCell>W</TableCell>
                    <TableCell>D</TableCell>
                    <TableCell>L</TableCell>
                    <TableCell>GF</TableCell>
                    <TableCell>GA</TableCell>
                    <TableCell>GD</TableCell>
                    <TableCell>Pts</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(standing.table || []).map((row, rowIndex) => (
                    <TableRow
                      key={`${standing.groupName}-${row.teamId || rowIndex}`}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{row.position ?? "—"}</TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            minWidth: "170px",
                          }}
                        >
                          {row.teamCrest && (
                            <Avatar
                              src={row.teamCrest}
                              alt={`${row.teamName || "Team"} crest`}
                              sx={{
                                width: 26,
                                height: 26,
                                background: "rgba(232, 237, 245, 0.9)",
                              }}
                            />
                          )}
                          <Typography sx={{ fontWeight: 800 }}>
                            {row.teamId ? (
                              <Link
                                href={`/teams/${row.teamId}`}
                                className="team-detail-link"
                              >
                                {row.teamName || "TBD"}
                              </Link>
                            ) : (
                              row.teamName || "TBD"
                            )}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{row.playedGames ?? "—"}</TableCell>
                      <TableCell>{row.won ?? "—"}</TableCell>
                      <TableCell>{row.draw ?? "—"}</TableCell>
                      <TableCell>{row.lost ?? "—"}</TableCell>
                      <TableCell>{row.goalsFor ?? "—"}</TableCell>
                      <TableCell>{row.goalsAgainst ?? "—"}</TableCell>
                      <TableCell>{row.goalDifference ?? "—"}</TableCell>
                      <TableCell sx={{ color: "var(--color-gold)", fontWeight: 900 }}>
                        {row.points ?? "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                </Table>
                )}
              </section>
            </div>
          ))
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

export default Standings;

export async function getServerSideProps() {
  try {
    const standings = await getWorldCupStandings();

    return {
      props: { standings, dataError: null },
    };
  } catch (error) {
    console.error(error);

    return {
      props: {
        standings: [],
        dataError: "Please check your connection and try again.",
      },
    };
  }
}
