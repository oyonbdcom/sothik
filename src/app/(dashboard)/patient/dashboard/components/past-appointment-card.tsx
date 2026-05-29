/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { IAppointmentResponse } from "@/interface/appointment";
import { db } from "@/lib/firebase-app";
import { useRequestEmergencyMutation } from "@/redux/api/appointmentApi";
import { doc, onSnapshot } from "firebase/firestore";
import { Clock, Pause, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import MedicalRecordGrid from "./image-view";
import MedicalRecordsAddDialog from "./medical-records-add-dialog";

export const PastAppointmentCard = ({
  appointment,
}: {
  appointment: IAppointmentResponse & { doctorSession?: any };
}) => {
  const [showRecords, setShowRecords] = useState(false);
  const [liveSession, setLiveSession] = useState(appointment.doctorSession);
  const router = useRouter();
  const [requestEmergencyAppointment] = useRequestEmergencyMutation();

  useEffect(() => {
    const isToday =
      new Date(appointment.appointmentDate).toDateString() ===
      new Date().toDateString();

    if (isToday && appointment.status === "SCHEDULED") {
      const docId = `${appointment.doctorId}_${appointment.diagId}`;
      const unsub = onSnapshot(doc(db, "live_sessions", docId), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setLiveSession(data);
          if (data.runningSerial === appointment.serialNumber) {
            router.refresh();
          }
        }
      });
      return () => unsub();
    }
  }, [
    appointment.doctorId,
    appointment.diagId,
    appointment.appointmentDate,
    appointment.status,
    appointment.serialNumber,
    router,
  ]);

  const handleEmergencyRequest = async (appointmentId: string) => {
    try {
      await requestEmergencyAppointment(appointmentId).unwrap();
      toast.success("Emergency request sent");
    } catch (error: any) {
      toast.error(error?.message || "Request failed");
    }
  };

  const dateBn = appointment?.appointmentDate
    ? new Date(appointment.appointmentDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  const isToday =
    new Date(appointment.appointmentDate).toDateString() ===
    new Date().toDateString();
  const isEmergency = appointment?.isEmergency;

  // মূল অ্যাপয়েন্টমেন্ট স্ট্যাটাস স্টাইল
  const statusStyles: any = {
    COMPLETED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
    SCHEDULED: "bg-blue-100 text-blue-700 border-blue-200",
    CANCELLED: "bg-rose-100 text-rose-700 border-rose-200",
  };

  // ইমার্জেন্সি রিকোয়েস্ট স্ট্যাটাস স্টাইল
  const emergencyStatusStyles: any = {
    ACCEPT: "bg-green-600 text-white border-transparent",
    PENDING: "bg-orange-500 text-white border-transparent animate-pulse",
  };

  return (
    <div
      className={`relative overflow-hidden bg-white border-l-4 ${isEmergency ? "border-l-red-500" : "border-l-primary"} p-4 rounded-xl shadow-sm mb-3 transition-all hover:shadow-md`}
    >
      {/* ১. টপ সেকশন: ইউজার ও প্রধান স্ট্যাটাস */}
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
            <User className="text-slate-600 w-6 h-6" />
          </div>
          <div className="flex flex-col">
            {" "}
            {/* gap-1 কমিয়ে দিয়েছি */}
            <div className="flex items-center gap-2 leading-none mb-1">
              {" "}
              {/* leading-none গ্যাপ কমাবে */}
              <h3 className="text-sm font-bold text-slate-800">
                {appointment.patientName}
              </h3>
              {/* মেইন স্ট্যাটাস ব্যাজ */}
              <span
                className={`text-[10px] px-2 py-[1px] rounded-full font-bold border ${
                  statusStyles[appointment.status || ""] || "bg-slate-100"
                }`}
              >
                {appointment.status}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium leading-tight">
              {appointment.contactNumber} • {appointment?.age}y
            </p>
            <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 leading-tight">
              <Clock className="w-3 h-3" /> {dateBn}
            </p>
          </div>
        </div>

        {/* ইমার্জেন্সি ব্যাজ (যদি ইমার্জেন্সি রিকোয়েস্ট থাকে) */}
        {isEmergency && (
          <div className="flex flex-col items-end gap-1">
            {appointment?.status !== "COMPLETED" && (
              <span
                className={`text-[9px] px-2 py-1 rounded-md font-black tracking-tighter border ${emergencyStatusStyles[appointment?.emergency?.status || ""] || "bg-red-600 text-white"}`}
              >
                {appointment?.emergency?.status === "ACCEPT"
                  ? "জরুরি অনুমোদিত"
                  : "জরুরি যাচাই"}
              </span>
            )}
            <span className="text-[8px] text-red-500 font-bold animate-pulse">
              EMERGENCY
            </span>
          </div>
        )}
      </div>

      {/* ২. মিডল সেকশন: সিরিয়াল ট্র্যাকিং ও ইনফো */}
      <div
        className={`mt-4 rounded-lg p-3 border transition-all ${
          isEmergency
            ? "bg-red-50/50 border-red-100"
            : "bg-slate-50 border-slate-100"
        }`}
      >
        <div className="flex justify-between items-center gap-3">
          <div className="flex-1">
            {/* সিরিয়াল এবং পেমেন্ট ইনফো */}
            <div className="flex items-center gap-4">
              {/* ১. পেমেন্ট ও ট্রানজেকশন */}
              <div>
                <p className="text-[9px] text-slate-400 uppercase font-black leading-none mb-1">
                  পেমেন্ট
                </p>
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${appointment?.paymentStatus === "PAID" ? "bg-emerald-500" : "bg-amber-500"}`}
                  />
                  <p
                    className={`text-[10px] font-black leading-none ${appointment?.paymentStatus === "PAID" ? "text-emerald-700" : "text-amber-700"}`}
                  >
                    {appointment?.paymentStatus === "PAID" ? "PAID" : "PENDING"}
                  </p>
                </div>
                {appointment?.transactionId && (
                  <p className="text-[8px] font-mono text-slate-400 mt-1 uppercase">
                    TXID: {appointment.transactionId}
                  </p>
                )}
              </div>

              {/* ২. আপনার সিরিয়াল */}
              {appointment.status === "SCHEDULED" &&
                appointment.serialNumber > 0 && (
                  <div className="border-l pl-4 border-slate-200">
                    <p className="text-[9px] text-slate-400 uppercase font-bold leading-none mb-1">
                      আমার সিরিয়াল
                    </p>
                    <p className="text-base font-black text-slate-900 leading-none">
                      #{appointment.serialNumber?.toString().padStart(2, "0")}
                    </p>
                  </div>
                )}

              {/* ৩. লাইভ সেশন স্ট্যাটাস (স্মার্ট ফিক্স) */}
              {appointment.status === "SCHEDULED" && liveSession?.status && (
                <div className="border-l pl-4 border-slate-200">
                  {liveSession.status === "ACTIVE" && (
                    <>
                      <p className="text-[9px] text-emerald-600 uppercase font-bold flex items-center gap-1 leading-none mb-1">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        চলছে
                      </p>
                      <p className="text-base font-black text-emerald-700 leading-none">
                        #
                        {liveSession.runningSerial
                          ?.toString()
                          .padStart(2, "0") || "---"}
                      </p>
                    </>
                  )}

                  {liveSession.status === "PAUSED" && (
                    <>
                      <p className="text-[9px] text-amber-600 uppercase font-bold flex items-center gap-1 leading-none mb-1">
                        <Pause size={10} fill="currentColor" /> বিরতি
                      </p>
                      <p className="text-[10px] font-black text-amber-700 leading-tight">
                        সাময়িক বন্ধ
                      </p>
                    </>
                  )}

                  {(liveSession.status === "ABSENT" ||
                    liveSession.status === "ENDED") && (
                    <>
                      <p className="text-[9px] text-rose-600 uppercase font-bold leading-none mb-1">
                        {liveSession.status === "ABSENT"
                          ? "অনুপস্থিত"
                          : "সেশন শেষ"}
                      </p>
                      <p className="text-[10px] font-black text-rose-700 leading-tight">
                        {liveSession.status === "ABSENT"
                          ? "ডক্টর নেই"
                          : "আজকের মতো শেষ"}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ডক্টর ইনফো - কম্প্যাক্ট রাইট সাইড */}
          <div className="text-right border-l pl-3 border-slate-200 min-w-[100px]">
            <h4 className="text-[11px] font-black text-slate-800 leading-tight truncate">
              ডাঃ {appointment?.doctor?.user?.name}
            </h4>
            <p className="text-[9px] text-slate-500 leading-tight mt-0.5">
              {appointment?.doctor?.department?.name}
            </p>
            <p className="text-[9px] font-bold text-blue-600 uppercase mt-1 tracking-tighter">
              {appointment?.diagnostic?.user?.name}
            </p>
          </div>
        </div>
      </div>

      {/* ৩. বটম সেকশন: অ্যাকশন বাটনসমূহ */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-2">
          {appointment?.status === "COMPLETED" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRecords(!showRecords)}
                className="  text-[10px] font-bold"
              >
                মেডিকেল রেকর্ড
              </Button>
              <MedicalRecordsAddDialog appointmentId={appointment.id} />
            </>
          )}
        </div>

        {!appointment?.isEmergency && (
          <div>
            {/* ইমার্জেন্সি রিকোয়েস্ট বাটন */}
            {/* ১. কন্ডিশনাল রেন্ডারিং: জরুরি রিকোয়েস্ট বাটন */}
            {appointment.status === "SCHEDULED" &&
              !appointment?.emergency?.status &&
              isToday && (
                <Button
                  color="destructive"
                  size="sm"
                  className="h-8 text-[10px] font-bold animate-bounce shadow-lg shadow-red-200"
                  onClick={() => handleEmergencyRequest(appointment.id)}
                >
                  জরুরি রিকোয়েস্ট দিন
                </Button>
              )}

            {/* ২. যদি রিজেক্টেড হয় তবে মেসেজ দেখানো */}
            {/* ১. রিকোয়েস্ট একসেপ্ট হলে এই মেসেজটি দেখাবে */}
            {appointment?.status !== "COMPLETED" &&
              appointment?.emergency?.status === "ACCEPT" && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2 flex items-center gap-2">
                  <div className="h-2 w-2 bg-emerald-500 rounded-full shrink-0 animate-pulse" />
                  <div className="flex-1">
                    <p className="text-[10px] text-emerald-700 font-bold leading-tight">
                      আপনার জরুরি রিকোয়েস্টটি গ্রহণ করা হয়েছে।
                    </p>
                    <p className="text-[9px] text-emerald-600 font-medium leading-tight mt-0.5">
                      দয়া করে দ্রুত সিরিয়াল কাউন্টারে যোগাযোগ করুন, আপনাকে
                      অগ্রাধিকার দেওয়া হচ্ছে।
                    </p>
                  </div>
                </div>
              )}
            {/* ৩. রিকোয়েস্ট পেন্ডিং থাকলে এই মেসেজটি দেখাবে */}
            {appointment?.status !== "COMPLETED" &&
              appointment?.emergency?.status === "PENDING" && (
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-2 flex items-center gap-2 shadow-sm animate-in fade-in duration-500">
                  <div className="h-2 w-2 bg-amber-500 rounded-full shrink-0 animate-bounce" />
                  <div className="flex-1">
                    <p className="text-[10px] text-amber-700 font-bold leading-tight">
                      জরুরি রিকোয়েস্ট পাঠানো হয়েছে।
                    </p>
                    <p className="text-[9px] text-amber-600 font-medium leading-tight mt-0.5">
                      কর্তৃপক্ষ আপনার রিকোয়েস্টটি যাচাই করছে। অনুগ্রহ করে
                      কিছুক্ষণ অপেক্ষা করুন।
                    </p>
                  </div>
                </div>
              )}
            {appointment?.status !== "COMPLETED" &&
              appointment?.emergency?.status === "REJECTED" && (
                <div className="bg-rose-50 border border-rose-100 rounded-lg p-2 flex items-center gap-2">
                  <div className="h-2 w-2 bg-rose-500 rounded-full shrink-0" />
                  <p className="text-[10px] text-rose-600 font-medium leading-tight">
                    আপনার জরুরি রিকোয়েস্টটি কর্তৃপক্ষ বাতিল করেছে। বিস্তারিত
                    জানতে ডায়াগনস্টিক ডেস্কে যোগাযোগ করুন।
                  </p>
                </div>
              )}
          </div>
        )}
        {/* ২. রিকোয়েস্ট রিজেক্ট হলে এই মেসেজটি দেখাবে (আপনার আগের কোড) */}
      </div>

      {/* ৪. মেডিকেল রেকর্ডস গ্রিড */}
      {showRecords && (
        <div className="mt-4 pt-4 border-t border-dashed border-slate-200">
          <MedicalRecordGrid
            appointment={appointment}
            showRecords={showRecords}
          />
        </div>
      )}
    </div>
  );
};
