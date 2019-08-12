import express from "express";
const app = express();
const http = require("http").Server(app);
import bodyParser from "body-parser";
import cors from "cors";
import auth from "./auth";
import queries from "./queries";
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let queue = new Array();

app.post("/register", auth.createUser);

app.post("/login", auth.login);

app.post("/result", auth.verifyToken, queries.postResult);

app.get("/profile/:username", auth.verifyToken, queries.getUser);

app.get("/leaderboard", auth.verifyToken, queries.getLeaderboard);

app.get("/joingame", auth.verifyToken, (req, res) => {
  if (queue.length < 1) {
    const gameId = (Math.random() + 1).toString(36).slice(2, 18);
    queue.push(gameId);
    res.json({ id: queue[0], color: "black" });
  } else {
    res.json({ id: queue[0], color: "white" });
    queue = new Array();
  }

  const game = io.of(`/${queue[0]}`);
  game.on("connection", socket => {
    socket.on("action", msg => {
      socket.broadcast.emit("action", msg);
    });
  });
});

app.listen(port, _ => console.log(`Listenin' on port ${port} 🔥`));
