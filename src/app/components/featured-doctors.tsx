import { IDoctorResponse } from "@/interface/doctor";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import DoctorGridCard from "../(pages)/doctors/components/search-doctor-card";

export default function FeaturedDoctors({
  doctors,
}: {
  doctors: IDoctorResponse[];
}) {
  return (
    <section className="bg-slate-50 py-14   ">
      <div className="container  ">
        {/* header */}
        <div className="mb-8 lg:mb-12 flex items-end justify-between gap-4">
          <div className="max-w-lg">
            <h2 className="text-2xl lg:text-3xl font-black leading-tight text-slate-900 dark:text-white">
              বিশেষজ্ঞ <span className="text-blue-700">ডাক্তারগণ</span>
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
              দিনাজপুরের অভিজ্ঞ ও বিশ্বস্ত চিকিৎসকদের খুঁজুন সহজেই।
            </p>
          </div>
          <Link
            href="/doctors"
            className="group flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 transition-all"
          >
            সব দেখুন
            <ChevronRight
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* doctor grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {doctors.map((doc) => (
            <DoctorGridCard doctor={doc} key={doc?.slug} />
          ))}
        </div>

        {/* mobile button */}
        <div className="mt-8 flex justify-center md:hidden">
          <Link
            href="/doctors"
            className="rounded-2xl bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-800"
          >
            সব ডাক্তার দেখুন
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 rounded-full bg-amber-50 px-2 py-1 dark:bg-amber-500/10">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`h-3.5 w-3.5 ${
            s <= Math.round(rating)
              ? "text-amber-400"
              : "text-slate-200 dark:text-slate-700"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}
