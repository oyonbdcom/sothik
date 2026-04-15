"use client";

export function HomeBanner() {
  return (
    <section className="hero-gradient   h-fit dot-pattern relative overflow-hidden">
      <div className="container pt-16    ">
        <div className="grid lg:grid-cols-2 gap-12 items-end">
          {/* Left Content */}
          <div className="pb-16 fade-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
              <span className="relative flex w-2 h-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              বাংলাদেশের ১ নম্বর হেলথকেয়ার প্ল্যাটফর্ম
            </div>

            {/* Headline */}
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-[1] lg:leading-[1.2] mb-3">
              সেরা{" "}
              <span className="text-blue-700 relative">
                ডাক্তার
                <svg
                  className="absolute bottom-3 left-0 w-full"
                  viewBox="0 0 200 8"
                  fill="none"
                >
                  <path
                    d="M2 6 Q50 2 100 6 Q150 10 198 4"
                    stroke="#93C5FD"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </span>{" "}
              খুঁজুন,
              <br />
              <span className="inline-block mt-4 mb-2">
                ডায়াগনস্টিক সেন্টারে
              </span>
              <br />
              <span className="text-teal-600">সরাসরি ভিজিট করুন</span>
            </h1>

            <p className="text-base text-slate-500 leading-relaxed mb-8 max-w-md">
              আপনার পাশের ডায়াগনস্টিক সেন্টারে বিশেষজ্ঞ ডাক্তারের সাথে অফলাইন
              ভিজিটের ব্যবস্থা করুন। দ্রুত, সহজ ও সম্পূর্ণ নির্ভরযোগ্য।
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3 mb-10">
              <button className="flex items-center gap-2 bg-blue-700 text-white text-sm font-bold px-6 py-3.5 rounded-xl hover:bg-blue-800 transition-all shadow-lg shadow-blue-200">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M10.5 2C5.81 2 2 5.81 2 10.5S5.81 19 10.5 19c1.93 0 3.7-.64 5.13-1.72l4.8 4.79 1.41-1.41-4.79-4.8A8.48 8.48 0 0019 10.5C19 5.81 15.19 2 10.5 2z" />
                </svg>
                ডাক্তার খুঁজুন
              </button>
              <button className="flex items-center gap-2 bg-white text-blue-700 border-2 border-blue-200 text-sm font-bold px-6 py-3.5 rounded-xl hover:border-blue-400 transition-all">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z" />
                </svg>
                ডায়াগনস্টিক সেন্টার দেখুন
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-sm">
              {[
                { num: "২,৫০০+", label: "বিশেষজ্ঞ ডাক্তার" },
                { num: "৩৮০+", label: "ডায়াগনস্টিক সেন্টার" },
                { num: "১.২ লক্ষ+", label: "সন্তুষ্ট রোগী" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-white shadow-sm text-center"
                >
                  <p className="text-xl font-bold text-blue-700">{stat.num}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Illustration */}
          <div className="hidden lg:flex justify-center items-end">
            <div className="relative w-full max-w-lg">
              {/* Floating cards */}
              <div
                className="absolute top-8 -left-4 z-10 float bg-white rounded-2xl shadow-xl shadow-slate-100 border border-slate-100 p-3.5 flex items-center gap-3 w-52"
                style={{ animationDelay: "0s" }}
              >
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-lg">
                  ✅
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    অ্যাপয়েন্টমেন্ট নিশ্চিত
                  </p>
                  <p className="text-[10px] text-slate-400">আজ, বেলা ৩:০০ টা</p>
                </div>
              </div>

              <div
                className="absolute top-32 -right-6 z-10 float bg-white rounded-2xl shadow-xl shadow-slate-100 border border-slate-100 p-3.5"
                style={{ animationDelay: "1.5s" }}
              >
                <p className="text-[10px] text-slate-400 mb-1">
                  ডাক্তারের রেটিং
                </p>
                <div className="flex gap-0.5 mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} className="text-amber-400 text-sm">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-xs font-bold text-slate-800">৪.৯ / ৫.০</p>
                <p className="text-[10px] text-slate-400">১,২৩০ রিভিউ</p>
              </div>

              <div
                className="absolute bottom-20 -left-8 z-10 float bg-white rounded-2xl shadow-xl shadow-slate-100 border border-slate-100 p-3 flex items-center gap-2.5 w-44"
                style={{ animationDelay: "0.8s" }}
              >
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-base">
                  📍
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-800">
                    কাছের সেন্টার
                  </p>
                  <p className="text-[10px] text-blue-600 font-semibold">
                    মাত্র ১.২ কি.মি.
                  </p>
                </div>
              </div>

              {/* Main SVG Illustration */}
              <svg
                viewBox="0 0 420 480"
                className="w-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background circle */}
                <circle
                  cx="210"
                  cy="280"
                  r="180"
                  fill="#EFF6FF"
                  opacity="0.8"
                />
                <circle
                  cx="210"
                  cy="280"
                  r="140"
                  fill="#DBEAFE"
                  opacity="0.4"
                />

                {/* Hospital building */}
                <rect
                  x="120"
                  y="220"
                  width="180"
                  height="200"
                  rx="8"
                  fill="#fff"
                  stroke="#BFDBFE"
                  strokeWidth="2"
                />
                <rect
                  x="140"
                  y="240"
                  width="40"
                  height="40"
                  rx="4"
                  fill="#DBEAFE"
                />
                <rect
                  x="200"
                  y="240"
                  width="40"
                  height="40"
                  rx="4"
                  fill="#DBEAFE"
                />
                <rect
                  x="260"
                  y="240"
                  width="20"
                  height="40"
                  rx="4"
                  fill="#DBEAFE"
                />
                <rect
                  x="140"
                  y="300"
                  width="40"
                  height="40"
                  rx="4"
                  fill="#DBEAFE"
                />
                <rect
                  x="200"
                  y="300"
                  width="40"
                  height="40"
                  rx="4"
                  fill="#DBEAFE"
                />
                {/* Door */}
                <rect
                  x="175"
                  y="360"
                  width="70"
                  height="60"
                  rx="4"
                  fill="#1D4ED8"
                />
                {/* Cross sign */}
                <rect
                  x="190"
                  y="180"
                  width="40"
                  height="12"
                  rx="4"
                  fill="#1D4ED8"
                />
                <rect
                  x="201"
                  y="169"
                  width="18"
                  height="34"
                  rx="4"
                  fill="#1D4ED8"
                />
                {/* Roof */}
                <polygon
                  points="110,225 210,160 310,225"
                  fill="#1D4ED8"
                  opacity="0.9"
                />

                {/* Doctor figure */}
                <circle
                  cx="320"
                  cy="260"
                  r="32"
                  fill="#DBEAFE"
                  stroke="#93C5FD"
                  strokeWidth="2"
                />
                <circle
                  cx="320"
                  cy="252"
                  r="20"
                  fill="#fff"
                  stroke="#BFDBFE"
                  strokeWidth="1.5"
                />
                {/* face */}
                <circle cx="313" cy="250" r="2.5" fill="#1D4ED8" />
                <circle cx="327" cy="250" r="2.5" fill="#1D4ED8" />
                <path
                  d="M313 259 Q320 265 327 259"
                  stroke="#1D4ED8"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* coat */}
                <rect
                  x="298"
                  y="275"
                  width="44"
                  height="55"
                  rx="8"
                  fill="#fff"
                  stroke="#DBEAFE"
                  strokeWidth="1.5"
                />
                <rect
                  x="312"
                  y="279"
                  width="16"
                  height="22"
                  rx="3"
                  fill="#DBEAFE"
                />
                {/* stethoscope */}
                <path
                  d="M305 295 Q297 312 307 320 Q317 326 320 320"
                  stroke="#1D4ED8"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
                <circle cx="320" cy="323" r="4" fill="#1D4ED8" opacity="0.4" />
                <circle cx="320" cy="323" r="2.5" fill="#1D4ED8" />
                {/* cross */}
                <rect
                  x="315"
                  y="286"
                  width="6"
                  height="1.5"
                  rx="1"
                  fill="#1D4ED8"
                />
                <rect
                  x="317.5"
                  y="284"
                  width="1.5"
                  height="6"
                  rx="1"
                  fill="#1D4ED8"
                />

                {/* Patient figure */}
                <circle
                  cx="110"
                  cy="300"
                  r="26"
                  fill="#D1FAE5"
                  stroke="#6EE7B7"
                  strokeWidth="2"
                />
                <circle
                  cx="110"
                  cy="293"
                  r="16"
                  fill="#fff"
                  stroke="#A7F3D0"
                  strokeWidth="1"
                />
                <circle cx="105" cy="291" r="2" fill="#059669" />
                <circle cx="115" cy="291" r="2" fill="#059669" />
                <path
                  d="M105 299 Q110 304 115 299"
                  stroke="#059669"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <rect
                  x="92"
                  y="318"
                  width="36"
                  height="42"
                  rx="6"
                  fill="#D1FAE5"
                  stroke="#A7F3D0"
                  strokeWidth="1"
                />

                {/* Connector arrow */}
                <path
                  d="M135 330 L290 300"
                  stroke="#93C5FD"
                  strokeWidth="2"
                  strokeDasharray="5,4"
                  strokeLinecap="round"
                />
                <circle cx="213" cy="315" r="14" fill="#1D4ED8" />
                <text
                  x="213"
                  y="320"
                  fontSize="12"
                  textAnchor="middle"
                  fill="white"
                >
                  📋
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
