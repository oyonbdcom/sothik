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
  reviewsCount: number;
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
export interface IStaffActivity {
  staffId: string;
  name: string;
  role: string;
  appointmentCount: number;
  status: "Active" | "Away";
}

export interface IDoctorPerformance {
  doctorId: string;
  name: string;
  specialty: string;
  appointmentCount: number;
}

export interface IChartData {
  date: string;
  bookings: number;
}

export interface IDiagnosticManagerStats {
  summary: {
    totalBookings: number;
    completedCount: number;
    cancelledCount: number;
    platformBookings: number;
    staffManualBookings: number;
  };
  walletBalance: number;
  doctorPerformance: IDoctorPerformance[];
  staffPerformance: IStaffActivity[];
  chartData: IChartData[];
}
export type ICreateDiagnosticRequest = z.infer<typeof createDiagnosticSchema>;

export type IUpdateDiagnosticRequest = z.infer<typeof updateDiagnosticSchema>;
