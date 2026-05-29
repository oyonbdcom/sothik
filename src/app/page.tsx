import { getAllDiagnostics } from "@/service/diagnostic.service";
import { getAllDoctors } from "@/service/doctor.service";
import Link from "next/link";
import { Suspense } from "react";
import AchievementStats from "./components/counter";
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
    desc: "আপনার এলাকা ও সমস্যা অনুযায়ী ডাক্তার বা ডায়াগনস্টিক সেন্টার খুঁজুন",
    color: "bg-[#1A237E]", // Deep Navy
  },
  {
    num: "০২",
    icon: "📅",
    title: "বুক করুন",
    desc: "পছন্দের তারিখ ও ডায়াগনস্টিক সেন্টার বেছে নিয়ে সহজে অ্যাপয়েন্টমেন্ট নিন",
    color: "bg-[#06B6D4]", // Cyan
  },
  {
    num: "০৩",
    icon: "⏱️",
    title: "সিরিয়াল ট্র্যাকিং",
    desc: "সরাসরি ওয়েবসাইট থেকে আপনার সিরিয়ালের লাইভ আপডেট ট্র্যাক করুন",
    color: "bg-[#1A237E]",
  },
  {
    num: "০৪",
    icon: "🏥",
    title: "চিকিৎসা নিন",
    desc: "সঠিক সময়ে সেন্টারে পৌঁছে বিশেষজ্ঞ ডাক্তারের পরামর্শ গ্রহণ করুন",
    color: "bg-[#06B6D4]",
  },
  {
    num: "০৫",
    icon: "📄",
    title: "রিপোর্ট ও প্রেসক্রিপশন",
    desc: "আপনার সব ডিজিটাল প্রেসক্রিপশন ও ল্যাব রিপোর্ট আজীবনের জন্য স্টোর করে রাখুন",
    color: "bg-[#1A237E]",
  },
];

// ─── Star Rating Component ────────────────────────────────

// ─── Main Page ────────────────────────────────────────────
export default async function Home() {
  const query = {
    active: true,
    membership: true,
    limit: 4,
  };

  // ২. সার্ভার সাইড ডাটা ফেচিং
  const response = await getAllDoctors(query);
  const doctors = response?.data || [];
  const clresponse = await getAllDiagnostics(query);
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

      <AchievementStats />
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
      <section className="container mx-auto px-6 pb-24">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#1A237E] p-8 md:p-16 shadow-2xl shadow-indigo-900/20">
          {/* Background Decorative Elements - Professional Mesh Effect */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle at 10% 20%, #06B6D4 0%, transparent 40%), 
                          radial-gradient(circle at 90% 80%, #06B6D4 0%, transparent 40%)`,
            }}
          />

          {/* Subtle Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2v-4h4v-2H6zM36 4V0h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Trust Badge */}
            <div className="mb-6 flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#06B6D4] opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#06B6D4]"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-100">
                সাসথিক ইকোসিস্টেমের সাথে যুক্ত হোন
              </span>
            </div>

            {/* Main Content */}
            <h2 className="mb-6 max-w-2xl text-3xl font-black leading-tight text-white md:text-5xl">
              স্মার্ট স্বাস্থ্যসেবার নতুন যুগে <br />
              <span className="text-[#06B6D4]">আপনার যাত্রা শুরু হোক</span> আজই
            </h2>

            <p className="mb-10 max-w-xl text-lg font-medium leading-relaxed text-indigo-100/80">
              দিনাজপুরের ডায়াগনস্টিক সেন্টারগুলোর ডিজিটাল সিরিয়াল ম্যানেজমেন্ট
              এবং রোগীদের উন্নত অভিজ্ঞতা নিশ্চিত করতে আমাদের সাথে যুক্ত হোন।
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={"/register"}
                className="group relative flex items-center gap-2 overflow-hidden rounded-2xl bg-[#06B6D4] px-10 py-4 font-black text-white transition-all hover:scale-105 hover:bg-cyan-500 active:scale-95 shadow-xl shadow-cyan-900/20"
              >
                রজিস্ট্রেশন করুন
                <svg
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>

              <Link
                href={"/contact"}
                className="flex items-center gap-2 rounded-2xl border-2 border-white/20 bg-white/5 px-10 py-4 font-bold text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/40 active:scale-95"
              >
                সেন্টার হিসেবে যোগ দিন
              </Link>
            </div>

            {/* Footer Support Text */}
            <div className="mt-10 flex flex-col items-center gap-4">
              <p className="text-sm font-medium tracking-wide text-indigo-200/60">
                যেকোনো প্রয়োজনে আমাদের সরাসরি হোয়াটসঅ্যাপ করুন
              </p>

              <a
                href="https://wa.me/8801737813575" // আপনার সঠিক নম্বরটি এখানে বসান
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 backdrop-blur-xl transition-all hover:border-[#25D366]/40 hover:bg-[#25D366]/5"
              >
                {/* Custom WhatsApp SVG */}
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] p-2 shadow-[0_0_20px_rgba(37,211,102,0.3)] transition-transform group-hover:scale-110">
                  <svg
                    viewBox="0 0 24 24"
                    fill="white"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.672 1.433 5.657 1.434h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </div>

                <div className="flex flex-col">
                  <span className="text-lg font-black text-white">
                    হোয়াটসঅ্যাপ চ্যাট
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#25D366]">
                    সরাসরি উত্তর পেতে
                  </span>
                </div>

                <div className="ml-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-colors group-hover:bg-white/10">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path
                      d="M7 17L17 7M17 7H7M17 7V17"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </a>
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
