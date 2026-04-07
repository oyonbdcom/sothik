/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Form } from "@/components/ui/form";
import { doctorDepartments } from "@/constant/common";
import { bangladeshDistricts } from "@/constant/dristrict";
import { MapPin, Search, Stethoscope } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export function Searchbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTab, setSearchTab] = useState<"doctor" | "center">("doctor");

  const form = useForm({
    defaultValues: {
      searchTerm: searchParams.get("searchTerm") || "",
      district: searchParams.get("district") || "",
      department: searchParams.get("department") || "",
    },
  });

  const onSubmit = (values: any) => {
    const params = new URLSearchParams();

    if (values.searchTerm) params.set("searchTerm", values.searchTerm);
    if (values.district) params.set("district", values.district);

    if (searchTab === "doctor" && values.department) {
      params.set("department", values.department);
    }

    const path = searchTab === "doctor" ? "/doctors" : "/diagnostic";
    router.push(`${path}?${params.toString()}`);
  };

  // Helper to handle Quick Tags
  const handleTagClick = (tagLabel: string) => {
    const dept = doctorDepartments.find((d) => d.label.includes(tagLabel));
    if (dept) {
      form.setValue("department", dept.value);
      setSearchTab("doctor");
    } else {
      form.setValue("searchTerm", tagLabel);
    }
  };

  return (
    <section className="container -mt-8 relative z-20">
      <div className="bg-white rounded-3xl shadow-2xl shadow-blue-900/5 border border-slate-100 p-2 lg:p-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 px-4 pt-2">
          <button
            type="button"
            onClick={() => setSearchTab("doctor")}
            className={`flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-2xl transition-all ${
              searchTab === "doctor"
                ? "bg-blue-700 text-white shadow-lg shadow-blue-200"
                : "bg-slate-50 text-slate-500 hover:bg-slate-100"
            }`}
          >
            🩺 ডাক্তার খুঁজুন
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchTab("center");
              form.setValue("department", ""); // Clear dept when switching to centers
            }}
            className={`flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-2xl transition-all ${
              searchTab === "center"
                ? "bg-blue-700 text-white shadow-lg shadow-blue-200"
                : "bg-slate-50 text-slate-500 hover:bg-slate-100"
            }`}
          >
            🏥 সেন্টার খুঁজুন
          </button>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col lg:flex-row items-stretch lg:items-end gap-4 p-4 lg:p-0 w-full"
          >
            <div className="flex-1 min-w-0">
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="district"
                placeholder="অবস্থান বেছে নিন..."
                options={bangladeshDistricts}
                icon={MapPin}
                className="h-12 ring-1"
                // Ensure CustomFormField doesn't have internal mb-6
              />
            </div>

            {searchTab === "doctor" && (
              <div className="flex-1 min-w-0">
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="department"
                  placeholder="বিশেষজ্ঞতা..."
                  options={doctorDepartments}
                  icon={Stethoscope}
                  className="h-12 ring-1"
                />
              </div>
            )}

            <div className="flex-[1.5] min-w-0">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="searchTerm"
                placeholder={
                  searchTab === "doctor"
                    ? "ডাক্তারের নাম..."
                    : "সেন্টারের নাম..."
                }
                className="h-12 ring-1"
                icon={Search}
              />
            </div>

            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold px-10 rounded-xl transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2 active:scale-95 h-[48px] lg:h-[52px] w-full lg:w-auto flex-shrink-0 mb-[2px]"
            >
              <Search className="w-4 h-4" />
              অনুসন্ধান করুন
            </button>
          </form>
        </Form>

        {/* Quick Suggestion Tags */}
        {searchTab === "doctor" && (
          <div className="flex flex-wrap items-center gap-2 mt-6 px-4">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              জনপ্রিয়:
            </span>
            {[
              {
                id: "med-01",
                label: "মেডিসিন বিশেষজ্ঞ",
                value: "medicine",
                icon: "💊",
                count: 0,
              },
              {
                id: "card-01",
                label: "হৃদরোগ (হার্ট) বিশেষজ্ঞ",
                value: "cardiology",
                icon: "💓",
                count: 0,
              },
              {
                id: "neuro-01",
                label: "মস্তিষ্ক ও স্নায়ু বিশেষজ্ঞ",
                value: "neurology",
                icon: "🧠",
                count: 0,
              },
              {
                id: "ortho-01",
                label: "হাড় ও জোড়া বিশেষজ্ঞ",
                value: "orthopedics",
                icon: "🦴",
                count: 0,
              },
              {
                id: "gyn-01",
                label: "গাইনী এন্ড অবস বিশেষজ্ঞ",
                value: "gynecology",
                icon: "👩‍⚕️",
                count: 0,
              },
            ].map((tag) => (
              <button
                key={tag.label}
                type="button"
                className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-4 py-1.5 rounded-full hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm"
                onClick={() => handleTagClick(tag.label)}
              >
                {tag.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
