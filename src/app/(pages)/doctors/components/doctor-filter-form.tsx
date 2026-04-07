"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react"; // useState যোগ করা হয়েছে
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { bangladeshDistricts } from "@/constant/dristrict";
import { useDebounce } from "@/hooks/useDebaunce";
import { Gender } from "@/types/common";
import CustomFormField, {
  FormFieldType,
} from "../../../../components/custom-form-field";

import { doctorDepartments } from "@/constant/common";
import {
  ChevronDown,
  ChevronUp,
  FilterX,
  MapPin,
  Search,
  SlidersHorizontal,
  Stethoscope,
  User,
} from "lucide-react"; // বাড়তি আইকন
import { Button } from "../../../../components/ui/button";
import { Form } from "../../../../components/ui/form";

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

  // মোবাইলের জন্য টগল স্টেট
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<FormData>({
    defaultValues: {
      searchTerm: searchParams.get("searchTerm") || "",
      department: searchParams.get("department") || "",
      district: searchParams.get("district") || "",
      gender: searchParams.get("gender") || "",
    },
  });

  const watchedValues = useWatch({ control: form.control });
  const debouncedSearchTerm = useDebounce(watchedValues.searchTerm, 500);

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
  }, [
    debouncedSearchTerm,
    watchedValues.department,
    watchedValues.district,
    watchedValues.gender,
    router,
  ]);

  const resetFilters = () => {
    form.reset({
      searchTerm: "",
      department: "",
      district: "",
      gender: "",
    });
  };

  return (
    <div className="relative z-20 space-y-3">
      {/* ১. মোবাইল টগল বাটন (শুধুমাত্র মোবাইলে দেখা যাবে) */}
      <div className="lg:hidden">
        <Button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between h-12 px-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-sm hover:bg-slate-50 transition-all"
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span>ডাক্তার ফিল্টার করুন</span>
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* ২. ফিল্টার ফর্ম এরিয়া */}
      <div
        className={`${isOpen ? "block" : "hidden"} lg:block transition-all duration-300`}
      >
        <Form {...form}>
          <form
            role="search"
            aria-label="Doctor Filter"
            className="bg-white dark:bg-slate-950 p-5 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-slate-100 dark:border-slate-800 transition-all"
          >
            {/* Header Area (ডেস্কটপে সুন্দর দেখানোর জন্য) */}
            <div className="hidden lg:flex items-center justify-between mb-6 px-1">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                  ফিল্টার করুন
                </h2>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                  আপনার প্রয়োজনীয় বিশেষজ্ঞ খুঁজে নিন
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                onClick={resetFilters}
                className="h-8 px-4 text-[11px] font-black text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-all flex items-center gap-1.5"
              >
                <FilterX className="w-3.5 h-3.5" />
                সব মুছুন
              </Button>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="group transition-all">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  name="searchTerm"
                  control={form.control}
                  placeholder="ডাক্তারের নাম..."
                  label="সার্চ"
                  icon={Search}
                  className="bg-slate-50 border-none focus-within:ring-2 focus-within:ring-blue-500/20 transition-all rounded-2xl"
                />
              </div>

              <div className="group transition-all">
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  name="department"
                  control={form.control}
                  placeholder="সিলেক্ট করুন"
                  label="ডিপার্টমেন্ট"
                  options={doctorDepartments}
                  icon={Stethoscope}
                  className="bg-slate-50 border-none transition-all rounded-2xl"
                />
              </div>

              <div className="group transition-all">
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  name="district"
                  control={form.control}
                  placeholder="সিলেক্ট করুন"
                  label="জেলা/অবস্থান"
                  options={bangladeshDistricts}
                  icon={MapPin}
                  className="bg-slate-50 border-none transition-all rounded-2xl"
                />
              </div>

              <div className="group transition-all">
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
                  className="bg-slate-50 border-none transition-all rounded-2xl"
                />
              </div>
            </div>

            {/* মোবাইল ইউজারদের জন্য রিসেট বাটনটি নিচে দেখানো ভালো */}
            <div className="lg:hidden mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                variant="ghost"
                className="w-full text-rose-500 font-bold text-xs flex items-center justify-center gap-2"
              >
                <FilterX className="w-4 h-4" />
                ফিল্টার বন্দ করুন
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default DoctorFilterForm;
