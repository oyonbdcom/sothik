"use client";
import { avatar } from "@/config/site";
import { IDiagnosticResponse } from "@/interface/diagnostic";
import { IMembershipResponse } from "@/interface/diagnostic-membership";
import { Building, Building2, ChevronRight, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { VerifiedBadge } from "../verify-badge";

export const DiagnosticCard = ({
  diagnostic,
}: {
  diagnostic: IDiagnosticResponse;
}) => {
  const diagnosticLink = `/diagnostics/${diagnostic?.slug || diagnostic?.userId}`;
  const diagnosticName = diagnostic?.user?.name || "ক্লিনিক";

  return (
    <div className="group flex flex-col h-full bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-500 shadow-sm hover:shadow-2xl transition-all duration-500">
      {/* 1. Visual Header with Improved Branding */}
      <div className="relative h-36 p-5 flex items-end justify-between shrink-0 bg-slate-50 dark:bg-slate-800/50">
        {/* Background Pattern/Gradient */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-400 via-transparent to-transparent"></div>

        <div className="relative z-10 w-20 h-20 rounded-2xl overflow-hidden border-4 border-white dark:border-slate-900 shadow-xl">
          {diagnostic?.user?.image ? (
            <Image
              src={diagnostic.user.image}
              alt={diagnosticName}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-white flex items-center justify-center">
              <Building2 className="w-10 h-10 text-blue-500/40" />
            </div>
          )}
        </div>

        {/* Availability Badge - Now more pill-shaped */}
      </div>

      {/* 2. Primary Information */}
      <div className="px-5 pb-6 pt-4 flex flex-col flex-1 relative">
        {/* Verified Badge Positioned Better */}
        <div className="absolute -top-6 left-28 translate-y-[-50%]">
          <VerifiedBadge />
        </div>

        <div className="flex-1 space-y-3">
          {/* Name & Rating Section */}
          <div className="space-y-1">
            <Link href={diagnosticLink}>
              <h3 className="font-black text-slate-800 dark:text-white text-xl leading-snug group-hover:text-blue-600 transition-colors line-clamp-1">
                {diagnosticName}
              </h3>
            </Link>

            {/* ⭐ Rating & Reviews Added Here */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={
                      i < 4 ? "fill-amber-400 text-amber-400" : "text-slate-300"
                    }
                  />
                ))}
              </div>
              <span className="text-[11px] font-bold text-slate-500">
                4.8{" "}
                <span className="font-medium text-slate-400">(১২০+ রিভিউ)</span>
              </span>
            </div>

            {/* Location */}
            <div className="flex items-start gap-1 text-slate-500 mt-2">
              <MapPin size={14} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[12px] leading-tight font-medium line-clamp-2">
                {diagnostic.address}, {diagnostic.area?.name},{" "}
                {diagnostic?.area?.district?.name}
              </p>
            </div>
          </div>

          {/* Specialist Doctors Section */}
          {diagnostic?.memberships && diagnostic.memberships.length > 0 && (
            <div className="space-y-2 ">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" /> চেমার সমুহ
                </span>
              </div>

              <div className="relative w-full">
                {/* ১. স্ক্রলেবল কন্টেইনার */}
                <ScrollArea className="w-full whitespace-nowrap rounded-md border-none">
                  <div className="flex w-max space-x-2 p-1">
                    {diagnostic?.memberships?.map(
                      (member: IMembershipResponse) => {
                        const fullDoctorName = member.doctor?.user?.name || "";

                        return (
                          <Link
                            href={`/doctors/${member?.doctor?.slug}`}
                            key={member?.id}
                            className="flex items-center w-34 gap-1.5 pr-3 py-1 pl-1 bg-slate-50 border border-slate-100 rounded-full shrink-0 shadow-sm"
                          >
                            <div className="relative h-7 w-7 rounded-full overflow-hidden border-2 border-white shrink-0 shadow-sm">
                              <Image
                                src={member?.doctor?.user?.image || avatar}
                                alt={fullDoctorName}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex flex-col leading-4 max-w-24 ">
                              <span className="text-[11px] truncate font-black text-slate-700">
                                {fullDoctorName}
                              </span>
                              <span className="text-[9px]  font-black truncate text-slate-700">
                                {member?.doctor?.department?.name}
                              </span>
                            </div>
                          </Link>
                        );
                      },
                    )}
                  </div>

                  {/* Shadcn Horizontal ScrollBar */}
                  <ScrollBar orientation="horizontal" className="h-2 mt-1" />
                </ScrollArea>
              </div>
            </div>
          )}
        </div>

        {/* কল টু অ্যাকশন বাটন */}
        <div className="mt-4 pt-2">
          <Link
            href={diagnosticLink}
            className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[13px] font-black transition-all shadow-lg shadow-blue-100 dark:shadow-none active:scale-[0.98] group"
          >
            বিস্তারিত ও ডাক্তার তালিকা দেখুন
            <ChevronRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};
