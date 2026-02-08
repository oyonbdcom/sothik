/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Calendar,
  Loader2,
  Lock,
  MapPin,
  Phone,
  Plus,
  ShieldCheck,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import CustomFormField, { FormFieldType } from "../custom-form-field";
import { Form } from "../ui/form";

import {
  useCreateAppointmentMutation,
  useSendBookingOtpMutation,
} from "@/redux/api/appointmentApi";
import { storeUserInfo } from "@/service/auth.service";
import { AppointmentBaseSchema } from "@/zod-validation/appointment";

type AppointmentFormValues = z.infer<typeof AppointmentBaseSchema>;

export default function CreateAppointment({
  discount,
  doctorId,
  clinicId,
}: {
  discount: number;
  doctorId: string;
  clinicId: string;
}) {
  const [open, setOpen] = useState(false);
  const [showOTPScreen, setShowOTPScreen] = useState(false);
  const router = useRouter();

  const [createAppointment, { isLoading: guestLoading }] =
    useCreateAppointmentMutation();
  const [sendBookingOtp, { isLoading: otpLoading }] =
    useSendBookingOtpMutation();

  const form = useForm<any>({
    resolver: zodResolver(AppointmentBaseSchema),
    defaultValues: {
      patientName: "",
      ptAge: undefined,
      phoneNumber: "",
      address: "",
      note: "",
      appointmentDate: new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Dhaka",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date()),
      otp: "",
      discount,
      doctorId,
      clinicId,
    },
  });

  const handleInitialSubmit = async (data: AppointmentFormValues) => {
    try {
      // ব্যাকএন্ডে ডুপ্লিকেট বুকিং চেক করার জন্য সব প্রয়োজনীয় ডেটা পাঠানো হচ্ছে
      const payload = {
        ...data,
        doctorId,
        clinicId,
        ptAge: String(data.ptAge), // ব্যাকএন্ড স্ট্রিং আশা করলে স্ট্রিং দিন
        appointmentDate: data.appointmentDate,
      };

      const res = await sendBookingOtp(payload).unwrap();

      setShowOTPScreen(true);
      toast.success(res?.message || "ওটিপি পাঠানো হয়েছে");
    } catch (err: any) {
      // ব্যাকএন্ড থেকে আসা ডুপ্লিকেট বুকিং এরর এখানে শো করবে
      toast.error(err?.message || "ওটিপি পাঠাতে ব্যর্থ হয়েছে");
    }
  };
  const onFinalSubmit = async (data: AppointmentFormValues) => {
    try {
      const payload = {
        ...data,
        doctorId,
        clinicId,
        ptAge: Number(data.ptAge),
        discount: Number(discount) || 0,
        otp: data.otp,
      };

      const result = await createAppointment(payload).unwrap();

      if (result?.data?.accessToken) {
        storeUserInfo({ accessToken: result.data.accessToken });
      }

      toast.success("অ্যাপয়েন্টমেন্ট সফলভাবে সম্পন্ন হয়েছে!");
      setOpen(false);
      resetFlow();
      router.replace("/patient/dashboard");
      router.refresh();
    } catch (err: any) {
      toast.error(err?.data?.message || "প্রসেসটি সম্পন্ন করা যায়নি");
    }
  };
  const resetFlow = () => {
    setShowOTPScreen(false);
    form.reset();
  };

  const isSubmitting = guestLoading || otpLoading;

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) resetFlow();
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 w-full hover:bg-indigo-700 h-12 px-6 rounded-2xl gap-3 font-bold text-white shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200 border-b-4 border-indigo-800">
          <div className="bg-white/20 p-1 rounded-lg">
            <Plus size={18} className="text-white" />
          </div>

          <div className="flex flex-col items-start leading-tight">
            <span className="text-[15px]">অ্যাপয়েন্টমেন্ট নিন</span>
            {discount && (
              <span className="text-[10px] font-medium text-indigo-100 flex items-center gap-1">
                <span className="w-1 h-1 bg-yellow-400 rounded-full animate-ping" />
                রিপোর্টে {discount}% নিশ্চিত ছাড়
              </span>
            )}
          </div>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none rounded-[2.5rem] bg-white shadow-2xl">
        <Form {...form}>
          <div className="flex flex-col max-h-[95vh]">
            <DialogHeader className="bg-slate-50 p-6 border-b border-slate-100">
              <DialogTitle className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Calendar className="text-indigo-600" size={24} />
                {showOTPScreen ? "ভেরিফিকেশন" : "অ্যাপয়েন্টমেন্ট ফর্ম"}
              </DialogTitle>
            </DialogHeader>

            <div className="p-8 overflow-y-auto">
              {!showOTPScreen ? (
                <form
                  onSubmit={form.handleSubmit(handleInitialSubmit)}
                  className="space-y-4"
                >
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

                  <CustomFormField
                    fieldType={FormFieldType.PHONE_INPUT}
                    name="phoneNumber"
                    label="ফোন নম্বর"
                    placeholder="017XXXXXXXX"
                    control={form.control}
                    icon={Phone}
                  />

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

                  <Button
                    type="submit"
                    disabled={otpLoading}
                    className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-bold text-white mt-4 gap-2"
                  >
                    {otpLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        <span>বুকিং নিশ্চিত করুন</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300 py-4">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShieldCheck className="text-blue-600" size={32} />
                    </div>
                    <h3 className="font-bold text-lg text-slate-800">
                      কোডটি দিন
                    </h3>
                    <p className="text-sm text-slate-500">
                      আপনার{" "}
                      <span className="font-bold text-slate-700">
                        {form.getValues("phoneNumber")}
                      </span>{" "}
                      নম্বরে পাঠানো ৬ ডিজিটের ওটিপি কোডটি দিন।
                    </p>
                  </div>

                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    name="otp"
                    label="ওটিপি কোড"
                    placeholder="XXXXXX"
                    control={form.control}
                    icon={Lock}
                  />

                  <div className="space-y-3">
                    <Button
                      onClick={form.handleSubmit(onFinalSubmit)}
                      disabled={isSubmitting}
                      className="w-full h-12 bg-green-600 hover:bg-green-700 rounded-2xl font-bold text-white"
                    >
                      {isSubmitting ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "ভেরিফাই ও বুকিং সম্পন্ন করুন"
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setShowOTPScreen(false)}
                      className="w-full text-slate-400 font-medium"
                    >
                      তথ্য সংশোধন করুন
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
