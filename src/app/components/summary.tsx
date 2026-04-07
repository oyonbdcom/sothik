"use client";
import work from "@/public/images/work-img.png";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Summary() {
  const steps = [
    {
      icon: "solar:minimalistic-magnifer-bold",
      title: "বিশেষজ্ঞ  ডাক্তার খুঁজুন",
      text: "আপনার সমস্যা অনুযায়ী বিশেষজ্ঞ ডাক্তার, লোকেশন এবং রেটিং দেখে সহজেই নির্বাচন করুন।",
      color: "bg-blue-600 dark:bg-blue-500",
      lightBg: "bg-blue-50 dark:bg-blue-900/20",
      stepColor: "text-blue-600 bg-blue-50 dark:bg-blue-900/40",
    },
    {
      icon: "solar:calendar-date-bold",
      title: "সহজেই অ্যাপয়েন্টমেন্ট নিন",
      text: "আপনার সুবিধাজনক সময় এবং তারিখ বেছে নিয়ে কয়েক সেকেন্ডের মধ্যেই বুকিং সম্পন্ন করুন।",
      color: "bg-indigo-600 dark:bg-indigo-500",
      lightBg: "bg-indigo-50 dark:bg-indigo-900/20",
      stepColor: "text-indigo-600 bg-indigo-50 dark:bg-indigo-900/40",
    },
    {
      icon: "solar:document-medicine-bold",
      title: "ডিজিটাল প্রেসক্রিপশন ও হিস্ট্রি",
      text: "আপনার সব মেডিকেল রিপোর্ট এবং প্রেসক্রিপশন অনলাইনে সংরক্ষণ করুন এবং যেকোনো সময় দেখুন।",
      color: "bg-emerald-600 dark:bg-emerald-500",
      lightBg: "bg-emerald-50 dark:bg-emerald-900/20",
      stepColor: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/40",
    },
  ];

  return (
    <section className="relative bg-[#FAFBFF] dark:bg-slate-950  overflow-hidden">
      {/* Background Decorative Blur */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 dark:bg-blue-900/10 blur-[120px] rounded-full -mr-64 -mt-64" />

      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
              সেবা নেওয়ার{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                সহজ ধাপসমূহ
              </span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
              আমাদের প্ল্যাটফর্ম ব্যবহার করে আপনি খুব সহজেই বিশেষজ্ঞ ডাক্তারদের
              খুঁজে পেতে পারেন এবং ডিজিটাল পদ্ধতিতে স্বাস্থ্যসেবা গ্রহণ করতে
              পারেন।
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <div className="relative z-10 bg-white dark:bg-slate-900 p-4 rounded-[3rem] shadow-2xl shadow-blue-200/20 dark:shadow-none border border-white dark:border-slate-800">
                <Image
                  src={work}
                  width={600}
                  height={600}
                  alt="Healthcare Process"
                  className="rounded-[2.5rem] object-cover w-full h-auto"
                  priority
                />
              </div>
              {/* Animated Ring Decor */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-600/10 blur-3xl rounded-full animate-pulse" />
            </div>
          </motion.div>

          {/* Steps Section */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <div className="group flex items-center gap-6 p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] hover:border-blue-200 dark:hover:border-blue-900/40">
                  {/* Icon Box with Solid Color */}
                  <div
                    className={`flex-shrink-0 w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center text-white transform group-hover:rotate-6 transition-all duration-500 shadow-lg shadow-blue-500/20`}
                  >
                    <Icon icon={step.icon} className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${step.stepColor}`}
                      >
                        ধাপ ০{index + 1}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-sm">
                      {step.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
