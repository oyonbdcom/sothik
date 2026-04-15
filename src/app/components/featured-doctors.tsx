import { IDoctorResponse } from "@/interface/doctor";
import Link from "next/link";
import DoctorGridCard from "../(pages)/doctors/components/search-doctor-card";

export default function FeaturedDoctors({
  doctors,
}: {
  doctors: IDoctorResponse[];
}) {
  return (
    <section className="bg-slate-50 py-16 ">
      <div className="container px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              বিশেষজ্ঞ <span className="text-blue-700">ডাক্তারগণ</span>
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              ঢাকাসহ সারাদেশের শীর্ষস্থানীয় চিকিৎসকরা
            </p>
          </div>
          <Link
            href="/doctors"
            className="text-sm font-semibold text-blue-700 hover:underline"
          >
            সব ডাক্তার →
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {doctors.map((doc, i) => {
            return <DoctorGridCard key={doc.id} doctor={doc} />;
          })}
        </div>
      </div>
    </section>
  );
}
export function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}
