import {
  createMedicalHistorySchema,
  updateMedicalHistorySchema,
} from "@/zod-validation/medical-history";
import z from "zod";

export interface IMedicalRecordResponse {
  id: string;
  name: string;
  description: string | null;
  date: Date;
  document: string | null;
  appointmentId: string;
}
export type ICreateMedicalRecords = z.infer<typeof createMedicalHistorySchema>;

export type IUpdateMedicalRecords = z.infer<typeof updateMedicalHistorySchema>;
