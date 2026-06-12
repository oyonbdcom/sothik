/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppPagination from "@/components/app-pagination";
import Loader from "@/components/loader";
import { IReviewResponse } from "@/interface/review";
import {
  useGetDiagnosticProfileReviewsQuery,
  useReplyDiagnosticReviewMutation,
  useUpdateDiagnosticReviewMutation,
} from "@/redux/api/diagnostic-reviewApi";

import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  MessageSquare,
  MoreVertical,
  Star,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ManagerReviewsPage() {
  const [page, setPage] = useState(1);

  // replay review
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  // Modal states
  const [selectedReview, setSelectedReview] = useState<IReviewResponse | null>(
    null,
  );
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const limit = 10;

  const { data, isLoading } = useGetDiagnosticProfileReviewsQuery({
    page,
    limit,
  });

  const [updateReview, { isLoading: isUpdating }] =
    useUpdateDiagnosticReviewMutation();

  const [replyReview, { isLoading: isReplying }] =
    useReplyDiagnosticReviewMutation();
  const reviews = data?.reviews || [];

  // স্ট্যাটাস আপডেট হ্যান্ডলার
  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await updateReview({ id, data: { status: newStatus } }).unwrap();
      toast.success(`রিভিউ স্ট্যাটাস ${newStatus} করা হয়েছে`);
      setIsUpdateModalOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "আপডেট ব্যর্থ হয়েছে");
    }
  };
  const handleReplySubmit = async () => {
    if (!replyText.trim()) {
      toast.error("রিপ্লাই লিখুন");
      return;
    }

    try {
      await replyReview({
        id: selectedReview?.id,
        content: replyText,
      }).unwrap();

      toast.success("রিপ্লাই সফলভাবে দেওয়া হয়েছে");
      setReplyText("");
      setIsReplyModalOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "রিপ্লাই ব্যর্থ হয়েছে");
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* রিভিউ গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews?.map((review: IReviewResponse) => (
          <div
            key={review.id}
            className="bg-white rounded-3xl border border-slate-100 p-4 shadow-sm space-y-4"
          >
            {/* top */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-11 w-11 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  <User size={20} />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-black text-slate-800 truncate">
                    {review.reviewer?.name}
                  </h3>

                  <p className="text-[10px] font-bold text-emerald-600 uppercase truncate">
                    {review.doctor?.specialization}
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-black ${
                        review.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-600"
                          : review.status === "PENDING"
                            ? "bg-amber-100 text-amber-600"
                            : "bg-rose-100 text-rose-600"
                      }`}
                    >
                      {review.status}
                    </span>

                    <div className="flex items-center gap-1 text-[11px] font-black text-amber-500">
                      <Star size={12} fill="currentColor" />
                      {review.rating}
                    </div>
                  </div>
                </div>
              </div>

              {/* actions */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => {
                    setSelectedReview(review);
                    setIsReplyModalOpen(true);
                  }}
                  className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500"
                >
                  <MessageSquare size={14} />
                </button>

                <button
                  onClick={() => {
                    setSelectedReview(review);
                    setIsUpdateModalOpen(true);
                  }}
                  className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500"
                >
                  <MoreVertical size={14} />
                </button>
              </div>
            </div>

            {/* comment */}
            <div className="bg-slate-50 rounded-2xl p-3">
              <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                {review.comment || "কোনো মন্তব্য নেই"}
              </p>
            </div>

            {/* reply */}
            {review.reply && (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-3">
                <p className="text-[10px] font-black text-blue-600 uppercase mb-1">
                  Official Reply
                </p>

                <p className="text-sm text-slate-700 line-clamp-3">
                  {review.reply.content}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      <AppPagination meta={data?.meta} onPageChange={(p) => setPage(p)} />
      {/* --- UPDATE MODAL --- */}
      {isUpdateModalOpen && selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl space-y-6">
            <div className="text-center">
              <div className="h-16 w-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-emerald-500" size={32} />
              </div>
              <h2 className="text-xl font-black text-slate-900">
                রিভিউ আপডেট করুন
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                রোগী <strong>{selectedReview.reviewer?.name}</strong> এর রিভিউটি
                বর্তমানে <strong>{selectedReview.status}</strong> অবস্থায় আছে।
              </p>
            </div>
            <div className="space-y-3">
              <button
                disabled={isUpdating}
                onClick={() =>
                  handleUpdateStatus(selectedReview.id, "APPROVED")
                }
                className="w-full flex items-center justify-between p-4 rounded-2xl border border-emerald-100 hover:bg-emerald-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-500" size={20} />
                  <span className="font-bold text-slate-700">অনুমোদন করুন</span>
                </div>
              </button>
              <button
                disabled={isUpdating}
                onClick={() =>
                  handleUpdateStatus(selectedReview.id, "REJECTED")
                }
                className="w-full flex items-center justify-between p-4 rounded-2xl border border-rose-100 hover:bg-rose-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <XCircle className="text-rose-500" size={20} />
                  <span className="font-bold text-slate-700">বাতিল করুন</span>
                </div>
              </button>
            </div>
            <button
              onClick={() => setIsUpdateModalOpen(false)}
              className="w-full py-2 text-sm font-bold text-slate-400"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {isDeleteModalOpen && selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl space-y-6">
            <div className="text-center">
              <div className="h-16 w-16 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-rose-500" size={32} />
              </div>
              <h2 className="text-xl font-black text-slate-900">
                রিভিউটি ডিলিট করবেন?
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                আপনি কি নিশ্চিত যে আপনি এই রিভিউটি মুছে ফেলতে চান? এটি আর ফিরিয়ে
                আনা সম্ভব হবে না।
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all"
              >
                না
              </button>
            </div>
          </div>
        </div>
      )}
      {isReplyModalOpen && selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-black text-slate-900">রিপ্লাই দিন</h2>
              <p className="text-sm text-slate-500">
                {selectedReview.reviewer?.name} এর রিভিউতে উত্তর দিন
              </p>
            </div>

            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="আপনার রিপ্লাই লিখুন..."
              className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setIsReplyModalOpen(false)}
                className="flex-1 py-3 rounded-2xl bg-slate-100 font-bold"
              >
                বাতিল
              </button>

              <button
                onClick={handleReplySubmit}
                disabled={isReplying}
                className="flex-1 py-3 rounded-2xl bg-blue-600 text-white font-bold flex justify-center items-center"
              >
                {isReplying ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  "রিপ্লাই দিন"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
