import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { fullName, phone, city, userId, email } = await req.json();
if (!fullName || !phone || !city) {
  return NextResponse.json({ error: "Missing fields" }, { status: 400 });
}

  // TODO: save to database
  console.log("Passenger registered:", { fullName, phone, city, userId, email });

  return NextResponse.json({ ok: true });
}