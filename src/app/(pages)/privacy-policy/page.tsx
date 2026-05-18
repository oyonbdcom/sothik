"use client";

import { motion } from "framer-motion";

const policyData = [
  {
    title: "ব্যক্তিগত তথ্য সংগ্রহ",
    text: "আমরা আপনার নাম, ফোন নম্বর, ইমেইল এবং অ্যাপয়েন্টমেন্টের জন্য প্রয়োজনীয় প্রাথমিক স্বাস্থ্য তথ্য সংগ্রহ করি। এছাড়াও নিরবিচ্ছিন্ন সেবার লক্ষে আমরা আপনার ডিভাইসের ধরণ এবং আইপি অ্যাড্রেস সম্পর্কিত টেকনিক্যাল তথ্য সংগ্রহ করতে পারি।",
  },
  {
    title: "তথ্যের সঠিক ব্যবহার",
    text: "সংগৃহীত তথ্যগুলো মূলত সঠিক ডাক্তার নির্বাচন, অ্যাপয়েন্টমেন্ট নিশ্চিতকরণ এবং প্রেসক্রিপশন হিস্ট্রি সংরক্ষণের জন্য ব্যবহৃত হয়। এছাড়াও জরুরি প্রয়োজনে আপনার সাথে যোগাযোগ করতে এবং সেবার মান উন্নত করতে আমরা এই ডাটা ব্যবহার করি।",
  },
  {
    title: "ডাটা এনক্রিপশন ও সুরক্ষা",
    text: "আপনার সকল মেডিকেল এবং ব্যক্তিগত ডাটা আমাদের হাই-সিকিউর এনক্রিপ্টেড (End-to-End Encryption) সার্ভারে সংরক্ষিত থাকে। আমরা কঠোরভাবে 'Privacy First' নীতি অনুসরণ করি এবং ব্যবহারকারীর অনুমতি ছাড়া কোনো তথ্য তৃতীয় পক্ষের কাছে বিক্রি বা বিনিময় করি না।",
  },
  {
    title: "ইউজার কন্ট্রোল ও প্রাইভেসি",
    text: "আপনার ব্যক্তিগত তথ্যের ওপর আপনার পূর্ণ নিয়ন্ত্রণ রয়েছে। আপনি যেকোনো সময় আপনার প্রোফাইল আপডেট করতে পারেন। এছাড়াও আপনি চাইলে আপনার অ্যাকাউন্ট এবং সংশ্লিষ্ট সকল তথ্য আমাদের ডাটাবেজ থেকে স্থায়ীভাবে মুছে ফেলার (Data Erasure) অনুরোধ করতে পারেন।",
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
