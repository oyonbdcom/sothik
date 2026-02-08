import { phoneRegex } from "@/constant/common";
import { z } from "zod";

export const doctorSchema = z.object({
  department: z.string().min(1, "ডিপার্টমেন্ট নির্বাচন করা বাধ্যতামূলক"),

  specialization: z
    .string()
    .min(1, "স্পেশালাইজেশন দিন")
    .regex(/^[ঀ-৿\s.,।/()/-]+$/, "স্পেশালাইজেশন অবশ্যই বাংলায় হতে হবে"),
  bio: z.string().max(1000, "১০০০ অক্ষরের বেশি লিখা যাবে না").optional(),
  gender: z
    .enum(["MALE", "FEMALE"], {
      invalid_type_error: "সঠিক লিঙ্গ নির্বাচন করুন",
      required_error: "লিঙ্গ নির্বাচন করা বাধ্যতামূলক",
    })
    .optional(),
  website: z.string().url("সঠিক ইউআরএল (URL) দিন").optional().or(z.literal("")),
  position: z.string().optional(),
  district: z.string().min(1, "জেলা নির্বাচন করুন").optional(),
  active: z.boolean().default(true),
  city: z.string().optional(),
  degree: z
    .string()
    .min(1, "ডিগ্রি প্রদান করুন")
    .regex(/^[ঀ-৿\s.,।/()/-]+$/, "ডিগ্রি অবশ্যই বাংলায় হতে হবে "),
  hospital: z
    .string()
    .min(1, "স্পেশালাইজেশন দিন")
    .regex(/^[ঀ-৿\s.,।/()/-]+$/, "স্পেশালাইজেশন অবশ্যই বাংলায় হতে হবে"),
  country: z.string().default("Bangladesh"),

  user: z.object({
    name: z
      .string()
      .min(1, "নাম প্রদান করুন")
      .regex(/^[ঀ-৿\s.,।/()/-]+$/, "নাম অবশ্যই বাংলায় হতে হবে"),
    phoneNumber: z
      .string()
      .min(1, "মোবাইল নম্বর দেওয়া আবশ্যক")
      .regex(phoneRegex, "সঠিক মোবাইল নম্বর প্রদান করুন"),
    password: z.string().min(8, "পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে"),
    image: z.string().default("null"),
    isPhoneVerified: z.boolean().optional(),
    role: z.string(),
    active: z.boolean().default(true),
  }),
});
export const createDoctorSchema = doctorSchema;

export const updateDoctorSchema = doctorSchema.partial();

export const DoctorZodValidation = {
  createDoctorSchema,
  updateDoctorSchema,
};

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>;
