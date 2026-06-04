"use client";

import { motion } from "framer-motion";
import {
  Activity,
  CheckCircle2,
  FileText,
  HeartHandshake,
  Lock,
} from "lucide-react";

const AboutClient = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const missionItems = [
    {
      title: "ভেরিফাইড বিশেষজ্ঞ",
      text: "অনিশ্চয়তা দূর করে সঠিক চিকিৎসার জন্য আমরা দিচ্ছি শতভাগ ভেরিফাইড চিকিৎসক ডিরেক্টরি।",
    },
    {
      title: "লাইভ সিরিয়াল ট্র্যাকিং",
      text: "ক্লিনিকে ঘণ্টার পর ঘণ্টা অপেক্ষা না করে ঘরে বসেই জানুন আপনার বর্তমান সিরিয়াল নম্বর।",
    },
    {
      title: "ডিজিটাল প্রেসক্রিপশন",
      text: "আপনার সকল প্রেসক্রিপশন ও মেডিকেল রিপোর্ট নিরাপদে আপলোড এবং সংরক্ষণ করুন এক জায়গায়।",
    },
    {
      title: "স্মার্ট সার্চ ইঞ্জিন",
      text: "আপনার নিকটস্থ ডায়াগনস্টিক সেন্টার ও ডাক্তারদের অবস্থান এবং ফি সংক্রান্ত স্বচ্ছ তথ্য।",
    },
    {
      title: "দ্রুত বুকিং সিস্টেম",
      text: "কোনো কল করার ঝামেলা ছাড়াই সরাসরি অ্যাপের মাধ্যমে অ্যাপয়েন্টমেন্ট নিশ্চিত করার সুবিধা।",
    },
    {
      title: "শতভাগ স্বচ্ছতা",
      text: "কোনো হিডেন চার্জ বা কমিশন নেই; আমাদের লক্ষ্য স্বাস্থ্যসেবাকে সাধারণ মানুষের নাগালের মধ্যে রাখা।",
    },
  ];

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-blue-100 selection:text-blue-700">
      {/* --- Hero Section --- */}
      <section className="relative pt-24 pb-16 lg:pt-40 lg:pb-32 overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] [background-position:top_center]">
        <div className="container mx-auto px-6 relative z-10 text-center lg:text-left">
          <motion.div {...fadeIn} className="max-w-4xl mx-auto lg:mx-0">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.2em] text-blue-600 uppercase bg-blue-50 border border-blue-100 rounded-full">
              <Activity size={14} /> Transforming Healthcare
            </span>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tighter">
              স্বাস্থ্যসেবায় প্রযুক্তির <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500">
                এক নতুন অভিজ্ঞতা।
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl mb-10">
              সুস্থিও (SusthiO) শুধু একটি ডিরেক্টরি নয়; এটি একটি স্মার্ট
              ইকোসিস্টেম। আমরা রোগী ও চিকিৎসকের দূরত্ব কমিয়ে স্বাস্থ্যসেবাকে
              করেছি দ্রুত, সহজ এবং ডিজিটাল।
            </p>
          </motion.div>
        </div>
        {/* Decorative Orbs */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      </section>

      {/* --- Value Proposition (Glassmorphism Cards) --- */}
      <section className="py-20 -mt-10 relative z-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Lock size={24} />,
                title: "Data Integrity",
                desc: "আপনার মেডিকেল ডাটা সম্পূর্ণ এনক্রিপ্টেড। আপনার অনুমতি ছাড়া এর এক্সেস কারো কাছে নেই।",
                color: "blue",
              },
              {
                icon: <FileText size={24} />,
                title: "Digital Vault",
                desc: "প্রেসক্রিপশন ও রিপোর্ট হারানো ভয় নেই। ডিজিটাল স্টোরেজে সেভ রাখুন আজীবনের জন্য।",
                color: "emerald",
              },
              {
                icon: <HeartHandshake size={24} />,
                title: "Community Driven",
                desc: "আমরা কোনো কমিশন এজেন্ট নই। মানুষের আস্থার ভিত্তিতে গড়ে তোলা একটি অলাভজনক ভিশন।",
                color: "slate",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white p-10 rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-100 hover:border-blue-200 transition-all duration-500"
              >
                <div className="w-14 h-14 bg-slate-50 text-slate-700 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-slate-900 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Detailed Mission Section --- */}
      <section className="py-24 lg:py-32 bg-slate-50/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20 items-center">
            {/* Left: Image with Professional Border */}
            <div className="lg:w-1/2 relative">
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border-[12px] border-white">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800"
                  alt="SusthiO Digital Healthcare"
                  className="w-full h-[600px] object-cover scale-105 hover:scale-100 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-2xl z-20 max-w-[200px] animate-float">
                <p className="text-3xl font-black text-blue-600">100%</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Digital Records
                </p>
              </div>
            </div>

            {/* Right: Content Side */}
            <div className="lg:w-1/2">
              <h2 className="text-4xl lg:text-5xl font-black mb-12 text-slate-900 leading-tight tracking-tighter">
                আমাদের লক্ষ্য: ডিজিটাল <br /> স্বাস্থ্যসেবা প্রতিটি দ্বারে।
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
                {missionItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="mt-1 bg-white shadow-sm border border-slate-100 p-1.5 rounded-lg group-hover:bg-emerald-500 transition-colors duration-300">
                      <CheckCircle2
                        size={16}
                        className="text-emerald-500 group-hover:text-white transition-colors"
                      />
                    </div>
                    <div>
                      <h4 className="text-slate-900 font-bold text-base mb-1.5 tracking-tight">
                        {item.title}
                      </h4>
                      <p className="text-slate-500 text-xs leading-relaxed">
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

      {/* --- CTA --- */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="bg-slate-950 rounded-[4rem] p-12 lg:p-28 text-center text-white shadow-3xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-6xl font-black mb-8 tracking-tighter">
                মানুষের সেবায় প্রযুক্তির ছোঁয়া।
              </h2>
              <p className="text-slate-400 text-lg lg:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                আপনি কি একজন চিকিৎসক বা ক্লিনিক পরিচালক? আমাদের নেটওয়ার্কে
                যুক্ত হয়ে আপনার সেবাকে পৌঁছে দিন মানুষের হাতের মুঠোয়।
              </p>
              <div className="flex flex-wrap justify-center gap-5">
                <button className="bg-blue-600 text-white px-12 py-5 rounded-2xl font-black hover:bg-blue-700 hover:-translate-y-1 transition-all shadow-2xl shadow-blue-900/40">
                  পার্টনার হিসেবে যোগ দিন
                </button>
                <button className="bg-transparent text-white px-12 py-5 rounded-2xl font-black hover:bg-white/10 border-2 border-white/20 transition-all">
                  সাপোর্ট সেন্টার
                </button>
              </div>
            </div>
            {/* Dark Mode Accents */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutClient;
