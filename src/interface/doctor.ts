import { Gender } from "@/types/common";

import { IDoctorAreaResponse } from "./area";
import { IMembershipResponse } from "./diagnostic-membership";
import { IUserResponse } from "./user";

export interface IDepartmentResponse {
  id: string;
  name: string;
  slug: string;
}

// --- Main Doctor Response Interface ---
export interface IDoctorResponse {
  id: string;
  userId: string;
  slug: string;
  specialization: string;
  departmentId: string;
  isEmergency: boolean;
  // Optional Fields from Schema
  website: string | null;
  position: string | null;
  educations: { degree: string; institution: string; passingYear: string }[];
  hospital: string | null;
  gender: Gender | null;
  experience: number;

  // Counters & Ratings
  averageRating: number;
  reviewsCount: number;

  // Timestamps
  createdAt: Date | string;
  updatedAt: Date | string;

  // Relationships (Include logic অনুযায়ী আসবে)
  user: IUserResponse;
  department?: IDepartmentResponse;
  areas?: IDoctorAreaResponse[]; // DoctorArea[] রিলেশন
  memberships?: IMembershipResponse[]; // আপনার প্রয়োজন অনুযায়ী Membership টাইপ যোগ করতে পারেন
}

export interface Doctor {
  id: string;
  slug: string;
  specialization: string;
  department: { name: string };
  position: string;
  hospital: string;
  website: string;
  experience: number;
  gender: "MALE" | "FEMALE";
  isEmergency: boolean;
  averageRating: number;
  reviewsCount: number;
  user: { name: string; phoneNumber: string; image: string | null };
  practices: { area: string; centers: string[] }[];
  educations: { degree: string; institution: string; passingYear: string }[];
  schedule: { day: string; slots: string[] }[];
  reviews: {
    id: number;
    name: string;
    rating: number;
    date: string;
    comment: string;
  }[];
}
export interface IDepartmentStat {
  name: string;
  count: number;
}

export interface IDoctorStats {
  total: number;
  active: number;
  inactive: number;
  departments: IDepartmentStat[];
}
export const DoctorFilterableFields = [
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Inactive", value: "inactive" },
];
