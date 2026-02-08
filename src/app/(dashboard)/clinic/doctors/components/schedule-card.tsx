/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IScheduleResponse } from "@/interface/schedule";
import { useDeleteScheduleMutation } from "@/redux/api/scheduleApi";
import { Clock, Edit2, Loader2, StickyNote, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { ScheduleModal } from "./schedule-modal";

interface ScheduleCardProps {
  schedule: IScheduleResponse;
}

export const ScheduleCard = ({ schedule }: ScheduleCardProps) => {
  const [deleteSchedule, { isLoading: isDeleting }] =
    useDeleteScheduleMutation();

  const handleDelete = async () => {
    const confirmDelete = window.confirm("আপনি কি নিশ্চিতভাবে মুছে ফেলতে চান?");
    if (!confirmDelete) return;

    try {
      const res = await deleteSchedule(schedule.id).unwrap();
      if (res) toast.success("মুছে ফেলা হয়েছে");
    } catch (err: any) {
      toast.error(err?.data?.message || "ব্যর্থ হয়েছে");
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-400 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
      {/* Header: Time & Actions */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600">
            <Clock className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-tighter text-slate-400">
              বসার সময়
            </span>
            <h3 className="text-base font-bold text-slate-800 dark:text-white leading-none">
              {schedule.times}
            </h3>
          </div>
        </div>

        <div className="flex gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <ScheduleModal
            membershipId={schedule.membershipId}
            schedule={schedule}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md text-slate-400 hover:text-blue-600"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
          </ScheduleModal>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-md text-slate-400 hover:text-red-600"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Days Section */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {schedule.days.map((day) => (
          <Badge
            key={day}
            className="rounded-md border-none bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-300"
          >
            {day}
          </Badge>
        ))}
      </div>

      {/* Compact Note Section */}
      {schedule.note && (
        <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-slate-50 dark:border-slate-800">
          <StickyNote className="h-3 w-3 text-amber-500 shrink-0" />
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
            {schedule.note}
          </p>
        </div>
      )}
    </div>
  );
};
