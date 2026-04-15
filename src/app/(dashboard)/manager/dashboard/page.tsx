/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import AppPagination from "@/components/app-pagination";
import { useDebounce } from "@/hooks/useDebaunce";
import { useGetManagerAreaAppointmentsQuery } from "@/redux/api/appointmentApi";
import { useGetAllClinicsForManagerQuery } from "@/redux/api/clinicApi";
import { useGetAllDoctorForManagerQuery } from "@/redux/api/doctorApi";
import { format } from "date-fns";
import {
  Calendar,
  ClipboardList,
  Clock,
  Loader2,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { useState } from "react";
import UpdateStatusDrawer from "./drawer";

export default function ManagerAppointmentsPage() {
  // States
  const [clinicId, setClinicId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const size = 10;

  // Debounce for search
  const debouncedTerm = useDebounce({ searchQuery: searchTerm, delay: 600 });

  // API Query
  const query: Record<string, any> = {
    page,
    limit: size,
  };

  if (debouncedTerm?.searchQuery)
    query["searchTerm"] = debouncedTerm.searchQuery;
  if (status) query["status"] = status;
  if (doctorId) query["doctorId"] = doctorId;
  if (clinicId) query["clinicId"] = clinicId;

  const { data, isLoading, isFetching } = useGetManagerAreaAppointmentsQuery({
    ...query,
  });
  const { data: allClinics, isLoading: allClinicLoading } =
    useGetAllClinicsForManagerQuery();
  const { data: allDoctors, isLoading: allDoctorLoading } =
    useGetAllDoctorForManagerQuery();
  const appointments = data?.data || [];
  const meta = data?.meta;

  if (isLoading || allClinicLoading || allDoctorLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={40} />
      </div>
    );
  }

  return (
    <div className=" bg-white  space-y-6  p-6 rounded-md min-h-screen">
      {/* Header & Stats Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            এরিয়া অ্যাপয়েন্টমেন্ট সমূহ
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            আপনার এরিয়ার সকল ক্লিনিক ও ডাক্তারদের বুকিং ম্যানেজ করুন
          </p>
        </div>
      </div>

      {/* Filters Section */}

      <div className="flex items-center gap-3 w-full md:w-auto">
        <select
          className="px-3 py-2 rounded-xl border text-xs"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">সব স্ট্যাটাস</option>
          <option value="PENDING">Pending</option>
          <option value="SCHEDULED">Scheduled</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <select
          value={clinicId}
          onChange={(e) => setClinicId(e.target.value)}
          className="px-3 py-2 rounded-xl border text-xs"
        >
          <option value="">সব ক্লিনিক</option>
          {allClinics?.clinics?.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {/* doctor filter */}
        <select
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          className="px-3 py-2 rounded-xl border text-xs"
        >
          <option value="">সব ডাক্তার</option>
          {allDoctors?.doctors?.map((d: any) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Appointments List */}
      <div
        className={`space-y-4 transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}
      >
        {appointments.length > 0 ? (
          appointments.map((appt: any) => (
            <div
              key={appt.id}
              className="rounded-[2.5rem] border border-slate-100 p-6 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Status & Code */}
                <div className="flex lg:flex-col justify-between items-start gap-2 min-w-[120px]">
                  <span
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      appt.status === "COMPLETED"
                        ? "bg-emerald-100 text-emerald-600"
                        : appt.status === "PENDING"
                          ? "bg-amber-100 text-amber-600"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {appt.status}
                  </span>
                  <UpdateStatusDrawer appointment={appt} />
                  <div className="text-xs font-mono font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-lg">
                    #{appt.code}
                  </div>
                </div>

                {/* Patient Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                      <User size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-emerald-600 transition-colors">
                        {appt.patientName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                          <Phone size={14} className="text-emerald-500" />{" "}
                          {appt.phoneNumber}
                        </span>
                        <span className="text-xs font-bold text-slate-400 underline decoration-emerald-200">
                          বয়স: {appt.ptAge} বছর
                        </span>
                      </div>
                    </div>
                  </div>

                  {appt.address && (
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium ml-1">
                      <MapPin size={14} /> {appt.address}
                    </div>
                  )}
                </div>

                {/* Doctor & Clinic Info */}
                <div className="flex-1 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-8 pt-4 lg:pt-0 space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <p className="text-sm font-bold text-slate-700">
                        ডাঃ {appt.doctor?.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <ClipboardList size={14} className="text-slate-300" />
                      {appt.membership?.clinic?.name || "ক্লিনিক তথ্য নেই"}
                    </div>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="bg-slate-50 rounded-[2rem] p-4 flex lg:flex-col justify-between items-center lg:items-end gap-2 min-w-[160px]">
                  <div className="flex items-center gap-2 text-slate-700 font-black text-sm">
                    <Calendar size={16} className="text-emerald-500" />
                    {format(new Date(appt.appointmentDate), "dd MMM, yyyy")}
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-tighter">
                    <Clock size={14} />
                    {appt.times || "সময় নির্ধারিত নেই"}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-100">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClipboardList size={40} className="text-slate-200" />
            </div>
            <h3 className="text-lg font-bold text-slate-400">
              কোনো অ্যাপয়েন্টমেন্ট পাওয়া যায়নি
            </h3>
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta && meta.totalPage > 1 && (
        <AppPagination meta={meta} onPageChange={(p) => setPage(p)} />
      )}
    </div>
  );
}
