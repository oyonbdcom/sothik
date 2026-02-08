"use client";
import work from "@/public/images/work-img.png";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function Summary() {
  const steps = [
    {
      icon: "heroicons:magnifying-glass-20-solid",
      title: "বিশেষজ্ঞ ডাক্তার খুঁজুন",
      text: "আপনার সমস্যা অনুযায়ী বিশেষজ্ঞ ডাক্তার, লোকেশন এবং রেটিং দেখে সহজেই নির্বাচন করুন।",
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
    },
    {
      icon: "heroicons:calendar-days-20-solid",
      title: "সহজেই অ্যাপয়েন্টমেন্ট নিন",
      text: "আপনার সুবিধাজনক সময় এবং তারিখ বেছে নিয়ে কয়েক সেকেন্ডের মধ্যেই বুকিং সম্পন্ন করুন।",
      color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600",
    },
    {
      icon: "heroicons:clipboard-document-check-20-solid",
      title: "ডিজিটাল প্রেসক্রিপশন ও হিস্ট্রি",
      text: "আপনার সব মেডিকেল রিপোর্ট এবং প্রেসক্রিপশন অনলাইনে সংরক্ষণ করুন এবং যেকোনো সময় দেখুন।",
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-950 dark:to-slate-900 py-16 lg:py-24">
      {/* Header */}
      <div className="container text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            সেবা নেওয়ার <span className="text-blue-600">সহজ ধাপসমূহ</span>
          </h2>
          <div className="h-1.5 w-20 bg-blue-600 mx-auto rounded-full mb-8" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            {" "}
            আমাদের প্ল্যাটফর্ম ব্যবহার করে আপনি খুব সহজেই বিশেষজ্ঞ ডাক্তারদের
            খুঁজে পেতে পারেন এবং আপনার স্বাস্থ্যসেবা পরিচালনা করতে পারেন ডিজিটাল
            পদ্ধতিতে।
          </p>
        </motion.div>
      </div>

      <div className="container grid lg:grid-cols-2 gap-12 items-center">
        {/* Image Section with Floating Animation */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative z-10 flex items-center justify-center">
            <Image
              src={work}
              width={550}
              height={550}
              alt="Healthcare Process"
              className="object-contain max-h-[450px] drop-shadow-2xl"
              priority
            />
          </div>
          {/* Decorative Background Element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-400/20 blur-[100px] rounded-full -z-10" />
        </motion.div>

        {/* Content Section */}
        <div className="space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="group flex flex-col md:flex-row items-start gap-6 p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-blue-100 dark:hover:border-blue-900/30 transition-all duration-300">
                {/* Icon Box */}
                <div
                  className={`flex-shrink-0 w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-inner`}
                >
                  <Icon icon={step.icon} className="w-7 h-7" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                      ধাপ ০{index + 1}
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {step.text}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
