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
    const text = "SELECT * FROM users WHERE id = $1";
    const { rows } = await db.query(text, [decoded.userId]);

    if (!rows[0]) {
      return res.status(400).json({ error: "The token is expired" });
    }

    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    return res.status(400).json(error);
  }
};

const login = async (req, res) => {
  const query = "SELECT * FROM users WHERE username = $1 LIMIT 1";
  const { email, password } = req.body;

  const { rows } = await db.query(query, [email]);

  if (rows.length) {
    const isValid = await bcrypt.compare(password, rows[0].password);

    if (isValid) {
      const token = jwt.sign(
        {
          userId: rows[0].id
        },
        process.env.SECRET,
        {
          expiresIn: "7d"
        }
      );

      return res.status(200).json({ token });
    }

    return res.status(401).json({ error: "incorrect username or password" });
  }

  return res.status(401).json({ error: "incorrect username or password" });
};

const createUser = async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const query = "INSERT INTO users (email, password) VALUES ($1, $2)";

  db.query(query, [email, hash], error => {
    if (error) {
      throw error;
    }

    return res.status(201).send(`User added`);
  });
};

export default {
  verifyToken,
  login,
  createUser
};
