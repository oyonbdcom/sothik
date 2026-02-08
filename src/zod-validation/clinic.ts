import { phoneRegex } from "@/constant/common";
import { z } from "zod";

export const clinicSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid(),
  user: z.object({
    // নাম শুধুমাত্র বাংলায় হতে হবে
    name: z
      .string()
      .min(2, "নাম অন্তত ২ অক্ষরের হতে হবে")
      .regex(/^[ঀ-৿\s]+$/, "নাম অবশ্যই বাংলায় হতে হবে"),
    phoneNumber: z
      .string()
      .min(1, "মোবাইল নম্বর দেওয়া আবশ্যক")
      .regex(phoneRegex, "সঠিক মোবাইল নম্বর প্রদান করুন"),
    image: z.string().default("null"),
  }),

  // ফোন নম্বর শুধুমাত্র সংখ্যা এবং + চিহ্ন
  phoneNumber: z
    .string()
    .min(11, "ফোন নম্বর অন্তত ১১ ডিজিটের হতে হবে")
    .regex(/^[0-9+]+$/, "সঠিক ফোন নম্বর দিন"),

  // বর্ণনা বাংলায় এবং বিশেষ চিহ্ন (.,।/()-) অনুমোদিত
  description: z
    .string()
    .regex(/^[ঀ-৿\s.,।/()/-]*$/, "বর্ণনা বাংলায় লিখুন")
    .nullable(),

  openingHour: z
    .string()
    .regex(/^[ঀ-৿\s.,।/()/-]*$/, "সময় অবশ্যই বাংলায় হতে হবে")
    .nullable(),
  active: z.boolean().default(false),
  averageRating: z.coerce.number().nullable(),
  reviewsCount: z.coerce.number().nullable(),

  // ওয়েবসাইট URL ফরম্যাট চেক
  website: z.string().url("সঠিক ইউআরএল দিন").nullable().or(z.literal("")),

  establishedYear: z.coerce.number().nullable(),

  // ঠিকানা ও শহর বাংলায়
  address: z
    .string()
    .regex(/^[ঀ-৿\s.,।/()/-]*$/, "ঠিকানা বাংলায় লিখুন")
    .nullable(),

  district: z.string().nullable(),

  city: z
    .string()
    .regex(/^[ঀ-৿\s]*$/, "শহরের নাম বাংলায় লিখুন")
    .nullable(),

  country: z
    .string()
    .min(1, "দেশ নির্বাচন করা বাধ্যতামূলক")
    .default("Bangladesh"),

  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

// --- CREATE CLINIC SCHEMA ---
// We omit system-generated fields and relations
export const createClinicSchema = clinicSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    userId: z.string().cuid().optional(),
  });

export const updateClinicSchema = createClinicSchema.partial();

export const ClinicZodValidation = {
  clinicSchema,
  createClinicSchema,
  updateClinicSchema,
};
