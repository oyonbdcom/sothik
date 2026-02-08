import z from "zod";

import { IFavoriteDoctor } from "./favorite";

import { Gender } from "@/types";
import { updatePatientSchema } from "@/zod-validation/patient";
import { IAppointmentResponse } from "./appointment";
import { IMedicalRecordResponse } from "./medical-history";
import { IReviewResponse } from "./review";
import { IUserResponse } from "./user";

export interface IPatientResponse {
  id: string;
  userId: string;
  name: string;
  email: string;
  image: string | null;
  deactivate: boolean;
  age: number | null;
  gender: Gender | null;
  phoneNumber: string | null;
  bloodGroup: string | null;
  address: string | null;
  district: string | null;
  city: string | null;
  country?: string | null;
  totalAppointments: number;
  latestAppointment: ILatestAppointment | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILatestAppointment {
  id: string;
  date: Date;
  status: string;
  doctorName?: string;
  clinicName?: string;
  medicalRecordsCount: number;
}
export type IUpdatePatientRequest = z.infer<typeof updatePatientSchema>;

export interface IPatientWithRelations extends IPatientResponse {
  appointments?: IAppointmentResponse[];
  user: IUserResponse;

  favoriteDoctors?: IFavoriteDoctor[];
  medicalRecords?: IMedicalRecordResponse[];
  reviews?: IReviewResponse[];
}
export interface IPatientStats {
  total: number;
  active: number;
  inactive: number;
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
