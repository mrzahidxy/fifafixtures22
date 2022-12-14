import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Head from "next/head";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import styles from "../styles/Home.module.css";
import moment from "moment/moment";

export default function Home({ fixtures }) {
  //today's game
  const TodaysGame = () => {
    const todyasGame = fixtures.filter(
      (fixture) =>
        new Date(fixture.DateUtc)
          .toLocaleDateString("en-BD")
          .split("/")
          .join("") ==
        new Date().toLocaleDateString("en-BD").split("/").join("")
    );

    // console.log(todyasGame.length);
    return (
      <Box sx={{ margin: "15px 10px" }}>
        <Typography
          variant="h6"
          style={{ textAlign: "center" }}
          className="title"
        >
          {moment(new Date()).format("dddd, MMM Do Y")}
        </Typography>

        <Box
          className="fix-container"
          sx={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
          }}
        >
          {todyasGame.length === 0 ? (
            <Card
              sx={{
                padding: "30px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "red",
              }}
            >
              No Match Today
            </Card>
          ) : (
            todyasGame.map(({ DateUtc, HomeTeam, AwayTeam, Group }, index) => (
              <Card key={index}>
                <CardContent>
                  <Typography> {Group}</Typography>
                  <Typography
                    sx={{ color: "#56042C" }}
                    className="match-title"
                    component="div"
                    variant="h5"
                  >
                    {HomeTeam} VS {AwayTeam}
                  </Typography>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "3px",
                    }}
                  >
                    <AccessTimeIcon sx={{ color: "#FEC310" }} />
                    <Typography
                      sx={{ color: "#1077C3" }}
                      variant="subtitle1"
                      color="text.primary"
                      component="div"
                    >
                      {moment(new Date(DateUtc)).format(
                        "dddd, MMM Do Y, h:mm A"
                      )}
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </Box>
      </Box>
    );
  };

  const FullFixtures = () => {
    return (
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Match</TableCell>
              <TableCell>Date & Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fixtures?.map(
              ({
                DateUtc,

                HomeTeam,
                AwayTeam,
              }) => (
                <TableRow
                  // key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    {HomeTeam} VS {AwayTeam}
                  </TableCell>
                  <TableCell>
                    {moment(new Date(DateUtc)).format("dddd, MMM Do Y, h:mm A")}
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div stylet={{display:"flex", justifyContent: "space-between", alignItems: "space-between"}}>
      <Head>
        <title>FIFA22 Fixtures</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Card>
          <CardMedia
            component="img"
            height="300"
            image="../assets/fifa2022.jpg"
            alt="fifa2022"
            sx={{
              objectFit: "cover",
            }}
          />
        </Card>

        <TodaysGame />
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
    </div>
  );
}

export async function getServerSideProps() {
  const data = await fetch(
    "https://fixturedownload.com/feed/json/fifa-world-cup-2022"
  ).then((res) => res.json());

  return {
    props: { fixtures: data },
  };
}
