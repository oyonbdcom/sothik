"use client";

import { Stars } from "@/app/components/featured-doctors";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { avatar, femaleAvatar } from "@/config/site";
import { IMembershipResponse } from "@/interface/clinic-membership";
import { IDoctorResponse } from "@/interface/doctor";
import { Building, CheckCircle2 } from "lucide-react";
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

  const isAvailable = doctor?.memberships;

  return (
    // ১. 'flex flex-col h-full' নিশ্চিত করে সব কার্ড সমান লম্বা হবে
    <div className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Top Section - Fixed height */}
      <div className="relative hero-gradient   h-44 p-4 flex items-end justify-between shrink-0">
        <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-white shadow-lg">
          <Image
            src={imageSrc}
            alt={`${doctor.user.name} - ${doctor.specialization} specialist in dinajpur`}
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
        <div className="absolute bottom-3  left-[104px]">
          <VerifiedBadge />
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
            <div className="md:min-h-[32px]">
              <p className="text-blue-600 text-sm font-medium leading-tight line-clamp-2">
                {doctor.specialization || "বিশেষজ্ঞ চিকিৎসক"}
              </p>
            </div>
            {doctor?.position ? (
              <span className="inline-block text-[10px] font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                {doctor.position}
              </span>
            ) : (
              <div className="md:h-[18px]" />
            )}
          </div>

          {/* Specialization - ৪. min-h দিয়ে হাইট ফিক্স করা হয়েছে */}

          {/* Hospital */}
          <p className="text-xs font-bold text-slate-700 truncate flex items-center gap-1">
            <span>{doctor.hospital || "তথ্য পাওয়া যায়নি"}</span>
          </p>

          {/* Rating */}
          <div className="flex items-center justify-between ">
            <div className="flex items-center gap-1.5">
              <Stars rating={doctor.averageRating} />
              <span className="text-xs text-slate-700 font-bold">
                {doctor.averageRating?.toFixed(1) || "0.0"}
              </span>
            </div>

            <span className="text-[12px] font-semibold text-slate-400">
              {(doctor.reviewsCount || 0).toLocaleString("bn")} রিভিউ
            </span>
          </div>
        </div>

        {doctor?.memberships && doctor.memberships.length > 0 && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5" /> চেমার সমুহ
              </span>
            </div>

            <div className="relative w-full">
              {/* ১. স্ক্রলেবল কন্টেইনার */}
              <ScrollArea className="w-full whitespace-nowrap rounded-md border-none">
                <div className="flex w-max space-x-2 p-1">
                  {doctor.memberships?.map((member: IMembershipResponse) => {
                    const fullClinicName = member.clinic?.user?.name || "";
                    const shortClinicName = fullClinicName.split(" ")[0];

                    return (
                      <div
                        key={member.id}
                        className="flex items-center w-40 gap-1.5 pr-3 py-1 pl-1 bg-slate-50 border border-slate-100 rounded-full shrink-0 shadow-sm"
                      >
                        <div className="relative h-7 w-7 rounded-full overflow-hidden border-2 border-white shrink-0 shadow-sm">
                          <Image
                            src={member.clinic?.user?.image || avatar}
                            alt={shortClinicName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-col leading-4 ">
                          <span className="text-[11px] truncate font-black text-slate-700">
                            {shortClinicName}
                          </span>
                          <span className="text-[11px] font-black truncate text-slate-700">
                            {member?.clinic?.area?.name},{" "}
                            {member?.clinic?.area?.district?.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Shadcn Horizontal ScrollBar */}
                <ScrollBar orientation="horizontal" className="h-2 mt-1" />
              </ScrollArea>
            </div>
          </div>
        )}

        <Link
          href={profileLink}
          className="block w-full text-center bg-blue-600 py-3 hover:bg-blue-700 text-white  font-semibold   rounded-lg transition-all active:scale-95"
        >
          সব চেম্বার দেখুন
        </Link>
      </div>
    </div>
  );
}

const VerifiedBadge = () => (
  <div className="flex items-center gap-1.5  p-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-sm border border-slate-100">
    <div className="bg-emerald-500 rounded-full p-0.5">
      <CheckCircle2 className="w-2.5 h-2.5 text-white" />
    </div>
  </div>
);
