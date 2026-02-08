import {
  createClinicSchema,
  updateClinicSchema,
} from "@/zod-validation/clinic";
import z from "zod";

import { IMembershipResponse } from "./clinic-membership";
import { IUserResponse } from "./user";

export interface IClinicResponse {
  id: string;
  userId: string;
  phoneNumber: string | null;
  description: string | null;
  openingHour: string | null;
  slug: string | "";
  // CHANGE THIS:
  establishedYear: number | null;
  address: string | null;
  district: string | null;
  city: string | null;
  country: string | null;
  active: boolean;
  website: string | null;
  averageRating: number;
  reviewsCount: number;
  createdAt: Date;
  updatedAt: Date;
  user: IUserResponse;

  memberships?: IMembershipResponse[];
}
export interface IClinicStats {
  total: number;
  active: number;
  inactive: number;
}
export type ICreateClinicRequest = z.infer<typeof createClinicSchema>;

export type IUpdateClinicRequest = z.infer<typeof updateClinicSchema>;
