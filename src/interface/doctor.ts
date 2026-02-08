/* eslint-disable @typescript-eslint/no-explicit-any */
import { Gender } from "@/types/common";

import { IMembershipResponse } from "./clinic-membership";
import { IUserResponse } from "./user";

export interface IEducation {
  degree: string;
  institution: string;
  year: number;
}
export interface IDoctorResponse {
  id: string;
  userId: string;
  department: string | null;
  specialization: string | null;
  degree: string | null;
  slug: string;
  bio: string | null;
  gender: Gender | null;
  district: string | null;
  city: string | null;
  country: string | null;
  website: string | null;
  hospital: string | null;
  position: string | null;
  active: boolean;
  averageRating: number;
  reviewsCount: number;
  education: IEducation | any;
  createdAt: Date;
  updatedAt: Date;
  user: IUserResponse;
  memberships?: IMembershipResponse[];
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
