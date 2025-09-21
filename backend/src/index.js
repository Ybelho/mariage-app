// backend/src/index.js
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

/* 1) Contexte hosting (Render/Nginx proxies) */
app.set("trust proxy", 1);

/* 2) CORS — autorise localhost + domaines fournis via env */
const FRONT_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.FRONTEND_URL,         // ex: https://ton-site.vercel.app
  process.env.FRONTEND_URL_ALT,     // ex: https://www.ton-domaine.com
].filter(Boolean);

const corsOptions = {
  origin: (origin, cb) => {
    // autorise requêtes server-to-server (sans Origin) et les origins listés
    if (!origin || FRONT_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS: origin non autorisée: ${origin}`));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // preflight

/* 3) Body parser */
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

/* 4) Static uploads */
const uploadDir = process.env.UPLOAD_DIR || "uploads";
const ABS_UPLOAD_DIR = path.resolve(__dirname, "..", uploadDir);
fs.mkdirSync(ABS_UPLOAD_DIR, { recursive: true });
app.use(`/${uploadDir}`, express.static(ABS_UPLOAD_DIR));

/* 5) Routes */
app.use("/photos", require("./routes/photos"));
app.use("/trajets", require("./routes/trajets"));
app.use("/rsvps", require("./routes/rsvp"));

/* 6) Health & Not Found */
app.get("/", (_, res) => res.json({ ok: true }));
app.use((req, res) => res.status(404).json({ error: "Not found" }));

/* 7) Error handler global */
app.use((err, req, res, next) => {
  console.error("[API ERROR]", err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

/* 8) Start */
app.listen(PORT, () => {
  console.log(`✅ API on http://localhost:${PORT}`);
  if (FRONT_ORIGINS.length) {
    console.log("CORS allowed origins:", FRONT_ORIGINS.join(", "));
  }
});
