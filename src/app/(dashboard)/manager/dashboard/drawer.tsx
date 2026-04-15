/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useUpdateAppointmentMutation } from "@/redux/api/appointmentApi";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Hash,
  Loader2,
  MoreVertical,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function UpdateStatusDrawer({
  appointment,
}: {
  appointment: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [updateAppointment, { isLoading }] = useUpdateAppointmentMutation();

  // ফর্ম স্টেট
  const [times, setTimes] = useState(appointment?.times || "");
  const [serialNumber, setSerialNumber] = useState<number>(
    appointment?.serialNumber || 0,
  );

  const handleUpdate = async (newStatus: string) => {
    try {
      await updateAppointment({
        id: appointment.id,
        status: newStatus,
        times: times || undefined,
        serialNumber: Number(serialNumber),
      }).unwrap();

      toast.success(
        `অ্যাপয়েন্টমেন্টটি '${newStatus}' হিসেবে আপডেট করা হয়েছে`,
      );
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "আপডেট সম্পন্ন করা সম্ভব হয়নি");
    }
  };

  return (
    <>
      {/* ট্রিগার বাটন */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
      >
        <MoreVertical size={20} className="text-slate-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[999] flex items-end justify-center">
            {/* ব্যাকড্রপ অ্যানিমেশন */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            />

            {/* ড্রয়ার কন্টেন্ট */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg bg-white rounded-t-[2.5rem] p-6 pb-10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ড্রয়ার হ্যান্ডেল */}
              <div
                className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 cursor-pointer"
                onClick={() => setIsOpen(false)}
              />

              <div className="text-center mb-8">
                <h3 className="font-black text-slate-800 text-xl tracking-tight">
                  অ্যাপয়েন্টমেন্ট ম্যানেজমেন্ট
                </h3>
                <p className="text-xs text-slate-400 font-bold mt-1">
                  কোড: #{appointment.code} | রোগী: {appointment.patientName}
                </p>
              </div>

              {/* ফর্ম ইনপুট সেকশন */}
              <div className="space-y-5 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* সময় ইনপুট */}
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-slate-600 ml-1 flex items-center gap-2">
                      <Clock size={14} className="text-emerald-500" />{" "}
                      অ্যাপয়েন্টমেন্টের সময়
                    </label>
                    <input
                      type="time"
                      placeholder="যেমন: সকাল ১০:৩০"
                      className="w-full bg-slate-50 border border-slate-100 outline-none p-4 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 ring-emerald-500/20 focus:bg-white transition-all shadow-sm"
                      value={times}
                      onChange={(e) => setTimes(e.target.value)}
                    />
                  </div>

                  {/* সিরিয়াল ইনপুট */}
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-slate-600 ml-1 flex items-center gap-2">
                      <Hash size={14} className="text-emerald-500" /> সিরিয়াল
                      নম্বর
                    </label>
                    <input
                      type="number"
                      placeholder="যেমন: ১৫"
                      className="w-full bg-slate-50 border border-slate-100 outline-none p-4 rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 ring-emerald-500/20 focus:bg-white transition-all shadow-sm"
                      value={serialNumber || ""}
                      onChange={(e) => setSerialNumber(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* অ্যাকশন বাটনসমূহ */}
              <div className="flex flex-col gap-3">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  disabled={isLoading}
                  onClick={() => handleUpdate("SCHEDULED")}
                  className="w-full p-4 rounded-2xl bg-emerald-600 text-white font-black shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <CalendarDays size={18} /> শিডিউল নিশ্চিত করুন
                </motion.button>

                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    disabled={isLoading}
                    onClick={() => handleUpdate("COMPLETED")}
                    className="p-4 rounded-2xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center gap-2 border border-blue-100 disabled:opacity-50"
                  >
                    <CheckCircle2 size={18} /> সম্পন্ন হয়েছে
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    disabled={isLoading}
                    onClick={() => handleUpdate("CANCELLED")}
                    className="p-4 rounded-2xl bg-red-50 text-red-700 font-bold flex items-center justify-center gap-2 border border-red-100 disabled:opacity-50"
                  >
                    <XCircle size={18} /> বাতিল করুন
                  </motion.button>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-2 text-slate-400 text-sm font-bold hover:text-slate-600 transition-colors"
                >
                  ফিরে যান
                </button>
              </div>

              {/* লোডিং ওভারলে */}
              {isLoading && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-t-[2.5rem] z-10 backdrop-blur-[1px]">
                  <Loader2
                    className="animate-spin text-emerald-600"
                    size={32}
                  />
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
