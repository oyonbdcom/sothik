"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { bangladeshDistricts } from "@/constant/dristrict";
import { useDebounce } from "@/hooks/useDebaunce";
import { Gender } from "@/types/common";
import CustomFormField, { FormFieldType } from "../custom-form-field";

import { doctorDepartments } from "@/constant/common";
import { MapPin, Search, Stethoscope, User } from "lucide-react";
import { Form } from "../ui/form";

const formSchema = z.object({
  searchTerm: z.string().optional(),
  department: z.string().optional(),
  district: z.string().optional(),
  gender: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const DoctorFilterForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  const form = useForm<FormData>({
    defaultValues: {
      searchTerm: searchParams.get("searchTerm") || "",
      department: searchParams.get("department") || "",
      district: searchParams.get("district") || "",
      gender: searchParams.get("gender") || "",
    },
  });

  const watchedValues = useWatch({ control: form.control });

  // ডিবউন্সড ভ্যালু (বিশেষ করে সার্চ টার্মের জন্য যেন প্রতি ক্লিকে রিকোয়েস্ট না যায়)
  const debouncedSearchTerm = useDebounce(watchedValues.searchTerm, 500);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const params = new URLSearchParams();

    // বর্তমান ওয়াচড ভ্যালুগুলো লুপ করে প্যারামস সেট করা
    Object.entries(watchedValues).forEach(([key, value]) => {
      // যদি সার্চ টার্ম হয় তবে ডিবউন্সড ভ্যালু ব্যবহার করা হবে
      const finalValue = key === "searchTerm" ? debouncedSearchTerm : value;

      if (finalValue) {
        params.set(key, finalValue as string);
      } else {
        params.delete(key);
      }
    });

    // পেজ নম্বর রিসেট করা (ফিল্টার পরিবর্তন করলে ১ নম্বর পেজ থেকে দেখানো উচিত)
    params.set("page", "1");

    router.push(`?${params.toString()}`, { scroll: false });
  }, [
    debouncedSearchTerm,
    watchedValues.department,
    watchedValues.district,
    watchedValues.gender,
    router,
  ]);

  return (
    <Form {...form}>
      <form
        role="search"
        aria-label="Doctor Filter"
        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-gray-800 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          name="searchTerm"
          control={form.control}
          placeholder="ডাক্তারের নাম দিয়ে খুঁজুন"
          label="সার্চ"
          className="w-full"
          icon={Search}
        />

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          name="department"
          control={form.control}
          placeholder="বিভাগ নির্বাচন করুন"
          label="বিশেষজ্ঞ বিভাগ"
          options={doctorDepartments}
          icon={Stethoscope}
        />

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          name="district"
          control={form.control}
          placeholder="জেলা নির্বাচন করুন"
          label="অবস্থান"
          options={bangladeshDistricts}
          icon={MapPin}
        />

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          name="gender"
          control={form.control}
          label="লিঙ্গ"
          placeholder="সব"
          options={[
            { value: Gender.MALE, label: "পুরুষ" },
            { value: Gender.FEMALE, label: "মহিলা" },
          ]}
          icon={User}
        />
      </form>
    </Form>
  );
};

export default DoctorFilterForm;
