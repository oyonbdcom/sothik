/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
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
        name: "ডাঃ",
        phoneNumber: "",
        password: "",
        role: "DOCTOR",
        image: "",
        deactivate: false,
      },
      slug: "",
      departmentId: "",
      gender: "MALE",
      website: "#",
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
        experience: Number(doctor.experience) || 0,
        user: {
          name: doctor.user?.name || "",
          phoneNumber: doctor.user?.phoneNumber || "",
          password: "", // পাসওয়ার্ড সিকিউরিটির জন্য খালি রাখা হয়েছে
          role: "DOCTOR",
          image: doctor.user?.image || "",
          deactivate: doctor.user?.deactivate ?? false,
        },
        website: doctor?.website,
      } as any);
    }
  }, [doctor, isEditMode, form]);

  // ৫. সাবমিট হ্যান্ডলার
  async function onSubmit(values: DoctorFormValues) {
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
            <div className="flex justify-center">
              <CustomFormField
                fieldType={FormFieldType.PROFILE}
                name="user.image"
                control={form.control}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="user.name"
                label="পূর্ণ নাম (বাংলায়)"
                placeholder="ডাঃ "
                icon={User}
                control={form.control}
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="slug"
                label="ইউনিক স্লাগ (English)"
                placeholder="dr-akash-heart"
                control={form.control}
              />

              <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                name="user.phoneNumber"
                label="মোবাইল নম্বর"
                icon={Phone}
                control={form.control}
                disabled={isEditMode}
              />

              {!isEditMode && (
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  name="user.password"
                  label="পাসওয়ার্ড"
                  icon={Lock}
                  control={form.control}
                />
              )}

              <CustomFormField
                fieldType={FormFieldType.SELECT}
                name="departmentId"
                label="ডিপার্টমেন্ট"
                options={departmentOptions}
                icon={Stethoscope}
                control={form.control}
                disabled={isDeptLoading}
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="specialization"
                label="বিশেষজ্ঞ (বাংলায়)"
                placeholder="যেমন: হৃদরোগ বিশেষজ্ঞ"
                control={form.control}
              />

              <CustomFormField
                fieldType={FormFieldType.SELECT}
                name="gender"
                label="লিঙ্গ"
                options={[
                  { label: "পুরুষ", value: "MALE" },
                  { label: "মহিলা", value: "FEMALE" },
                ]}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="hospital"
                label="হাসপাতাল (বাংলায়)"
                icon={Building2}
                control={form.control}
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="education"
                label="শিক্ষাগত যোগ্যতা (বাংলায়)"
                icon={GraduationCap}
                control={form.control}
                placeholder="MBBS, FCPS"
              />
            </div>
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              name="website"
              label="ওয়েবসাইট লিংক"
              icon={Globe}
              control={form.control}
              placeholder="https://example.com"
            />
            {/* Status Toggle - শুধুমাত্র এডিট মোডে দেখাবে */}
            {isEditMode && (
              <div className="mt-4 p-1 bg-slate-100 rounded-2xl flex gap-1">
                {/* একটিভ বাটন */}
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
                  <span className="text-xs font-bold">সক্রিয়</span>
                </button>

                {/* ইনাক্টিভ বাটন */}
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
                  <span className="text-xs font-bold">নিষ্ক্রিয়</span>
                </button>

                <input type="hidden" {...form.register("user.deactivate")} />
              </div>
            )}
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
