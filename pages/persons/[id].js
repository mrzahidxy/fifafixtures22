import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Avatar,
  Box,
  Paper,
  Typography,
} from "@mui/material";
import moment from "moment/moment";
import SEO from "../../components/SEO";
import PageState from "../../components/PageState";

const NOT_AVAILABLE = "Not available";

function displayValue(value) {
  return value === null || value === undefined || value === ""
    ? NOT_AVAILABLE
    : value;
}

function formatDate(value, includeTime = false) {
  if (!value) {
    return NOT_AVAILABLE;
  }

  const date = moment(value);

  if (!date.isValid()) {
    return value;
  }

  return date.format(includeTime ? "DD MMM YYYY, hh:mm A" : "DD MMM YYYY");
}

function formatContractDate(value) {
  if (!value) {
    return NOT_AVAILABLE;
  }

  if (/^\d{4}-\d{2}$/.test(value)) {
    return moment(value, "YYYY-MM").format("MMM YYYY");
  }

  if (/^\d{4}$/.test(value)) {
    return value;
  }

  return formatDate(value);
}

function DetailItem({ label, value, children }) {
  return (
    <div className="match-detail-item">
      <span className="eyebrow">{label}</span>
      <strong>{children || displayValue(value)}</strong>
    </div>
  );
}

function PlayerHeader({ person }) {
  const team = person?.currentTeam;

  return (
    <header className="page-header person-detail-header">
      <Box className="person-detail-heading">
        <Avatar
          src={team?.crest || ""}
          alt={`${team?.name || "Current team"} crest`}
          className="person-detail-team-crest"
          sx={{ background: "rgba(232, 237, 245, 0.9)" }}
        />
        <Box>
          <span className="eyebrow">
            {displayValue(person?.position)}
          </span>
          <h1 className="page-title">{displayValue(person?.name)}</h1>
          <Typography className="page-subtitle">
            {[person?.nationality, team?.name].filter(Boolean).join(" · ") ||
              NOT_AVAILABLE}
          </Typography>
        </Box>
      </Box>
    </header>
  );
}

function CompetitionList({ competitions }) {
  return (
    <Paper className="card match-detail-panel" elevation={0}>
      <h2 className="section-title match-detail-section-title">
        Running competitions
      </h2>

      {!competitions?.length ? (
        <PageState
          title="No running competitions available."
          message="Competition details were not included for this player's current team."
        />
      ) : (
        <div className="person-competition-grid">
          {competitions.map((competition, index) => (
            <article
              className="person-competition-card"
              key={`${competition?.id || competition?.code || "competition"}-${index}`}
            >
              <Avatar
                src={competition?.emblem || ""}
                alt={`${competition?.name || "Competition"} emblem`}
                className="person-competition-emblem"
                sx={{ background: "rgba(232, 237, 245, 0.9)" }}
              />
              <Box>
                <Typography className="match-title">
                  {displayValue(competition?.name)}
                </Typography>
                <Typography className="muted-text">
                  Code: {displayValue(competition?.code)}
                </Typography>
                <Typography className="muted-text">
                  Type: {displayValue(competition?.type)}
                </Typography>
                <Typography className="muted-text">
                  Emblem:{" "}
                  {competition?.emblem ? (
                    <a
                      className="person-detail-link"
                      href={competition.emblem}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View emblem
                    </a>
                  ) : (
                    NOT_AVAILABLE
                  )}
                </Typography>
              </Box>
            </article>
          ))}
        </div>
      )}
    </Paper>
  );
}

