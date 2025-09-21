// backend/src/routes/rsvp.js
const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

// ---- "DB" mémoire simple (tu peux basculer sur Prisma plus tard)
const RSVPS = []; // on garde en mémoire le temps du dev

// ---- helpers env
const env = (k, d = "") => (process.env[k] ?? d).trim();

function buildTransport() {
  const host = env("SMTP_HOST");
  const port = parseInt(env("SMTP_PORT", "587"), 10);
  const secureEnv = env("SMTP_SECURE", "");
  // auto: si port=465 -> secure true, sinon prend la valeur SMTP_SECURE si fournie
  const secure = secureEnv
    ? /^true$/i.test(secureEnv)
    : port === 465;

  const user = env("SMTP_USER");
  const pass = env("SMTP_PASS");

  if (!host || !port || !user || !pass) {
    console.warn(
      "[RSVP] SMTP non configuré (host/port/user/pass). L'API ne plantera pas mais n'enverra pas d'email."
    );
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    // Office365 aime bien ça :
    requireTLS: port === 587,
    tls: {
      minVersion: "TLSv1.2",
      // rejectUnauthorized: true, // par défaut true ; laisse comme ça
    },
    pool: true,
  });
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,              // smtp.gmail.com
  port: Number(process.env.SMTP_PORT),      // 465 (secure:true) ou 587 (secure:false)
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,            // contact.mariage@gmail.com
    pass: process.env.SMTP_PASS,            // mot de passe d’application
  },
});

router.post("/", async (req, res) => {
  try {
    const {
      prenom = "",
      nom = "",
      email = "",
      telephone = "",
      adresse = "",
      presence,
      nbAdultes = 0,
      nbEnfants = 0,
      regime = "",
      allergies = "",
      besoinHebergement = false,
      transport = "aucun",
      chanson = "",
      message = "",
      consentPhoto = false,
    } = req.body || {};

    // validations de base
    if (!prenom || !nom || typeof presence !== "boolean") {
      return res.status(400).json({ error: "Champs obligatoires manquants." });
    }

    // on stocke en mémoire
    const id = Date.now();
    const rsvp = {
      id,
      prenom,
      nom,
      email,
      telephone,
      adresse,
      presence: !!presence,
      nbAdultes: Number(nbAdultes || 0),
      nbEnfants: Number(nbEnfants || 0),
      regime,
      allergies,
      besoinHebergement: !!besoinHebergement,
      transport,
      chanson,
      message,
      consentPhoto: !!consentPhoto,
      createdAt: new Date().toISOString(),
    };
    RSVPS.push(rsvp);

    // préparation email
    const toDefault = env("RSVP_TO", "charlotte.minette@gmail.com,yanni.belhocine@outlook.fr");
    const toList = toDefault
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    const from = env("SMTP_FROM", env("SMTP_USER")); // fallback sur SMTP_USER

    const subject = `RSVP – ${prenom} ${nom} – ${presence ? "Présent" : "Absent"}`;
    const html = `
      <h2>Nouveau RSVP</h2>
      <p><b>Prénom / Nom :</b> ${prenom} ${nom}</p>
      <p><b>Email :</b> ${email || "-"}</p>
      <p><b>Téléphone :</b> ${telephone || "-"}</p>
      <p><b>Adresse :</b> ${adresse || "-"}</p>
      <p><b>Présence :</b> ${presence ? "Oui" : "Non"}</p>
      <p><b>Adultes :</b> ${rsvp.nbAdultes} | <b>Enfants :</b> ${rsvp.nbEnfants}</p>
      <p><b>Régime :</b> ${regime || "-"}</p>
      <p><b>Allergies :</b> ${allergies || "-"}</p>
      <p><b>Besoin hébergement :</b> ${rsvp.besoinHebergement ? "Oui" : "Non"}</p>
      <p><b>Transport :</b> ${transport}</p>
      <p><b>Chanson :</b> ${chanson || "-"}</p>
      <p><b>Message :</b> ${message || "-"}</p>
      <p><b>Consentement photos :</b> ${rsvp.consentPhoto ? "Oui" : "Non"}</p>
      <hr />
      <small>RSVP #${id} — ${rsvp.createdAt}</small>
    `;

    // tentative d'envoi
    if (transporter && toList.length) {
      try {
        // facultatif : vérifier la connexion SMTP (utile au débogage)
        // await transporter.verify();

        await transporter.sendMail({
          from,
          to: toList,
          subject,
          html,
        });
      } catch (err) {
        console.error("[RSVP] Erreur envoi mail:", err);
        // ❗ On NE bloque PAS la réponse — le RSVP reste enregistré
      }
    }

    return res.status(201).json({ ok: true, rsvp });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ error: "Impossible d’envoyer le RSVP pour le moment." });
  }
});

// côté "admin" simple : récupérer la liste
router.get("/", (req, res) => {
  res.json(RSVPS.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)));
});

module.exports = router;
