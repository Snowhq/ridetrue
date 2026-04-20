import { NextRequest, NextResponse } from "next/server";
import { addTrip } from "../../../lib/trips";
import { randomUUID } from "crypto";

const BASE = "https://api.paywithlocus.com/api";
const KEY = process.env.LOCUS_API_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  const { pickup, destination, city, fareAmount, userId, passengerEmail } = await req.json();

  const tripId = randomUUID();

  try {
    const res = await fetch(`${BASE}/checkout/sessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: fareAmount.toFixed(2),
        description: `RideTrue — ${pickup} to ${destination}`,
        successUrl: `${APP_URL}/trip/confirmed?pickup=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(destination)}&amount=${fareAmount}&tripId=${tripId}`,
        cancelUrl: `${APP_URL}/dashboard`,
        metadata: { pickup, destination, city, userId, tripId, type: "ride" },
      }),
    });

    const data = await res.json();
    console.log("Locus checkout response:", JSON.stringify(data, null, 2));

    const checkoutUrl = data?.data?.checkoutUrl;

    if (!checkoutUrl) {
      return NextResponse.json({ error: "Could not create checkout", raw: data }, { status: 500 });
    }

    // Save trip
    await addTrip({
      id: tripId,
      pickup,
      destination,
      city,
      amount: fareAmount,
      passengerId: userId,
      passengerEmail: passengerEmail || "",
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ checkoutUrl, tripId });
  } catch (e) {
    console.error("Book API error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}