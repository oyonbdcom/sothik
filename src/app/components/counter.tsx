"use client";

import { Icon } from "@iconify/react";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

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
        if (progress < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

export default function AchievementStats() {
  return (
    <section className="relative overflow-hidden bg-white py-14  dark:bg-slate-950">
      {/* Background Decor - Mesh Gradient Effect */}
      <div className="absolute -top-[10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[#06B6D4]/5 blur-[120px] dark:bg-[#06B6D4]/10" />
      <div className="absolute -bottom-[10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-[#1A237E]/5 blur-[120px] dark:bg-[#1A237E]/10" />

      <div className="container relative z-10 mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8 lg:mb-12 text-start">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-2xl lg:text-3xl font-black leading-tight text-slate-900"
          >
            ডিজিটাল স্বাস্থ্যসেবায় আমাদের <br className="hidden md:block" />
            <span className="text-[#1A237E]">বর্তমান অবস্থান</span>
          </motion.h2>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-xs font-bold uppercase tracking-[0.3em] text-[#06B6D4]"
          >
            নির্ভরযোগ্যতার প্রমাণ
          </motion.span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.1,
                duration: 0.6,
                ease: "easeOut",
              }}
              className="group"
            >
              <div className="relative h-full overflow-hidden rounded-[2rem] border border-slate-100 bg-white/80 p-8 transition-all duration-500 hover:-translate-y-2 hover:border-transparent hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:border-slate-800 dark:bg-slate-900/50 backdrop-blur-xl">
                {/* Hover Background Accent */}
                <div
                  className={`absolute -right-8 -top-8 h-32 w-32 rounded-full ${stat.bgColor} opacity-0 transition-all duration-500 group-hover:scale-150 group-hover:opacity-20`}
                />

                {/* Icon Layout */}
                <div className="relative z-10 mb-8 flex items-center justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${stat.bgColor} ${stat.color} transition-all duration-500 group-hover:rotate-6 group-hover:scale-110`}
                  >
                    <Icon icon={stat.icon} className="h-8 w-8" />
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-300 dark:text-slate-600">
                    {stat.id.toString().padStart(2, "0")}
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <div className="mb-1 flex items-baseline gap-1">
                    <span className="text-4xl font-black tracking-tight text-slate-900 dark:text-white lg:text-5xl">
                      <Counter value={stat.value} />
                    </span>
                    <span className={`text-xl font-bold ${stat.color}`}>
                      {stat.suffix}
                    </span>
                  </div>

                  <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </h3>

                  {/* Refined Progress Bar */}
                  <div className="relative h-[6px] w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <motion.div
                      initial={{ x: "-100%" }}
                      whileInView={{ x: "0%" }}
                      transition={{
                        duration: 1.5,
                        delay: 0.5,
                        ease: "circOut",
                      }}
                      className={`absolute inset-0 h-full w-[70%] rounded-full bg-gradient-to-r from-transparent via-current to-current ${stat.color}`}
                    />
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
    icon: "solar:user-speak-bold-duotone",
    color: "text-[#1A237E]",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/30",
  },
  {
    id: 2,
    label: "সন্তুষ্ট পেশেন্ট",
    value: 1000,
    suffix: "+",
    icon: "solar:heart-pulse-bold-duotone",
    color: "text-[#06B6D4]",
    bgColor: "bg-cyan-50 dark:bg-cyan-900/30",
  },
  {
    id: 3,
    label: "অ্যাক্টিভ চেম্বার",
    value: 50,
    suffix: "+",
    icon: "solar:hospital-bold-duotone",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/30",
  },
  {
    id: 4,
    label: "স্পেশালাইজড বিভাগ",
    value: 28,
    suffix: "+",
    icon: "solar:medical-kit-bold-duotone",
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-900/30",
  },
];
