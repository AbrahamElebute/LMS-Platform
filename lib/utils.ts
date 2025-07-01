import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { env } from "./env";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name?: string | null) => {
  if (!name) return "??";
  const words = name.trim().split(" ");
  const initials = words.map((word) => word[0]?.toUpperCase()).slice(0, 2);
  return initials.join("");
};

export const useConstructUrl = (key?: string) => {
  return `https://${env.NEXT_PUBLIC_S3_BUCKET_IMAGES}.fly.storage.tigris.dev/${key}`;
};
