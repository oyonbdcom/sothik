"use client";

import CreateAppointment from "@/components/booking/booking-dialog";
import { VerifiedBadge } from "@/components/verify-badge";
import { IMembershipResponse } from "@/interface/diagnostic-membership";
import { enToBnNumber } from "@/lib/utils/utils";
import { Building, Clock, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const MembershipCard = ({
  membership,
}: {
  membership: IMembershipResponse | undefined;
}) => {
  if (!membership) return null;
  const diagnosticLink = `/diagnostics/${membership?.diagnostic?.slug || membership?.diagnostic?.userId}`;
  const diagnosticName = membership?.diagnostic?.user?.name || "ক্লিনিক";
  const isDiscount = membership?.discount;

  return (
    <div className="group flex flex-col h-full bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-blue-400 transition-all duration-300">
      {/* 1. Compact Header */}
      <div className="relative h-20 shrink-0 hero-gradient">
        <div className="absolute -bottom-6 left-3 z-10">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-white shadow-md bg-white">
            {membership?.diagnostic?.user?.image ? (
              <Image
                src={membership?.diagnostic?.user?.image}
                alt={diagnosticName}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-50">
                <Building className="w-6 h-6 text-slate-400" />
              </div>
            )}
            <div className="absolute top-1 right-1">
              <VerifiedBadge size="w-4 h-4" iconSize="w-2 h-2" />
            </div>
          </div>
        </div>

        {/* Badges Container - Top Right */}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1.5">
          {membership.fee && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur text-emerald-700 border border-emerald-100 shadow-sm">
              <span className="text-xs font-black uppercase tracking-tighter">
                ফি {enToBnNumber(membership?.fee)} টাকা
              </span>
            </div>
          )}
          {isDiscount > 1 && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500 text-white shadow-sm animate-pulse">
              <span className="text-[9px] font-black uppercase tracking-tighter">
                {isDiscount}% ছাড়
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Content Area - Reduced Padding */}
      <div className="pt-8 p-3 flex flex-col flex-1 gap-2">
        <div className="flex-1">
          <Link href={diagnosticLink}>
            <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-blue-600 transition-colors line-clamp-1">
              {diagnosticName}
            </h3>
          </Link>

          <div className="flex items-center gap-1 mt-0.5 text-slate-500">
            <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
            <p className="text-[10px] font-medium line-clamp-1">
              {membership?.diagnostic?.address} ,
              {membership?.diagnostic?.area?.name}
            </p>
          </div>

          {/* Ratings - Compact */}
          <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
            <Star size={14} fill="currentColor" />{" "}
            {Number(membership?.diagnostic?.averageRating || 0).toFixed(1)}
            <span className="text-slate-400">
              ({membership?.diagnostic?.reviewsCount || 0} রিভিউ)
            </span>
          </div>

          {/* Schedules - Horizontal scroll on mobile or compact list */}
          <div className="flex  flex-col gap-1.5 mt-2">
            {membership.schedules?.slice(0, 2).map((schedule) => (
              <div
                key={schedule.id}
                className="flex items-center gap-1 text-[9px] font-bold text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100"
              >
                <Clock size={8} className="text-indigo-400" />
                {schedule.time}
              </div>
            ))}
          </div>
        </div>

        {/* 3. Action Button - Tighter spacing */}
        <footer className="mt-2">
          {membership?.doctor?.id && membership?.diagnostic?.id && (
            <div className="space-y-1.5">
              <CreateAppointment
                discount={membership?.discount}
                doctorId={membership?.doctor?.id}
                membershipId={membership?.id}
                diagId={membership?.diagnostic?.id}
                disabled={
                  !membership?.schedules || membership.schedules.length === 0
                }
              />

              {(!membership?.schedules ||
                membership.schedules.length === 0) && (
                <div className="text-[9px] text-center font-bold text-rose-500 bg-rose-50 py-1 rounded">
                  শিডিউল নেই
                </div>
              )}
            </div>
          )}
        </footer>
      </div>
    </div>
  );
};

export default MembershipCard;
