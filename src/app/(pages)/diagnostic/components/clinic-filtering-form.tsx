"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Form } from "@/components/ui/form";
import { bangladeshDistricts } from "@/constant/dristrict";
import { useDebounce } from "@/hooks/useDebaunce";

const formSchema = z.object({
  searchTerm: z.string().optional(),
  district: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const ClinicFilterForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);

  const form = useForm<FormData>({
    defaultValues: {
      searchTerm: searchParams.get("search") || "",
      district: searchParams.get("district") || "",
    },
  });

  const watchedValues = useWatch({ control: form.control });
  // ৫০০ মিলি-সেকেন্ডের ডিবউন্স সেট করা হয়েছে
  const debouncedValues = useDebounce(watchedValues, 500);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const params = new URLSearchParams();

    if (debouncedValues.searchTerm) {
      params.set("search", debouncedValues.searchTerm);
    }
    if (debouncedValues.district) {
      params.set("district", debouncedValues.district);
    }

    // নতুন URL তৈরি করা হচ্ছে
    router.push(`?${params.toString()}`, { scroll: false });
  }, [debouncedValues, router]);

  return (
    <Form {...form}>
      <form className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          name="searchTerm"
          control={form.control}
          placeholder="ক্লিনিকের নাম লিখুন..."
          label="সার্চ করুন"
        />

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          name="district"
          control={form.control}
          placeholder="জেলা নির্বাচন করুন"
          label="জেলা"
          options={bangladeshDistricts}
        />
      </form>
    </Form>
  );
};

export default ClinicFilterForm;
