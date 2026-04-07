import Link from "next/link";

const AboutPage = () => {
  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans antialiased text-slate-900">
      {/* Hero Section with Glassmorphism */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden  ">
        <div className="absolute inset-0 bg-cover bg-center animate-hero-bg" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 background/80 to-secondary/40" />

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <h1 className="opacity-0 animate-hero-text text-3xl md:text-4xl lg:text-6xl font-extrabold mb-6 bg-gradient-to-r from-[#0F4C81] via-[#14B8A6] to-[#0EA5E9] bg-clip-text text-transparent leading-tight">
            <span className="block">সুস্থতার পথে আপনার</span>

            <span className="block mt-6 text-[#14B8A6]">
              সঠিক ডিজিটাল সঙ্গী
            </span>
          </h1>

          <p className="opacity-0 animate-hero-text animate-delay-200 text-base md:text-xl text-default-700 dark:text-default-300 mb-10 max-w-2xl mx-auto">
            আধুনিক প্রযুক্তির মাধ্যমে সঠিক ডাক্তার এবং উন্নত সেবা নিশ্চিত করাই
            আমাদের লক্ষ্য।
          </p>
        </div>
      </section>

      {/* Stats Section - Floating Card Design */}
      <div className="container -mt-16 px-6 relative z-20">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] grid grid-cols-2 md:grid-cols-4 gap-4 py-10 px-6 text-center border border-white">
          {[
            {
              label: "পার্টনার ক্লিনিক",
              value: "২০+",
              color: "text-indigo-600",
            },
            { label: "সন্তুষ্ট রোগী", value: "১০০০+", color: "text-teal-600" },
            {
              label: "বিশেষজ্ঞ ডাক্তার",
              value: "৫০+",
              color: "text-indigo-600",
            },
            { label: "অনলাইন সাপোর্ট", value: "২৪/৭", color: "text-teal-600" },
          ].map((stat, i) => (
            <div key={i} className={i !== 0 ? "border-l border-slate-100" : ""}>
              <p
                className={`text-3xl md:text-5xl font-black ${stat.color} mb-1`}
              >
                {stat.value}
              </p>
              <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission & Vision - Two Column Layout */}
      <section className="py-24 container">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative group p-1 bg-gradient-to-br from-slate-200 to-white rounded-[2rem]">
            <div className="bg-white p-12 rounded-[1.8rem] h-full transition-all group-hover:bg-slate-50">
              <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-indigo-200 mb-8">
                🎯
              </div>
              <h2 className="text-3xl font-extrabold text-slate-800 mb-6">
                আমাদের মিশন
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                আমাদের লক্ষ্য হলো রোগীদের সময় বাঁচিয়ে দ্রুততম সময়ে বিশেষজ্ঞ
                ডাক্তারের সিরিয়াল নিশ্চিত করা। আমরা চাই প্রতিটি রোগী যেন সঠিক
                তথ্যের মাধ্যমে ক্লিনিকে গিয়ে কোনো ভোগান্তি ছাড়াই সেবা পায়।
              </p>
            </div>
          </div>

          <div className="relative group p-1 bg-gradient-to-br from-slate-200 to-white rounded-[2rem]">
            <div className="bg-white p-12 rounded-[1.8rem] h-full transition-all group-hover:bg-slate-50">
              <div className="w-14 h-14 bg-teal-500 text-white rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-teal-100 mb-8">
                👁️
              </div>
              <h2 className="text-3xl font-extrabold text-slate-800 mb-6">
                আমাদের ভিশন
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                আমরা এমন একটি ডিজিটাল স্বাস্থ্য ইকোসিস্টেম তৈরি করছি যেখানে
                বাংলাদেশের যেকোনো প্রান্ত থেকে মানুষ ঘরে বসেই ২০টিরও বেশি
                ক্লিনিকের সেবা এবং বিশ্বস্ত ডাক্তারদের পরামর্শ নিতে পারবে।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Modern Grid */}
      <section className="bg-slate-100/50  container">
        <div className="">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
              কেন আমরা আলাদা?
            </h2>
            <div className="h-1.5 w-24 bg-indigo-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "সঠিক তথ্য",
                icon: "💎",
                desc: "আমরা সরাসরি ক্লিনিক থেকে প্রাপ্ত ১০০% ভেরিফাইড তথ্য প্রদান করি।",
              },
              {
                title: "দ্রুত সিরিয়াল",
                icon: "⚡",
                desc: "ওটিপি ভেরিফিকেশনের মাধ্যমে সেকেন্ডের মধ্যে আপনার সিরিয়াল নিশ্চিত করুন।",
              },
              {
                title: "ইউজার ফ্রেন্ডলি",
                icon: "📱",
                desc: "যেকোনো স্মার্টফোন থেকে সহজেই ব্যবহারযোগ্য আমাদের এই ইন্টারফেস।",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100"
              >
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">
                  {feature.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Dark & Bold */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-indigo-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          <h3 className="text-3xl md:text-5xl font-black text-white mb-10 relative z-10 leading-tight">
            আপনার সুস্থতাই আমাদের সার্থকতা
          </h3>
          <Link
            href={`/doctors`}
            className="relative z-10 pt-4 bg-white text-indigo-600 px-12 py-5 rounded-2xl font-black text-xl hover:bg-slate-100 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
          >
            আজই অ্যাপয়েন্টমেন্ট নিন
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
