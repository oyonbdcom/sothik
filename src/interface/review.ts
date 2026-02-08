import {
  createReviewSchema,
  updateReviewSchema,
} from "@/zod-validation/review";
import z from "zod";
export type IReviewStatus = "APPROVED" | "PENDING" | "REJECTED";
export type IReviewTargetType = "DOCTOR" | "CLINIC";
export enum ReviewTargetType {
  DOCTOR = "DOCTOR",
  CLINIC = "CLINIC",
}

export enum ReviewStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface IReviewer {
  id: string;
  name: string;
  image: string | null;
}

export interface IReviewReply {
  id: string;
  content: string;
  reviewId: string;
  repliedById: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IReviewResponse {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date | string;
  status: ReviewStatus;
  targetId?: string;
  targetType?: ReviewTargetType;

  reviewer: IReviewer;
  reviewReply: IReviewReply | null;
}
export type IReviewStatsResponse = {
  totalReviews: number;
  averageRating: string;
  pending: number;
  approved: number;
  rejected: number;
  replyCount: number;
  replyRate: number;
  ratingBreakdown: Record<number, number>;
};
export interface IReviewListResponse {
  reviews: IReviewResponse[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;

export const ReviewFilterableFields = [
  "searchTerm",
  "rating",
  "Id",
  "patientId",
];
