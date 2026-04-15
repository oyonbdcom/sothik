import { z } from "zod";

export const patientProfileSchema = z.object({
  name: z.string().min(2, "নাম অন্তত ২ অক্ষরের হতে হবে"),
  age: z
    .string()
    .transform((v) => parseInt(v, 10))
    .pipe(z.number().min(1).max(120)),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  address: z.string().min(5, "পুরো ঠিকানা লিখুন"),
  districtId: z.string().min(1, "ডিস্ট্রিক্ট সিলেক্ট করুন"),
  areaId: z.string().min(1, "এরিয়া সিলেক্ট করুন"),
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
    districtId: z.string().min(1, "ডিস্ট্রিক্ট সিলেক্ট করুন"),
    areaId: z.string().min(1, "এরিয়া সিলেক্ট করুন"),
  })
  .partial();
