import { z } from "zod";

const ReviewStatus = z.enum(["PENDING", "APPROVED", "REJECTED"]);

export const reviewSchema = z.object({
  targetId: z.string().cuid(),
  targetType: z.enum(["DOCTOR", "CLINIC"]).optional(),
  rating: z.number().int().min(1).max(5).default(1),
  comment: z.string().optional().nullable(),
  status: ReviewStatus.default("PENDING"),
});

export const createReviewSchema = reviewSchema;

export const updateReviewSchema = reviewSchema
  .omit({
    targetId: true,
  })
  .partial();

export const ReviewZodValidation = {
  createReviewSchema,
  updateReviewSchema,
};
