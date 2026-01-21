import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function genTrackingId(): string {
  const millis = Date.now(); // milliseconds since epoch
  const randomSuffix = Math.floor(Math.random() * 1000); // 0-999
  return `TRK-${millis}-${randomSuffix}`;
}
