"use client";

import { doctorDepartments } from "@/constant/common";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Link from "next/link";
import "swiper/css";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const SpecialtiesCarousel = () => {
  return (
    <motion.section>
      <div className=" bg-slate-50/50 pt-16">
        <div className="container mx-auto px-4 ">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
                আমাদের বিশেষায়িত{" "}
                <span className="text-blue-600">বিভাগসমূহ</span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                অভিজ্ঞ এবং বিশেষজ্ঞ ডাক্তারদের মাধ্যমে আপনার প্রয়োজন অনুযায়ী
                সেরা চিকিৎসা সেবা নিশ্চিত করুন।
              </p>
            </motion.div>
          </div>

          {/* Carousel */}
          <div className="relative">
            <Swiper
              slidesPerView={1}
              spaceBetween={25}
              speed={800}
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              navigation={{
                prevEl: ".specialty-prev",
                nextEl: ".specialty-next",
              }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 3 },
              }}
              modules={[Navigation, Autoplay]}
              className="!py-10"
            >
              {doctorDepartments.map((item) => (
                <SwiperSlide key={item.value} className="">
                  <Link
                    href={`/doctors?department=${item.value}`}
                    className="group block h-full px-2"
                  >
                    <div className="relative h-full bg-white dark:bg-slate-900/50 rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center transition-all duration-500 hover:border-blue-500/50 hover:bg-gradient-to-b hover:from-white hover:to-blue-50/50 dark:hover:to-blue-900/10 group-hover:-translate-y-3">
                      {/* মডার্ন ব্যাকগ্রাউন্ড ডেকোরেশন */}
                      <div className="absolute top-0 right-0 -mr-2 -mt-2 h-20 w-20 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500" />

                      {/* আইকন বক্স - নিউমর্ফিজম টাচ */}
                      <div className="relative flex items-center justify-center h-20 w-20 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 text-blue-600 mb-6 shadow-inner group-hover:scale-110 group-hover:rotate-6 group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all duration-500">
                        <Icon
                          icon={item.icon || "healthicons:doctor-neonatal"}
                          className="w-12 h-12 drop-shadow-sm"
                        />

                        {/* একটি ছোট ডট অ্যানিমেশন */}
                        <span className="absolute top-0 right-0 h-3 w-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      {/* টেক্সট কন্টেন্ট */}
                      <div className="flex-grow">
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-blue-600 transition-colors">
                          {item.label}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-4 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          সেরা চিকিৎসকদের অ্যাপয়েন্টমেন্ট
                        </p>
                      </div>

                      {/* অ্যাকশন বাটন - ক্লিন লুক */}
                      <div className="mt-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-slate-50 dark:bg-slate-800 text-blue-600 group-hover:bg-blue-600 group-hover:text-white font-bold text-sm transition-all duration-300">
                        <span>খুঁজুন</span>
                        <Icon
                          icon="heroicons:arrow-right-20-solid"
                          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Navigation - Improved UI */}
            <button className="specialty-prev absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all border border-slate-100 dark:border-slate-700">
              <Icon
                icon="heroicons:chevron-left-20-solid"
                className="w-6 h-6"
              />
            </button>

            <button className="specialty-next absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all border border-slate-100 dark:border-slate-700">
              <Icon
                icon="heroicons:chevron-right-20-solid"
                className="w-6 h-6"
              />
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default SpecialtiesCarousel;
