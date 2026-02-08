import { z } from "zod";

export const clinicMembershipSchema = z.object({
  doctorId: z
    .string({ required_error: "অনুগ্রহ করে একজন চিকিৎসক নির্বাচন করুন" })
    .min(1, "চিকিৎসক নির্বাচন করা আবশ্যক"),

  // input থেকে স্ট্রিং এলেও এটি নাম্বারে কনভার্ট করবে
  fee: z.preprocess(
    (val) => Number(val),
    z
      .number({ required_error: "কনসালটেশন ফি প্রদান করা আবশ্যক" })
      .min(1, "ফি অন্তত ১ টাকা হতে হবে"),
  ),

  maxAppointments: z.preprocess(
    (val) => Number(val),
    z
      .number({ required_error: "সর্বোচ্চ অ্যাপয়েন্টমেন্ট সংখ্যা আবশ্যক" })
      .min(1, "অন্তত ১টি অ্যাপয়েন্টমেন্ট থাকতে হবে"),
  ),

  discount: z.preprocess(
    (val) => Number(val),
    z
      .number({ required_error: "ডিসকাউন্ট প্রদান করা আবশ্যক" })
      .min(0, "ডিসকাউন্ট ০ বা তার বেশি হতে হবে"), // ডিসকাউন্ট ০ হতে পারে
  ),
});
// Schema for creating a new ClinicMembership
export const createClinicMembershipSchema = clinicMembershipSchema;

// Schema for updating an existing ClinicMembership
export const updateClinicMembershipSchema = clinicMembershipSchema.partial();
