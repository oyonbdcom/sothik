"use client";
import { avatar } from "@/config/site";
import { IClinicResponse } from "@/interface/clinic";
import { IMembershipResponse } from "@/interface/clinic-membership";
import { Building, CheckCircle2, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

export const ClinicCard = ({ clinic }: { clinic: IClinicResponse }) => {
  const clinicLink = `/diagnostic/${clinic?.slug || clinic?.userId}`;
  const clinicName = clinic?.user?.name || "ক্লিনিক";
  const isAvailable = clinic?.memberships;

  return (
    <div className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-xl transition-all duration-500">
      {/* 1. Visual Header */}
      <div className="relative hero-gradient   h-44 p-4 flex items-end justify-between shrink-0">
        <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-white shadow-lg">
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
                {clinic.address}, {clinic.area?.name} ,
                {clinic?.area?.district?.name}
              </p>
            </div>
          </div>

          {clinic?.memberships && clinic.memberships.length > 0 && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> বিশেষজ্ঞ ডাক্তারগণ
                </span>
              </div>

              <div className="relative w-full">
                {/* ১. স্ক্রলেবল কন্টেইনার */}
                <ScrollArea className="w-full whitespace-nowrap rounded-md border-none">
                  <div className="flex w-max space-x-2 p-1">
                    {clinic.memberships?.map((member: IMembershipResponse) => {
                      const fullDocName =
                        member.doctor?.user?.name || "ডাক্তার";
                      const shortDocName = fullDocName.split(" ")[0];

                      return (
                        <div
                          key={member.id}
                          className="flex items-center w-28 gap-1.5 pr-3 py-1 pl-1 bg-slate-50 border border-slate-100 rounded-full shrink-0 shadow-sm"
                        >
                          <div className="relative h-7 w-7 rounded-full overflow-hidden border-2 border-white shrink-0 shadow-sm">
                            <Image
                              src={member.doctor?.user?.image || avatar}
                              alt={shortDocName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-col leading-4 ">
                            <span className="text-[11px] truncate font-black text-slate-700">
                              ডা. {shortDocName}
                            </span>
                            <span className="text-[11px] font-black truncate text-slate-700">
                              {member?.doctor?.department?.name}
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
        </div>
      </div>
    </div>
  );
};

const VerifiedBadge = () => (
  <div className="flex items-center gap-1.5  p-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-sm border border-slate-100">
    <div className="bg-emerald-500 rounded-full p-0.5">
      <CheckCircle2 className="w-2.5 h-2.5 text-white" />
    </div>
  </div>
);
