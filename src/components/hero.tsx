"use client";
import Link from "next/link";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumbs";

interface BreadcrumbStep {
  label: string;
  href?: string;
}

interface HeroProps {
  title: string;
  isEmergency?: boolean;
  description?: string;
  breadcrumbs: BreadcrumbStep[];
}

export const Hero = ({
  title,
  description,
  breadcrumbs,
  isEmergency = false,
}: HeroProps) => {
  // --- SEO: BreadcrumbList Schema Generation ---
  // এটি গুগল সার্চ রেজাল্টে আপনার পেজের পাথ (Path) সুন্দরভাবে দেখাতে সাহায্য করবে
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "হোম",
        item: "https://Sasthik.com", // আপনার ডোমেইন নাম দিন
      },
      ...breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: crumb.label,
        item: crumb.href ? `https://Sasthik.com${crumb.href}` : undefined,
      })),
    ],
  };

  return (
    <section className="bg-white border-b hero-gradient dot-pattern border-slate-100 py-10 lg:py-14 relative overflow-hidden">
      {/* JSON-LD Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <nav aria-label="Breadcrumb" className="mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    href="/"
                    className="flex items-center gap-1 font-medium hover:text-blue-600 transition-colors"
                  >
                    হোম
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {index === breadcrumbs.length - 1 ? (
                      <BreadcrumbPage className="text-blue-700 font-bold">
                        {crumb.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link
                          href={crumb.href || "#"}
                          className="font-medium hover:text-blue-600 transition-colors"
                        >
                          {crumb.label}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </nav>

        <div className="space-y-4 max-w-3xl">
          <div className="space-y-2">
            {/* ডায়নামিক টাইটেল */}
            <h1 className="text-2xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-[1.1]">
              {isEmergency
                ? "তাৎক্ষণিক জরুরি অ্যাপয়েন্টমেন্ট বুকিং"
                : "সেরা বিশেষজ্ঞ ডাক্তার ও সিরিয়াল ট্র্যাকিং"}
            </h1>

            {/* ডায়নামিক স্ট্যাটাস */}
            <div
              className={`flex items-center gap-2 font-bold text-sm lg:text-base ${
                isEmergency ? "text-rose-600 animate-pulse" : "text-emerald-600"
              }`}
            >
              <div
                className={`h-2 w-2 rounded-full ${isEmergency ? "bg-rose-600" : "bg-emerald-500"}`}
              />
              {isEmergency
                ? "সরাসরি বুকিং—অপেক্ষা ছাড়াই জরুরি সেবা নিশ্চিত করুন"
                : "লাইভ সিরিয়াল ট্র্যাকিং: ঘরে বসেই জানুন আপনার নম্বর"}
            </div>
          </div>

          {/* ডেসক্রিপশন */}
          <p className="text-slate-600 text-sm lg:text-lg leading-relaxed font-medium">
            {isEmergency
              ? "জরুরি মুহূর্তে কোনো রিকোয়েস্ট বা সিরিয়ালের অপেক্ষা নয়। সরাসরি অ্যাপয়েন্টমেন্ট বুক করুন এবং দ্রুত চিকিৎসকের সেবা গ্রহণ করুন।"
              : "দিনাজপুরের অভিজ্ঞ ডাক্তারদের তালিকা থেকে পছন্দের ডাক্তার বেছে নিন এবং লাইভ সিরিয়াল ট্র্যাকিংয়ের মাধ্যমে ভোগান্তি ছাড়াই অ্যাপয়েন্টমেন্ট নিন।"}
          </p>

          {/* কুইক অ্যাকশন ট্যাগস */}
          <div className="pt-2 flex flex-wrap gap-3">
            <div
              className={`px-4 py-2 rounded-full text-[12px] font-bold border ${
                isEmergency
                  ? "bg-rose-600 text-white border-rose-700 shadow-sm"
                  : "bg-emerald-50 text-emerald-700 border-emerald-100"
              }`}
            >
              {isEmergency
                ? "🚨 সরাসরি বুকিং (No Request)"
                : "📱 লাইভ সিরিয়াল ট্র্যাকিং"}
            </div>
            <div className="px-4 py-2 bg-indigo-50 rounded-full text-[12px] font-bold text-indigo-700 border border-indigo-100">
              👨‍⚕️ ভেরিফাইড বিশেষজ্ঞ
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
