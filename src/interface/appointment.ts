import { ReactNode } from "react";
import { IAreaResponse, IDepartmentResponse } from "./area";
import { IMedicalRecordResponse } from "./medical-history";
import { IUserResponse } from "./user";

export interface IAppointmentResponse {
  id: string;
  appointmentDate: Date;
  status: AppointmentStatus | null;
  serialNumber: number;
  patientName: string;
  phoneNumber: string;
  clinicId: string;
  doctorId: string;
  isEmergency: boolean;
  createdAt: Date;
  discount: number;
  doctor: {
    id: string;
    user: IUserResponse;

    department: IDepartmentResponse;
  };

  age: number;
  emergency?: EmergencyRequestResponse;

  clinic: {
    id: string;
    user: IUserResponse;

    area: IAreaResponse;
  };

  medicalRecords: IMedicalRecordResponse[];
}
export type IAppointmentStats = {
  total: number;
  todayAppointments: number;
  scheduled: number;
  completed: number;
  cancelled: number;
  pending: number;
};
// Matches your StatusBadge styles and Prisma Enum
export type AppointmentStatus =
  | "SCHEDULED"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";
export type PatientType = "NORMAL" | "EMERGENCY";

// Type for the color options in your StatCard
export type StatColor = "blue" | "emerald" | "amber" | "rose";
export type EmergencyRequestResponse = {
  id: string;

  appointmentId: string;

  type: "NORMAL" | "CRITICAL" | "URGENT"; // adjust based on your enum

  status: "PENDING" | "ACCEPT" | "REJECTED";

  transactionId?: string | null;

  paymentStatus: "PENDING" | "PAID" | "FAILED";

  createdById?: string | null;

  createdAt: string;
  updatedAt: string;
};
export interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: ReactNode;
  color: StatColor;
  trend: "up" | "down";
}

export interface StatusBadgeProps {
  status: AppointmentStatus;
}
