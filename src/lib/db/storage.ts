import { Trip } from "../types/trip";
import { SAMPLE_COORG_TRIP } from "./mockData";

const STORAGE_KEY = "tripmate_saved_trips_v1";
const ACTIVE_TRIP_KEY = "tripmate_active_trip_id_v1";

export class TripStorage {
  private static isBrowser(): boolean {
    return typeof window !== "undefined" && typeof localStorage !== "undefined";
  }

  static getAllTrips(): Trip[] {
    if (!this.isBrowser()) {
      return [SAMPLE_COORG_TRIP];
    }
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Initialize with sample trip
        this.saveTrip(SAMPLE_COORG_TRIP);
        return [SAMPLE_COORG_TRIP];
      }
      const parsed: Trip[] = JSON.parse(data);
      return parsed.length > 0 ? parsed : [SAMPLE_COORG_TRIP];
    } catch (err) {
      console.error("Failed to read from localStorage", err);
      return [SAMPLE_COORG_TRIP];
    }
  }

  static getTripById(id: string): Trip | null {
    const trips = this.getAllTrips();
    return trips.find((t) => t.id === id) || (id === SAMPLE_COORG_TRIP.id ? SAMPLE_COORG_TRIP : trips[0] || null);
  }

  static saveTrip(trip: Trip): void {
    if (!this.isBrowser()) return;
    try {
      const trips = this.getAllTrips().filter((t) => t.id !== trip.id);
      trips.unshift(trip);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
      localStorage.setItem(ACTIVE_TRIP_KEY, trip.id);
    } catch (err) {
      console.error("Failed to save trip to localStorage", err);
    }
  }

  static deleteTrip(id: string): void {
    if (!this.isBrowser()) return;
    try {
      const trips = this.getAllTrips().filter((t) => t.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    } catch (err) {
      console.error("Failed to delete trip", err);
    }
  }

  static getActiveTripId(): string {
    if (!this.isBrowser()) return SAMPLE_COORG_TRIP.id;
    return localStorage.getItem(ACTIVE_TRIP_KEY) || SAMPLE_COORG_TRIP.id;
  }

  static setActiveTripId(id: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(ACTIVE_TRIP_KEY, id);
  }

  static resetToDemo(): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify([SAMPLE_COORG_TRIP]));
    localStorage.setItem(ACTIVE_TRIP_KEY, SAMPLE_COORG_TRIP.id);
  }
}
