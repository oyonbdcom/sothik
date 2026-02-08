"use client";

import { motion } from "framer-motion";

const policyData = [
  {
    title: "তথ্য সংগ্রহ",
    text: "আমরা আপনার নাম, ফোন নম্বর এবং অ্যাপয়েন্টমেন্টের প্রয়োজনীয় স্বাস্থ্য সংক্রান্ত তথ্য সংগ্রহ করি।",
  },
  {
    title: "তথ্যের ব্যবহার",
    text: "সংগৃহীত তথ্যগুলো শুধুমাত্র ডাক্তার নির্বাচন এবং অ্যাপয়েন্টমেন্ট নিশ্চিত করার কাজে ব্যবহার করা হয়।",
  },
  {
    title: "তথ্য সুরক্ষা",
    text: "আপনার সকল মেডিকেল ডাটা আমাদের এনক্রিপ্টেড সার্ভারে সংরক্ষিত থাকে, যা তৃতীয় কোনো পক্ষের কাছে প্রকাশ করা হয় না।",
  },
  {
    title: "আপনার নিয়ন্ত্রণ",
    text: "আপনি যেকোনো সময় আপনার প্রোফাইল থেকে ব্যক্তিগত তথ্য আপডেট অথবা একাউন্ট মুছে ফেলার অনুরোধ করতে পারেন।",
  },
];

export default function SimplePrivacy() {
  return (
    <div className="bg-white dark:bg-slate-950 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-20">
        {/* Title */}
        <header className="mb-16">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            গোপনীয়তা নীতি
          </h1>
          <div className="h-1 w-12 bg-blue-600 rounded-full" />
        </header>

        {/* List Section */}
        <div className="space-y-12">
          {policyData.map((item, index) => (
            <motion.section
              key={index}
              initial={{ opacity: 0, x: -5 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative pl-8 border-l border-slate-200 dark:border-slate-800">
                {/* Dot on line */}
                <div className="absolute left-[-5.5px] top-2 w-2.5 h-2.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]" />

                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base font-medium">
                    {item.text}
                  </p>
                </div>
              </div>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
}
