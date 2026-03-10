import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatCredits(credits: number): string {
  if (credits === -1) return "∞";
  return credits.toString();
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
