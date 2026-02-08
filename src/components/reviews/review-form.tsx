/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { IReviewResponse } from "@/interface/review";
import {
  useCreateReviewMutation,
  useUpdateReviewMutation,
} from "@/redux/api/reviewApi";
import { getUserInfo } from "@/service/auth.service";
import { createReviewSchema } from "@/zod-validation/review";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface ReviewFormProps {
  targetId: string;
  review?: IReviewResponse;
  targetType: "DOCTOR" | "CLINIC";
  setEditingReview?: (review: IReviewResponse | null) => void;
}

export default function ReviewForm({
  targetId,
  review,
  targetType,
  setEditingReview,
}: ReviewFormProps) {
  const user: any = getUserInfo();

  // RTK Query Mutations
  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const isLoading = isCreating || isUpdating;

  const form = useForm({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      comment: review?.comment || "",
      targetId: targetId,
      targetType: targetType,
      rating: review?.rating || 0,
      status: "PENDING",
    },
  });

  useEffect(() => {
    if (user?.userId) {
      form.reset({
        comment: review?.comment || "",
        targetId,
        targetType: targetType,
        rating: review?.rating || 0,
        status: review?.status,
      });
    }
  }, [user?.userId, review, targetId, targetType, form]);

  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      if (review?.id) {
        await updateReview({
          id: review.id,
          data: {
            rating: data.rating,
            comment: data.comment,
          },
        }).unwrap();
        toast.success("রিভিউ সফলভাবে আপডেট করা হয়েছে");
      } else {
        await createReview(data).unwrap();
        toast.success("রিভিউটি অনুমোদনের জন্য পাঠানো হয়েছে");
      }

      form.reset();
      setEditingReview?.(null);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.message || "প্রক্রিয়াটি সফল হয়নি");
    }
  };

  return (
    <section className="bg-card p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
      <header className="sr-only">
        <h3>{review ? "রিভিউ এডিট করুন" : "নতুন রিভিউ লিখুন"}</h3>
      </header>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex items-center gap-4">
            <figure className="flex-shrink-0">
              {user?.image ? (
                <Image
                  src={user?.image}
                  alt="ব্যবহারকারীর প্রোফাইল ছবি"
                  width={48}
                  height={48}
                  className="rounded-2xl object-cover border-2 border-primary/10"
                />
              ) : (
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 w-12 h-12 rounded-2xl flex items-center justify-center">
                  <User className="text-blue-600 w-6 h-6" />
                </div>
              )}
            </figure>

            <div className="flex-1">
              <label className="text-sm font-bold text-gray-900 dark:text-white mb-1 block">
                {review
                  ? "আপনার অভিজ্ঞতা আপডেট করুন"
                  : "আপনার অভিজ্ঞতা রেট করুন"}
              </label>
              <CustomFormField
                fieldType={FormFieldType.RATING}
                control={form.control}
                name="rating"
              />
            </div>
          </div>

          <div className="space-y-4">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="comment"
              placeholder="পরামর্শ, অপেক্ষার সময় এবং সেবার মান সম্পর্কে বিস্তারিত লিখুন..."
              required
            />

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="rounded-xl px-8 font-bold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    প্রসেসিং...
                  </>
                ) : review ? (
                  "আপডেট করুন"
                ) : (
                  "রিভিউ পোস্ট করুন"
                )}
              </Button>

              {review && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setEditingReview?.(null)}
                  className="rounded-xl font-bold text-red-500 hover:text-red-600"
                >
                  বাতিল
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </section>
  );
}
