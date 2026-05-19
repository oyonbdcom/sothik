/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { IAppointmentResponse } from "@/interface/appointment";
import { db } from "@/lib/firebase-app";
import { useRequestEmergencyMutation } from "@/redux/api/appointmentApi";
import { doc, onSnapshot } from "firebase/firestore";
import { Activity, Clock, User } from "lucide-react";
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
      const docId = `${appointment.doctorId}_${appointment.clinicId}`;
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
    appointment.clinicId,
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
              {appointment.phoneNumber} • {appointment?.age}y
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
        className={`mt-4 rounded-lg p-3 ${isEmergency ? "bg-red-50/50 border border-red-100" : "bg-slate-50 border border-slate-100"}`}
      >
        <div className={`flex justify-between items-center gap-3`}>
          {" "}
          {/* gap-4 এর জায়গায় gap-3 */}
          <div className="flex-1">
            {isEmergency ? (
              <div className="flex gap-4">
                {" "}
                {/* Grid সরিয়ে Flex ব্যবহার করেছি যাতে গ্যাপ কমানো যায় */}
                <div>
                  <p className="text-[9px] text-slate-400 uppercase font-bold leading-none mb-0.5">
                    পেমেন্ট
                  </p>
                  <p
                    className={`text-[11px] font-bold leading-none ${appointment?.emergency?.paymentStatus === "PAID" ? "text-emerald-600" : "text-amber-600"}`}
                  >
                    {appointment?.emergency?.paymentStatus === "PAID"
                      ? "Paid"
                      : "Pending"}
                  </p>
                </div>
                {appointment?.emergency?.transactionId && (
                  <div className="border-l pl-3 border-slate-100">
                    <p className="text-[9px] text-slate-400 uppercase font-bold leading-none mb-0.5">
                      TrxID
                    </p>
                    <p className="text-[11px] font-mono text-slate-600 leading-none">
                      {appointment.emergency.transactionId}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // নরমাল সিরিয়াল ট্র্যাকিং
              appointment.status === "SCHEDULED" && (
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-[9px] text-slate-400 uppercase font-bold leading-none mb-1">
                      আমার সিরিয়াল
                    </p>
                    <p className="text-base font-black text-primary leading-none">
                      {appointment.serialNumber}
                    </p>
                  </div>
                  {liveSession?.status && (
                    <div className="border-l pl-4 border-slate-200">
                      {/* ১. সেশন একটিভ থাকলে (চলমান সিরিয়াল) */}
                      {liveSession.status === "ACTIVE" && (
                        <>
                          <p className="text-[9px] text-emerald-600 uppercase font-bold flex items-center gap-1 leading-none mb-1">
                            <Activity className="w-2.5 h-2.5" /> চলছে
                          </p>
                          <p className="text-base font-black text-emerald-700 leading-none">
                            {liveSession.runningSerial || "---"}
                          </p>
                        </>
                      )}

                      {/* ২. ডক্টর বিরতিতে থাকলে (PAUSED) */}
                      {liveSession.status === "PAUSED" && (
                        <>
                          <p className="text-[9px] text-amber-600 uppercase font-bold flex items-center gap-1 leading-none mb-1">
                            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />{" "}
                            বিরতি
                          </p>
                          <p className="text-[10px] font-bold text-amber-700 leading-tight">
                            সাময়িক বন্ধ
                          </p>
                        </>
                      )}

                      {/* ৩. ডক্টর অনুপস্থিত থাকলে (ABSENT) */}
                      {liveSession.status === "ABSENT" && (
                        <>
                          <p className="text-[9px] text-rose-600 uppercase font-bold flex items-center gap-1 leading-none mb-1">
                            <span className="w-2 h-2 bg-rose-500 rounded-full" />{" "}
                            অনুপস্থিত
                          </p>
                          <p className="text-[10px] font-bold text-rose-700 leading-tight">
                            ডক্টর নেই
                          </p>
                        </>
                      )}

                      {/* ৪. সেশন শেষ হয়ে গেলে (ENDED) */}
                      {liveSession.status === "ENDED" && (
                        <>
                          <p className="text-[9px] text-slate-500 uppercase font-bold flex items-center gap-1 leading-none mb-1">
                            বন্ধ
                          </p>
                          <p className="text-[10px] font-bold text-slate-600 leading-tight">
                            সেশন শেষ
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
          {/* ডক্টর ইনফো - প্যাডিং এবং মার্জিন কমিয়ে কম্প্যাক্ট করা হয়েছে */}
          <div className="text-right border-l pl-3 border-slate-200 flex flex-col gap-0.5">
            <h4 className="text-[11px] font-bold text-slate-800 leading-tight">
              ডাঃ {appointment?.doctor?.user?.name}
            </h4>
            <p className="text-[9px] text-slate-500 leading-tight">
              {appointment?.doctor?.department?.name}
            </p>
            <p className="text-[9px] font-medium text-primary leading-tight">
              {appointment?.clinic?.user?.name}
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

        {/* ইমার্জেন্সি রিকোয়েস্ট বাটন */}
        {/* ১. কন্ডিশনাল রেন্ডারিং: জরুরি রিকোয়েস্ট বাটন */}
        {appointment.status === "SCHEDULED" &&
          !appointment?.emergency &&
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
        {appointment?.status !== "COMPLETED" &&
          appointment?.emergency?.status === "REJECTED" && (
            <div className="bg-rose-50 border border-rose-100 rounded-lg p-2 flex items-center gap-2">
              <div className="h-2 w-2 bg-rose-500 rounded-full shrink-0" />
              <p className="text-[10px] text-rose-600 font-medium leading-tight">
                আপনার জরুরি রিকোয়েস্টটি কর্তৃপক্ষ বাতিল করেছে। বিস্তারিত জানতে
                ডায়াগনস্টিক ডেস্কে যোগাযোগ করুন।
              </p>
            </div>
          )}
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
