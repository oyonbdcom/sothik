/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useAcceptEmergencyMutation,
  useCompleteAppointmentMutation,
} from "@/redux/api/appointmentApi";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  MoreVertical,
  ShieldCheck,
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

  const [completeAppointment, { isLoading }] = useCompleteAppointmentMutation();

  const [acceptEmergency, { isLoading: acceptLoading }] =
    useAcceptEmergencyMutation();

  const handleUpdate = async (status: string) => {
    try {
      await completeAppointment(appointment.id).unwrap();

      toast.success(`স্ট্যাটাস আপডেট: ${status}`);
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "আপডেট করা যায়নি");
    }
  };

  const handleAcceptEmergency = async () => {
    try {
      await acceptEmergency(appointment.id).unwrap();

      toast.success("এমার্জেন্সি অ্যাপয়েন্টমেন্ট গ্রহণ করা হয়েছে");
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Accept করা যায়নি");
    }
  };

  return (
    <>
      {/* trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-slate-100 rounded-full"
      >
        <MoreVertical size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[999] flex items-end justify-center">
            {/* backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40"
            />

            {/* drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="relative w-full max-w-md bg-white rounded-t-3xl p-6 pb-8 shadow-2xl"
            >
              {/* handle */}
              <div
                onClick={() => setIsOpen(false)}
                className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-5 cursor-pointer"
              />

              {/* header */}
              <div className="text-center mb-6">
                <h2 className="text-lg font-bold">Appointment Management</h2>
                <p className="text-xs text-slate-500">
                  #{appointment.code} • {appointment.patientName}
                </p>
              </div>

              {/* EMERGENCY BUTTON */}
              {appointment?.isEmergency && (
                <button
                  onClick={handleAcceptEmergency}
                  disabled={acceptLoading}
                  className="w-full mb-4 p-4 rounded-2xl bg-red-600 text-white font-bold flex items-center justify-center gap-2 shadow-md hover:bg-red-700"
                >
                  {acceptLoading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <ShieldCheck size={18} />
                  )}
                  Emergency Accept
                </button>
              )}

              {/* NORMAL ACTIONS */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleUpdate("COMPLETED")}
                    disabled={isLoading}
                    className="p-3 rounded-2xl bg-blue-50 text-blue-700 font-semibold flex items-center justify-center gap-2 border"
                  >
                    <CheckCircle2 size={18} />
                    Complete
                  </button>

                  <button
                    onClick={() => handleUpdate("CANCELLED")}
                    disabled={isLoading}
                    className="p-3 rounded-2xl bg-red-50 text-red-700 font-semibold flex items-center justify-center gap-2 border"
                  >
                    <XCircle size={18} />
                    Cancel
                  </button>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full text-sm text-slate-400 mt-2"
                >
                  Close
                </button>
              </div>

              {/* loading overlay */}
              {(isLoading || acceptLoading) && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-t-3xl">
                  <Loader2 className="animate-spin text-emerald-600" />
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
