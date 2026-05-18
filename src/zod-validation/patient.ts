import { z } from "zod";

export const patientProfileSchema = z.object({
  name: z
    .string()
    .min(2, "নাম অন্তত ২ অক্ষরের হতে হবে")
    .max(100, "নাম ১০০ অক্ষরের বেশি হওয়া সম্ভব নয়")
    .regex(/^[ঀ-৿\s]+$/, "নাম অবশ্যই বাংলায় হতে হবে"),
  age: z.coerce.number().min(1).max(120),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  image: z.any().optional(),
  address: z.string().min(5, "পুরো ঠিকানা লিখুন"),
});

export const updatePatientSchema = z
  .object({
    name: z.string().min(2, "নাম অন্তত ২ অক্ষরের হতে হবে"),
    age: z
      .string()
      .transform((v) => parseInt(v, 10))
      .pipe(z.number().min(1).max(120)),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    address: z.string().min(5, "পুরো ঠিকানা লিখুন"),
  })
  .partial();
