/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetDepartmentsQuery } from "@/redux/api/setup";
import { ChevronRight, Stethoscope } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Specialties = () => {
  // ১. Redux Query দিয়ে ডেটা ফেচিং
  const { data, isLoading, isError } = useGetDepartmentsQuery(undefined);
  const departments = data?.departments || [];

  // লোডিং অবস্থায় স্কেলিটন দেখানো
  if (isLoading) {
    return (
      <section className="container py-16 px-6">
        <SpecialtySkeleton />
      </section>
    );
  }

  // এরর বা ডেটা না থাকলে সেকশনটি দেখানোর প্রয়োজন নেই
  if (isError || departments.length === 0) return null;

  return (
    <section className="container py-16 px-6">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            বিশেষজ্ঞতা <span className="text-blue-600">অনুযায়ী</span> খুঁজুন
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            আপনার সমস্যা অনুযায়ী সঠিক বিশেষজ্ঞ বেছে নিন
          </p>
        </div>
        <Link
          href="/doctors"
          className="group flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 transition-all"
        >
          সব দেখুন
          <ChevronRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        {departments.slice(0, 16).map((dept: any) => (
          <Link
            href={`/doctors?department=${dept.slug}`}
            key={dept.id}
            className="group bg-white border border-slate-100 rounded-[24px] p-4 text-center shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-200 hover:-translate-y-1 transition-all duration-300"
          >
            <div className="w-16 h-16 mx-auto mb-3 bg-blue-50 rounded-2xl flex items-center justify-center overflow-hidden group-hover:bg-blue-600 transition-all duration-300">
              {dept?.image ? (
                <div className="relative w-full h-full p-2 group-hover:scale-110 transition-transform duration-300">
                  <Image
                    src={dept.image}
                    alt={dept.name}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <Stethoscope
                  className="text-blue-600 group-hover:text-white"
                  size={24}
                />
              )}
            </div>

            <p className="text-xs font-black text-slate-700 group-hover:text-blue-600 transition-colors line-clamp-1">
              {dept.name}
            </p>

            <p className="text-[10px] font-bold text-slate-400 mt-1 bg-slate-50 rounded-full py-0.5 group-hover:bg-blue-100 group-hover:text-blue-500 transition-colors">
              {dept.doctorsCount || 0} জন ডাক্তার
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Specialties;
// components/specialty-skeleton.tsx
const SpecialtySkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="flex justify-between items-end">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-slate-200 rounded-lg" />
        <div className="h-4 w-64 bg-slate-100 rounded-lg" />
      </div>
      <div className="h-6 w-20 bg-slate-100 rounded-full" />
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="bg-white border border-slate-100 rounded-[24px] p-5"
        >
          <div className="w-12 h-12 bg-slate-100 rounded-2xl mx-auto mb-3" />
          <div className="h-3 bg-slate-100 w-3/4 mx-auto rounded mb-2" />
          <div className="h-2 bg-slate-50 w-1/2 mx-auto rounded" />
        </div>
      ))}
    </div>
  </div>
);
