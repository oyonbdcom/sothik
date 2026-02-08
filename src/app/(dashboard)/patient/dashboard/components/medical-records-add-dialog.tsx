/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileUp, Loader2, Plus } from "lucide-react";

import { ICreateMedicalRecords } from "@/interface/medical-history";
import { useCreateMedicalRecordMutation } from "@/redux/api/medical-recordsApi";
import { createMedicalHistorySchema } from "@/zod-validation/medical-history";

export default function MedicalRecordsAddDialog({
  appointmentId,
}: {
  appointmentId: string;
}) {
  const [open, setOpen] = useState(false);
  const [createMedicalRecord, { isLoading }] = useCreateMedicalRecordMutation();

  const form = useForm<ICreateMedicalRecords>({
    resolver: zodResolver(createMedicalHistorySchema),
    defaultValues: {
      name: "",
      description: "",
      date: new Date().toISOString().split("T")[0] as any,
      document: "",
      appointmentId: appointmentId, // সরাসরি প্রপস থেকে অ্যাপয়েন্টমেন্ট আইডি সেট করুন
    },
  });

  const onSubmit: SubmitHandler<ICreateMedicalRecords> = async (data) => {
    try {
      // ডাটা পাঠানোর আগে নিশ্চিত করুন appointmentId ঠিক আছে
      const payload = { ...data, appointmentId };
      await createMedicalRecord(payload).unwrap();

      toast.success("মেডিকেল রেকর্ড সফলভাবে যোগ করা হয়েছে");
      form.reset();
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "রেকর্ড সেভ করতে ব্যর্থ হয়েছে");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-12 gap-2 border-2 border-dashed border-indigo-200 hover:border-indigo-500 hover:bg-indigo-50 text-indigo-600 transition-all rounded-xl font-bold"
        >
          <Plus className="h-5 w-5" />
          রিপোর্ট যোগ করুন
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
        <div className="bg-indigo-600 p-6 text-white">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <FileUp className="h-6 w-6 text-white" />
              </div>
              <DialogTitle className="text-2xl font-black tracking-tight">
                নতুন মেডিকেল রেকর্ড
              </DialogTitle>
            </div>
            <p className="text-indigo-100 text-sm mt-1">
              অ্যাপয়েন্টমেন্ট সম্পর্কিত সকল প্রেসক্রিপশন বা রিপোর্ট এখানে আপলোড
              করুন।
            </p>
          </DialogHeader>
        </div>

        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    name="name"
                    control={form.control}
                    placeholder="উদাঃ রক্তের রিপোর্ট / এক্স-রে"
                    label="রিপোর্টের শিরোনাম"
                  />
                </div>

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  name="date"
                  control={form.control}
                  type="date"
                  label="পরীক্ষার তারিখ"
                />

                <div className="md:col-span-2">
                  <CustomFormField
                    fieldType={FormFieldType.TEXTAREA}
                    name="description"
                    control={form.control}
                    placeholder="রিপোর্ট সম্পর্কে কিছু লিখুন..."
                    label="বিবরণ (অপশনাল)"
                  />
                </div>

                <div className="md:col-span-2">
                  <CustomFormField
                    fieldType={FormFieldType.FILE_UPLOAD}
                    name="document"
                    control={form.control}
                    label="ডকুমেন্ট আপলোড করুন (PDF/Image)"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1 h-12 rounded-xl font-bold text-gray-500 hover:bg-gray-100"
                  onClick={() => setOpen(false)}
                  disabled={isLoading}
                >
                  বাতিল করুন
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-[2] h-12 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      সেভ হচ্ছে...
                    </div>
                  ) : (
                    "রেকর্ড সেভ করুন"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
