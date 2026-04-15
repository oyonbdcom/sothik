/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { IRegisterRequest } from "@/interface/auth";
import {
  useRegisterUserMutation,
  useSendOtpMutation,
} from "@/redux/api/authApi";
import { UserRole } from "@/types";
import { registerSchema } from "@/zod-validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Key,
  Loader2,
  Lock,
  Phone,
  Smartphone,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
interface RegFormProps {
  role: UserRole;
}

const RegisterForm = ({ role }: RegFormProps) => {
  const [showOtpView, setShowOtpView] = useState(false);
  const router = useRouter();

  const [registerUser, { isLoading: isRegistering }] =
    useRegisterUserMutation();
  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();

  const form = useForm<IRegisterRequest>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      role: "PATIENT",
      otp: "",
    },
  });

  // ধাপ ১: ওটিপি পাঠানো (শুধুমাত্র রেজিস্ট্রেশন ডাটা ভ্যালিড হলে)
  const handleSendOtp = async () => {
    // শুধুমাত্র ওটিপি ছাড়া বাকি ফিল্ডগুলো ভ্যালিডেট করুন
    const isFormValid = await form.trigger([
      "name",
      "phoneNumber",
      "password",
      "confirmPassword",
    ]);

    if (isFormValid) {
      const phoneNumber = form.getValues("phoneNumber");
      try {
        await sendOtp({ phoneNumber }).unwrap();
        setShowOtpView(true);
        toast.success("আপনার ফোনে ওটিপি পাঠানো হয়েছে।");
      } catch (err: any) {
        toast.error(err?.data?.message || "ওটিপি পাঠাতে ব্যর্থ হয়েছে।");
      }
    }
  };

  // ধাপ ২: ওটিপি সহ সম্পূর্ণ ডাটা সাবমিট
  const onFinalSubmit = async (values: IRegisterRequest) => {
    if (!values.otp || values.otp.length !== 6) {
      form.setError("otp", { message: "সঠিক ওটিপি দিন" });
      return toast.error("৬ ডিজিটের ওটিপি প্রদান করুন।");
    }

    try {
      await registerUser(values).unwrap();
      toast.success("অ্যাকাউন্ট তৈরি সফল হয়েছে!");
      router.push("/login");
    } catch (err: any) {
      toast.error(err?.data?.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে।");
    }
  };

  // --- ওটিপি ভিউ ---
  if (showOtpView) {
    return (
      <div className="flex min-h-[450px] flex-col items-center justify-center space-y-6 p-8 bg-white rounded-3xl shadow-2xl max-w-md mx-auto mt-20 border border-gray-100 animate-in fade-in zoom-in duration-300">
        <div className="h-20 w-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
          <Key className="h-10 w-10" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">ওটিপি যাচাই করুন</h2>
          <p className="text-gray-500 text-sm">
            আমরা আপনার{" "}
            <span className="font-bold text-gray-800">
              {form.getValues("phoneNumber")}
            </span>{" "}
            নম্বরে একটি কোড পাঠিয়েছি।
          </p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFinalSubmit)}
            className="w-full space-y-4"
          >
            <FormField
              control={form.control}
              name="otp"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <input
                      {...field}
                      type="text"
                      maxLength={6}
                      autoFocus
                      className={`w-full h-14 text-center text-2xl font-bold tracking-[0.5rem] rounded-xl border-2 outline-none transition-all ${
                        fieldState.error
                          ? "border-red-500"
                          : "border-gray-100 focus:border-blue-600"
                      }`}
                      placeholder="000000"
                    />
                  </FormControl>
                  {fieldState.error && (
                    <p className="text-red-500 text-xs text-center">
                      {fieldState.error.message}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-white shadow-lg shadow-blue-100"
              disabled={isRegistering}
            >
              {isRegistering ? (
                <Loader2 className="animate-spin" />
              ) : (
                "ভেরিফাই এবং রেজিস্ট্রেশন করুন"
              )}
            </Button>
          </form>
        </Form>

        <button
          type="button"
          onClick={() => setShowOtpView(false)}
          className="flex items-center text-xs text-gray-400 hover:text-blue-600"
        >
          <ArrowLeft className="h-3 w-3 mr-1" /> নম্বর পরিবর্তন করুন
        </button>
      </div>
    );
  }

  // --- রেজিস্ট্রেশন ফর্ম ভিউ ---
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-4 md:p-6">
      {/* মেইন কন্টেইনার অ্যানিমেশন সহ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[440px] bg-white rounded-[2.5rem] p-6 md:p-10 shadow-[0_20px_50px_rgba(8,112,184,0.07)] border border-slate-50"
      >
        {/* হেডার সেকশন */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-[1.5rem] mb-5 group">
            <Smartphone className="text-blue-600 h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            নতুন অ্যাকাউন্ট
          </h2>
          <div className="mt-2 inline-block px-4 py-1.5 bg-slate-50 rounded-full">
            <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em]">
              {role} রেজিস্ট্রেশন
            </p>
          </div>
        </div>

        <Form {...form}>
          <form className="space-y-5">
            {/* নাম ইনপুট */}
            <div className="group">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="name"
                control={form.control}
                label="আপনার পূর্ণ নাম"
                placeholder="উদা: আব্দুল করিম"
                icon={User}
                className="rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all"
              />
            </div>

            {/* মোবাইল নম্বর */}
            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              name="phoneNumber"
              control={form.control}
              label="মোবাইল নম্বর"
              placeholder="017XXXXXXXX"
              icon={Phone}
            />

            {/* পাসওয়ার্ড সেকশন - মোবাইলে গ্রিড থেকে ফ্লেক্স (Stack) করা হয়েছে */}
            <div className="grid gap-5 md:grid-cols-2">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="password"
                control={form.control}
                label="পাসওয়ার্ড"
                type="password"
                placeholder="••••••••"
                icon={Lock}
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="confirmPassword"
                control={form.control}
                label="নিশ্চিত করুন"
                type="password"
                placeholder="••••••••"
                icon={Lock}
              />
            </div>

            {/* ওটিপি বাটন - বড় এবং প্রিমিয়াম লুক */}
            <div className="pt-4">
              <Button
                type="button"
                onClick={handleSendOtp}
                disabled={isSendingOtp}
                className="w-full py-8 bg-blue-600 hover:bg-blue-700 text-white text-lg rounded-[1.5rem] shadow-xl shadow-blue-100 font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
              >
                {isSendingOtp ? (
                  <>
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                    কোড পাঠানো হচ্ছে...
                  </>
                ) : (
                  <>
                    ওটিপি পাঠান
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>

        {/* ফুটার */}
        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
          <p className="text-slate-500 text-sm font-medium">
            আগে থেকেই অ্যাকাউন্ট আছে?{" "}
            <Link
              href="/login"
              className="text-blue-600 font-black hover:text-blue-700 transition-colors ml-1 underline decoration-blue-100 underline-offset-4"
            >
              লগইন করুন
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterForm;
