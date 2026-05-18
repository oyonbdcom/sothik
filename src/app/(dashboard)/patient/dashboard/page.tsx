/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import DefaultPasswordAlert from "@/components/default-password-alart";
import { IAppointmentResponse } from "@/interface/appointment";
import { registerNotification } from "@/lib/registernotification";
import { useGetPatientAppointmentsQuery } from "@/redux/api/appointmentApi";
import { CalendarX, Loader2 } from "lucide-react";
import { useEffect, useState } from "react"; // useEffect যোগ করা হয়েছে
import { PastAppointmentCard } from "./components/past-appointment-card";

export default function MembershipDoctors() {
  // ১. স্টেট ডিফাইন করা
  const [page] = useState(1);
  const [searchTerm] = useState("");
  const [status] = useState("all");
  const [date] = useState("");

  // 💡 নোটিফিকেশন পারমিশন চাওয়ার ফাংশন
  useEffect(() => {
    const requestNotificationPermission = async () => {
      await registerNotification();
    };

    requestNotificationPermission();
  }, []);

  const query: Record<string, any> = {
    page,
    limit: 10,
    ...(searchTerm && { searchTerm }),
    ...(status !== "all" && { status }),
    ...(date !== "" && { date }),
  };

  const { data, isLoading, isError } = useGetPatientAppointmentsQuery(query);

  if (isLoading) {
    return (
      <div className="flex h-60 flex-col items-center justify-center gap-2">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
        <p className="text-sm font-medium text-slate-500">
          অ্যাপয়েন্টমেন্ট লোড হচ্ছে...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-center text-red-600">
        অ্যাপয়েন্টমেন্ট লোড করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।
      </div>
    );
  }

  const appointments = data?.data || [];

  return (
    <div className="space-y-6 p-4">
      <DefaultPasswordAlert />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">
          আমার অ্যাপয়েন্টমেন্ট সমূহ
        </h2>
      </div>

      {appointments && appointments.length > 0 ? (
        <div className="grid gap-4">
          {appointments.map((item: IAppointmentResponse) => (
            <PastAppointmentCard key={item.id} appointment={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-16 text-center">
          <div className="mb-4 rounded-full bg-white p-4 shadow-sm">
            <CalendarX className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-base font-bold text-slate-700">
            কোনো অ্যাপয়েন্টমেন্ট পাওয়া যায়নি
          </h3>
          <p className="text-sm text-slate-500">
            আপনার বর্তমানে কোনো বুকিং রেকর্ড নেই।
          </p>
        </div>
      )}
    </div>
  );
}
