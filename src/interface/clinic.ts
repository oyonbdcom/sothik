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
  website: string;
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
export type ICreateClinicRequest = z.infer<typeof createClinicSchema>;

export type IUpdateClinicRequest = z.infer<typeof updateClinicSchema>;
