import { z } from "zod";

export const updatePatientSchema = z
  .object({
    age: z.number().min(0).max(120).optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
    bloodGroup: z.string().optional(),
    phoneNumber: z.string().optional(),
    address: z.string().optional(),
    district: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    image: z.string().url().or(z.string().length(0)).optional(),
    deactivate: z.boolean().optional(),
  })
  .partial();
