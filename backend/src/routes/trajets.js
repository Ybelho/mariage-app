const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET /trajets
router.get("/", async (_req, res) => {
  const trajets = await prisma.trajet.findMany({
    orderBy: { createdAt: "desc" },
    include: { passagers: true },
  });
  res.json(trajets);
});

// POST /trajets
router.post("/", async (req, res) => {
  const { nom, prenom, depart, arrivee, places } = req.body || {};

  if (
    !nom?.trim() || !prenom?.trim() || !depart?.trim() || !arrivee?.trim() ||
    typeof places !== "number" || places < 1 || places > 7
  ) {
    return res.status(400).json({ error: "Champs invalides" });
  }

  const trajet = await prisma.trajet.create({
    data: {
      nom: nom.trim(),
      prenom: prenom.trim(),
      depart: depart.trim(),
      arrivee: arrivee.trim(),
      places: Math.min(7, Math.max(1, Number(places))),
    },
  });

  res.status(201).json(trajet);
});

// POST /trajets/:id/rejoindre
router.post("/:id/rejoindre", async (req, res) => {
  const id = Number(req.params.id);
  const { nom, prenom } = req.body || {};

  if (!nom?.trim() || !prenom?.trim()) {
    return res.status(400).json({ error: "Nom/prénom requis" });
  }

  const trajet = await prisma.trajet.findUnique({
    where: { id },
    include: { passagers: true },
  });
  if (!trajet) return res.status(404).json({ error: "Trajet introuvable" });

  const placesPrises = trajet.passagers.length;
  if (placesPrises >= trajet.places) {
    return res.status(403).json({ error: "Trajet complet" });
  }

  // évite le doublon exact
  const exists = trajet.passagers.some(
    (p) => p.nom.toLowerCase() === nom.trim().toLowerCase() &&
           p.prenom.toLowerCase() === prenom.trim().toLowerCase()
  );
  if (exists) {
    return res.status(409).json({ error: "Déjà inscrit à ce trajet" });
  }

  const passenger = await prisma.passenger.create({
    data: {
      trajetId: trajet.id,
      nom: nom.trim(),
      prenom: prenom.trim(),
    },
  });

  res.json({ ok: true, passenger });
});

module.exports = router;
