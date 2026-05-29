import { z } from "zod";

export const AppointmentSchema = z.object({
  patientName: z.string().min(2, "রোগীর নাম অন্তত ২ অক্ষরের হতে হবে"),

  ptAge: z.coerce.number({ required_error: "বয়স দিন" }).min(1, "সঠিক বয়স দিন"),
  consultationFee: z.coerce.number().optional(),
  phoneNumber: z
    .string()
    .regex(/^(?:\+8801|01)[3-9]\d{8}$/, "সঠিক বাংলাদেশি মোবাইল নম্বর দিন"),

  appointmentDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "সঠিক তারিখ প্রদান করুন",
  }),

  address: z.string().min(3, "ঠিকানা লিখুন").optional(),

  doctorId: z.string({ required_error: "ডাক্তার সিলেক্ট করা নেই" }),

  isEmergency: z.boolean().default(false),

  diagId: z.string().optional(),
  membershipId: z.string().optional(),

  // 🔥 FLAT emergency fields
  transactionId: z.string().min(6, "TrxID দিতে হবে").optional(),
  paymentMethod: z.enum(["BKASH", "NAGAD", "ROCKET"]).optional(),
  emergencyType: z
    .enum(["VIDEO_CONSULTATION", "PLATFORM", "HOME_VISIT"])
    .optional(),
});
export type IAppointmentForm = z.infer<typeof AppointmentSchema>;
