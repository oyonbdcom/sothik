/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { avatar } from "@/config/site";
import { IClinicResponse } from "@/interface/clinic";
import { getDistrictLabel } from "@/lib/utils/utils";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  MapPin,
  Star,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const ClinicCard = ({ clinic }: { clinic: IClinicResponse }) => {
  const clinicLink = `/clinics/${clinic?.slug || clinic?.userId}`;
  const clinicName = clinic?.user?.name || "ক্লিনিক";

  return (
    <article className="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/50 dark:border-slate-800 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] overflow-hidden">
      {/* ব্যাকগ্রাউন্ড ডেকোরেশন (Subtle Glow) */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-500/5 blur-[80px] rounded-full group-hover:bg-blue-500/10 transition-colors" />

      <div className="flex flex-col lg:flex-row p-4 lg:p-6 gap-6 lg:gap-8">
        {/* বাম পাশ: ইমেজ সেকশন */}
        <header className="relative flex-shrink-0">
          <div className="relative w-full lg:w-48 aspect-square rounded-[2rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl bg-slate-50 dark:bg-slate-800">
            {clinic?.user?.isPhoneVerified && <VerifiedBadge />}
            {clinic?.user?.image ? (
              <Image
                src={clinic?.user.image}
                alt={clinicName}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
                <Building2 className="w-16 h-16 text-slate-300 dark:text-slate-700" />
              </div>
            )}
          </div>
        </header>

        {/* ডান পাশ: কন্টেন্ট সেকশন */}
        <div className="flex-1 flex flex-col justify-between py-2">
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
              <div className="space-y-2">
                <Link href={clinicLink}>
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-800 dark:text-white hover:text-blue-600 transition-colors tracking-tight leading-tight">
                    {clinicName}
                  </h2>
                </Link>
                <div className="flex items-center text-slate-500">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    {clinic?.city}, {getDistrictLabel(clinic.district)}
                  </span>
                </div>
              </div>

              {/* রেটিং ব্যাজ (Modern Pill Style) */}
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-black text-sm text-slate-900 dark:text-white">
                    {Number(clinic?.averageRating || 5).toFixed(1)}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase border-l pl-2 border-slate-200 dark:border-slate-700">
                  {clinic?.reviewsCount || 0} রিভিউ
                </span>
              </div>
            </div>

            {/* বিশেষজ্ঞ ডাক্তারগণ (Stack Style) */}
            {clinic?.memberships && clinic.memberships.length > 0 && (
              <div className="mb-6 bg-blue-50/30 dark:bg-blue-900/10 p-4 rounded-3xl border border-blue-100/50 dark:border-blue-900/20">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-3.5 h-3.5 text-blue-500" />
                  <h3 className="text-[10px] font-black text-blue-600/70 dark:text-blue-400 uppercase tracking-widest">
                    টপ স্পেশালিস্ট ডাক্তার
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {clinic.memberships.slice(0, 3).map((member: any) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-2 p-1 pr-3 bg-white dark:bg-slate-900 rounded-full shadow-sm hover:translate-y-[-2px] transition-transform"
                    >
                      <div className="relative h-6 w-6 rounded-full overflow-hidden border border-slate-100">
                        <Image
                          src={member.doctor?.user?.image || avatar}
                          alt="Doc"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
                        ডা. {member.doctor?.user?.name?.split(" ")[0]}
                      </span>
                    </div>
                  ))}
                  {clinic.memberships.length > 3 && (
                    <div className="h-8 px-3 flex items-center rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500 uppercase">
                      +{clinic.memberships.length - 3} আরো
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ফুটার */}
          <footer className="mt-auto flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-[13px] font-bold text-slate-500">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[11px] font-black uppercase tracking-tight">
                    Open
                  </span>
                </div>
                <span className="font-black text-slate-700 dark:text-white">
                  {clinic?.openingHour || "সকাল ৯ - রাত ৮"}
                </span>
              </div>
            </div>

            <Button
              asChild
              className="group/btn h-12 w-full sm:w-auto px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
            >
              <Link href={clinicLink}>
                বিস্তারিত দেখুন
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </Button>
          </footer>
        </div>
      </div>
    </article>
  );
};

const VerifiedBadge = () => (
  <div className="absolute top-3 left-3 z-10">
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white shadow-xl">
      <CheckCircle2 className="w-3.5 h-3.5" />
      <span className="text-[9px] font-black uppercase tracking-wider">
        Verified
      </span>
    </div>
  </div>
);
