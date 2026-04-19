import { NextResponse } from "next/server";
import { getTrips } from "../../../lib/trips";

export async function GET() {
  const trips = getTrips().filter((t: { status: string }) => t.status === "pending");
  return NextResponse.json({ trips });
}