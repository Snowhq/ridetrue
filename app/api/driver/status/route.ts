import { NextRequest, NextResponse } from "next/server";
import sql from "../../../../lib/db";

export async function POST(req: NextRequest) {
  const { userId, isOnline } = await req.json();
  await sql`UPDATE users SET is_online = ${isOnline} WHERE user_id = ${userId} AND role = 'driver'`;
  return NextResponse.json({ ok: true });
}