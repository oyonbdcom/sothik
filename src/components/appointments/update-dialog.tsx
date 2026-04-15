/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/utils";
import { useUpdateAppointmentMutation } from "@/redux/api/appointmentApi";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Loader2,
  X,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function UpdateDialog({
  selectedAppointment,
  setSelectedAppointment,
}: {
  selectedAppointment: any;
  setSelectedAppointment: any;
}) {
  const [serialNumber, setSerialNumber] = useState<number>(
    selectedAppointment?.serialNumber || 0,
  );
  const [timeSlot, setTimeSlot] = useState<string>(
    selectedAppointment?.times || "",
  );
  const [updateAppointment, { isLoading: isUpdating }] =
    useUpdateAppointmentMutation();

  const handleUpdateStatus = async (newStatus: string) => {
    if (!serialNumber) return toast.error("সিরিয়াল নম্বর দিন");
    try {
      await updateAppointment({
        id: selectedAppointment.id,
        status: newStatus,
        times: timeSlot || "",
        serialNumber: Number(serialNumber) || 0,
      }).unwrap();
      toast.success(`সফলভাবে আপডেট করা হয়েছে`);
      setSelectedAppointment(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "ব্যর্থ হয়েছে");
    }
  };

  const statusConfigs: Record<
    string,
    { label: string; color: string; bg: string; icon: any }
  > = {
    PENDING: {
      label: "পেন্ডিং",
      color: "text-amber-600",
      bg: "bg-amber-50",
      icon: Clock,
    },
    SCHEDULED: {
      label: "শিডিউল্ড",
      color: "text-blue-600",
      bg: "bg-blue-50",
      icon: CalendarDays,
    },
    COMPLETED: {
      label: "সম্পন্ন",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      icon: CheckCircle2,
    },
    CANCELLED: {
      label: "বাতিল",
      color: "text-rose-600",
      bg: "bg-rose-50",
      icon: XCircle,
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              অ্যাপয়েন্টমেন্ট আপডেট
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {selectedAppointment?.patientName}
            </p>
          </div>
          <button
            onClick={() => setSelectedAppointment(null)}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Inputs Section */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 ml-1">
                সিরিয়াল নম্বর
              </label>
              <Input
                type="number"
                value={serialNumber || ""}
                onChange={(e) => setSerialNumber(Number(e.target.value))}
                className="h-10 rounded-xl bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-blue-500"
                placeholder="যেমন: ০৫"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 ml-1">
                সময় নির্ধারণ
              </label>
              <Input
                type="time"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="h-10 rounded-xl bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-blue-500"
              />
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 ml-1">
              স্ট্যাটাস সিলেক্ট করুন
            </label>
            <div className="grid gap-2">
              {Object.entries(statusConfigs).map(([key, config]) => {
                const isActive = selectedAppointment?.status === key;
                return (
                  <button
                    key={key}
                    disabled={isUpdating}
                    onClick={() => handleUpdateStatus(key)}
                    className={cn(
                      "flex items-center gap-3 w-full p-3 rounded-2xl border transition-all",
                      isActive
                        ? `${config.bg} border-blue-200 ring-1 ring-blue-100`
                        : "bg-white border-slate-100 hover:border-slate-300",
                    )}
                  >
                    <div
                      className={cn(
                        "p-2 rounded-xl",
                        isActive ? "bg-white" : "bg-slate-50",
                      )}
                    >
                      <config.icon
                        size={16}
                        className={isActive ? config.color : "text-slate-400"}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-sm font-bold",
                        isActive ? "text-slate-800" : "text-slate-600",
                      )}
                    >
                      {config.label}
                    </span>
                    {isActive && (
                      <div className="ml-auto h-2 w-2 bg-blue-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {isUpdating && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="animate-spin text-blue-600" size={24} />
              <p className="text-xs font-bold text-slate-600">
                প্রসেসিং হচ্ছে...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
