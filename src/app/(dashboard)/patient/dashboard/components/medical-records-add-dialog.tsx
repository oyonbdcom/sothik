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
      description: "",
      date: new Date().toISOString().split("T")[0] as any,
      document: "",
      appointmentId: appointmentId,
    },
  });

  const onSubmit: SubmitHandler<ICreateMedicalRecords> = async (data) => {
    try {
      await createMedicalRecord({ ...data, appointmentId }).unwrap();
      toast.success("রেকর্ডটি সফলভাবে সংরক্ষিত হয়েছে");
      form.reset();
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "সংরক্ষণ করতে সমস্যা হয়েছে");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 py-6 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-all rounded-lg"
        >
          <Plus className="h-4 w-4" />
          <span className="font-semibold text-sm">নতুন রিপোর্ট যোগ করুন</span>
        </Button>
      </DialogTrigger>

      {/* মেইন ফিক্স: flex flex-col এবং max-h-[90vh] ব্যবহার করা হয়েছে 
          যাতে স্ক্রিন ছোট হলে ডায়ালগ স্ক্রিনের বাইরে চলে না যায়।
      */}
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header - Fixed */}
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex-shrink-0">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <FileUp className="h-5 w-5 text-indigo-600" />
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

        {/* Scrollable Form Body - overflow-y-auto ব্যবহার করা হয়েছে */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  name="name"
                  control={form.control}
                  placeholder="উদাঃ রক্ত পরীক্ষা, এক্স-রে"
                  label="রিপোর্টের নাম"
                />

                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  name="date"
                  control={form.control}
                  type="date"
                  label="পরীক্ষার তারিখ"
                />

                <CustomFormField
                  fieldType={FormFieldType.FILE_UPLOAD}
                  name="document"
                  control={form.control}
                  label="ডকুমেন্ট আপলোড (PDF বা ছবি)"
                />

                {/* প্রয়োজনে আরও ফিল্ড এখানে যোগ করলেও স্ক্রল হবে */}
              </div>

              {/* Action Buttons - Fixed at bottom of the scroll area or outside */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-50 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="px-6 rounded-md font-medium text-slate-600"
                  onClick={() => setOpen(false)}
                  disabled={isLoading}
                >
                  বাতিল
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-md font-medium min-w-[120px]"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
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
