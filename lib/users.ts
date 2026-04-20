import sql from "./db";

export type User = {
  userId: string;
  email: string;
  fullName: string;
  phone: string;
  city: string;
  role: "passenger" | "driver";
  vehicleType?: string;
  vehiclePlate?: string;
  vehicleModel?: string;
  activated?: boolean;
  createdAt: string;
};

export async function saveUser(user: User) {
  await sql`
    INSERT INTO users (user_id, email, full_name, phone, city, role, vehicle_type, vehicle_plate, vehicle_model, activated)
    VALUES (${user.userId}, ${user.email}, ${user.fullName}, ${user.phone}, ${user.city}, ${user.role}, ${user.vehicleType || null}, ${user.vehiclePlate || null}, ${user.vehicleModel || null}, ${user.activated || false})
    ON CONFLICT (user_id, role) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      phone = EXCLUDED.phone,
      city = EXCLUDED.city,
      vehicle_type = EXCLUDED.vehicle_type,
      vehicle_plate = EXCLUDED.vehicle_plate,
      vehicle_model = EXCLUDED.vehicle_model,
      activated = EXCLUDED.activated
  `;
}

export async function getUserById(userId: string, role?: string): Promise<User | null> {
  let result;
  if (role) {
    result = await sql`SELECT * FROM users WHERE user_id = ${userId} AND role = ${role} LIMIT 1`;
  } else {
    result = await sql`SELECT * FROM users WHERE user_id = ${userId} LIMIT 1`;
  }
  if (!result[0]) return null;
  const r = result[0];
  return {
    userId: r.user_id,
    email: r.email,
    fullName: r.full_name,
    phone: r.phone,
    city: r.city,
    role: r.role,
    vehicleType: r.vehicle_type,
    vehiclePlate: r.vehicle_plate,
    vehicleModel: r.vehicle_model,
    activated: r.activated,
    createdAt: r.created_at,
  };
}

export async function getAllUsers(): Promise<User[]> {
  const result = await sql`SELECT * FROM users`;
  return result.map((r: any) => ({
    userId: r.user_id,
    email: r.email,
    fullName: r.full_name,
    phone: r.phone,
    city: r.city,
    role: r.role,
    vehicleType: r.vehicle_type,
    vehiclePlate: r.vehicle_plate,
    vehicleModel: r.vehicle_model,
    activated: r.activated,
    createdAt: r.created_at,
  }));
}