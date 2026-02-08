"use client";

import { Form } from "@/components/ui/form"; // shadcn/ui বা hook-form ব্যবহার করলে
import { doctorDepartments } from "@/constant/common";
import { bangladeshDistricts } from "@/constant/dristrict";
import { Icon } from "@iconify/react";
import { MapPin, Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import CustomFormField, { FormFieldType } from "../custom-form-field";

export function HomeBanner() {
  // যদি আপনি React Hook Form ব্যবহার করেন তবে এটি সহজ হবে
  const form = useForm({
    defaultValues: {
      department: "",
      district: "",
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (values: { department: string; district: string }) => {
    // ১. বর্তমান প্যারামিটারগুলো নেওয়া
    const params = new URLSearchParams(searchParams.toString());

    // ২. যদি ভ্যালু থাকে তবে সেট করা, না থাকলে ডিলিট করা
    if (values.department) {
      params.set("department", values.department);
    } else {
      params.delete("department");
    }

    if (values.district) {
      params.set("district", values.district);
    } else {
      params.delete("district");
    }

    router.push(`/doctors?${params.toString()}`);
  };

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background & Overlays */}
      <div className="absolute inset-0 bg-cover bg-center animate-hero-bg" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 background/80 to-secondary/40" />

      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <div className="max-w-4xl text-center">
          <h1 className="opacity-0 animate-hero-text text-3xl md:text-4xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-primary via-emerald-500 to-blue-600 bg-clip-text text-transparent leading-tight pb-2 py-10">
            সঠিক ডাক্তার খুঁজে নিন <br className="hidden md:block " />
            আপনার সুস্বাস্থ্যের জন্য
          </h1>

          <p className="opacity-0 animate-hero-text animate-delay-200 text-base md:text-xl text-default-700 dark:text-default-300 mb-10 max-w-2xl mx-auto">
            আপনার নিকটস্থ অভিজ্ঞ ও ভেরিফাইড চিকিৎসকদের সাথে অ্যাপয়েন্টমেন্ট বুক
            করুন খুব সহজে।
          </p>

          {/* Search Section using CustomFormField */}
          <div className="opacity-0 animate-hero-text animate-delay-400 w-full max-w-3xl mx-auto">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSearch)}
                className="flex flex-col md:flex-row items-center gap-2 p-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20"
              >
                {/* Location Select */}
                <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-default-200">
                  <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="district"
                    placeholder="এলাকা নির্বাচন"
                    icon={MapPin}
                    options={bangladeshDistricts}
                  />
                </div>

                {/* Doctor Search Input */}
                <div className="w-full md:w-2/3">
                  <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="department"
                    placeholder="ডাক্তার বা বিশেষজ্ঞ খুঁজুন..."
                    icon={Search}
                    options={doctorDepartments}
                  />
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-3 bg-primary hover:bg-primary-600 text-white font-bold rounded-xl transition-all active:scale-95 shadow-lg shadow-primary/30"
                >
                  খুঁজুন
                </button>
              </form>
            </Form>
          </div>

          {/* Trust badges */}
          <div className="opacity-0 animate-hero-text animate-delay-600 mt-12 flex flex-wrap justify-center gap-6 text-sm font-semibold text-default-800">
            <Badge
              icon="heroicons:check-badge"
              color="text-emerald-500"
              label="ভেরিফাইড ডাক্তার"
            />
            <Badge
              icon="heroicons:clock"
              color="text-blue-500"
              label="দ্রুত অ্যাপয়েন্টমেন্ট"
            />
            <Badge
              icon="heroicons:shield-check"
              color="text-orange-500"
              label="সুরক্ষিত বুকিং"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ছোট হেল্পার কম্পোনেন্ট ফর ট্রাস্ট ব্যাজ
function Badge({
  icon,
  color,
  label,
}: {
  icon: string;
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm">
      <Icon icon={icon} className={`h-5 w-5 ${color}`} />
      {label}
    </div>
  );
}
