import { IDoctorResponse } from "@/interface/doctor";
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
        <div className="mb-10 flex items-end justify-between gap-4">
          <div className="max-w-lg">
            <span className="mb-3 inline-flex rounded-full bg-blue-50 px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
              Featured Doctors
            </span>

            <h2 className="text-3xl font-black leading-tight text-slate-900 dark:text-white">
              বিশেষজ্ঞ <span className="text-blue-700">ডাক্তারগণ</span>
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
              ঢাকাসহ সারাদেশের অভিজ্ঞ ও বিশ্বস্ত চিকিৎসকদের খুঁজুন সহজেই।
            </p>
          </div>

          <Link
            href="/doctors"
            className="hidden rounded-2xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition-all hover:border-blue-200 hover:text-blue-700 md:flex dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            সব ডাক্তার →
          </Link>
        </div>

        {/* doctor grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {doctors.map((doc) => (
            <div key={doc.id} className="h-full">
              <DoctorGridCard doctor={doc} />
            </div>
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
