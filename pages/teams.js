import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import moment from "moment/moment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import styles from "../styles/Home.module.css";

const teams = ({ fixtures }) => {
  const [selectedCountry, setSelectedCountry] = useState("Brazil");
  const countries = fixtures.map(({ HomeTeam }) => HomeTeam);

  const uniqueCountries = countries.filter(function onlyUnique(
    value,
    index,
    self
  ) {
    return self.indexOf(value) === index;
  });
  const selectedCountryGame = fixtures.filter(
    ({ HomeTeam, AwayTeam }) =>
      HomeTeam.toLowerCase() == selectedCountry.toLocaleLowerCase() ||
      AwayTeam.toLowerCase() == selectedCountry.toLocaleLowerCase()
  );

  return (
    <>
      <main>
        <Card>
          <CardMedia
            component="img"
            height="300"
            image="../assets/teams.jpg"
            alt="fifa2022"
            sx={{
              objectFit: "cover",
            }}
          />
        </Card>

        <Box sx={{ margin: "15px 10px" }}>
          <Box
            className="action-from"
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <Typography
              variant="h6"
              style={{ textAlign: "center", color: "#56042C" }}
              className="title"
            >
              {selectedCountry.toUpperCase()}'S MATCHES
            </Typography>
            <FormControl className="form">
              <InputLabel>Country</InputLabel>
              <Select
                sx={{ minWidth: "250px" }}
                autoWidth
                variant="outlined"
                value={selectedCountry}
                label="Country"
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                {uniqueCountries
                  .slice(0, 32)
                  .sort()
                  .map((country, index) => (
                    <MenuItem key={index} sx={{ minWidth: "300px" }} value={country}>
                      {country}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>

          <Box
            className="fix-container"
            sx={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
            }}
          >
            {selectedCountryGame?.map(
              ({ DateUtc, HomeTeam, AwayTeam, Group }, index) => (
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
              )
            )}
          </Box>
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

export default teams;

export async function getServerSideProps() {
  const data = await fetch(
    "https://fixturedownload.com/feed/json/fifa-world-cup-2022"
  ).then((res) => res.json());

  return {
    props: { fixtures: data },
  };
}
