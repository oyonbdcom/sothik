import { z } from "zod";

export const membershipSchema = z.object({
  doctorId: z.string().min(1, { message: "ডাক্তার নির্বাচন করা আবশ্যক" }),
  clinicId: z.string().min(1, { message: "ক্লিনিক নির্বাচন করা আবশ্যক" }),

  fee: z.coerce
    .number({
      required_error: "ফি প্রদান করুন",
      invalid_type_error: "ফি অবশ্যই সংখ্যা হতে হবে",
    })
    .min(0, { message: "ফি ০ এর কম হতে পারবে না" }),

  discount: z.coerce
    .number({
      invalid_type_error: "ডিসকাউন্ট সংখ্যায় লিখুন",
    })
    .min(0, { message: "ডিসকাউন্ট ০ এর কম হতে পারবে না" })
    .max(100, { message: "ডিসকাউন্ট ১০০% এর বেশি হতে পারবে না" }),

  active: z.boolean().default(true),
});

// টাইপ এক্সপোর্ট (TypeScript-এর জন্য)
export type TMembership = z.infer<typeof membershipSchema>;
export const createMembershipSchema = membershipSchema;

// Schema for updating an existing ClinicMembership
export const updateMembershipSchema = membershipSchema.partial();
