/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMounted } from "@/hooks/use-mounted";
import { useAuth } from "@/hooks/useAuth";
import {
  useDeleteReviewMutation,
  useGetTargetReviewsQuery,
} from "@/redux/api/reviewApi";
import { CheckCircle2, Edit2, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { RatingField } from "../ui/rating";
import { Separator } from "../ui/separator";
import ReviewForm from "./review-form";

interface ReviewPageProps {
  doctorId: string;
}

export default function ReviewPage({ doctorId }: ReviewPageProps) {
  const { user } = useAuth();
  const [editingReview, setEditingReview] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const limit = 10;
  const formRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isFetching } = useGetTargetReviewsQuery({
    doctorId,
    page,
    limit,
    status: "APPROVED",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const [deleteReview] = useDeleteReviewMutation();

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
      await deleteReview(reviewId).unwrap();
      toast.success("রিভিউটি মুছে ফেলা হয়েছে");
    } catch (err: any) {
      toast.error(err?.message || "রিভিউটি মুছতে সমস্যা হয়েছে");
    } finally {
      setDeletingId(null);
    }
  };

  if (!mounted) return null;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="mt-4 text-gray-500">রোগীদের রিভিউ লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <section aria-labelledby="reviews-heading" className="space-y-8">
      {/* --- FORM SECTION --- */}
      <div className="transition-all duration-300">
        {editingReview ? (
          <div ref={formRef} className="bg-blue-50/50   rounded-[2rem]  ">
            <div className="flex justify-between items-center mb-4 p-6">
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">
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
              doctorId={doctorId}
              review={editingReview}
              setEditingReview={() => setEditingReview(null)}
            />
          </div>
        ) : (
          <ReviewForm doctorId={doctorId} />
        )}
        <Separator />
      </div>

      {/* --- REVIEWS LIST - Semantic Article Tags for SEO --- */}
      <div
        className={`space-y-4 ${
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
              key={review.id}
              className="group relative bg-white   rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100   overflow-hidden"
            >
              {/* Subtle gradient accent bar */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="p-5">
                {/* Header Section */}
                <div className="flex gap-4">
                  {/* Avatar with status indicator */}
                  <div className="relative flex-shrink-0">
                    <div className="relative h-12 w-12">
                      {review.reviewer?.image ? (
                        <Image
                          src={review.reviewer.image}
                          alt={review.reviewer.name}
                          fill
                          className="rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                          {review.reviewer?.name?.charAt(0) || "P"}
                        </div>
                      )}
                    </div>
                    {/* Verified badge (optional) */}
                    {review.verified && (
                      <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 rounded-full p-0.5 ring-2 ring-white dark:ring-gray-800">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Reviewer Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-base leading-tight truncate">
                          {review.reviewer?.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <time className="text-xs text-gray-400 dark:text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString(
                              "bn-BD",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </time>
                          {review.edited && (
                            <span className="text-xs text-gray-400">
                              (edited)
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {isOwner && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <button
                            onClick={() => onEdit(review)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            title="Edit review"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            disabled={deletingId === review.id}
                            onClick={() => onDelete(review.id)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

                    {/* Rating */}
                    <div className="mt-2">
                      <RatingField
                        value={review.rating}
                        readOnly
                        className="scale-90 origin-left"
                      />
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="mt-4 pl-4 border-l-2 border-gray-100 dark:border-gray-700">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {review.comment}
                  </p>
                </div>

                {/* Metadata Footer */}
                {review.reply && (
                  <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 border-t border-blue-100 dark:border-blue-800/30 px-5 py-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-sm">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
                            Official Response
                          </span>
                          <span className="text-xs text-gray-400">•</span>

                          <time className="text-xs text-gray-400">
                            {new Date(
                              review.reply.createdAt,
                            ).toLocaleDateString("bn-BD", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </time>
                        </div>

                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {review.reply.content}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Official Response Section */}
              {review.reviewReply && (
                <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 border-t border-blue-100 dark:border-blue-800/30 px-5 py-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
                          Official Response
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <time className="text-xs text-gray-400">
                          {new Date(
                            review.reviewReply.createdAt,
                          ).toLocaleDateString("bn-BD", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </time>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {review.reviewReply.content}
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
          aria-label="রিভিউ নেভিগেশন"
          className="flex justify-center items-center gap-4 p-6"
        >
          <button
            disabled={page === 1 || isFetching}
            onClick={() => setPage((p) => p - 1)}
            className="px-5 py-2 text-sm font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full disabled:opacity-40 hover:border-blue-600 transition-all"
          >
            পূর্ববর্তী
          </button>
          <span className="text-sm font-bold text-gray-500">পৃষ্ঠা {page}</span>
          <button
            disabled={page * limit >= meta.total || isFetching}
            onClick={() => setPage((p) => p + 1)}
            className="px-5 py-2 text-sm font-bold bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full disabled:opacity-40 hover:border-blue-600 transition-all"
          >
            পরবর্তী
          </button>
        </nav>
      )}
    </section>
  );
}
