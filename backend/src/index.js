const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const session = require("./middleware/session");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);
app.use(session());
app.use(express.json());

const uploadDir = process.env.UPLOAD_DIR || "uploads";
app.use(`/${uploadDir}`, express.static(path.join(__dirname, "..", uploadDir)));

app.use("/photos", require("./routes/photos"));
app.use("/trajets", require("./routes/trajets"));
app.use("/rsvps", require("./routes/rsvp")); // <— IMPORTANT

app.get("/", (_, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`✅ API on http://localhost:${PORT}`);
});
