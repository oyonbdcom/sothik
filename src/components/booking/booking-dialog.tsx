/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Calendar,
  Loader2,
  MapPin,
  Phone,
  Plus,
  User,
} from "lucide-react";

import { usePathname, useRouter } from "next/navigation";

import { useState } from "react";

import { useForm } from "react-hook-form";

import toast from "react-hot-toast";

import { z } from "zod";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import CustomFormField, { FormFieldType } from "../custom-form-field";

import { Form } from "../ui/form";

import { useCreateAppointmentMutation } from "@/redux/api/appointmentApi";

import { getUserInfo, storeUserInfo } from "@/service/auth.service";

import { AppointmentSchema } from "@/zod-validation/appointment";

type AppointmentFormValues = z.infer<typeof AppointmentSchema>;

export default function CreateAppointment({
  discount,
  doctorId,
  clinicId,
  membershipId,
  disabled,
}: {
  discount: number;
  doctorId: string;
  clinicId: string;
  membershipId: string;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const pathname = usePathname();

  const [createAppointment, { isLoading }] = useCreateAppointmentMutation();

  const form = useForm<any>({
    resolver: zodResolver(AppointmentSchema),

    defaultValues: {
      patientName: "",

      ptAge: undefined,

      address: "",

      phoneNumber: "",

      appointmentDate: new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Dhaka",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date()),

      doctorId,

      clinicId,

      membershipId,
    },
  });

  // =========================================
  // AUTO OPEN AFTER LOGIN (OPTIONAL)
  // =========================================

  // =========================================
  // LOGIN REQUIRED HANDLER
  // =========================================
  console.log(form.formState.errors);
  const handleProtectedOpen = () => {
    const user = getUserInfo();

    if (!user) {
      const callbackUrl = `${pathname} `;

      router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);

      return;
    }

    setOpen(true);
  };

  // =========================================
  // SUBMIT
  // =========================================

  const onSubmit = async (data: AppointmentFormValues) => {
    try {
      const payload = {
        ...data,

        doctorId,

        clinicId,

        membershipId,

        ptAge: Number(data.ptAge),
      };

      const result = await createAppointment(payload).unwrap();

      // guest auto login support
      if (result?.data?.accessToken) {
        storeUserInfo({
          accessToken: result.data.accessToken,
        });
      }

      toast.success("অ্যাপয়েন্টমেন্ট সফলভাবে সম্পন্ন হয়েছে!");

      setOpen(false);

      resetFlow();

      router.replace("/patient/dashboard");

      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || "প্রসেসটি সম্পন্ন করা যায়নি");
    }
  };

  // =========================================
  // RESET
  // =========================================

  const resetFlow = () => {
    form.reset({
      patientName: "",

      ptAge: undefined,

      address: "",

      phoneNumber: "",

      appointmentDate: new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Dhaka",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date()),

      doctorId,

      clinicId,

      membershipId,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);

        if (!val) resetFlow();
      }}
    >
      {/* ========================================= */}
      {/* BUTTON */}
      {/* ========================================= */}

      <Button
        onClick={handleProtectedOpen}
        disabled={disabled}
        className={`w-full h-9 px-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-sm
        ${
          disabled
            ? "bg-slate-50 border border-slate-200 cursor-not-allowed"
            : "bg-primary hover:bg-primary-700 text-white active:scale-95 border-b-2 border-primary-800"
        }`}
      >
        {/* LEFT */}
        <div className="flex items-center gap-1.5 overflow-hidden">
          {!disabled && (
            <div className="bg-white/20 p-0.5 rounded flex-shrink-0">
              <Plus size={12} className="text-white" />
            </div>
          )}

          <span
            className={`text-[11px] font-black whitespace-nowrap ${
              disabled ? "text-slate-400" : "text-white"
            }`}
          >
            {disabled ? "বুকিং বন্ধ" : "অ্যাপয়েন্টমেন্ট নিন"}
          </span>
        </div>

        {/* DIVIDER */}
        {!disabled && discount > 0 && (
          <div className="w-[1px] h-3 bg-white/20 flex-shrink-0" />
        )}

        {/* DISCOUNT */}
        <div className="flex-shrink-0">
          {!disabled && discount > 0 ? (
            <span className="text-[10px] font-bold text-yellow-300 flex items-center gap-1">
              {discount}% ছাড়
            </span>
          ) : disabled ? (
            <span className="text-[9px] font-medium text-slate-400">
              শিডিউল নেই
            </span>
          ) : null}
        </div>
      </Button>

      {/* ========================================= */}
      {/* MODAL */}
      {/* ========================================= */}

      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none rounded-[2.5rem] bg-white shadow-2xl">
        <Form {...form}>
          <div className="flex flex-col max-h-[95vh]">
            {/* HEADER */}
            <DialogHeader className="bg-slate-50 p-6 border-b border-slate-100">
              <DialogTitle className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Calendar className="text-indigo-600" size={24} />
                অ্যাপয়েন্টমেন্ট ফর্ম
              </DialogTitle>
            </DialogHeader>

            {/* BODY */}
            <div className="p-8 overflow-y-auto">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* NAME + AGE */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <CustomFormField
                      fieldType={FormFieldType.INPUT}
                      name="patientName"
                      label="রোগীর নাম"
                      placeholder="নাম লিখুন"
                      control={form.control}
                      icon={User}
                    />
                  </div>

                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    name="ptAge"
                    label="বয়স"
                    placeholder="২৫"
                    type="number"
                    control={form.control}
                  />
                </div>

                {/* PHONE */}
                <CustomFormField
                  fieldType={FormFieldType.PHONE_INPUT}
                  name="phoneNumber"
                  label="ফোন নম্বর"
                  placeholder="017XXXXXXXX"
                  control={form.control}
                  icon={Phone}
                />

                {/* DATE + ADDRESS */}
                <div className="grid grid-cols-2 gap-4">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    name="appointmentDate"
                    label="তারিখ"
                    type="date"
                    control={form.control}
                  />

                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    name="address"
                    label="ঠিকানা"
                    placeholder="ঢাকা"
                    control={form.control}
                    icon={MapPin}
                  />
                </div>

                {/* SUBMIT */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-bold text-white mt-4 gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <span>বুকিং নিশ্চিত করুন</span>

                      <ArrowRight size={18} />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
