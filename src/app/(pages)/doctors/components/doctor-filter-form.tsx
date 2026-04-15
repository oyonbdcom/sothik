/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Form } from "@/components/ui/form";
import { useDebounce } from "@/hooks/useDebaunce";
import {
  useGetAreasQuery,
  useGetDepartmentsQuery,
  useGetDistrictsQuery,
} from "@/redux/api/setup";
import { skipToken } from "@reduxjs/toolkit/query";
import {
  ChevronDown,
  FilterX,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  Stethoscope,
  User,
  X, // Close আইকনের জন্য
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  searchTerm: z.string().optional(),
  department: z.string().optional(),
  district: z.string().optional(),
  area: z.string().optional(),
  gender: z.string().optional(),
  rating: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const DoctorFilterForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFirstRender = useRef(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Redux API Queries
  const { data: departments, isLoading: isDeptLoading } =
    useGetDepartmentsQuery(undefined);
  const { data: districts, isLoading: isDistLoading } =
    useGetDistrictsQuery(undefined);

  const form = useForm<FormData>({
    defaultValues: {
      searchTerm: searchParams.get("searchTerm") || "",
      department: searchParams.get("department") || "",
      district: searchParams.get("district") || "",
      area: searchParams.get("area") || "",
      gender: searchParams.get("gender") || "",
      rating: searchParams.get("rating") || "",
    },
  });

  const { control, reset, setValue } = form;
  const watchedValues = useWatch({ control });
  const debouncedSearchTerm = useDebounce(watchedValues.searchTerm, 500);

  // এরিয়া ফেচিং (ডিস্ট্রিক্ট স্লাগ অনুযায়ী)
  const { data: areas, isLoading: isAreaLoading } = useGetAreasQuery(
    watchedValues.district ? watchedValues.district : skipToken,
  );

  // জেলা পরিবর্তন হলে এরিয়া রিসেট
  useEffect(() => {
    if (!isFirstRender.current) {
      setValue("area", "");
    }
  }, [watchedValues.district, setValue]);

  // URL Sync
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const params = new URLSearchParams();
    Object.entries(watchedValues).forEach(([key, value]) => {
      const finalValue = key === "searchTerm" ? debouncedSearchTerm : value;
      if (finalValue) params.set(key, finalValue as string);
      else params.delete(key);
    });

    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  }, [debouncedSearchTerm, watchedValues, router]);

  const resetFilters = () => {
    reset({
      searchTerm: "",
      department: "",
      district: "",
      area: "",
      gender: "",
      rating: "",
    });
  };

  return (
    <div className="w-full   bg-white border border-slate-200 rounded-2xl shadow-sm">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden w-full flex items-center justify-between p-4  active:scale-[0.98] transition-all"
      >
        <span className="flex items-center gap-2 font-bold text-slate-700">
          <SlidersHorizontal size={18} className="text-indigo-600" />
          {isMobileOpen ? "ফিল্টার বন্ধ করুন" : "ফিল্টার করুন"}
        </span>
        {isMobileOpen ? (
          <X size={20} className="text-slate-500" />
        ) : (
          <ChevronDown size={20} className="text-slate-500" />
        )}
      </button>

      {/* Filter Container */}
      <div
        className={` p-4 pt-0 ${isMobileOpen ? "block" : "hidden"} lg:block`}
      >
        <div className="  relative">
          {/* Header */}

          <Form {...form}>
            <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
              {/* সার্চ ইনপুট */}
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={control}
                name="searchTerm"
                placeholder="ডাক্তারের  নাম দিয়ে সার্চ করুন..."
                icon={Search}
              />

              {/* স্পেশালিটি সিলেক্ট */}
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={control}
                name="department"
                placeholder={isDeptLoading ? "লোডিং..." : "স্পেশালিটি বেছে নিন"}
                icon={Stethoscope}
                options={departments?.departments?.map((dept: any) => ({
                  label: dept.name,
                  value: dept.slug,
                }))}
              />

              {/* জেলা সিলেক্ট */}
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={control}
                name="district"
                placeholder={isDistLoading ? "লোডিং..." : "জেলা বেছে নিন"}
                icon={MapPin}
                options={districts?.districts?.map((dist: any) => ({
                  label: dist.name,
                  value: dist.slug,
                }))}
              />

              {/* এরিয়া সিলেক্ট (জেলা নির্ভর) */}
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={control}
                name="area"
                placeholder={
                  isAreaLoading
                    ? "লোডিং..."
                    : watchedValues.district
                      ? "এরিয়া বেছে নিন"
                      : "আগে জেলা বেছে নিন"
                }
                disabled={!watchedValues.district}
                icon={MapPin}
                options={areas?.areas?.map((area: any) => ({
                  label: area.name,
                  value: area.slug,
                }))}
              />

              {/* জেন্ডার সিলেক্ট */}
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={control}
                name="gender"
                placeholder="লিঙ্গ বেছে নিন"
                icon={User}
                options={[
                  { label: "পুরুষ", value: "MALE" },
                  { label: "মহিলা", value: "FEMALE" },
                ]}
              />

              {/* রেটিং সিলেক্ট */}
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={control}
                name="rating"
                placeholder="রেটিং বেছে নিন"
                icon={Star}
                options={[
                  { label: "৫ স্টার", value: "5" },
                  { label: "৪+ স্টার", value: "4" },
                  { label: "৩+ স্টার", value: "3" },
                ]}
              />
            </form>
          </Form>
          <div className="flex items-center justify-between mt-6">
            <h2 className="hidden lg:flex items-center gap-2 font-black text-slate-800 uppercase tracking-tight text-sm">
              <Search size={16} className="text-indigo-600" />
              Advanced Doctor Search
            </h2>

            <div className="flex items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-[11px] font-bold text-rose-500 hover:bg-rose-50 px-3 py-1.5 rounded-full transition-all"
              >
                <FilterX size={14} /> রিসেট করুন
              </button>

              {/* মোবাইল ভিউতে আলাদা ক্লোজ বাটন */}
              <button
                onClick={() => setIsMobileOpen(false)}
                className="lg:hidden p-2 bg-slate-100 rounded-full text-slate-600"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorFilterForm;
