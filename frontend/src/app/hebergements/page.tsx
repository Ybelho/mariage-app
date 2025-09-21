'use client';

import { useEffect, useState } from 'react';

export default function Hebergements() {
  const [hebergements, setHebergements] = useState<any[]>([]);

  useEffect(() => {
    // source alternative ou JSON statique
    fetch('/api/hebergements?lat=42.9&lng=1.5')
      .then(res => res.json())
      .then(setHebergements);
  }, []);

  return (
    <main className="min-h-screen bg-pink-50 p-4 font-sans">
      <h1 className="text-3xl text-sage font-bold mb-4 text-center">
        Hébergements autour de Camboyer
      </h1>

      {/* Remplace la carte par une simple liste */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hebergements.map(h => (
          <div key={h.id} className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-semibold">{h.title}</h2>
            {h.price && <p className="text-gray-600">{h.price} €/nuit</p>}
            {h.link && (
              <a
                href={h.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Voir l’annonce
              </a>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
