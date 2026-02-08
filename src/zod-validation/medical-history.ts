import { z } from "zod";

// Schema for creating a new Medical History record
export const createMedicalHistorySchema = z.object({
  appointmentId: z.string().cuid(),
  name: z.string(),
  description: z.string().optional(),
  date: z.string(),
  document: z.string().optional(),
});

// Schema for updating an existing Medical History record
export const updateMedicalHistorySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  date: z.string().optional(),
  document: z.string().optional(),
});
