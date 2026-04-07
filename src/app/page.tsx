import { getAllClinics } from "@/service/clinic.service";
import { getAllDoctors } from "@/service/doctor.service";
import DiagnosticCenter from "./components/diagnostic-center";
import FeaturedDoctors from "./components/featured-doctors";
import Footer from "./components/footer";
import Header from "./components/header";
import { HomeBanner } from "./components/hero";
import { Searchbar } from "./components/searchbar";
import Specialties from "./components/Specialites";

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

const testimonials = [
  {
    name: "রকিবুল হাসান",
    location: "ঢাকা",
    text: "মাত্র ৫ মিনিটে অ্যাপয়েন্টমেন্ট নিয়েছিলাম। কোনো লাইন ছাড়াই ডাক্তার দেখাতে পেরেছি। অসাধারণ সেবা!",
    rating: 5,
    initials: "রক",
    bg: "bg-blue-100 text-blue-700",
  },
  {
    name: "নাসরিন আক্তার",
    location: "চট্টগ্রাম",
    text: "আমার মায়ের জন্য কাছের সেন্টারে নিউরোলজিস্ট খুঁজছিলাম। এই ওয়েবসাইটের মাধ্যমে সহজেই পেয়ে গেলাম।",
    rating: 5,
    initials: "না",
    bg: "bg-emerald-100 text-emerald-700",
  },
  {
    name: "কামরুজ্জামান",
    location: "সিলেট",
    text: "ফিল্টার সিস্টেমটা দারুণ। বিশেষজ্ঞতা ও এলাকা দিয়ে একসাথে খোঁজা যায়। শিশুর ডাক্তার খুঁজতে কষ্ট হয়নি।",
    rating: 5,
    initials: "কা",
    bg: "bg-rose-100 text-rose-700",
  },
];

// ─── Star Rating Component ────────────────────────────────

// ─── Main Page ────────────────────────────────────────────
export default async function Home() {
  const query = {
    active: true,
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

      <Searchbar />
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
      <section className="bg-gradient-to-br from-blue-700 to-blue-900 py-16 relative overflow-hidden">
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
      <section className="container py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900">
            রোগীদের <span className="text-blue-700">অভিজ্ঞতা</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            আমাদের সেবা সম্পর্কে তারা কী বলছেন
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="card-hover bg-white border border-slate-100 rounded-2xl p-6 shadow-sm"
            >
              {/* Quote mark */}
              <div className="text-4xl text-blue-100 font-serif leading-none mb-3">
                &quot;
              </div>
              <p className="text-sm text-slate-600 leading-relaxed italic mb-5">
                {t.text}
              </p>
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg
                    key={s}
                    className="w-3.5 h-3.5 text-amber-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${t.bg}`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{t.name}</p>
                  <p className="text-xs text-blue-400">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════════ */}
      <section className="container pb-16">
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