function PlayerDetails({ person }) {
  const team = person?.currentTeam;
  const area = team?.area;

  return (
    <>
      <PlayerHeader person={person} />

      <div className="match-detail-section-stack">
        <Paper className="card match-detail-panel" elevation={0}>
          <h2 className="section-title match-detail-section-title">
            Player information
          </h2>
          <div className="match-detail-meta-grid">
            <DetailItem label="Name" value={person?.name} />
            <DetailItem label="First name" value={person?.firstName} />
            <DetailItem label="Last name" value={person?.lastName} />
            <DetailItem
              label="Date of birth"
              value={formatDate(person?.dateOfBirth)}
            />
            <DetailItem label="Nationality" value={person?.nationality} />
            <DetailItem label="Position" value={person?.position} />
            <DetailItem label="Shirt number" value={person?.shirtNumber} />
            <DetailItem
              label="Last updated"
              value={formatDate(person?.lastUpdated, true)}
            />
          </div>
        </Paper>

        <Paper className="card match-detail-panel" elevation={0}>
          <h2 className="section-title match-detail-section-title">
            Current team
          </h2>
          <Box className="person-team-summary">
            <Avatar
              src={team?.crest || ""}
              alt={`${team?.name || "Current team"} crest`}
              className="match-detail-competition-emblem"
              sx={{ background: "rgba(232, 237, 245, 0.9)" }}
            />
            <div className="match-detail-meta-grid">
              <DetailItem label="Name">
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
              </DetailItem>
              <DetailItem label="Short name" value={team?.shortName} />
              <DetailItem label="TLA" value={team?.tla} />
              <DetailItem label="Venue" value={team?.venue} />
              <DetailItem label="Founded" value={team?.founded} />
              <DetailItem label="Club colors" value={team?.clubColors} />
              <DetailItem label="Crest">
                {team?.crest ? (
                  <a
                    className="person-detail-link"
                    href={team.crest}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View crest
                  </a>
                ) : (
                  NOT_AVAILABLE
                )}
              </DetailItem>
              <DetailItem label="Website">
                {team?.website ? (
                  <a
                    className="person-detail-link"
                    href={team.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {team.website}
                  </a>
                ) : (
                  NOT_AVAILABLE
                )}
              </DetailItem>
            </div>
          </Box>
        </Paper>

        <Paper className="card match-detail-panel" elevation={0}>
          <h2 className="section-title match-detail-section-title">
            Team area
          </h2>
          <Box className="person-team-summary">
            <Avatar
              src={area?.flag || ""}
              alt={`${area?.name || "Team area"} flag`}
              className="match-detail-competition-emblem"
              sx={{ background: "rgba(232, 237, 245, 0.9)" }}
            />
            <div className="match-detail-meta-grid">
              <DetailItem label="Name" value={area?.name} />
              <DetailItem label="Code" value={area?.code} />
              <DetailItem label="Flag">
                {area?.flag ? (
                  <a
                    className="person-detail-link"
                    href={area.flag}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View flag
                  </a>
                ) : (
                  NOT_AVAILABLE
                )}
              </DetailItem>
            </div>
          </Box>
        </Paper>

        <CompetitionList competitions={team?.runningCompetitions} />

        <Paper className="card match-detail-panel" elevation={0}>
          <h2 className="section-title match-detail-section-title">
            Contract
          </h2>
          <div className="match-detail-meta-grid">
            <DetailItem
              label="Contract start"
              value={formatContractDate(person?.contract?.start)}
            />
            <DetailItem
              label="Contract until"
              value={formatContractDate(person?.contract?.until)}
            />
          </div>
        </Paper>
      </div>
    </>
  );
}

export default function PersonDetails() {
  const router = useRouter();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const rawId = router.query.id;
  const personId = Array.isArray(rawId) ? rawId[0] : rawId;

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (!personId || !/^[1-9]\d*$/.test(personId)) {
      setError("A valid positive person ID is required.");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadPerson() {
      setLoading(true);
      setError("");
      setNotFound(false);
      setPerson(null);

      try {
        const response = await fetch(`/api/persons/${personId}`, {
          signal: controller.signal,
        });
        const data = await response.json().catch(() => null);

        if (response.status === 404) {
          setNotFound(true);
          return;
        }

        if (!response.ok) {
          throw new Error(
            data?.error ||
              (response.status === 404
                ? "Player not found."
                : "Unable to load player details.")
          );
        }

        if (!data || typeof data !== "object" || Array.isArray(data)) {
          throw new Error("No player details were returned.");
        }

        setPerson(data);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message || "Unable to load player details.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadPerson();

    return () => controller.abort();
  }, [personId, router.isReady]);

  const pageTitle = person?.name
    ? `${person.name} — Player Details | World Cup Hub`
    : "Player Details — World Cup Hub";

  return (
    <>
      <SEO
        title={pageTitle}
        description="View player profile, current team, competitions, and contract information."
      />

      <main className="page-shell">
        <Link href="/fixtures" className="back-link">
          ← Back to Matches
        </Link>

        {loading ? (
          <PageState
            type="loading"
            title="Loading player details..."
            message="Fetching the latest available player information."
          />
        ) : notFound ? (
          <PageState
            type="not-found"
            title="Player not found."
            message="Check the player link or return to the fixtures page."
            actionLabel="View fixtures"
            actionHref="/fixtures"
          />
        ) : error ? (
          <PageState
            type="error"
            title="Player details could not be loaded."
            message={error}
            actionLabel="Try again"
            onAction={() => window.location.reload()}
          />
        ) : !person ? (
          <PageState
            title="No player details available."
            message="Football-Data did not return information for this player."
          />
        ) : (
          <PlayerDetails person={person} />
        )}
      </main>
    </>
  );
}
