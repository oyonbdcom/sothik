/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Form } from "@/components/ui/form";
import {
  useGetDepartmentsQuery,
  useGetDistrictsQuery,
} from "@/redux/api/setup";
import { MapPin, Search, Stethoscope } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

export function Searchbar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- API ফেচিং ---
  const { data: deptData, isLoading: isDeptLoading } =
    useGetDepartmentsQuery(undefined);
  const { data: distData, isLoading: isDistLoading } =
    useGetDistrictsQuery(undefined);

  const departments = deptData?.departments || [];
  const districts = distData?.districts || [];

  const form = useForm({
    defaultValues: {
      searchTerm: searchParams.get("searchTerm") || "",
      district: searchParams.get("district") || "",
      department: searchParams.get("department") || "",
    },
  });

  const onSubmit = (values: any) => {
    const params = new URLSearchParams();

    if (values.searchTerm?.trim()) {
      params.set("searchTerm", values.searchTerm.trim());
    }

    if (values.district) {
      params.set("district", values.district);
    }

    if (values.department) {
      params.set("department", values.department);
    }

    router.push(`/doctors?${params.toString()}`);
  };

  const handleTagClick = (tagValue: string) => {
    form.setValue("department", tagValue);
  };

  return (
    <section className="container relative z-20">
      <div className="bg-white m ">
        {/* Header */}
        <div className="mb-6 lg:pt-2">
          <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
            🩺 ডাক্তার খুঁজুন
          </h2>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col lg:flex-row items-stretch lg:items-end gap-4 w-full"
          >
            {/* District */}
            <div className="flex-1 min-w-0">
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="district"
                placeholder={isDistLoading ? "লোডিং..." : "অবস্থান বেছে নিন..."}
                options={districts.map((d: any) => ({
                  label: d.name,
                  value: d.slug || d.id,
                }))}
                icon={MapPin}
                className="h-12 ring-1"
              />
            </div>

            {/* Department */}
            <div className="flex-1 min-w-0">
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="department"
                placeholder={isDeptLoading ? "লোডিং..." : "বিশেষজ্ঞতা..."}
                options={departments.map((d: any) => ({
                  label: d.name,
                  value: d.slug || d.id,
                }))}
                icon={Stethoscope}
                className="h-12 ring-1"
              />
            </div>

            {/* Search Input */}
            <div className="flex-[1.5] min-w-0">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="searchTerm"
                placeholder="ডাক্তারের নাম..."
                className="h-12 ring-1"
                icon={Search}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold px-10 rounded-xl transition-all active:scale-95 h-[48px] lg:h-[52px] w-full lg:w-auto"
            >
              <Search className="w-4 h-4 mr-2 inline" />
              অনুসন্ধান
            </button>
          </form>
        </Form>

        {/* Quick Suggestion Tags */}
        {departments.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-6 px-4">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              জনপ্রিয়:
            </span>

            {departments.slice(0, 5).map((dept: any) => (
              <button
                key={dept.id}
                type="button"
                className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-4 py-1.5 rounded-full hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm"
                onClick={() => handleTagClick(dept.slug || dept.id)}
              >
                {dept.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
