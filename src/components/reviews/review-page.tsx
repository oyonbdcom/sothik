/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMounted } from "@/hooks/use-mounted";
import { useAuth } from "@/hooks/useAuth";
import {
  useDeleteReviewMutation,
  useGetTargetReviewsQuery,
} from "@/redux/api/reviewApi";
import {
  CheckCircle2,
  Edit2,
  Loader2,
  MessageSquare,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { RatingField } from "../ui/rating";
import ReviewForm from "./review-form";

interface ReviewPageProps {
  targetId: string;
  targetType: "DOCTOR" | "CLINIC";
}

export default function ReviewPage({ targetId, targetType }: ReviewPageProps) {
  const { user } = useAuth();
  const [editingReview, setEditingReview] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const limit = 10;
  const formRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isFetching } = useGetTargetReviewsQuery({
    targetId,
    targetType,
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
      {/* Header - SEO Friendly */}
      <header className="flex items-center justify-between border-b pb-4">
        <h2
          id="reviews-heading"
          className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2"
        >
          <MessageSquare className="text-blue-600 w-6 h-6" />
          রোগীদের মতামত
          <span className="ml-2 text-sm font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
            {meta?.total || 0}
          </span>
        </h2>
      </header>

      {/* --- FORM SECTION --- */}
      <div className="transition-all duration-300">
        {editingReview ? (
          <div
            ref={formRef}
            className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-[2rem] border border-blue-100 dark:border-blue-800"
          >
            <div className="flex justify-between items-center mb-4">
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
              targetId={targetId}
              targetType={targetType}
              review={editingReview}
              setEditingReview={() => setEditingReview(null)}
            />
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[2rem] border border-dashed border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
              একটি রিভিউ লিখুন
            </h3>
            <ReviewForm targetId={targetId} targetType={targetType} />
          </div>
        )}
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
              className="relative group border-b border-gray-50 dark:border-gray-900 pb-4 last:border-0"
            >
              <div className="flex gap-4 p-4 rounded-2xl transition-colors relative z-10">
                {/* Avatar */}
                <div className="relative h-12 w-12 shrink-0">
                  {review.reviewer?.image ? (
                    <Image
                      src={review.reviewer.image}
                      alt={review.reviewer.name}
                      fill
                      className="rounded-full object-cover border border-gray-100 shadow-sm"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {review.reviewer?.name?.charAt(0) || "P"}
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-[16px] text-gray-900 dark:text-white">
                        {review.reviewer?.name}
                      </h4>
                      <time className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                        {new Date(review.createdAt).toLocaleDateString("bn-BD")}
                      </time>
                    </div>

                    {isOwner && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(review)}
                          className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full text-blue-600"
                          title="এডিট করুন"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          disabled={deletingId === review.id}
                          onClick={() => onDelete(review.id)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full text-red-500 disabled:opacity-50"
                          title="মুছে ফেলুন"
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

                  <RatingField
                    value={review.rating}
                    readOnly
                    className="py-0.5"
                  />

                  <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-800 shadow-sm">
                    <p className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed italic">
                      &quot;{review.comment}&quot;
                    </p>
                  </div>
                </div>
              </div>

              {/* Official Response */}
              {review.reviewReply && (
                <div className="ml-16 mr-4 mt-2 mb-4">
                  <div className="flex gap-3 p-4 rounded-2xl bg-blue-50/40 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50">
                    <div className="h-8 w-8 bg-blue-600 rounded-lg shrink-0 flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <header className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[12px] text-blue-800 dark:text-blue-400 uppercase tracking-widest">
                          {targetType === "DOCTOR"
                            ? "ডাক্তারের উত্তর"
                            : "ক্লিনিকের উত্তর"}
                        </span>
                        <time className="text-[10px] text-gray-400">
                          {new Date(
                            review.reviewReply.createdAt,
                          ).toLocaleDateString("bn-BD")}
                        </time>
                      </header>
                      <p className="text-[14px] text-gray-700 dark:text-gray-300 leading-normal">
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
          className="flex justify-center items-center gap-4 pt-8"
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
