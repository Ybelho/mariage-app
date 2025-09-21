import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat") || "42.9";
  const lng = searchParams.get("lng") || "1.5";
  const radiusKm = searchParams.get("radiusKm") || "10"; // rayon (km)

  // OpenDataSoft: dataset air-bnb-listings
  const apiUrl =
    `https://public.opendatasoft.com/api/records/1.0/search/?dataset=air-bnb-listings` +
    `&rows=100&geofilter.distance=${lat},${lng},${radiusKm*1000}`;

  const res = await fetch(apiUrl);
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
