import { NextResponse } from "next/server";
import { getTrips } from "../../../lib/trips";
import { getUserById } from "../../../lib/users";

export async function GET() {
  const trips = getTrips().filter((t: any) => t.status === "pending");
  const tripsWithPassenger = trips.map((t: any) => {
    const passenger = getUserById(t.passengerId, "passenger");
    return {
      ...t,
      passengerName: passenger?.fullName || "Passenger",
      passengerPhone: passenger?.phone || "",
    };
  });
  return NextResponse.json({ trips: tripsWithPassenger });
}