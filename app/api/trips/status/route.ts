import { NextRequest, NextResponse } from "next/server";
import { getTripById } from "../../../../lib/trips";

export async function GET(req: NextRequest) {
  const tripId = req.nextUrl.searchParams.get("tripId");
  if (!tripId) return NextResponse.json({ error: "Missing tripId" }, { status: 400 });
  const trip = getTripById(tripId);
  if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  return NextResponse.json({ status: trip.status });
}