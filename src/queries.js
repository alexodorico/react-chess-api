import db from "./db";

const getUser = async (req, res) => {
  const username = req.params.username;
  const gamesQuery = `SELECT * FROM results WHERE winner = $1 OR loser = $1`;
  const winsQuery = "SELECT COUNT(winner) FROM results WHERE winner = $1";
  const lossesQuery = "SELECT COUNT(loser) FROM results WHERE loser = $1";

  const { rows: games } = await db.query(gamesQuery, [username]);
  const { rows: wins } = await db.query(winsQuery, [username]);
  const { rows: losses } = await db.query(lossesQuery, [username]);

  return res.json({ games, wins, losses });
};

export default {
  getUser
};
