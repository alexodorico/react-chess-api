require("dotenv").config();

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "./db";

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(400).send({ error: "No token provided" });
  }

  try {
    const decoded = await jwt.verify(token, process.env.SECRET);
    const query = "SELECT * FROM users WHERE username = $1";
    const { rows } = await db.query(query, [decoded.userId]);

    if (!rows[0]) {
      return res.status(400).json({ error: "The token is expired" });
    }

    req.userId = { id: decoded.userId };
    next();
  } catch (error) {
    return res.status(400).json(error);
  }
};

const login = async (req, res) => {
  const query = "SELECT * FROM users WHERE username = $1 LIMIT 1";
  const { username, password } = req.body;

  const { rows } = await db.query(query, [username], error => {
    if (error) {
      return res.status(400).json({
        error: "Oops! Something went wrong. Please try again in a sec."
      });
    }
  });

  if (rows.length) {
    const isValid = await bcrypt.compare(password, rows[0].password);

    if (isValid) {
      const token = jwt.sign(
        {
          userId: rows[0].userId
        },
        process.env.SECRET,
        {
          expiresIn: "7d"
        }
      );

      return res.status(200).json({ token });
    }

    return res
      .status(401)
      .json({ error: "Please double check your password and username" });
  }

  return res
    .status(401)
    .json({ error: "Please double check your password and username" });
};

const createUser = async (req, res) => {
  const { email, username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const query =
    "INSERT INTO users (email, username, password) VALUES ($1, $2, $3)";

  try {
    db.query(query, [email, username, hash]);
  } catch (error) {
    res.status(401).json({ error: "Oops! All fields are required!" });
  }

  return res.status(201).send("User added");
};

export default {
  verifyToken,
  login,
  createUser
};
