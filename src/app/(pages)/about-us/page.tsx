"use client";

import { motion } from "framer-motion";
import { CheckCircle2, HeartHandshake, Lock, Zap } from "lucide-react";

const AboutPage = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const missionItems = [
    {
      title: "সঠিক বিশেষজ্ঞ নির্বাচন",
      text: "পরিচিতদের ওপর নির্ভরতা কমিয়ে, ভেরিফাইড তথ্যের মাধ্যমে সঠিক বিশেষজ্ঞ খুঁজে পাওয়া নিশ্চিত করা।",
    },
    {
      title: "বিস্তারিত প্রোফাইল",
      text: "ডাক্তার কোথায়, কখন বসেন এবং তার অভিজ্ঞতা—সব তথ্য এখন আপনার হাতের মুঠোয়।",
    },
    {
      title: "ইনস্ট্যান্ট বুকিং",
      text: "দীর্ঘ লাইনে দাঁড়ানোর ঝামেলা ছাড়াই কয়েক সেকেন্ডে সরাসরি অ্যাপয়েন্টমেন্ট নিশ্চিত করার সমাধান।",
    },
    {
      title: "স্বচ্ছ ডিরেক্টরি",
      text: "সরকারি ও বেসরকারি ক্লিনিক এবং ডাক্তারদের অবস্থান ও সেবা সংক্রান্ত তথ্যের স্বচ্ছতা তৈরি করা।",
    },
    {
      title: "জরুরি সেবা সংযোগ",
      text: "জরুরি মুহূর্তে আপনার নিকটস্থ অ্যাম্বুলেন্স বা ক্লিনিক দ্রুত খুঁজে দিয়ে মূল্যবান জীবন বাঁচানো।",
    },
    {
      title: "১০০% চার্জ-মুক্ত",
      text: "কোনো প্রকার হিডেন ফি বা কমিশন ছাড়াই সাধারণ মানুষের জন্য স্বাস্থ্যসেবা সহজতর করা।",
    },
  ];

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-blue-100 selection:text-blue-700">
      {/* --- Hero Section --- */}
      <section className="relative pt-24 pb-16 lg:pt-36 lg:pb-32 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div {...fadeIn} className="max-w-4xl">
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full">
              Empowering Healthcare
            </span>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8 tracking-tight">
              স্বাস্থ্যসেবা এখন সবার জন্য <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">
                সহজ এবং উন্মুক্ত।
              </span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
              সুস্থিও (SusthiO) কোনো সাধারণ ডিরেক্টরি নয়; এটি একটি ডিজিটাল
              বিপ্লব। আমরা প্রযুক্তির মাধ্যমে রোগী এবং চিকিৎসকের মাঝে একটি
              নিরাপদ ও দ্রুত সেতুবন্ধন তৈরি করেছি।
            </p>
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 -z-10 skew-x-12 translate-x-24 hidden lg:block"></div>
      </section>

      {/* --- Value Proposition --- */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <Lock size={28} />,
                title: "Privacy First",
                desc: "আপনার হেলথ ডেটা এনক্রিপ্টেড। অনুমতি ছাড়া কেউ আপনার তথ্য দেখতে পারবে না।",
              },
              {
                icon: <Zap size={28} />,
                title: "Zero Latency",
                desc: "কোনো সিরিয়াল বা লাইনে দাঁড়ানোর ঝামেলা নেই। রিয়েল-টাইম বুকিং সিস্টেম।",
              },
              {
                icon: <HeartHandshake size={28} />,
                title: "No Commission",
                desc: "আমরা কোনো আর্থিক লেনদেনে জড়িত নই। আমাদের সেবা ১০০% ফ্রি।",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group p-2"
              >
                <div className="w-14 h-14 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Detailed Mission Section --- */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20 items-start">
            {/* Left: Image Side */}
            <div className="lg:w-2/5 relative">
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800"
                  alt="Modern Healthcare"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-100 rounded-full -z-10 blur-3xl opacity-60"></div>
              <div className="absolute -top-10 -left-10 w-48 h-48 bg-blue-100 rounded-full -z-10 blur-3xl opacity-60"></div>
            </div>

            {/* Right: Content Side */}
            <div className="lg:w-3/5">
              <h2 className="text-3xl lg:text-5xl font-bold mb-10 text-slate-900 leading-tight tracking-tight">
                আমাদের লক্ষ্য: প্রতিটি ইউনিয়নে <br /> ডিজিটাল স্বাস্থ্যসেবা।
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                {missionItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="bg-emerald-50 p-2 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300 shrink-0">
                      <CheckCircle2
                        size={18}
                        className="text-emerald-500 group-hover:text-white transition-colors"
                      />
                    </div>
                    <div>
                      <h4 className="text-slate-900 font-bold text-lg mb-1 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Vision Quote --- */}
      {/* <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <h2 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-10">
            Visionary Thought
          </h2>
          <blockquote className="text-3xl lg:text-4xl italic text-slate-800 leading-[1.4] font-medium tracking-tight">
            &quot;চিকিৎসা নিতে গিয়ে কাউকে যেন তথ্যের অভাবে হয়রানি হতে না হয়—এই
            লক্ষ্যেই সুস্থিও-র যাত্রা। আমরা মুনাফা নয়, মানুষের আস্থা অর্জন করতে
            চাই।&quot;
          </blockquote>
          <div className="mt-12 flex flex-col items-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl rotate-12 flex items-center justify-center text-white font-bold text-2xl shadow-xl mb-6">
              <span className="-rotate-12">S</span>
            </div>
            <h4 className="font-bold text-xl text-slate-900">
              SusthiO Development Team
            </h4>
            <p className="text-slate-400 uppercase tracking-[0.2em] text-xs mt-2 font-bold">
              Innovation for Humanity
            </p>
          </div>
        </div>
      </section> */}

      {/* --- CTA --- */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="bg-slate-900 rounded-[3.5rem] p-12 lg:p-24 text-center text-white shadow-2xl relative overflow-hidden border border-slate-800">
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-6xl font-bold mb-8 tracking-tight">
                আমাদের সাথে যুক্ত হতে চান?
              </h2>
              <p className="text-slate-400 text-lg lg:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                আপনি যদি একজন চিকিৎসক হন বা একটি ক্লিনিক পরিচালনা করেন, তবে
                আমাদের নেটওয়ার্কে যুক্ত হয়ে মানুষের সেবায় অংশ নিন।
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <button className="bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold hover:bg-blue-700 hover:-translate-y-1 transition-all shadow-xl shadow-blue-900/20 active:scale-95">
                  রেজিস্ট্রেশন করুন
                </button>
                <button className="bg-slate-800 text-white px-10 py-5 rounded-2xl font-bold hover:bg-slate-700 border border-slate-700 transition-all active:scale-95">
                  যোগাযোগ করুন
                </button>
              </div>
            </div>
            {/* Design Pattern */}
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]"></div>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px]"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
