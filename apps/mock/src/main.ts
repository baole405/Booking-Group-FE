/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import cors from "cors";
import express from "express";
import { createForumPost, getAllForumPosts, getForumPostById } from "./forum.mockapi.js";
import { createGroup, deleteGroup, getAllGroups, getGroupById, updateGroup } from "./group.mockapi.js";
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

// ========== API Routes ==========

// Root test
app.get("/api", (req, res) => {
  res.send({ message: "Welcome to FE-SWD Mock API!" });
});

// ---------- Users API ----------
app.get("/api/users", (req, res) => {
  res.json(usersMockData);
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: 400,
      message: "Email and password are required",
      data: null,
    });
  }

  const result = loginMock(email, password);
  if (result.status === 200) {
    return res.status(200).json(result);
  }
  return res.status(401).json(result);
});

// ---------- Forum API ----------
app.get("/api/forum", (req, res) => {
  res.json(getAllForumPosts());
});

app.get("/api/forum/:id", (req, res) => {
  const id = Number(req.params.id);
  const post = getForumPostById(id);
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ message: "Post not found" });
  }
});

app.post("/api/forum", (req, res) => {
  const { authorName, groupName, postType, title, content, avatarUrl, imageUrl } = req.body;

  if (!authorName || !postType || !title || !content) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newPost = createForumPost({
    id: 0, // auto assign trong mock
    authorName,
    groupName,
    postType,
    title,
    content,
    avatarUrl,
    imageUrl,
  });

  res.status(201).json(newPost);
});

// ---------- Group API ----------
app.get("/api/groups", (req, res) => {
  res.json(getAllGroups());
});

app.get("/api/groups/:id", (req, res) => {
  const id = req.params.id;
  res.json(getGroupById(id));
});

app.post("/api/groups", (req, res) => {
  const newGroup = req.body;
  if (!newGroup.id || !newGroup.name) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  res.status(201).json(createGroup(newGroup));
});

app.put("/api/groups/:id", (req, res) => {
  const id = req.params.id;
  res.json(updateGroup(id, req.body));
});

app.delete("/api/groups/:id", (req, res) => {
  const id = req.params.id;
  res.json(deleteGroup(id));
});
// ---------- Server listen ----------
app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
