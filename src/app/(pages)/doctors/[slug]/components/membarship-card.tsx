"use client";

import CreateAppointment from "@/components/booking/booking-dialog";
import { IMembershipResponse } from "@/interface/clinic-membership";
import { enToBnNumber } from "@/lib/utils/utils";
import { Clock, MapPin, Phone, Star } from "lucide-react";
import Image from "next/image";

const MembershipCard = ({
  membership,
}: {
  membership: IMembershipResponse | undefined;
}) => {
  if (!membership) return null;

  return (
    <div className="grid gap-6">
      {/* ১. 'article' ট্যাগ SEO-র জন্য সেরা কারণ এটি একটি স্বাধীন কন্টেন্ট নির্দেশ করে */}
      <article
        className="group relative overflow-hidden rounded-[2rem] border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
        itemScope
        itemType="https://schema.org/MedicalClinic" // ২. Schema.org ব্যবহার করে SEO বুস্ট করা
      >
        {/* Discount Badge */}
        {membership?.discount > 0 && (
          <aside className="absolute top-0 left-0 z-20 overflow-hidden rounded-br-2xl">
            <div className="flex items-center gap-1.5 bg-emerald-500 px-3 py-1.5 text-white shadow-lg">
              <span className="text-[14px] font-bold   uppercase">
                {enToBnNumber(membership.discount)}% অফার
              </span>
            </div>
          </aside>
        )}

        <div className="flex flex-col md:flex-row p-4 sm:p-5 gap-5">
          {/* Section: Visual - 'figure' ট্যাগ ইমেজের জন্য এসইও ফ্রেন্ডলি */}
          <figure className="md:w-[240px] relative shrink-0">
            <div className="relative aspect-square md:aspect-[4/5] h-56 sm:h-48 w-full overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100">
              <Image
                src={membership.clinic?.user?.image || "/de.jpg"}
                alt={`${membership.clinic?.user?.name} ক্লিনিকের ছবি`}
                fill
                itemProp="image"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />

              <figcaption className="absolute bottom-2 left-2 flex items-center gap-1 rounded-lg bg-white/90 px-2 py-1 shadow-md dark:bg-black/60">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span
                  className="text-[11px] font-bold"
                  itemProp="aggregateRating"
                >
                  {membership.clinic?.averageRating || "New"}
                </span>
              </figcaption>
            </div>
          </figure>

          {/* Section: Main Info */}
          <div className="flex flex-1 flex-col min-w-0">
            <header className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
              <div className="min-w-0">
                {/* ৪. H2 বা H3 ট্যাগ ব্যবহার করুন নামের জন্য */}
                <h2
                  className="text-xl font-black text-gray-900 dark:text-white truncate"
                  itemProp="name"
                >
                  {membership.clinic?.user?.name}
                </h2>

                <div className="mt-1.5 flex flex-col gap-1.5">
                  {/* ৫. 'address' ট্যাগ লোকাল এসইও-র জন্য গুরুত্বপূর্ণ */}
                  <address
                    className="flex items-center gap-2 text-xs text-slate-500 not-italic"
                    itemProp="address"
                  >
                    <MapPin className="h-3.5 w-3.5 text-red-500 shrink-0" />
                    <span>
                      {membership.clinic?.address}, {membership.clinic?.city}
                    </span>
                  </address>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Phone className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span className="font-semibold" itemProp="telephone">
                      01737-813575
                    </span>
                  </div>
                </div>
              </div>

              {/* Price Schema - গুগল সার্চে প্রাইস দেখাবে */}
              <div
                className="shrink-0 bg-blue-50 dark:bg-blue-900/10 px-4 py-2 rounded-xl border border-blue-100 text-center"
                itemProp="offers"
                itemScope
                itemType="https://schema.org/Offer"
              >
                <p className="text-[9px] font-black text-blue-400 uppercase">
                  সার্ভিস ফি
                </p>
                <p className="text-xl font-black text-blue-600 dark:text-blue-400">
                  <span itemProp="price" content={membership.fee?.toString()}>
                    {enToBnNumber(membership.fee)}
                  </span>
                  <span itemProp="priceCurrency" content="BDT">
                    ৳
                  </span>
                </p>
              </div>
            </header>

            {/* ৬. 'section' দিয়ে শিডিউল আলাদা করা হয়েছে */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
              {membership.schedules?.slice(0, 2).map((schedule) => (
                <div
                  key={schedule.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100"
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] font-bold text-slate-400">
                    <Clock className="h-3 w-3" />
                    <span>সময়: {schedule.times}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {schedule.days?.map((day: string) => (
                      <span
                        key={day}
                        className="text-[9px] font-bold text-blue-600 bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            {/* Footer containing CTA */}
            <footer className="mt-auto">
              {membership?.doctor?.id && membership?.clinic?.id && (
                <CreateAppointment
                  discount={membership?.discount}
                  doctorId={membership?.doctor?.user?.id}
                  clinicId={membership?.clinic?.user?.id}
                />
              )}
            </footer>
          </div>
        </div>
      </article>
    </div>
  );
};

export default MembershipCard;
