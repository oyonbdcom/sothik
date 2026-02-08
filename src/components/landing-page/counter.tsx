"use client";

import { Icon } from "@iconify/react";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// কাউন্টার অ্যানিমেশন লজিক (একটু উন্নত করা হয়েছে)
const Counter = ({
  value,
  duration = 2,
}: {
  value: number;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min(
          (timestamp - startTimestamp) / (duration * 1000),
          1,
        );
        setCount(Math.floor(progress * value));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

export default function AchievementStats() {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-50/50 dark:bg-slate-950">
      {/* গ্লোয়িং ব্যাকগ্রাউন্ড এলিমেন্টস */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full -z-10" />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="group relative h-full">
                {/* কার্ডের পেছনে ডাইনামিক বর্ডার গ্লো */}
                <div
                  className={`absolute -inset-[1px] rounded-[2.5rem] bg-gradient-to-br from-slate-200 to-transparent dark:from-slate-800 dark:to-transparent group-hover:from-blue-500/50 transition-all duration-500`}
                />

                <div className="relative h-full p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none overflow-hidden flex flex-col items-center sm:items-start text-center sm:text-left transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-blue-500/10">
                  {/* আইকন বক্স - একটু রিফাইন করা হয়েছে */}
                  <div className="relative mb-8">
                    <div
                      className={`w-16 h-16 ${stat.bgColor} ${stat.color} rounded-2xl flex items-center justify-center relative z-10 transform group-hover:scale-110 group-hover:rotate-[10deg] transition-all duration-500 ease-out`}
                    >
                      <Icon icon={stat.icon} className="w-9 h-9" />
                    </div>
                    {/* আইকনের পেছনে ছোট শ্যাডো এলিমেন্ট */}
                    <div
                      className={`absolute inset-0 blur-xl ${stat.bgColor} opacity-0 group-hover:opacity-60 transition-opacity duration-500`}
                    />
                  </div>

                  {/* ভ্যালু ও সাফিক্স */}
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      <Counter value={stat.value} />
                    </span>
                    <span
                      className={`text-2xl font-bold ${stat.color} opacity-80`}
                    >
                      {stat.suffix}
                    </span>
                  </div>

                  {/* লেবেল */}
                  <h3 className="text-sm md:text-base font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">
                    {stat.label}
                  </h3>

                  {/* ইন্টারেক্টিভ প্রগ্রেস লাইন */}
                  <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "40%" }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 1 }}
                    >
                      {" "}
                      <div
                        className={`h-full bg-gradient-to-r from-transparent to-current ${stat.color}`}
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const stats = [
  {
    id: 1,
    label: "নিবন্ধিত ডাক্তার",
    value: 100,
    suffix: "+",
    icon: "healthicons:doctor-male-outline",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    id: 2,
    label: "সন্তুষ্ট পেশেন্ট",
    value: 4500,
    suffix: "+",
    icon: "healthicons:people-outline",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  {
    id: 3,
    label: "অ্যাক্টিভ চেম্বার",
    value: 70,
    suffix: "+",
    icon: "healthicons:city-outline",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    id: 4,
    label: "স্পেশালাইজড বিভাগ",
    value: 28,
    suffix: "+",
    icon: "healthicons:ambulatory-clinic-outline",
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
  },
];
