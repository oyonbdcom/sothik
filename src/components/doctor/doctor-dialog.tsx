/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Building2,
  Edit,
  Globe,
  GraduationCap,
  Loader2,
  Lock,
  Phone,
  Stethoscope,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";

import { IDoctorResponse } from "@/interface/doctor";

import {
  useAddDoctorMutation,
  useUpdateDoctorMutation,
} from "@/redux/api/doctorApi";
import { useGetDepartmentsQuery } from "@/redux/api/setup";
import {
  DoctorFormValues,
  doctorSchema, // আপনার ফিক্সড করা স্কিমা
} from "@/zod-validation/doctor";

interface DoctorDialogProps {
  doctor?: IDoctorResponse;
  isEditMode?: boolean;
}

export default function DoctorDialog({
  doctor,
  isEditMode,
}: DoctorDialogProps) {
  const [open, setOpen] = useState(false);

  // ১. রেডক্স থেকে ডিপার্টমেন্ট ফেচিং
  const { data: departmentsData, isLoading: isDeptLoading } =
    useGetDepartmentsQuery(undefined);

  const [addDoctor, { isLoading: isAdding }] = useAddDoctorMutation();
  const [updateDoctor, { isLoading: isUpdating }] = useUpdateDoctorMutation();

  const isPending = isAdding || isUpdating;

  // ২. ফর্ম সেটআপ
  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      user: {
        name: "ডাঃ ",
        phoneNumber: "",
        password: "",
        role: "DOCTOR",
        image: "",
        deactivate: false,
      },
      slug: "",
      isEmergency: false,
      departmentId: "",
      position: "",
      gender: "MALE",
      website: "",
      experience: 0,
      specialization: "",
      hospital: "",
    },
  });
  // ৩. এডিট মোড ডাটা পপুলেশন
  useEffect(() => {
    if (isEditMode && doctor) {
      form.reset({
        ...doctor,
        departmentId: (doctor as any).departmentId || "",
        experience: Number(doctor.experience),

        user: {
          name: doctor.user?.name || "",
          phoneNumber: doctor.user?.phoneNumber || "",
          password: "",
          role: "DOCTOR",
          image: doctor.user?.image || "",
          deactivate: doctor.user?.deactivate ?? false,
        },
        isEmergency: doctor?.isEmergency,
        website: doctor?.website,
      } as any);
    }
  }, [doctor, isEditMode, form]);

  // ৫. সাবমিট হ্যান্ডলার
  async function onSubmit(values: DoctorFormValues) {
    console.log(values);

    try {
      if (isEditMode && doctor?.id) {
        await updateDoctor({
          id: doctor.id,
          data: values,
        }).unwrap();
        toast.success("ডাক্তারের প্রোফাইল আপডেট করা হয়েছে!");
      } else {
        await addDoctor(values).unwrap();
        toast.success("নতুন ডাক্তার যোগ করা হয়েছে!");
      }
      setOpen(false);
      form.reset();
    } catch (error: any) {
      toast.error(error?.message || "কিছু একটা সমস্যা হয়েছে।");
    }
  }

  // ডিপার্টমেন্টগুলোকে অপশন ফরম্যাটে রূপান্তর
  const departmentOptions =
    departmentsData?.departments?.map((dept: any) => ({
      label: dept.name,
      value: dept.id,
    })) || [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={isEditMode ? "soft" : "default"}
          size={isEditMode ? "icon" : "sm"}
          className={
            isEditMode
              ? "rounded-full hover:bg-emerald-50 text-emerald-600"
              : "rounded-xl"
          }
        >
          {isEditMode ? <Edit className="h-5 w-5" /> : "ডাক্তার যোগ করুন"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2rem]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "প্রোফাইল এডিট" : "নতুন ডাক্তার নিবন্ধন"}
          </DialogTitle>
          <DialogDescription>
            সঠিক তথ্য দিয়ে প্রোফাইলটি সম্পূর্ণ করুন।
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* ১. প্রোফাইল ইমেজ - সেন্টারে */}
            <div className="flex justify-center">
              <CustomFormField
                fieldType={FormFieldType.PROFILE}
                name="user.image"
                control={form.control}
              />
            </div>

            {/* ২. প্রাথমিক পরিচয় (নাম এবং লিঙ্গ) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="user.name"
                label="পূর্ণ নাম (বাংলায়)"
                required
                placeholder="ডাঃ "
                icon={User}
                control={form.control}
              />
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                name="gender"
                label="লিঙ্গ"
                required
                options={[
                  { label: "পুরুষ", value: "MALE" },
                  { label: "মহিলা", value: "FEMALE" },
                ]}
                control={form.control}
              />
            </div>

            {/* ৩. কন্টাক্ট এবং সিকিউরিটি */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                name="user.phoneNumber"
                label="মোবাইল নম্বর"
                required
                icon={Phone}
                control={form.control}
                disabled={isEditMode}
              />
              {!isEditMode && (
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  name="user.password"
                  required
                  label="পাসওয়ার্ড"
                  icon={Lock}
                  control={form.control}
                />
              )}
            </div>

            {/* ৪. প্রফেশনাল তথ্য (স্লাগ এবং অভিজ্ঞতা) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="slug"
                required
                label="ইউনিক স্লাগ (English)"
                placeholder="dr-akash-heart"
                control={form.control}
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="experience"
                label="অভিজ্ঞতা (বছর)"
                type="number"
                control={form.control}
              />
            </div>
            {/* জরুরি সেবার সেকশন - লাইট থিম ফোকাসড */}
            <div className="p-4    border-2 bg-destructive-700/30  rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* আইকন কন্টেইনার */}
                  <div className="bg-indigo-50  p-3 rounded-2xl">
                    <AlertCircle
                      size={22}
                      className="text-indigo-600 dark:text-indigo-400"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="text-[13px] font-black text-slate-800   uppercase tracking-tight">
                      জরুরি সেবা
                    </label>
                  </div>
                </div>

                {/* ইমার্জেন্সি বুলিয়ান ইনপুট */}
                <div className="flex items-center">
                  <CustomFormField
                    fieldType={FormFieldType.CHECKBOX}
                    name="isEmergency"
                    label="সক্রিয়"
                    control={form.control}
                  />
                </div>
              </div>
            </div>
            {/* ৫. বিশেষজ্ঞ তথ্য (ডিপার্টমেন্ট এবং বিশেষজ্ঞ ক্ষেত্র) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                name="departmentId"
                label="ডিপার্টমেন্ট"
                required
                options={departmentOptions}
                icon={Stethoscope}
                control={form.control}
                disabled={isDeptLoading}
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="specialization"
                label="বিশেষজ্ঞ (বাংলায়)"
                required
                placeholder="যেমন: হৃদরোগ বিশেষজ্ঞ"
                control={form.control}
              />
            </div>

            {/* ৬. কর্মস্থল ও শিক্ষা */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="position"
                label="শিক্ষাগত যোগ্যতা (বাংলায়)"
                icon={GraduationCap}
                control={form.control}
                placeholder="EX: বিভাগীয় প্রধান"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="hospital"
                label="হাসপাতাল (বাংলায়)"
                required
                icon={Building2}
                control={form.control}
              />
            </div>

            {/* ৭. অতিরিক্ত লিংক */}
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name="website"
              label="ওয়েবসাইট লিংক"
              icon={Globe}
              control={form.control}
              placeholder="https://example.com"
            />

            {/* ৮. স্ট্যাটাস টগল - শুধুমাত্র এডিট মোডে */}
            {isEditMode && (
              <div className="mt-4 p-1 bg-slate-100 rounded-2xl flex gap-1">
                <button
                  type="button"
                  onClick={() => form.setValue("user.deactivate", false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
                    !form.watch("user.deactivate")
                      ? "bg-white text-emerald-600 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  <div
                    className={`h-2 w-2 rounded-full ${!form.watch("user.deactivate") ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`}
                  />
                  <span className="text-xs font-bold">সক্রিয়</span>
                </button>

                <button
                  type="button"
                  onClick={() => form.setValue("user.deactivate", true)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${
                    form.watch("user.deactivate")
                      ? "bg-white text-rose-600 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  <div
                    className={`h-2 w-2 rounded-full ${form.watch("user.deactivate") ? "bg-rose-500" : "bg-slate-300"}`}
                  />
                  <span className="text-xs font-bold">নিষ্ক্রিয়</span>
                </button>
                <input type="hidden" {...form.register("user.deactivate")} />
              </div>
            )}

            {/* ৯. সেভ বাটন */}
            <DialogFooter>
              <Button
                type="submit"
                disabled={isPending}
                className="w-full md:w-auto px-10 rounded-xl"
              >
                {isPending ? <Loader2 className="animate-spin" /> : "সেভ করুন"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
