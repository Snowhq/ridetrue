import { NextRequest, NextResponse } from "next/server";


function estimateFare(pickup: string, destination: string, city: string): { amount: number; description: string } {
  const pickup_lower = pickup.toLowerCase();
  const dest_lower = destination.toLowerCase();

  const cities = ["lagos", "abuja", "kano", "port harcourt", "ibadan", "enugu"];
  const isIntercity = cities.some(c => dest_lower.includes(c) && !dest_lower.includes(city.toLowerCase()));

  if (isIntercity) {
    return { amount: 1.50, description: "Intercity fare — estimated based on distance" };
  }

  const shortRoutes = ["island", "vi", "lekki", "ikeja", "wuse", "garki", "sabon gari"];
  const isShort = shortRoutes.some(r => pickup_lower.includes(r) || dest_lower.includes(r));

  if (isShort) {
    return { amount: 0.10, description: "Short city route — fair market rate" };
  }

  return { amount: 0.25, description: "Standard city route — fair market rate" };
}

export async function POST(req: NextRequest) {
  const { pickup, destination, city } = await req.json();

  if (!pickup || !destination) {
    return NextResponse.json({ error: "Missing pickup or destination" }, { status: 400 });
  }

  const fare = estimateFare(pickup, destination, city);
  return NextResponse.json(fare);
}