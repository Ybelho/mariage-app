const express = require("express");
const bcrypt = require("bcrypt");
const prisma = require("../db");
const { sign } = require("../middleware/auth");

const router = express.Router();

// POST /auth/register { username, password }
router.post("/register", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: "username & password required" });
  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({ data: { username, password: hash, role: "USER" } });
    return res.status(201).json({ token: sign(user), user: { id: user.id, username: user.username, role: user.role } });
  } catch {
    return res.status(400).json({ error: "username already taken" });
  }
});

// POST /auth/login { username, password }
router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  return res.json({ token: sign(user), user: { id: user.id, username: user.username, role: user.role } });
});

// (optionnel) POST /auth/promote (à désactiver en prod) – promotion en ADMIN
// Protège-la par un secret hors bande si tu l'utilises.
router.post("/promote", async (req, res) => {
  const { username } = req.body || {};
  if (!username) return res.status(400).json({ error: "username required" });
  try {
    const user = await prisma.user.update({ where: { username }, data: { role: "ADMIN" } });
    res.json({ id: user.id, username: user.username, role: user.role });
  } catch {
    res.status(404).json({ error: "User not found" });
  }
});

module.exports = router;
