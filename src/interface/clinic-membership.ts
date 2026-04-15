/* eslint-disable @typescript-eslint/no-explicit-any */
import { createMembershipSchema } from "@/zod-validation/membership";
import z from "zod";
import { IClinicResponse } from "./clinic";
import { IDoctorResponse } from "./doctor";

export interface IMembershipResponse {
  id: string;
  fee: number;
  maxAppointments: number;
  discount: number;
  createdAt: Date;
  updatedAt: Date;
  doctor?: IDoctorResponse | null;
  clinic?: IClinicResponse;
  schedules?: any[];
}
export type CreateMembershipInput = z.infer<typeof createMembershipSchema>;
export type UpdateMembershipInput = z.infer<typeof createMembershipSchema>;
