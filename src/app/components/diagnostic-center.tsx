import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { avatar, femaleAvatar } from "@/config/site";
import { IClinicResponse } from "@/interface/clinic";
import Image from "next/image";
import Link from "next/link";

const doctorStyles = [
  {
    gradient: "from-blue-100 to-blue-50",
    text: "text-blue-700",
    color: "border-blue-200 bg-blue-50",
    btn: "bg-blue-700 hover:bg-blue-800",
  },
  {
    gradient: "from-emerald-100 to-emerald-50",
    text: "text-emerald-700",
    color: "border-emerald-200 bg-emerald-50",
    btn: "bg-emerald-700 hover:bg-emerald-800",
  },
  {
    gradient: "from-rose-100 to-rose-50",
    text: "text-rose-700",
    color: "border-orange-200 bg-orange-50",
    btn: "bg-rose-700 hover:bg-rose-800",
  },
];

export default function DiagnosticCenter({
  diagnostic,
}: {
  diagnostic: IClinicResponse[];
}) {
  const getInitials = (name: string) => {
    if (!name) return "";

    // Remove titles like "Dr." or "Prof." if they exist
    const cleanName = name.replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.)\s+/i, "");

    const parts = cleanName.trim().split(/\s+/);

    if (parts.length >= 2) {
      // Return first letter of first name and first letter of last name
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    // If only one name exists, return the first two letters
    return parts[0].slice(0, 2).toUpperCase();
  };

  return (
    <section className="container py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            শীর্ষ <span className="text-blue-700">ডায়াগনস্টিক সেন্টার</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            বিশ্বস্ত প্রতিষ্ঠানে সেরা চিকিৎসা সেবা
          </p>
        </div>
        <a
          href="#"
          className="text-sm font-semibold text-blue-700 hover:underline"
        >
          সব সেন্টার →
        </a>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {diagnostic?.slice(0, 3).map((center, i) => {
          const style = doctorStyles[i % doctorStyles.length];
          return (
            <div
              key={center.id}
              className={`card-hover rounded-2xl border-2 p-5 ${style.color} cursor-pointer`}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 text-2xl">
                  🏥
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 text-sm leading-tight">
                    {center.user?.name}
                  </h3>
                  <p className="text-slate-500 text-xs mt-1">
                    📍 {center.address},{center?.city}, {center?.district}
                  </p>
                  {/* <p className="text-blue-600 text-xs font-semibold mt-0.5">
                  🚗 {center.distance}
                </p> */}
                </div>
              </div>

              {/* Services */}
              <div className="mt-3">
                <h1 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  বিশেষজ্ঞ ডাক্তারগণ:
                </h1>

                <div className="flex flex-wrap items-center gap-2">
                  {/* CRITICAL: Wrap the entire loop in TooltipProvider */}
                  <TooltipProvider delayDuration={200}>
                    {center?.memberships?.map((s) => {
                      const doctorName = s?.doctor?.user?.name || "Unknown";

                      // Assuming your backend provides a 'profileImage' URL
                      const doctorImage = s?.doctor?.user?.image;

                      return (
                        <Tooltip key={s?.id}>
                          {/* 1. The Trigger: What you hover over */}
                          <TooltipTrigger asChild>
                            {/* Wrap Avatar in a div to handle hover interactions smoothly */}
                            <div className="group cursor-pointer">
                              <Avatar className="w-10 h-10 border-2 border-white shadow-sm transition-all group-hover:scale-105 group-hover:border-blue-400 group-hover:z-10">
                                {/* Show Image if it exists */}
                                <AvatarImage
                                  src={
                                    doctorImage ||
                                    "../../public/default-doctor.png"
                                  }
                                  alt={doctorName}
                                  className="object-cover"
                                />

                                {/* Fallback (Default): Show Initials if no image */}
                                <AvatarFallback className="bg-blue-50 text-blue-700 font-bold text-[10px] uppercase">
                                  <Image
                                    src={
                                      s.doctor?.gender === "MALE"
                                        ? avatar
                                        : femaleAvatar ||
                                          "../../public/default-doctor.png"
                                    }
                                    alt={doctorName}
                                    className="object-cover"
                                  />
                                </AvatarFallback>
                              </Avatar>
                            </div>
                          </TooltipTrigger>

                          {/* 2. The Content: What shows on hover */}
                          <TooltipContent
                            side="top"
                            className="bg-slate-900 text-white text-[10px] font-medium px-2 py-1 rounded shadow-xl border-none z-50"
                            // Added z-50 to ensure it's always on top
                          >
                            {doctorName}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </TooltipProvider>

                  {/* Count display logic remains the same */}
                  {center?.memberships && center?.memberships?.length > 5 && (
                    <span className="text-[10px] text-slate-400 font-semibold ml-1">
                      +{center?.memberships?.length - 5} আরও
                    </span>
                  )}
                </div>
              </div>

              {/* Meta */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-black/5">
                <div className="flex items-center gap-1.5">
                  {/* <Stars rating={center.rating} /> */}
                  <span className="text-xs text-slate-600 font-medium">
                    {center.averageRating}
                  </span>
                  <span className="text-xs text-slate-400">
                    ({center.reviewsCount.toLocaleString()})
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  {center.memberships?.length} জন ডাক্তার
                </span>
              </div>

              <div className="flex w-full">
                <Link
                  href={`/diagnostic/${center?.slug}`}
                  className="w-full mt-3 bg-white border text-center border-blue-200 text-blue-700 text-xs font-bold py-2.5 rounded-xl hover:bg-blue-700 hover:text-white transition-all"
                >
                  বিস্তারিত দেখুন →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
