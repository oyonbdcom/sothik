/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Loader2,
  Smartphone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  useResetPasswordMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/redux/api/authApi";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/zod-validation/auth";
import { OTPCountdown } from "../sign-up/[role]/components/resend-button";

export default function ForgetPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<"PHONE" | "OTP" | "RESET" | "SUCCESS">(
    "PHONE",
  );
  const [userPhone, setUserPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifyOtpingOtp }] = useVerifyOtpMutation();
  const [resetPassword, { isLoading: isResetting }] =
    useResetPasswordMutation();

  const isGlobalPending = isSendingOtp || isVerifyOtpingOtp || isResetting;

  const phoneForm = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { phoneNumber: "" },
  });

  const resetForm = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSendOtp = async (values: any) => {
    try {
      await sendOtp(values).unwrap();
      setUserPhone(values.phoneNumber);
      setStep("OTP");

      toast.success("ওটিপি কোড পাঠানো হয়েছে");
    } catch (err: any) {
      toast.error(err?.message || "ব্যর্থ হয়েছে");
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return toast.error("৬ ডিজিটের কোড দিন");
    try {
      await verifyOtp({ phoneNumber: userPhone, otp }).unwrap();
      setStep("RESET");
    } catch (err: any) {
      toast.error(err?.message || "ভুল কোড");
    }
  };

  const handleResetPassword = async (values: any) => {
    try {
      await resetPassword({ phoneNumber: userPhone, otp, ...values }).unwrap();
      setStep("SUCCESS");
    } catch (err: any) {
      toast.error(err?.message || "রিসেট ব্যর্থ হয়েছে");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-[400px] bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
        {/* STEP 1: PHONE */}
        {step === "PHONE" && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-2">
                <Smartphone size={24} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                পাসওয়ার্ড রিকভারি
              </h1>
              <p className="text-slate-500 text-sm">আপনার মোবাইল নম্বরটি দিন</p>
            </div>
            <Form {...phoneForm}>
              <form
                onSubmit={phoneForm.handleSubmit(handleSendOtp)}
                className="space-y-4"
              >
                <CustomFormField
                  fieldType={FormFieldType.PHONE_INPUT}
                  name="phoneNumber"
                  placeholder="017XXXXXXXX"
                  control={phoneForm.control}
                />
                <Button
                  className="w-full h-12 bg-blue-600 rounded-xl"
                  disabled={isGlobalPending}
                >
                  {isSendingOtp ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "ওটিপি পাঠান"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        )}

        {/* STEP 2: OTP (SIMPLE INPUT) */}
        {step === "OTP" && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-slate-900">কোডটি দিন</h1>
              <p className="text-slate-500 text-sm">
                আমরা <span className="font-bold">{userPhone}</span> নম্বরে কোড
                পাঠিয়েছি
              </p>
            </div>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="৬ ডিজিটের কোড"
                maxLength={6}
                value={otp}
                autoFocus
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="h-14 text-center text-2xl tracking-[0.5em] font-bold border-2 border-slate-100 rounded-xl focus:border-blue-500"
              />
              <Button
                onClick={handleVerifyOtp}
                className="w-full h-12 bg-blue-600 rounded-xl"
                disabled={isGlobalPending}
              >
                {isVerifyOtpingOtp ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "ভেরিফাই করুন"
                )}
              </Button>
              <OTPCountdown
                onResend={() => phoneForm.handleSubmit(handleSendOtp)()}
              />
            </div>
          </div>
        )}

        {/* STEP 3: RESET */}
        {step === "RESET" && (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto mb-2">
                <KeyRound size={24} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                নতুন পাসওয়ার্ড
              </h1>
            </div>
            <Form {...resetForm}>
              <form
                onSubmit={resetForm.handleSubmit(handleResetPassword)}
                className="space-y-4"
              >
                <CustomFormField
                  control={resetForm.control}
                  fieldType={FormFieldType.INPUT}
                  type="password"
                  name="newPassword"
                  label="নতুন পাসওয়ার্ড"
                  required
                />
                <CustomFormField
                  control={resetForm.control}
                  fieldType={FormFieldType.INPUT}
                  type="password"
                  name="confirmPassword"
                  label="পাসওয়ার্ড নিশ্চিত করুন"
                  required
                />
                <Button
                  className="w-full h-12 bg-blue-600 rounded-xl"
                  disabled={isGlobalPending}
                >
                  {isResetting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "আপডেট করুন"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        )}

        {/* STEP 4: SUCCESS */}
        {step === "SUCCESS" && (
          <div className="text-center space-y-6 animate-in zoom-in duration-300">
            <CheckCircle2 size={60} className="text-green-500 mx-auto" />
            <h1 className="text-2xl font-bold">পাসওয়ার্ড আপডেট হয়েছে!</h1>
            <Button
              onClick={() => router.push("/auth/sign-in")}
              className="w-full h-12 bg-slate-900 rounded-xl"
            >
              লগইন করুন
            </Button>
          </div>
        )}

        {step !== "SUCCESS" && (
          <button
            onClick={() => {
              if (step === "PHONE") {
                router.back();
              } else {
                // ওটিপি বা রিসেট পাসওয়ার্ড পেজ থেকে ফিরে আসার সময় স্টেট ক্লিয়ার করা
                setOtp("");
                setStep("PHONE");
              }
            }}
            className="mt-6 w-full flex items-center justify-center text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" /> ফিরে যান
          </button>
        )}
      </div>
    </div>
  );
}
