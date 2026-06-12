/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  Globe,
  GraduationCap,
  Loader2,
  Lock,
  Phone,
  Stethoscope,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
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
import ImageUpload from "../imageupload";

interface DoctorDialogProps {
  doctor?: IDoctorResponse;
  isEditMode?: boolean;
}

export default function DoctorDialog({
  doctor,
  isEditMode,
}: DoctorDialogProps) {
  const [open, setOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

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
      educations: [],
      slug: "",
      isEmergency: false,
      departmentId: "",
      position: "",
      gender: "MALE",
      website: "",
      experience: undefined,
      specialization: "",
      hospital: "",
    },
  });

  // ৩. এডিট মোড ডাটা পপুলেশন
  useEffect(() => {
    if (isEditMode && doctor) {
      form.reset({
        ...doctor,
        departmentId: doctor.department?.id || "", // নিশ্চিত করুন ডাক্তার অবজেক্টে departmentId আছে
        experience: Number(doctor.experience),

        // এখানে educations ফিল্ডটি ম্যাপ করুন
        educations:
          doctor.educations?.map((edu) => ({
            degree: edu.degree || "",
            institution: edu.institution || "",

            passingYear: edu.passingYear,
          })) || [],

        user: {
          name: doctor.user?.name || "",
          phoneNumber: doctor.user?.phoneNumber || "",
          password: "",
          role: "DOCTOR",
          image: doctor.user?.image || "",
          deactivate: doctor.user?.deactivate ?? false,
        },
      } as any);
    }
  }, [doctor, isEditMode, form]);
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "educations",
  });

  // ৫. সাবমিট হ্যান্ডলার
  async function onSubmit(values: DoctorFormValues) {
    try {
      // ইমেজ আপডেট হ্যান্ডলিং
      const finalData = {
        ...values,
        user: {
          ...values.user,
          image: photoPreview || values.user.image,
        },
      };

      if (isEditMode && doctor?.id) {
        await updateDoctor({
          id: doctor.id,
          data: finalData,
        }).unwrap();
        toast.success("ডাক্তারের প্রোফাইল আপডেট করা হয়েছে!");
      } else {
        await addDoctor(finalData).unwrap();
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
          variant="ghost"
          className="rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          {isEditMode ? "এডিট করুন" : "ডাক্তার যোগ করুন"}
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
        <ImageUpload
          value={doctor?.user?.image || ""}
          setPhotoPreview={(url: string) => setPhotoPreview(url)}
          label="Upload Doctor Profile Photo"
        />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* ১. প্রোফাইল ইমেজ - সেন্টারে */}

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
              {isEditMode && (
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  name="user.password"
                  required
                  label="পাসওয়ার্ড"
                  placeholder=""
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
                placeholder="25"
              />
            </div>
            {/* জরুরি সেবার সেকশন - লাইট থিম ফোকাসড */}

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
                placeholder="দিনাজপুর মেডিকেল কলেজ ও হাসপাতাল "
                icon={Building2}
                control={form.control}
              />
            </div>
            {isEditMode && (
              <div className="border-t border-slate-200 pt-6 mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <GraduationCap size={18} />
                    <h3>শিক্ষাগত যোগ্যতা</h3>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({
                        degree: "",
                        institution: "",
                        subject: "",
                        passingYear: new Date().getFullYear(),
                      })
                    }
                  >
                    + ডিগ্রি যোগ করুন
                  </Button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="p-4 border rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4 items-end"
                    >
                      <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        // যদি educations সরাসরি থাকে তবে "educations..." আর user এর ভেতরে থাকলে "user.educations..."
                        name={`educations.${index}.degree`}
                        label="ডিগ্রি"
                        placeholder="যেমন: MBBS, FCPS, MD"
                        control={form.control}
                      />

                      <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        name={`educations.${index}.institution`}
                        label="প্রতিষ্ঠান"
                        placeholder="যেমন: Dhaka Medical College"
                        control={form.control}
                      />

                      <CustomFormField
                        fieldType={FormFieldType.INPUT}
                        name={`educations.${index}.passingYear`}
                        label="পাসিং ইয়ার" // লেবেল ঠিক করা হয়েছে
                        placeholder="যেমন: 2015" // প্লেসহোল্ডার ঠিক করা হয়েছে
                        type="number" // টাইপ নাম্বার দেওয়া হয়েছে যাতে ইউজার শুধু সংখ্যা লিখতে পারে
                        control={form.control}
                      />

                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="text-red-500 hover:bg-red-50"
                        >
                          X
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
            <div className="space-y-4">
              <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-3">
                Availability Status
              </p>

              {/* ইমার্জেন্সি কার্ড - মোবাইলে ফুল উইডথ */}
              <div className="p-4 border-2 border-slate-100 bg-slate-50 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <label className="text-[13px] font-black text-slate-800 uppercase tracking-tight">
                      জরুরি সেবা
                    </label>
                    <span className="text-[11px] text-slate-500 mt-0.5">
                      {form.watch("isEmergency")
                        ? "বর্তমানে সক্রিয়"
                        : "বর্তমানে নিষ্ক্রিয়"}
                    </span>
                  </div>

                  {/* Custom Toggle Switch */}
                  <button
                    type="button"
                    onClick={() =>
                      form.setValue("isEmergency", !form.watch("isEmergency"))
                    }
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                      form.watch("isEmergency")
                        ? "bg-emerald-500"
                        : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
                        form.watch("isEmergency")
                          ? "translate-x-7"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Zod এর সাথে সংযোগের জন্য hidden input */}
                <input type="hidden" {...form.register("isEmergency")} />
              </div>

              {/* অ্যাক্টিভ/নিষ্ক্রিয় বাটন গ্রুপ */}
              {isEditMode && (
                <div className="w-full">
                  <div className="p-1 bg-slate-100 rounded-2xl flex gap-1">
                    <button
                      type="button"
                      onClick={() => form.setValue("user.deactivate", false)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
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
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
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
                  </div>
                </div>
              )}
            </div>

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
