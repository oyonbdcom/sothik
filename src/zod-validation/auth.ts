import { nameRegex, phoneRegex } from "@/constant/common";
import { z } from "zod";

// ---------------------- LOGIN ----------------------
export const loginSchema = z.object({
  phoneNumber: z.string().min(11, "সঠিক মোবাইল নম্বর দিন"),
  password: z.string().min(1, "পাসওয়ার্ড দিন"),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "নাম অন্তত ২ অক্ষরের হতে হবে")
      .max(100, "নাম ১০০ অক্ষরের বেশি হওয়া সম্ভব নয়")
      .regex(nameRegex, "নামে শুধুমাত্র বাংলা বা ইংরেজি অক্ষর ব্যবহার করুন"),
    phoneNumber: z
      .string()
      .min(11, "ফোন নম্বর অন্তত ১১ ডিজিটের হতে হবে")
      .regex(phoneRegex, "সঠিক মোবাইল নম্বর প্রদান করুন (উদা: 017xxxxxxxx)"),
    password: z
      .string()
      .min(8, "পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে")
      .regex(/[A-Z]/, "পাসওয়ার্ডে অন্তত একটি বড় হাতের অক্ষর থাকতে হবে")
      .regex(/[a-z]/, "পাসওয়ার্ডে অন্তত একটি ছোট হাতের অক্ষর থাকতে হবে")
      .regex(/[0-9]/, "পাসওয়ার্ডে অন্তত একটি সংখ্যা থাকতে হবে")
      .regex(/[^A-Za-z0-9]/, "পাসওয়ার্ডে অন্তত একটি বিশেষ চিহ্ন থাকতে হবে"),
    confirmPassword: z.string().min(1, "পাসওয়ার্ড নিশ্চিত করুন"),
    otp: z
      .string()
      .length(6, "৬ ডিজিটের ওটিপি দিন")
      .optional()
      .or(z.literal("")),
    role: z.enum(["PATIENT", "DOCTOR", "CLINIC", "ADMIN"]).default("PATIENT"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "পাসওয়ার্ড দুটি মিলছে না",
    path: ["confirmPassword"],
  });
// ---------------------- FORGOT PASSWORD ----------------------

// ---------------------- FORGOT PASSWORD ----------------------
export const forgotPasswordSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "মোবাইল নম্বর দেওয়া আবশ্যক")
    .regex(phoneRegex, "সঠিক মোবাইল নম্বর প্রদান করুন"),
});

// ---------------------- RESEND VERIFICATION ----------------------
export const resendVerificationSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "মোবাইল নম্বর দেওয়া আবশ্যক")
    .regex(phoneRegex, "সঠিক মোবাইল নম্বর প্রদান করুন"),
});

// ---------------------- CHANGE PASSWORD ----------------------

export const ChangePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "পুরানো পাসওয়ার্ডটি দিন"),
    newPassword: z
      .string()
      .min(8, "পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে")
      .regex(/[A-Z]/, "অন্তত একটি বড় হাতের অক্ষর (A-Z) দিন")
      .regex(/[a-z]/, "অন্তত একটি ছোট হাতের অক্ষর (a-z) দিন")
      .regex(/[0-9]/, "অন্তত একটি সংখ্যা (0-9) দিন")
      .regex(/[@$!%*?&#]/, "অন্তত একটি স্পেশাল ক্যারেক্টার দিন"),
    confirmPassword: z.string().min(1, "পাসওয়ার্ডটি পুনরায় দিন"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "নতুন পাসওয়ার্ড দুটি মিলছে না",
    path: ["confirmPassword"],
  });
// ---------------------- UPDATE PROFILE ----------------------
export const updateProfileSchema = z.object({
  name: z.string().min(2, "নাম অন্তত ২ অক্ষরের হতে হবে").optional(),
  image: z.string().url("সঠিক লিংক প্রদান করুন").optional().nullable(),
  phoneNumber: z.string().regex(phoneRegex, "সঠিক মোবাইল নম্বর দিন").optional(),
});

// ---------------------- RESET PASSWORD ----------------------
export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে")
      .regex(/[A-Z]/, "একটি বড় হাতের অক্ষর থাকতে হবে")
      .regex(/[a-z]/, "একটি ছোট হাতের অক্ষর থাকতে হবে")
      .regex(/[0-9]/, "একটি সংখ্যা থাকতে হবে"),
    confirmPassword: z.string().min(1, "পাসওয়ার্ড নিশ্চিত করুন"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "পাসওয়ার্ড দুটি মিলছে না",
    path: ["confirmPassword"],
  });
// ---------------------- EXPORT ALL TOGETHER ----------------------
export const AuthValidation = {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resendVerificationSchema,
  ChangePasswordSchema,
  updateProfileSchema,
  resetPasswordSchema,
};
