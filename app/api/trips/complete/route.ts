import { NextRequest, NextResponse } from "next/server";
import { updateTrip, getTripById } from "../../../../lib/trips";

export async function POST(req: NextRequest) {
  const { tripId } = await req.json();
  const trip = getTripById(tripId);
  if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  updateTrip(tripId, { status: "completed" });
  return NextResponse.json({ ok: true });
}