import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "lib/users.json");

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

function readUsers(): User[] {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeUsers(users: User[]) {
  fs.writeFileSync(FILE, JSON.stringify(users, null, 2));
}

export function saveUser(user: User) {
  const users = readUsers();
  const index = users.findIndex(u => u.userId === user.userId && u.role === user.role);
  if (index === -1) {
    users.push(user);
  } else {
    users[index] = { ...users[index], ...user };
  }
  writeUsers(users);
}

export function getUserById(userId: string, role?: string): User | null {
  const users = readUsers();
  if (role) return users.find(u => u.userId === userId && u.role === role) || null;
  return users.find(u => u.userId === userId) || null;
}

export function getAllUsers(): User[] {
  return readUsers();
}