import { NextRequest, NextResponse } from "next/server";
import { saveUser } from "../../../../lib/users";

export async function POST(req: NextRequest) {
  const { fullName, phone, city, vehicleType, vehiclePlate, vehicleModel, walletAddress, userId, email } = await req.json();
  if (!fullName || !phone || !city || !vehicleType || !vehiclePlate || !vehicleModel) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  await saveUser({
    userId: userId || email,
    email: email || "",
    fullName,
    phone,
    city,
    role: "driver",
    vehicleType,
    vehiclePlate,
    vehicleModel,
    walletAddress: walletAddress || null,
    activated: false,
    createdAt: new Date().toISOString(),
  });
  return NextResponse.json({ ok: true });
}