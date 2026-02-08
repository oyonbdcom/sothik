/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ClientPagination from "@/components/client-pagination";
import FilterField from "@/components/filter-from";
import LayoutLoader from "@/components/layout-loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils/utils";
import {
  useDeleteReviewMutation,
  useGetReviewStatsQuery,
  useGetRoleBaseReviewsQuery,
} from "@/redux/api/reviewApi";
import {
  CheckCircle,
  Clock,
  Filter,
  MessageSquare,
  Star,
  Trash2,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import UpdateReviewDialog from "./update-modal";

export default function ReviewsList() {
  const [targetType, setTargetType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [rating, setRating] = useState<string>("all");
  const [page, setPage] = useState(1);

  const query = {
    page,
    limit: 10,
    ...(searchTerm && { searchTerm }),
    ...(targetType !== "all" && { targetType }),
    ...(rating !== "all" && { rating: Number(rating) }),
  };
  const statsQuery = {
    ...(targetType !== "all" && { targetType }),
  };

  // 1. Destructure error and isFetching (better for UI than just isLoading)
  const { data, isLoading, isError, error } = useGetRoleBaseReviewsQuery(query);
  const { data: statsData, isLoading: staticLoading } = useGetReviewStatsQuery(
    statsQuery as { targetType?: "DOCTOR" | "CLINIC" }
  );
  const [deleteReview] = useDeleteReviewMutation();

  const reviews = data?.reviews || [];
  const meta = data?.meta;

  // 2. Safely calculate stats
  const stats = statsData?.stats || {
    totalReviews: 0,
    averageRating: "0.0",
    pending: 0,
    approved: 0,
    rejected: 0,
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReview(id).unwrap();
      toast.success("Review deleted");
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  if (isLoading || staticLoading) return <LayoutLoader />;

  // 4. Handle Error State
  if (isError) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center border-2 border-dashed rounded-lg">
        <div className="text-center">
          <p className="text-red-500 font-medium">Failed to load reviews</p>
          <p className="text-sm text-gray-500">
            {(error as any)?.data?.message || "Something went wrong"}
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Total Reviews
                </p>
                <h3 className="text-2xl font-bold mt-2">
                  {stats.totalReviews}
                </h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Approved</p>
                <h3 className="text-2xl font-bold mt-2">{stats.approved}</h3>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <p className="text-sm text-green-600">
                    {Math.round(stats.rejected / stats.total || 0 * 100)}% of
                    total
                  </p>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">Pending</p>
                <h3 className="text-2xl font-bold mt-2">{stats.pending}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Awaiting moderation
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Rejected</p>
                <h3 className="text-2xl font-bold mt-2">{stats.rejected}</h3>
                <div className="flex items-center mt-1">
                  <XCircle className="h-4 w-4 text-red-600 mr-1" />
                  <p className="text-sm text-red-600">
                    {Math.round(stats.rejected / stats.total || 0 * 100)}% of
                    total
                  </p>
                </div>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <FilterField
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search doctors by name, specialty, or hospital..."
              className="w-full md:max-w-md"
            />

            <FilterField
              value={targetType}
              onChange={setTargetType}
              placeholder="Status"
              type="select"
              icon={Filter}
              options={[
                {
                  label: "Clinic",
                  value: "CLINIC",
                },
                {
                  label: "Doctor",
                  value: "DOCTOR",
                },
              ]}
              className="w-full"
            />
            <FilterField
              value={rating}
              onChange={setRating}
              placeholder="Filter by Rating"
              type="select"
              icon={Filter}
              options={[
                { label: "5 Stars", value: "5" },
                { label: "4 Stars", value: "4" },
                { label: "3 Stars", value: "3" },
                { label: "2 Stars", value: "2" },
                { label: "1 Star", value: "1" },
              ]}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card>
        <CardHeader>
          <CardTitle>Patient Reviews</CardTitle>
          <CardDescription>
            {reviews?.length} reviews found{" "}
            {searchTerm && `matching "${searchTerm}"`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0   overscroll-auto">
          <div className="rounded-lg border overflow-x-auto">
            <Table className="min-w-[1200px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[220px]">Review Details</TableHead>
                  <TableHead className="w-[200px]">
                    Target (Doctor/Clinic)
                  </TableHead>
                  <TableHead>Feedback</TableHead>
                  <TableHead className="w-[100px]">Rating</TableHead>
                  <TableHead className="w-[120px]">Date</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[120px] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="w-full overflow-auto overscroll-x-auto">
                {reviews?.map((review) => (
                  <TableRow key={review.id} className="hover:bg-gray-50/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-gray-100">
                          <AvatarImage src={review.reviewer?.image} />
                          <AvatarFallback className="bg-blue-50 text-blue-600">
                            {review.reviewer?.name?.charAt(0) || "P"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">
                            {review.reviewer?.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {review.reviewer?.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          {/* 1. Dynamic Image Source */}
                          <AvatarImage src={review.target?.image} />
                          <AvatarFallback
                            className={`${
                              review.targetType === "DOCTOR"
                                ? "bg-purple-50 text-purple-600"
                                : "bg-green-50 text-green-600"
                            }`}
                          >
                            {review.targetType === "DOCTOR" ? "D" : "C"}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <p className="font-medium text-sm">
                            {/* 2. Dynamic Name */}
                            {review.targetType === "DOCTOR"
                              ? `Dr. ${review.target?.name}`
                              : review.target?.name}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="max-w-[300px]">
                        <p className="text-sm line-clamp-2">{review.comment}</p>
                        {review.comment.length > 100 && (
                          <span className="text-xs text-blue-600 mt-1 inline-block">
                            Read more
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < review.rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-sm font-medium">
                          {review.rating}.0
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {formatDate(review.createdAt)}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`
                          ${
                            review.status === "APPROVED"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : ""
                          }
                          ${
                            review.status === "REJECTED"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : ""
                          }
                          ${
                            review.status === "PENDING"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : ""
                          }
                        `}
                      >
                        <span className="flex items-center gap-1.5">
                          {review.status === "APPROVED" && (
                            <CheckCircle className="h-3 w-3" />
                          )}
                          {review.status === "REJECTED" && (
                            <XCircle className="h-3 w-3" />
                          )}
                          {review.status === "PENDING" && (
                            <Clock className="h-3 w-3" />
                          )}
                          {review.status}
                        </span>
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <UpdateReviewDialog review={review} />
                        <Button
                          size="icon"
                          color="destructive"
                          className="h-8 w-8 p-0"
                          onClick={() => handleDelete(review?.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Empty State */}
          {reviews?.length === 0 && (
            <div className="py-16 text-center">
              <div className="mx-auto h-16 w-16 text-gray-300 mb-4">
                <MessageSquare className="h-16 w-16" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No reviews found
              </h3>
              <p className="text-gray-600 max-w-sm mx-auto mb-6">
                {searchTerm
                  ? `No reviews match "${searchTerm}". Try a different search term.`
                  : "No reviews are currently available."}
              </p>
            </div>
          )}

          <ClientPagination
            meta={data?.meta}
            currentPage={page}
            onPageChange={(newPage) => setPage(newPage)}
            dataLength={reviews?.length}
            itemName="reviews"
            searchTerm={searchTerm}
          />
        </CardContent>
      </Card>

      {/* Rating Distribution */}
      <div className="grid grid-cols-1   gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Rating Distribution</CardTitle>
            <CardDescription>Breakdown of review ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[5, 4, 3, 2, 1].map((stars) => {
                // 1. Use the data from backend stats instead of filtering the reviews array
                const breakdown = statsData?.stats?.ratingBreakdown || {};
                const count = breakdown[stars] || 0;
                const totalReviews = statsData?.stats?.totalReviews || 1; // Prevent division by zero
                const percentage = Math.round((count / totalReviews) * 100);

                return (
                  <div key={stars} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < stars
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-200 fill-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium w-12">
                          {stars} stars
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-500">
                          {count} {count === 1 ? "review" : "reviews"}
                        </span>
                        <span className="text-sm font-semibold min-w-[35px] text-right">
                          {percentage}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ease-out ${
                          stars === 5
                            ? "bg-green-500"
                            : stars === 4
                            ? "bg-blue-500"
                            : stars === 3
                            ? "bg-yellow-500"
                            : stars === 2
                            ? "bg-orange-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
