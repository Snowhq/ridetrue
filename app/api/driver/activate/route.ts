import { NextRequest, NextResponse } from "next/server";
import { saveUser, getUserById } from "../../../../lib/users";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  if (userId) {
    const user = await getUserById(userId, "driver");
    if (user) {
      await saveUser({ ...user, activated: true });
    }
  }

  const res = await fetch("https://beta-api.paywithlocus.com/api/checkout/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.LOCUS_API_KEY}`,
    },
    body: JSON.stringify({
      amount: (0.20).toFixed(2),
      description: "RideTrue — AI agent activation",
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/driver/dashboard?activated=true`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/driver/activate`,
      metadata: { userId, type: "driver_activation" },
    }),
  });

  const data = await res.json();
  const checkoutUrl = data?.data?.checkoutUrl;
  return NextResponse.json({ checkoutUrl });
}