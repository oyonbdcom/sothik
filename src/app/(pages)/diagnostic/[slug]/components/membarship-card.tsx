"use client";

import CreateAppointment from "@/components/booking/booking-dialog";
import { Separator } from "@/components/ui/separator";
import { IMembershipResponse } from "@/interface/clinic-membership";
import {
  Activity,
  Award,
  Clock,
  MapPin,
  Star,
  Stethoscope,
  StickyNote,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const MembershipCard = ({
  membership,
}: {
  membership: IMembershipResponse | null;
}) => {
  const profileImage =
    membership?.clinic?.user?.image || membership?.doctor?.user?.image;
  const rating =
    membership?.clinic?.averageRating || membership?.doctor?.averageRating;

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      {/* ১. ডিসকাউন্ট ব্যাজ - গুগল অ্যাডস কনভার্সনে আকর্ষণ বাড়াবে */}
      {membership && membership?.discount && (
        <div className="absolute top-4 left-4 z-20">
          <span className="inline-flex items-center rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg animate-pulse">
            {membership.discount}% ছাড়
          </span>
        </div>
      )}

      <div className="flex flex-col md:flex-row">
        {/* ২. প্রোফাইল ইমেজ সেকশন */}
        <div className="relative md:w-72 shrink-0 p-4">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
            {profileImage ? (
              <Image
                src={profileImage}
                alt={`Dr. ${membership?.doctor?.user?.name}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <User className="h-16 w-16 text-slate-300" />
              </div>
            )}

            {/* রেটিং ওভারলে */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 backdrop-blur-md dark:bg-slate-900/80">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {rating || "নতুন"}
              </span>
            </div>
          </div>
        </div>

        {/* ৩. ডিটেইলস সেকশন */}
        <div className="flex flex-1 flex-col p-2 md:pl-2 gap-3">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <Link
                href={`/doctors/${membership?.doctor?.id}`}
                className="block text-xl font-extrabold tracking-tight text-slate-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
              >
                ডাঃ {membership?.doctor?.user?.name || "বিশেষজ্ঞ ডাক্তার"}
              </Link>

              <div className="flex flex-col gap-2">
                {membership?.doctor?.specialization && (
                  <div className="flex items-start gap-1.5 text-blue-600 dark:text-blue-400">
                    <div className="p-1.5 bg-blue-50 rounded-lg dark:bg-slate-800">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold">
                      {membership.doctor.specialization}
                    </span>
                  </div>
                )}
                {membership?.doctor?.degree && (
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <div className="p-1.5 bg-slate-50 rounded-lg dark:bg-slate-800">
                      <Activity className="w-4 h-4" />
                    </div>
                    <span className="text-sm">
                      {membership?.doctor?.degree}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ফি সেকশন - স্বচ্ছতা ট্রাস্ট বাড়ায় (Conversion Friendly) */}
            <div className="flex gap-3 flex-wrap sm:flex-nowrap">
              <div className="flex flex-col items-center px-3 py-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tighter">
                  ভিজিটি ফি
                </span>
                <span className="text-lg font-black text-emerald-700 dark:text-emerald-300">
                  {membership?.fee} ৳
                </span>
              </div>

              {/* <div className="flex flex-col items-center px-3 py-2 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/50">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tighter">
                  পুরাতন রোগী
                </span>
                <span className="text-lg font-black text-blue-700 dark:text-blue-300">
                  {Number(membership?.fee) - 100} ৳
                </span>
              </div> */}
            </div>
          </div>

          {/* প্রফেশনাল ক্রেডেনশিয়ালস */}
          <div className="flex flex-wrap gap-4">
            {membership?.doctor?.position && (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Award className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-medium">
                  {membership.doctor.position}
                </span>
              </div>
            )}
            {membership?.doctor?.hospital && (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <MapPin className="h-4 w-4 text-rose-500" />
                <span className="text-xs font-bold truncate max-w-[200px]">
                  {membership.doctor.hospital}
                </span>
              </div>
            )}
          </div>

          <Separator className="opacity-50" />

          {/* ৪. সিডিউল সেকশন - বাংলায় দিনগুলো রূপান্তর */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              চেম্বারের সময়
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {membership?.schedules?.map((schedule) => (
                <div
                  key={schedule.id}
                  className="group relative flex flex-col gap-2 rounded-2xl border border-blue-100 bg-blue-50/30 p-4 transition-all hover:border-blue-400 hover:bg-white dark:border-blue-900/20 dark:bg-blue-900/10 dark:hover:bg-slate-900"
                >
                  {/* বসার সময় সেকশন */}
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase tracking-tighter text-blue-500/80">
                        বসার সময়
                      </span>
                      <h4 className="text-sm font-black text-slate-800 dark:text-slate-100">
                        {schedule.times}
                      </h4>
                    </div>

                    {/* ঐচ্ছিক: ছোট ঘড়ি আইকন */}
                    <div className="rounded-lg bg-blue-100/50 p-1.5 dark:bg-blue-900/40">
                      <Clock className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                  </div>

                  {/* দিনগুলো (Badges) */}
                  <div className="flex flex-wrap gap-1.5">
                    {schedule.days?.map((day: string) => (
                      <span
                        key={day}
                        className="rounded-md bg-white px-2 py-0.5 text-[10px] font-bold text-slate-600 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700"
                      >
                        {day}
                      </span>
                    ))}
                  </div>

                  {/* নোট সেকশন (যদি থাকে) */}
                  {schedule.note && (
                    <div className="flex items-center gap-1.5 mt-1 pt-2 border-t border-blue-100/50 dark:border-blue-900/30">
                      <StickyNote className="h-3 w-3 text-amber-500 shrink-0" />
                      <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 truncate">
                        {schedule.note}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ৫. বুকিং বাটন (Call to Action) */}
          <div className="mt-auto pt-4">
            {membership?.doctor?.id && membership?.clinic?.id && (
              <CreateAppointment
                discount={membership?.discount}
                doctorId={membership?.doctor?.user?.id}
                clinicId={membership?.clinic?.user?.id}
              />
            )}
          </div>
        </div>
      </div>

      {/* ডিজাইন অ্যাকসেন্ট */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 opacity-60" />
    </article>
  );
};

export default MembershipCard;
