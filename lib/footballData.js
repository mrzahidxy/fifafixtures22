export const BASE_URL = "https://api.football-data.org/v4";

export async function footballDataFetch(path) {
  const token = process.env.FOOTBALL_DATA_API_TOKEN;

  if (!token) {
    throw new Error("Missing FOOTBALL_DATA_API_TOKEN environment variable");
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "X-Auth-Token": token,
    },
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(
      `football-data.org request failed: ${response.status} ${response.statusText} ${responseText}`
    );
  }

  return response.json();
}

function normalizeMatch(match) {
  return {
    id: match.id,
    utcDate: match.utcDate,
    status: match.status || "Unknown",
    stage: match.stage || "Unknown",
    group: match.group || match.stage || "Unknown",
    homeTeam: match.homeTeam?.name || "TBD",
    awayTeam: match.awayTeam?.name || "TBD",
    homeScore: match.score?.fullTime?.home ?? null,
    awayScore: match.score?.fullTime?.away ?? null,
  };
}

export async function getWorldCupMatches() {
  const data = await footballDataFetch("/competitions/WC/matches");
  return (data.matches || []).map(normalizeMatch);
}

function normalizeTeam(team) {
  return {
    id: team.id,
    name: team.name || "TBD",
    shortName: team.shortName,
    tla: team.tla,
    crest: team.crest,
    address: team.address,
    website: team.website,
    founded: team.founded,
    clubColors: team.clubColors,
    venue: team.venue,
  };
}

export async function getWorldCupTeams() {
  const data = await footballDataFetch("/competitions/WC/teams");
  return (data.teams || []).map(normalizeTeam);
}

export async function getTeamDetails(teamId) {
  const data = await footballDataFetch(`/teams/${teamId}`);

  return {
    id: data.id,
    name: data.name || "Unknown Team",
    shortName: data.shortName || data.name || "Unknown",
    tla: data.tla || "",
    crest: data.crest || "",
    address: data.address || "",
    website: data.website || "",
    founded: data.founded || null,
    clubColors: data.clubColors || "",
    venue: data.venue || "",
    coach: data.coach
      ? {
          id: data.coach.id || null,
          name: data.coach.name || "Unknown Coach",
          nationality: data.coach.nationality || "",
          dateOfBirth: data.coach.dateOfBirth || "",
        }
      : null,
    squad: Array.isArray(data.squad)
      ? data.squad.map((player) => ({
          id: player.id,
          name: player.name || "Unknown Player",
          position: player.position || "Not available",
          dateOfBirth: player.dateOfBirth || "",
          nationality: player.nationality || "Not available",
        }))
      : [],
    runningCompetitions: Array.isArray(data.runningCompetitions)
      ? data.runningCompetitions
      : [],
  };
}

function normalizeStanding(standing) {
  return {
    groupName: standing.group || standing.stage || "Standings",
    table: (standing.table || []).map((row) => ({
      position: row.position ?? "-",
      teamId: row.team?.id,
      teamName: row.team?.name || "TBD",
      teamShortName: row.team?.shortName,
      teamCrest: row.team?.crest,
      playedGames: row.playedGames ?? "-",
      won: row.won ?? "-",
      draw: row.draw ?? "-",
      lost: row.lost ?? "-",
      points: row.points ?? "-",
      goalsFor: row.goalsFor ?? "-",
      goalsAgainst: row.goalsAgainst ?? "-",
      goalDifference: row.goalDifference ?? "-",
    })),
  };
}

export async function getWorldCupStandings() {
  const data = await footballDataFetch("/competitions/WC/standings");
  return (data.standings || []).map(normalizeStanding);
}

function normalizeScorer(scorer) {
  return {
    playerId: scorer.player?.id,
    playerName: scorer.player?.name || "Unknown Player",
    playerFirstName: scorer.player?.firstName,
    playerLastName: scorer.player?.lastName,
    playerNationality: scorer.player?.nationality || "Unknown",
    playerDateOfBirth: scorer.player?.dateOfBirth,
    teamId: scorer.team?.id,
    teamName: scorer.team?.name || "TBD",
    teamShortName: scorer.team?.shortName,
    teamCrest: scorer.team?.crest,
    goals: scorer.goals ?? "-",
    assists: scorer.assists ?? null,
    penalties: scorer.penalties ?? null,
  };
}

export async function getWorldCupScorers() {
  const data = await footballDataFetch("/competitions/WC/scorers");
  return (data.scorers || []).map(normalizeScorer);
}
