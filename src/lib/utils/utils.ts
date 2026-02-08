/* eslint-disable @typescript-eslint/no-explicit-any */
import { doctorDepartments } from "@/constant/common";
import { bangladeshDistricts } from "@/constant/dristrict";
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
export const formatTo12Hr = (time?: string) => {
  if (!time) return "N/A";

  // Split the HH:mm string
  const [hours, minutes] = time.split(":");
  let h = parseInt(hours);
  const m = minutes;
  const ampm = h >= 12 ? "PM" : "AM";

  h = h % 12;
  h = h ? h : 12; // convert '0' to '12'

  // Pad with leading zero if you want "02:30 PM" instead of "2:30 PM"
  const displayHour = h < 10 ? `0${h}` : h;

  return `${displayHour}:${m} ${ampm}`;
};
export const formatDate = (date: string | number | Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(date).toLocaleDateString("en-US", options);
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
export const getSpecialtyColor = (index: number) => {
  const colors = [
    "bg-blue-100 text-blue-800 border-blue-200",
    "bg-green-100 text-green-800 border-green-200",
    "bg-purple-100 text-purple-800 border-purple-200",
    "bg-amber-100 text-amber-800 border-amber-200",
    "bg-pink-100 text-pink-800 border-pink-200",
    "bg-cyan-100 text-cyan-800 border-cyan-200",
  ];
  return colors[index % colors.length];
};
export const getBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
};
export const getDistrictLabel = (value: string | null | undefined) => {
  if (!value) return "ঠিকানা নেই";

  // অ্যারে থেকে অবজেক্টটি খুঁজে বের করা
  const district = bangladeshDistricts.find(
    (d) => d.value === value.toLowerCase(),
  );

  // যদি খুঁজে পায় তবে বাংলা নাম (label) দেখাবে, নাহলে ইংরেজি ভ্যালুটিই দেখাবে
  return district ? district.label : value;
};
export const getDepartmentLabel = (value: string | null | undefined) => {
  if (!value) return "বিভাগ নেই";

  // আপনার ডিপার্টমেন্ট লিস্টের অ্যারে (যেমন: doctorDepartments) থেকে খুঁজে বের করা
  const department = doctorDepartments.find(
    (d) => d.value.toLowerCase() === value.toLowerCase(),
  );

  // যদি খুঁজে পায় তবে বাংলা নাম (label) দেখাবে, নাহলে অরিজিনাল ভ্যালুটিই দেখাবে
  return department ? department.label : value;
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
