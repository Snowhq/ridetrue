import { NextRequest, NextResponse } from "next/server";
import { getUserById } from "../../../lib/users";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const role = req.nextUrl.searchParams.get("role");
  if (!userId) return NextResponse.json({ user: null });
  const user = await getUserById(userId, role || undefined);
  return NextResponse.json({ user });
}