"use client";

import { avatar, femaleAvatar } from "@/config/site";
import { IDoctorResponse } from "@/interface/doctor";
import {
  Award,
  BadgeCheck,
  Building2,
  ChevronRight,
  Globe,
  GraduationCap,
  MapPin,
  Star,
  Stethoscope,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SearchDoctorCard({
  doctor,
  profileButton = true,
}: {
  doctor: IDoctorResponse;
  profileButton?: boolean;
}) {
  const doctorName = `ডাঃ ${doctor?.user?.name}`;
  const specialization = doctor?.specialization || "বিশেষজ্ঞ চিকিৎসক";
  const profileLink = `/doctors/${doctor?.slug || doctor?.user?.id}`;

  // SEO Schema Logic (গুগলকে ডাটা বোঝানোর জন্য)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Physician",
    name: doctorName,
    image: doctor?.user?.image || "",
    medicalSpecialty: specialization,
    address: {
      "@type": "PostalAddress",
      addressLocality: doctor?.hospital || "Bangladesh",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: doctor?.averageRating || "5",
      reviewCount: doctor?.reviewsCount || "1",
    },
  };

  return (
    <article
      className="group bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] transition-all duration-300 hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] hover:border-blue-200 dark:hover:border-blue-900/50"
      aria-labelledby={`dr-name-${doctor.id}`}
    >
      {/* Schema.org Script for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row gap-5 lg:gap-8">
          {/* Section 1: Visual Identity */}
          <header className="relative shrink-0 flex justify-center sm:block">
            <Link
              href={profileLink}
              className="relative block  w-48 h-48 rounded-2xl overflow-hidden shadow-md"
              title={`${doctorName} এর প্রোফাইল দেখুন`}
            >
              <Image
                src={
                  doctor?.user?.image ||
                  (doctor.gender === "MALE" ? avatar : femaleAvatar)
                }
                alt={`${doctorName} - ${specialization}`} // SEO Optimized Alt
                fill
                sizes="(max-width: 768px) 128px, 160px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-2 right-2 bg-emerald-500 p-1 rounded-full shadow-lg border-2 border-white dark:border-slate-900">
                <BadgeCheck
                  className="w-3.5 h-3.5 text-white"
                  aria-label="Verified Doctor"
                />
              </div>
            </Link>
          </header>

          {/* Section 2: Core Information (The Content AdSense Crawls) */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col md:flex-row justify-between items-start gap-2 mb-3">
              <div className="min-w-0">
                <Link href={profileLink}>
                  <h2
                    id={`dr-name-${doctor.id}`}
                    className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white truncate hover:text-blue-600 transition-colors"
                  >
                    {doctorName}
                  </h2>
                </Link>
                <div className="flex items-center gap-2 mt-1 text-blue-600 dark:text-blue-400 font-bold text-sm">
                  <Stethoscope className="w-4 h-4" />
                  <span>{specialization}</span>
                </div>
              </div>

              {/* Rating (SEO-Friendly Rich Result) */}
              <div className=" hidden md:flex  items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-full border border-amber-100 dark:border-amber-900/30">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {Number(doctor?.averageRating || 0).toFixed(1)}
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-500 font-medium whitespace-nowrap">
                  ({doctor?.reviewsCount || 0} রিভিউ)
                </span>
              </div>
            </div>

            {/* Section 3: Professional Details Section */}
            <section
              className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-4"
              aria-label="Professional Details"
            >
              <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                <GraduationCap className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                <p className="text-xs sm:text-sm line-clamp-1">
                  {doctor?.degree || "এমবিবিএস"}
                </p>
              </div>
              <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                <Award className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                <p className="text-xs sm:text-sm line-clamp-1">
                  {doctor?.position || "বিশেষজ্ঞ চিকিৎসক"}
                </p>
              </div>
              <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400 md:col-span-2">
                <Building2 className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                <p className="text-xs sm:text-sm line-clamp-1 font-medium italic">
                  {doctor?.hospital || "জেনারেল হাসপাতাল"}
                </p>
              </div>
            </section>
            <div className="flex w-fit md:hidden  items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-full border border-amber-100 dark:border-amber-900/30">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {Number(doctor?.averageRating || 0).toFixed(1)}
              </span>
              <span className="text-[10px] text-amber-600 dark:text-amber-500 font-medium whitespace-nowrap">
                ({doctor?.reviewsCount || 0} রিভিউ)
              </span>
            </div>
            {/* Section 4: Chamber/Clinic Availability */}
            <div className="mt-4 mb-5">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                চেম্বারসমূহ
                <span className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
              </h3>

              {doctor?.memberships && doctor.memberships.length > 0 ? (
                <nav
                  className="flex flex-wrap gap-2"
                  aria-label="চেম্বারের তালিকা"
                  itemProp="workLocation" // SEO Schema for medical locations
                >
                  {doctor.memberships.slice(0, 2).map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/50 dark:bg-blue-900/10 text-[11px] font-bold text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 rounded-full transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/20"
                    >
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate max-w-[120px] sm:max-w-none">
                        {m?.clinic?.user?.name}
                      </span>
                    </div>
                  ))}

                  {doctor.memberships.length > 2 && (
                    <div className="flex items-center text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                      + আরো {doctor.memberships.length - 2} টি
                    </div>
                  )}
                </nav>
              ) : (
                <p className="text-[11px] text-slate-400 italic">
                  কোনো চেম্বার তথ্য পাওয়া যায়নি
                </p>
              )}
            </div>

            {/* Section 5: Interaction Footer */}
            <footer className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-50 dark:border-slate-900">
              <Link
                href={doctor?.website || "#"}
                target="_blank"
                rel="noopener noreferrer" // Security & SEO best practice
                className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
              >
                <Globe className="w-4 h-4" />
                ওয়েবসাইট
              </Link>

              {profileButton && (
                <Link
                  href={profileLink}
                  className="flex-1 inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                >
                  অ্যাপয়েন্টমেন্ট নিন
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </footer>
          </div>
        </div>
      </div>
    </article>
  );
}
