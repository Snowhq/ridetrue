import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "lib/trips.json");

export type Trip = {
  id: string;
  pickup: string;
  destination: string;
  city: string;
  amount: number;
  passengerId: string;
  passengerEmail: string;
  driverId?: string;
  status: "pending" | "accepted" | "arrived" | "completed";
  createdAt: string;
};

function readTrips(): Trip[] {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeTrips(trips: Trip[]) {
  fs.writeFileSync(FILE, JSON.stringify(trips, null, 2));
}

export function addTrip(trip: Trip) {
  const trips = readTrips();
  trips.push(trip);
  writeTrips(trips);
}

export function getTrips(): Trip[] {
  return readTrips();
}

export function updateTrip(id: string, updates: Partial<Trip>) {
  const trips = readTrips();
  const index = trips.findIndex(t => t.id === id);
  if (index === -1) return null;
  trips[index] = { ...trips[index], ...updates };
  writeTrips(trips);
  return trips[index];
}

export function getTripById(id: string): Trip | null {
  return readTrips().find(t => t.id === id) || null;
}