import {
  getTeamDetails,
  getWorldCupMatches,
} from "../../../lib/footballData";

function isValidTeamId(id) {
  return typeof id === "string" && /^[1-9]\d*$/.test(id);
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;

  if (!isValidTeamId(id)) {
    return res.status(400).json({
      error: "Team ID must be a positive integer",
    });
  }

  try {
    const [team, fixtures] = await Promise.all([
      getTeamDetails(id),
      getWorldCupMatches(),
    ]);

    return res.status(200).json({ team, fixtures });
  } catch (error) {
    console.error("Football-Data team request failed:", error);

    if (String(error?.message || "").includes("404")) {
      return res.status(404).json({ error: "Team not found" });
    }

    return res.status(502).json({
      error: "Unable to load team details from Football-Data",
    });
  }
}
