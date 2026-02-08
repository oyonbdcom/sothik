/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useChangePasswordMutation } from "@/redux/api/authApi";
import { ChangePasswordSchema } from "@/zod-validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import CustomFormField, { FormFieldType } from "./custom-form-field";

export default function ChangePasswordPage() {
  const [changePassword, { isLoading: isChanging }] =
    useChangePasswordMutation();

  const form = useForm({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: any) => {
    try {
      const result = await changePassword(values).unwrap();
      console.log(result);
      toast.success("পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!");

      localStorage.removeItem("accessToken");
      form.reset();

      setTimeout(() => {
        window.location.href = "/auth/sign-in";
      }, 1500);
    } catch (err: any) {
      const errorMsg =
        err?.data?.message || err?.message || "পাসওয়ার্ড পরিবর্তন করা যায়নি";
      toast.error(errorMsg);

      if (err?.status === 401) {
        form.setValue("oldPassword", "");
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
        <CardHeader className="bg-slate-50/50 p-8 text-center border-b border-slate-100">
          <div className="w-16 h-16 bg-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <Lock className="text-indigo-600" size={32} />
          </div>
          <CardTitle className="text-2xl font-black text-slate-800">
            পাসওয়ার্ড পরিবর্তন
          </CardTitle>
          <CardDescription>
            নিরাপত্তার স্বার্থে পাসওয়ার্ড পরিবর্তনের পর পুনরায় লগইন করতে হবে।
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                type="password"
                name="oldPassword"
                label="বর্তমান পাসওয়ার্ড"
                placeholder="••••••••"
                control={form.control}
                icon={Lock}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  type="password"
                  name="newPassword"
                  label="নতুন পাসওয়ার্ড"
                  placeholder="••••••••"
                  control={form.control}
                  icon={ShieldCheck}
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  type="password"
                  name="confirmPassword"
                  label="নিশ্চিত করুন"
                  placeholder="••••••••"
                  control={form.control}
                  icon={ShieldCheck}
                />
              </div>

              <Button
                type="submit"
                disabled={isChanging}
                className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-bold text-white shadow-lg transition-all gap-2 mt-4 active:scale-95"
              >
                {isChanging ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "পাসওয়ার্ড আপডেট করুন"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
