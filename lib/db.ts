import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      email TEXT,
      full_name TEXT,
      phone TEXT,
      city TEXT,
      role TEXT,
      vehicle_type TEXT,
      vehicle_plate TEXT,
      vehicle_model TEXT,
      activated BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS trips (
      id TEXT PRIMARY KEY,
      pickup TEXT,
      destination TEXT,
      city TEXT,
      amount NUMERIC,
      passenger_id TEXT,
      passenger_email TEXT,
      driver_id TEXT,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

export default sql;
