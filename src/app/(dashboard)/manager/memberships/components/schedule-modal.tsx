/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { IScheduleResponse } from "@/interface/schedule";
import {
  useAddScheduleMutation,
  useUpdateScheduleMutation, // আপডেট মিউটেশন ইম্পোর্ট করুন
} from "@/redux/api/scheduleApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Clock, Loader2, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const scheduleSchema = z.object({
  time: z
    .string()
    .min(1, "শিডিউল বর্ণনা আবশ্যক")
    .regex(
      /^[\u0980-\u09FF\s\d,।:-]+$/,
      "শুধুমাত্র বাংলা অক্ষর ব্যবহার করুন (যেমন: শনি-সোম, বিকাল ৫টা)",
    ),
});

type TScheduleForm = z.infer<typeof scheduleSchema>;

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMembershipId: string | null;
  initialData: IScheduleResponse | null; // এডিট করার জন্য ডাটা
}

export default function ScheduleModal({
  isOpen,
  onClose,
  selectedMembershipId,
  initialData,
}: ScheduleModalProps) {
  // এডিট মোড কিনা তা চেক করা
  const isEditMode = !!initialData;

  const [addSchedule, { isLoading: isAdding }] = useAddScheduleMutation();
  const [updateSchedule, { isLoading: isUpdating }] =
    useUpdateScheduleMutation();

  const isLoading = isAdding || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TScheduleForm>({
    resolver: zodResolver(scheduleSchema),
  });

  // মডাল ওপেন হলে বা initialData আসলে ফর্ম রিসেট করা
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({ time: initialData.time });
      } else {
        reset({ time: "" });
      }
    }
  }, [initialData, reset, isOpen]);

  const onSubmit = async (data: TScheduleForm) => {
    try {
      if (isEditMode && initialData) {
        // আপডেট এপিআই কল
        await updateSchedule({
          id: initialData.id,
          data: { time: data.time },
        }).unwrap();
        toast.success("শিডিউল সফলভাবে আপডেট হয়েছে");
      } else {
        // নতুন শিডিউল যোগ করা
        if (!selectedMembershipId)
          return toast.error("মেম্বারশিপ আইডি পাওয়া যায়নি");

        await addSchedule({
          membershipId: selectedMembershipId,
          time: data.time,
        }).unwrap();
        toast.success("শিডিউল সফলভাবে যোগ করা হয়েছে");
      }

      onClose();
      reset();
    } catch (error: any) {
      toast.error(error?.data?.message || "অপারেশনটি সফল হয়নি");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !isLoading && onClose()}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl"
          >
            {/* হেডার থিম কালার */}
            <div
              className={`p-6 ${isEditMode ? "bg-blue-600" : "bg-indigo-600"} text-white`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                    {isEditMode ? <Calendar size={20} /> : <Clock size={20} />}
                  </div>
                  <div>
                    <h3 className="font-black text-lg leading-tight">
                      {isEditMode ? "শিডিউল এডিট" : "নতুন শিডিউল"}
                    </h3>
                    <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold">
                      {isEditMode ? "Update Schedule" : "Add New Time"}
                    </p>
                  </div>
                </div>
                <button
                  disabled={isLoading}
                  onClick={onClose}
                  className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase ml-1">
                  সময় ও দিন (বাংলায়)
                </label>
                <div className="relative mt-1">
                  <input
                    {...register("time")}
                    type="text"
                    disabled={isLoading}
                    placeholder="উদা: শনি-মঙ্গল, সন্ধ্যা ৭টা"
                    className={`w-full bg-slate-50 border ${
                      errors.time ? "border-red-500" : "border-slate-100"
                    } rounded-2xl px-4 py-3.5 text-sm focus:ring-4 focus:ring-indigo-500/10 outline-none font-medium transition-all`}
                  />
                </div>
                {errors.time && (
                  <p className="text-[10px] text-red-500 mt-1.5 ml-1 font-bold">
                    {errors.time.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex-1 bg-slate-100 text-slate-500 font-bold py-3.5 rounded-2xl active:scale-95 transition-all text-sm"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-[2] ${
                    isEditMode
                      ? "bg-blue-600 shadow-blue-100"
                      : "bg-indigo-600 shadow-indigo-100"
                  } text-white font-bold py-3.5 rounded-2xl shadow-xl active:scale-95 disabled:bg-slate-300 disabled:shadow-none transition-all flex justify-center items-center gap-2 text-sm`}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <span>{isEditMode ? "আপডেট করুন" : "শিডিউল যোগ করুন"}</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
