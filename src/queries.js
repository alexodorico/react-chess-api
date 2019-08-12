import db from "./db";

const getUser = async (req, res) => {
  const username = req.params.username;
  const gamesQuery = `SELECT * FROM results WHERE winner = $1 OR loser = $1`;
  const winsQuery = "SELECT COUNT(winner) FROM results WHERE winner = $1";
  const lossesQuery = "SELECT COUNT(loser) FROM results WHERE loser = $1";

  try {
    const { rows: games } = await db.query(gamesQuery, [username]);
    const { rows: wins } = await db.query(winsQuery, [username]);
    const { rows: losses } = await db.query(lossesQuery, [username]);
    return res.status(200).json({ games, wins, losses });
  } catch (error) {
    return res.status(401).json("Oops! We had a problem getting this profile");
  }
};

const postResult = async (req, res) => {
  const { winner, loser } = req.body;
  const resultsQuery =
    "INSERT INTO results (winner, loser, time_ended) VALUES ($1, $2, $3)";
  const winnerQuery =
    "UPDATE users SET wins = (SELECT COUNT(winner) FROM results WHERE winner = $1) WHERE username = $1";
  const loserQuery =
    "UPDATE users SET losses = (SELECT COUNT(loser) FROM results WHERE loser = $1) WHERE username = $1";

  try {
    await db.query(resultsQuery, [winner, loser, Date.now()]);
    db.query(winnerQuery, [winner]);
    db.query(loserQuery, [loser]);
    return res.status(201).json({ status: "Updated Succesfully" });
  } catch (error) {
    return res.status(400).json({ error: "Something went wrong!" });
  }
};

const getLeaderboard = async (req, res) => {
  const query =
    "SELECT wins, losses, username FROM users GROUP BY username ORDER BY wins DESC, losses ASC LIMIT 100";

  try {
    const { rows } = await db.query(query);
    return res.status(201).json(rows);
  } catch (error) {
    res.state(400).json({ error: "Something went wrong!" });
  }
};

export default {
  getUser,
  postResult,
  getLeaderboard
};
