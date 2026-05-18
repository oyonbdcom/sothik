/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetFeedbacksQuery } from "@/redux/api/reviewApi";
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
                  <div className="flex h-full min-h-[260px] flex-col rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
                    {/* quote */}
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-2xl font-serif text-blue-600 dark:bg-blue-500/10">
                      &quot;
                    </div>

                    {/* comment */}
                    <p className="flex-1 text-sm italic leading-7 text-slate-600 line-clamp-5 dark:text-slate-300">
                      {t.comment}
                    </p>

                    {/* stars */}
                    <div className="mt-4 flex items-center gap-1">
                      {[...Array(t.rating)].map((_, i) => (
                        <span key={i} className="text-sm text-amber-400">
                          ⭐
                        </span>
                      ))}
                    </div>

                    {/* footer */}
                    <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-black text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                        {t.patient?.name?.charAt(0) || "U"}
                      </div>

                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-bold text-slate-800 dark:text-white">
                          {t.patient?.name || "Anonymous"}
                        </h4>

                        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                          Patient Review
                        </p>
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
