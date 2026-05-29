/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { IReviewResponse } from "@/interface/review";
import {
  useCreateDiagnosticReviewMutation,
  useUpdateDiagnosticReviewMutation,
} from "@/redux/api/diagnostic-reviewApi";
import {
  useCreateDoctorReviewMutation,
  useUpdateDoctorReviewMutation,
} from "@/redux/api/doctor-reviewApi";
// 🔥 ডক্টর এবং ক্লিনিক রিভিউয়ের আলাদা আলাদা রিডাক্স হুক ইমপোর্ট করুন

import { getUserInfo } from "@/service/auth.service";
import { createReviewSchema } from "@/zod-validation/review";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface ReviewFormProps {
  targetId: string; // এটি doctorId অথবা diagId হবে
  type: "doctor" | "diagnostic"; // 🔥 এই প্রপ্সটি নির্ধারণ করবে কোন রিডাক্স ফাংশন চলবে
  review?: IReviewResponse;
  setEditingReview?: (review: IReviewResponse | null) => void;
}

export default function ReviewForm({
  targetId,
  type,
  review,
  setEditingReview,
}: ReviewFormProps) {
  const user: any = getUserInfo();

  // 🔄 ডক্টর রিডাক্স মিউটেশনস
  const [createDoctorReview, { isLoading: isDocCreating }] =
    useCreateDoctorReviewMutation();
  const [updateDoctorReview, { isLoading: isDocUpdating }] =
    useUpdateDoctorReviewMutation();

  // 🔄 ক্লিনিক রিডাক্স মিউটেশনস
  const [createDiagnosticReview, { isLoading: isDiagnosticCreating }] =
    useCreateDiagnosticReviewMutation();
  const [updateDiagnosticReview, { isLoading: isDiagnosticUpdating }] =
    useUpdateDiagnosticReviewMutation();

  // 🔥 টাইপ অনুযায়ী ডাইনামিক লোডিং স্টেট
  const isLoading =
    type === "doctor"
      ? isDocCreating || isDocUpdating
      : isDiagnosticCreating || isDiagnosticUpdating;

  const form = useForm({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      comment: review?.comment || "",
      targetId,
      rating: review?.rating || 0,
      status: "PENDING",
    },
  });

  useEffect(() => {
    if (user?.userId) {
      form.reset({
        comment: review?.comment || "",
        targetId,
        rating: review?.rating || 0,
        status: review?.status || "PENDING",
      });
    }
  }, [user?.userId, review, targetId, form]);

  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      if (review?.id) {
        // ==================== আপডেট লজিক ====================
        if (type === "doctor") {
          await updateDoctorReview({
            id: review.id,
            data: { rating: data.rating, comment: data.comment },
          }).unwrap();
        } else {
          await updateDiagnosticReview({
            id: review.id,
            data: { rating: data.rating, comment: data.comment },
          }).unwrap();
        }
        toast.success("রিভিউ সফলভাবে আপডেট করা হয়েছে");
      } else {
        // ==================== ক্রিয়েট লজিক ====================
        if (type === "doctor") {
          // ডক্টর এপিআই এর বডিতে যদি 'doctorId' চায়, তবে এভাবে ম্যাপ করতে পারেন
          await createDoctorReview({
            doctorId: targetId,
            rating: data.rating,
            comment: data.comment,
          }).unwrap();
        } else {
          // ক্লিনিক এপিআই এর বডিতে যদি 'diagId' চায়
          await createDiagnosticReview({
            diagId: targetId,
            rating: data.rating,
            comment: data.comment,
          }).unwrap();
        }
        toast.success("রিভিউটি অনুমোদনের জন্য পাঠানো হয়েছে");
      }

      form.reset();
      setEditingReview?.(null);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "প্রক্রিয়াটি সফল হয়নি");
    }
  };

  return (
    <section className="bg-card rounded-3xl border-gray-100">
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
                <div className="p-2 bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center">
                  <User className="text-blue-600 w-6 h-6" />
                </div>
              )}
            </figure>

            <div className="flex-1">
              <label className="text-sm font-bold text-gray-900 mb-1 block">
                {review
                  ? `আপনার ${type === "doctor" ? "ডক্টর" : "ক্লিনিক"} অভিজ্ঞতা আপডেট করুন`
                  : `আপনার ${type === "doctor" ? "ডক্টর" : "ক্লিনিক"} অভিজ্ঞতা রেট করুন`}
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
              placeholder={
                type === "doctor"
                  ? "ডক্টরের পরামর্শ, ব্যবহার এবং সেবার মান সম্পর্কে লিখুন..."
                  : "ক্লিনিকের পরিচ্ছন্নতা, স্টাফদের ব্যবহার এবং অপেক্ষার সময় সম্পর্কে লিখুন..."
              }
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
