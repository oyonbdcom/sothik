import { z } from "zod";

const phoneRegex = /^(?:\+88|88)?(01[3-9]\d{8})$/;

const banglaRegex = /^[ঀ-৿\s.,।/()\-ঃ]+$/;

export const doctorSchema = z.object({
  departmentId: z.string().min(1, "ডিপার্টমেন্ট নির্বাচন করা বাধ্যতামূলক"),

  specialization: z
    .string()
    .min(1, "স্পেশালাইজেশন দিন")
    .regex(banglaRegex, "স্পেশালাইজেশন অবশ্যই বাংলায় হতে হবে"),

  slug: z
    .string()
    .min(3, "স্লাগ অন্তত ৩ অক্ষরের হবে")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "স্লাগ ছোট হাতের ইংরেজি এবং ড্যাশ হতে হবে",
    )
    .toLowerCase() // ইনপুট যাই আসুক, এটি ডাটাবেজে পাঠানোর আগে lowercase করে ফেলবে
    .trim(),

  gender: z
    .enum(["MALE", "FEMALE", "OTHER"], {
      errorMap: () => ({ message: "সঠিক লিঙ্গ নির্বাচন করুন" }),
    })
    .default("MALE"),

  experience: z.coerce.number().min(0, "অভিজ্ঞতা ০ বা তার বেশি হতে হবে"),

  hospital: z
    .string()
    .min(1, "হসপিটালের নাম দিন")
    .regex(banglaRegex, "হসপিটালের নাম অবশ্যই বাংলায় হতে হবে"),

  position: z
    .string()
    .regex(banglaRegex, "পদবী অবশ্যই বাংলায় হতে হবে")
    .optional()
    .or(z.literal("")),

  website: z
    .string()
    .trim()
    .nullable()
    .transform((val) => (val === "" ? undefined : val))
    .refine(
      (val) => !val || /^https?:\/\/.+/.test(val),
      "সঠিক ইউআরএল (URL) দিন",
    ),

  // --- Nested User Fields ---
  user: z.object({
    name: z
      .string()
      .min(1, "নাম প্রদান করুন")
      .regex(banglaRegex, "নাম অবশ্যই বাংলায় হতে হবে"),

    phoneNumber: z
      .string()
      .min(1, "মোবাইল নম্বর দেওয়া আবশ্যক")
      .regex(phoneRegex, "সঠিক মোবাইল নম্বর প্রদান করুন"),

    password: z
      .string()
      .optional()
      .or(z.literal(""))
      .refine((val) => !val || val.length >= 8, {
        message: "পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে",
      }),

    image: z.string().optional().default("null"),

    role: z.string().default("DOCTOR"),

    isPhoneVerified: z.boolean().optional().default(false),

    deactivate: z.boolean().default(false),
  }),
});

export type DoctorFormValues = z.infer<typeof doctorSchema>;
export const createDoctorSchema = doctorSchema;

export const updateDoctorSchema = doctorSchema.partial();

export const DoctorZodValidation = {
  createDoctorSchema,
  updateDoctorSchema,
};

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>;
