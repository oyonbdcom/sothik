import { getAllClinics } from "@/service/clinic.service";
import { getAllDoctors } from "@/service/doctor.service";
import { Suspense } from "react";
import DiagnosticCenter from "./components/diagnostic-center";
import FeaturedDoctors from "./components/featured-doctors";
import Footer from "./components/footer";
import Header from "./components/header";
import { HomeBanner } from "./components/hero";
import { Searchbar } from "./components/searchbar";
import Specialties from "./components/Specialites";
import Testimonial from "./components/testimonial";

const steps = [
  {
    num: "০১",
    icon: "🔍",
    title: "খুঁজুন",
    desc: "আপনার এলাকা ও সমস্যা অনুযায়ী ডাক্তার বা সেন্টার খুঁজুন",
    color: "bg-blue-600",
  },
  {
    num: "০২",
    icon: "👨‍⚕️",
    title: "বেছে নিন",
    desc: "রেটিং, অভিজ্ঞতা ও ফি দেখে সেরা ডাক্তার পছন্দ করুন",
    color: "bg-teal-600",
  },
  {
    num: "০৩",
    icon: "📅",
    title: "বুক করুন",
    desc: "পছন্দের তারিখ ও ডায়াগনস্টিক সেন্টার বেছে অ্যাপয়েন্টমেন্ট নিন",
    color: "bg-indigo-600",
  },
  {
    num: "০৪",
    icon: "🏥",
    title: "ভিজিট করুন",
    desc: "ডায়াগনস্টিক সেন্টারে সরাসরি গিয়ে বিশেষজ্ঞ চিকিৎসা নিন",
    color: "bg-blue-800",
  },
];

// ─── Star Rating Component ────────────────────────────────

// ─── Main Page ────────────────────────────────────────────
export default async function Home() {
  const query = {
    active: true,
    limit: 4,
  };

  // ২. সার্ভার সাইড ডাটা ফেচিং
  const response = await getAllDoctors(query);
  const doctors = response?.data || [];
  const clresponse = await getAllClinics(query);
  const diagnostic = clresponse?.data || [];

  return (
    <div
      className="min-h-screen bg-white font-sans"
      style={{ fontFamily: "'Hind Siliguri', 'Noto Sans Bengali', sans-serif" }}
    >
      {/* ── Google Font Import (via next/head would be better but inline for demo) */}

      {/* ══════════════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════════════ */}
      <Header />

      {/* ══════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════ */}
      <HomeBanner />

      {/* ══════════════════════════════════════════════════
          SMART SEARCH BAR
      ══════════════════════════════════════════════════ */}
      <Suspense fallback={<div>Loading...</div>}>
        <Searchbar />
      </Suspense>

      {/* ══════════════════════════════════════════════════
          SPECIALTIES
      ══════════════════════════════════════════════════ */}
      <Specialties />
      {/* ══════════════════════════════════════════════════
          FEATURED DOCTORS
      ══════════════════════════════════════════════════ */}
      <FeaturedDoctors doctors={doctors} />

      {/* ══════════════════════════════════════════════════
          DIAGNOSTIC CENTERS
      ══════════════════════════════════════════════════ */}
      <DiagnosticCenter diagnostic={diagnostic} />

      {/* ══════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 py-16 px-2 relative overflow-hidden">
        {/* Background decoration */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">কীভাবে কাজ করে?</h2>
            <p className="text-blue-200 text-sm mt-2">
              মাত্র ৪টি সহজ ধাপে চিকিৎসা নিশ্চিত করুন
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center h-full">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                    {step.icon}
                  </div>
                  <div className="text-blue-300 text-xs font-bold mb-2 tracking-widest">
                    {step.num}
                  </div>
                  <h3 className="text-white font-bold text-base mb-2">
                    {step.title}
                  </h3>
                  <p className="text-blue-200 text-xs leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10 text-white/40 text-xl">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════ */}
      <Testimonial />

      {/* ══════════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════════ */}
      <section className="container pb-16 px-6">
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-800 rounded-3xl p-10 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 20%, white 0%, transparent 40%)",
            }}
          ></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-3">
              আজই শুরু করুন আপনার সুস্বাস্থ্যের যাত্রা
            </h2>
            <p className="text-blue-200 text-sm mb-8 max-w-md mx-auto">
              বাংলাদেশের লক্ষাধিক মানুষের বিশ্বস্ত স্বাস্থ্যসেবা প্ল্যাটফর্মে
              যোগ দিন
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button className="bg-white text-blue-700 font-bold text-sm px-7 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg">
                এখনই রেজিস্ট্রেশন করুন
              </button>
              <button className="bg-transparent text-white border-2 border-white/40 font-bold text-sm px-7 py-3.5 rounded-xl hover:bg-white/10 transition-colors">
                ডাক্তার হিসেবে যোগ দিন →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════ */}
      <Footer />
    </div>
  );
}
