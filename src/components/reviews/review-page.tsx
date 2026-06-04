/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMounted } from "@/hooks/use-mounted";
import { useAuth } from "@/hooks/useAuth";

import {
  useDeleteDiagnosticReviewMutation,
  useGetTargetDiagnosticReviewsQuery,
} from "@/redux/api/diagnostic-reviewApi";
import {
  useDeleteDoctorReviewMutation,
  useGetTargetDoctorReviewsQuery,
} from "@/redux/api/doctor-reviewApi";
import { CheckCircle2, Edit2, Loader2, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
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

  const diagnosticQuery = useGetTargetDiagnosticReviewsQuery(
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
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="mt-4 text-gray-500">
          {type === "doctor" ? "ডক্টরের" : "ক্লিনিকের"} রিভিউ লোড হচ্ছে...
        </p>
      </div>
    );
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
            <article key={review.id} className="group relative bg-white pt-5">
              <div className="flex gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0 h-12 w-12">
                  {review.reviewer?.image ? (
                    <Image
                      src={review.reviewer.image}
                      alt={review.reviewer.name}
                      fill
                      className="rounded-full object-cover ring-2 ring-gray-100"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                      {review.reviewer?.name?.charAt(0) || "P"}
                    </div>
                  )}
                </div>

                {/* Info & Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-base leading-tight truncate">
                        {review.reviewer?.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <time className="text-xs text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString(
                            "bn-BD",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </time>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {isOwner && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <button
                          onClick={() => onEdit(review)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit review"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          disabled={deletingId === review.id}
                          onClick={() => onDelete(review.id)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="Delete review"
                        >
                          {deletingId === review.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Rating Stars */}
                  <div className="flex text-amber-400 mt-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < review.rating ? "currentColor" : "none"}
                        stroke="currentColor"
                      />
                    ))}
                  </div>

                  {/* Comment Text */}
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {review.comment}
                  </p>
                </div>
              </div>

              {/* 🔥 ফিক্সড অফিশিয়াল রিপ্লাই সেকশন (Prisma স্কিমা অনুযায়ী `review.reply` চেক হবে) */}
              {review.reply && (
                <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border-t border-blue-100 ml-16 rounded-2xl px-5 py-4 mt-2">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                          Official Response{" "}
                          {type === "diagnostic" ? "(Diagnostic)" : "(Doctor)"}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <time className="text-xs text-gray-400">
                          {new Date(review.reply.createdAt).toLocaleDateString(
                            "bn-BD",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </time>
                      </div>

                      <p className="text-sm text-gray-700 leading-relaxed">
                        {review.reply.content}
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
