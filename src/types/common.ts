import { JwtPayload } from "jwt-decode";

// types/common.ts
export type UserRole = "PATIENT" | "DOCTOR" | "ADMIN" | "CLINIC";

export enum NotificationType {
  APPOINTMENT,
  REMINDER,
  SYSTEM,
  BILLING,
  MESSAGE,
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";

export interface SearchParams {
  search?: string;
  department?: string;
  specialization?: string;
  city?: string;
  country?: string;
  gender?: Gender;
  minRating?: string;
  maxRating?: string;
  minExperience?: string;
  maxExperience?: string;
  minFee?: string;
  maxFee?: string;
  language?: string;
  sortBy?: "rating" | "experience" | "fee" | "name";
  sortOrder?: "asc" | "desc";
  page?: string;
  limit?: string;
}
export interface UserJwtPayload extends JwtPayload {
  userId: string;
  name: string;
  email: string;
  role: "ADMIN" | "CLINIC" | "PATIENT" | "DOCTOR";
  image?: string;
}
// types/common.ts
export interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export type IGenericResponse<T, N = Record<string, unknown>> = {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: T;
  stats?: N; // N is optional in the object and has a default type
};
