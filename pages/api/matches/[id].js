const FOOTBALL_DATA_BASE_URL = "https://api.football-data.org/v4";

function isValidMatchId(id) {
  return typeof id === "string" && /^[1-9]\d*$/.test(id);
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;

  if (!id) {
    return res.status(400).json({ error: "Match ID is required" });
  }

  if (!isValidMatchId(id)) {
    return res
      .status(400)
      .json({ error: "Match ID must be a positive integer" });
  }

  const apiKey = process.env.FOOTBALL_DATA_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "Football-Data API key is not configured",
    });
  }

  try {
    const response = await fetch(`${FOOTBALL_DATA_BASE_URL}/matches/${id}`, {
      headers: {
        "X-Auth-Token": apiKey,
      },
    });

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : null;

    if (response.status === 404) {
      return res.status(404).json({ error: "Match not found" });
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error:
          data?.message ||
          data?.error ||
          "Football-Data could not return this match",
      });
    }

    if (!data || typeof data !== "object") {
      return res.status(502).json({
        error: "Football-Data returned an empty response",
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Football-Data match request failed:", error);

    return res.status(502).json({
      error: "Unable to reach Football-Data",
    });
  }
}
