import { NextRequest, NextResponse } from "next/server";
import { getTripById } from "../../../../lib/trips";
import { getUserById } from "../../../../lib/users";

export async function GET(req: NextRequest) {
  const tripId = req.nextUrl.searchParams.get("tripId");
  if (!tripId) return NextResponse.json({ error: "Missing tripId" }, { status: 400 });
  const trip = await getTripById(tripId);
  if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });
  
  let driverInfo = null;
  if (trip.driverId) {
    const driver = await getUserById(trip.driverId, "driver");
    if (driver) {
      driverInfo = {
        name: driver.fullName,
        phone: driver.phone,
        vehicleType: driver.vehicleType,
        vehicleModel: driver.vehicleModel,
        vehiclePlate: driver.vehiclePlate,
      };
    }
  }
  return NextResponse.json({ status: trip.status, driver: driverInfo });
}