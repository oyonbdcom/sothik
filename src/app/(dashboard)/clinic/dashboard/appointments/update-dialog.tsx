/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/utils";
import { useUpdateAppointmentMutation } from "@/redux/api/appointmentApi";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock,
  Edit3,
  Hash,
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
    if (!selectedAppointment || !serialNumber) {
      toast.error("সিরিয়াল নম্বর আবশ্যক");
      return;
    }
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
      toast.error(err?.data?.message || "আপডেট করতে ব্যর্থ হয়েছে");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-[400px] overflow-hidden border border-slate-100 relative animate-in zoom-in-95 duration-200">
        {/* হেডার ও পেশেন্ট কার্ড */}
        <div className="p-6 bg-slate-50/50 border-b border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <Edit3 size={18} className="text-indigo-600" /> সেটিংস আপডেট
            </h2>
            <button
              onClick={() => setSelectedAppointment(null)}
              className="h-8 w-8 flex items-center justify-center bg-white text-slate-400 hover:text-rose-500 rounded-full shadow-sm border border-slate-100 transition-all"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
              {selectedAppointment?.patientName?.charAt(0)}
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-tighter leading-none">
                রোগীর নাম
              </p>
              <p className="text-sm font-bold text-slate-700">
                {selectedAppointment?.patientName}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* ইনপুট গ্রিড */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1">
                <Hash size={10} /> সিরিয়াল নং
              </label>
              <Input
                type="number"
                value={serialNumber || ""}
                onChange={(e) => setSerialNumber(Number(e.target.value))}
                className="h-11 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-indigo-500 font-black text-indigo-600 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 flex items-center gap-1">
                <Clock size={10} /> সময় (Time)
              </label>
              <Input
                type="time"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="h-11 rounded-xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-indigo-500 font-bold text-slate-700 transition-all"
              />
            </div>
          </div>

          {/* স্ট্যাটাস সিলেক্টর গ্রিড */}
          <div className="space-y-3  h-[30vh] overflow-y-auto">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              স্ট্যাটাস পরিবর্তন করুন
            </label>

            {/* স্ক্রল কন্টেইনার - উচ্চতা ফিক্সড করা হয়েছে (max-h-[220px]) */}
            <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              {Object.entries(statusConfigs).map(([key, config]) => {
                const isActive = selectedAppointment?.status === key;
                return (
                  <button
                    key={key}
                    disabled={isUpdating || !serialNumber}
                    onClick={() => handleUpdateStatus(key)}
                    className={cn(
                      "group flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all duration-300 relative overflow-hidden min-h-[90px]",
                      isActive
                        ? `${config.bg} border-indigo-500 ${config.color} shadow-sm`
                        : "border-slate-50 bg-slate-50/50 text-slate-500 hover:border-indigo-100 hover:bg-white",
                      !serialNumber &&
                        "opacity-50 cursor-not-allowed grayscale",
                    )}
                  >
                    <config.icon
                      size={20}
                      className={cn(
                        "mb-1 transition-transform group-hover:scale-110",
                        isActive ? config.color : "text-slate-300",
                      )}
                    />
                    <span className="text-[11px] font-black uppercase tracking-tight">
                      {config.label}
                    </span>

                    {isActive && (
                      <div className="absolute top-2 right-2 flex items-center justify-center">
                        <div className="h-2 w-2 bg-indigo-600 rounded-full animate-ping absolute" />
                        <div className="h-2 w-2 bg-indigo-600 rounded-full relative" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {!serialNumber && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl text-amber-700 border border-amber-100">
              <AlertCircle size={14} />
              <span className="text-[10px] font-bold">
                সিরিয়াল নম্বর ছাড়া স্ট্যাটাস আপডেট করা সম্ভব নয়।
              </span>
            </div>
          )}
        </div>

        {/* লোডিং ইন্ডিকেটর */}
        {isUpdating && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-[60] flex items-center justify-center animate-in fade-in">
            <div className="p-4 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
              <Loader2 className="animate-spin text-indigo-600" size={20} />
              <span className="text-xs font-black text-slate-700">
                আপডেট হচ্ছে...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
