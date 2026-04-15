import {
  createClinicSchema,
  updateClinicSchema,
} from "@/zod-validation/clinic";
import z from "zod";

import { IAreaResponse } from "./area";
import { IMembershipResponse } from "./clinic-membership";
import { IUserResponse } from "./user";

export interface IClinicResponse {
  id: string;
  userId: string;
  user: IUserResponse;
  name: string;
  slug: string;
  address: string;
  areaId: string;
  area: IAreaResponse;
  memberships: IMembershipResponse[];
  averageRating: number;
  stats: IClinicStats;
  reviewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IClinicStats {
  total: number;
  active: number;
  inactive: number;
}
export type ICreateClinicRequest = z.infer<typeof createClinicSchema>;

export type IUpdateClinicRequest = z.infer<typeof updateClinicSchema>;
