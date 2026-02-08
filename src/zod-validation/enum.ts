import { z } from "zod";

export const AppointmentStatus = z.enum([
  "SCHEDULED",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
]);

export const UserRole = z.enum(["ADMIN", "DOCTOR", "CLINIC", "PATIENT"]);

export const Gender = z.enum(["MALE", "FEMALE"]);
export const ReviewStatus = z.enum(["APPROVED", "PENDING", "REJECT"]);
