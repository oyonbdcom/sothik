/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserRole } from "@/types/common";

export interface IUserResponse {
  id: string;
  name: string;
  phoneNumber: string;
  isPhoneVerified: boolean | null;
  image: string | null;
  role: UserRole;
  deactivate: boolean;
  isDefaultPassword: boolean;
  staff: {
    staffType: string;
  };

  doctor?: any;
  patient?: any;
  clinic?: any;
}
export const UserFilterableFields = [
  "searchTerm",
  "role",
  "emailVerified",
  "active",
];
