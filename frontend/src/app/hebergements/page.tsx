'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const Map = dynamic(() => import('@/components/HebMap'), { ssr: false });

export default function Hebergements() {
  const [hebergements, setHebergements] = useState([]);

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
      <Map listings={hebergements} />
    </main>
  );
}

