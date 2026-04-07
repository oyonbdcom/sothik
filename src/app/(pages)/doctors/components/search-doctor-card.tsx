"use client";

import { Stars } from "@/app/components/featured-doctors";
import { avatar, femaleAvatar } from "@/config/site";
import { IDoctorResponse } from "@/interface/doctor";
import { getDepartmentLabel } from "@/lib/utils/utils";
import Image from "next/image";
import Link from "next/link";

export default function DoctorGridCard({
  doctor,
}: {
  doctor: IDoctorResponse;
}) {
  const doctorName = doctor?.user?.name || "ডাক্তার";
  const profileLink = `/doctors/${doctor.slug}`;

  const imageSrc =
    doctor?.user?.image || (doctor.gender === "MALE" ? avatar : femaleAvatar);

  const isAvailable = doctor?.active;

  return (
    // ১. 'flex flex-col h-full' নিশ্চিত করে সব কার্ড সমান লম্বা হবে
    <div className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Top Section - Fixed height */}
      <div className="relative hero-gradient   h-36 p-4 flex items-end justify-between shrink-0">
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-lg">
          <Image
            src={imageSrc}
            alt={doctorName}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border ${
            isAvailable
              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
              : "bg-rose-50 text-rose-600 border-rose-100"
          }`}
        >
          <span className="relative flex h-2 w-2">
            {isAvailable && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isAvailable ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />
          </span>
          {isAvailable ? "বুকিং চলছে" : "সিরিয়াল পূর্ণ"}
        </div>
      </div>

      {/* Body - ২. 'flex-1' ব্যবহার করা হয়েছে যাতে বডি পুরো জায়গা নেয় */}
      <div className="p-4 flex flex-col flex-1 space-y-3">
        {/* কন্টেন্ট হোল্ডার - এটি ফাঁকা জায়গা পূরণ করবে */}
        <div className="flex-1 space-y-3">
          {/* Name + Position */}
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-sm truncate group-hover:text-blue-600 transition">
              {doctorName}
            </h3>

            {/* Position Badge - ৩. কন্ডিশনাল রেন্ডারিং সত্ত্বেও স্পেস ঠিক থাকবে */}
            {doctor?.position ? (
              <span className="inline-block text-[10px] font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                {doctor.position}
              </span>
            ) : (
              <div className="h-[18px]" /> // পজিশন না থাকলে হাইট ধরে রাখার জন্য
            )}

            <p className="text-blue-600 text-xs font-semibold">
              {getDepartmentLabel(doctor.department)}
            </p>
          </div>

          {/* Specialization - ৪. min-h দিয়ে হাইট ফিক্স করা হয়েছে */}
          <div className="min-h-[32px]">
            <p className="text-gray-600 text-[11px] leading-tight line-clamp-2">
              {doctor.specialization || "বিশেষজ্ঞ চিকিৎসক"}
            </p>
          </div>

          {/* Hospital */}
          <p className="text-xs font-medium text-slate-700 truncate flex items-center gap-1">
            🏥 <span>{doctor.hospital || "তথ্য পাওয়া যায়নি"}</span>
          </p>

          {/* Rating */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <Stars rating={doctor.averageRating} />
              <span className="text-[11px] text-slate-700 font-bold">
                {doctor.averageRating?.toFixed(1) || "0.0"}
              </span>
            </div>

            <span className="text-[12px] text-slate-400">
              {(doctor.reviewsCount || 0).toLocaleString("bn")} রিভিউ
            </span>
          </div>
        </div>

        {/* Button - ৫. বডি flex-1 হওয়ার কারণে এটি সবসময় নিচে থাকবে */}
        <Link
          href={profileLink}
          className="block w-full text-center bg-blue-600 py-3 hover:bg-blue-700 text-white  font-semibold   rounded-lg transition-all active:scale-95"
        >
          সব সিডিউলস দেখুন
        </Link>
      </div>
    </div>
  );
}
