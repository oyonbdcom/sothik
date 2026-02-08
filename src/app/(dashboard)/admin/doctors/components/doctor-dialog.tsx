/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import {
  Building2,
  Globe,
  Loader2,
  Lock,
  MapPin,
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
import { doctorDepartments } from "@/constant/common";
import { bangladeshDistricts } from "@/constant/dristrict";
import { IDoctorResponse } from "@/interface/doctor";

import {
  useAddDoctorMutation,
  useUpdateDoctorMutation,
} from "@/redux/api/doctorApi";
import {
  CreateDoctorInput,
  createDoctorSchema,
  UpdateDoctorInput,
  updateDoctorSchema,
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

  // ১. মিউটেশন হুক সেটআপ (Redux Toolkit Query)
  const [addDoctor, { isLoading: isAdding }] = useAddDoctorMutation();
  const [updateDoctor, { isLoading: isUpdating }] = useUpdateDoctorMutation();

  const isPending = isAdding || isUpdating;
  const schema = isEditMode ? updateDoctorSchema : createDoctorSchema;

  type DoctorFormValues = CreateDoctorInput | UpdateDoctorInput;

  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      user: {
        name: "",
        phoneNumber: "",
        password: "Password3@#",
        role: "DOCTOR",
        image: "",
      },
      department: "",
      gender: "MALE",
      active: true,
    },
  });

  // ২. এডিট মোডে থাকলে ফর্মের ভেতর ডাক্তারের তথ্যগুলো অটোমেটিক বসানো
  useEffect(() => {
    if (isEditMode && doctor) {
      form.reset({
        user: {
          name: doctor.user?.name || "",
          phoneNumber: doctor.user?.phoneNumber || "",
          password: "Password3@#",
          role: "DOCTOR",
          image: doctor.user?.image ?? "",
        },
        department: doctor.department || "",
        gender: (doctor.gender as "MALE" | "FEMALE") || "MALE",
        hospital: doctor.hospital || "",
        degree: doctor.degree || "",
        city: doctor.city || "",
        active: doctor?.active,
        country: doctor.country || "Bangladesh",
        position: doctor.position || "",
        website: doctor.website || "",
        bio: doctor.bio || "",
        district: doctor.district || "",
        specialization: doctor.specialization || "",
      });
    } else if (!isEditMode && open) {
      form.reset({
        user: {
          name: "",
          phoneNumber: "",
          password: "Password@123",
          role: "DOCTOR",
          image: "",
        },
        department: "",
        gender: "MALE",
        active: true,
      });
    }
  }, [doctor, isEditMode, open, form]);

  // ৩. ফর্ম সাবমিট হ্যান্ডলার
  async function onSubmit(values: DoctorFormValues) {
    try {
      if (isEditMode && doctor?.id) {
        await updateDoctor({
          id: doctor.user?.id,
          data: values as UpdateDoctorInput,
        }).unwrap();
        toast.success("ডাক্তারের প্রোফাইল আপডেট করা হয়েছে!");
      } else {
        await addDoctor(values as CreateDoctorInput).unwrap();
        toast.success("নতুন ডাক্তার যোগ করা হয়েছে!");
      }

      setOpen(false); // কাজ শেষ হলে পপ-আপ বন্ধ করা
      if (!isEditMode) form.reset();
    } catch (error: any) {
      console.log("Submission Error:", error);
      const errorMessage =
        error?.message || "কিছু একটা সমস্যা হয়েছে, আবার চেষ্টা করুন।";
      toast.error(errorMessage);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={isEditMode ? "outline" : "soft"} size="sm">
          {isEditMode ? (
            <Icon icon="heroicons:pencil" className="h-4 w-4" />
          ) : (
            <>
              <Icon icon="heroicons:plus" className="h-4 w-4 mr-2" />
              ডাক্তার যোগ করুন
            </>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Icon
                icon={
                  isEditMode ? "heroicons:pencil-square" : "heroicons:user-plus"
                }
                className="h-5 w-5"
              />
            </div>
            {isEditMode ? "প্রোফাইল আপডেট করুন" : "নতুন ডাক্তার নিবন্ধন"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "ডাক্তারের তথ্য পরিবর্তন করতে নিচের ফিল্ডগুলো পূরণ করুন।"
              : "সিস্টেমে নতুন ডাক্তার যুক্ত করতে প্রয়োজনীয় তথ্যগুলো দিন।"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* প্রোফাইল ছবি আপলোড */}
            <CustomFormField
              fieldType={FormFieldType.PROFILE}
              name="user.image"
              control={form.control}
              containerClassName="w-fit"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="user.name"
                label="পূর্ণ নাম"
                placeholder="যেমন: ডাঃ আকাশ রহমান"
                icon={User}
                control={form.control}
              />

              <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                name="user.phoneNumber"
                label="মোবাইল নম্বর"
                placeholder="0123456789"
                icon={Phone}
                control={form.control}
                disabled={isEditMode}
                required
              />

              {!isEditMode && (
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  name="user.password"
                  label="পাসওয়ার্ড"
                  icon={Lock}
                  control={form.control}
                />
              )}

              <CustomFormField
                fieldType={FormFieldType.SELECT}
                name="department"
                label="ডিপার্টমেন্ট"
                options={doctorDepartments}
                icon={Stethoscope}
                control={form.control}
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="degree"
                label="ডিগ্রি / বিশেষজ্ঞ (Degree )"
                placeholder="যেমন: এম.বি.বি.এস, কার্ডিওলজিস্ট"
                control={form.control}
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="specialization"
                label="বিশেষজ্ঞ (Specialization)"
                placeholder="যেমন: কার্ডিওলজিস্ট"
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
                name="position"
                label="পদবী"
                placeholder="সিনিয়র কনসালটেন্ট"
                control={form.control}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="hospital"
                label="হাসপাতাল / ক্লিনিক"
                icon={Building2}
                control={form.control}
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="website"
                label="ওয়েবসাইট (যদি থাকে)"
                icon={Globe}
                control={form.control}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                name="district"
                label="জেলা"
                options={bangladeshDistricts}
                icon={MapPin}
                control={form.control}
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                name="city"
                label="শহর"
                icon={MapPin}
                control={form.control}
              />
            </div>

            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              name="bio"
              label="সংক্ষিপ্ত বর্ণনা"
              control={form.control}
            />

            {/* স্ট্যাটাস সেকশন (Active/Inactive) */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="space-y-0.5">
                <label className="text-sm font-semibold text-gray-700">
                  অ্যাভেইলিবিলিটি স্ট্যাটাস
                </label>
                <p className="text-xs text-gray-500">
                  ডাক্তার বর্তমানে এভেইলএবল কি না তা নির্ধারণ করুন।
                </p>
              </div>

              <div className="inline-flex p-1 bg-gray-200 rounded-lg shadow-inner">
                <button
                  type="button"
                  onClick={() => form.setValue("active", true)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                    form.watch("active") === true
                      ? "bg-white text-green-600 shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  সক্রিয়
                </button>
                <button
                  type="button"
                  onClick={() => form.setValue("active", false)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                    form.watch("active") === false
                      ? "bg-white text-red-600 shadow-sm"
                      : "text-gray-500"
                  }`}
                >
                  নিষ্ক্রিয়
                </button>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                বাতিল করুন
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    সেভ হচ্ছে...
                  </>
                ) : isEditMode ? (
                  "পরিবর্তন সেভ করুন"
                ) : (
                  "নিবন্ধন সম্পন্ন করুন"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
