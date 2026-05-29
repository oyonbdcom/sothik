/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { RatingField } from "@/components/ui/rating";
import { useGetFeedbacksQuery } from "@/redux/api/feedback";

import "swiper/css";
import "swiper/css/pagination";

import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Testimonial() {
  const { data, isLoading } = useGetFeedbacksQuery(undefined);

  const feedbacks = data?.data || [];

  return (
    <section className="overflow-hidden bg-slate-50 py-16 dark:bg-transparent">
      <div className="container mx-auto px-4 sm:px-6">
        {/* HEADER */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl dark:text-white">
            রোগীদের <span className="text-blue-700">অভিজ্ঞতা</span>
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
            বাস্তব রোগীদের মতামত ও অভিজ্ঞতা
          </p>
        </div>

        {/* LOADING */}
        {isLoading ? (
          <div className="flex h-40 items-center justify-center text-slate-500">
            Loading testimonials...
          </div>
        ) : (
          <Swiper
            className="testimonial-swiper !pb-14"
            spaceBetween={16}
            slidesPerView={1}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            modules={[Autoplay, Pagination]}
          >
            {feedbacks.length === 0 ? (
              <div className="py-20 text-center text-slate-400">
                No feedback found
              </div>
            ) : (
              feedbacks.map((t: any) => (
                <SwiperSlide key={t.id} className="h-auto">
                  <div className="group relative flex h-full min-h-[280px] flex-col rounded-[2rem] border border-slate-200 bg-white p-6 transition-all duration-300 hover:border-[#06B6D4]/30 hover:shadow-xl hover:shadow-cyan-500/5">
                    {/* Decorative Background Accent */}
                    <div className="absolute top-0 right-0 -mr-2 -mt-2 h-20 w-20 rounded-full bg-slate-50 opacity-0 transition-opacity group-hover:opacity-100" />

                    {/* Header: Quote Icon & Rating */}
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A237E]/5 text-[#1A237E]">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12C14.017 12.5523 13.5693 13 13.017 13H11.017C10.4647 13 10.017 12.5523 10.017 12V5C10.017 4.44772 10.4647 4 11.017 4H20.017C21.1216 4 22.017 4.89543 22.017 6V15C22.017 17.2091 20.2261 19 18.017 19H14.017V21H14.017ZM2.017 21L2.017 18C2.017 16.8954 2.91243 16 4.017 16H7.017C7.56928 16 8.017 15.5523 8.017 15V9C8.017 8.44772 7.56928 8 7.017 8H3.017C2.46472 8 2.017 8.44772 2.017 9V12C2.017 12.5523 1.56928 13 1.017 13H-0.983C-1.53528 13 -1.983 12.5523 -1.983 12V5C-1.983 4.44772 -1.53528 4 -0.983 4H7.017C8.12157 4 9.017 4.89543 9.017 6V15C9.017 17.2091 7.22614 19 5.017 19H2.017V21H2.017Z" />
                        </svg>
                      </div>
                      <div className="flex scale-90">
                        <RatingField value={t?.rating} readOnly />
                      </div>
                    </div>

                    {/* Comment Section */}
                    <div className="relative flex-1">
                      <p className="text-[15px] font-medium italic leading-relaxed text-slate-700 line-clamp-4">
                        &ldquo;{t.comment}&rdquo;
                      </p>
                    </div>

                    {/* Profile Footer */}
                    <div className="mt-8 flex items-center gap-4">
                      <div className="relative h-12 w-12 shrink-0">
                        <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-[#1A237E] to-[#283593] text-sm font-bold text-white shadow-lg shadow-indigo-100">
                          {t.patient?.name?.charAt(0) || "U"}
                        </div>
                        {/* Verified Badge */}
                        <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#06B6D4] text-white">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            className="h-2.5 w-2.5"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                      </div>

                      <div className="min-w-0">
                        <h4 className="truncate text-[15px] font-bold text-[#1A237E]">
                          {t.patient?.name || "Anonymous"}
                        </h4>
                        <div className="flex items-center gap-1.5">
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#06B6D4]"></span>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            Verified Patient
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))
            )}
          </Swiper>
        )}
      </div>

      {/* swiper style */}
      <style jsx global>{`
        .testimonial-swiper .swiper-pagination {
          bottom: 0 !important;
        }

        .testimonial-swiper .swiper-pagination-bullet {
          background: #cbd5e1;
          opacity: 1;
          transition: all 0.3s ease;
        }

        .testimonial-swiper .swiper-pagination-bullet-active {
          background: #2563eb !important;
          width: 22px;
          border-radius: 999px;
        }
      `}</style>
    </section>
  );
}
