import { z } from "zod";
import { banglaRegex, phoneRegex } from "./common";

export const diagnosticSchema = z.object({
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
    .regex(banglaRegex, "ঠিকানা   অবশ্যই বাংলায় হতে হবে")
    .optional(),
  website: z.string().url("সঠিক ওয়েবসাইট URL দিন").optional().or(z.literal("")),
});

export type DiagnosticFormValues = z.infer<typeof diagnosticSchema>;
export const createDiagnosticSchema = diagnosticSchema;

export const updateDiagnosticSchema = diagnosticSchema.partial();

export const DiagnosticZodValidation = {
  createDiagnosticSchema,
  updateDiagnosticSchema,
};

export type CreateDiagnosticInput = z.infer<typeof createDiagnosticSchema>;
export type UpdateDiagnosticInput = z.infer<typeof updateDiagnosticSchema>;
