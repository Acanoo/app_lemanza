import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatGtq(value: unknown) {
  return new Intl.NumberFormat("es-GT", {
    style: "currency",
    currency: "GTQ",
    maximumFractionDigits: 0
  }).format(Number(value));
}

export function whatsappUrl(message: string) {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "50255555555";
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
