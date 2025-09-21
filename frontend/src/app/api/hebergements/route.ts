// src/app/api/hebergements/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const lat = searchParams.get("lat") ?? "42.9";
  const lng = searchParams.get("lng") ?? "1.5";

  // radiusKm arrive en string -> on parse en nombre et on borne
  const radiusKmRaw = searchParams.get("radiusKm");
  const radiusKm = Math.max(
    0.1,
    Math.min(50, Number.parseFloat(radiusKmRaw ?? "10") || 10)
  );
  const radiusMeters = Math.round(radiusKm * 1000);

  const apiUrl =
    "https://public.opendatasoft.com/api/records/1.0/search/?" +
    new URLSearchParams({
      dataset: "air-bnb-listings",
      rows: "100",
      // format attendu: lat,lng,radius_en_mètres
      "geofilter.distance": `${lat},${lng},${radiusMeters}`,
    }).toString();

  const res = await fetch(apiUrl, { cache: "no-store" });
  if (!res.ok) return NextResponse.json([], { status: 200 });

  const json = await res.json();
  const listings = (json.records || [])
    .map((r: any) => ({
      id: r.recordid,
      title: r.fields?.name || "Location Airbnb",
      lat: r.fields?.latitude,
      lng: r.fields?.longitude,
      price: r.fields?.price ?? null,
      link: r.fields?.listing_url || "#",
    }))
    .filter((x: any) => x.lat && x.lng);

  return NextResponse.json(listings);
}
