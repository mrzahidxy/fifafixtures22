import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import moment from "moment/moment";
import { Box } from "@mui/system";
import styles from "../styles/Home.module.css";

const fixtures = ({ fixtures }) => {
  return (
    <>
      <main>
        <Box sx={{ margin: "15px 10px" }}>
          <Typography
            variant="h6"
            style={{ textAlign: "center" }}
            className="title"
          >
            FULL FIXTURES
          </Typography>

          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Match</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Result</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fixtures?.map(
                  ({
                    DateUtc,
                    HomeTeam,
                    AwayTeam,
                    HomeTeamScore,
                    AwayTeamScore,
                  }, index) => (
                    <TableRow key={index}
                      // key={row.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>
                        {HomeTeam} VS {AwayTeam}
                      </TableCell>
                      <TableCell>
                        {moment(new Date(DateUtc)).format(
                          "dddd, MMM Do Y, h:mm A"
                        )}
                      </TableCell>
                      <TableCell>
                        {HomeTeamScore == null || AwayTeamScore == null ? (
                          "No Result Yet"
                        ) : (
                          <>
                            {HomeTeamScore} VS {AwayTeamScore}
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://www.linkedin.com/in/mrzahidxy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span
            style={{
              color: "#56042c",
              fontWeight: "600",
            }}
          >
            Zahid Hasan
          </span>
        </a>
      </footer>
    </>
  );
};

export default fixtures;

export async function getServerSideProps() {
  const data = await fetch(
    "https://fixturedownload.com/feed/json/fifa-world-cup-2022"
  ).then((res) => res.json());

  return {
    props: { fixtures: data },
  };
}
