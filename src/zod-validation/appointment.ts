import { z } from "zod";

export const AppointmentBaseSchema = z.object({
  patientName: z.string().min(2, "রোগীর নাম অন্তত ২ অক্ষরের হতে হবে"),
  ptAge: z.coerce.number().min(1, "সঠিক বয়স দিন"),

  // ১. শুধুমাত্র বাংলাদেশি ফোন নম্বর ভ্যালিডেশন
  phoneNumber: z
    .string()
    .regex(/^(?:\+88|88)?(01[3-9]\d{8})$/, "সঠিক বাংলাদেশি মোবাইল নম্বর দিন"),

  // ২. শুধুমাত্র আজকের তারিখ (BD Timezone)
  appointmentDate: z.string().refine(
    (val) => {
      const now = new Date();
      // বাংলাদেশের লোকাল ফরম্যাট অনুযায়ী তারিখ বের করা (YYYY-MM-DD)
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");

      const bdToday = `${year}-${month}-${day}`;
      return val === bdToday;
    },
    {
      message: "শুধুমাত্র আজকের তারিখেই অ্যাপয়েন্টমেন্ট সম্ভব",
    },
  ),

  address: z.string().optional().or(z.literal("")),
  note: z.string().optional().or(z.literal("")),
  discount: z.coerce.number().optional(),
  doctorId: z.string().min(1, "ডাক্তার নির্বাচন করুন"),
  clinicId: z.string().min(1, "ক্লিনিক নির্বাচন করুন"),
  otp: z.string().optional(),
});
/** Final Submit → OTP Required */
export const AppointmentFinalSchema = AppointmentBaseSchema.extend({
  otp: z.string().min(4, "ওটিপি আবশ্যক").max(6, "ওটিপি সর্বোচ্চ ৬ ডিজিট"),
});
export const UpdateAppointmentSchema = z.object({
  appointmentDate: z.coerce.date().optional(),
  reason: z.string().min(5).optional(),
  status: z
    .enum(["SCHEDULED", "COMPLETED", "CANCELLED", "PENDING", "RESCHEDULED"])
    .optional(),
});

export const CreateMedicalRecordSchema = z.object({
  appointmentId: z.string().cuid(),
  name: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  document: z.string().url("Invalid document URL").optional(),
});
export type CreateAppointmentInput = z.infer<typeof AppointmentBaseSchema>;
