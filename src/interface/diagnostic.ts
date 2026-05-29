import z from "zod";

import {
  createDiagnosticSchema,
  updateDiagnosticSchema,
} from "@/zod-validation/diagnostic";
import { IAreaResponse } from "./area";
import { IMembershipResponse } from "./diagnostic-membership";
import { IUserResponse } from "./user";

export interface IDiagnosticResponse {
  id: string;
  userId: string;
  user: IUserResponse;
  name: string;
  slug: string;
  averageRating: number;
  reviewCount: number;
  address: string;
  areaId: string;
  area: IAreaResponse;
  memberships: IMembershipResponse[];
  website?: string;
  stats: IDiagnosticManagerStats;

  createdAt: string;
  updatedAt: string;
}

export interface IStaffActivity {
  id: string;
  name: string;
  role: string;
  totalBookings: number;
}

export interface IDiagnosticManagerStats {
  totalDoctors: number;
  todayAppointments: number;
  completedAppointments: number;
  totalStaffs: number;
  staffActivities: IStaffActivity[];
}
export type ICreateDiagnosticRequest = z.infer<typeof createDiagnosticSchema>;

export type IUpdateDiagnosticRequest = z.infer<typeof updateDiagnosticSchema>;
