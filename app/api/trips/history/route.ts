import { NextRequest, NextResponse } from "next/server";
import { getTrips } from "../../../../lib/trips";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) return NextResponse.json({ trips: [] });
  const trips = getTrips().filter((t: any) => t.passengerId === userId);
  return NextResponse.json({ trips: trips.reverse() });
}