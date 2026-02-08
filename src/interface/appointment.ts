import { ReactNode } from "react";
import { IMedicalRecordResponse } from "./medical-history";

export interface IAppointmentResponse {
  id: string;
  appointmentDate: Date;
  status: AppointmentStatus | null;
  serialNumber: number;
  code: string | null;
  patientName: string;
  phoneNumber: string;
  times: string;
  clinicId: string;
  doctorId: string;
  createdAt: Date;
  discount: number;
  doctor: {
    id: string;
    name: string;
    image: string | null;
    email?: string;
    // This allows the profile to be null if the record is missing
    doctor: {
      department: string | null;
      specialization: string | null;
    } | null;
  };

  patient: {
    id: string;
    name: string;
    image: string | null;
    email?: string;
  };

  clinic: {
    id: string;
    name: string;
    image: string | null;
    clinic: {
      address: string | null;
      city: string | null;
      district: string | null;
    } | null;
  };

  medicalRecords: IMedicalRecordResponse[];
}
export type IAppointmentStats = {
  total: number;
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

// Type for the color options in your StatCard
export type StatColor = "blue" | "emerald" | "amber" | "rose";

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
