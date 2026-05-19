/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Info,
  MapPin,
  Phone,
  Plus,
  User,
  Wallet,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";

import { useAuth } from "@/hooks/useAuth";
import { useCreateAppointmentMutation } from "@/redux/api/appointmentApi";
import { getUserInfo } from "@/service/auth.service";
import {
  AppointmentSchema,
  IAppointmentForm,
} from "@/zod-validation/appointment";

export default function EmergencyAppointmentBooking({
  fee,
  doctorId,
  disabled,
}: {
  fee: number;
  doctorId: string;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);

  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const finalFee = fee + 400;
  const [createAppointment, { isLoading }] = useCreateAppointmentMutation();

  const form = useForm<IAppointmentForm>({
    resolver: zodResolver(AppointmentSchema),
    defaultValues: {
      patientName: user?.name || "",
      ptAge: undefined,
      address: "",
      phoneNumber: user?.phoneNumber || "",
      consultationFee: finalFee,
      doctorId,
      appointmentDate: new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Dhaka",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date()),
      isEmergency: true,
      transactionId: "",
      paymentMethod: "BKASH",
      emergencyType: "PLATFORM",
    },
  });

  useEffect(() => {
    if (user) {
      form.setValue("patientName", user.name || "");
      form.setValue("phoneNumber", user.phoneNumber || "");
    }
  }, [user, form]);

  const handleProtectedOpen = () => {
    const userInfo = getUserInfo();
    if (!userInfo) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    setOpen(true);
  };

  const nextStep = async () => {
    const valid = await form.trigger([
      "patientName",
      "ptAge",
      "phoneNumber",
      "address",
    ]);
    if (valid) setStep(2);
  };

  const onSubmit = async (data: IAppointmentForm) => {
    try {
      const payload = {
        ...data,
        isEmergency: true,
      };

      await createAppointment(payload).unwrap();
      toast.success("অ্যাপয়েন্টমেন্ট সফল হয়েছে!");
      setOpen(false);
      setStep(1);
      router.replace("/patient/dashboard");
    } catch (err: any) {
      toast.error(err?.data?.message || "বুকিং ব্যর্থ হয়েছে");
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) setStep(1);
      }}
    >
      <Button
        onClick={handleProtectedOpen}
        disabled={disabled}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12 gap-2 shadow-lg rounded-xl transition-all"
      >
        <Plus size={18} />
        এমার্জেন্সি বুকিং
      </Button>

      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none rounded-3xl">
        <DialogHeader className="bg-red-600 text-white p-6 space-y-1">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Plus
                className="bg-white text-red-600 rounded-full p-0.5"
                size={20}
              />
              Emergency Booking
            </DialogTitle>
            <span className="bg-white/20 text-xs px-3 py-1 rounded-full border border-white/30">
              Step {step} / 2
            </span>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6">
            {/* Progress Bar */}
            <div className="flex gap-2 mb-8">
              <div
                className={`h-1.5 flex-1 rounded-full ${step >= 1 ? "bg-red-500" : "bg-slate-200"}`}
              />
              <div
                className={`h-1.5 flex-1 rounded-full ${step >= 2 ? "bg-red-500" : "bg-slate-200"}`}
              />
            </div>

            {step === 1 ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  name="patientName"
                  label="রোগীর নাম"
                  placeholder="সম্পূর্ণ নাম লিখুন"
                  control={form.control}
                  icon={User}
                />

                <div className="grid grid-cols-2 gap-4">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    name="ptAge"
                    label="বয়স"
                    type="number"
                    placeholder="যেমন: ২৫"
                    control={form.control}
                    icon={Calendar}
                  />
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    name="phoneNumber"
                    label="ফোন নম্বর"
                    placeholder="017XXXXXXXX"
                    control={form.control}
                    icon={Phone}
                  />
                </div>

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  name="address"
                  label="ঠিকানা"
                  placeholder="আপনার বর্তমান এলাকা"
                  control={form.control}
                  icon={MapPin}
                />

                <Button
                  type="button"
                  onClick={nextStep}
                  className="w-full h-12 bg-slate-900 rounded-xl mt-4 font-bold"
                >
                  পরের ধাপ <ArrowRight className="ml-2" size={18} />
                </Button>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                {/* Send Money Box */}
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
                  <div className="flex gap-2 mb-2 text-blue-800 font-bold items-center">
                    <Info size={16} />
                    <span className="text-sm">পেমেন্ট ইনস্ট্রাকশন:</span>
                  </div>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    ১. নিচের ড্রপডাউন থেকে আপনার মাধ্যমটি সিলেক্ট করুন।
                    <br />
                    ২. আমাদের নম্বর <b>+8801737813575</b> এ <b>৳{finalFee}</b>{" "}
                    টাকা Send Money করুন।
                    <br />
                    ৩. ট্রানজেকশন আইডি নিচের বক্সে লিখে নিশ্চিত করুন।
                  </p>
                </div>

                {/* SELECT OPTION START */}
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  name="paymentMethod"
                  label="পেমেন্ট গেটওয়ে"
                  placeholder="গেটওয়ে সিলেক্ট করুন"
                  control={form.control}
                  icon={Wallet}
                  options={[
                    { value: "BKASH", label: "bKash" },
                    { value: "NAGAD", label: "Nagad" },
                    { value: "ROCKET", label: "Rocket" },
                  ]}
                />

                {/* SELECT OPTION END */}

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  name="transactionId"
                  label="Transaction ID (TrxID)"
                  placeholder="যেমন: 8N77XW..."
                  control={form.control}
                  icon={CheckCircle2}
                />

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 h-12 rounded-xl"
                  >
                    <ArrowLeft className="mr-2" size={18} /> পিছনে
                  </Button>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-[2] h-12 bg-red-600 hover:bg-red-700 rounded-xl font-bold"
                  >
                    {isLoading ? "প্রসেসিং..." : "নিশ্চিত করুন"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
