import { NextRequest, NextResponse } from "next/server";
import { saveUser } from "../../../../lib/users";

export async function POST(req: NextRequest) {
  const { fullName, phone, city, userId, email } = await req.json();

  if (!fullName || !phone || !city) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  saveUser({
    userId: userId || email,
    email: email || "",
    fullName,
    phone,
    city,
    role: "passenger",
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}