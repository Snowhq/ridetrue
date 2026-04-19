import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { fullName, phone, city, vehicleType, vehiclePlate, vehicleModel, userId, email } = await req.json();

  if (!fullName || !phone || !city || !vehicleType || !vehiclePlate || !vehicleModel || !userId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // TODO: save to database
  console.log("Driver registered:", { fullName, phone, city, vehicleType, vehiclePlate, vehicleModel, userId, email });

  return NextResponse.json({ ok: true });
}