import { z } from "zod";

// বাংলা অক্ষর, সংখ্যা, স্পেস এবং স্পেশাল ক্যারেক্টার ( - , : . ) এর জন্য Regex
// এটি বাংলা বর্ণমালা (অ-হ, ৎ, ং, ঃ, ঁ), কার চিহ্ন, বাংলা সংখ্যা এবং মৌলিক বিরামচিহ্ন সাপোর্ট করবে
const banglaRegex = /^[০-৯\u0980-\u09FF\s\-:.,()]+$/;

const createScheduleShape = z.object({
  membershipId: z.string().cuid("মেম্বারশিপ আইডি সঠিক নয়"),
  days: z.array(z.string()).min(1, "অন্তত একটি দিন সিলেক্ট করুন"),

  times: z
    .string()
    .min(1, "বসার সময় অবশ্যই দিতে হবে")
    .regex(
      banglaRegex,
      "দয়া করে শুধুমাত্র বাংলা অক্ষর, সংখ্যা এবং বিরামচিহ্ন ব্যবহার করুন (যেমন: সকাল ১০:৩০ - রাত ০৮:০০)",
    ),

  note: z
    .string()
    .nullable()
    .optional()
    .refine((val) => !val || banglaRegex.test(val), {
      message: "নোট অবশ্যই বাংলায় হতে হবে",
    }),
});
export const createScheduleSchema = createScheduleShape;

export const updateScheduleSchema = createScheduleShape.partial().extend({
  id: z.string().cuid("আইডি সঠিক নয়"),
});

export const ScheduleZodValidation = {
  createScheduleSchema,
  updateScheduleSchema,
};
