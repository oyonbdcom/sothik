import { z } from "zod";
import { banglaRegex, phoneRegex } from "./common";

export const clinicSchema = z.object({
  user: z.object({
    name: z
      .string()
      .min(1, "ক্লিনিকের নাম আবশ্যক")
      .regex(banglaRegex, "ক্লিনিকের নাম  অবশ্যই বাংলায় হতে হবে"),
    phoneNumber: z
      .string()
      .min(11, "সঠিক মোবাইল নম্বর দিন")
      .regex(phoneRegex, "সঠিক মোবাইল নম্বর দিন"),
    password: z
      .string()
      .min(6, "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে")
      .optional()
      .or(z.literal("")),
    image: z.string().optional(),
    deactivate: z.boolean().default(false),
  }),
  slug: z.string().min(1, "ইউনিক স্লাগ আবশ্যক"),
  address: z
    .string()
    .min(1, "ঠিকানা আবশ্যক")
    .regex(banglaRegex, "ঠিকানা   অবশ্যই বাংলায় হতে হবে"),
});
export type ClinicFormValues = z.infer<typeof clinicSchema>;
export const createClinicSchema = clinicSchema;

export const updateClinicSchema = clinicSchema.partial();

export const ClinicZodValidation = {
  createClinicSchema,
  updateClinicSchema,
};

export type CreateClinicInput = z.infer<typeof createClinicSchema>;
export type UpdateClinicInput = z.infer<typeof updateClinicSchema>;
