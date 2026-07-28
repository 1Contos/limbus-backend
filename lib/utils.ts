import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value: Date | string | null) {
  if (!value) return "Sem expiração";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function generateLicenseKey() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const segment = () => Array.from(
    { length: 4 },
    () => alphabet.charAt(Math.floor(Math.random() * alphabet.length)),
  ).join("");
  return `LIMBUS-${segment()}-${segment()}-${segment()}`;
}
