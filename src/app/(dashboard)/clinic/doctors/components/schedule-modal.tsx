/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  createScheduleSchema,
  updateScheduleSchema,
} from "@/zod-validation/schedule";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

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
import { Form, FormMessage } from "@/components/ui/form";
import { IScheduleResponse } from "@/interface/schedule";
import {
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
} from "@/redux/api/scheduleApi";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Loader2,
  Pencil,
  Plus,
} from "lucide-react";

interface ScheduleModalProps {
  membershipId: string;
  schedule?: IScheduleResponse;
  children?: React.ReactNode;
  onSuccess?: () => void;
}

const DAYS_OF_WEEK = [
  "শনিবার",
  "রবিবার",
  "সোমবার",
  "মঙ্গলবার",
  "বুধবার",
  "বৃহস্পতিবার",
  "শুক্রবার",
];

export function ScheduleModal({
  membershipId,
  schedule,
  children,
  onSuccess,
}: ScheduleModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [createSchedule] = useCreateScheduleMutation();
  const [updateSchedule] = useUpdateScheduleMutation();

  const isEditMode = !!schedule;
  const schema = isEditMode ? updateScheduleSchema : createScheduleSchema;
  type FormValue = z.infer<typeof schema>;

  const form = useForm<FormValue>({
    resolver: zodResolver(schema),
    defaultValues: {
      membershipId,
      days: schedule?.days || [],
      times: schedule?.times || "",
      note: schedule?.note || "",
      ...(isEditMode && { id: schedule.id }),
    },
  });

  const selectedDays = form.watch("days" as any) || [];

  const toggleDay = (day: string) => {
    const nextDays = selectedDays.includes(day)
      ? selectedDays.filter((d: string) => d !== day)
      : [...selectedDays, day];
    form.setValue("days" as any, nextDays, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<FormValue> = async (values) => {
    startTransition(async () => {
      try {
        if (isEditMode && schedule) {
          await updateSchedule({
            id: schedule.id,
            data: values,
          }).unwrap();
        } else {
          await createSchedule(values).unwrap();
        }

        toast.success(`সময়সূচী সফলভাবে সংরক্ষিত হয়েছে`);
        setIsOpen(false);
        onSuccess?.();
      } catch (error: any) {
        toast.error(error?.data?.message || "কিছু ভুল হয়েছে");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button
            variant={isEditMode ? "ghost" : "outline"}
            className={
              isEditMode ? "h-8 w-8 p-0" : "gap-2 border-blue-200 text-blue-600"
            }
          >
            {isEditMode ? (
              <Pencil size={14} />
            ) : (
              <>
                <Plus size={14} /> সময়সূচী যোগ করুন
              </>
            )}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl flex flex-col max-h-[90vh]">
        <DialogHeader className="p-6 bg-blue-600 text-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6" />
            <div>
              <DialogTitle className="text-lg">
                {isEditMode ? "সময়সূচী আপডেট" : "সময়সূচী তৈরি"}
              </DialogTitle>
              <DialogDescription className="text-blue-100 text-xs">
                নিচে চেম্বারের দিন ও সময় নির্ধারণ করুন।
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Area */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-6 space-y-6 bg-white dark:bg-slate-900"
            >
              <div className="space-y-3">
                <label className="text-sm font-bold flex items-center gap-2 text-gray-700 dark:text-gray-200">
                  <CalendarDays className="w-4 h-4 text-blue-500" /> বসার
                  দিনসমূহ
                </label>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <Button
                      key={day}
                      type="button"
                      variant={
                        selectedDays.includes(day) ? "default" : "outline"
                      }
                      size="sm"
                      className={`rounded-full px-4 transition-all ${
                        selectedDays.includes(day)
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "hover:border-blue-400 text-gray-600"
                      }`}
                      onClick={() => toggleDay(day)}
                    >
                      {day}
                    </Button>
                  ))}
                </div>
                <FormMessage />
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold flex items-center gap-2 text-gray-700 dark:text-gray-200">
                    <Clock className="w-4 h-4 text-blue-500" /> বসার সময়
                  </label>
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    name="times"
                    control={form.control}
                    placeholder="উদা: সকাল ৮ টা - রাত ৬ টা"
                  />
                  <p className="text-[10px] text-gray-400 ml-1">
                    * আপনার পছন্দমতো সময় লিখুন (যেমন: সকাল ১০টা হতে দুপুর ২টা)
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold flex items-center gap-2 text-gray-700 dark:text-gray-200">
                    <Pencil className="w-4 h-4 text-blue-500" /> বিশেষ দ্রষ্টব্য
                    (Note)
                  </label>
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    name="note"
                    control={form.control}
                    placeholder="উদা: শুক্রবার ও সরকারি ছুটির দিন বন্ধ"
                  />
                </div>
              </div>
            </form>
          </Form>
        </div>

        <DialogFooter className="p-6 bg-gray-50 dark:bg-slate-800/50 flex flex-row gap-3 border-t border-gray-100 dark:border-slate-800 flex-shrink-0">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={() => setIsOpen(false)}
          >
            বাতিল
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            onClick={form.handleSubmit(onSubmit)}
            className="flex-[2] bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md"
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <CheckCircle2 className="mr-2 h-4 w-4" />
            )}
            সংরক্ষণ করুন
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
