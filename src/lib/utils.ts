import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateRange(startDate: string, endDate: string): string {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startMonth = start.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    const endMonth = end.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
    return `${startMonth} – ${endMonth}`;
  } catch {
    return `${startDate} to ${endDate}`;
  }
}
