import { NextResponse } from "next/server";
import { getTrips } from "../../../lib/trips";
import { getUserById } from "../../../lib/users";

export async function GET() {
  const allTrips = await getTrips();
  const trips = allTrips.filter((t: any) => t.status === "pending");
  const tripsWithPassenger = await Promise.all(trips.map(async (t: any) => {
    const passenger = await getUserById(t.passengerId, "passenger");
    return {
      ...t,
      passengerName: passenger?.fullName || "Passenger",
      passengerPhone: passenger?.phone || "",
    };
  }));
  return NextResponse.json({ trips: tripsWithPassenger });
}