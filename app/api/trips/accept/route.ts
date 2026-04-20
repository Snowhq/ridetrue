import { NextRequest, NextResponse } from "next/server";
import { updateTrip } from "../../../../lib/trips";

export async function POST(req: NextRequest) {
  const { tripId, driverId } = await req.json();
  const trip = await updateTrip(tripId, { driverId, status: "accepted" });
  if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  return NextResponse.json({ ok: true, trip });
}