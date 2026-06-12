/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMounted } from "@/hooks/use-mounted";
import { useAuth } from "@/hooks/useAuth";

import {
  useDeleteDiagnosticReviewMutation,
  useGetDiagnosticReviewsQuery,
} from "@/redux/api/diagnostic-reviewApi";
import {
  useDeleteDoctorReviewMutation,
  useGetTargetDoctorReviewsQuery,
} from "@/redux/api/doctor-reviewApi";
import { Edit2, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import Loader from "../loader";
import { Separator } from "../ui/separator";
import ReviewForm from "./review-form";

interface ReviewPageProps {
  targetId: string; // এটি doctorId অথবা diagId হবে
  type: "doctor" | "diagnostic"; // কোন টাইপের রিভিউ পেজ তা নির্ধারণ করবে
}

export default function ReviewPage({ targetId, type }: ReviewPageProps) {
  const { user } = useAuth();
  const [editingReview, setEditingReview] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const limit = 10;
  const formRef = useRef<HTMLDivElement>(null);

  // 🔄 টাইপ অনুযায়ী সঠিক রিডাক্স হুক ডাইনামিকালি কল করুন
  const doctorQuery = useGetTargetDoctorReviewsQuery(
    {
      doctorId: targetId,
      page,
      limit,
      status: "APPROVED",
      sortBy: "createdAt",
      sortOrder: "desc",
    },
    { skip: type !== "doctor" },
  );

  const diagnosticQuery = useGetDiagnosticReviewsQuery(
    {
      diagnosticId: targetId,
      page,
      limit,
      status: "APPROVED",
      sortBy: "createdAt",
      sortOrder: "desc",
    },
    { skip: type !== "diagnostic" },
  );

  // ডাইনামিক ডেটা এবং লোডিং স্টেট অ্যাসাইন করুন
  const queryResult = type === "doctor" ? doctorQuery : diagnosticQuery;
  const { data, isLoading, isFetching } = queryResult;

  // 🔄 ডাইনামিক ডিলিট মিউটেশন হুকস
  const [deleteDoctorReview] = useDeleteDoctorReviewMutation();
  const [deleteDiagnosticReview] = useDeleteDiagnosticReviewMutation();

  const reviews = data?.reviews || [];
  const meta = data?.meta;
  const mounted = useMounted();

  const onEdit = (review: any) => {
    setEditingReview(review);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const onDelete = async (reviewId: string) => {
    if (!window.confirm("আপনি কি নিশ্চিতভাবে এই রিভিউটি মুছে ফেলতে চান?"))
      return;

    setDeletingId(reviewId);
    try {
      if (type === "doctor") {
        await deleteDoctorReview(reviewId).unwrap();
      } else {
        await deleteDiagnosticReview(reviewId).unwrap();
      }
      toast.success("রিভিউটি মুছে ফেলা হয়েছে");
      if (editingReview?.id === reviewId) setEditingReview(null);
    } catch (err: any) {
      toast.error(err?.message || "রিভিউটি muche ফেলতে সমস্যা হয়েছে");
    } finally {
      setDeletingId(null);
    }
  };

  if (!mounted) return null;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section aria-labelledby="reviews-heading" className="space-y-8">
      {/* --- FORM SECTION --- */}
      <div className="transition-all duration-300">
        {editingReview ? (
          <div ref={formRef} className="bg-blue-50/50 rounded-[2rem] p-2">
            <div className="flex justify-between items-center mb-4 p-6 pb-2">
              <h3 className="text-lg font-bold text-blue-900">
                আপনার রিভিউ আপডেট করুন
              </h3>
              <button
                onClick={() => setEditingReview(null)}
                className="text-xs font-bold text-red-500 hover:underline uppercase tracking-widest"
              >
                বাতিল করুন
              </button>
            </div>
            <ReviewForm
              targetId={targetId}
              type={type}
              review={editingReview}
              setEditingReview={() => setEditingReview(null)}
            />
          </div>
        ) : (
          <ReviewForm targetId={targetId} type={type} />
        )}
        <Separator className="my-6" />
      </div>

      {/* --- REVIEWS LIST --- */}
      <div
        className={`space-y-4 divide-y divide-slate-100 ${
          isFetching ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {reviews.length === 0 && (
          <p className="text-center py-10 text-gray-400 italic">
            এখনো কোনো রিভিউ নেই। প্রথম রিভিউটি আপনিই লিখুন!
          </p>
        )}

        {reviews.map((review: any) => {
          const isOwner = user?.id === review.reviewer?.id;

          return (
            <article
              key={review?.id}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex gap-3">
                {/* Avatar */}
                <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-slate-100 mt-0.5">
                  {review.reviewer?.image ? (
                    <Image
                      src={review.reviewer.image}
                      alt={review.reviewer.name}
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] font-medium text-slate-500">
                      {review.reviewer?.name?.charAt(0) || "P"}
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-1.5">
                  {/* Header: Name, Date & Actions */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 leading-tight">
                        {review.reviewer?.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {new Date(review.createdAt).toLocaleDateString("bn-BD")}
                      </p>
                    </div>

                    {isOwner && (
                      <div className="flex items-center gap-0.5 -mt-1">
                        <button
                          onClick={() => onEdit(review)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => onDelete(review.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Stars */}
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={11}
                        fill={i < review.rating ? "currentColor" : "none"}
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {review.comment}
                  </p>

                  {/* Official Reply */}
                  {review.reply && (
                    <div className="bg-slate-50 border border-slate-100 px-3 py-2 rounded-lg mt-2">
                      <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-0.5">
                        Diagnostic Replay
                      </p>
                      <p className="text-sm text-slate-600">
                        {review.reply.content}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* --- PAGINATION --- */}
      {meta && meta.total > limit && (
        <nav
          aria-label="리뷰 ਨੇਵੀਗੇਸ਼ਨ"
          className="flex justify-center items-center gap-4 p-6"
        >
          <button
            disabled={page === 1 || isFetching}
            onClick={() => setPage((p) => p - 1)}
            className="px-5 py-2 text-sm font-bold bg-white border border-gray-200 rounded-full disabled:opacity-40 hover:border-blue-600 transition-all"
          >
            পূর্ববর্তী
          </button>
          <span className="text-sm font-bold text-gray-500">পৃষ্ঠা {page}</span>
          <button
            disabled={page * limit >= meta.total || isFetching}
            onClick={() => setPage((p) => p + 1)}
            className="px-5 py-2 text-sm font-bold bg-white border border-gray-200 rounded-full disabled:opacity-40 hover:border-blue-600 transition-all"
          >
            পরবর্তী
          </button>
        </nav>
      )}
    </section>
  );
}
