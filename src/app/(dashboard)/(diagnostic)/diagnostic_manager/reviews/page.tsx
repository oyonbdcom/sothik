/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppPagination from "@/components/app-pagination";
import { useDebounce } from "@/hooks/useDebaunce";
import { IReviewResponse } from "@/interface/review";
import { useGetAccessibleDoctorsQuery } from "@/redux/api/doctorApi";
import {
  useDeleteReviewMutation,
  useGetManagerAreaReviewsQuery,
  useReplyReviewMutation,
  useUpdateReviewMutation,
} from "@/redux/api/reviewApi";
import { format } from "date-fns";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  MessageSquare,
  MoreVertical,
  Search,
  Star,
  Trash2,
  User,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ManagerReviewsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [rating, setRating] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [doctorId, setDoctorId] = useState("");
  // replay review
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  // Modal states
  const [selectedReview, setSelectedReview] = useState<IReviewResponse | null>(
    null,
  );
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const query: Record<string, any> = {};
  const debouncedTerm = useDebounce({ searchQuery: searchTerm, delay: 600 });

  if (debouncedTerm?.searchQuery)
    query["searchTerm"] = debouncedTerm.searchQuery;
  if (!!rating) query["rating"] = rating;
  if (!!status) query["status"] = status;
  query["page"] = page;
  query["limit"] = 10;
  query["doctorId"] = doctorId;

  const { data, isLoading } = useGetManagerAreaReviewsQuery({ ...query });
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();
  const [replyReview, { isLoading: isReplying }] = useReplyReviewMutation();
  const reviews = data?.reviews || [];
  const { data: allDoctors, isLoading: allDoctorLoading } =
    useGetAccessibleDoctorsQuery();
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
  // ডিলিট হ্যান্ডলার
  const handleDeleteReview = async () => {
    if (!selectedReview) return;
    try {
      await deleteReview(selectedReview.id).unwrap();
      toast.success("রিভিউটি সফলভাবে ডিলিট করা হয়েছে");
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "ডিলিট করা সম্ভব হয়নি");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* ফিল্টার সেকশন */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 leading-none">
              এরিয়া রিভিউ সমূহ
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              আপনার এরিয়ার সকল ডাক্তারদের প্রাপ্ত ফিডব্যাক
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className="px-3 py-2 rounded-xl border text-xs"
            >
              <option value="">সব ডাক্তার</option>
              {allDoctors?.doctors?.map((d: any) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="bg-slate-50 text-slate-600 text-sm px-4 py-2.5 rounded-xl border-none outline-none focus:ring-2 ring-emerald-500/10 transition-all cursor-pointer"
            >
              <option value="">সব রেটিং</option>
              {[5, 4, 3, 2, 1].map((star) => (
                <option key={star} value={star}>
                  {star} স্টার
                </option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-slate-50 text-slate-600 text-sm px-4 py-2.5 rounded-xl border-none outline-none focus:ring-2 ring-emerald-500/10 transition-all cursor-pointer"
            >
              <option value="">সব স্ট্যাটাস</option>
              <option value="APPROVED">APPROVED</option>
              <option value="PENDING">PENDING</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
        </div>
        <div className="relative w-full">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="ডাক্তারের নামে সার্চ করুন..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-2xl outline-none border border-transparent focus:border-emerald-200 transition-all text-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

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
                    Dr. {review.doctor?.user?.name}
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

                <button
                  onClick={() => {
                    setSelectedReview(review);
                    setIsDeleteModalOpen(true);
                  }}
                  className="h-8 w-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500"
                >
                  <Trash2 size={14} />
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

            {/* footer */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-7 w-7 rounded-full overflow-hidden bg-slate-200 relative shrink-0">
                  {review.reviewer?.image ? (
                    <Image
                      src={review.reviewer.image}
                      alt={review.reviewer?.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-700">
                      {review.reviewer?.name?.[0]}
                    </div>
                  )}
                </div>

                <span className="text-xs font-bold text-slate-700 truncate">
                  {review.reviewer?.name}
                </span>
              </div>

              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold shrink-0">
                <Clock size={10} />
                {format(new Date(review.createdAt), "dd MMM")}
              </div>
            </div>
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
              <button
                disabled={isDeleting}
                onClick={handleDeleteReview}
                className="flex-1 py-4 rounded-2xl bg-rose-500 text-white font-bold hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all flex items-center justify-center"
              >
                {isDeleting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "হ্যাঁ, মুছুন"
                )}
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
