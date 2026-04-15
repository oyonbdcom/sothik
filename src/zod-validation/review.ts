import { z } from "zod";

const ReviewStatus = z.enum(["PENDING", "APPROVED", "REJECTED"]);

export const reviewSchema = z.object({
  doctorId: z.string().cuid(),

  rating: z.number().int().min(1).max(5).default(1),
  comment: z.string().optional().nullable(),
  status: ReviewStatus.default("PENDING"),
});

export const createReviewSchema = reviewSchema;

export const updateReviewSchema = reviewSchema
  .omit({
    doctorId: true,
  })
  .partial();

export const ReviewZodValidation = {
  createReviewSchema,
  updateReviewSchema,
};
