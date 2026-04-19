import { NextRequest, NextResponse } from "next/server";

const BASE = "https://api.paywithlocus.com/api";
const KEY = process.env.LOCUS_API_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  try {
    const res = await fetch(`${BASE}/checkout/sessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: "0.20",
        description: "RideTrue — Driver AI Agent Activation",
        successUrl: `${APP_URL}/driver/dashboard?activated=true`,
        cancelUrl: `${APP_URL}/driver/activate`,
        metadata: { userId, type: "driver_activation" },
      }),
    });

    const data = await res.json();
    const checkoutUrl = data?.data?.checkoutUrl;

    if (!checkoutUrl) {
      return NextResponse.json({ error: "Could not create checkout" }, { status: 500 });
    }

    return NextResponse.json({ checkoutUrl });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}