"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Carousel({
  images = [],
  interval = 4000,
  autoplay = true,
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const startX = useRef(0);
  const delta = useRef(0);

  useEffect(() => {
    if (!autoplay || paused || images.length <= 1) return;
    const id = setInterval(() => setIndex(i => (i + 1) % images.length), interval);
    return () => clearInterval(id);
  }, [autoplay, paused, interval, images.length]);

  const prev = () => setIndex(i => (i - 1 + images.length) % images.length);
  const next = () => setIndex(i => (i + 1) % images.length);

  const onTouchStart = (e) => { startX.current = e.touches[0].clientX; };
  const onTouchMove  = (e) => { delta.current = e.touches[0].clientX - startX.current; };
  const onTouchEnd   = () => {
    if (Math.abs(delta.current) > 40) (delta.current < 0 ? next() : prev());
    delta.current = 0;
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-card shadow-soft ring-1 ring-grayx-200/60"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      role="region"
      aria-roledescription="carousel"
    >
      <div
        className="flex transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((img, idx) => (
          <div key={idx} className="relative h-[280px] sm:h-[420px] md:h-[520px] w-full flex-shrink-0">
            <Image
              src={img.src}
              alt={img.alt || `Slide ${idx + 1}`}
              fill
              sizes="100vw"
              className="object-cover"
              priority={idx === 0}
            />
          </div>
        ))}
      </div>

      {/* dégradé haut/bas pour la lisibilité du texte si tu en ajoutes */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

      {/* contrôles */}
      <button
        onClick={prev}
        aria-label="Précédent"
        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 text-grayx-800 hover:bg-white/90"
      >‹</button>
      <button
        onClick={next}
        aria-label="Suivant"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/70 p-2 text-grayx-800 hover:bg-white/90"
      >›</button>

      {/* puces */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            aria-label={`Aller à la diapo ${i + 1}`}
            className={`h-2.5 w-2.5 rounded-full ring-1 ring-white/70 ${i === index ? "bg-white" : "bg-white/50"}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}

