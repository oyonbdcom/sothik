/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { IReviewResponse, UpdateReviewInput } from "@/interface/review";
import { useUpdateReviewMutation } from "@/redux/api/reviewApi";

import { updateReviewSchema } from "@/zod-validation/review";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

interface UpdateReviewDialogProps {
  review: IReviewResponse;
}

export default function UpdateReviewDialog({
  review,
}: UpdateReviewDialogProps) {
  const [open, setOpen] = useState(false);

  // 1. RTK Query Mutation Hook
  const [updateReview, { isLoading }] = useUpdateReviewMutation();

  const form = useForm<UpdateReviewInput>({
    resolver: zodResolver(updateReviewSchema),
    defaultValues: {
      comment: review.comment,
      rating: review.rating,
      status: review.status ?? "PENDING",
      targetType: review.targetType,
    },
  });

  // Reset form when review changes or modal opens
  useEffect(() => {
    if (open) {
      form.reset({
        comment: review.comment,
        rating: review.rating,
        targetType: review.targetType,
        status: review.status,
      });
    }
  }, [review, form, open]);

  const onSubmit: SubmitHandler<UpdateReviewInput> = async (data) => {
    try {
      // 2. Call the API
      await updateReview({
        id: review.id,
        data: {
          rating: data.rating,
          comment: data.comment,
          status: data.status,
        },
      }).unwrap();

      toast.success("Review status updated successfully!");
      setOpen(false); // Close dialog on success
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to update review");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8 rounded-full text-blue-600 hover:bg-blue-50"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Update Review Moderation</DialogTitle>
          <DialogDescription>
            Change the visibility status of this review.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-2"
          >
            {/* Rating Display (Read Only) */}
            <CustomFormField
              fieldType={FormFieldType.RATING}
              control={form.control}
              name="rating"
              readonly
              label="Patient Rating"
            />

            {/* Status Selection - Values must be Uppercase to match Prisma/Types */}
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="status"
              label="Moderation Status"
              placeholder="Select status"
              required
              options={[
                { value: "PENDING", label: "Pending" },
                { value: "APPROVED", label: "Approved" },
                { value: "REJECTED", label: "Rejected" },
              ]}
            />

            {/* Comment Display (Disabled for Admin) */}
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="comment"
              label="Review Content"
              disabled
            />

            <DialogFooter className="flex justify-end gap-2 mt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
