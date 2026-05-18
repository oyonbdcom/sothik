// app/doctors/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function DoctorsLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm"
        >
          {/* Top Section - Fixed height (h-44) */}
          <div className="relative bg-slate-100 h-44 p-4 flex items-end justify-between shrink-0 animate-pulse">
            {/* Profile Image Skeleton */}
            <div className="relative w-28 h-28 rounded-2xl bg-slate-200 border-2 border-white shadow-lg" />

            {/* Availability Badge Skeleton */}
            <Skeleton className="h-6 w-20 rounded-full bg-slate-200" />

            {/* Verified Badge Skeleton Overlay */}
            <div className="absolute bottom-3 left-[104px]">
              <Skeleton className="h-6 w-6 rounded-full bg-slate-200 border border-slate-100" />
            </div>
          </div>

          {/* Body - Matches original p-4 and flex-1 */}
          <div className="p-4 flex flex-col flex-1 space-y-3">
            <div className="flex-1 space-y-3">
              {/* Name & Specialization */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4 bg-slate-100" /> {/* Name */}
                <Skeleton className="h-4 w-1/2 bg-slate-100" />{" "}
                {/* Specialization */}
                <Skeleton className="h-4 w-1/4 rounded-full bg-slate-50" />{" "}
                {/* Position */}
              </div>

              {/* Hospital Name */}
              <Skeleton className="h-4 w-2/3 bg-slate-100" />

              {/* Rating Section */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton
                        key={i}
                        className="h-3 w-3 rounded-full bg-slate-100"
                      />
                    ))}
                  </div>
                  <Skeleton className="h-4 w-6 bg-slate-100" />
                </div>
                <Skeleton className="h-4 w-16 bg-slate-100" />
              </div>
            </div>

            {/* Chambers Section Skeleton */}
            <div className="space-y-2 pt-1">
              <Skeleton className="h-3 w-24 bg-slate-100" />{" "}
              {/* "চেম্বার সমূহ" text */}
              <div className="flex flex-wrap gap-2">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 pr-2 py-1 pl-1 bg-slate-50 border border-slate-100 rounded-full"
                  >
                    <Skeleton className="h-6 w-6 rounded-full bg-slate-200" />
                    <Skeleton className="h-3 w-12 bg-slate-200" />
                  </div>
                ))}
              </div>
            </div>

            {/* Button Skeleton */}
            <Skeleton className="h-12 w-full rounded-lg bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
