import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCentsToEuros(cents: number): string {
  return (cents / 100).toLocaleString("es-ES", {
    style: "currency",
    currency: "EUR",
  })
}

/**
 * Convierte un importe en euros escrito por el usuario ("1.234,56" o "1234.56")
 * a céntimos enteros. Devuelve null si no es un número válido >= 0.
 */
export function parseEurosToCents(input: string): number | null {
  const normalized = input.trim().replace(/\./g, "").replace(",", ".");
  if (normalized === "") return null;
  const euros = Number(normalized);
  if (!Number.isFinite(euros) || euros < 0) return null;
  return Math.round(euros * 100);
}

/** Céntimos → string de euros para prellenar inputs ("1234.56"). */
export function centsToEurosInput(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}
