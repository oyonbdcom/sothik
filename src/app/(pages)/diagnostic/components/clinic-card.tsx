/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Stars } from "@/app/components/featured-doctors";
import { avatar } from "@/config/site";
import { IClinicResponse } from "@/interface/clinic";
import { Building, CheckCircle2, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const ClinicCard = ({ clinic }: { clinic: IClinicResponse }) => {
  const clinicLink = `/diagnostic/${clinic?.slug || clinic?.userId}`;
  const clinicName = clinic?.user?.name || "ক্লিনিক";

  return (
    <div className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-xl transition-all duration-500">
      {/* 1. Visual Header */}
      <div className="relative h-36 hero-gradient bg-slate-50 shrink-0">
        {/* Brand Logo - Bigger & more prominent */}
        <div className="absolute bottom-4 left-5">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-[6px] border-white shadow-md bg-white flex items-center justify-center">
            {clinic?.user?.image ? (
              <Image
                src={clinic.user.image}
                alt={clinicName}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              /* Fallback UI: Styled background with centered icon */
              <div className="w-full h-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors duration-500">
                <Building className="w-8 h-8 text-slate-400 group-hover:text-blue-500 transition-colors" />
              </div>
            )}
          </div>
        </div>

        <div className="absolute top-3 right-3">
          <VerifiedBadge />
        </div>
      </div>

      {/* 2. Primary Information */}
      <div className="pt-10 p-5 flex flex-col flex-1">
        <div className="flex-1 space-y-1">
          <div>
            <Link href={clinicLink}>
              <h3 className="font-extrabold text-slate-900 text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">
                {clinicName}
              </h3>
            </Link>

            <div className="flex items-center gap-1.5 mt-1 text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <p className="text-xs font-medium line-clamp-1">
                {clinic?.city
                  ? `${clinic.city}, ${clinic.district}`
                  : "ঠিকানা পাওয়া যায়নি"}
              </p>
            </div>
          </div>

          {/* Social Proof (Ratings) */}
          <div className="flex items-center justify-between  ">
            <div className="flex items-center gap-1.5">
              <Stars rating={clinic.averageRating} />
              <span className="text-[11px] text-slate-700 font-bold">
                {clinic.averageRating?.toFixed(1) || "0.0"}
              </span>
            </div>

            <span className="text-[12px] text-slate-400">
              {(clinic.reviewsCount || 0).toLocaleString("bn")} রিভিউ
            </span>
          </div>

          {clinic?.memberships && clinic.memberships.length > 0 && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> বিশেষজ্ঞ ডাক্তারগণ
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {clinic.memberships.slice(0, 3).map((member: any) => {
                  const fullDocName = member.doctor?.user?.name || "ডাক্তার";
                  const shortDocName = fullDocName.split(" ")[0];

                  return (
                    <div
                      key={member.id}
                      className="flex items-center gap-1.5 pr-2 py-1 pl-1 bg-slate-50 border border-slate-100 rounded-full"
                    >
                      <div className="relative h-6 w-6 rounded-full overflow-hidden border border-white">
                        <Image
                          src={member.doctor?.user?.image || avatar}
                          alt={shortDocName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-[11px] font-bold text-slate-700">
                        ডা. {shortDocName}
                      </span>
                    </div>
                  );
                })}

                {/* Counter for remaining doctors */}
                {clinic.memberships.length > 3 && (
                  <div className="flex items-center px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black">
                    +{clinic.memberships.length - 3} MORE
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 4. Action Area */}
        <div className="mt-6">
          <Link
            href={clinicLink}
            className="block w-full text-center bg-blue-600 py-3 hover:bg-blue-700 text-white  font-semibold   rounded-lg transition-all active:scale-95"
          >
            সকল ডাক্তার
          </Link>
        </div>
      </div>
    </div>
  );
};

const VerifiedBadge = () => (
  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-sm border border-slate-100">
    <div className="bg-emerald-500 rounded-full p-0.5">
      <CheckCircle2 className="w-2.5 h-2.5 text-white" />
    </div>
    <span className="text-[10px] font-bold text-slate-800 tracking-tight">
      Verified
    </span>
  </div>
);
