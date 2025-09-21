const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const archiver = require("archiver");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) => {
    const safe = file.originalname.replace(/\s+/g, "_");
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${unique}-${safe}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// GET /photos?author=Prénom
router.get("/", async (req, res) => {
  const session = req.sessionId;
  const author = (req.query.author || "").toString().trim();

  const where = author ? { nom: author } : {};
  const photos = await prisma.photo.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      comments: { orderBy: { createdAt: "asc" } },
      _count: { select: { likes: true } },
    },
  });

  const payload = await Promise.all(
    photos.map(async (p) => {
      const liked = await prisma.like.count({
        where: { photoId: p.id, session },
      });
      return {
        id: p.id,
        nom: p.nom,
        url: p.url,
        likes: p._count.likes,
        likedByMe: liked > 0,
        commentaires: p.comments.map((c) => c.text),
        createdAt: p.createdAt,
      };
    })
  );

  res.json(payload);
});

// POST /photos  (FormData: nom, file)
router.post("/", upload.single("file"), async (req, res) => {
  const nom = (req.body?.nom || "").trim();
  if (!req.file) return res.status(400).send("Fichier manquant (champ 'file').");
  if (!nom) {
    try { fs.unlinkSync(req.file.path); } catch {}
    return res.status(400).send("Le nom/prénom est requis (champ 'nom').");
  }

  const publicPath = `/uploads/${req.file.filename}`;
  const photo = await prisma.photo.create({ data: { nom, url: publicPath } });
  res.status(201).json(photo);
});

// POST /photos/:id/like (toggle)
router.post("/:id/like", async (req, res) => {
  const id = Number(req.params.id);
  const session = req.sessionId;

  const photo = await prisma.photo.findUnique({ where: { id } });
  if (!photo) return res.status(404).send("Photo introuvable.");

  const exists = await prisma.like.findFirst({
    where: { photoId: id, session },
  });

  if (exists) {
    await prisma.like.delete({ where: { id: exists.id } });
  } else {
    await prisma.like.create({ data: { photoId: id, session } });
  }

  const likes = await prisma.like.count({ where: { photoId: id } });
  const likedByMe = !exists;

  res.json({ ok: true, likes, likedByMe });
});

// POST /photos/:id/comment { text }
router.post("/:id/comment", async (req, res) => {
  const id = Number(req.params.id);
  const text = (req.body?.text || "").trim();
  const photo = await prisma.photo.findUnique({ where: { id } });
  if (!photo) return res.status(404).send("Photo introuvable.");
  if (!text) return res.status(400).send("Commentaire vide.");

  await prisma.comment.create({ data: { photoId: id, text } });
  res.json({ ok: true });
});

// GET /photos/author/:nom/zip → ZIP de toutes ses photos
router.get("/author/:nom/zip", async (req, res) => {
  const nom = req.params.nom;
  const photos = await prisma.photo.findMany({
    where: { nom },
    orderBy: { createdAt: "asc" },
  });
  if (!photos.length) return res.status(404).send("Aucune photo.");

  res.setHeader("Content-Type", "application/zip");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${encodeURIComponent(nom)}-photos.zip"`
  );

  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.on("error", (err) => { throw err; });
  archive.pipe(res);

  for (const p of photos) {
    // p.url = /uploads/xxx.jpg
    const filePath = path.join(UPLOAD_DIR, path.basename(p.url));
    if (fs.existsSync(filePath)) {
      archive.file(filePath, { name: path.basename(filePath) });
    }
  }

  archive.finalize();
});

module.exports = router;
