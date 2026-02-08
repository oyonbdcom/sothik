/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { formatTime } from "@/lib/utils/utils";
import {
  Calendar,
  Clock,
  Edit3,
  Inbox,
  Phone,
  Stethoscope,
  Tag,
} from "lucide-react";
import Image from "next/image";
import StatusBadge from "./statusBadge";

interface IAppointmentListProps {
  appointments: any[];
  setSelectedAppointment: (apt: any) => void;
}

export default function AppointmentList({
  appointments,
  setSelectedAppointment,
}: IAppointmentListProps) {
  // অ্যাপয়েন্টমেন্ট না থাকলে খালি স্টেট দেখানো
  if (!appointments || appointments.length === 0) {
    return (
      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-20 flex flex-col items-center justify-center text-slate-400">
        <Inbox size={48} className="mb-4 opacity-20" />
        <p className="font-bold text-lg">কোন অ্যাপয়েন্টমেন্ট পাওয়া যায়নি</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="  w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="px-6 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">
                সিরিয়াল ও রোগী
              </th>
              <th className="px-6 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">
                তারিখ ও সময়
              </th>
              <th className="px-6 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">
                চিকিৎসক
              </th>
              <th className="px-6 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">
                ডিসকাউন্ট কোড
              </th>
              <th className="px-6 py-5 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">
                স্ট্যাটাস
              </th>
              <th className="px-6 py-5 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">
                অ্যাকশন
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {appointments.map((apt: any) => (
              <tr
                key={apt.id}
                className="hover:bg-indigo-50/30 transition-colors group"
              >
                {/* সিরিয়াল ও রোগী */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center justify-center h-12 w-12 shrink-0 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-100">
                      <span className="text-[10px] font-black leading-none uppercase">
                        SL
                      </span>
                      <span className="text-lg font-black">
                        {apt.serialNumber || "0"}
                      </span>
                    </div>
                    <div>
                      <p className="font-black text-slate-800 text-sm leading-tight">
                        {apt.patientName}
                      </p>
                      <p className="text-xs text-slate-400 font-bold mt-1 flex items-center gap-1">
                        <Phone size={10} /> {apt.phoneNumber}
                      </p>
                    </div>
                  </div>
                </td>

                {/* তারিখ ও সময় */}
                <td className="px-6 py-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-700 text-sm font-bold">
                      <Calendar size={14} className="text-indigo-500" />
                      {apt.appointmentDate
                        ? new Date(apt.appointmentDate).toLocaleDateString(
                            "bn-BD",
                          )
                        : "--"}
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                      <Clock size={14} className="text-orange-400" />
                      {formatTime(apt?.times)}
                    </div>
                  </div>
                </td>

                {/* চিকিৎসক */}
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    {/* ইমেজ কন্টেইনার - সাইজ ফিক্সড করা হয়েছে (60x60px) */}
                    <div className="h-10 w-10 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-white ring-2 ring-slate-50 overflow-hidden relative">
                      {apt.doctor?.image ? (
                        <Image
                          src={apt.doctor.image}
                          alt={apt.doctor.name || "doctor"}
                          fill
                          className="object-cover" // ইমেজ রেশিও ঠিক রাখবে
                          sizes="40px"
                          priority={false}
                        />
                      ) : (
                        <Stethoscope size={24} /> // ইমেজ না থাকলে আইকনটিও একটু বড় দেখানো ভালো
                      )}
                    </div>

                    {/* টেক্সট সেকশন */}
                    <div className="flex flex-col min-w-0">
                      {" "}
                      {/* min-w-0 র‍্যাপ হতে সাহায্য করে */}
                      <p className="text-sm font-black text-slate-700 leading-tight whitespace-nowrap break-words max-w-[150px]">
                        {apt.doctor?.name || "অজানা চিকিৎসক"}
                      </p>
                      <p className="text-[11px] text-slate-400 font-bold uppercase mt-1 whitespace-normal break-words max-w-[150px]">
                        {apt.doctor?.department || "এমবিবিএস"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* ডিসকাউন্ট কোড */}
                <td className="px-6 py-5">
                  {apt.code ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 text-[10px] font-black uppercase tracking-tighter">
                      <Tag size={10} /> {apt.code}
                    </span>
                  ) : (
                    <span className="text-slate-300 text-[10px] italic">
                      N/A
                    </span>
                  )}
                </td>

                {/* স্ট্যাটাস */}
                <td className="px-6 py-5">
                  <StatusBadge status={apt?.status || "SCHEDULED"} />
                </td>

                {/* অ্যাকশন */}
                <td className="px-6 py-5 text-center">
                  <button
                    onClick={() => setSelectedAppointment(apt)}
                    className="inline-flex items-center justify-center h-10 w-10 bg-white text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl border border-slate-100 transition-all active:scale-90"
                  >
                    <Edit3 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
