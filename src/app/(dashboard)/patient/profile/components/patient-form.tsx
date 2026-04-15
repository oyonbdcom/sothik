/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Form } from "@/components/ui/form";
import {
  useGetSinglePatientQuery,
  useUpdatePatientMutation,
} from "@/redux/api/patientApi";
import { useGetAreasQuery, useGetDistrictsQuery } from "@/redux/api/setup";
import { zodResolver } from "@hookform/resolvers/zod";
import { skipToken } from "@reduxjs/toolkit/query";
import { Calendar, ChevronRight, Loader2, MapPin, User } from "lucide-react";
import { useEffect, useRef } from "react"; // useState যোগ করা হয়েছে
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "নাম অন্তত ২ অক্ষরের হতে হবে"),
  image: z.any().optional(), // এটিকে any করুন যাতে String বা File দুইটাই ধরে
  age: z.coerce.number().min(1, "সঠিক বয়স দিন").max(120),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  address: z.string().min(5, "পুরো ঠিকানা লিখুন"),
  district: z.string().min(1, "জেলা সিলেক্ট করুন"),
  area: z.string().min(1, "এরিয়া সিলেক্ট করুন"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function PatientProfileForm() {
  const isFirstRender = useRef(true);

  const { data: patient, isLoading: isPatientLoading } =
    useGetSinglePatientQuery(undefined);
  const [updatePatient] = useUpdatePatientMutation();
  const { data: distData, isLoading: isDistLoading } =
    useGetDistrictsQuery(undefined);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      age: 0,
      gender: "MALE",
      address: "",
      district: "",
      image: "",
      area: "",
    },
  });

  const { control, handleSubmit, reset, setValue } = form;
  const watchedDistrict = useWatch({ control, name: "district" });
  const { data: areaData, isLoading: isAreaLoading } = useGetAreasQuery(
    watchedDistrict || skipToken,
  );

  useEffect(() => {
    if (patient) {
      const dSlug = patient.patient?.area?.district?.slug || "";
      const aSlug = patient.patient?.area?.slug || "";
      const patientImg = patient.image || ""; // API থেকে আসা ইমেজ URL

      reset({
        name: patient.name || "",
        image: patientImg,
        age: patient.patient?.age || 0,
        gender: (patient.patient?.gender as any) || "MALE",
        address: patient.patient?.address || "",
        district: dSlug,
        area: aSlug,
      });

      // ডিফল্ট ইমেজ প্রিভিউ সেট করা
    }
  }, [patient, reset]);

  useEffect(() => {
    if (!isFirstRender.current) {
      setValue("area", "");
    }
    isFirstRender.current = false;
  }, [watchedDistrict, setValue]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!patient?.id) return toast.error("পেশেন্ট আইডি পাওয়া যায়নি");

    try {
      // যদি ইমেজ ফাইল হয় তবে FormData ব্যবহার করতে হতে পারে
      await updatePatient({
        id: patient.id,
        data: values,
      }).unwrap();
      toast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে!");
    } catch (error: any) {
      toast.error(error?.data?.message || "আপডেট করতে সমস্যা হয়েছে");
    }
  };

  if (isPatientLoading) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }
  console.log(patient);
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-[2.5rem] p-6 md:p-10 border border-slate-100 shadow-sm">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* প্রোফাইল কম্পোনেন্ট (ইমেজ হ্যান্ডলার) */}
          <CustomFormField
            fieldType={FormFieldType.PROFILE}
            control={control}
            name="image"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={control}
            name="name"
            label="আপনার সম্পূর্ণ নাম"
            placeholder="নাম লিখুন"
            icon={User}
          />

          {/* বাকি ইনপুটগুলো আগের মতোই থাকবে... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              type="number"
              control={control}
              name="age"
              label="বয়স"
              placeholder="বয়স দিন"
              icon={Calendar}
            />
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={control}
              name="gender"
              label="লিঙ্গ"
              placeholder="লিঙ্গ বেছে নিন"
              options={[
                { label: "পুরুষ", value: "MALE" },
                { label: "মহিলা", value: "FEMALE" },
                { label: "অন্যান্য", value: "OTHER" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={control}
              name="district"
              label="জেলা"
              placeholder={isDistLoading ? "লোড হচ্ছে..." : "জেলা বেছে নিন"}
              icon={MapPin}
              options={distData?.districts?.map((d: any) => ({
                label: d.name,
                value: d.slug,
              }))}
            />
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={control}
              name="area"
              label="নিকটস্থ এরিয়া"
              placeholder={
                isAreaLoading
                  ? "লোড হচ্ছে..."
                  : watchedDistrict
                    ? "এরিয়া বেছে নিন"
                    : "আগে জেলা বেছে নিন"
              }
              disabled={!watchedDistrict || isAreaLoading}
              icon={MapPin}
              options={areaData?.areas?.map((a: any) => ({
                label: a.name,
                value: a.slug,
              }))}
            />
          </div>

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={control}
            name="address"
            label="বিস্তারিত ঠিকানা"
            placeholder="বাসা নং, রোড নং, ইত্যাদি..."
            icon={MapPin}
          />

          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-black py-5 rounded-[1.8rem] shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:bg-slate-300"
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                তথ্য সংরক্ষণ করুন <ChevronRight size={20} />{" "}
              </>
            )}
          </button>
        </form>
      </Form>
    </div>
  );
}
