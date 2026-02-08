/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ILoginRequest } from "@/interface/auth";
import { useLoginUserMutation } from "@/redux/api/authApi";
import { storeUserInfo } from "@/service/auth.service";
import { loginSchema } from "@/zod-validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Phone } from "lucide-react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function LoginPageContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [loginUser, { isLoading }] = useLoginUserMutation();
  const router = useRouter();

  const form = useForm<ILoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phoneNumber: "",
      password: "",
    },
  });

  const onSubmit = async (values: ILoginRequest) => {
    const toastId = toast.loading("তথ্য যাচাই করা হচ্ছে...");

    try {
      const result = await loginUser(values).unwrap();

      const accessToken = result?.data?.accessToken;
      const user = result?.data?.user;

      if (accessToken) {
        storeUserInfo({ accessToken });
      }

      toast.success("লগইন সফল হয়েছে!", { id: toastId });

      // রিডাইরেকশন লজিক
      if (callbackUrl) {
        router.replace(callbackUrl);
      } else if (user?.role) {
        const dashboardMap: Record<string, string> = {
          ADMIN: "/admin/dashboard",
          DOCTOR: "/doctor/dashboard",
          PATIENT: "/patient/dashboard",
          CLINIC: "/clinic/dashboard",
        };

        const targetPath = dashboardMap[user.role] || "/";
        router.replace(targetPath);
      }
    } catch (err: any) {
      console.log(err);
      // ব্যাকএন্ড এরর মেসেজ হ্যান্ডলিং
      const errorMessage =
        err?.message || "লগইন করা সম্ভব হয়নি। আবার চেষ্টা করুন।";

      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <div className="flex pt-20 min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="w-full max-w-md rounded-3xl p-8 shadow-2xl bg-white border border-white/20 animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 mb-2">
            <Lock size={28} />
          </div>
          <h2 className="text-center text-3xl font-black text-slate-800">
            লগইন করুন
          </h2>
          <p className="text-center text-sm text-slate-500 font-medium">
            আপনার অ্যাকাউন্টে প্রবেশ করতে তথ্য দিন
          </p>
        </div>

        <Separator className="my-6 bg-slate-100" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="phoneNumber"
              label="মোবাইল নম্বর"
              placeholder="017XXXXXXXX"
              required
              icon={Phone}
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="password"
              label="পাসওয়ার্ড"
              placeholder="••••••••"
              type="password"
              required
              icon={Lock}
            />

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-slate-600 cursor-pointer"
                >
                  মনে রাখুন
                </Label>
              </div>

              <Link
                href="/auth/forget-password"
                className="text-sm font-semibold text-blue-600 hover:underline underline-offset-4"
              >
                পাসওয়ার্ড ভুলে গেছেন?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full rounded-2xl bg-blue-600 py-6 text-lg font-bold text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 mt-4"
              disabled={isLoading}
            >
              {isLoading ? "প্রসেসিং হচ্ছে..." : "লগইন"}
            </Button>
          </form>
        </Form>

        <div className="mt-8 text-center text-sm text-slate-600">
          অ্যাকাউন্ট নেই?{" "}
          <Link
            href="/auth/sign-up"
            className="font-black text-blue-600 hover:underline underline-offset-4"
          >
            রেজিস্ট্রেশন করুন
          </Link>
        </div>
      </div>
    </div>
  );
}
