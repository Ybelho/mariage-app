"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Stay = {
  name: string;
  url?: string;
  images: string[];
};

const STAYS: Stay[] = [
  {
    name: "Les gîtes du Canal du Midi (A)",
    url: "https://www.booking.com/Share-flHKYje",
    images: Array.from({ length: 18 }, (_, i) => `/hebergements/gites-canal-a-${i + 1}.jpg`),
  },
  {
    name: "Les gîtes du Canal du Midi (B)",
    url: "https://www.booking.com/Share-X3BNaPw",
    images: Array.from({ length: 22 }, (_, i) => `/hebergements/gites-canal-b-${i + 1}.jpg`),
  },
  {
    name: "Pierre Lauragaise",
    url: "https://www.booking.com/Share-Rvzr6K0",
    images: Array.from({ length: 12 }, (_, i) => `/hebergements/pierre-lauragaise-${i + 1}.jpg`),
  },
  {
    name: "Péniche Dondon",
    url: "https://www.booking.com/Share-jXJRkpP",
    images: Array.from({ length: 25 }, (_, i) => `/hebergements/peniche-dondon-${i + 1}.jpg`),
  },
  {
    name: "Relais Fast Hotel",
    url: "https://www.booking.com/Share-Fm8NGVh",
    images: Array.from({ length: 31 }, (_, i) => `/hebergements/relais-fast-hotel-${i + 1}.jpg`),
  },
  {
    name: "Chez Luis et David",
    url: "https://www.booking.com/Share-zTsjdo",
    images: Array.from({ length: 20 }, (_, i) => `/hebergements/chez-luis-david-${i + 1}.jpg`),
  },
  {
    name: "Les roulottes",
    url: "https://www.booking.com/Share-Z1Tzca",
    images: Array.from({ length: 35 }, (_, i) => `/hebergements/les-roulottes-${i + 1}.jpg`),
  },
  {
    name: "Blessure chambre",
    url: "https://www.booking.com/Share-9vY9pm",
    images: ["/hebergements/bessire-chambre-1.jpg"], // à compléter si d’autres photos
  },
  {
    name: "Loft and Spa d’Autan",
    url: "https://www.booking.com/Share-4KxRFDj",
    images: ["/hebergements/loft-spa-autan-1.jpg", "/hebergements/loft-spa-autan-2.jpg"], // à compléter
  },
  {
    name: "Élégance lauragaise",
    url: "https://www.booking.com/Share-wlk4X8",
    images: ["/hebergements/elegance-lauragaise-1.jpg"], // à compléter
  },
  {
    name: "Les pénates du pastel",
    images: ["/hebergements/penates-du-pastel-1.jpg"], // à compléter
  },
];

function StayCard({ stay }: { stay: Stay }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (stay.images.length <= 1) return;
    const id = setInterval(() => {
      setI((prev) => (prev + 1) % stay.images.length);
    }, 4000);
    return () => clearInterval(id);
  }, [stay.images.length]);

  const prev = () => setI((i - 1 + stay.images.length) % stay.images.length);
  const next = () => setI((i + 1) % stay.images.length);

  const src = stay.images[i] || "/hebergements/placeholder.jpg";

  return (
    <article className="card" style={{ overflow: "hidden" }}>
      <div style={{ position: "relative", height: 200, marginBottom: 10 }}>
        <Image
          src={src}
          alt={stay.name}
          fill
          className="object-cover"
          style={{ borderRadius: 8 }}
          sizes="(max-width: 600px) 100vw, 33vw"
          unoptimized
        />
        {stay.images.length > 1 && (
          <>
            <button onClick={prev} style={navBtnStyle("left")}>‹</button>
            <button onClick={next} style={navBtnStyle("right")}>›</button>
          </>
        )}
      </div>
      <h3 style={{ marginBottom: 6 }}>{stay.name}</h3>
      {stay.url ? (
        <a
          href={stay.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="btn"
          style={{ marginTop: 10, display: "inline-block" }}
        >
          Voir sur Booking
        </a>
      ) : (
        <span className="section-text" style={{ display: "inline-block", marginTop: 10 }}>
          Lien à venir
        </span>
      )}
    </article>
  );
}

const navBtnStyle = (side: "left" | "right"): React.CSSProperties => ({
  position: "absolute",
  top: "50%",
  [side]: 8,
  transform: "translateY(-50%)",
  background: "rgba(255,255,255,.9)",
  border: "none",
  borderRadius: "50%",
  padding: "4px 10px",
  cursor: "pointer",
  lineHeight: 1,
  fontSize: 18,
});

export default function HebergementsPage() {
  return (
    <main id="app-main">
      <section className="section">
        <div className="container">
          <h1 className="section-title">Hébergements</h1>
          <p className="section-text" style={{ maxWidth: 720 }}>
            Découvrez les hébergements disponibles pour le mariage et faites défiler les images pour un aperçu.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div
            className="cards"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            }}
          >
            {STAYS.map((s, idx) => (
              <StayCard key={idx} stay={s} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
