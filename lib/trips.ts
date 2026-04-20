import sql from "./db";

export async function addTrip(trip: any) {
  const result = await sql`
    INSERT INTO trips (id, pickup, destination, city, amount, passenger_id, passenger_email, status)
    VALUES (${trip.id}, ${trip.pickup}, ${trip.destination}, ${trip.city}, ${trip.amount}, ${trip.passengerId}, ${trip.passengerEmail}, 'pending')
    RETURNING *
  `;
  return result[0];
}

export async function getTrips() {
  const result = await sql`SELECT * FROM trips ORDER BY created_at DESC`;
  return result.map((r: any) => ({
    id: r.id,
    pickup: r.pickup,
    destination: r.destination,
    city: r.city,
    amount: parseFloat(r.amount),
    passengerId: r.passenger_id,
    passengerEmail: r.passenger_email,
    driverId: r.driver_id,
    status: r.status,
    createdAt: r.created_at,
  }));
}

export async function getTripById(id: string) {
  const result = await sql`SELECT * FROM trips WHERE id = ${id}`;
  if (!result[0]) return null;
  const r = result[0];
  return {
    id: r.id,
    pickup: r.pickup,
    destination: r.destination,
    city: r.city,
    amount: parseFloat(r.amount),
    passengerId: r.passenger_id,
    passengerEmail: r.passenger_email,
    driverId: r.driver_id,
    status: r.status,
    createdAt: r.created_at,
  };
}

export async function updateTrip(id: string, updates: any) {
  const fields = [];
  const values: any[] = [];

  if (updates.status) { fields.push("status"); values.push(updates.status); }
  if (updates.driverId) { fields.push("driver_id"); values.push(updates.driverId); }

  if (fields.length === 0) return null;

  const result = await sql`
    UPDATE trips SET
      status = COALESCE(${updates.status}, status),
      driver_id = COALESCE(${updates.driverId || null}, driver_id)
    WHERE id = ${id}
    RETURNING *
  `;
  return result[0];
}