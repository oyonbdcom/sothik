import { avatar, femaleAvatar } from "@/config/site";
import { IDoctorResponse } from "@/interface/doctor";
import { getDepartmentLabel } from "@/lib/utils/utils";
import Image from "next/image";
import Link from "next/link";

export default function FeaturedDoctors({
  doctors,
}: {
  doctors: IDoctorResponse[];
}) {
  const doctorStyles = [
    {
      gradient: "from-blue-100 to-blue-50",
      text: "text-blue-700",
      initBg: "bg-white",
      btn: "bg-blue-700 hover:bg-blue-800",
    },
    {
      gradient: "from-emerald-100 to-emerald-50",
      text: "text-emerald-700",
      initBg: "bg-white",
      btn: "bg-emerald-700 hover:bg-emerald-800",
    },
    {
      gradient: "from-rose-100 to-rose-50",
      text: "text-rose-700",
      initBg: "bg-white",
      btn: "bg-rose-700 hover:bg-rose-800",
    },
    {
      gradient: "from-amber-100 to-amber-50",
      text: "text-amber-700",
      initBg: "bg-white",
      btn: "bg-amber-700 hover:bg-amber-800",
    },
  ];

  return (
    <section className="bg-slate-50 py-16">
      <div className="container">
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
            const style = doctorStyles[i % doctorStyles.length];
            return (
              <div
                key={doc.id}
                className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md"
              >
                {/* Top colored section - Fixed height */}
                <div
                  className={`bg-gradient-to-br ${style.gradient} h-40 flex items-end justify-between p-4 relative shrink-0`}
                >
                  {/* Avatar */}
                  <div className="w-20 h-20 rounded-2xl shadow-lg border-2 border-white relative overflow-hidden bg-white">
                    <Image
                      src={
                        doc?.user?.image ||
                        (doc.gender === "MALE" ? avatar : femaleAvatar)
                      }
                      alt="doctor"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Available badge */}
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${doc.active ? "bg-white/90 text-green-700" : "bg-white/90 text-gray-500"}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${doc.active ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                    ></span>
                    {doc.active ? "উপলব্ধ" : "ব্যস্ত"}
                  </div>
                </div>

                {/* Body - Flex-1 makes this section grow to fill space */}
                <div className="p-4 flex flex-col flex-1">
                  {/* Info Wrapper - This holds the text and takes up available space */}
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">
                      {doc.user?.name}
                    </h3>
                    <p className="text-blue-700 text-xs font-semibold mt-0.5">
                      {getDepartmentLabel(doc.department)}
                    </p>
                    <p className="text-gray-700 font-medium text-[11px] leading-tight mt-2 line-clamp-2">
                      {doc.specialization}
                    </p>

                    <div className="flex items-center gap-3 mt-2.5 text-xs font-semibold text-slate-700">
                      <span className="flex items-center gap-1 line-clamp-1">
                        {doc.hospital}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-2">
                      <Stars rating={doc.averageRating} />
                      <span className="text-[11px] text-slate-700">
                        {doc.averageRating} (
                        {doc.reviewsCount.toLocaleString("bn")})
                      </span>
                    </div>
                  </div>

                  {/* CTA Section - mt-auto pushes it to the bottom */}
                  <div className="mt-auto pt-4">
                    <div className="w-full border-t border-slate-100 pt-3">
                      <Link
                        href={`/doctors/${doc.slug}`}
                        className="block w-full text-center bg-blue-600 py-3 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-sm"
                      >
                        বুক করুন
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
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
