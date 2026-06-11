import moment from "moment/moment";

export function formatMatchStatus(status) {
  const labels = {
    SCHEDULED: "Scheduled",
    TIMED: "Scheduled",
    LIVE: "Live",
    IN_PLAY: "Live",
    PAUSED: "Half Time",
    FINISHED: "Finished",
    POSTPONED: "Postponed",
    SUSPENDED: "Suspended",
    CANCELED: "Canceled",
  };

  return labels[status] || status || "Unknown";
}

export function formatMatchDateTime(utcDate) {
  if (!utcDate) {
    return "TBD";
  }

  return moment(new Date(utcDate)).format("DD MMM YYYY, hh:mm A");
}

export function formatMatchStage(stage) {
  if (!stage) {
    return "Unknown";
  }

  return stage.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (letter) =>
    letter.toUpperCase()
  );
}

export function formatMatchScore(homeScore, awayScore) {
  if (homeScore == null || awayScore == null) {
    return "Result pending";
  }

  return `${homeScore} - ${awayScore}`;
}
