"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import s from "./ig.module.css";

type Photo = {
  id: string;
  url: string;
  nom: string;
  likes: number;
  commentaires: string[];
  createdAt?: string;
  likedByMe?: boolean;
};

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const toArray = <T,>(v: any): T[] => {
  if (Array.isArray(v)) return v as T[];
  if (Array.isArray(v?.data)) return v.data as T[];
  if (Array.isArray(v?.items)) return v.items as T[];
  return [];
};

export default function Photos() {
  const [list, setList] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [nom, setNom] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [author, setAuthor] = useState<string | null>(null); // filtre courant
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchPhotos = async (who?: string | null) => {
    try {
      setLoading(true);
      const url = new URL(`${API}/photos`);
      if (who) url.searchParams.set("author", who);
      const res = await fetch(url.toString(), {
        cache: "no-store",
        credentials: "include",
      });
      const json = await res.json().catch(() => null);

      const mapped = toArray<any>(json).map((p): Photo => {
        const raw = String(p.url ?? p.imageUrl ?? "");
        const u = raw.startsWith("http") ? raw : `${API}${raw}`;
        return {
          id: String(p.id ?? p._id ?? crypto.randomUUID()),
          url: u,
          nom: String(p.nom ?? p.author ?? "Invité"),
          likes: Number(p.likes ?? 0),
          commentaires: Array.isArray(p.commentaires) ? p.commentaires : [],
          createdAt: p.createdAt,
          likedByMe: !!p.likedByMe,
        };
      });

      mapped.sort((a, b) =>
        a.createdAt && b.createdAt ? (a.createdAt < b.createdAt ? 1 : -1) : 0
      );

      setList(mapped);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos(author);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [author]);

  // stories dynamiques (depuis toutes les photos chargées)
  const authors = useMemo(() => {
    const seen = new Set<string>();
    const names: string[] = [];
    for (const p of list) {
      if (!seen.has(p.nom)) {
        seen.add(p.nom);
        names.push(p.nom);
      }
    }
    return names;
  }, [list]);

  // upload
  const onUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !nom.trim()) return;

    const fd = new FormData();
    fd.append("nom", nom);
    fd.append("file", file);

    const res = await fetch(`${API}/photos`, {
      method: "POST",
      body: fd,
      credentials: "include",
    });
    if (!res.ok) {
      alert("Échec de l’envoi 😕");
      return;
    }
    setNom("");
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
    // si filtré sur un auteur différent, on repasse sur "Tous" pour voir la nouvelle
    setAuthor(null);
    fetchPhotos(null);
  };

  const like = async (id: string) => {
    setList((curr) =>
      curr.map((x) =>
        x.id === id
          ? {
              ...x,
              likedByMe: !x.likedByMe,
              likes: x.likedByMe ? Math.max(0, x.likes - 1) : x.likes + 1,
            }
          : x
      )
    );
    try {
      await fetch(`${API}/photos/${id}/like`, {
        method: "POST",
        credentials: "include",
      });
      fetchPhotos(author);
    } catch {
      fetchPhotos(author);
    }
  };

  const comment = async (id: string, text: string) => {
    if (!text.trim()) return;
    await fetch(`${API}/photos/${id}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ text }),
    });
    fetchPhotos(author);
  };

  const initialsOf = (n: string) =>
    n.split(/\s+/).filter(Boolean).map((x) => x[0]?.toUpperCase()).slice(0, 2).join("");

  return (
    <main id="app-main">
      <section className="section">
        <div className="container center">
          <h1 className="h-script md">Galerie</h1>
          <p className="section-text">
            Partagez vos photos, likez et commentez ✨
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className={s.page}>
          <div className={s.wrap}>
            {/* STORIES / FILTRES */}
            <div className={s.stories} aria-label="stories">
              {/* Bouton "Tous" */}
              <div className={s.story} onClick={() => setAuthor(null)} title="Tous">
                <div className={s.storyRing}>
                  <div className={s.storyInner}>★</div>
                </div>
                <div className={s.storyName}>Tous</div>
              </div>
              {authors.length === 0 && (
                <div className={s.smallMuted}>Aucun auteur pour le moment</div>
              )}
              {authors.map((n) => (
                <div
                  className={s.story}
                  key={n}
                  title={n}
                  onClick={() => setAuthor(n)}
                >
                  <div className={s.storyRing}>
                    <div className={s.storyInner}>{initialsOf(n) || "?"}</div>
                  </div>
                  <div className={s.storyName}>{n}</div>
                </div>
              ))}
            </div>

            {/* "Tout télécharger" si auteur filtré */}
            {author && (
              <a
                className={s.downloadAll}
                href={`${API}/photos/author/${encodeURIComponent(author)}/zip`}
              >
                ⬇️ Tout télécharger – {author}
              </a>
            )}

            {/* UPLOADER */}
            <form className={s.upload} onSubmit={onUpload}>
              <input
                className={s.input}
                placeholder="Votre prénom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
              />
              <input
                className={s.file}
                type="file"
                accept="image/*"
                ref={fileRef}
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                required
              />
              <button className={s.btn} disabled={!file || !nom.trim()}>
                Publier
              </button>
            </form>

            {/* FEED */}
            {loading && <p className={s.smallMuted}>Chargement…</p>}
            {!loading && list.length === 0 && (
              <p className={s.empty}>
                Aucune photo {author ? `de ${author}` : ""} pour l’instant — soyez le premier ✨
              </p>
            )}

            {list.map((p) => (
              <article className={s.card} key={p.id}>
                <div className={s.top}>
                  <div className={s.user}>
                    <div className={s.avatarRing}>
                      <div className={s.avatarInner}>{initialsOf(p.nom) || "?"}</div>
                    </div>
                    <div className={s.username}>{p.nom}</div>
                  </div>
                  <span className={s.dot}>•••</span>
                </div>

                <div className={s.media}>
                  <Image
                    src={p.url || "/vercel.svg"}
                    alt={p.nom}
                    fill
                    className={s.img}
                    unoptimized
                  />
                </div>

                <div className={s.bottom}>
                  <div className={s.actions}>
                    <button
                      className={s.heart}
                      onClick={() => like(p.id)}
                      aria-pressed={p.likedByMe ? "true" : "false"}
                      title={p.likedByMe ? "Retirer le like" : "Aimer"}
                    >
                      {p.likedByMe ? "❤️" : "🤍"}
                    </button>
                    {p.url && (
                      <a className={s.link} href={p.url} download>
                        ⬇️ Télécharger
                      </a>
                    )}
                  </div>
                  <div className={s.likes}>
                    {p.likes} like{p.likes > 1 ? "s" : ""}
                  </div>

                  {p.commentaires?.length > 0 && (
                    <div className={s.commentsWrap}>
                      {p.commentaires.map((c, i) => (
                        <div className={s.comment} key={i}>
                          💬 {c}
                        </div>
                      ))}
                    </div>
                  )}

                  <form
                    className={s.add}
                    onSubmit={(e) => {
                      e.preventDefault();
                      const text = (e.currentTarget as any).comment?.value || "";
                      comment(p.id, text);
                      (e.currentTarget as any).reset();
                    }}
                  >
                    <input
                      className={s.addInput}
                      name="comment"
                      placeholder="Ajouter un commentaire…"
                    />
                    <button className={s.postBtn} type="submit">
                      Publier
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
