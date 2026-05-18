import z from "zod";

import { IFavoriteDoctor } from "./favorite";

import { UserRole } from "@/types";
import { updatePatientSchema } from "@/zod-validation/patient";
import { IAppointmentResponse } from "./appointment";
import { IMedicalRecordResponse } from "./medical-history";
import { IReviewResponse } from "./review";
import { IUserResponse } from "./user";

export type IPatientResponse = {
  id: string;
  name: string | null;
  phoneNumber: string;
  image: string | null;

  role: UserRole;
  deactivate: boolean;

  // ================= PATIENTS ARRAY =================
  patients: {
    id: string;
    age: number | null;
    gender: "MALE" | "FEMALE" | "OTHER" | null;
    address: string | null;
  }[];

  createdAt: string;
  updatedAt: string;
};

export type IUpdatePatientRequest = z.infer<typeof updatePatientSchema>;

export interface IPatientWithRelations extends IPatientResponse {
  appointments?: IAppointmentResponse[];
  user: IUserResponse;

  favoriteDoctors?: IFavoriteDoctor[];
  medicalRecords?: IMedicalRecordResponse[];
  reviews?: IReviewResponse[];
}

export const PatientFilterableFields = ["searchTerm", "district", "active"];

// IMAGE VIEW MODAL
export interface ImageViewerState {
  isOpen: boolean;
  medicalRecords: IMedicalRecordResponse[];
  currentIndex: number;
  type: "prescription" | "report" | "";
  appointmentId: string;
}

export interface ImageViewerModalProps {
  state: ImageViewerState;
  zoomLevel: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  setZoomLevel: (value: number | ((prev: number) => number)) => void;
}
