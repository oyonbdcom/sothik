import { UserRole } from "@/types/common";
import { IDiagnosticResponse } from "./diagnostic";
import { IDoctorResponse } from "./doctor";
import { IPatientResponse } from "./patient";

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

  doctor?: IDoctorResponse;
  patient?: IPatientResponse;
  diagnostic?: IDiagnosticResponse;
}
export const UserFilterableFields = [
  "searchTerm",
  "role",
  "emailVerified",
  "active",
];
