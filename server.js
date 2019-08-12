const app = require("express")();
const cors = require("cors");
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;

app.use(cors());

let queue = new Array();

app.post("/register", (req, res) => {});

app.post("/login", (req, res) => {});

app.post("/logout", (req, res) => {});

app.get("/player/:username", (req, res) => {});

app.post("/results", (req, res) => {});

app.get("/leaderboard", (req, res) => {});

app.get("/joingame", (req, res) => {
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

http.listen(port, _ => {
  console.log(`Listenin' on port ${port} 🔥`);
});
