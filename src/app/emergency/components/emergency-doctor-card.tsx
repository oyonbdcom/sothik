"use client";

import { Stars } from "@/app/components/featured-doctors";
import { avatar, femaleAvatar } from "@/config/site";
import { IDoctorResponse } from "@/interface/doctor";
import { Building, CheckCircle2, Video } from "lucide-react";
import Image from "next/image";
import EmergencyAppointmentBooking from "./emergency-booking-dialog";

interface EmergencyDoctorCardProps {
  doctor: IDoctorResponse;
  isOnline?: boolean; // ভবিষ্যতে ভিডিও কলের জন্য অনলাইন স্ট্যাটাস
}

export default function EmergencyDoctorCard({
  doctor,
  isOnline = true, // ডিফল্টভাবে অনলাইন রাখা হয়েছে ফিউচার ইউজের জন্য
}: EmergencyDoctorCardProps) {
  const doctorName = doctor?.user?.name || "ডাক্তার";
  const profileLink = `/doctors/${doctor.slug}`;

  const imageSrc =
    doctor?.user?.image || (doctor.gender === "MALE" ? avatar : femaleAvatar);

  return (
    <div className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border-2 border-red-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative">
      {/* Emergency Badge - Floating on Top */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 items-end">
        <span className="flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg shadow-lg animate-pulse uppercase tracking-tighter">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
          Emergency Service
        </span>
      </div>

      {/* Top Section - Profile Image & Status */}
      <div className="relative bg-gradient-to-br from-red-50 to-orange-50 h-44 p-4 flex items-end justify-between shrink-0">
        <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
          <Image
            src={imageSrc}
            alt={`${doctorName} - Emergency specialist in Dinajpur`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Online Indicator for Video Call */}
          {isOnline && (
            <div className="absolute top-1 right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white shadow-sm"></span>
            </div>
          )}
        </div>

        {doctor?.position && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border bg-white text-slate-700 border-slate-100">
            {doctor.position}
          </div>
        )}

        <div className="absolute bottom-3 left-[104px]">
          <VerifiedBadge />
        </div>
      </div>

      {/* Body Section */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1 space-y-3">
          {/* Name & Specialization */}
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-base truncate group-hover:text-red-600 transition">
              {doctorName}
            </h3>
            <p className="text-red-600 text-sm font-bold leading-tight line-clamp-1">
              {doctor.specialization || "Emergency Specialist"}
            </p>
          </div>

          {/* Hospital/Current Focus */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 p-2 rounded-lg">
            <Building className="w-3.5 h-3.5" />
            <span className="truncate">
              {doctor.hospital || "SusthiO Emergency Care"}
            </span>
          </div>

          {/* Online Consultation Status (Future Ready) */}
          <div className="flex items-center gap-2 text-[11px] font-bold text-emerald-700">
            <Video className="w-3.5 h-3.5" />
            <span>ভিডিও কলে পরামর্শের জন্য প্রস্তুত</span>
          </div>

          {/* Rating Section */}
          <div className="flex items-center justify-between pt-1">
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

        {/* Chambers List (Scrollable) */}

        {/* Action Button - Future integration for Video Call/Emergency */}
        <EmergencyAppointmentBooking
          fee={doctor?.memberships?.[0]?.fee || 0}
          doctorId={doctor?.id}
          disabled={false}
        />
      </div>
    </div>
  );
}

const VerifiedBadge = () => (
  <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-sm border border-slate-100">
    <div className="bg-emerald-500 rounded-full p-0.5">
      <CheckCircle2 className="w-2.5 h-2.5 text-white" />
    </div>
    <span className="text-[9px] font-black text-slate-700 pr-1 uppercase">
      SusthiO Verified
    </span>
  </div>
);
