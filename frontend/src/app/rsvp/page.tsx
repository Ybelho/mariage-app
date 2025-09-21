"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function RSVP() {
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setErr(null);
    setOk(false);

    const fd = new FormData(e.currentTarget);
    // Map vers JSON
    const body = {
      prenom: String(fd.get("prenom") || ""),
      nom: String(fd.get("nom") || ""),
      email: String(fd.get("email") || ""),
      telephone: String(fd.get("telephone") || ""),
      adresse: String(fd.get("adresse") || ""),
      presence: String(fd.get("presence") || "oui") === "oui",
      nbAdultes: Number(fd.get("adultes") || 0),
      nbEnfants: Number(fd.get("enfants") || 0),
      regime: String(fd.get("regime") || ""),
      allergies: String(fd.get("allergies") || ""),
      besoinHebergement: fd.get("hebergement") === "on",
      transport: String(fd.get("transport") || "aucun"),
      chanson: String(fd.get("chanson") || ""),
      message: String(fd.get("message") || ""),
      consentPhoto: fd.get("consent") === "on",
    };

    try {
      const res = await fetch(`${API}/rsvps`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      setOk(true);
      (e.currentTarget as any).reset();
    } catch (er: any) {
      setErr(er?.message || "Échec de l’envoi.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main id="app-main" className="section">
      <div className="container">
        <h1 className="h-script md">RSVP</h1>
        <p className="section-text">
          Merci de confirmer votre présence ✨
        </p>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, marginTop: 16 }}>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
            <input className="input" name="prenom" placeholder="Prénom" required />
            <input className="input" name="nom" placeholder="Nom" required />
          </div>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
            <input className="input" type="email" name="email" placeholder="Email" required />
            <input className="input" name="telephone" placeholder="Téléphone" />
          </div>
          <input className="input" name="adresse" placeholder="Adresse" />

          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
            <select className="input" name="presence" defaultValue="oui">
              <option value="oui">Je serai présent(e)</option>
              <option value="non">Je ne pourrai pas venir</option>
            </select>
            <select className="input" name="transport" defaultValue="aucun">
              <option value="aucun">Transport : aucun</option>
              <option value="train">Train</option>
              <option value="voiture">Voiture</option>
              <option value="avion">Avion</option>
            </select>
          </div>

          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
            <input className="input" type="number" min={0} name="adultes" placeholder="Nombre d'adultes" />
            <input className="input" type="number" min={0} name="enfants" placeholder="Nombre d'enfants" />
          </div>

          <input className="input" name="regime" placeholder="Régime alimentaire" />
          <input className="input" name="allergies" placeholder="Allergies" />
          <input className="input" name="chanson" placeholder="Votre chanson (optionnel)" />
          <textarea className="input" name="message" placeholder="Un petit mot ?" rows={4} />
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" name="hebergement" /> Besoin d’un hébergement ?
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" name="consent" /> J’autorise l’utilisation de mes photos
          </label>

          <button className="btn" disabled={sending}>
            {sending ? "Envoi…" : "Envoyer ma réponse"}
          </button>
        </form>

        {err && <p className="section-text" style={{ color: "#d33", marginTop: 12 }}>{err}</p>}

        {ok && (
          <div
            role="alert"
            style={{
              marginTop: 14, padding: "12px 14px", borderRadius: 12,
              background: "#eaf7ea", color: "#205c2f",
              border: "1px solid #cde9ce"
            }}
          >
            🎉 Merci ! Votre réponse a bien été enregistrée et transmise.
          </div>
        )}
      </div>
    </main>
  );
}
