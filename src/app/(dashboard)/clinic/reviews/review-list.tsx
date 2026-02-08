/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  BarChart3,
  Clock,
  MessageSquare,
  Star,
  Trash2,
  User,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

import {
  useDeleteReviewMutation,
  useGetReviewStatsQuery,
  useGetRoleBaseReviewsQuery,
  useReplyReviewMutation,
} from "@/redux/api/reviewApi";

import ClientPagination from "@/components/client-pagination";
import FilterField from "@/components/filter-from";
import LayoutLoader from "@/components/layout-loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMounted } from "@/hooks/use-mounted";
import { useAuth } from "@/hooks/useAuth";
import { IReviewResponse, IReviewStatsResponse } from "@/interface/review";

export default function ClinicReviewsDashboard() {
  const { user } = useAuth();
  const mounted = useMounted();
  const [status, setStatus] = useState<string>("all");
  const [rating, setRating] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [showResponseForm, setShowResponseForm] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");

  const queryParams = {
    page,
    limit: 10,
    ...(rating !== "all" && { rating: Number(rating) }),
    ...(status !== "all" && { status }),
  };

  const { data, isLoading, isFetching } = useGetRoleBaseReviewsQuery(
    queryParams,
    { skip: !user?.id },
  );

  const { data: statsData, isLoading: statsLoading } = useGetReviewStatsQuery(
    { targetType: "CLINIC" },
    { skip: !user?.id },
  );

  const [replyToReview, { isLoading: isReplying }] = useReplyReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const reviews = data?.reviews || [];
  const meta = data?.meta;
  const stats: IReviewStatsResponse = statsData?.stats;

  if (isLoading || statsLoading || !mounted) return <LayoutLoader />;

  const handleResponseSubmit = async (reviewId: string) => {
    if (!responseText.trim())
      return toast.error("অনুগ্রহ করে একটি উত্তর লিখুন");
    try {
      await replyToReview({ id: reviewId, content: responseText }).unwrap();
      toast.success("উত্তর সফলভাবে সাবমিট হয়েছে");
      setResponseText("");
      setShowResponseForm(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "উত্তর দিতে ব্যর্থ হয়েছে");
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    alert("আপনি কি নিশ্চিতভাবে এই রিভিউটি ডিলিট করতে চান?");
    try {
      await deleteReview(reviewId).unwrap();
      toast.success("রিভিউ ডিলিট করা হয়েছে");
    } catch (err) {
      toast.error("ডিলিট করতে ব্যর্থ হয়েছে");
    }
  };

  return (
    <div className="space-y-6 p-6 bg-slate-50/50 min-h-screen">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          ক্লিনিক <span className="text-blue-600">রিভিউ</span>
        </h1>
        <p className="text-slate-500 font-medium">
          রোগীদের মতামত এবং ফিডব্যাক পরিচালনা করুন
        </p>
      </header>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="গড় রেটিং"
          value={stats?.averageRating || 0}
          icon={<Star className="text-blue-600 fill-blue-600" size={20} />}
          subtext={`${meta?.total || 0} টি মোট রিভিউ`}
          bgColor="from-blue-50 to-indigo-50"
          borderColor="border-blue-100"
        />
        <StatCard
          title="রেসপন্স রেট"
          value={`${stats?.replyRate || 0}%`}
          icon={<MessageSquare className="text-emerald-600" size={20} />}
          subtext="রিভিউ এর উত্তর দেয়া হয়েছে"
          bgColor="from-emerald-50 to-teal-50"
          borderColor="border-emerald-100"
        />
        <StatCard
          title="অপেক্ষমান"
          value={stats?.pending || 0}
          icon={<Clock className="text-amber-600" size={20} />}
          subtext="রিভিউ চেক করা বাকি"
          bgColor="from-amber-50 to-orange-50"
          borderColor="border-amber-100"
        />
        <StatCard
          title="সর্বমোট রিভিউ"
          value={meta?.total || 0}
          icon={<BarChart3 className="text-purple-600" size={20} />}
          subtext="সব সময়ের ফিডব্যাক"
          bgColor="from-purple-50 to-pink-50"
          borderColor="border-purple-100"
        />
      </div>

      {/* Filters */}
      <Card className="p-4 border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <FilterField
            value={status}
            onChange={setStatus}
            type="select"
            placeholder="অবস্থা নির্বাচন করুন"
            options={[
              { value: "all", label: "সব অবস্থা" },
              { value: "APPROVED", label: "অনুমোদিত" },
              { value: "PENDING", label: "অপেক্ষমান" },
            ]}
          />
          <FilterField
            value={rating}
            onChange={setRating}
            type="select"
            options={[
              { value: "all", label: "সব রেটিং" },
              { value: "5", label: "৫ স্টার" },
              { value: "4", label: "৪ স্টার" },
              { value: "3", label: "৩ স্টার" },
              { value: "2", label: "২ স্টার" },
              { value: "1", label: "১ স্টার" },
            ]}
            placeholder="রেটিং নির্বাচন করুন"
          />
        </div>
      </Card>

      {/* Reviews List */}
      <div
        className={`space-y-4 ${isFetching ? "opacity-60 pointer-events-none" : "opacity-100"} transition-all`}
      >
        {reviews.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-dashed border-2 border-slate-100">
            <MessageSquare className="mx-auto h-12 w-12 text-slate-200 mb-4" />
            <p className="text-slate-400 font-medium">কোন রিভিউ পাওয়া যায়নি।</p>
          </div>
        ) : (
          reviews.map((review: IReviewResponse) => (
            <Card
              key={review.id}
              className="group hover:shadow-xl hover:shadow-slate-200/50 transition-all border-slate-100 rounded-2xl overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="flex gap-5">
                  <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                    <AvatarImage src={review.reviewer?.image || ""} />
                    <AvatarFallback className="bg-slate-100 text-slate-400">
                      <User size={24} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg">
                          {review.reviewer?.name}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium">
                          {new Date(review.createdAt).toLocaleDateString(
                            "bn-BD",
                          )}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <StarRating rating={review.rating} />
                        <Badge
                          className={`font-bold px-3 py-0.5 rounded-full ${
                            review.status === "APPROVED"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : "bg-amber-50 text-amber-600 border-amber-100"
                          }`}
                          variant="outline"
                        >
                          {review.status === "APPROVED"
                            ? "অনুমোদিত"
                            : "অপেক্ষমান"}
                        </Badge>
                      </div>
                    </div>

                    <p className="mt-4 text-slate-600 leading-relaxed font-medium">
                      {review.comment}
                    </p>

                    {/* Official Response Area */}
                    {review.reviewReply && showResponseForm !== review.id && (
                      <div className="mt-5 p-4 bg-blue-50/50 rounded-xl border border-blue-100 relative">
                        <div className="absolute -top-2.5 left-4 bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm uppercase tracking-tighter">
                          Official Reply
                        </div>
                        <p className="text-sm text-blue-700 mt-1">
                          {review.reviewReply.content}
                        </p>
                      </div>
                    )}

                    {/* Action Form / Buttons */}
                    {showResponseForm === review.id ? (
                      <div className="mt-5 space-y-3 animate-in fade-in slide-in-from-top-2">
                        <textarea
                          className="w-full p-4 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          placeholder="আপনার উত্তরটি এখানে লিখুন..."
                          rows={3}
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            className="rounded-xl"
                            onClick={() => setShowResponseForm(null)}
                          >
                            বাতিল
                          </Button>
                          <Button
                            className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6"
                            disabled={isReplying}
                            onClick={() => handleResponseSubmit(review.id)}
                          >
                            {isReplying ? "সেভ হচ্ছে..." : "উত্তর সাবমিট করুন"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-6 pt-4 border-t border-slate-50 flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 transition-all font-bold"
                          onClick={() => {
                            setResponseText(review.reviewReply?.content || "");
                            setShowResponseForm(review.id);
                          }}
                        >
                          {review.reviewReply ? "উত্তর এডিট করুন" : "উত্তর দিন"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                          onClick={() => handleDeleteReview(review.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <ClientPagination
        meta={data?.meta}
        currentPage={page}
        onPageChange={(newPage) => setPage(newPage)}
        dataLength={reviews?.length}
        itemName="রিভিউ"
      />
    </div>
  );
}

const StatCard = ({
  title,
  value,
  icon,
  subtext,
  bgColor,
  borderColor,
}: any) => (
  <Card
    className={`bg-gradient-to-br ${bgColor} ${borderColor} border shadow-none rounded-2xl`}
  >
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-3xl font-black text-slate-900">{value}</h3>
          <p className="text-[11px] font-medium text-slate-400">{subtext}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/80 shadow-sm border border-white">
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={`w-4 h-4 ${
          s <= rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-slate-100 fill-slate-100"
        }`}
      />
    ))}
  </div>
);
