import { NextRequest, NextResponse } from "next/server";
import { updateTrip, getTripById } from "../../../../lib/trips";
import { getUserById } from "../../../../lib/users";

export async function POST(req: NextRequest) {
  const { tripId } = await req.json();
  const trip = await getTripById(tripId);
  if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });

  await updateTrip(tripId, { status: "completed" });

  // Pay driver via Locus
  if (trip.driverId) {
    const driver = await getUserById(trip.driverId, "driver");
    if (driver) {
      if (driver.walletAddress) {
        // Send directly to wallet
        await fetch("https://beta-api.paywithlocus.com/api/pay/send", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.LOCUS_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to_address: driver.walletAddress,
            amount: trip.amount,
            memo: `RideTrue payout — ${trip.pickup} to ${trip.destination}`,
          }),
        });
      } else if (driver.email) {
        // Fallback to email payout
        await fetch("https://beta-api.paywithlocus.com/api/pay/send-email", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.LOCUS_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: driver.email,
            amount: trip.amount,
            memo: `RideTrue payout — ${trip.pickup} to ${trip.destination}`,
            expires_in_days: 30,
          }),
        });
      }
    }
  }

  return NextResponse.json({ ok: true });
}