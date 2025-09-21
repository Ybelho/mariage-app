"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function Covoiturage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    depart: "",
    arrivee: "",
    places: 1,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/trajets`, {
        cache: "no-store",
        credentials: "include",
      });
      const json = await res.json().catch(() => []);
      setList(Array.isArray(json) ? json : []);
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const propose = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/trajets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const err = await res.text();
      alert(`Erreur: ${err}`);
      return;
    }
    setForm({ nom: "", prenom: "", depart: "", arrivee: "", places: 1 });
    fetchData();
  };

  const join = async (id) => {
    const nom = prompt("Votre nom ?");
    const prenom = prompt("Votre prénom ?");
    if (!nom || !prenom) return;

    const res = await fetch(`${API}/trajets/${id}/rejoindre`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ nom, prenom }),
    });

    if (!res.ok) {
      const err = await res.text();
      alert(err || "Trajet complet ou erreur.");
      return;
    }
    fetchData();
  };

  return (
    <div className="container" style={{ padding: "36px 0 80px" }}>
      <h1 className="h-script md">Covoiturage</h1>
      <p className="section-text">Proposez un trajet ou rejoignez un conducteur.</p>

      {/* Proposer un trajet */}
      <form onSubmit={propose} className="section" style={{ padding: "18px 0" }}>
        <div className="cards" style={{ gridTemplateColumns: "1fr" }}>
          <div className="card">
            <h3>Je propose un trajet</h3>
            <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
              <input
                className="input"
                placeholder="Prénom"
                value={form.prenom}
                onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                required
              />
              <input
                className="input"
                placeholder="Nom"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                required
              />
              <input
                className="input"
                placeholder="Ville de départ"
                value={form.depart}
                onChange={(e) => setForm({ ...form, depart: e.target.value })}
                required
              />
              <input
                className="input"
                placeholder="Ville d'arrivée"
                value={form.arrivee}
                onChange={(e) => setForm({ ...form, arrivee: e.target.value })}
                required
              />
              <input
                className="input"
                type="number"
                min={1}
                max={7}
                value={form.places}
                onChange={(e) =>
                  setForm({ ...form, places: Math.max(1, Number(e.target.value || 1)) })
                }
                required
              />
              <button className="btn" style={{ justifySelf: "start" }}>
                Publier le trajet
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Liste des trajets */}
      <h2 className="section-title" style={{ marginTop: 12 }}>
        Trajets disponibles
      </h2>

      {loading && <p className="section-text">Chargement…</p>}
      {!loading && list.length === 0 && (
        <p className="section-text">Aucun trajet pour le moment.</p>
      )}

      <div className="cards" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {list.map((t) => {
          const placesPrises = Array.isArray(t.passagers) ? t.passagers.length : 0;
          const placesRestantes = Math.max(0, (t.places || 0) - placesPrises);
          const plein = placesRestantes <= 0;

          return (
            <div className="card" key={t.id ?? `${t.depart}-${t.arrivee}`}>
              <h3>
                {t.depart} → {t.arrivee}
              </h3>

              <p className="section-text" style={{ margin: "6px 0 10px" }}>
                Conducteur : {t.prenom} {t.nom} — Places restantes : {placesRestantes}
              </p>

              {placesPrises > 0 ? (
                <ul className="section-text" style={{ paddingLeft: 18 }}>
                  {t.passagers.map((p) => (
                    <li key={p.id ?? `${p.prenom}-${p.nom}`}>
                      {p.prenom} {p.nom}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="section-text">Aucun passager pour le moment.</p>
              )}

              {!plein ? (
                <button className="btn btn-ghost" onClick={() => join(t.id)}>
                  Rejoindre
                </button>
              ) : (
                <span className="section-text" style={{ opacity: 0.75 }}>
                  Trajet complet
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
