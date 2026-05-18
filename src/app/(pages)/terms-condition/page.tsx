"use client";

import { motion } from "framer-motion";
const policyData = [
  {
    title: "ব্যক্তিগত তথ্য সংগ্রহ",
    text: "আমরা আপনার নাম, ফোন নম্বর এবং অ্যাপয়েন্টমেন্টের জন্য প্রয়োজনীয় প্রাথমিক স্বাস্থ্য তথ্য সংগ্রহ করি। আমাদের লক্ষ্য হচ্ছে আপনাকে সঠিক ডাক্তার এবং ক্লিনিকের সাথে যুক্ত করে দেওয়া।",
  },
  {
    title: "তথ্যের সঠিক ব্যবহার",
    text: "সংগৃহীত তথ্যগুলো শুধুমাত্র সঠিক ডাক্তার নির্বাচন এবং অ্যাপয়েন্টমেন্ট নিশ্চিত করার কাজে ব্যবহার করা হয়। আমরা আপনার অনুমতি ছাড়া কোনো তথ্য তৃতীয় পক্ষের কাছে প্রকাশ বা বিক্রয় করি না।",
  },
  {
    title: "সম্পূর্ণ ফ্রি সার্ভিস",
    text: "আমাদের এই প্ল্যাটফর্মটি ব্যবহার করার জন্য আমরা রোগীর থেকে কোনো প্রকার পেমেন্ট বা সার্ভিস চার্জ গ্রহণ করি না। আপনার ডাটা আমাদের কাছে আমানতস্বরূপ।",
  },
  {
    title: "ডাটা এনক্রিপশন ও সুরক্ষা",
    text: "আপনার সকল মেডিকেল ডাটা আমাদের হাই-সিকিউর এনক্রিপ্টেড সার্ভারে সংরক্ষিত থাকে। আমরা সর্বোচ্চ গুরুত্ব দিয়ে আপনার তথ্যের গোপনীয়তা বজায় রাখি।",
  },
  {
    title: "আপনার নিয়ন্ত্রণ",
    text: "আপনার ব্যক্তিগত তথ্যের ওপর আপনার পূর্ণ নিয়ন্ত্রণ রয়েছে। আপনি যেকোনো সময় আপনার প্রোফাইল আপডেট অথবা ডাটাবেজ থেকে একাউন্ট মুছে ফেলার অনুরোধ করতে পারেন।",
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
          {policyData.map((item, index) => (
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
