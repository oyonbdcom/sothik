"use client";

import CreateAppointment from "@/components/booking/booking-dialog";
import { RatingField } from "@/components/ui/rating";
import { IMembershipResponse } from "@/interface/clinic-membership";
import { enToBnNumber } from "@/lib/utils/utils";
import { Building, CheckCircle2, Clock, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const MembershipCard = ({
  membership,
}: {
  membership: IMembershipResponse | undefined;
}) => {
  if (!membership) return null;
  const clinicLink = `/diagnostic/${membership?.clinic?.slug || membership?.clinic?.userId}`;
  const clinicName = membership?.clinic?.user?.name || "ক্লিনিক";
  const isDiscount = membership?.discount;

  return (
    <div className="group flex flex-col h-full bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-blue-400 transition-all duration-300">
      {/* 1. Compact Header */}
      <div className="relative h-20 shrink-0 hero-gradient">
        <div className="absolute -bottom-6 left-3 z-10">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-white shadow-md bg-white">
            {membership?.clinic?.user?.image ? (
              <Image
                src={membership?.clinic?.user?.image}
                alt={clinicName}
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
          <Link href={clinicLink}>
            <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-blue-600 transition-colors line-clamp-1">
              {clinicName}
            </h3>
          </Link>

          <div className="flex items-center gap-1 mt-0.5 text-slate-500">
            <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
            <p className="text-[10px] font-medium line-clamp-1">
              {membership?.clinic?.address} ,{membership?.clinic?.area?.name},
              {membership?.clinic?.area?.district?.name}
            </p>
          </div>

          {/* Ratings - Compact */}
          <div className="flex items-center justify-between mt-2 py-1 border-y border-slate-50">
            <div className="flex items-center gap-1">
              <RatingField
                value={membership?.clinic?.averageRating || 0}
                readOnly
                size={12}
              />
              <span className="text-[10px] text-slate-700 font-bold">
                {membership?.clinic?.averageRating?.toFixed(1) || "0.0"}
              </span>
            </div>
            <span className="text-[9px] text-slate-400 font-medium">
              {(membership?.clinic?.reviewsCount || 0).toLocaleString("bn")}{" "}
              রিভিউ
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
          {membership?.doctor?.id && membership?.clinic?.id && (
            <div className="space-y-1.5">
              <CreateAppointment
                discount={membership?.discount}
                doctorId={membership?.doctor?.user?.id}
                membershipId={membership?.id}
                clinicId={membership?.clinic?.user?.id}
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

const VerifiedBadge = ({ size = "p-1", iconSize = "w-2.5 h-2.5" }) => (
  <div
    className={`flex items-center justify-center ${size} rounded-full bg-white shadow-sm border border-slate-100`}
  >
    <div className="bg-emerald-500 rounded-full p-0.5">
      <CheckCircle2 className={`${iconSize} text-white`} />
    </div>
  </div>
);

export default MembershipCard;
