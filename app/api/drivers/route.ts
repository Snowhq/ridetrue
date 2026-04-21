import { NextRequest, NextResponse } from "next/server";
import sql from "../../../lib/db";

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get("city");
  const result = city
    ? await sql`SELECT full_name, vehicle_type, vehicle_model, city FROM users WHERE role = 'driver' AND is_online = true AND city = ${city}`
    : await sql`SELECT full_name, vehicle_type, vehicle_model, city FROM users WHERE role = 'driver' AND is_online = true`;
  return NextResponse.json({ drivers: result });
}