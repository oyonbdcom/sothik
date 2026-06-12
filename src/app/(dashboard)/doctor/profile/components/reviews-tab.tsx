import { RatingField } from "@/components/ui/rating";
import { Doctor } from "@/interface/doctor";
import { useGetTargetDoctorReviewsQuery } from "@/redux/api/doctor-reviewApi";
import { useState } from "react";
import { Avatar } from "../page";
import { SectionCard } from "./section";

export default function ReviewsTab({ doctor }: { doctor: Doctor }) {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useGetTargetDoctorReviewsQuery({
    doctorId: doctor?.id,
    page,
    limit,
    status: "APPROVED",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const reviews = data?.reviews || [];
  console.log(data);
  return (
    <div>
      {" "}
      <div className="space-y-4">
        <SectionCard title={null} icon={""}>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-5xl font-bold text-gray-900">
                {doctor.averageRating}
              </p>
              <RatingField readOnly value={doctor.averageRating} />
              <p className="text-xs text-gray-400 mt-1">
                {doctor.reviewsCount} reviews
              </p>
            </div>
            <div className="flex-1 space-y-1.5">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews?.filter((r) => r.rating === star).length;
                const pct = Math.round((count / reviews?.length) * 100) || 0;
                return (
                  <div key={star} className="flex items-center gap-2 text-xs">
                    <span className="text-gray-400 w-3">{star}</span>
                    <span className="text-amber-400 text-xs">★</span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-gray-400 w-6 text-right">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </SectionCard>

        {reviews &&
          reviews.map((r) => (
            <div
              key={r.id}
              className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <Avatar
                  name={r.reviewer?.name}
                  size="md"
                  image={r.reviewer?.image || ""}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-800">
                      {r.reviewer?.name}
                    </p>
                    <span className="text-xs text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <RatingField readOnly value={r.rating} size={10} />
                  <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">
                    {r.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
