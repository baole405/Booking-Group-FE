/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import cors from "cors";
import express from "express";
import { loginMock, usersMockData } from "./users.mockapi.js";

const app = express();
const corsOptions = {
  origin: ["http://localhost:4222", "http://localhost:5173", "http://localhost:4200"],
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

const host = process.env.HOST ?? "localhost";
const port = process.env.PORT ? Number(process.env.PORT) : 3333;

// API Routes
app.get("/api", (req, res) => {
  res.send({ message: "Welcome to FE-SWD Mock API!" });
});

// Users API
app.get("/api/users", (req, res) => {
  res.json(usersMockData);
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = loginMock(email, password);
  if (user) {
    res.json(user);
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
