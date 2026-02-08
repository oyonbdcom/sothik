"use client";

import { motion } from "framer-motion";

const termsData = [
  {
    step: "ধাপ ০১",
    title: "ডাক্তার নির্বাচন",
    text: "বিশেষজ্ঞ ডাক্তার, লোকেশন এবং তাদের ফি যাচাই করে আপনার পছন্দের ডাক্তার নির্বাচন করুন।",
  },
  {
    step: "ধাপ ০২",
    title: "বুকিং প্রক্রিয়া",
    text: "আপনার সুবিধাজনক সময় এবং তারিখ বেছে নিন। বুকিং কনফার্ম হলে আপনি একটি নিশ্চিতকরণ মেসেজ পাবেন।",
  },
  {
    step: "ধাপ ০৩",
    title: "ডিজিটাল রিপোর্ট",
    text: "আপনার সব মেডিকেল রিপোর্ট এবং প্রেসক্রিপশন আমাদের সুরক্ষিত সার্ভারে সংরক্ষিত থাকবে।",
  },
  {
    step: "অফার",
    title: "রিপোর্ট ডিসকাউন্ট",
    text: "আমাদের প্ল্যাটফর্ম থেকে অ্যাপয়েন্টমেন্ট নিলে পার্টনার ল্যাবগুলোতে ল্যাব টেস্টের ওপর বিশেষ ছাড় পাবেন।",
  },
];

export default function SimpleTerms() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-20">
        {/* Title */}
        <header className="mb-16">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            শর্তাবলী
          </h1>
          <div className="h-1 w-12 bg-blue-600 rounded-full" />
        </header>

        {/* List */}
        <div className="space-y-12">
          {termsData.map((item, index) => (
            <motion.section
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="relative pl-8 border-l border-slate-200 dark:border-slate-800">
                {/* Dot on line */}
                <div className="absolute left-[-5px] top-2 w-2.5 h-2.5 rounded-full bg-blue-600" />

                <div className="space-y-2">
                  <span className="text-xs font-bold text-blue-600 tracking-widest uppercase">
                    {item.step}
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            </motion.section>
          ))}
        </div>

        {/* Footer */}
      </div>
    </div>
  );
}
