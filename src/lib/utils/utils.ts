/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isLocationMatch = (
  targetLocation: any,
  locationName: any,
): boolean => {
  if (!targetLocation || !locationName) return false;
  // Check if targetLocation is a string and locationName is a string
  return locationName.split("/").pop() === targetLocation;
};

export const formatTime = (time: string) => {
  if (!time) return "নির্ধারিত নেই";

  const [hour, minute] = time.split(":");
  let h = parseInt(hour);
  const ampm = h >= 12 ? "PM" : "AM";

  h = h % 12;
  h = h ? h : 12; // ০ টা হলে ১২ টা দেখাবে

  const formattedHour = h < 10 ? `০${h}` : h; // বাংলা ফরম্যাটের জন্য বা ০ যুক্ত করার জন্য
  return `${formattedHour}:${minute} ${ampm}`;
};

// for path name
export function getDynamicPath(pathname: any): any {
  const prefixes = ["en", "bn", "ar"];

  for (const prefix of prefixes) {
    if (pathname.startsWith(`/${prefix}/`)) {
      return `/${pathname.slice(prefix.length + 2)}`;
    }
  }

  return pathname;
}

export const getBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
};

export const enToBnNumber = (number: number | string): string => {
  const banglaDigits: { [key: string]: string } = {
    "0": "০",
    "1": "১",
    "2": "২",
    "3": "৩",
    "4": "৪",
    "5": "৫",
    "6": "৬",
    "7": "৭",
    "8": "৮",
    "9": "৯",
  };

  return String(number).replace(/[0-9]/g, (digit) => banglaDigits[digit]);
};
