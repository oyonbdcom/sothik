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
  DialogDescription,
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
      document: "",
      appointmentId: appointmentId,
    },
  });

  const onSubmit: SubmitHandler<ICreateMedicalRecords> = async (data) => {
    try {
      // ডেট বাদ দিলেও ব্যাকএন্ডে যদি ডেট রিকোয়ার্ড থাকে, তবে আজকের ডেট অটো পাঠিয়ে দিচ্ছি
      const submissionData = {
        ...data,
        appointmentId,
        date: new Date().toISOString(),
      };

      await createMedicalRecord(submissionData).unwrap();
      toast.success("রেকর্ডটি সফলভাবে সংরক্ষিত হয়েছে");
      form.reset();
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.message || "সংরক্ষণ করতে সমস্যা হয়েছে");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size={"sm"}
          className="text-[10px] uppercase gap-2"
        >
          <Plus className="h-4 w-4" />
          রেকর্ডস ও প্রেসক্রিশন যোগ করুন
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <FileUp className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900">
                  মেডিকেল রেকর্ড
                </DialogTitle>
                <DialogDescription className="text-slate-500 text-sm">
                  রিপোর্ট বা প্রেসক্রিপশন আপলোড করুন
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-5">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  name="name"
                  control={form.control}
                  placeholder="উদাঃ প্রেসক্রিপশন, রক্ত পরীক্ষা"
                  label="ফাইলের নাম বা টাইটেল"
                />

                <CustomFormField
                  fieldType={FormFieldType.FILE_UPLOAD}
                  name="document"
                  control={form.control}
                  label="ডকুমেন্ট আপলোড (ছবি বা PDF)"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-50 mt-4">
                <Button
                  type="button"
                  variant="ghost"
                  className="px-6 text-slate-500 hover:text-slate-700"
                  onClick={() => setOpen(false)}
                  disabled={isLoading}
                >
                  বাতিল
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium min-w-[140px] shadow-sm transition-all"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "সংরক্ষণ করুন"
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
