import { NextRequest, NextResponse } from "next/server";
import { getTrips } from "../../../../lib/trips";

export async function GET(req: NextRequest) {
  const driverId = req.nextUrl.searchParams.get("driverId");
  if (!driverId) return NextResponse.json({ trips: [], earnings: 0 });
  const trips = getTrips().filter((t: any) => t.driverId === driverId);
  const earnings = trips
    .filter((t: any) => t.status === "completed")
    .reduce((sum: number, t: any) => sum + t.amount, 0);
  return NextResponse.json({ trips: trips.reverse(), earnings });
}